import { create } from 'axios';
import { productoMapper } from '../mappers/productoMapper';
import { ProductoApi } from '../types/producto';

const api = create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 15000,
});

export async function obtenerProductos(signal?: AbortSignal) {
  const respuesta = await api.get<ProductoApi[]>('/products', { signal });
  return respuesta.data.map(productoMapper);
}

export async function obtenerProducto(id: number, signal?: AbortSignal) {
  const respuesta = await api.get<ProductoApi | null>(`/products/${id}`, { signal });
  if (!respuesta.data || respuesta.data.id !== id) {
    throw new Error('Producto no encontrado');
  }
  return productoMapper(respuesta.data);
}
