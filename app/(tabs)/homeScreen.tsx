import { Articulo } from "@/src/models/articulo";
import ArticulosServices from "@/src/services/articulosService";
import { ArticulosViewModel } from "../../src/viewModels/articulosViewModel";
import { Link } from "expo-router";
import React, { useEffect, useState , useRef} from "react";
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);

const viewModelRef = useRef(new ArticulosViewModel(new ArticulosServices()));
const viewModel = viewModelRef.current;

  useEffect(() => {
    async function cargarDatos() {
      const datos = await viewModel.cargarArticulos();
      setArticulos(datos);
    }
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={articulos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/${item.id}`} asChild>
            <TouchableOpacity style={styles.item}>
              <View style={styles.headerCard}>
                <View style={styles.barraColor} />
                <Text style={styles.nombre}>{item.titulo}</Text>
              </View>
              <Text style={styles.descripcion}>{item.resumen}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f8f8f8ff",
  },
 item: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#ffffffff",
    borderWidth: 1,
    borderColor: "#82ac76ff", 
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
},
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  barraColor: {
    width: 5,
    height: "100%",
    backgroundColor: "#4aa1f3",
    borderRadius: 2,
    marginRight: 10,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    flexShrink: 1,
  },
  descripcion: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginTop: 4,
  },
});
