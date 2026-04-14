import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { fetchAPI } from "../services/api";
import { Badge } from "../components/ui/Badge";
import {
  BarChart, Bar, ResponsiveContainer, Tooltip
} from "recharts";
import {
  Trophy, CheckCircle2, Flame, TrendingUp, ArrowRight,
  PlusCircle, Clock, BarChart2
} from "lucide-react";

// ─── Reusable Stat Card ────────────────────────────────────────────────────────
const StatCard = ({ label, value, subtitle, icon: Icon, iconBg, iconColor, accent, delay = 0 }) => (
  <div
    className="dash-stat-card group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className={`p-2.5 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
    </div>
    <div className="mt-4 flex items-baseline gap-2">
      <span className={`text-3xl font-extrabold tracking-tight ${accent || "text-slate-900"}`}>{value}</span>
      {subtitle && <span className="text-xs font-medium text-slate-400">{subtitle}</span>}
    </div>
  </div>
);

// ─── Mini Sparkline Tooltip ────────────────────────────────────────────────────
const SparkTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dash-tooltip">
        <p className="text-xs font-semibold text-slate-800">{payload[0].payload.dateStr}</p>
        <p className="text-xs text-slate-500">
          <span className="font-bold text-blue-600">{payload[0].value}</span> solved
        </p>
      </div>
    );
  }
  return null;
};

// ─── Time Ago Helper ───────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── Main Dashboard Component ──────────────────────────────────────────────────
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

  const stats = useMemo(() => {
    const total = problems.length;
    const easy = problems.filter((p) => p.difficulty === "Easy").length;
    const medium = problems.filter((p) => p.difficulty === "Medium").length;
    const hard = problems.filter((p) => p.difficulty === "Hard").length;

    // Streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const solvedDates = new Set(problems.map(p => {
      const d = new Date(p.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (solvedDates.has(checkDate.getTime())) { streak++; }
      else if (i === 0) { continue; }
      else { break; }
    }

    // 7-day sparkline data
    const sparkData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      sparkData.push({
        dateStr: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        count: 0,
        fullDate: d.getTime(),
      });
    }
    problems.forEach((p) => {
      const pDate = new Date(p.createdAt);
      pDate.setHours(0, 0, 0, 0);
      const dayData = sparkData.find(d => d.fullDate === pDate.getTime());
      if (dayData) dayData.count += 1;
    });

    const recentProblems = [...problems]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return { total, easy, medium, hard, streak, sparkData, recentProblems };
  }, [problems]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <DashboardLayout>
      {/* Scoped Styles */}
      <style>{`
        .dash-stat-card {
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.7);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: dashFadeUp 0.5s ease-out both;
        }
        .dash-stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .dash-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.08);
          border-color: rgba(203, 213, 225, 0.9);
        }

        .dash-card {
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.7);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
          animation: dashFadeUp 0.6s ease-out both;
        }

        .dash-tooltip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.6);
          box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.08);
          padding: 8px 12px;
        }

        .dash-gradient-text {
          background: linear-gradient(135deg, #0f172a 0%, #475569 50%, #0f172a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dash-problem-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
        }
        .dash-problem-row:last-child {
          border-bottom: none;
        }
        .dash-problem-row:hover {
          background: rgba(248, 250, 252, 0.8);
        }

        .dash-quick-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(226, 232, 240, 0.7);
          background: rgba(255, 255, 255, 0.5);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: inherit;
        }
        .dash-quick-action:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(203, 213, 225, 0.9);
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }

        @keyframes dashFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .recharts-default-tooltip { display: none !important; }
      `}</style>

      <div className="space-y-8 pb-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ animation: 'dashFadeUp 0.3s ease-out both' }}>
          <h2 className="text-3xl font-extrabold tracking-tight dash-gradient-text">
            {greeting()}, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Here&apos;s a quick overview of your preparation journey.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 gap-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <span className="font-medium text-slate-400 animate-pulse">Loading your stats...</span>
          </div>
        ) : (
          <>
            {/* ── Stat Cards ─────────────────────────────────────────────── */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Solved"
                value={stats.total}
                subtitle="problems"
                icon={Trophy}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                delay={0}
              />
              <StatCard
                label="Easy"
                value={stats.easy}
                icon={CheckCircle2}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                accent="text-emerald-600"
                delay={80}
              />
              <StatCard
                label="Medium"
                value={stats.medium}
                icon={TrendingUp}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                accent="text-amber-600"
                delay={160}
              />
              <StatCard
                label="Hard"
                value={stats.hard}
                icon={Flame}
                iconBg="bg-rose-50"
                iconColor="text-rose-500"
                accent="text-rose-500"
                delay={240}
              />
            </div>

            {/* ── Main Content Grid ──────────────────────────────────────── */}
            <div className="grid gap-6 lg:grid-cols-5">

              {/* Recent Problems */}
              <div className="dash-card lg:col-span-3" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between p-6 pb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">Recent Problems</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Your latest submissions</p>
                  </div>
                  <Link
                    to="/problems"
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div>
                  {stats.recentProblems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-300 space-y-3">
                      <CheckCircle2 className="h-10 w-10 opacity-30" />
                      <p className="text-sm font-medium">No problems tracked yet</p>
                      <Link to="/add-problem" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                        Add your first problem →
                      </Link>
                    </div>
                  ) : (
                    stats.recentProblems.map((problem, index) => (
                      <div key={problem._id} className="dash-problem-row">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-xs font-bold text-slate-400">
                            {index + 1}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-slate-800">{problem.title}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-medium text-slate-400">{problem.platform}</span>
                              <span className="text-slate-200">•</span>
                              <span className="text-xs font-medium text-slate-400">{problem.topic}</span>
                              <span className="text-slate-200">•</span>
                              <span className="text-xs text-slate-300 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {timeAgo(problem.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Sparkline + Quick Actions */}
              <div className="lg:col-span-2 space-y-6">

                {/* 7-Day Sparkline */}
                <div className="dash-card" style={{ animationDelay: '300ms' }}>
                  <div className="flex items-center justify-between p-6 pb-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">This Week</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Last 7 days activity</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <Flame className="h-3 w-3" />
                      {stats.streak}d streak
                    </div>
                  </div>
                  <div className="px-6 pb-6 h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.sparkData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                        <Tooltip content={<SparkTooltip />} cursor={{ fill: "rgba(241, 245, 249, 0.5)" }} />
                        <Bar
                          dataKey="count"
                          fill="url(#sparkGradient)"
                          radius={[4, 4, 0, 0]}
                          barSize={24}
                          animationDuration={1000}
                          animationEasing="ease-out"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="dash-card p-6" style={{ animationDelay: '400ms' }}>
                  <h3 className="text-base font-semibold text-slate-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link to="/add-problem" className="dash-quick-action">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <PlusCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Add New Problem</p>
                        <p className="text-xs text-slate-400">Track a question you solved</p>
                      </div>
                    </Link>
                    <Link to="/analytics" className="dash-quick-action">
                      <div className="p-2 bg-violet-50 rounded-lg">
                        <BarChart2 className="h-4 w-4 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">View Analytics</p>
                        <p className="text-xs text-slate-400">Deep dive into your stats</p>
                      </div>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
