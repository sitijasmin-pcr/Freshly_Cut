import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../supabase";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

// ============================================================
// CATATAN:
// Halaman ini mengambil data dari tabel `laporan_harian`
// yang diisi melalui ManajemenProduksi.jsx
// Kolom yang digunakan:
//   tanggal, total_modal, total_pendapatan, laba_bersih,
//   pcs_terjual, hpp_per_pcs, total_hasil_pcs
// ============================================================

// Custom Tooltip untuk chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-4 text-sm">
        <p className="font-black text-[#004d33] mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="opacity-60">{entry.name}:</span>
            <span className="font-bold">
              {entry.name.includes("Pcs") || entry.name.includes("Terjual")
                ? `${(entry.value || 0).toLocaleString("id-ID")} pcs`
                : `Rp ${(entry.value || 0).toLocaleString("id-ID")}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Penjualan = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const [activeChart, setActiveChart] = useState("pendapatan");

  // Format tanggal untuk label chart (singkat)
  const formatChartDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  };

  // Format tanggal untuk tabel (lengkap)
  const formatFullDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  };

  const fetchData = useCallback(async (period) => {
    setLoading(true);
    setError(null);

    const now = new Date();
    let startDate;

    switch (period) {
      case "Last 7 Days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        break;
      case "Last 30 Days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 29);
        break;
      case "Last 3 Months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case "Last 6 Months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case "Last 12 Months":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 29);
    }

    try {
      const { data, error: dbError } = await supabase
        .from("laporan_harian")
        .select("tanggal, total_modal, total_pendapatan, laba_bersih, pcs_terjual, hpp_per_pcs, total_hasil_pcs")
        .gte("tanggal", startDate.toISOString().split("T")[0])
        .lte("tanggal", now.toISOString().split("T")[0])
        .order("tanggal", { ascending: true });

      if (dbError) throw dbError;
      setRawData(data || []);
    } catch (err) {
      console.error(err);
      setError(`Gagal memuat data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedPeriod);
  }, [fetchData, selectedPeriod]);

  // Chart data: group by bulan jika period >= 3 bulan, else per hari
  const chartData = useMemo(() => {
    if (!rawData.length) return [];
    const isMonthly = ["Last 3 Months", "Last 6 Months", "Last 12 Months"].includes(selectedPeriod);

    if (isMonthly) {
      const map = new Map();
      rawData.forEach((item) => {
        const d = new Date(item.tanggal);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
        if (!map.has(key)) {
          map.set(key, { label, total_modal: 0, total_pendapatan: 0, laba_bersih: 0, pcs_terjual: 0 });
        }
        const curr = map.get(key);
        curr.total_modal += parseFloat(item.total_modal) || 0;
        curr.total_pendapatan += parseFloat(item.total_pendapatan) || 0;
        curr.laba_bersih += parseFloat(item.laba_bersih) || 0;
        curr.pcs_terjual += parseInt(item.pcs_terjual) || 0;
      });
      return Array.from(map.values());
    } else {
      return rawData.map((item) => ({
        label: formatChartDate(item.tanggal),
        total_modal: parseFloat(item.total_modal) || 0,
        total_pendapatan: parseFloat(item.total_pendapatan) || 0,
        laba_bersih: parseFloat(item.laba_bersih) || 0,
        pcs_terjual: parseInt(item.pcs_terjual) || 0,
      }));
    }
  }, [rawData, selectedPeriod]);

  const summary = useMemo(() => ({
    totalModal: rawData.reduce((s, d) => s + (parseFloat(d.total_modal) || 0), 0),
    totalPendapatan: rawData.reduce((s, d) => s + (parseFloat(d.total_pendapatan) || 0), 0),
    totalLaba: rawData.reduce((s, d) => s + (parseFloat(d.laba_bersih) || 0), 0),
    totalTerjual: rawData.reduce((s, d) => s + (parseInt(d.pcs_terjual) || 0), 0),
    bestDay: rawData.length > 0 ? rawData.reduce((a, b) =>
      (parseFloat(a.laba_bersih) || 0) > (parseFloat(b.laba_bersih) || 0) ? a : b
    ) : null,
    avgPendapatan: rawData.length > 0
      ? rawData.reduce((s, d) => s + (parseFloat(d.total_pendapatan) || 0), 0) / rawData.length
      : 0,
  }), [rawData]);

  const formatRp = (val) =>
    `Rp ${(parseFloat(val) || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

  const chartTabs = [
    { key: "pendapatan", label: "Pendapatan vs Modal", icon: "💰" },
    { key: "laba", label: "Laba Bersih", icon: "📈" },
    { key: "terjual", label: "Produk Terjual", icon: "📦" },
  ];

  const periodOptions = [
    { value: "Last 7 Days", label: "7 Hari Terakhir" },
    { value: "Last 30 Days", label: "30 Hari Terakhir" },
    { value: "Last 3 Months", label: "3 Bulan Terakhir" },
    { value: "Last 6 Months", label: "6 Bulan Terakhir" },
    { value: "Last 12 Months", label: "12 Bulan Terakhir" },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8EE] p-4 md:p-8 text-[#004d33] font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#004d33]/20 pb-6">
          <div>
            <h1 className="text-3xl font-black italic">
              Freshly Cut <span className="text-orange-500">Sales</span>
            </h1>
            <p className="text-sm opacity-60 font-bold mt-1">Rangkuman & Analisis Penjualan</p>
          </div>
          {/* Period Selector */}
          <div className="relative">
            <select
              className="appearance-none bg-white border-2 border-[#004d33]/20 text-[#004d33] py-3 pl-4 pr-10 rounded-2xl font-bold shadow-sm focus:outline-none focus:border-[#004d33]/50 cursor-pointer"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#004d33]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] shadow-sm">
            <div className="w-14 h-14 border-4 border-[#004d33] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black opacity-50">Memuat data penjualan...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-5 rounded-[2rem] mb-6 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-black">Gagal memuat data</p>
              <p className="text-sm mt-1 opacity-70">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Modal Dikeluarkan",
                  value: formatRp(summary.totalModal),
                  icon: "🛒",
                  bg: "bg-blue-50 border-blue-100",
                  textColor: "text-blue-700",
                },
                {
                  label: "Total Pendapatan",
                  value: formatRp(summary.totalPendapatan),
                  icon: "💰",
                  bg: "bg-green-50 border-green-100",
                  textColor: "text-[#004d33]",
                },
                {
                  label: "Total Laba Bersih",
                  value: formatRp(summary.totalLaba),
                  icon: summary.totalLaba >= 0 ? "📈" : "📉",
                  bg: summary.totalLaba >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100",
                  textColor: summary.totalLaba >= 0 ? "text-emerald-700" : "text-red-700",
                },
                {
                  label: "Total Produk Terjual",
                  value: `${summary.totalTerjual.toLocaleString("id-ID")} pcs`,
                  icon: "📦",
                  bg: "bg-orange-50 border-orange-100",
                  textColor: "text-orange-700",
                },
              ].map((card) => (
                <div key={card.label} className={`${card.bg} border-2 rounded-[1.8rem] p-5 shadow-sm`}>
                  <span className="text-3xl">{card.icon}</span>
                  <p className="text-xs font-black uppercase opacity-40 tracking-wider mt-2">{card.label}</p>
                  <p className={`text-xl font-black mt-1 leading-tight ${card.textColor}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Best Day & Avg */}
            {summary.bestDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#004d33] text-white rounded-[2rem] p-6 shadow-lg">
                  <p className="text-xs font-black uppercase opacity-60 tracking-wider">🏆 Hari Terbaik</p>
                  <p className="text-2xl font-black mt-2">{formatFullDate(summary.bestDay.tanggal)}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <div>
                      <p className="opacity-60">Laba</p>
                      <p className="font-black text-green-300">{formatRp(summary.bestDay.laba_bersih)}</p>
                    </div>
                    <div>
                      <p className="opacity-60">Pendapatan</p>
                      <p className="font-black">{formatRp(summary.bestDay.total_pendapatan)}</p>
                    </div>
                    <div>
                      <p className="opacity-60">Terjual</p>
                      <p className="font-black">{summary.bestDay.pcs_terjual} pcs</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border-2 border-[#004d33]/10 rounded-[2rem] p-6 shadow-sm">
                  <p className="text-xs font-black uppercase opacity-40 tracking-wider">📊 Rata-rata Harian</p>
                  <p className="text-2xl font-black mt-2 text-[#004d33]">{formatRp(summary.avgPendapatan)}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <div>
                      <p className="opacity-40 font-semibold">Total Hari</p>
                      <p className="font-black text-[#004d33]">{rawData.length} hari</p>
                    </div>
                    <div>
                      <p className="opacity-40 font-semibold">Rata-rata Terjual</p>
                      <p className="font-black text-orange-600">
                        {rawData.length > 0
                          ? Math.round(summary.totalTerjual / rawData.length)
                          : 0}{" "}
                        pcs/hari
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8">
              {/* Chart Tab Switcher */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-black text-[#004d33]">📊 Grafik Penjualan</h2>
                <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
                  {chartTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveChart(tab.key)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        activeChart === tab.key
                          ? "bg-[#004d33] text-white shadow-md"
                          : "text-gray-400 hover:text-[#004d33]"
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-72">
                {chartData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30">
                    <span className="text-5xl mb-3">📉</span>
                    <p className="font-black">Belum ada data untuk periode ini</p>
                    <p className="text-sm">Tambahkan laporan di halaman Manajemen Produksi</p>
                  </div>
                ) : activeChart === "pendapatan" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="gradPendapatan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#004d33" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#004d33" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradModal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.12} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700, fill: "#004d33" }} />
                      <YAxis
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                        tick={{ fontSize: 11, fontWeight: 700, fill: "#004d33" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: 12, fontWeight: 700, fontSize: 12 }} />
                      <Area
                        type="monotone"
                        dataKey="total_pendapatan"
                        name="Pendapatan"
                        stroke="#004d33"
                        strokeWidth={2.5}
                        fill="url(#gradPendapatan)"
                      />
                      <Area
                        type="monotone"
                        dataKey="total_modal"
                        name="Modal"
                        stroke="#f97316"
                        strokeWidth={2}
                        fill="url(#gradModal)"
                        strokeDasharray="4 2"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : activeChart === "laba" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700, fill: "#004d33" }} />
                      <YAxis
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                        tick={{ fontSize: 11, fontWeight: 700, fill: "#004d33" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: 12, fontWeight: 700, fontSize: 12 }} />
                      <Bar
                        dataKey="laba_bersih"
                        name="Laba Bersih"
                        radius={[6, 6, 0, 0]}
                        fill="#004d33"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700, fill: "#004d33" }} />
                      <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: "#004d33" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: 12, fontWeight: 700, fontSize: 12 }} />
                      <Bar
                        dataKey="pcs_terjual"
                        name="Produk Terjual (pcs)"
                        radius={[6, 6, 0, 0]}
                        fill="#f97316"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Tabel Detail */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-[#004d33] mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">📋</span>
                Detail Laporan Harian
              </h2>
              <div className="overflow-x-auto rounded-2xl border-2 border-gray-50">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-[#004d33]/5">
                      <th className="text-left px-5 py-3 font-black text-xs uppercase tracking-wider text-[#004d33]">Tanggal</th>
                      <th className="text-right px-4 py-3 font-black text-xs uppercase tracking-wider text-[#004d33]">Modal</th>
                      <th className="text-right px-4 py-3 font-black text-xs uppercase tracking-wider text-[#004d33]">Terjual</th>
                      <th className="text-right px-4 py-3 font-black text-xs uppercase tracking-wider text-[#004d33]">HPP/pcs</th>
                      <th className="text-right px-4 py-3 font-black text-xs uppercase tracking-wider text-[#004d33]">Pendapatan</th>
                      <th className="text-right px-4 py-3 font-black text-xs uppercase tracking-wider text-[#004d33]">Laba Bersih</th>
                      <th className="text-right px-4 py-3 font-black text-xs uppercase tracking-wider text-[#004d33]">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rawData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center opacity-30">
                          <span className="text-3xl">📭</span>
                          <p className="font-black mt-2">Belum ada data untuk periode ini</p>
                        </td>
                      </tr>
                    ) : (
                      [...rawData].reverse().map((item, idx) => {
                        const pendapatan = parseFloat(item.total_pendapatan) || 0;
                        const laba = parseFloat(item.laba_bersih) || 0;
                        const margin = pendapatan > 0 ? (laba / pendapatan) * 100 : 0;
                        return (
                          <tr
                            key={idx}
                            className="hover:bg-green-50/30 transition-colors"
                          >
                            <td className="px-5 py-3 font-bold text-[#004d33]">{formatFullDate(item.tanggal)}</td>
                            <td className="px-4 py-3 text-right font-mono text-gray-600">{formatRp(item.total_modal)}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-lg font-black text-xs">
                                {(parseInt(item.pcs_terjual) || 0).toLocaleString("id-ID")} pcs
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-gray-500">{formatRp(item.hpp_per_pcs)}</td>
                            <td className="px-4 py-3 text-right font-bold font-mono text-[#004d33]">{formatRp(item.total_pendapatan)}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={`font-black font-mono ${laba >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {formatRp(laba)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`text-xs font-black px-2 py-1 rounded-lg ${
                                margin >= 20
                                  ? "bg-green-100 text-green-700"
                                  : margin >= 10
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-600"
                              }`}>
                                {margin.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {rawData.length > 0 && (
                    <tfoot>
                      <tr className="bg-[#004d33] text-white">
                        <td className="px-5 py-3 font-black text-sm">TOTAL ({rawData.length} hari)</td>
                        <td className="px-4 py-3 text-right font-black font-mono text-sm">{formatRp(summary.totalModal)}</td>
                        <td className="px-4 py-3 text-right font-black text-sm">{summary.totalTerjual.toLocaleString("id-ID")} pcs</td>
                        <td className="px-4 py-3 text-right font-black text-sm">-</td>
                        <td className="px-4 py-3 text-right font-black font-mono text-sm">{formatRp(summary.totalPendapatan)}</td>
                        <td className="px-4 py-3 text-right font-black font-mono text-sm">{formatRp(summary.totalLaba)}</td>
                        <td className="px-4 py-3 text-right font-black text-sm">
                          {summary.totalPendapatan > 0
                            ? `${((summary.totalLaba / summary.totalPendapatan) * 100).toFixed(1)}%`
                            : "-"}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Penjualan;
