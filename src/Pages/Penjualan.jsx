import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from '../supabase'; // Pastikan path ke supabase client Anda benar
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend, // Tambahkan Legend untuk kejelasan grafik
} from "recharts";

const Penjualan = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('Current Month'); // State untuk periode yang dipilih

  // Helper function to get month name
  const getMonthName = (year, monthIndex) => {
    const date = new Date(year, monthIndex, 1);
    return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' }); // Full month name with year
  };

  // Helper function to generate all months within a range, even if no data
  const generateMonthlyData = useCallback((orders, numberOfMonths, endDate) => {
    const dataMap = new Map();
    let currentDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    // Ensure we start from the correct 'end' month and go backwards
    // For example, if numberOfMonths = 2 (Last Month), and endDate is June 28, 2025:
    // First iteration: currentDate = June 1, 2025 (monthKey: 2025-06)
    // Second iteration: currentDate = May 1, 2025 (monthKey: 2025-05)
    // This creates placeholders for June and May.
    for (let i = 0; i < numberOfMonths; i++) {
      const monthKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      dataMap.set(monthKey, {
        bulan: getMonthName(currentDate.getFullYear(), currentDate.getMonth()),
        totalProdukTerjual: 0,
        totalPendapatan: 0
      });
      currentDate.setMonth(currentDate.getMonth() - 1); // Go to previous month
    }

    // Populate with actual order data
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const monthKey = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;

      if (dataMap.has(monthKey)) {
        const currentData = dataMap.get(monthKey);
        currentData.totalPendapatan += (order.total_amount || 0);
        order.order_items.forEach(item => {
            currentData.totalProdukTerjual += (item.quantity || 0);
        });
        dataMap.set(monthKey, currentData);
      }
    });

    // Sort by month ascending (oldest to newest)
    const sortedData = Array.from(dataMap.values()).sort((a, b) => {
      // Parse "NamaBulan Tahun" (e.g., "Juni 2025") into a Date object for comparison
      const dateA = new Date(a.bulan.replace(/(\w+) (\d+)/, '$1 1, $2'));
      const dateB = new Date(b.bulan.replace(/(\w+) (\d+)/, '$1 1, $2'));
      return dateA.getTime() - dateB.getTime();
    });

    return sortedData;
  }, []);

  const fetchSalesData = useCallback(async (period) => {
    setLoading(true);
    setError(null);

    let startDate, endDate;
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Set to end of day for accurate filtering

    let numberOfMonthsToShow = 1; // Default for 'Current Month'

    switch (period) {
      case 'Current Month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        numberOfMonthsToShow = 1;
        break;
      case 'Last Month':
        // For 'Last Month', we want data for the previous month.
        // We also want to show the current month in the chart, even if empty.
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = now; // Fetch orders up to now to include current month if needed
        numberOfMonthsToShow = 2; // Show last month and current month
        break;
      case 'Last 3 Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // Current month - 2 to get 3 months including current
        endDate = now;
        numberOfMonthsToShow = 3;
        break;
      case 'Last 6 Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        endDate = now;
        numberOfMonthsToShow = 6;
        break;
      case 'Last 12 Months':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        endDate = now;
        numberOfMonthsToShow = 12;
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        numberOfMonthsToShow = 1;
    }

    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          created_at,
          total_amount,
          status,
          order_items (
            quantity
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'Completed'); // Only consider completed orders for sales data

      if (ordersError) throw ordersError;

      setSalesData(generateMonthlyData(orders, numberOfMonthsToShow, now));

    } catch (err) {
      console.error("Error fetching sales data:", err.message);
      setError("Failed to load sales data. Please check your Supabase connection and table schema.");
    } finally {
      setLoading(false);
    }
  }, [generateMonthlyData]);

  useEffect(() => {
    fetchSalesData(selectedPeriod);
  }, [fetchSalesData, selectedPeriod]);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  // Memoized calculations to avoid re-calculating on every render if salesData doesn't change
  const totalProduk = useMemo(() => salesData.reduce((sum, d) => sum + d.totalProdukTerjual, 0), [salesData]);
  const totalPendapatan = useMemo(() => salesData.reduce((sum, d) => sum + d.totalPendapatan, 0), [salesData]);
  const rataRataPendapatan = useMemo(() => totalPendapatan / (salesData.length || 1), [totalPendapatan, salesData.length]);

  const bulanMax = useMemo(() => salesData.length > 0 ? salesData.reduce((a, b) => a.totalPendapatan > b.totalPendapatan ? a : b) : null, [salesData]);
  const bulanMin = useMemo(() => salesData.length > 0 ? salesData.reduce((a, b) => a.totalPendapatan < b.totalPendapatan ? a : b) : null, [salesData]);

  const dataDenganPersentase = useMemo(() => {
    return salesData.map((item, index) => { // <-- ADD index here!
      if (index === 0) return { ...item, perubahan: 0 };
      const prevMonthRevenue = salesData[index - 1].totalPendapatan;
      // Avoid division by zero
      const perubahan = prevMonthRevenue !== 0 ? ((item.totalPendapatan - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;
      return { ...item, perubahan: parseFloat(perubahan.toFixed(2)) };
    });
  }, [salesData]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-lg text-gray-600">Memuat data penjualan...</p>
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
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
        Rangkuman Penjualan Bulanan
      </h1>

      <div className="flex justify-end mb-6">
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

      {/* Chart */}
      <div className="w-full h-72 mb-10 bg-white rounded-xl shadow-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          {salesData.length > 0 ? (
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis tickFormatter={(value) => `Rp${(value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`} />
              <Tooltip formatter={(value) => `Rp${value.toLocaleString('id-ID')}`} />
              <Legend />
              <Bar dataKey="totalPendapatan" name="Total Pendapatan" fill="#6366f1" />
            </BarChart>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              No sales data available for the selected period.
            </div>
          )}
        </ResponsiveContainer>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead className="bg-indigo-100 text-indigo-700 uppercase font-semibold tracking-wide">
            <tr>
              <th className="px-6 py-4 text-left">Bulan</th>
              <th className="px-6 py-4 text-right">Produk Terjual</th>
              <th className="px-6 py-4 text-right">Pendapatan (Rp)</th>
              <th className="px-6 py-4 text-right">Perubahan (%)</th>
            </tr>
          </thead>
          <tbody>
            {dataDenganPersentase.length > 0 ? (
              dataDenganPersentase.map((item, index) => ( // <-- Corrected: Pass 'item' and 'index'
                <tr
                  key={item.bulan} // Use item.bulan for key
                  className={`border-b ${bulanMax && item.bulan === bulanMax.bulan // Use item.bulan for comparison
                    ? "bg-green-50"
                    : bulanMin && item.bulan === bulanMin.bulan // Use item.bulan for comparison
                    ? "bg-red-50"
                    : "hover:bg-indigo-50"} transition-colors duration-200`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{item.bulan}</td>
                  <td className="px-6 py-4 text-right">{item.totalProdukTerjual.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-right text-indigo-600 font-bold">
                    Rp {item.totalPendapatan.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    {index === 0 ? '-' : (item.perubahan >= 0 ? "+" : "") + item.perubahan.toLocaleString('id-ID') + "%"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No sales data available for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <span className="text-indigo-600 text-4xl font-extrabold">
            {totalProduk.toLocaleString('id-ID')}
          </span>
          <p className="mt-2 text-gray-600 font-semibold">Total Produk Terjual ({selectedPeriod})</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <span className="text-indigo-600 text-4xl font-extrabold">
            Rp {totalPendapatan.toLocaleString('id-ID')}
          </span>
          <p className="mt-2 text-gray-600 font-semibold">Total Pendapatan ({selectedPeriod})</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <span className="text-indigo-600 text-4xl font-extrabold">
            Rp {rataRataPendapatan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </span>
          <p className="mt-2 text-gray-600 font-semibold">Rata-rata Pendapatan Bulanan ({selectedPeriod})</p>
        </div>
      </div>
    </div>
  );
};

export default Penjualan;