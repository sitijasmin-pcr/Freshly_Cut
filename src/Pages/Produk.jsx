import React, { useState, useEffect } from "react";

export default function ProductPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [product, setProduct] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    images: [],
    sizes: [],
    price: "",
    discount: "",
  });
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const dummyProducts = [
      {
        id: "P001",
        name: "Sneakers",
        category: "makanan", // diubah dari "roti"
        description: "High-quality sports sneakers",
        images: ["https://via.placeholder.com/100x100.png?text=Alpha"],
        sizes: ["6", "7", "8"],
        price: "120",
        discount: "10",
      },
      {
        id: "P002",
        name: "Classic Heels",
        category: "minuman coffee",
        description: "Elegant and comfortable heels",
        images: ["https://via.placeholder.com/100x100.png?text=Heels"],
        sizes: ["5", "6.5"],
        price: "95",
        discount: "15",
      },
      {
        id: "P003",
        name: "Cool Drink",
        category: "minuman non coffee", // disamakan dengan dropdown value
        description: "Refreshing beverage",
        images: ["https://via.placeholder.com/100x100.png?text=Drink"],
        sizes: ["M"],
        price: "50",
        discount: "5",
      },
    ];
    setProductList(dummyProducts);
  }, []);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddSize = (size) => {
    if (!product.sizes.includes(size)) {
      setProduct({ ...product, sizes: [...product.sizes, size] });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageURLs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setProduct({ ...product, images: [...product.images, ...newImageURLs] });
  };

  const handleSave = () => {
    if (!product.name || !product.price)
      return alert("Please fill required fields");

    const imageURLs = product.images.map((img) =>
      typeof img === "string" ? img : img.preview
    );

    if (editingIndex !== null) {
      const updatedProduct = { ...product, images: imageURLs };
      const updatedList = [...productList];
      updatedList[editingIndex] = updatedProduct;
      setProductList(updatedList);
      setEditingIndex(null);
    } else {
      const newId = `P${String(productList.length + 1).padStart(3, "0")}`;
      setProductList([
        ...productList,
        { ...product, id: newId, images: imageURLs },
      ]);
    }

    resetForm();
  };

  const handleEdit = (index) => {
    const existing = productList[index];
    const mappedImages = existing.images.map((url) =>
      typeof url === "string" ? { preview: url } : url
    );
    setProduct({ ...existing, images: mappedImages });
    setEditingIndex(index);
    setIsSidebarOpen(true);
  };

  const handleDelete = (index) => {
    const updatedList = productList.filter((_, i) => i !== index);
    setProductList(updatedList);
  };

  const resetForm = () => {
    setProduct({
      id: "",
      name: "",
      category: "",
      description: "",
      images: [],
      sizes: [],
      price: "",
      discount: "",
    });
    setEditingIndex(null);
    setIsSidebarOpen(false);
  };

  const countByCategory = (category) =>
    productList.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    ).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-orange-500 mb-4">Product Page</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Makanan</h2>{" "}
          {/* diubah dari "Roti" */}
          <p className="text-xl">{countByCategory("makanan")}</p>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Minuman Coffee</h2>
          <p className="text-xl">{countByCategory("minuman coffee")}</p>
        </div>
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Minuman Non Coffee</h2>
          <p className="text-xl">{countByCategory("minuman non coffee")}</p>
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>

      <table className="w-full mt-6 table-auto border border-gray-200">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt="thumb"
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.category}</td>
              <td className="px-4 py-2">Rp.{item.price}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isSidebarOpen && (
        <div className="fixed top-0 right-0 w-full sm:w-[480px] h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
          <button
            onClick={() => resetForm()}
            className="text-gray-500 text-xl mb-4 float-right"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">
            {editingIndex !== null ? "Edit Product" : "Add Product"}
          </h2>

          <input
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-3"
          />
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-3"
          >
            <option value="">Select Category</option>
            <option value="makanan">Makanan</option>
            <option value="minuman coffee">Minuman Coffee</option>
            <option value="minuman non coffee">Minuman Non Coffee</option>
          </select>

          <textarea
            name="description"
            placeholder="Description (max 100 chars)"
            maxLength={100}
            value={product.description}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-3"
          />

          <label className="block mb-2 font-medium">Product Images</label>
          <label className="inline-block bg-orange-500 text-white px-4 py-2 rounded cursor-pointer mb-3">
            Choose Images
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <div className="flex gap-2 mb-4 flex-wrap">
            {product.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={typeof img === "string" ? img : img.preview}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  onClick={() => {
                    const newImages = product.images.filter(
                      (_, i) => i !== idx
                    );
                    setProduct({ ...product, images: newImages });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <label className="block mb-2">Add Size</label>
          <div className="flex gap-2 mb-3">
            {["5", "5.5", "6", "6.5", "7"].map((s) => (
              <button
                key={s}
                onClick={() => handleAddSize(s)}
                className="border px-2 py-1 rounded"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.sizes.map((s, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">
                {s}
              </span>
            ))}
          </div>

          <input
            name="price"
            type="number"
            placeholder="Pricing (Rp)"
            value={product.price}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-3"
          />

          <input
            name="discount"
            placeholder="Discount (%)"
            value={product.discount}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-6"
          />

          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              {editingIndex !== null ? "Update" : "Save"}
            </button>
            <button
              onClick={resetForm}
              className="border border-gray-400 text-gray-600 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
