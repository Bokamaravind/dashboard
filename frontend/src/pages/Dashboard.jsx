import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
    ArcElement
     
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
   ArcElement,
  Title,
  Tooltip,
  Legend
    
);

// Main Dashboard Component
export default function Dashboard() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // State
  const [salesByDay, setSalesByDay] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [salesRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${API}/stats/sales-by-day`),
          axios.get(`${API}/stats/top-products`),
          axios.get(`${API}/orders/recent`),
        ]);

        setSalesByDay(salesRes.data);
        setTopProducts(productsRes.data);
        setRecentOrders(ordersRes.data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    }

    loadData();
  }, []);

  // Prepare chart data
  const labels = salesByDay.map((item) => item._id);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: salesByDay.map((item) => item.totalSales),
        borderColor: "blue",
        backgroundColor: "lightblue",
      },
    ],
  };

  // Render
  return (
    <div  className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-center ">Dashboard</h1>

      {/* Chart Section */}
      <section  className="mt-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg">
        <h2>Sales by Day</h2>
        <Line data={chartData} />
      </section>

      {/* Top Products */}
     <section className="mt-8 max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg">
  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
    Top Products
  </h2>
  <Pie
    data={{
      labels: topProducts.map((p) => p.product?.name || "Unknown"),
      datasets: [
        {
          label: "Quantity Sold",
          data: topProducts.map((p) => p.qtySold),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          borderWidth: 1,
        },
      ],
    }}
    className="rounded-sm"
  />
</section>


      {/* Recent Orders */}
      <section  className="mt-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg">
        <h2 className="text-blue-800">Recent Orders</h2>
  <table className="min-w-full border border-gray-300 rounded-sm divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                <td className="border border-gray-300 px-4 py-2">{order.userId?.name}</td>
                <td className="border border-gray-300 px-4 py-2">{order.total}</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
