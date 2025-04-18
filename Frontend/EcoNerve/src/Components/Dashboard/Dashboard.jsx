import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import './Dashboard.css'
const dummyData = {
  paper: { count: 500, price: 0.05 },
  glass: { count: 200, price: 0.1 },
  plastic: { count: 350, price: 0.08 },
  metal: { count: 150, price: 0.12 }
};

const chartData = Object.entries(dummyData).map(([key, value]) => ({
  category: key.charAt(0).toUpperCase() + key.slice(1),
  count: value.count,
  revenue: +(value.count * value.price).toFixed(2)
}));

function Dashboard() {
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="dashboard">
      <h2 className="dash-title">Dashboard</h2>
      <div className="summary">
        <h3>Total Revenue: ${totalRevenue.toFixed(2)}</h3>
      </div>

      <div className="chart-section">
        <h4>Revenue by Category</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export { Dashboard };
