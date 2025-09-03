import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { AuthService } from '../services/auth';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'https://nks-backend-mou5.onrender.com/api';

// Helper to generate slug from title
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      toast.error('Please login first');
      window.location.href = '/login';
      return;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders(),
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } else {
        toast.error(data.error || 'Failed to fetch categories');
        setCategories([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error fetching categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ title: '', description: '' });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({ title: category.title, description: category.description });
    setImageFile(null); // user can choose new image
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          ...AuthService.getAuthHeaders(),
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error deleting category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    // Prepare FormData for file + text
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('slug', slugify(formData.title));
    if (imageFile) payload.append('image', imageFile);

    const url = editingCategory
      ? `${API_BASE_URL}/categories/${editingCategory._id}`
      : `${API_BASE_URL}/categories`;
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...AuthService.getAuthHeaders(), // 🔑 don't set Content-Type here, browser will set it
        },
        body: payload,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
        fetchCategories();
        setIsModalOpen(false);
        setFormData({ title: '', description: '' });
        setImageFile(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <p className="p-6 text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-gray-500">No categories found.</p>
        ) : (
          <Table headers={['Image', 'Title', 'Description', 'Actions']}>
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  {category.image?.url ? (
                    <img
                      src={category.image.url}
                      alt={category.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium">{category.title}</td>
                <td className="px-6 py-4 text-sm">{category.description}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(category._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-gray-500 border rounded p-1"
            />
            {imageFile && (
              <p className="mt-1 text-xs text-gray-600">{imageFile.name}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingCategory ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
