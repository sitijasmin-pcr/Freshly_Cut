import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../supabase'; // Pastikan path ke supabase client Anda benar
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk data yang akan diambil dari Supabase
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [processingOrdersCount, setProcessingOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [canceledOrdersCount, setCanceledOrdersCount] = useState(0);

  // Data untuk Top Products dan Top Customers (akan diisi dari Supabase)
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  // Data untuk grafik penjualan bulanan (dari Supabase)
  const [monthlySalesData, setMonthlySalesData] = useState([]);

  // Data mock untuk Email Activity
  const [emailActivityData] = useState([
    { name: 'Sent', value: 2300 },
    { name: 'Received', value: 274 },
  ]);
  const PIE_COLORS = ['#8884d8', '#82ca9d'];

  // START: State untuk Data Gender (Akan diisi LANGSUNG dari tabel customers)
  const [genderDistribution, setGenderDistribution] = useState({
    men: 0,
    women: 0,
    notIdentify: 0,
  });

  const genderPieData = useMemo(() => ([
    { name: 'Men', value: genderDistribution.men },
    { name: 'Women', value: genderDistribution.women },
    { name: 'Not Identify', value: genderDistribution.notIdentify },
  ].filter(item => item.value > 0)), [genderDistribution]);
  const GENDER_COLORS = ['#3B82F6', '#EC4899', '#10B981', '#6B7280'];
  // END: State untuk Data Gender

  // State untuk dropdown periode
  const [selectedPeriod, setSelectedPeriod] = useState('Current Month');

  // Helper function to get month name for chart
  const getMonthName = (year, monthIndex) => {
    const date = new Date(year, monthIndex, 1);
    return date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
  };

  // Helper function to generate all months within a range, even if no data
  const generateMonthlySalesData = useCallback((orders, numberOfMonths, endDate) => {
    const dataMap = new Map();
    let currentMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    for (let i = 0; i < numberOfMonths; i++) {
      const monthKey = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
      dataMap.set(monthKey, { name: getMonthName(currentMonth.getFullYear(), currentMonth.getMonth()), uv: 0 });
      currentMonth.setMonth(currentMonth.getMonth() - 1);
    }

    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      if (dataMap.has(monthKey) && order.status === 'Completed') {
        const currentData = dataMap.get(monthKey);
        currentData.uv += (order.total_amount || 0);
        dataMap.set(monthKey, currentData);
      }
    });

    // Sort by month ascending
    return Array.from(dataMap.values()).sort((a, b) => {
      const [aYear, aMonth] = a.name.split(' ')[1] && a.name.split(' ')[1].length === 2 ?
        [2000 + parseInt(a.name.split(' ')[1]), new Date(`${a.name.split(' ')[0]} 1, 2000`).getMonth()] :
        [new Date().getFullYear(), new Date(`${a.name.split(' ')[0]} 1, ${new Date().getFullYear()}`).getMonth()];
      const [bYear, bMonth] = b.name.split(' ')[1] && b.name.split(' ')[1].length === 2 ?
        [2000 + parseInt(b.name.split(' ')[1]), new Date(`${b.name.split(' ')[0]} 1, 2000`).getMonth()] :
        [new Date().getFullYear(), new Date(`${b.name.split(' ')[0]} 1, ${new Date().getFullYear()}`).getMonth()];

      if (aYear !== bYear) {
        return aYear - bYear;
      }
      return aMonth - bMonth;
    });
  }, []);


  // Fungsi untuk mengambil data dashboard lainnya (pesanan, produk, dll.)
  const fetchDashboardData = useCallback(async (period) => {
    setLoading(true);
    setError(null);

    let startDate, endDate;
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Set to end of day for accurate filtering

    switch (period) {
      case 'Current Month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        break;
      case 'Last Month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month
        break;
      case 'Last 3 Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // Current month - 2 to get 3 months including current
        endDate = now;
        break;
      case 'Last 6 Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        endDate = now;
        break;
      case 'Last 12 Months':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        endDate = now;
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
    }

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total_amount,
          created_at,
          customer_name,
          order_items (
            product_name,
            quantity
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (ordersError) throw ordersError;

      let totalSales = 0;
      let totalOrders = ordersData.length;
      let completed = 0;
      let processing = 0;
      let pending = 0;
      let canceled = 0;

      const productSales = {};
      const customerSpending = {};

      ordersData.forEach(order => {
        if (order.status === 'Completed') {
          totalSales += order.total_amount || 0;
          completed++;
        }

        switch (order.status) {
          case 'Processing': processing++; break;
          case 'Pending': pending++; break;
          case 'Canceled': canceled++; break;
          default: break;
        }

        order.order_items.forEach(item => {
          if (!productSales[item.product_name]) {
            productSales[item.product_name] = { totalSold: 0, totalProfit: 0 };
          }
          productSales[item.product_name].totalSold += item.quantity;
          const itemPricePerUnit = (order.total_amount && order.order_items && order.order_items.length > 0)
                                      ? order.total_amount / order.order_items.reduce((sum, i) => sum + i.quantity, 0)
                                      : 0;
          productSales[item.product_name].totalProfit += item.quantity * itemPricePerUnit;
        });

        if (order.customer_name) {
          if (!customerSpending[order.customer_name]) {
            customerSpending[order.customer_name] = { totalOrders: 0, totalExpenses: 0 };
          }
          customerSpending[order.customer_name].totalOrders++;
          customerSpending[order.customer_name].totalExpenses += order.total_amount || 0;
        }
      });

      const sortedProducts = Object.entries(productSales)
        .map(([name, data], index) => ({
          id: index + 1,
          name: name,
          totalSold: data.totalSold,
          profits: data.totalProfit,
          imageUrl: `https://placehold.co/40x40/f0f0f0/333333?text=P${index + 1}`
        }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5);

      const sortedCustomers = Object.entries(customerSpending)
        .map(([name, data], index) => ({
          id: index + 1,
          name: name,
          totalOrder: data.totalOrders,
          expenses: data.totalExpenses,
          imageUrl: `https://placehold.co/40x40/d0e0f0/333333?text=C${index + 1}`
        }))
        .sort((a, b) => b.expenses - a.expenses)
        .slice(0, 5);

      let numberOfMonthsForChart = 1;
      if (period === 'Last Month') numberOfMonthsForChart = 2;
      if (period === 'Last 3 Months') numberOfMonthsForChart = 3;
      if (period === 'Last 6 Months') numberOfMonthsForChart = 6;
      if (period === 'Last 12 Months') numberOfMonthsForChart = 12;

      setMonthlySalesData(generateMonthlySalesData(ordersData, numberOfMonthsForChart, endDate));

      setTotalSalesAmount(totalSales);
      setTotalOrdersCount(totalOrders);
      setCompletedOrdersCount(completed);
      setProcessingOrdersCount(processing);
      setPendingOrdersCount(pending);
      setCanceledOrdersCount(canceled);
      setTopProducts(sortedProducts);
      setTopCustomers(sortedCustomers);

    } catch (err) {
      console.error("Fetch Dashboard Data Error:", err.message);
      setError("Gagal memuat data dashboard. Pastikan koneksi Supabase dan tabel sudah benar.");
    } finally {
      setLoading(false);
    }
  }, [generateMonthlySalesData]);

  // Fungsi baru untuk mengambil data gender dari tabel customers saja
  const fetchGenderData = useCallback(async () => {
    try {
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('jenis_kelamin');

      if (customersError) throw customersError;

      const genderCounts = { 'Laki-laki': 0, 'Perempuan': 0, 'Tidak Diketahui': 0 };
      let totalCustomersWithGenderData = 0;

      customersData.forEach(customer => {
        if (customer.jenis_kelamin) {
          totalCustomersWithGenderData++;
          const gender = customer.jenis_kelamin;
          if (gender === 'Laki-laki') {
            genderCounts['Laki-laki']++;
          } else if (gender === 'Perempuan') {
            genderCounts['Perempuan']++;
          } else {
            genderCounts['Tidak Diketahui']++;
          }
        } else {
          genderCounts['Tidak Diketahui']++;
          totalCustomersWithGenderData++;
        }
      });

      if (totalCustomersWithGenderData > 0) {
        setGenderDistribution({
          men: Math.round((genderCounts['Laki-laki'] / totalCustomersWithGenderData) * 100),
          women: Math.round((genderCounts['Perempuan'] / totalCustomersWithGenderData) * 100),
          notIdentify: Math.round((genderCounts['Tidak Diketahui'] / totalCustomersWithGenderData) * 100),
        });
      } else {
        setGenderDistribution({ men: 0, women: 0, notIdentify: 0 });
      }

    } catch (err) {
      console.error("Fetch Gender Data Error:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(selectedPeriod);
    fetchGenderData();
  }, [fetchDashboardData, fetchGenderData, selectedPeriod]);

  // Handle dropdown change
  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  // Komponen Helper untuk Card
  const StatCard = ({ title, value, percentage, isPositive, description, iconClass }) => {
    const percentageColorClass = isPositive ? 'text-green-500' : 'text-red-500';
    const arrowIconClass = isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    const formattedValue = typeof value === 'number' ? (title.includes('Sales') || title.includes('Rp') ? `Rp ${value.toLocaleString('id-ID')}` : value.toLocaleString('id-ID')) : value;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
        <h3 className="text-gray-500 text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{formattedValue}</p>
        {percentage !== undefined && percentage !== null && (
          <p className={`${percentageColorClass} text-sm mt-1`}>
            <>
              <i className={`${arrowIconClass} mr-1`}></i> {Math.abs(Math.round(percentage))}% <span className="text-gray-500">{description}</span>
            </>
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-lg text-gray-600">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

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
              <select
                className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedPeriod}
                onChange={handlePeriodChange}
              >
                <option>Current Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
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

        {/* Summary Cards Grid (Updated with real data) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Sales"
            value={totalSalesAmount}
            percentage={null}
            isPositive={true}
            description={`from completed orders (${selectedPeriod})`}
          />

          <StatCard
            title="Total Orders"
            value={totalOrdersCount}
            percentage={null}
            isPositive={false}
            description={`all statuses (${selectedPeriod})`}
          />

          <StatCard
            title="Completed Orders"
            value={completedOrdersCount}
            percentage={totalOrdersCount > 0 ? (completedOrdersCount / totalOrdersCount) * 100 : 0}
            isPositive={true}
            description="of total orders"
          />

          <StatCard
            title="Processing Orders"
            value={processingOrdersCount}
            percentage={totalOrdersCount > 0 ? (processingOrdersCount / totalOrdersCount) * 100 : 0}
            isPositive={false}
            description="currently in progress"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Activity Chart (tetap mock jika tidak ada data email di Supabase) */}
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
                <p className="text-4xl font-bold text-gray-800">
                  {(emailActivityData[0]?.value || 0) + (emailActivityData[1]?.value || 0)}
                </p>
                <p>Total</p>
              </div>
              <div className="flex justify-around w-full mt-4 text-sm text-gray-600">
                <p><span className="w-3 h-3 inline-block rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[0] }}></span> Email Sent: {emailActivityData[0]?.value || 0}</p>
                <p><span className="w-3 h-3 inline-block rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[1] }}></span> Received: {emailActivityData[1]?.value || 0}</p>
              </div>
            </div>
          </div>

          {/* Sales Data Bar Chart (Updated with real monthly sales) */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-800 text-xl font-semibold mb-4">Sales Performance ({selectedPeriod})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlySalesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                <Legend />
                <Bar dataKey="uv" name="Sales Amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products and Top Customers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Top 5 Best-Selling Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-800 text-xl font-semibold mb-4">Top 5 Best-Selling Products ({selectedPeriod})</h3>
            <ul className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <li key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                      <div>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                      </div>
                    </div>
                    {/* MODIFIKASI INI: Bulatkan profits sebelum ditampilkan */}
                    <span className="text-gray-700 font-bold">Rp {Math.round(product.profits).toLocaleString('id-ID')}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No top products data available for this period.</p>
              )}
            </ul>
          </div>

          {/* Top 5 Customers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-800 text-xl font-semibold mb-4">Top 5 Customers by Spending ({selectedPeriod})</h3>
            <ul className="space-y-4">
              {topCustomers.length > 0 ? (
                topCustomers.map((customer) => (
                  <li key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={customer.imageUrl} alt={customer.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                      <div>
                        <p className="font-semibold text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.totalOrder} orders</p>
                      </div>
                    </div>
                    <span className="text-gray-700 font-bold">Rp {customer.expenses.toLocaleString('id-ID')}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No top customers data available for this period.</p>
              )}
            </ul>
          </div>
        </div>

        {/* START: SECTION FOR GENDER DISTRIBUTION (Now from 'customers' table only) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
                <h3 className="text-gray-800 text-xl font-semibold mb-4">Customer Gender Distribution</h3>
                <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={genderPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {genderPieData.map((entry, index) => (
                                    <Cell key={`cell-gender-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center text-gray-600 mt-2">
                        <p className="text-4xl font-bold text-gray-800">
                          {/* Display total percentage of identified genders, or just 100 if all are unidentified */}
                          {genderDistribution.men + genderDistribution.women + genderDistribution.notIdentify === 0 ? 0 : genderDistribution.men + genderDistribution.women + genderDistribution.notIdentify}%
                        </p>
                        <p>Total Distributed (all customers)</p>
                    </div>
                    <div className="flex justify-around w-full mt-4 text-sm text-gray-600">
                        {genderDistribution.men > 0 && (
                            <p>
                                <span className="w-3 h-3 inline-block rounded-full bg-blue-500 mr-2"></span>
                                Men: {genderDistribution.men}%
                            </p>
                        )}
                        {genderDistribution.women > 0 && (
                            <p>
                                <span className="w-3 h-3 inline-block rounded-full bg-pink-500 mr-2"></span>
                                Women: {genderDistribution.women}%
                            </p>
                        )}
                        {genderDistribution.notIdentify > 0 && (
                            <p>
                                <span className="w-3 h-3 inline-block rounded-full bg-green-500 mr-2"></span>
                                Not Identify: {genderDistribution.notIdentify}%
                            </p>
                        )}
                        {genderDistribution.men === 0 && genderDistribution.women === 0 && genderDistribution.notIdentify === 0 && (
                             <p className="text-gray-500">No gender data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        {/* END: SECTION FOR GENDER DISTRIBUTION */}

      </div>
    </div>
  );
};

export default Dashboard;