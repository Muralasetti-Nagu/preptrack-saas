import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { fetchAPI } from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { Trophy, Flame, Target, BookOpen, TrendingUp, Zap, Calendar, Code2 } from "lucide-react";

// ─── Custom Tooltip Component ──────────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="analytics-tooltip">
        <p className="text-xs font-semibold text-slate-800 mb-0.5">{payload[0].payload.dateStr}</p>
        <p className="text-xs text-slate-500">
          <span className="font-bold text-blue-600">{payload[0].value}</span> problems
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="analytics-tooltip">
        <p className="text-xs font-semibold" style={{ color: payload[0].payload.color }}>
          {payload[0].name}
        </p>
        <p className="text-xs text-slate-500">
          <span className="font-bold text-slate-800">{payload[0].value}</span> problems
        </p>
      </div>
    );
  }
  return null;
};

// ─── Stat Card Component ───────────────────────────────────────────────────────
const StatCard = ({ label, value, subtitle, icon: Icon, iconBg, iconColor, delay = 0 }) => (
  <div
    className="analytics-stat-card group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className={`p-2.5 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
    </div>
    <div className="mt-4">
      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
      {subtitle && (
        <span className="text-xs font-medium text-slate-400 ml-2">{subtitle}</span>
      )}
    </div>
  </div>
);

// ─── Topic Progress Bar Component ──────────────────────────────────────────────
const TopicBar = ({ name, count, maxCount, color, index }) => {
  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div className="space-y-1.5" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">{name}</span>
        <span className="text-sm font-bold text-slate-900 tabular-nums">{count}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
};

// ─── Main Analytics Component ──────────────────────────────────────────────────
export const Analytics = () => {
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

  // ─── Data Computations ─────────────────────────────────────────────────────
  const analytics = useMemo(() => {
    if (!problems.length) {
      return {
        monthlyData: [],
        difficultyData: [],
        topicData: [],
        platformData: [],
        weeklyTrend: [],
        totalSolved: 0,
        currentStreak: 0,
        bestDay: "N/A",
        topTopic: "N/A",
        activeDays: 0,
        avgPerDay: "0",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 30-Day Activity Data
    const monthlyData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      monthlyData.push({
        dateStr: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        label: (i % 7 === 0 || i === 0) ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
        count: 0,
        fullDate: d.getTime(),
      });
    }

    problems.forEach((p) => {
      const pDate = new Date(p.createdAt);
      pDate.setHours(0, 0, 0, 0);
      const dayData = monthlyData.find(d => d.fullDate === pDate.getTime());
      if (dayData) dayData.count += 1;
    });

    // Weekly trend (last 8 weeks)
    const weeklyTrend = [];
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (w * 7 + 6));
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - (w * 7));

      const count = problems.filter(p => {
        const d = new Date(p.createdAt);
        d.setHours(0, 0, 0, 0);
        return d >= weekStart && d <= weekEnd;
      }).length;

      weeklyTrend.push({
        week: `W${8 - w}`,
        count,
      });
    }

    // Difficulty breakdown
    const easyCount = problems.filter(p => p.difficulty === "Easy").length;
    const mediumCount = problems.filter(p => p.difficulty === "Medium").length;
    const hardCount = problems.filter(p => p.difficulty === "Hard").length;
    const difficultyData = [
      { name: "Easy", value: easyCount, color: "#10b981" },
      { name: "Medium", value: mediumCount, color: "#f59e0b" },
      { name: "Hard", value: hardCount, color: "#ef4444" },
    ].filter(d => d.value > 0);

    // Topic breakdown (top 6)
    const topicCounts = {};
    problems.forEach(p => {
      topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
    });
    const topicColors = ["#6366f1", "#8b5cf6", "#a78bfa", "#818cf8", "#7c3aed", "#c084fc"];
    const topicData = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count], i) => ({ name, count, color: topicColors[i % topicColors.length] }));

    // Platform breakdown
    const platformCounts = {};
    problems.forEach(p => {
      platformCounts[p.platform] = (platformCounts[p.platform] || 0) + 1;
    });
    const platformColors = { LeetCode: "#f89f1b", HackerRank: "#2ec866", Codeforces: "#1890ff", GeeksForGeeks: "#2f8d46", Other: "#94a3b8" };
    const platformData = Object.entries(platformCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, value: count, color: platformColors[name] || "#6366f1" }));

    // Streak calculation
    const solvedDates = new Set(problems.map(p => {
      const d = new Date(p.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }));

    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (solvedDates.has(checkDate.getTime())) {
        currentStreak++;
      } else if (i === 0) {
        continue;
      } else {
        break;
      }
    }

    // Best day
    const dayCounts = {};
    problems.forEach(p => {
      const d = new Date(p.createdAt);
      const key = d.toLocaleDateString("en-US", { weekday: "long" });
      dayCounts[key] = (dayCounts[key] || 0) + 1;
    });
    const bestDay = Object.keys(dayCounts).length
      ? Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

    // Top topic
    const topTopic = topicData.length ? topicData[0].name : "N/A";

    // Active days in last 30
    const activeDays = monthlyData.filter(d => d.count > 0).length;

    // Avg per active day in last 30
    const totalLast30 = monthlyData.reduce((acc, d) => acc + d.count, 0);
    const avgPerDay = activeDays > 0 ? (totalLast30 / activeDays).toFixed(1) : "0";

    return {
      monthlyData,
      difficultyData,
      topicData,
      platformData,
      weeklyTrend,
      totalSolved: problems.length,
      currentStreak,
      bestDay,
      topTopic,
      activeDays,
      avgPerDay,
    };
  }, [problems]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      {/* Scoped Styles */}
      <style>{`
        .analytics-tooltip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.6);
          box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.04);
          padding: 10px 14px;
        }

        .analytics-stat-card {
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.7);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeSlideUp 0.5s ease-out both;
        }

        .analytics-stat-card::before {
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

        .analytics-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.08);
          border-color: rgba(203, 213, 225, 0.9);
        }

        .analytics-chart-card {
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.7);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
          animation: fadeSlideUp 0.6s ease-out both;
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .analytics-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
          margin-bottom: 1rem;
        }

        .analytics-gradient-text {
          background: linear-gradient(135deg, #0f172a 0%, #475569 50%, #0f172a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .analytics-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(12px);
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.5);
        }

        .analytics-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .recharts-default-tooltip {
          display: none !important;
        }
      `}</style>

      <div className="space-y-8 pb-10">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" style={{ animation: 'fadeSlideUp 0.4s ease-out both' }}>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight analytics-gradient-text">
              Analytics & Insights
            </h2>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              Your personal coding progress at a glance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-100/80 px-3 py-1.5 rounded-lg">
            <Calendar className="h-3.5 w-3.5" />
            Last 30 days
          </div>
        </div>

        {loading ? (
          <div className="analytics-loading">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <span className="font-medium text-slate-400 animate-pulse">Crunching your data...</span>
          </div>
        ) : (
          <>
            {/* ── Stat Cards Row ────────────────────────────────────────────── */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Solved"
                value={analytics.totalSolved}
                icon={Trophy}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                delay={0}
              />
              <StatCard
                label="Current Streak"
                value={analytics.currentStreak}
                subtitle="days"
                icon={Flame}
                iconBg="bg-orange-50"
                iconColor="text-orange-500"
                delay={80}
              />
              <StatCard
                label="Strongest Topic"
                value={analytics.topTopic}
                icon={BookOpen}
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
                delay={160}
              />
              <StatCard
                label="Avg / Active Day"
                value={analytics.avgPerDay}
                subtitle="problems"
                icon={Zap}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                delay={240}
              />
            </div>

            {/* ── Charts Row 1: Activity Timeline + Difficulty ──────────── */}
            <div className="grid gap-6 lg:grid-cols-5">

              {/* 30-Day Bar Chart */}
              <div className="analytics-chart-card lg:col-span-3" style={{ animationDelay: '200ms' }}>
                <div className="p-6 pb-0 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">Daily Activity</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{analytics.activeDays} active days this month</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <TrendingUp className="h-3 w-3" />
                    30 days
                  </div>
                </div>
                <div className="p-6 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.monthlyData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                        dy={8}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#cbd5e1", fontSize: 11 }}
                        dx={-4}
                      />
                      <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(241, 245, 249, 0.5)" }} />
                      <Bar
                        dataKey="count"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        barSize={10}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Difficulty Donut */}
              <div className="analytics-chart-card lg:col-span-2" style={{ animationDelay: '300ms' }}>
                <div className="p-6 pb-0">
                  <h3 className="text-base font-semibold text-slate-800">Difficulty Split</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Distribution across levels</p>
                </div>
                <div className="p-6 h-[300px] flex items-center justify-center">
                  {analytics.difficultyData.length === 0 ? (
                    <div className="flex flex-col items-center text-slate-300 space-y-2">
                      <Target className="h-10 w-10 opacity-30" />
                      <p className="text-xs font-medium">No data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.difficultyData}
                          cx="50%"
                          cy="45%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                          animationDuration={1000}
                          animationEasing="ease-out"
                        >
                          {analytics.difficultyData.map((entry, index) => (
                            <Cell key={`diff-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={8}
                          formatter={(value) => (
                            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500, marginLeft: '4px' }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* ── Charts Row 2: Weekly Trend + Topic Breakdown ──────────── */}
            <div className="grid gap-6 lg:grid-cols-5">

              {/* Weekly Trend Area Chart */}
              <div className="analytics-chart-card lg:col-span-3" style={{ animationDelay: '400ms' }}>
                <div className="p-6 pb-0 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">Weekly Trend</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Problems solved per week (last 8 weeks)</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg">
                    <TrendingUp className="h-3 w-3" />
                    8 weeks
                  </div>
                </div>
                <div className="p-6 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.weeklyTrend} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                        dy={8}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#cbd5e1", fontSize: 11 }}
                        dx={-4}
                      />
                      <Tooltip content={<CustomBarTooltip />} cursor={{ stroke: "#e2e8f0" }} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        fill="url(#areaGradient)"
                        animationDuration={1500}
                        animationEasing="ease-out"
                        dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Topic Breakdown Bars */}
              <div className="analytics-chart-card lg:col-span-2" style={{ animationDelay: '500ms' }}>
                <div className="p-6 pb-0">
                  <h3 className="text-base font-semibold text-slate-800">Top Topics</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Most practiced categories</p>
                </div>
                <div className="p-6 space-y-4">
                  {analytics.topicData.length === 0 ? (
                    <div className="flex flex-col items-center text-slate-300 space-y-2 py-8">
                      <Code2 className="h-10 w-10 opacity-30" />
                      <p className="text-xs font-medium">No topics yet</p>
                    </div>
                  ) : (
                    analytics.topicData.map((topic, index) => (
                      <TopicBar
                        key={topic.name}
                        name={topic.name}
                        count={topic.count}
                        maxCount={analytics.topicData[0].count}
                        color={topic.color}
                        index={index}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* ── Bottom Row: Platform + Best Day + Quick Stats ─────────── */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">

              {/* Platform Breakdown */}
              <div className="analytics-chart-card" style={{ animationDelay: '600ms' }}>
                <div className="p-6 pb-4">
                  <h3 className="text-base font-semibold text-slate-800">Platforms</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Where you practice</p>
                </div>
                <div className="px-6 pb-6 space-y-3">
                  {analytics.platformData.length === 0 ? (
                    <p className="text-xs text-slate-300 font-medium text-center py-4">No data</p>
                  ) : (
                    analytics.platformData.map((p) => (
                      <div key={p.name} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{p.name}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 tabular-nums">{p.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Best Day Card */}
              <div className="analytics-chart-card flex flex-col items-center justify-center p-6 text-center" style={{ animationDelay: '650ms' }}>
                <div className="p-3 bg-amber-50 rounded-2xl mb-4">
                  <Calendar className="h-6 w-6 text-amber-500" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Most Productive Day</p>
                <p className="text-2xl font-extrabold text-slate-900">{analytics.bestDay}</p>
                <p className="text-xs text-slate-400 mt-1">You solve the most problems on this day</p>
              </div>

              {/* Activity Summary Card */}
              <div className="analytics-chart-card flex flex-col items-center justify-center p-6 text-center" style={{ animationDelay: '700ms' }}>
                <div className="p-3 bg-emerald-50 rounded-2xl mb-4">
                  <Target className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">30-Day Activity</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {analytics.activeDays}<span className="text-lg font-semibold text-slate-400"> / 30</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {analytics.activeDays >= 25 ? "🔥 Crushing it!" : analytics.activeDays >= 15 ? "💪 Great consistency!" : analytics.activeDays >= 7 ? "📈 Building momentum!" : "🚀 Keep going!"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
