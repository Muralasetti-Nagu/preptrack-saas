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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Here&apos;s a quick overview of your preparation.</p>
        </div>

        {loading ? (
          <div className="text-slate-500 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Loading stats...
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-500">Total Solved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-emerald-600">Easy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{easy}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-amber-600">Medium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{medium}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-rose-600">Hard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{hard}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-xl px-6 py-5">
                <CardTitle>Recent Problems</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {recentProblems.length === 0 ? (
                    <div className="p-6 text-slate-500 text-sm text-center">No problems tracked yet.</div>
                  ) : (
                    recentProblems.map((problem) => (
                      <div key={problem._id} className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50">
                        <div className="flex flex-col space-y-1">
                          <span className="font-semibold text-slate-900">{problem.title}</span>
                          <span className="text-sm text-slate-500 font-medium">{problem.platform} • {problem.topic}</span>
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
