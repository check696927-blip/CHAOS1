import { useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, Package, DollarSign } from "lucide-react";

const salesTrendData = [
  { month: "Jan", revenue: 12400, orders: 45, profit: 3720 },
  { month: "Feb", revenue: 18600, orders: 67, profit: 5580 },
  { month: "Mar", revenue: 15200, orders: 52, profit: 4560 },
  { month: "Apr", revenue: 22800, orders: 78, profit: 6840 },
  { month: "May", revenue: 28400, orders: 94, profit: 8520 },
  { month: "Jun", revenue: 31200, orders: 108, profit: 9360 }
];

const categoryRevenueData = [
  { category: "NEW DROPS", revenue: 45600, percentage: 38 },
  { category: "BEST SELLERS", revenue: 38400, percentage: 32 },
  { category: "ACCESSORIES", revenue: 36000, percentage: 30 }
];

const bestSellingProducts = [
  { name: "ANIME GRAPHIC JOGGERS", sold: 124, revenue: 11780 },
  { name: "NEON FLAME JOGGERS", sold: 98, revenue: 9604 },
  { name: "BERSERK WASHED HOODIE", sold: 87, revenue: 8526 },
  { name: "GOTHIC CROSS PENDANT COLLECTION", sold: 156, revenue: 7488 },
  { name: "DRAGON HEAD PENDANT", sold: 78, revenue: 4056 }
];

const profitMarginData = [
  { month: "Jan", margin: 58 },
  { month: "Feb", margin: 62 },
  { month: "Mar", margin: 59 },
  { month: "Apr", margin: 64 },
  { month: "May", margin: 66 },
  { month: "Jun", margin: 68 }
];

const COLORS = ["#D946EF", "#06B6D4", "#F43F5E"];

export const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState("6m");

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="font-neon text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-chaos-purple" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-chaos-darker border border-gray-700 rounded px-4 py-2 text-white focus:border-chaos-purple outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="1m">Last month</option>
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-chaos-purple" />
            <div>
              <p className="text-gray-400 text-xs">Total Revenue</p>
              <p className="text-2xl font-bold neon-text-purple">$128,600</p>
            </div>
          </div>
          <p className="text-green-400 text-xs">+24% from last period</p>
        </div>

        <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-chaos-cyan" />
            <div>
              <p className="text-gray-400 text-xs">Orders</p>
              <p className="text-2xl font-bold neon-text-cyan">444</p>
            </div>
          </div>
          <p className="text-green-400 text-xs">+18% from last period</p>
        </div>

        <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-chaos-red" />
            <div>
              <p className="text-gray-400 text-xs">Avg Profit Margin</p>
              <p className="text-2xl font-bold neon-text-red">63%</p>
            </div>
          </div>
          <p className="text-green-400 text-xs">+5% from last period</p>
        </div>

        <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">Total Profit</p>
              <p className="text-2xl font-bold text-green-400">$39,180</p>
            </div>
          </div>
          <p className="text-green-400 text-xs">+31% from last period</p>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
        <h3 className="font-neon text-lg font-bold mb-4">Sales Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1a0f1f", border: "1px solid #D946EF" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#D946EF" strokeWidth={2} name="Revenue ($)" />
            <Line type="monotone" dataKey="profit" stroke="#06B6D4" strokeWidth={2} name="Profit ($)" />
            <Line type="monotone" dataKey="orders" stroke="#F43F5E" strokeWidth={2} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
          <h3 className="font-neon text-lg font-bold mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryRevenueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {categoryRevenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1a0f1f", border: "1px solid #D946EF" }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Margin Trend */}
        <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
          <h3 className="font-neon text-lg font-bold mb-4">Profit Margin Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitMarginData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a0f1f", border: "1px solid #D946EF" }}
                formatter={(value: number) => `${value}%`}
              />
              <Bar dataKey="margin" fill="#06B6D4" name="Profit Margin (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
        <h3 className="font-neon text-lg font-bold mb-4">Best Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left p-3 font-neon text-sm">Rank</th>
                <th className="text-left p-3 font-neon text-sm">Product</th>
                <th className="text-right p-3 font-neon text-sm">Units Sold</th>
                <th className="text-right p-3 font-neon text-sm">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {bestSellingProducts.map((product, index) => (
                <tr key={product.name} className="border-b border-gray-800">
                  <td className="p-3">
                    <span className={`font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-right text-chaos-purple font-bold">{product.sold}</td>
                  <td className="p-3 text-right font-bold neon-text-cyan">${product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
