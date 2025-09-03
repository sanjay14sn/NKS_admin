import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { AuthService } from '../services/auth';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'https://nks-backend-mou5.onrender.com/api';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    price: '',
    retailerPrice: '',
    stock: '',
    category: '',
    description: '',
    aboutProduct: '',
    images: [] as File[],
    isFeatured: false,
    isTrending: false,
  });

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      toast.error('Please login first');
      window.location.href = '/login';
      return;
    }
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: AuthService.getAuthHeaders(),
      });
      const data = await response.json();
      if (response.ok) setCategories(data.categories || []);
      else toast.error(data.error || 'Failed to fetch categories');
    } catch (error) {
      console.error(error);
      toast.error('Network error fetching categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: AuthService.getAuthHeaders(),
      });
      const data = await response.json();
      if (response.ok) setProducts(data.products || []);
      else toast.error(data.error || 'Failed to fetch products');
    } catch (error) {
      console.error(error);
      toast.error('Network error fetching products');
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      price: '',
      retailerPrice: '',
      stock: '',
      category: '',
      description: '',
      aboutProduct: '',
      images: [],
      isFeatured: false,
      isTrending: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      retailerPrice: product.retailerPrice,
      stock: product.stock,
      category: product.category?._id || '',
      description: product.description || '',
      aboutProduct: product.aboutProduct || '',
      images: [],
      isFeatured: product.isFeatured || false,
      isTrending: product.isTrending || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error deleting product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const form = new FormData();
  form.append('title', formData.title);
  form.append('price', formData.price);
  form.append('retailerPrice', formData.retailerPrice);
  form.append('stock', formData.stock);
  form.append('category', formData.category);
  form.append('description', formData.description);
  form.append('aboutProduct', formData.aboutProduct);
  form.append('isFeatured', String(formData.isFeatured));
  form.append('isTrending', String(formData.isTrending));

  formData.images.forEach((file: File) => form.append('images', file));

  const url = editingProduct
    ? `${API_BASE_URL}/products/${editingProduct._id}`
    : `${API_BASE_URL}/products`;
  const method = editingProduct ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...AuthService.getAuthHeaders(),
        // ❌ DO NOT set "Content-Type" here, let browser set it
      },
      body: form,
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
      fetchProducts();
      setIsModalOpen(false);
    } else {
      toast.error(data.error || 'Operation failed');
    }
  } catch (error) {
    console.error(error);
    toast.error('Network error, operation failed');
  }
};

  return (
    <div className="space-y-6 p-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table headers={['ID', 'Title', 'Price', 'Retailer Price', 'Stock', 'Category', 'Featured', 'Trending', 'Actions']}>
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{product._id}</td>
              <td className="px-6 py-4 font-medium">{product.title}</td>
              <td className="px-6 py-4">${product.price}</td>
              <td className="px-6 py-4 text-green-600 font-medium">${product.retailerPrice}</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">{product.category?.title}</td>
              <td className="px-6 py-4">{product.isFeatured ? 'Yes' : 'No'}</td>
              <td className="px-6 py-4">{product.isTrending ? 'Yes' : 'No'}</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Input label="Price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
          <Input label="Retailer Price" type="number" value={formData.retailerPrice} onChange={(e) => setFormData({ ...formData, retailerPrice: e.target.value })} required />
          <Input label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Input label="About Product" value={formData.aboutProduct} onChange={(e) => setFormData({ ...formData, aboutProduct: e.target.value })} />

          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4"
              />
              <span>Featured</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                className="h-4 w-4"
              />
              <span>Trending</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, images: Array.from(e.target.files || []) })
              }
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingProduct ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
