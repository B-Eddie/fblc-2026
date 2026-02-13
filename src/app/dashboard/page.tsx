"use client";

import { DollarSign, Users, Star, Store, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import MetricCard from "@/components/MetricCard";
import { mockBusinesses } from "@/data/mock-businesses";
import { mockAgents } from "@/data/mock-agents";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

const revenueData = [
  { month: "Jul", revenue: 142000 },
  { month: "Aug", revenue: 148000 },
  { month: "Sep", revenue: 155000 },
  { month: "Oct", revenue: 151000 },
  { month: "Nov", revenue: 160000 },
  { month: "Dec", revenue: 162000 },
];

const sentimentData = [
  { month: "Jul", positive: 62, neutral: 25, negative: 13 },
  { month: "Aug", positive: 58, neutral: 28, negative: 14 },
  { month: "Sep", positive: 65, neutral: 22, negative: 13 },
  { month: "Oct", positive: 60, neutral: 27, negative: 13 },
  { month: "Nov", positive: 68, neutral: 21, negative: 11 },
  { month: "Dec", positive: 71, neutral: 19, negative: 10 },
];

const personaDistribution = [
  { name: "Tech Workers", value: 25, color: "#ffffff" },
  { name: "Foodies", value: 20, color: "#bbbbbb" },
  { name: "Health Conscious", value: 18, color: "#888888" },
  { name: "Students", value: 15, color: "#666666" },
  { name: "Families", value: 12, color: "#444444" },
  { name: "Other", value: 10, color: "#333333" },
];

const totalRevenue = mockBusinesses.reduce(
  (sum, b) => sum + b.monthlyRevenue,
  0,
);
const totalCustomers = mockBusinesses.reduce(
  (sum, b) => sum + b.avgCustomersPerDay,
  0,
);
const avgRating =
  mockBusinesses.reduce((sum, b) => sum + b.rating, 0) / mockBusinesses.length;
const avgSentiment =
  mockAgents.reduce((sum, a) => sum + a.currentSentiment, 0) /
  mockAgents.length;

const tooltipStyle = {
  background: "rgba(0,0,0,0.95)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "0px",
  color: "#e5e5e5",
  fontFamily: "var(--font-mono)",
  fontSize: "12px",
};

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white mb-1">
          Dashboard
        </h1>
        <p className="text-xs text-white/40 font-mono">
          Overview of your market simulation environment
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Monthly Revenue"
          value={formatCurrency(totalRevenue)}
          change="+8.2% vs last month"
          trend="up"
          icon={DollarSign}
          color="text-green-400"
        />
        <MetricCard
          label="Daily Customers"
          value={formatCompactNumber(totalCustomers)}
          change="+12.5% vs last month"
          trend="up"
          icon={Users}
          color="text-white"
        />
        <MetricCard
          label="Avg Rating"
          value={avgRating.toFixed(1)}
          change="Stable"
          trend="stable"
          icon={Star}
          color="text-yellow-400"
        />
        <MetricCard
          label="Avg Sentiment"
          value={`${(avgSentiment * 100).toFixed(0)}%`}
          change="+3.1% vs last month"
          trend="up"
          icon={Activity}
          color="text-white"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Revenue Chart */}
        <div className="border border-white/10 bg-black/40 p-6 lg:col-span-2">
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4">
            Combined Revenue Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    formatCurrency(value as number),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Persona Distribution */}
        <div className="border border-white/10 bg-black/40 p-6">
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4">
            Persona Distribution
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={personaDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {personaDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {personaDistribution.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 text-xs text-white/50"
              >
                <div className="w-2 h-2" style={{ background: p.color }} />
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment + Businesses Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sentiment Breakdown */}
        <div className="border border-white/10 bg-black/40 p-6 lg:col-span-2">
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4">
            Sentiment Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value}%`]}
                />
                <Bar
                  dataKey="positive"
                  stackId="a"
                  fill="#ffffff"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="neutral"
                  stackId="a"
                  fill="#666666"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="negative"
                  stackId="a"
                  fill="#333333"
                  radius={[0, 0, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Summary */}
        <div className="border border-white/10 bg-black/40 p-6">
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4">
            Your Businesses
          </h3>
          <div className="space-y-3">
            {mockBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/10"
              >
                <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{biz.name}</div>
                  <div className="text-xs text-white/30">
                    {biz.type} &middot; {biz.priceRange}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-green-400">
                    {formatCurrency(biz.monthlyRevenue)}
                  </div>
                  <div className="text-xs text-white/30">/mo</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/40">Total</span>
            <span className="font-mono font-medium text-white">
              {formatCurrency(totalRevenue)}/mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
