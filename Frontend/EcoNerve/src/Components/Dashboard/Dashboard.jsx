// import React from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// } from "recharts";
// import './Dashboard.css'
// const dummyData = {
//   paper: { count: 500, price: 0.05 },
//   glass: { count: 200, price: 0.1 },
//   plastic: { count: 350, price: 0.08 },
//   metal: { count: 150, price: 0.12 }
// };

// const chartData = Object.entries(dummyData).map(([key, value]) => ({
//   category: key.charAt(0).toUpperCase() + key.slice(1),
//   count: value.count,
//   revenue: +(value.count * value.price).toFixed(2)
// }));

// function Dashboard() {
//   const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

//   return (
//     <div className="dashboard">
//       <h2 className="dash-title">Dashboard</h2>
//       <div className="summary">
//         <h3>Total Revenue: ${totalRevenue.toFixed(2)}</h3>
//       </div>

//       <div className="chart-section">
//         <h4>Revenue by Category</h4>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="category" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="revenue" fill="#4CAF50" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// export { Dashboard };

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import './Dashboard.css';

function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const companyName = localStorage.getItem("companyName")||`jellyfish`; // adjust if stored elsewhere
  const token = localStorage.getItem("accessToken")||null; // adjust if stored elsewhere

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/classification/getClassfication/${companyName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log(data)
        if (!data || !data.classifications) {
          setChartData([]);
          setTotalRevenue(0);
          return;
        }

        // Group and compute revenue
        const grouped = {};

        data.classifications.forEach(item => {
          console.log("hello from foreach loop dashboard")
          const key = item.classification.toLowerCase();
          const value = item.value || 0;

          if (!grouped[key]) {
            grouped[key] = { count: 0, value: value };
          }

          grouped[key].count += 1;
        });

        const formattedData = Object.entries(grouped).map(([key, val]) => {
          const revenue = val.count * val.value;
          return {
            category: key.charAt(0).toUpperCase() + key.slice(1),
            count: val.count,
            revenue: +revenue.toFixed(2),
          };
        });

        const total = formattedData.reduce((sum, item) => sum + item.revenue, 0);

        setChartData(formattedData);
        setTotalRevenue(total);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyName, token]);

  return (
    <div className="dashboard">
      <h2 className="dash-title">Dashboard</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export { Dashboard };

