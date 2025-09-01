import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { products, categories } from '../data/dummyData';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    retailerPrice: '',
    category: '',
    image: '',
    description: '',
    aboutProduct: '',
  });

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      retailerPrice: '',
      category: '',
      image: '',
      description: '',
      aboutProduct: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      retailerPrice: product.retailerPrice.toString(),
      category: product.category,
      image: '',
      description: product.description || '',
      aboutProduct: product.aboutProduct || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy form submission
    console.log('Product saved:', formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      price: '',
      retailerPrice: '',
      category: '',
      image: '',
      description: '',
      aboutProduct: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table headers={['ID', 'Product Name', 'Regular Price', 'Retailer Price', 'Category', 'Actions']}>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">${product.retailerPrice}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <Input
            label="Retailer Price"
            type="number"
            step="0.01"
            value={formData.retailerPrice}
            onChange={(e) => setFormData({ ...formData, retailerPrice: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            label="About Product"
            value={formData.aboutProduct}
            onChange={(e) => setFormData({ ...formData, aboutProduct: e.target.value })}
          />
          <Input
            label="Product Image"
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
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
