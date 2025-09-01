export const dashboardStats = {
  totalOrders: 123,
  ordersThisWeek: 25,
  ordersThisMonth: 80,
  totalProducts: 50,
  totalCategories: 10,
};

export const categories = [
  { id: 1, name: 'Electronics', description: 'Electronic gadgets and devices' },
  { id: 2, name: 'Clothing', description: 'Fashion and apparel items' },
  { id: 3, name: 'Home & Garden', description: 'Home improvement and garden supplies' },
  { id: 4, name: 'Books', description: 'Books and educational materials' },
  { id: 5, name: 'Sports', description: 'Sports equipment and accessories' },
];

export const products = [
  { id: 1, name: 'Wireless Headphones', price: 299.99, retailerPrice: 249.99, category: 'Electronics' },
  { id: 2, name: 'Smart Watch', price: 399.99, retailerPrice: 349.99, category: 'Electronics' },
  { id: 3, name: 'Running Shoes', price: 129.99, retailerPrice: 109.99, category: 'Sports' },
  { id: 4, name: 'Cotton T-Shirt', price: 29.99, retailerPrice: 24.99, category: 'Clothing' },
  { id: 5, name: 'Garden Tools Set', price: 89.99, retailerPrice: 74.99, category: 'Home & Garden' },
  { id: 6, name: 'Programming Book', price: 49.99, retailerPrice: 39.99, category: 'Books' },
];

export const orders = [
  { id: 'ORD-001', customer: 'John Doe', status: 'Delivered', total: 299.99, date: '2025-01-15' },
  { id: 'ORD-002', customer: 'Jane Smith', status: 'Shipped', total: 159.98, date: '2025-01-14' },
  { id: 'ORD-003', customer: 'Mike Johnson', status: 'Pending', total: 89.99, date: '2025-01-13' },
  { id: 'ORD-004', customer: 'Sarah Wilson', status: 'Delivered', total: 429.98, date: '2025-01-12' },
  { id: 'ORD-005', customer: 'Tom Brown', status: 'Shipped', total: 79.99, date: '2025-01-11' },
];

export const orderStatuses = ['Pending', 'Shipped', 'Delivered'] as const;
export type OrderStatus = typeof orderStatuses[number];