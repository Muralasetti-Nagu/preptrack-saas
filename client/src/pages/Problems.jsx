import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { fetchAPI } from "../services/api";
import { Badge } from "../components/ui/Badge";
import { Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";

export const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Problems List</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Easily search through your tracked problems.</p>
        </div>

        <Card>
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-xl px-6 py-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <CardTitle>All Problems</CardTitle>
              <div className="flex gap-3">
                <select
                  className="h-10 w-36 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="All">All Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select
                  className="h-10 w-36 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                >
                  {platforms.map(plat => <option key={plat} value={plat}>{plat === "All" ? "All Platforms" : plat}</option>)}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 flex justify-center text-slate-500 items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span>Loading problems...</span>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-medium bg-slate-50/30">No problems match your filters.</div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="h-12 px-6 py-3">Title</th>
                      <th className="h-12 px-6 py-3 hidden sm:table-cell">Platform</th>
                      <th className="h-12 px-6 py-3">Difficulty</th>
                      <th className="h-12 px-6 py-3 hidden lg:table-cell">Topic</th>
                      <th className="h-12 px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredProblems.map((problem) => (
                      <tr key={problem._id} className="transition-colors hover:bg-slate-50 group">
                        <td className="px-6 py-4 font-semibold text-slate-900">{problem.title}</td>
                        <td className="px-6 py-4 text-slate-600 hidden sm:table-cell font-medium">{problem.platform}</td>
                        <td className="px-6 py-4">
                          <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600 hidden lg:table-cell font-medium">{problem.topic}</td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
