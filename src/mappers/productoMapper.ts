import { Producto, ProductoApi } from '../types/producto';

export function productoMapper(producto: ProductoApi): Producto {
  return {
    id: producto.id,
    nombre: producto.title.trim(),
    precio: producto.price,
    descripcion: producto.description.trim(),
    categoria: producto.category,
    imagenUrl: producto.image.trim(),
  };
}
