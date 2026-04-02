import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { fetchAPI } from "../services/api";
import { Badge } from "../components/ui/Badge";
import { Trash2, ListFilter } from "lucide-react";
import { Button } from "../components/ui/Button";

export const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI("/problems");
      setProblems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetchAPI(`/problems/${id}`, { method: "DELETE" });
      setProblems(problems.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert(`API Error: ${err.message}`);
    }
  };

  const filteredProblems = problems.filter((p) => {
    if (difficultyFilter !== "All" && p.difficulty !== difficultyFilter) return false;
    if (platformFilter !== "All" && p.platform !== platformFilter) return false;
    return true;
  });

  const platforms = ["All", ...new Set(problems.map((p) => p.platform))];

  return (
    <DashboardLayout>
      <style>{`
        .problems-card {
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.7);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
          overflow: hidden;
          animation: problemsFadeUp 0.5s ease-out both;
        }
        .problems-filter {
          height: 36px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          outline: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .problems-filter:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        @keyframes problemsFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .problems-gradient-text {
          background: linear-gradient(135deg, #0f172a 0%, #475569 50%, #0f172a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="space-y-6">
        {/* Header */}
        <div style={{ animation: 'problemsFadeUp 0.3s ease-out both' }}>
          <h2 className="text-3xl font-extrabold tracking-tight problems-gradient-text">Problems List</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">All your tracked problems in one place.</p>
        </div>

        {/* Card */}
        <div className="problems-card">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-5 border-b border-slate-100/80">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ListFilter className="h-4 w-4 text-slate-400" />
              <span>{filteredProblems.length} problem{filteredProblems.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-2">
              <select
                className="problems-filter"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="All">All Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                className="problems-filter"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
              >
                {platforms.map(plat => <option key={plat} value={plat}>{plat === "All" ? "All Platforms" : plat}</option>)}
              </select>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="py-16 flex justify-center text-slate-400 items-center gap-2.5">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <span className="font-medium animate-pulse">Loading problems...</span>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-slate-400 font-medium text-sm">No problems match your filters.</p>
              <p className="text-slate-300 text-xs">Try changing your filter criteria</p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 text-slate-400 border-b border-slate-100 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="h-11 px-5 py-3">#</th>
                    <th className="h-11 px-5 py-3">Title</th>
                    <th className="h-11 px-5 py-3 hidden sm:table-cell">Platform</th>
                    <th className="h-11 px-5 py-3">Difficulty</th>
                    <th className="h-11 px-5 py-3 hidden lg:table-cell">Topic</th>
                    <th className="h-11 px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProblems.map((problem, index) => (
                    <tr key={problem._id} className="transition-colors hover:bg-slate-50/60 group">
                      <td className="px-5 py-3.5 text-slate-300 font-medium text-xs">{index + 1}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{problem.title}</td>
                      <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell font-medium">{problem.platform}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell font-medium">{problem.topic}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="opacity-50 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 transition-all"
                          onClick={() => handleDelete(problem._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
