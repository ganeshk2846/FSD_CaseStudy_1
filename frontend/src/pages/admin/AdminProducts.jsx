import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/admin/AdminProducts.css";

const emptyForm = {
  title: "", description: "", price: "",
  category: "", stock: "", thumbnail: "", images: ""
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null = add mode
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    API.get("/admin/products")
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      stock: product.stock || "",
      thumbnail: product.thumbnail || "",
      images: (product.images || []).join(", "),
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images ? form.images.split(",").map(s => s.trim()) : [],
    };
    try {
      if (editProduct) {
        await API.put(`/admin/products/${editProduct._id}`, payload);
      } else {
        await API.post("/admin/products", payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/products/${id}`);
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products">
      <div className="ap-header">
        <input
          className="ap-search"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="ap-add-btn" onClick={openAdd}>+ Add Product</button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading products...</div>
      ) : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img className="ap-thumb" src={p.thumbnail} alt={p.title} />
                  </td>
                  <td className="ap-title">{p.title}</td>
                  <td><span className="ap-category">{p.category}</span></td>
                  <td>${p.price}</td>
                  <td>
                    <span className={`stock-badge ${p.stock === 0 ? "out" : p.stock < 10 ? "low" : "ok"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="ap-actions">
                    <button className="btn-edit" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn-delete" onClick={() => setDeleteId(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="empty-msg">No products found</p>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{editProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <label>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
              </div>
              <div className="form-two-col">
                <div className="form-row">
                  <label>Price *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <label>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row">
                <label>Category *</label>
                <input name="category" value={form.category} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Thumbnail URL</label>
                <input name="thumbnail" value={form.thumbnail} onChange={handleChange} />
              </div>
              {form.thumbnail && (
                <img src={form.thumbnail} alt="preview" className="thumb-preview" />
              )}
              <div className="form-row">
                <label>Image URLs (comma separated)</label>
                <input name="images" value={form.images} onChange={handleChange} placeholder="url1, url2, url3" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? "Saving..." : editProduct ? "Update" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-delete-confirm" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
