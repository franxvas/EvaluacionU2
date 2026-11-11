import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Estado from '../components/Estado';
import TarjetaProducto from '../components/TarjetaProducto';
import { obtenerProductos } from '../services/productos';
import { Producto } from '../types/producto';

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  // ##### PRODUCTOS #####
  useEffect(() => {
    const controlador = new AbortController();

    async function cargarProductos() {
      setCargando(true);
      setError('');
      try {
        const datos = await obtenerProductos(controlador.signal);
        if (!controlador.signal.aborted) setProductos(datos);
      } catch {
        if (!controlador.signal.aborted) {
          setError('No se pudieron cargar los productos. Revisa tu conexión e inténtalo otra vez.');
        }
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }

    cargarProductos();
    return () => controlador.abort();
  }, [intento]);

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenedor}>
        <View style={styles.marca}>
          <Text style={styles.logo}>vitrina.</Text>
          <Text style={styles.etiqueta}>FAKE STORE</Text>
        </View>
        {cargando ? (
          <Estado cargando mensaje="Cargando productos..." />
        ) : error ? (
          <Estado mensaje={error} onReintentar={() => setIntento(intento + 1)} />
        ) : (
          <FlatList
            data={productos}
            numColumns={2}
            keyExtractor={(producto) => producto.id.toString()}
            columnWrapperStyle={styles.fila}
            contentContainerStyle={styles.lista}
            ListHeaderComponent={
              <View style={styles.cabecera}>
                <Text style={styles.subtitulo}>ENCUENTRA TU PRÓXIMO FAVORITO</Text>
                <Text style={styles.titulo}>Nuestro catálogo</Text>
                <Text style={styles.resumen}>{productos.length} productos · Precios en USD</Text>
              </View>
            }
            ListEmptyComponent={<Estado mensaje="No hay productos disponibles por el momento." />}
            renderItem={({ item }) => (
              <TarjetaProducto
                producto={item}
                onPress={() => router.push({ pathname: '/producto/[id]', params: { id: item.id } })}
              />
            )}
            ListFooterComponent={<Text style={styles.footer}>Un vistazo, un nuevo favorito.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#F8F5F1' },
  contenedor: { flex: 1, width: '100%', maxWidth: 680, alignSelf: 'center' },
  marca: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#E7DFD8' },
  logo: { color: '#852D43', fontSize: 31, fontWeight: '800', letterSpacing: -1.5 },
  etiqueta: { color: '#75685F', fontSize: 10, letterSpacing: 2, fontWeight: '600' },
  lista: { paddingHorizontal: 18, paddingBottom: 24 },
  fila: { gap: 12, marginBottom: 14 },
  cabecera: { paddingVertical: 27, gap: 10 },
  subtitulo: { color: '#852D43', fontSize: 10, fontWeight: '700', letterSpacing: 1.3 },
  titulo: { color: '#24201E', fontSize: 30, fontWeight: '700', letterSpacing: -1 },
  resumen: { color: '#7A7068', fontSize: 13 },
  footer: { textAlign: 'center', fontSize: 12, color: '#8C8178', paddingTop: 18 },
});
