import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { supabase } from '../supabase';
import Swal from 'sweetalert2';
import { Search, Plus, Eye, Edit2, Trash2, X, Download, ShoppingBag, TrendingUp, Receipt, Clock, Printer } from "lucide-react";
import SalesForm from './SalesForm';

// ── Komponen StrukModal (Preview & Print/Download PDF) ──────
const StrukModal = ({ order, onClose }) => {
  const printRef = useRef();
  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=420,height=750');
    if (!printWindow) {
      Swal.fire("Peringatan", "Pop-up diblokir! Mohon izinkan pop-up di browser Anda.", "warning");
      setPrinting(false);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Struk - ${order.receipt || ''}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            width: 80mm;
            max-width: 80mm;
            margin: 0 auto;
            padding: 12px 10px;
            background: white;
            color: #000;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .center { text-align: center; }
          .store-name { font-size: 22px; font-weight: 900; letter-spacing: 3px; text-align: center; }
          .store-tagline { font-size: 10px; text-align: center; color: #555; margin-top: 2px; }
          .receipt-no { font-size: 11px; text-align: center; margin-top: 5px; color: #333; }
          .divider-dashed { border: none; border-top: 1px dashed #000; margin: 8px 0; }
          .divider-solid { border: none; border-top: 2px solid #000; margin: 8px 0; }
          .info-row { display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0; }
          .info-label { color: #555; }
          .info-value { font-weight: bold; }
          .item-block { margin: 5px 0; }
          .item-name { font-weight: bold; font-size: 12px; }
          .item-detail { display: flex; justify-content: space-between; font-size: 11px; color: #333; padding-left: 4px; }
          .total-row { display: flex; justify-content: space-between; align-items: center; }
          .total-label { font-size: 14px; font-weight: 900; }
          .total-value { font-size: 18px; font-weight: 900; }
          .footer-text { font-size: 10px; text-align: center; color: #555; line-height: 1.5; }
          .notes-box { font-size: 10px; color: #555; margin-top: 6px; font-style: italic; }
          @media print {
            body { margin: 0; padding: 8px; }
            @page { margin: 0; size: 80mm auto; }
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    printWindow.document.close();

    // Tunggu load lalu print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
          setPrinting(false);
        }, 500);
      }, 200);
    };

    // Fallback jika onload tidak terpanggil
    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
          setPrinting(false);
        }, 500);
      }
    }, 1000);
  };

  const formatRp = (v) => `Rp ${(parseFloat(v) || 0).toLocaleString('id-ID')}`;
  const tanggal = new Date(order.created_at);
  const subtotal = order.items_detail?.reduce(
    (s, i) => s + (parseFloat(i.subtotal) || (parseFloat(i.price_per_unit) || 0) * (parseInt(i.quantity) || 0)), 0
  ) || 0;

  // Struk HTML content yang akan di-print
  const strukHTML = `
    <div class="store-name">FRESHLY CUT</div>
    <div class="store-tagline">Fresh • Healthy • Delicious</div>
    <div class="receipt-no">No: ${order.receipt || '-'}</div>

    <hr class="divider-dashed">

    <div class="info-row">
      <span class="info-label">Tanggal</span>
      <span class="info-value">${tanggal.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Jam</span>
      <span class="info-value">${tanggal.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    ${order.customer_name ? `
    <div class="info-row">
      <span class="info-label">Pelanggan</span>
      <span class="info-value">${order.customer_name}</span>
    </div>` : ''}

    <hr class="divider-dashed">

    ${(order.items_detail || []).map(item => {
      const total = parseFloat(item.subtotal) || (parseFloat(item.price_per_unit) || 0) * (parseInt(item.quantity) || 0);
      return `
        <div class="item-block">
          <div class="item-name">${item.product_name}</div>
          <div class="item-detail">
            <span>${item.quantity} x ${formatRp(item.price_per_unit)}</span>
            <span>${formatRp(total)}</span>
          </div>
        </div>
      `;
    }).join('')}

    <hr class="divider-solid">

    <div class="total-row">
      <span class="total-label">TOTAL</span>
      <span class="total-value">${formatRp(order.total_amount || subtotal)}</span>
    </div>

    ${order.notes ? `
    <div class="notes-box">Catatan: ${order.notes}</div>` : ''}

    <hr class="divider-dashed" style="margin-top: 12px;">
    <div class="footer-text">
      <div>Terima kasih telah berbelanja!</div>
      <div>Semoga hari Anda menyenangkan 🌿</div>
    </div>
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#FDF8EE] rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-[#004d33]">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4">
          <h2 className="text-lg font-black italic text-[#004d33]">Preview Struk</h2>
          <button onClick={onClose} className="w-9 h-9 bg-[#004d33] text-white rounded-full flex items-center justify-center hover:rotate-90 transition-transform">
            <X size={18} />
          </button>
        </div>

        {/* Struk Preview - tampilan visual */}
        <div className="mx-4 mb-4 bg-white rounded-[1.5rem] border-2 border-dashed border-[#004d33]/30 overflow-hidden">
          <div ref={printRef} dangerouslySetInnerHTML={{ __html: strukHTML }}
            style={{ fontFamily: "'Courier New', monospace", padding: '16px', fontSize: '12px' }} />
        </div>

        {/* Buttons */}
        <div className="px-4 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 border-2 border-[#004d33]/20 rounded-2xl font-black text-[#004d33] hover:bg-[#004d33]/5 transition-all text-sm">
            Tutup
          </button>
          <button onClick={handlePrint} disabled={printing}
            className="flex-1 py-3 bg-[#004d33] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-lg text-sm active:scale-95 disabled:opacity-60">
            {printing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Printer size={16} />
            )}
            {printing ? "Membuka..." : "Print / PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Komponen Utama SalesManagement ─────────────────────────
const SalesManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSalesFormOpen, setIsSalesFormOpen] = useState(false);
  const [currentEditingSale, setCurrentEditingSale] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items (*)`)
        .gte('created_at', `${todayStr}T00:00:00.000Z`)
        .lte('created_at', `${todayStr}T23:59:59.999Z`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map(order => ({
        ...order,
        receipt: order.receipt_id || `INV-${order.id.substring(0, 8).toUpperCase()}`,
        items_detail: order.order_items || [],
        jam: new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }));
      setOrders(formatted);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', `Gagal memuat data: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [todayStr]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Transaksi?', text: 'Data tidak dapat dipulihkan!', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc2626', cancelButtonColor: '#004d33',
      confirmButtonText: 'Hapus', cancelButtonText: 'Batal',
    });
    if (!result.isConfirmed) return;
    try {
      // Kembalikan stok sebelum hapus
      const order = orders.find(o => o.id === id);
      if (order) {
        for (const item of (order.items_detail || [])) {
          const { data: stokData } = await supabase.from('stok_produk').select('stok_saat_ini').eq('produk_id', item.product_id).single();
          if (stokData) {
            await supabase.from('stok_produk').update({
              stok_saat_ini: stokData.stok_saat_ini + item.quantity,
              updated_at: new Date().toISOString()
            }).eq('produk_id', item.product_id);
          }
        }
      }

      await supabase.from('order_items').delete().eq('order_id', id);
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      Swal.fire({ title: 'Terhapus!', icon: 'success', confirmButtonColor: '#004d33', timer: 1500, showConfirmButton: false });
      fetchOrders();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const summary = useMemo(() => ({
    totalTransaksi: orders.length,
    totalPenjualan: orders.reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0),
    totalItem: orders.reduce((s, o) => s + (o.items_detail?.reduce((si, i) => si + (parseInt(i.quantity) || 0), 0) || 0), 0),
    transaksiSelesai: orders.filter(o => o.status === 'Completed').length,
  }), [orders]);

  const filtered = useMemo(() =>
    orders.filter(o =>
      !searchQuery ||
      (o.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.receipt || '').toLowerCase().includes(searchQuery.toLowerCase())
    ), [orders, searchQuery]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const formatRp = (v) => `Rp ${(parseFloat(v) || 0).toLocaleString('id-ID')}`;

  const statusColor = (s) => {
    switch (s) {
      case 'Completed': return 'bg-[#004d33] text-white';
      case 'Processing': return 'bg-orange-500 text-white';
      case 'Pending': return 'bg-yellow-400 text-black';
      case 'Canceled': return 'bg-red-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#FDF8EE] p-4 md:p-8 font-sans text-[#004d33]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-[#004d33]/20 pb-6">
          <div>
            <h1 className="text-3xl font-black italic text-[#004d33]">Freshly Cut <span className="text-orange-500">POS</span></h1>
            <p className="text-sm opacity-60 font-bold mt-1 flex items-center gap-1"><Clock size={13} /> {today}</p>
          </div>
          <button
            onClick={() => { setCurrentEditingSale(null); setIsSalesFormOpen(true); }}
            className="flex items-center gap-2 bg-[#004d33] text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-green-800 active:scale-95 transition-all">
            <Plus size={18} />
            Transaksi Baru
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Transaksi Hari Ini', value: summary.totalTransaksi, unit: 'transaksi', icon: <Receipt size={22} />, bg: 'bg-white border-[#004d33]/10', text: 'text-[#004d33]' },
            { label: 'Total Penjualan Hari Ini', value: formatRp(summary.totalPenjualan), unit: '', icon: <TrendingUp size={22} />, bg: 'bg-[#004d33]', text: 'text-white', sub: 'text-white/70' },
            { label: 'Total Item Terjual', value: summary.totalItem, unit: 'pcs', icon: <ShoppingBag size={22} />, bg: 'bg-orange-50 border-orange-100', text: 'text-orange-700' },
            { label: 'Transaksi Selesai', value: summary.transaksiSelesai, unit: `/ ${summary.totalTransaksi}`, icon: <Receipt size={22} />, bg: 'bg-green-50 border-green-100', text: 'text-green-700' },
          ].map((card, i) => (
            <div key={i} className={`${card.bg} border-2 rounded-[1.8rem] p-5 shadow-sm`}>
              <div className={`${card.text} opacity-70 mb-2`}>{card.icon}</div>
              <p className={`text-xs font-black uppercase tracking-wider ${card.sub || 'opacity-40'}`}>{card.label}</p>
              <p className={`text-2xl font-black mt-1 leading-tight ${card.text}`}>
                {card.value}{card.unit ? <span className="text-sm font-bold ml-1 opacity-60">{card.unit}</span> : ''}
              </p>
            </div>
          ))}
        </div>

        {/* Tabel Transaksi */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Receipt size={18} className="text-[#004d33]" />
              </div>
              <div>
                <h2 className="font-black text-[#004d33] text-lg">Transaksi Hari Ini</h2>
                <p className="text-xs opacity-50 font-semibold">{filtered.length} transaksi ditemukan</p>
              </div>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Cari nama / no. struk..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-green-300 outline-none font-medium text-sm"
                value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#004d33] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold opacity-40">Memuat transaksi...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
              <ShoppingBag size={48} className="mb-4" />
              <p className="font-black text-lg">Belum ada transaksi hari ini</p>
              <p className="text-sm font-semibold mt-1">Klik "Transaksi Baru" untuk memulai</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#004d33]/5 text-[#004d33]">
                    <th className="text-left px-6 py-4 font-black text-xs uppercase tracking-wider">No. Struk</th>
                    <th className="text-left px-4 py-4 font-black text-xs uppercase tracking-wider">Jam</th>
                    <th className="text-left px-4 py-4 font-black text-xs uppercase tracking-wider">Pelanggan</th>
                    <th className="text-left px-4 py-4 font-black text-xs uppercase tracking-wider">Produk</th>
                    <th className="text-center px-4 py-4 font-black text-xs uppercase tracking-wider">Pcs</th>
                    <th className="text-right px-4 py-4 font-black text-xs uppercase tracking-wider">Total</th>
                    <th className="text-center px-4 py-4 font-black text-xs uppercase tracking-wider">Status</th>
                    <th className="text-center px-4 py-4 font-black text-xs uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map(order => {
                    const totalPcs = order.items_detail?.reduce((s, i) => s + (parseInt(i.quantity) || 0), 0) || 0;
                    const produkNames = order.items_detail?.map(i => i.product_name).join(', ') || '-';
                    return (
                      <tr key={order.id} className="hover:bg-green-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-black text-[#004d33] text-xs bg-green-100 px-2 py-1 rounded-lg">{order.receipt}</span>
                        </td>
                        <td className="px-4 py-4 font-bold text-gray-500 text-xs flex items-center gap-1">
                          <Clock size={12} /> {order.jam}
                        </td>
                        <td className="px-4 py-4 font-bold text-[#004d33]">
                          {order.customer_name || <span className="opacity-30 italic">-</span>}
                        </td>
                        <td className="px-4 py-4 text-gray-600 max-w-[180px]">
                          <span className="truncate block text-xs font-medium" title={produkNames}>{produkNames}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-lg font-black text-xs">{totalPcs} pcs</span>
                        </td>
                        <td className="px-4 py-4 text-right font-black font-mono text-[#004d33]">{formatRp(order.total_amount)}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusColor(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-1.5 justify-center">
                            <button onClick={() => setSelectedOrder(order)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all" title="Lihat Struk">
                              <Eye size={14} />
                            </button>
                            <button onClick={() => { setCurrentEditingSale(order); setIsSalesFormOpen(true); }} className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-all" title="Edit">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(order.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all" title="Hapus">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#004d33] text-white">
                    <td colSpan={4} className="px-6 py-4 font-black text-sm">TOTAL HARI INI ({filtered.length} transaksi)</td>
                    <td className="px-4 py-4 text-center font-black text-sm">{summary.totalItem} pcs</td>
                    <td className="px-4 py-4 text-right font-black font-mono text-sm">{formatRp(summary.totalPenjualan)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="p-5 border-t border-gray-100 flex justify-between items-center">
              <p className="text-xs font-bold text-gray-400">Halaman {currentPage} dari {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                  className="px-4 py-2 bg-gray-50 rounded-xl font-bold text-xs disabled:opacity-40 hover:bg-gray-100 transition-all">← Prev</button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                  className="px-4 py-2 bg-[#004d33] text-white rounded-xl font-bold text-xs disabled:opacity-40 hover:bg-green-800 transition-all">Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && <StrukModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

      {isSalesFormOpen && (
        <SalesForm
          onClose={() => setIsSalesFormOpen(false)}
          onSuccess={(order) => {
            setIsSalesFormOpen(false);
            fetchOrders();
            setSelectedOrder({
              ...order,
              receipt: order.receipt_id,
              items_detail: order.order_items,
            });
          }}
          initialOrderData={currentEditingSale}
        />
      )}
    </div>
  );
};

export default SalesManagement;
