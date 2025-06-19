import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Penjualan = () => {
  const dataBulanan = [
    { bulan: "Januari", totalProdukTerjual: 1050, totalPendapatan: 21000000 },
    { bulan: "Februari", totalProdukTerjual: 980, totalPendapatan: 19600000 },
    { bulan: "Maret", totalProdukTerjual: 1230, totalPendapatan: 24600000 },
    { bulan: "April", totalProdukTerjual: 1100, totalPendapatan: 22000000 },
    { bulan: "Mei", totalProdukTerjual: 1150, totalPendapatan: 23000000 },
    { bulan: "Juni", totalProdukTerjual: 1000, totalPendapatan: 20000000 },
    { bulan: "Juli", totalProdukTerjual: 1250, totalPendapatan: 25000000 },
    { bulan: "Agustus", totalProdukTerjual: 1300, totalPendapatan: 26000000 },
    { bulan: "September", totalProdukTerjual: 1280, totalPendapatan: 25600000 },
    { bulan: "Oktober", totalProdukTerjual: 1400, totalPendapatan: 28000000 },
    { bulan: "November", totalProdukTerjual: 1500, totalPendapatan: 30000000 },
    { bulan: "Desember", totalProdukTerjual: 1700, totalPendapatan: 34000000 },
  ];

  const totalProduk = dataBulanan.reduce((sum, d) => sum + d.totalProdukTerjual, 0);
  const totalPendapatan = dataBulanan.reduce((sum, d) => sum + d.totalPendapatan, 0);
  const rataRataPendapatan = totalPendapatan / dataBulanan.length;

  const bulanMax = dataBulanan.reduce((a, b) => a.totalPendapatan > b.totalPendapatan ? a : b);
  const bulanMin = dataBulanan.reduce((a, b) => a.totalPendapatan < b.totalPendapatan ? a : b);

  const dataDenganPersentase = dataBulanan.map((item, index) => {
    if (index === 0) return { ...item, perubahan: 0 };
    const perubahan = ((item.totalPendapatan - dataBulanan[index - 1].totalPendapatan) /
      dataBulanan[index - 1].totalPendapatan) * 100;
    return { ...item, perubahan: perubahan.toFixed(2) };
  });

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
        Rangkuman Penjualan Bulanan
      </h1>

      {/* Chart */}
      <div className="w-full h-72 mb-10 bg-white rounded-xl shadow-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataBulanan}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bulan" />
            <YAxis tickFormatter={(value) => `Rp${(value / 1000000)}jt`} />
            <Tooltip formatter={(value) => `Rp${value.toLocaleString()}`} />
            <Bar dataKey="totalPendapatan" fill="#6366f1" />
          </BarChart>
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
            {dataDenganPersentase.map(({ bulan, totalProdukTerjual, totalPendapatan, perubahan }) => (
              <tr
                key={bulan}
                className={`border-b ${bulan === bulanMax.bulan
                  ? "bg-green-50"
                  : bulan === bulanMin.bulan
                  ? "bg-red-50"
                  : "hover:bg-indigo-50"} transition-colors duration-200`}
              >
                <td className="px-6 py-4 font-medium text-gray-800">{bulan}</td>
                <td className="px-6 py-4 text-right">{totalProdukTerjual.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-indigo-600 font-bold">
                  Rp {totalPendapatan.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-600">
                  {perubahan >= 0 ? "+" : ""}
                  {perubahan}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <span className="text-indigo-600 text-4xl font-extrabold">
            {totalProduk.toLocaleString()}
          </span>
          <p className="mt-2 text-gray-600 font-semibold">Total Produk Terjual Tahun Ini</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <span className="text-indigo-600 text-4xl font-extrabold">
            Rp {totalPendapatan.toLocaleString()}
          </span>
          <p className="mt-2 text-gray-600 font-semibold">Total Pendapatan Tahun Ini</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <span className="text-indigo-600 text-4xl font-extrabold">
            Rp {rataRataPendapatan.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <p className="mt-2 text-gray-600 font-semibold">Rata-rata Pendapatan Bulanan</p>
        </div>
      </div>
    </div>
  );
};

export default Penjualan;
