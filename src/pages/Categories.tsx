import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Cropper, { Area } from 'react-easy-crop';
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

type Category = {
  _id: string;
  title: string;
  description?: string;
  image?: { url: string };
};

type FormDataType = {
  title: string;
  description: string;
};

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormDataType>({ title: '', description: '' });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Image crop states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);

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
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ title: category.title, description: category.description || '' });
    setImageFile(null);
    setImagePreview(category.image?.url || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders(),
        },
      });

      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error deleting category');
    }
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Convert cropped area to a File
  const getCroppedImage = async (imageSrc: string, cropPixels: Area): Promise<File | null> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
        } else {
          resolve(null);
        }
      }, 'image/jpeg');
    });
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setShowCropper(true);
  };

  const handleCropConfirm = async () => {
    if (imagePreview && croppedAreaPixels) {
      const cropped = await getCroppedImage(imagePreview, croppedAreaPixels);
      if (cropped) {
        setImageFile(cropped);
        setImagePreview(URL.createObjectURL(cropped));
      }
    }
    setShowCropper(false);
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
          ...AuthService.getAuthHeaders(),
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
        setImagePreview(null);
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error, operation failed');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
          <>
            <Table headers={['Image', 'Title', 'Description', 'Actions']}>
              {currentCategories.map((category) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, categories.length)} of {categories.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="min-w-[2rem]"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Add/Edit */}
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
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-gray-500 border rounded p-1"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="h-32 rounded object-cover" />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingCategory ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Cropper Modal */}
      <Modal isOpen={showCropper} onClose={() => setShowCropper(false)} title="Crop Image">
        <div className="relative w-full h-64 bg-gray-900">
          {imagePreview && (
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={() => setShowCropper(false)}>Cancel</Button>
          <Button onClick={handleCropConfirm}>Crop & Save</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;