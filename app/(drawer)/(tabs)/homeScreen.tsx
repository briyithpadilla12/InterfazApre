import { cardsInfoViewModel } from "@/src/dependencias";
import { CardInfo } from "@/src/models/cardInfo";
import style from "@/src/components/Styles";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const cargarCards = useCallback(async () => {
    try {
      setError(null);
      const datos = await cardsInfoViewModel.cargarCardsActivas();
      setCards(datos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las tarjetas"
      );
      setCards([]);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    cargarCards();
  }, [cargarCards]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    cargarCards();
  }, [cargarCards]);

  if (cargando) {
    return (
      <View style={[style.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4aa1f3" />
        <Text style={styles.textoCargando}>Cargando tarjetas...</Text>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <Text style={style.title}>Inicio</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.textoError}>{error}</Text>
          <TouchableOpacity style={styles.botonReintentar} onPress={cargarCards}>
            <Text style={styles.textoBoton}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!error && cards.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.textoVacio}>
            No hay tarjetas disponibles en este momento.
          </Text>
        </View>
      )}

      <FlatList
        data={cards}
        keyExtractor={(item) => String(item.carCodigo ?? Math.random())}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Link href={`/${item.carCodigo}`} asChild>
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
              {item.carImagenUrl ? (
                <Image
                  source={{ uri: item.carImagenUrl }}
                  style={styles.imagen}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagenPlaceholder}>
                  <Text style={styles.placeholderText}>📄</Text>
                </View>
              )}
              <View style={styles.contenido}>
                <View style={styles.headerCard}>
                  <View style={styles.barraColor} />
                  <Text style={styles.nombre} numberOfLines={2}>
                    {item.carTitulo ?? "Sin título"}
                  </Text>
                </View>
                <Text style={styles.descripcion} numberOfLines={3}>
                  {item.carDescripcion ?? ""}
                </Text>
                {item.carLink ? (
                  <Text style={styles.linkHint}>Ver más →</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  textoError: {
    fontSize: 14,
    color: "#dc2626",
    marginBottom: 8,
  },
  botonReintentar: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#dc2626",
    borderRadius: 8,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  textoVacio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  item: {
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  imagen: {
    width: "100%",
    height: 160,
    backgroundColor: "#f3f4f6",
  },
  imagenPlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
  },
  contenido: {
    padding: 18,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  barraColor: {
    width: 5,
    height: "100%",
    minHeight: 24,
    backgroundColor: "#4aa1f3",
    borderRadius: 2,
    marginRight: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    flex: 1,
  },
  descripcion: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginTop: 4,
  },
  linkHint: {
    fontSize: 13,
    color: "#4aa1f3",
    marginTop: 8,
    fontWeight: "600",
  },
});
