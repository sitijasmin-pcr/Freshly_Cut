import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Pastikan path ke supabase client Anda benar
import Swal from 'sweetalert2'; // Swal sudah tersedia secara global jika CDN di public/index.html

const SalesForm = ({ onClose, onSuccess, initialOrderData }) => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Coffee');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderList, setOrderList] = useState([]);
  const [orderType, setOrderType] = useState('Dine In');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customerType, setCustomerType] = useState('Indoor');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productFetchError, setProductFetchError] = useState(null);

  const productCategories = [
    "Food and Bakery", "Classic Coffee", "Non Coffee", "Fruity Series",
    "Cheese Latte Series", "Cloud Series", "Jujutsu Kaisen Series",
    "UPSETDUCK X PISTACHIO SERIES", "Pesta Kuliner Banting Harga",
    "SPECIAL OFFER", "Flash Sale Makan Harian",
  ];

  useEffect(() => {
    const fetchProductsFromSupabase = async () => {
      setLoadingProducts(true);
      setProductFetchError(null);
      try {
        const { data, error } = await supabase.from('produk').select('*');
        if (error) throw error;
        setProducts(data);
        if (data.length > 0 && !data.some(p => p.kategori === activeCategory)) {
            setActiveCategory(data[0].kategori);
        }
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setProductFetchError("Gagal memuat daftar produk. Pastikan tabel 'produk' ada dan Supabase terhubung dengan benar.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProductsFromSupabase();
  }, []);

  useEffect(() => {
    if (initialOrderData) {
      setCustomerName(initialOrderData.name || '');
      setOrderType(initialOrderData.order_type || 'Dine In');
      setTableNumber(initialOrderData.table_number || '');
      setCustomerType(initialOrderData.customer_type || 'Indoor');
      setOrderList([]);
    } else {
      setCustomerName('');
      setOrderType('Dine In');
      setTableNumber('');
      setCustomerType('Indoor');
      setOrderList([]);
    }
  }, [initialOrderData]);

  const subtotal = orderList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.10;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const filteredProducts = products.filter(product =>
    product.kategori === activeCategory &&
    product.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (productToAdd) => {
    setOrderList(prevList => {
      const existingItem = prevList.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevList.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevList, {
          id: productToAdd.id,
          name: productToAdd.nama,
          price: productToAdd.harga,
          imageUrl: productToAdd.gambar,
          quantity: 1,
          modifiers: []
        }];
      }
    });
  };

  const updateOrderQuantity = (id, delta) => {
    setOrderList(prevList => {
      const updatedList = prevList.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + delta }
          : item
      ).filter(item => item.quantity > 0);
      return updatedList;
    });
  };

  const removeItem = (id) => {
    setOrderList(prevList => prevList.filter(item => item.id !== id));
  };

  const handlePlaceOrder = async () => {
    if (orderList.length === 0) {
      Swal.fire('Pesanan Kosong', 'Harap tambahkan item ke pesanan terlebih dahulu.', 'warning');
      return;
    }

    if (!customerName) {
      Swal.fire('Nama Pelanggan Kosong', 'Harap masukkan nama pelanggan.', 'warning');
      return;
    }

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          order_type: orderType,
          table_number: tableNumber,
          customer_type: customerType,
          status: 'Processing',
          total_amount: total,
        })
        .select();

      if (orderError) throw orderError;

      const newOrderId = orderData[0].id;

      const orderItemsToInsert = orderList.map(item => ({
        order_id: newOrderId,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price_per_unit: item.price
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (orderItemsError) throw orderItemsError;

      Swal.fire('Berhasil!', `Pesanan untuk ${customerName} berhasil ditempatkan. Total: Rp ${total.toLocaleString('id-ID')}`, 'success');

      setOrderList([]);
      setCustomerName('');
      setTableNumber('');
      setCustomerType('Indoor');
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error placing order:", err.message);
      Swal.fire('Gagal!', `Terjadi kesalahan saat menempatkan pesanan: ${err.message}. Mohon cek koneksi Supabase Anda.`, 'error');
    }
  };

  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-inter">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col relative animate-fade-in-up">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light z-20"
          onClick={onClose}
          title="Tutup"
        >
          &times;
        </button>

        <div className="flex flex-1 p-4 bg-gray-100 overflow-hidden">
          <div className="w-2/3 bg-white rounded-lg shadow-md p-6 mr-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-1/2 mr-4">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <button className="bg-green-100 text-green-700 p-3 rounded-lg hover:bg-green-200 transition-colors duration-200">
                <i className="fas fa-sliders-h"></i>
              </button>
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-2 mb-6 custom-scrollbar-horizontal">
              {productCategories.map(category => {
                const itemCount = products.filter(p => p.kategori === category).length;
                return (
                  <button
                    key={category}
                    className={`flex-shrink-0 py-2 px-5 rounded-full font-semibold text-sm transition-colors duration-200 whitespace-nowrap
                      ${activeCategory === category
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category} <span className="ml-1 text-xs">({itemCount} item)</span>
                  </button>
                );
              })}
              <div className="flex-shrink-0 flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm ml-auto">
                <i className="fas fa-exclamation-circle mr-2"></i> Perlu restock <span className="font-bold ml-1">2</span>
              </div>
            </div>

            {loadingProducts ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <p className="ml-3 text-lg text-gray-600">Memuat produk...</p>
              </div>
            ) : productFetchError ? (
              <div className="flex-1 flex items-center justify-center text-red-500 text-center">
                <i className="fas fa-exclamation-triangle mr-2"></i> {productFetchError}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500 py-10">
                Tidak ada produk ditemukan di kategori ini atau dengan pencarian Anda.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-gray-50 rounded-lg shadow-sm p-3 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => addToOrder(product)}
                  >
                    <img
                      src={product.gambar || 'https://placehold.co/100x100/A0522D/FFFFFF?text=No+Image'}
                      alt={product.nama}
                      className="w-24 h-24 object-cover rounded-md mb-2"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/A0522D/FFFFFF?text=No+Image'; }}
                    />
                    <p className="font-semibold text-lg">{product.nama}</p>
                    <p className="text-green-600 font-bold">Rp {product.harga?.toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Struk Pembelian</h2>

            <div className="flex justify-around bg-gray-100 p-1 rounded-lg mb-4">
              {['Dine In', 'Take Away', 'Order Online'].map(type => (
                <button
                  key={type}
                  className={`flex-1 py-2 rounded-md font-semibold text-sm transition-colors duration-200
                    ${orderType === type ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setOrderType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Masukkan nama pelanggan"
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">Meja</label>
                  <input
                    type="text"
                    id="tableNumber"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Nomor meja"
                  />
                </div>
                <div className="flex-1 relative">
                  <label htmlFor="customerType" className="block text-sm font-medium text-gray-700 mb-1">BIZ</label>
                  <select
                    id="customerType"
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-green-500 pr-8"
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none mt-3"></i>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-b border-gray-200 pb-4 mb-4">
              {orderList.length === 0 ? (
                <div className="text-center text-gray-500 py-10">Belum ada item di pesanan.</div>
              ) : (
                orderList.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-300"
                        onClick={() => updateOrderQuantity(item.id, -1)}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button
                        className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-300"
                        onClick={() => updateOrderQuantity(item.id, 1)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <p className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    <button
                        className="text-red-500 hover:text-red-700 ml-2"
                        onClick={() => removeItem(item.id)}
                    >
                        <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Pajak ({taxRate * 100}%)</span>
                <span>Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              className="bg-green-600 text-white py- rounded-lg text-lg font-bold flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors duration-200"
              onClick={handlePlaceOrder}
              disabled={orderList.length === 0}
            >
              <i className="fas fa-arrow-right mr-3"></i> Tempatkan Pesanan Rp {total.toLocaleString('id-ID')}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default SalesForm;
