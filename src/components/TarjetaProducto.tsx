import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Producto } from '../types/producto';
import ImagenProducto from './ImagenProducto';

type Props = { producto: Producto; onPress: () => void };

export default function TarjetaProducto({ producto, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver ${producto.nombre}`}
      onPress={onPress}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.pulsada]}
    >
      <ImagenProducto uri={producto.imagenUrl} nombre={producto.nombre} />
      <View style={styles.info}>
        <Text style={styles.categoria} numberOfLines={1}>{producto.categoria}</Text>
        <Text style={styles.nombre} numberOfLines={3}>{producto.nombre}</Text>
        <View style={styles.pie}>
          <Text style={styles.precio}>${producto.precio.toFixed(2)}</Text>
          <Text style={styles.flecha}>↗</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: { flex: 1, maxWidth: '49%', backgroundColor: '#FFFFFF', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#EAE5E1' },
  pulsada: { opacity: 0.7 },
  info: { padding: 14, flex: 1, gap: 8 },
  categoria: { fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', color: '#85736A' },
  nombre: { fontSize: 14, lineHeight: 20, fontWeight: '500', color: '#24201E', minHeight: 60 },
  pie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  precio: { fontSize: 19, fontWeight: '700', color: '#852D43' },
  flecha: { fontSize: 21, color: '#852D43' },
});
