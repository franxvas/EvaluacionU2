import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = { uri: string; nombre: string; grande?: boolean };

export default function ImagenProducto({ uri, nombre, grande = false }: Props) {
  const [fallo, setFallo] = useState(false);

  return (
    <View style={[styles.contenedor, grande && styles.grande]}>
      {fallo ? (
        <Text style={styles.aviso}>Imagen no disponible</Text>
      ) : (
        <Image
          source={{ uri }}
          accessibilityLabel={nombre}
          resizeMode="contain"
          style={styles.imagen}
          onError={() => setFallo(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { height: 160, backgroundColor: '#FFFFFF', padding: 20, alignItems: 'center', justifyContent: 'center' },
  grande: { height: 320, padding: 36, borderRadius: 20 },
  imagen: { width: '100%', height: '100%' },
  aviso: { color: '#77716D', fontSize: 13, textAlign: 'center' },
});
