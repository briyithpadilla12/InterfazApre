import style from "@/src/components/Styles";
import type { PaginaDiarioListaItem } from "@/src/models/paginaDiario";
import PaginaDiarioService from "@/src/services/paginaDiarioService";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useDiarioViewModel } from "@/src/viewModels/diarioViewModel";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function formatearFechaParaLista(fechaStr: string): string {
  if (!fechaStr) return "Sin fecha";
  const [y, m, d] = fechaStr.split("-");
  if (d && m && y) return `${d}/${m}/${y}`;
  return fechaStr;
}

/** Valida y prepara datos para mostrar (nunca renderizar contenido crudo de la API). */
function prepararPaginaParaCard(pagina: PaginaDiarioListaItem): PaginaDiarioListaItem {
  const titulo = typeof pagina.titulo === "string" ? pagina.titulo.trim().slice(0, 200) : "Sin título";
  const fecha = typeof pagina.fecha === "string" ? pagina.fecha : "";
  const emociones = Array.isArray(pagina.emociones)
    ? pagina.emociones.filter((e) => typeof e === "string").map((e) => String(e).trim().slice(0, 50)).filter(Boolean)
    : [];
  return {
    ...pagina,
    id: pagina.id,
    titulo,
    fecha,
    emociones,
  };
}

function CardPaginaResumen({
  pagina,
  onEliminar,
  eliminando,
}: {
  pagina: PaginaDiarioListaItem;
  onEliminar: (id: number) => void;
  eliminando: boolean;
}) {
  const router = useRouter();
  const p = prepararPaginaParaCard(pagina);
  const fechaMostrar = formatearFechaParaLista(p.fecha);

  const irVer = () => {
    router.push(`/(drawer)/paginaDiario/${p.id}?modo=leer`);
  };
  const irEditar = () => {
    router.push(`/(drawer)/paginaDiario/${p.id}?modo=editar`);
  };

  const confirmarEliminar = () => {
    Alert.alert(
      "Eliminar página",
      "¿Seguro que quieres eliminar esta página del diario? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onEliminar(p.id),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardFecha}>{fechaMostrar}</Text>
      <Text style={styles.cardTitulo} numberOfLines={2}>{p.titulo}</Text>
      {p.emociones.length > 0 && (
        <View style={styles.contenedorEmociones}>
          {p.emociones.map((e) => (
            <View key={e} style={styles.chipEmocion}>
              <Text style={styles.chipTexto}>{e}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.filaAcciones}>
        <Pressable
          style={styles.botonIcono}
          onPress={irVer}
          hitSlop={8}
          accessibilityLabel="Ver página en solo lectura"
        >
          <Feather name="eye" size={22} color="#085394" />
        </Pressable>
        <Pressable
          style={styles.botonIcono}
          onPress={irEditar}
          hitSlop={8}
          accessibilityLabel="Editar página"
        >
          <Feather name="edit-2" size={22} color="#085394" />
        </Pressable>
        <Pressable
          style={styles.botonIcono}
          onPress={confirmarEliminar}
          hitSlop={8}
          disabled={eliminando}
          accessibilityLabel="Eliminar página"
        >
          {eliminando ? (
            <ActivityIndicator size="small" color="#b91c1c" />
          ) : (
            <Feather name="trash-2" size={22} color="#b91c1c" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default function DiarioScreen() {
  const router = useRouter();
  const { diario, asegurarDiario } = useDiarioViewModel();
  const [paginasDelDiario, setPaginasDelDiario] = useState<PaginaDiarioListaItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const tienePaginas = paginasDelDiario.length > 0;
  const estaCargandoPaginasRef = useRef(false);

  const cargarPaginas = useCallback(async () => {
    if (estaCargandoPaginasRef.current) return;

    estaCargandoPaginasRef.current = true;
    setCargando(true);
    try {
      const d = diario ?? (await asegurarDiario());
      if (!d?.diaId) {
        setPaginasDelDiario([]);
        return;
      }
      const listado = await PaginaDiarioService.listarPorDiarioCompleto(d.diaId);
      setPaginasDelDiario(listado);
    } catch (e) {
      setPaginasDelDiario([]);
    } finally {
      setCargando(false);
      estaCargandoPaginasRef.current = false;
    }
  }, [diario, asegurarDiario]);

  const eliminarPagina = useCallback(
    async (id: number) => {
      setEliminandoId(id);
      try {
        await PaginaDiarioService.eliminarPagina(id);
        setPaginasDelDiario((prev) => prev.filter((p) => p.id !== id));
      } catch {
        Alert.alert("Error", "No se pudo eliminar la página. Intenta de nuevo.");
      } finally {
        setEliminandoId(null);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      cargarPaginas();
    }, [cargarPaginas])
  );

  const paginasFiltradas = textoBusqueda.trim()
    ? paginasDelDiario.filter(
        (p) =>
          formatearFechaParaLista(p.fecha).includes(textoBusqueda.trim()) ||
          p.titulo.toLowerCase().includes(textoBusqueda.trim().toLowerCase())
      )
    : paginasDelDiario;
  const mostrarLista = paginasFiltradas.length > 0;

  return (
    <View style={style.container}>
      <Text style={style.title}>Diario</Text>

      <View style={styles.contenedorBusqueda}>
        <Feather name="calendar" size={20} color="#9ca3af" style={styles.iconoBusqueda} />
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar por fecha (ej: 12/03/2026)"
          placeholderTextColor="#9ca3af"
          value={textoBusqueda}
          onChangeText={setTextoBusqueda}
        />
      </View>

      <ScrollView
        style={styles.contenido}
        contentContainerStyle={
          cargando || !mostrarLista ? styles.contenidoCentrado : styles.contenidoLista
        }
        showsVerticalScrollIndicator={false}
      >
        {cargando && <ActivityIndicator size="large" color="#085394" />}
        {!cargando && !mostrarLista && (
          <View style={styles.bloqueBienvenida}>
            <View style={styles.contenedorIcono}>
              <Feather name="book-open" size={48} color="#6b7280" />
            </View>
            <Text style={styles.tituloBienvenida}>¡Bienvenido a tu Diario!</Text>
            <Text style={styles.textoBienvenida}>
              Este es tu espacio personal para expresar tus pensamientos, emociones y experiencias diarias.
            </Text>
            <Text style={styles.textoBienvenida}>
              Toca el botón + para crear una nueva página de diario.
            </Text>
          </View>
        )}
        {!cargando && mostrarLista && (
          paginasFiltradas.map((pagina) => (
            <CardPaginaResumen
              key={pagina.id}
              pagina={pagina}
              onEliminar={eliminarPagina}
              eliminando={eliminandoId === pagina.id}
            />
          ))
        )}
      </ScrollView>

      <Pressable
        style={styles.botonFlotante}
        onPress={() => router.push("/nuevaPaginaDiario")}
      >
        <Feather name="plus" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  iconoBusqueda: {
    marginRight: 10,
  },
  inputBusqueda: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
  },
  contenido: {
    flex: 1,
  },
  contenidoCentrado: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  contenidoLista: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardFecha: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  contenedorEmociones: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chipEmocion: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipTexto: {
    fontSize: 13,
    color: "#3730a3",
  },
  filaAcciones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  botonIcono: {
    padding: 6,
  },
  bloqueBienvenida: {
    alignItems: "center",
  },
  contenedorIcono: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  tituloBienvenida: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 12,
  },
  textoBienvenida: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  botonFlotante: {
    position: "absolute",
    bottom: 48,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#085394",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
