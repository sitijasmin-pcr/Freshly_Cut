import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Buat Context
export const CartContext = createContext();

// 2. Buat Komponen Provider
export const CartProvider = ({ children }) => {
  // Inisialisasi keranjang dari localStorage atau array kosong
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("cartItems");
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Gagal mengurai item keranjang dari localStorage:", error);
      return [];
    }
  });

  // Simpan item keranjang ke localStorage setiap kali ada perubahan
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Jika item sudah ada, perbarui kuantitasnya
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Jika item baru, tambahkan ke keranjang dengan kuantitas 1 dan tingkat gula default
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.nama, // Sesuaikan dengan nama kolom dari Supabase Anda
            price: product.harga, // Sesuaikan dengan nama kolom dari Supabase Anda
            quantity: 1,
            sugarLevel: "Sedang", // Tingkat gula default
            image: product.gambar || "/img/default-product.png", // Gunakan 'gambar' dari Supabase, dengan fallback
          },
        ];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) } // Pastikan kuantitas tidak kurang dari 0
            : item
        )
        .filter((item) => item.quantity > 0) // Hapus item jika kuantitasnya menjadi 0
    );
  };

  const updateSugarLevel = (id, newSugarLevel) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, sugarLevel: newSugarLevel } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartContextValue = {
    cartItems,
    addToCart,
    updateQuantity,
    updateSugarLevel,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Buat Custom Hook untuk konsumsi yang lebih mudah
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return context;
};