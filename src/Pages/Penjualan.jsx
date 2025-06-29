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
  Legend,
} from "recharts";
import { FaInfoCircle } from "react-icons/fa";
import { Package, DollarSign, TrendingUp, BarChart as BarChartIcon, Table } from 'lucide-react'; // Menggunakan ikon dari lucide-react

const Penjualan = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('Current Month'); // State untuk periode yang dipilih

  // Helper function to get month name
  const getMonthName = useCallback((year, monthIndex) => {
    const date = new Date(year, monthIndex, 1);
    return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  }, []);

  // Helper function to generate all months within a range, even if no data
  const generateMonthlyData = useCallback((orders, numberOfMonths, endDate) => {
    const dataMap = new Map();
    let currentMonth = endDate.getMonth();
    let currentYear = endDate.getFullYear();

    // Create placeholders for the last `numberOfMonths`
    for (let i = 0; i < numberOfMonths; i++) {
      let displayMonth = currentMonth - i;
      let displayYear = currentYear;

      if (displayMonth < 0) {
        displayMonth += 12;
        displayYear -= 1;
      }

      const monthKey = `${displayYear}-${(displayMonth + 1).toString().padStart(2, '0')}`;
      dataMap.set(monthKey, {
        bulan: getMonthName(displayYear, displayMonth),
        totalProdukTerjual: 0,
        totalPendapatan: 0
      });
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
      // Parse month name back to a Date object for accurate sorting
      const dateA = new Date(a.bulan.replace(/(\w+) (\d+)/, '$1 1, $2'));
      const dateB = new Date(b.bulan.replace(/(\w+) (\d+)/, '$1 1, $2'));
      return dateA.getTime() - dateB.getTime();
    });

    return sortedData;
  }, [getMonthName]);

  const fetchSalesData = useCallback(async (period) => {
    setLoading(true);
    setError(null);

    let startDate, endDate;
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Set to end of day for accurate filtering

    let numberOfMonthsToShow = 1;

    switch (period) {
      case 'Current Month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        numberOfMonthsToShow = 1;
        break;
      case 'Last Month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = now;
        numberOfMonthsToShow = 2;
        break;
      case 'Last 3 Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
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

    if (startDate.getTime() > endDate.getTime()) {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    try {
      // console.log("Fetching sales data for period:", period); // Debugging
      // console.log("Start Date:", startDate.toISOString()); // Debugging
      // console.log("End Date:", endDate.toISOString()); // Debugging

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
        .eq('status', 'Completed');

      if (ordersError) {
        console.error("Supabase Error fetching orders:", ordersError);
        throw ordersError;
      }

      // console.log("Raw orders fetched from Supabase:", orders); // Debugging
      // if (orders.length === 0) { // Debugging
      //     console.warn("No orders found for the selected period with status 'Completed'."); // Debugging
      // }

      const processedData = generateMonthlyData(orders, numberOfMonthsToShow, now);
      // console.log("Processed sales data (monthly breakdown):", processedData); // Debugging
      setSalesData(processedData);

    } catch (err) {
      console.error("Error fetching sales data:", err.message);
      setError(`Gagal memuat data penjualan. Pesan: ${err.message}. Pastikan koneksi Supabase dan tabel sudah benar.`);
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
  const rataRataPendapatan = useMemo(() => totalPendapatan / (salesData.length > 0 ? salesData.length : 1), [totalPendapatan, salesData.length]);

  const bulanMax = useMemo(() => salesData.length > 0 ? salesData.reduce((a, b) => a.totalPendapatan > b.totalPendapatan ? a : b) : null, [salesData]);
  const bulanMin = useMemo(() => salesData.length > 0 ? salesData.reduce((a, b) => a.totalPendapatan < b.totalPendapatan ? a : b) : null, [salesData]);

  const dataDenganPersentase = useMemo(() => {
    return salesData.map((item, index) => {
      if (index === 0) return { ...item, perubahan: 0 };
      const prevMonthRevenue = salesData[index - 1].totalPendapatan;
      const perubahan = prevMonthRevenue !== 0 ? ((item.totalPendapatan - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;
      return { ...item, perubahan: parseFloat(perubahan.toFixed(2)) };
    });
  }, [salesData]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-center text-orange-700 mb-8">
        Rangkuman Penjualan
      </h1>

      {/* Filter Periode */}
      <div className="flex justify-end mb-6">
        <div className="relative inline-block">
          <label htmlFor="period-select" className="sr-only">Pilih Periode</label>
          <select
            id="period-select"
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 cursor-pointer"
            value={selectedPeriod}
            onChange={handlePeriodChange}
          >
            <option value="Current Month">Bulan Ini</option>
            <option value="Last Month">Bulan Lalu</option>
            <option value="Last 3 Months">3 Bulan Terakhir</option>
            <option value="Last 6 Months">6 Bulan Terakhir</option>
            <option value="Last 12 Months">12 Bulan Terakhir</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Memuat data penjualan...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative text-center mb-6 shadow-md">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="text-sm mt-2">Coba refresh halaman atau hubungi administrator jika masalah berlanjut.</p>
        </div>
      )}

      {/* Konten Utama (Chart, Table, Summary Cards) */}
      {!loading && !error && (
        <>
          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center">
              <BarChartIcon className="mr-3 text-2xl" /> Grafik Pendapatan Bulanan
            </h2>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                {salesData.length > 0 ? (
                  <BarChart data={dataDenganPersentase} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="bulan" className="text-sm text-gray-700" />
                    <YAxis
                      tickFormatter={(value) => `Rp${(value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`}
                      className="text-sm text-gray-700"
                    />
                    <Tooltip
                      formatter={(value) => `Rp${value.toLocaleString('id-ID')}`}
                      labelFormatter={(label) => `Bulan: ${label}`}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#333', padding: '5px 0' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '15px' }} />
                    <Bar dataKey="totalPendapatan" name="Total Pendapatan" fill="#f97316" radius={[5, 5, 0, 0]} />
                  </BarChart>
                ) : (
                  <div className="flex flex-col justify-center items-center h-full text-gray-500 bg-gray-100 rounded-lg">
                    <FaInfoCircle className="text-3xl mb-3" />
                    <p className="text-lg">Tidak ada data penjualan tersedia untuk periode yang dipilih.</p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabel Detail Penjualan */}
          <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center">
              <Table className="mr-3 text-2xl" /> Detail Penjualan Bulanan
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-100">
                  <tr>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Bulan</th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-orange-800 uppercase tracking-wider">Produk Terjual</th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-orange-800 uppercase tracking-wider">Pendapatan (Rp)</th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-orange-800 uppercase tracking-wider">Perubahan (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataDenganPersentase.length > 0 ? (
                    dataDenganPersentase.map((item, index) => (
                      <tr
                        key={item.bulan}
                        className={`hover:bg-orange-50 transition-colors duration-150 ease-in-out
                          ${bulanMax && item.bulan === bulanMax.bulan
                            ? "bg-green-50"
                            : bulanMin && item.bulan === bulanMin.bulan
                              ? "bg-red-50"
                              : ""
                          }`}
                      >
                        <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">{item.bulan}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{item.totalProdukTerjual.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-4 text-right text-orange-600 font-bold whitespace-nowrap">
                          Rp {item.totalPendapatan.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right text-sm whitespace-nowrap">
                          {index === 0 ? (
                            <span className="text-gray-500">-</span>
                          ) : (
                            <span className={item.perubahan >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                              {item.perubahan >= 0 ? `+${item.perubahan.toLocaleString('id-ID')}%` : `${item.perubahan.toLocaleString('id-ID')}%`}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-gray-500 bg-gray-50">
                        Tidak ada data penjualan untuk ditampilkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center border-b-4 border-orange-500 hover:shadow-2xl transition-shadow duration-300">
              <Package className="text-orange-600 w-12 h-12 mb-3" />
              <span className="text-gray-800 text-4xl font-extrabold">
                {totalProduk.toLocaleString('id-ID')}
              </span>
              <p className="mt-2 text-gray-600 font-semibold text-lg">Total Produk Terjual</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center border-b-4 border-orange-500 hover:shadow-2xl transition-shadow duration-300">
              <DollarSign className="text-orange-600 w-12 h-12 mb-3" />
              <span className="text-gray-800 text-4xl font-extrabold">
                Rp {totalPendapatan.toLocaleString('id-ID')}
              </span>
              <p className="mt-2 text-gray-600 font-semibold text-lg">Total Pendapatan</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center border-b-4 border-orange-500 hover:shadow-2xl transition-shadow duration-300">
              <TrendingUp className="text-orange-600 w-12 h-12 mb-3" />
              <span className="text-gray-800 text-4xl font-extrabold">
                Rp {rataRataPendapatan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
              </span>
              <p className="mt-2 text-gray-600 font-semibold text-lg">Rata-rata Pendapatan Bulanan</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Penjualan;