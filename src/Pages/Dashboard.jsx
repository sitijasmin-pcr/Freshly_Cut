// import React from 'react'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js'
// import { Bar, Line, Pie } from 'react-chartjs-2'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// )

// const Dashboard = () => {
//   const menus = [
//     { id: 1, name: "Espresso", price: 20000, sold: 124 },
//     { id: 2, name: "Cappuccino", price: 25000, sold: 198 },
//     { id: 3, name: "Matcha Latte", price: 27000, sold: 143 },
//     { id: 4, name: "Americano", price: 18000, sold: 115 },
//     { id: 5, name: "Caramel Macchiato", price: 20000, sold: 174 },
//     { id: 6, name: "Chocolate Frappe", price: 28000, sold: 221 },
//     { id: 7, name: "Strawberry Smoothies", price: 18000, sold: 132 },
//     { id: 8, name: "Roti Bakar", price: 15000, sold: 96 },
//     { id: 9, name: "Kentang Goreng", price: 18000, sold: 109 },
//   ]

//   const totalPendapatan = menus.reduce((acc, menu) => acc + menu.price * menu.sold, 0)
//   const totalPenjualan = menus.reduce((acc, menu) => acc + menu.sold, 0)

//   const stats = [
//     { label: "Pendapatan Hari Ini", value: `Rp ${totalPendapatan.toLocaleString()}`, percent: "+55%", color: "green" },
//     { label: "Pengguna Hari Ini", value: "2,300", percent: "+3%", color: "blue" },
//     { label: "Klien Baru", value: "+3,462", percent: "-2%", color: "red" },
//     { label: "Penjualan", value: totalPenjualan.toLocaleString(), percent: "+5%", color: "purple" },
//   ]

//   const barData = {
//     labels: menus.map(menu => menu.name),
//     datasets: [
//       {
//         label: "Total Penjualan (Rp)",
//         data: menus.map(menu => menu.sold * menu.price),
//         backgroundColor: "rgba(99, 102, 241, 0.7)",
//       },
//     ],
//   }

//   const barOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Penjualan Produk Tahun Ini' },
//       tooltip: {
//         callbacks: {
//           label: ctx => `Rp ${ctx.parsed.y.toLocaleString()}`,
//         }
//       }
//     },
//     scales: {
//       y: {
//         ticks: {
//           callback: value => `Rp ${value.toLocaleString()}`,
//         },
//       },
//     },
//   }

//   const lineData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
//     datasets: [
//       {
//         label: "Jumlah Pelanggan",
//         data: [50, 75, 120, 180, 220, 260, 300, 350, 400, 430, 460, 500],
//         borderColor: "rgba(59, 130, 246, 1)",
//         backgroundColor: "rgba(59, 130, 246, 0.3)",
//         fill: true,
//         tension: 0.3,
//         pointRadius: 4,
//       },
//     ],
//   }

//   const lineOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Pertumbuhan Pelanggan Tahun Ini' },
//     },
//   }

//   const forecastData = {
//     labels: ["Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des", "Jan (Forecast)", "Feb (Forecast)", "Mar (Forecast)"],
//     datasets: [
//       {
//         label: "Forecast Pendapatan Bulanan (Rp)",
//         data: [4500000, 5000000, 5200000, 5400000, 5600000, 5800000, 6000000, 6200000, 6400000, 6600000],
//         borderColor: function(context) {
//           const index = context.dataIndex;
//           return index >= 7 ? 'rgba(245, 158, 11, 1)' : 'rgba(34, 197, 94, 1)';
//         },
//         backgroundColor: function(context) {
//           const index = context.dataIndex;
//           return index >= 7 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(34, 197, 94, 0.3)';
//         },
//         fill: true,
//         tension: 0.3,
//         pointRadius: 4,
//         segment: {
//           borderColor: ctx => ctx.p0DataIndex >= 7 ? 'rgba(245, 158, 11, 1)' : 'rgba(34, 197, 94, 1)',
//           backgroundColor: ctx => ctx.p0DataIndex >= 7 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(34, 197, 94, 0.3)',
//         },
//       },
//     ],
//   }

//   const forecastOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Forecast Pendapatan per Bulan' },
//     },
//     scales: {
//       y: {
//         ticks: {
//           callback: value => `Rp ${value.toLocaleString()}`,
//         },
//       },
//     },
//   }

//   const dailySales = [
//     { day: "Senin", sales: 400000 },
//     { day: "Selasa", sales: 600000 },
//     { day: "Rabu", sales: 450000 },
//     { day: "Kamis", sales: 700000 },
//     { day: "Jumat", sales: 500000 },
//     { day: "Sabtu", sales: 300000 },
//     { day: "Minggu", sales: 350000 },
//   ]

//   const pieProdukData = {
//     labels: menus.map(menu => menu.name),
//     datasets: [
//       {
//         label: "Jumlah Produk Terjual",
//         data: menus.map(menu => menu.sold),
//         backgroundColor: [
//           "#6366F1", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444", "#14B8A6", "#F97316"
//         ],
//         hoverOffset: 30,
//       },
//     ],
//   }

//   const pieProdukOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'bottom' },
//       title: { display: true, text: 'Proporsi Produk Terlaris (Jumlah Terjual)' },
//     },
//   }

//   const pieHariData = {
//     labels: dailySales.map(day => day.day),
//     datasets: [
//       {
//         label: "Pemasukan Harian (Rp)",
//         data: dailySales.map(day => day.sales),
//         backgroundColor: [
//           "#F87171", "#60A5FA", "#34D399", "#A78BFA", "#FBBF24", "#F43F5E", "#3B82F6"
//         ],
//         hoverOffset: 30,
//       },
//     ],
//   }

//   const pieHariOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'bottom' },
//       title: { display: true, text: 'Proporsi Pemasukan Harian' },
//     },
//   }

//   return (
//     <div className="p-6 space-y-10 max-w-7xl mx-auto">
//       {/* Statistik utama */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {stats.map(({ label, value, percent, color }) => (
//           <div
//             key={label}
//             className="bg-white rounded-xl shadow p-5 flex flex-col justify-center"
//             style={{ minHeight: '100px' }}
//           >
//             <p className="text-xs sm:text-sm text-gray-500">{label}</p>
//             <h2 className={`text-lg sm:text-xl font-bold text-${color}-600 flex items-center gap-2 mt-1`}>
//               {value}
//               <span className={`text-xs font-semibold text-${color}-500`}>{percent}</span>
//             </h2>
//           </div>
//         ))}
//       </div>

//       {/* Grafik utama dan pie dalam grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Bar & Line chart dalam 2 kolom */}
//         <div className="col-span-2 space-y-8">
//           <div className="bg-white rounded-xl shadow p-6" style={{ height: 280 }}>
//             <Bar options={barOptions} data={barData} />
//           </div>
//           <div className="bg-white rounded-xl shadow p-6" style={{ height: 280 }}>
//             <Line options={lineOptions} data={lineData} />
//           </div>
//           <div className="bg-white rounded-xl shadow p-6" style={{ height: 280 }}>
//             <Line options={forecastOptions} data={forecastData} />
//           </div>
//         </div>

//         {/* Pie charts di kolom kanan */}
//         <div className="flex flex-col gap-8">
//           <div className="bg-white rounded-xl shadow p-6" style={{ height: 280 }}>
//             <Pie options={pieProdukOptions} data={pieProdukData} />
//           </div>
//           <div className="bg-white rounded-xl shadow p-6" style={{ height: 280 }}>
//             <Pie options={pieHariOptions} data={pieHariData} />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard

import React, { useState, useEffect } from "react";
import {
  Bar,
  Line,
  Pie,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { FaShoppingCart, FaFileInvoiceDollar, FaUsers, FaChartPie } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const stats = [
    { icon: <FaFileInvoiceDollar />, label: "Revenue Hari Ini", value: "Rp 8.500.000", color: "yellow-400" },
    { icon: <FaShoppingCart />, label: "Order Hari Ini", value: 124, color: "red-400" },
    { icon: <FaUsers />, label: "Pengguna Hari Ini", value: 76, color: "green-400" },
    { icon: <FaChartPie />, label: "Produk Terjual", value: 342, color: "purple-400" },
  ];

  const barData = {
    labels: ["Espresso", "Latte", "Cappuccino", "Mocha", "Matcha", "Americano"],
    datasets: [
      {
        label: "Revenue per Produk (Rp)",
        data: [1500000, 2300000, 1800000, 1200000, 900000, 750000],
        backgroundColor: "rgba(99,102,241,0.7)",
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    datasets: [
      {
        label: "Jumlah Order Bulanan",
        data: [30, 45, 60, 80, 100, 120, 150, 170, 190, 210, 230, 250],
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.3)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const pieProdukData = {
    labels: ["Espresso", "Latte", "Cappuccino", "Mocha", "Matcha", "Americano"],
    datasets: [
      {
        data: [120, 150, 100, 80, 60, 50],
        backgroundColor: [
          "#6366F1",
          "#3B82F6",
          "#8B5CF6",
          "#EC4899",
          "#F59E0B",
          "#10B981",
        ],
        hoverOffset: 30,
      },
    ],
  };

  const topOrders = [
    { name: "Espresso", total: 500000, time: "10:15 AM" },
    { name: "Latte", total: 400000, time: "11:30 AM" },
    { name: "Cappuccino", total: 350000, time: "12:45 PM" },
    { name: "Mocha", total: 300000, time: "2:00 PM" },
    { name: "Matcha", total: 250000, time: "3:15 PM" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      {/* Card Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-5 flex items-center gap-4"
          >
            <div className={`p-3 bg-${s.color} rounded-full text-white text-xl`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grafik & Top Order */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar & Line chart */}
        <div className="col-span-2 space-y-8">
          <div className="bg-white rounded-xl p-6 shadow h-72">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          <div className="bg-white rounded-xl p-6 shadow h-72">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Pie chart + Top Order */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-6 shadow h-72">
            <Pie data={pieProdukData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold mb-4">Top 5 Orders Hari Ini</h3>
            <ul className="space-y-2">
              {topOrders.map((o, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{o.name} ({o.time})</span>
                  <span className="font-semibold">Rp {o.total.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
