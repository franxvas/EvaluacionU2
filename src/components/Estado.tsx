import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  cargando?: boolean;
  mensaje: string;
  onReintentar?: () => void;
};

export default function Estado({ cargando, mensaje, onReintentar }: Props) {
  return (
    <View style={styles.contenedor} accessibilityLiveRegion="polite">
      {cargando && <ActivityIndicator size="large" color="#852D43" />}
      <Text style={styles.mensaje}>{mensaje}</Text>
      {onReintentar && (
        <Pressable accessibilityRole="button" onPress={onReintentar} style={styles.boton}>
          <Text style={styles.botonTexto}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 18 },
  mensaje: { color: '#615B58', fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 330 },
  boton: { backgroundColor: '#852D43', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  botonTexto: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});
