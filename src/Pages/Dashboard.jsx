import React, { useState, useEffect } from 'react';
// Untuk ikon, pastikan Font Awesome terhubung di public/index.html Anda
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  // Data mock untuk grafik dan statistik
  const [salesData] = useState([
    { name: 'Jan', uv: 400, pv: 240 },
    { name: 'Feb', uv: 300, pv: 139 },
    { name: 'Mar', uv: 200, pv: 980 },
    { name: 'Apr', uv: 278, pv: 390 },
    { name: 'May', uv: 189, pv: 480 },
    { name: 'Jun', uv: 239, pv: 380 },
    { name: 'Jul', uv: 349, pv: 430 },
    { name: 'Aug', uv: 200, pv: 500 },
    { name: 'Sep', uv: 278, pv: 600 },
    { name: 'Oct', uv: 189, pv: 700 },
    { name: 'Nov', uv: 239, pv: 800 },
    { name: 'Dec', uv: 349, pv: 900 },
  ]);

  const [emailActivityData] = useState([
    { name: 'Sent', value: 2300 },
    { name: 'Received', value: 274 },
  ]);

  const PIE_COLORS = ['#8884d8', '#82ca9d']; // Warna untuk Donut Chart

  // Data mock untuk Top 5 Produk
  const [topProducts] = useState([
    { id: 1, name: 'Superstar XLG', totalSold: 110, profits: 72.3, imageUrl: 'https://placehold.co/40x40/f0f0f0/333333?text=P1' },
    { id: 2, name: 'Superstar Bornega', totalSold: 94, profits: 14.8, imageUrl: 'https://placehold.co/40x40/f0f0f0/333333?text=P2' },
    { id: 3, name: 'Webcam Full HD', totalSold: 65, profits: 9.7, imageUrl: 'https://placehold.co/40x40/f0f0f0/333333?text=P3' },
    { id: 4, name: 'Conlon Camera IX65', totalSold: 55, profits: 7.4, imageUrl: 'https://placehold.co/40x40/f0f0f0/333333?text=P4' },
    { id: 5, name: 'Nike Dunk Love Retro', totalSold: 39, profits: 6.2, imageUrl: 'https://placehold.co/40x40/f0f0f0/333333?text=P5' },
  ]);

  // Data mock untuk Top 5 Pelanggan
  const [topCustomers] = useState([
    { id: 1, name: 'Bayu Ramadhon', totalOrder: 88, expenses: 17.6, imageUrl: 'https://placehold.co/40x40/d0e0f0/333333?text=C1' },
    { id: 2, name: 'Daffanurhadi_69', totalOrder: 73, expenses: 13.2, imageUrl: 'https://placehold.co/40x40/d0e0f0/333333?text=C2' },
    { id: 3, name: 'Dhirodriunartai_10', totalOrder: 70, expenses: 10.4, imageUrl: 'https://placehold.co/40x40/d0e0f0/333333?text=C3' },
    { id: 4, name: 'Michalperwira_8', totalOrder: 64, expenses: 10.2, imageUrl: 'https://placehold.co/40x40/d0e0f0/333333?text=C4' },
    { id: 5, name: 'Naufalputra_0072', totalOrder: 59, expenses: 8.9, imageUrl: 'https://placehold.co/40x40/d0e0f0/333333?text=C5' },
  ]);


  return (
    <div className="min-h-screen bg-gray-100 font-inter">

      {/* Main Content Area */}
      <div className="p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back, Admin</h2>
            <p className="text-gray-600">Here's what's happening with your store today.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
            <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200 flex items-center">
              <i className="fas fa-download mr-2"></i> Download Report
            </button>
            <div className="relative">
              <select className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option>Oct 1 - Oct 31</option>
                <option>Sep 1 - Sep 30</option>
                <option>Aug 1 - Aug 31</option>
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
            </div>
          </div>
        </div>

        {/* Overview Tabs */}
        <div className="flex space-x-2 mb-6">
          <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md">Overview</button>
          <button className="px-5 py-2 bg-white text-gray-700 rounded-lg font-medium shadow-md hover:bg-gray-50">Performance</button>
          <button className="px-5 py-2 bg-white text-gray-700 rounded-lg font-medium shadow-md hover:bg-gray-50">Ads Campaign</button>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Sales Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
            <h3 className="text-gray-500 text-lg font-semibold mb-2">Total Sales</h3>
            <p className="text-3xl font-bold text-gray-800">$40.365.00</p>
            <p className="text-green-500 text-sm mt-1">
              <i className="fas fa-arrow-up mr-1"></i> 36.5% <span className="text-gray-500">since last month</span>
            </p>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
            <h3 className="text-gray-500 text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-800">3.305</p>
            <p className="text-red-500 text-sm mt-1">
              <i className="fas fa-arrow-down mr-1"></i> 2.1% <span className="text-gray-500">since last month</span>
            </p>
          </div>

          {/* Customers Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
            <h3 className="text-gray-500 text-lg font-semibold mb-2">Customers</h3>
            <p className="text-3xl font-bold text-gray-800">25.213</p>
            <p className="text-green-500 text-sm mt-1">
              <i className="fas fa-arrow-up mr-1"></i> 15% <span className="text-gray-500">since last month</span>
            </p>
          </div>

          {/* Product Views Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
            <h3 className="text-gray-500 text-lg font-semibold mb-2">Product Views</h3>
            <p className="text-3xl font-bold text-gray-800">10.000</p>
            <p className="text-green-500 text-sm mt-1">
              <i className="fas fa-arrow-up mr-1"></i> 20% <span className="text-gray-500">since last month</span>
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Activity Chart */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-800 text-xl font-semibold mb-4">Email Activity</h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={emailActivityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {emailActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center text-gray-600 mt-2">
                <p className="text-4xl font-bold text-gray-800">2574</p>
                <p>Total</p>
              </div>
              <div className="flex justify-around w-full mt-4 text-sm text-gray-600">
                <p><span className="w-3 h-3 inline-block rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[0] }}></span> Email Sent: {emailActivityData[0].value}</p>
                <p><span className="w-3 h-3 inline-block rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[1] }}></span> Received: {emailActivityData[1].value}</p>
              </div>
            </div>
          </div>

          {/* Sales Statistic Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-800 text-xl font-semibold mb-4">Sales Statistic</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="uv" fill="#8884d8" name="Revenue" />
                <Bar dataKey="pv" fill="#82ca9d" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New sections: Top 5 Products and Top 5 Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Top 5 Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-xl font-semibold">Top 5 Products</h3>
              <a href="#" className="text-indigo-600 hover:underline text-sm">View more <i className="fas fa-chevron-right ml-1"></i></a>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-500 font-bold text-lg">{index + 1}</div> {/* Nomor urut */}
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-gray-800 font-medium">{product.name}</p>
                      <p className="text-gray-500 text-sm">Total Sold: {product.totalSold}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-semibold">${product.profits.toFixed(1)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Customers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-xl font-semibold">Top 5 Customers</h3>
              <a href="#" className="text-indigo-600 hover:underline text-sm">View more <i className="fas fa-chevron-right ml-1"></i></a>
            </div>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-500 font-bold text-lg">{index + 1}</div> {/* Nomor urut */}
                    <img src={customer.imageUrl} alt={customer.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-gray-800 font-medium">{customer.name}</p>
                      <p className="text-gray-500 text-sm">Total Order: {customer.totalOrder}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-semibold">${customer.expenses.toFixed(1)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Location Map (Placeholder) - Dipindahkan ke bawah Top 5 sections */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-gray-800 text-xl font-semibold mb-4">Sales Location</h3>
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg">
            {/*  */}
            Peta Lokasi Penjualan (Placeholder)
          </div>
          <div className="flex justify-around w-full mt-4 text-sm text-gray-600">
            <p><span className="w-3 h-3 inline-block rounded-full bg-blue-500 mr-2"></span> Men: 70%</p>
            <p><span className="w-3 h-3 inline-block rounded-full bg-pink-500 mr-2"></span> Women: 40%</p>
            <p><span className="w-3 h-3 inline-block rounded-full bg-green-500 mr-2"></span> Not Identify: 10%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
