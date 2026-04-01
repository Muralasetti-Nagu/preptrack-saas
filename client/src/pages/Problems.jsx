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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-textMain">Problems List</h2>
          <p className="text-textDim mt-1">Easily search through your tracked problems.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <CardTitle>All Problems</CardTitle>
              <div className="flex gap-2">
                <select
                  className="h-9 w-32 rounded-md border border-border bg-surface px-3 py-1 text-sm text-textMain focus:outline-none"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="All">All Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select
                  className="h-9 w-32 rounded-md border border-border bg-surface px-3 py-1 text-sm text-textMain focus:outline-none"
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                >
                  {platforms.map(plat => <option key={plat} value={plat}>{plat === "All" ? "All Platforms" : plat}</option>)}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-textDim">Loading problems...</div>
            ) : filteredProblems.length === 0 ? (
              <div className="py-8 text-center text-textDim">No problems match your filters.</div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b border-border text-textDim text-left">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 align-middle font-medium">Title</th>
                      <th className="h-12 px-4 align-middle font-medium hidden sm:table-cell">Platform</th>
                      <th className="h-12 px-4 align-middle font-medium">Difficulty</th>
                      <th className="h-12 px-4 align-middle font-medium hidden lg:table-cell">Topic</th>
                      <th className="h-12 px-4 align-middle font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0 text-textMain">
                    {filteredProblems.map((problem) => (
                      <tr key={problem._id} className="border-b border-border transition-colors hover:bg-border/50">
                        <td className="p-4 align-middle font-medium">{problem.title}</td>
                        <td className="p-4 align-middle hidden sm:table-cell">{problem.platform}</td>
                        <td className="p-4 align-middle">
                          <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
                        </td>
                        <td className="p-4 align-middle hidden lg:table-cell">{problem.topic}</td>
                        <td className="p-4 align-middle text-right flex justify-end">
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleDelete(problem._id)}>
                            <Trash2 className="h-4 w-4 text-hard" />
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
