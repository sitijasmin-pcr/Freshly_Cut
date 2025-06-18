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
    discount: ""
  });
  const [productList, setProductList] = useState([]);

  // Dummy Data
  useEffect(() => {
    const dummyProducts = [
      {
        id: "P001",
        name: "Sneakers",
        category: "roti",
        description: "High-quality sports sneakers",
        images: ["https://via.placeholder.com/100x100.png?text=Alpha"],
        sizes: ["6", "7", "8"],
        price: "120",
        discount: "10"
      },
      {
        id: "P002",
        name: "Classic Heels",
        category: "minuman coffee",
        description: "Elegant and comfortable heels",
        images: ["https://via.placeholder.com/100x100.png?text=Heels"],
        sizes: ["5", "6.5"],
        price: "95",
        discount: "15"
      },
      {
        id: "P003",
        name: "Cool Drink",
        category: "minuman non-coffee",
        description: "Refreshing beverage",
        images: ["https://via.placeholder.com/100x100.png?text=Drink"],
        sizes: ["M"],
        price: "50",
        discount: "5"
      }
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
    setProduct({ ...product, images: [...product.images, ...files] });
  };

  const handleSave = () => {
    if (!product.name || !product.price)
      return alert("Please fill required fields");

    if (editingIndex !== null) {
      const updatedList = [...productList];
      updatedList[editingIndex] = product;
      setProductList(updatedList);
      setEditingIndex(null);
    } else {
      setProductList([...productList, { ...product, id: `P${Date.now()}` }]);
    }
    resetForm();
  };

  const handleEdit = (index) => {
    setProduct(productList[index]);
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
      // gender: "",
      description: "",
      images: [],
      sizes: [],
      price: "",
      discount: ""
    });
    setIsSidebarOpen(false);
  };

  const countByCategory = (category) =>
    productList.filter((item) => item.category.toLowerCase() === category.toLowerCase()).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-orange-500 mb-4">Product Page</h1>

      {/* Category Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Roti</h2>
          <p className="text-xl">{countByCategory("roti")}</p>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Minuman Coffee</h2>
          <p className="text-xl">{countByCategory("minuman coffee")}</p>
        </div>
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Minuman Non-Coffee</h2>
          <p className="text-xl">{countByCategory("minuman non-coffee")}</p>
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>

      {/* Product Table */}
      <table className="w-full mt-6 table-auto border border-gray-200">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Category</th>
            {/* <th className="px-4 py-2">Gender</th> */}
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
                  <img src={typeof item.images[0] === 'string' ? item.images[0] : URL.createObjectURL(item.images[0])} alt="thumb" className="w-12 h-12 object-cover rounded" />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.category}</td>
              {/* <td className="px-4 py-2">{item.gender}</td> */}
              <td className="px-4 py-2">${item.price}</td>
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

      {/* Sidebar Form */}
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
          <input
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-3"
          />
          {/* <input
            name="gender"
            placeholder="Gender"
            value={product.gender}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-3"
          /> */}
          <textarea
            name="description"
            placeholder="Description (max 100 chars)"
            maxLength={100}
            value={product.description}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-3"
          />

          <label className="block mb-2">Product Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="mb-3"
          />
          <div className="flex gap-2 mb-4">
            {product.images.map((file, idx) => (
              <img
                key={idx}
                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                alt="product"
                className="w-16 h-16 object-cover rounded"
              />
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
              <span
                key={i}
                className="bg-gray-200 px-2 py-1 rounded text-sm"
              >
                {s}
              </span>
            ))}
          </div>

          <input
            name="price"
            placeholder="Pricing ($)"
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
