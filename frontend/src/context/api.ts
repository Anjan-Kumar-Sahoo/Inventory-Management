// Create a product with selling price
export async function createProduct(product: { name: string; sellingPrice: number; [key: string]: any }) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return response.json();
}

// Update product selling price
export async function updateProductSellingPrice(id: string, sellingPrice: number) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sellingPrice }),
  });
  return response.json();
}
// Get product by ID
export async function fetchProductById(id: string) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    headers: defaultHeaders
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json() as Promise<Product>;
}

// Get supplier by ID
export async function fetchSupplierById(id: string) {
  const res = await fetch(`${BASE_URL}/suppliers/${id}`, {
    headers: defaultHeaders
  });
  if (!res.ok) throw new Error('Failed to fetch supplier');
  return res.json() as Promise<Supplier>;
}
const BASE_URL = 'http://localhost:8080/api';

const USERNAME = 'admin';
const PASSWORD = 'password';
const basicAuth = 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`);

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': basicAuth
};

import { Product, Supplier } from '../types/inventory';
// API utility for backend requests

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`, {
    headers: defaultHeaders
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json() as Promise<Product[]>;
}

export async function fetchSuppliers() {
  const res = await fetch(`${BASE_URL}/suppliers`, {
    headers: defaultHeaders
  });
  if (!res.ok) throw new Error('Failed to fetch suppliers');
  return res.json() as Promise<Supplier[]>;
}

export async function addProduct(product: Omit<Product, 'id'>) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json() as Promise<Product>;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json() as Promise<Product>;
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders
  });
  if (!res.ok) return false;
  return true;
}

export async function addSupplier(supplier: Omit<Supplier, 'id'>) {
  const res = await fetch(`${BASE_URL}/suppliers`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(supplier)
  });
  if (!res.ok) throw new Error('Failed to add supplier');
  return res.json() as Promise<Supplier>;
}

export async function updateSupplier(id: string, supplier: Partial<Supplier>) {
  const res = await fetch(`${BASE_URL}/suppliers/${id}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify(supplier)
  });
  if (!res.ok) throw new Error('Failed to update supplier');
  return res.json() as Promise<Supplier>;
}

export async function deleteSupplier(id: string) {
  const res = await fetch(`${BASE_URL}/suppliers/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders
  });
  if (!res.ok) return false;
  return true;
}
