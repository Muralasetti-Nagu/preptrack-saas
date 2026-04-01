import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { fetchAPI } from "../services/api";
import { Badge } from "../components/ui/Badge";

export const Dashboard = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await fetchAPI("/problems");
        setProblems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const total = problems.length;
  const easy = problems.filter((p) => p.difficulty === "Easy").length;
  const medium = problems.filter((p) => p.difficulty === "Medium").length;
  const hard = problems.filter((p) => p.difficulty === "Hard").length;
  
  const recentProblems = [...problems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-textMain">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-textDim mt-1">Here&apos;s a quick overview of your preparation.</p>
        </div>

        {loading ? (
          <div className="text-textDim">Loading stats...</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-textMain">{total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-easy">Easy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-textMain">{easy}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-medium">Medium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-textMain">{medium}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-hard">Hard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-textMain">{hard}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProblems.length === 0 ? (
                    <div className="text-textDim text-sm">No problems tracked yet.</div>
                  ) : (
                    recentProblems.map((problem) => (
                      <div key={problem._id} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-border/50">
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium text-textMain">{problem.title}</span>
                          <span className="text-sm text-textDim">{problem.platform} • {problem.topic}</span>
                        </div>
                        <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
