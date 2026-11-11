import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Estado from '../../components/Estado';
import ImagenProducto from '../../components/ImagenProducto';
import { obtenerProducto } from '../../services/productos';
import { Producto } from '../../types/producto';

export default function DetalleProducto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  // ##### DETALLE #####
  useEffect(() => {
    const controlador = new AbortController();

    async function cargarDetalle() {
      setCargando(true);
      setError('');
      setProducto(null);
      try {
        const numeroId = Number(id);
        if (!Number.isInteger(numeroId) || numeroId <= 0) throw new Error('ID inválido');
        const datos = await obtenerProducto(numeroId, controlador.signal);
        if (!controlador.signal.aborted) setProducto(datos);
      } catch {
        if (!controlador.signal.aborted) {
          setError('No se pudo cargar este producto. Puede que no esté disponible. Inténtalo otra vez.');
        }
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }

    cargarDetalle();
    return () => controlador.abort();
  }, [id, intento]);

  function volver() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenedor}>
        <View style={styles.barra}>
          <Pressable accessibilityRole="button" onPress={volver} style={styles.volver}>
            <Text style={styles.volverTexto}>← Volver al catálogo</Text>
          </Pressable>
          <Text style={styles.logo}>v.</Text>
        </View>
        {cargando ? (
          <Estado cargando mensaje="Cargando detalle..." />
        ) : error ? (
          <Estado mensaje={error} onReintentar={() => setIntento(intento + 1)} />
        ) : producto && (
          <ScrollView contentContainerStyle={styles.detalle}>
            <ImagenProducto key={producto.id} uri={producto.imagenUrl} nombre={producto.nombre} grande />
            <View style={styles.info}>
              <Text style={styles.categoria}>{producto.categoria}</Text>
              <Text style={styles.nombre}>{producto.nombre}</Text>
              <View style={styles.precioFila}>
                <Text style={styles.precio}>${producto.precio.toFixed(2)}</Text>
                <Text style={styles.moneda}>USD</Text>
              </View>
              <View style={styles.descripcionBloque}>
                <Text style={styles.tituloDescripcion}>Sobre este producto</Text>
                <Text style={styles.descripcion}>{producto.descripcion}</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#F8F5F1' },
  contenedor: { flex: 1, width: '100%', maxWidth: 680, alignSelf: 'center' },
  barra: { paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E7DFD8' },
  volver: { paddingVertical: 12, paddingRight: 12 },
  volverTexto: { color: '#852D43', fontSize: 14, fontWeight: '600' },
  logo: { color: '#852D43', fontSize: 29, fontWeight: '800', letterSpacing: -2 },
  detalle: { padding: 20, paddingBottom: 40, gap: 26 },
  info: { gap: 14 },
  categoria: { color: '#852D43', textTransform: 'uppercase', fontSize: 11, letterSpacing: 1.4, fontWeight: '700' },
  nombre: { color: '#24201E', fontSize: 25, lineHeight: 33, fontWeight: '700', letterSpacing: -0.5 },
  precioFila: { flexDirection: 'row', alignItems: 'baseline', gap: 10, paddingVertical: 4 },
  precio: { color: '#852D43', fontSize: 32, fontWeight: '700' },
  moneda: { color: '#7A7068', fontSize: 13 },
  descripcionBloque: { borderTopWidth: 1, borderTopColor: '#E7DFD8', paddingTop: 22, marginTop: 6, gap: 12 },
  tituloDescripcion: { color: '#24201E', fontSize: 17, fontWeight: '600' },
  descripcion: { color: '#665C55', fontSize: 16, lineHeight: 26 },
});
