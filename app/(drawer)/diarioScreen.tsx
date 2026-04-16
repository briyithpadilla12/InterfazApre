import style from "@/src/components/Styles";
import type { PaginaDiarioListaItem } from "@/src/models/paginaDiario";
import PaginaDiarioService from "@/src/services/paginaDiarioService";
import { subirImagenDesdeUri } from "@/src/services/imagenService";
import { elegirImagen } from "@/src/utils/elegirImagen";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
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

const COLOR_PRINCIPAL = "#085394";

function formatearFechaParaLista(fechaStr: string): string {
  if (!fechaStr) return "Sin fecha";
  const [y, m, d] = fechaStr.split("-");
  if (d && m && y) return `${d}/${m}/${y}`;
  return fechaStr;
}

function prepararPaginaParaCard(pagina: PaginaDiarioListaItem): PaginaDiarioListaItem {
  const titulo = typeof pagina.titulo === "string" ? pagina.titulo.trim().slice(0, 200) : "Sin título";
  const fecha = typeof pagina.fecha === "string" ? pagina.fecha : "";
  const emociones = Array.isArray(pagina.emociones)
    ? pagina.emociones.filter((e) => typeof e === "string").map((e) => String(e).trim().slice(0, 50)).filter(Boolean)
    : [];
  return { ...pagina, id: pagina.id, titulo, fecha, emociones };
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

  const irVer = () => router.push(`/(drawer)/paginaDiario/${p.id}?modo=leer`);
  const irEditar = () => router.push(`/(drawer)/paginaDiario/${p.id}?modo=editar`);

  const confirmarEliminar = () => {
    Alert.alert(
      "Eliminar página",
      "¿Seguro que quieres eliminar esta página del diario? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => onEliminar(p.id) },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardFecha}>{fechaMostrar}</Text>
      <Text style={styles.cardTitulo} numberOfLines={2}>{p.titulo}</Text>
      {p.pagImagenUrl ? (
        <Image source={{ uri: p.pagImagenUrl }} style={styles.cardImagen} contentFit="cover" />
      ) : null}
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
        <Pressable style={styles.botonIcono} onPress={irVer} hitSlop={8} accessibilityLabel="Ver página">
          <Feather name="eye" size={22} color={COLOR_PRINCIPAL} />
        </Pressable>
        <Pressable style={styles.botonIcono} onPress={irEditar} hitSlop={8} accessibilityLabel="Editar página">
          <Feather name="edit-2" size={22} color={COLOR_PRINCIPAL} />
        </Pressable>
        <Pressable style={styles.botonIcono} onPress={confirmarEliminar} hitSlop={8} disabled={eliminando} accessibilityLabel="Eliminar página">
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
  const { diario, asegurarDiario, actualizarDiario } = useDiarioViewModel();

  const [paginasDelDiario, setPaginasDelDiario] = useState<PaginaDiarioListaItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  // Paginación por fecha
  const [fechaActual, setFechaActual] = useState<string | null>(null);
  const [fechaAnterior, setFechaAnterior] = useState<string | null>(null);
  const [fechaSiguiente, setFechaSiguiente] = useState<string | null>(null);
  const [indiceDia, setIndiceDia] = useState(0);
  const [totalDias, setTotalDias] = useState(0);

  // Portada
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [tituloTemp, setTituloTemp] = useState("");
  const [subiendoPortada, setSubiendoPortada] = useState(false);

  const estaCargandoRef = useRef(false);

  const cargarPaginasPorFecha = useCallback(async (fecha?: string) => {
    if (estaCargandoRef.current) return;
    estaCargandoRef.current = true;
    setCargando(true);
    try {
      const d = diario ?? (await asegurarDiario());
      if (!d?.diaId) {
        setPaginasDelDiario([]);
        return;
      }
      const params: Record<string, string | number> = { diarioId: d.diaId };
      if (fecha) params.fecha = fecha;

      const { data } = await (await import("@/src/services/apiCliente")).default.get<Record<string, unknown>>(
        "/PaginaDiario/paginacion-por-fecha",
        { params }
      );

      const datosRaw = data.datos;
      const items = Array.isArray(datosRaw) ? datosRaw : [];
      const mapped = items
        .map((item: unknown) => {
          const raw = item as Record<string, unknown>;
          return mapearPaginaDesdeApi(raw);
        })
        .filter((r): r is PaginaDiarioListaItem => r != null);

      setPaginasDelDiario(mapped);
      setFechaActual(String(data.fechaCorrespondiente ?? ""));
      setFechaAnterior(data.fechaMasAntiguaConEntradas ? String(data.fechaMasAntiguaConEntradas) : null);
      setFechaSiguiente(data.fechaMasNuevaConEntradas ? String(data.fechaMasNuevaConEntradas) : null);
      setIndiceDia(Number(data.indiceDia ?? 0));
      setTotalDias(Number(data.totalDiasConEntradas ?? 0));
    } catch {
      setPaginasDelDiario([]);
    } finally {
      setCargando(false);
      estaCargandoRef.current = false;
    }
  }, [diario, asegurarDiario]);

  const eliminarPagina = useCallback(async (id: number) => {
    setEliminandoId(id);
    try {
      await PaginaDiarioService.eliminarPagina(id);
      setPaginasDelDiario((prev) => prev.filter((p) => p.id !== id));
    } catch {
      Alert.alert("Error", "No se pudo eliminar la página. Intenta de nuevo.");
    } finally {
      setEliminandoId(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarPaginasPorFecha();
    }, [cargarPaginasPorFecha])
  );

  // Portada: editar título
  const iniciarEdicionTitulo = () => {
    setTituloTemp(diario?.diaTitulo ?? "");
    setEditandoTitulo(true);
  };

  const guardarTitulo = async () => {
    const nuevoTitulo = tituloTemp.trim();
    if (!nuevoTitulo || nuevoTitulo === diario?.diaTitulo) {
      setEditandoTitulo(false);
      return;
    }
    const ok = await actualizarDiario(nuevoTitulo);
    if (!ok) Alert.alert("Error", "No se pudo actualizar el título.");
    setEditandoTitulo(false);
  };

  // Portada: cambiar foto
  const cambiarFotoPortada = async () => {
    const resultado = await elegirImagen();
    if (!resultado) return;
    setSubiendoPortada(true);
    try {
      const { url } = await subirImagenDesdeUri(resultado.uri, resultado.mimeType, "diario_portada");
      const ok = await actualizarDiario(undefined, url);
      if (!ok) Alert.alert("Error", "No se pudo actualizar la foto de portada.");
    } catch (err) {
      Alert.alert("Error al subir imagen", (err as Error).message);
    } finally {
      setSubiendoPortada(false);
    }
  };

  const paginasFiltradas = textoBusqueda.trim()
    ? paginasDelDiario.filter(
        (p) =>
          formatearFechaParaLista(p.fecha).includes(textoBusqueda.trim()) ||
          p.titulo.toLowerCase().includes(textoBusqueda.trim().toLowerCase())
      )
    : paginasDelDiario;

  const mostrarLista = paginasFiltradas.length > 0;
  const fechaMostrar = fechaActual ? formatearFechaParaLista(fechaActual) : "";

  return (
    <View style={style.container}>
      <Text style={style.title}>Diario</Text>

      {/* Cabecera portada */}
      {diario && (
        <View style={styles.portada}>
          <Pressable style={styles.portadaFotoContenedor} onPress={cambiarFotoPortada}>
            {diario.diaImagenUrl ? (
              <Image source={{ uri: diario.diaImagenUrl }} style={styles.portadaFoto} contentFit="cover" />
            ) : (
              <View style={styles.portadaFotoPlaceholder}>
                <Feather name="image" size={28} color="#9ca3af" />
              </View>
            )}
            {subiendoPortada && (
              <View style={styles.portadaOverlay}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
            <View style={styles.portadaCamaraIcono}>
              <Feather name="camera" size={14} color="#fff" />
            </View>
          </Pressable>
          <View style={styles.portadaInfo}>
            {editandoTitulo ? (
              <View style={styles.portadaTituloEditFila}>
                <TextInput
                  style={styles.portadaTituloInput}
                  value={tituloTemp}
                  onChangeText={setTituloTemp}
                  autoFocus
                  onSubmitEditing={guardarTitulo}
                  returnKeyType="done"
                  maxLength={100}
                />
                <Pressable onPress={guardarTitulo} hitSlop={8}>
                  <Feather name="check" size={20} color={COLOR_PRINCIPAL} />
                </Pressable>
                <Pressable onPress={() => setEditandoTitulo(false)} hitSlop={8}>
                  <Feather name="x" size={20} color="#6b7280" />
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.portadaTituloFila} onPress={iniciarEdicionTitulo}>
                <Text style={styles.portadaTitulo} numberOfLines={1}>{diario.diaTitulo || "Mi diario"}</Text>
                <Feather name="edit-3" size={16} color="#9ca3af" />
              </Pressable>
            )}
            {diario.diaFechaCreacion && (
              <Text style={styles.portadaFecha}>
                Creado el {formatearFechaParaLista(diario.diaFechaCreacion.split("T")[0])}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Navegación por fecha */}
      {totalDias > 0 && (
        <View style={styles.navFecha}>
          <Pressable
            onPress={() => fechaAnterior && cargarPaginasPorFecha(fechaAnterior)}
            disabled={!fechaAnterior}
            style={[styles.navFechaBoton, !fechaAnterior && styles.navFechaBotonDisabled]}
            hitSlop={8}
          >
            <Feather name="chevron-left" size={22} color={fechaAnterior ? COLOR_PRINCIPAL : "#d1d5db"} />
          </Pressable>
          <View style={styles.navFechaCentro}>
            <Text style={styles.navFechaTexto}>{fechaMostrar}</Text>
            <Text style={styles.navFechaDia}>Día {indiceDia + 1} de {totalDias}</Text>
          </View>
          <Pressable
            onPress={() => fechaSiguiente && cargarPaginasPorFecha(fechaSiguiente)}
            disabled={!fechaSiguiente}
            style={[styles.navFechaBoton, !fechaSiguiente && styles.navFechaBotonDisabled]}
            hitSlop={8}
          >
            <Feather name="chevron-right" size={22} color={fechaSiguiente ? COLOR_PRINCIPAL : "#d1d5db"} />
          </Pressable>
        </View>
      )}

      <View style={styles.contenedorBusqueda}>
        <Feather name="search" size={20} color="#9ca3af" style={styles.iconoBusqueda} />
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar por título o fecha"
          placeholderTextColor="#9ca3af"
          value={textoBusqueda}
          onChangeText={setTextoBusqueda}
        />
      </View>

      <ScrollView
        style={styles.contenido}
        contentContainerStyle={cargando || !mostrarLista ? styles.contenidoCentrado : styles.contenidoLista}
        showsVerticalScrollIndicator={false}
      >
        {cargando && <ActivityIndicator size="large" color={COLOR_PRINCIPAL} />}
        {!cargando && !mostrarLista && (
          <View style={styles.bloqueBienvenida}>
            <View style={styles.contenedorIcono}>
              <Feather name="book-open" size={48} color="#6b7280" />
            </View>
            <Text style={styles.tituloBienvenida}>
              {paginasDelDiario.length === 0 && totalDias === 0
                ? "¡Bienvenido a tu Diario!"
                : "Sin entradas este día"}
            </Text>
            <Text style={styles.textoBienvenida}>
              {paginasDelDiario.length === 0 && totalDias === 0
                ? "Este es tu espacio personal para expresar tus pensamientos, emociones y experiencias diarias.\nToca el botón + para crear una nueva página."
                : "No hay páginas que coincidan con tu búsqueda."}
            </Text>
          </View>
        )}
        {!cargando && mostrarLista &&
          paginasFiltradas.map((pagina) => (
            <CardPaginaResumen
              key={pagina.id}
              pagina={pagina}
              onEliminar={eliminarPagina}
              eliminando={eliminandoId === pagina.id}
            />
          ))
        }
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

/** Mapea un item de la respuesta paginación-por-fecha a PaginaDiarioListaItem. */
function mapearPaginaDesdeApi(raw: Record<string, unknown>): PaginaDiarioListaItem | null {
  const id = Number(raw.pagCodigo ?? raw.PagCodigo ?? raw.pagId ?? 0);
  const titulo = String(raw.pagTitulo ?? raw.PagTitulo ?? "Sin título").trim().slice(0, 200) || "Sin título";

  const fechaSrc = String(raw.pagFechaRealizacion ?? raw.PagFechaRealizacion ?? raw.pagFecha ?? "");
  const fecha = fechaSrc.includes("T") ? fechaSrc.split("T")[0] : fechaSrc;

  const emocionRaw = raw.emocion ?? raw.Emocion;
  const emocionObj = (emocionRaw && typeof emocionRaw === "object" ? emocionRaw : null) as Record<string, unknown> | null;
  const emoNombre = String(emocionObj?.emoNombre ?? emocionObj?.EmoNombre ?? "").trim();
  const emociones = emoNombre ? [emoNombre] : [];

  const pagContenido = String(raw.pagContenido ?? raw.PagContenido ?? "");
  const pagDiarioFk = Number(raw.pagDiarioFk ?? raw.PagDiarioFk ?? 0);
  const pagEmocionFk = Number(raw.pagEmocionFk ?? raw.PagEmocionFk ?? 0);
  const imgRaw = raw.pagImagenUrl ?? raw.PagImagenUrl;
  const pagImagenUrl = typeof imgRaw === "string" && imgRaw.trim() ? imgRaw.trim() : undefined;

  if (!id) return null;
  return { id, titulo, fecha, emociones, pagContenido, pagDiarioFk, pagEmocionFk, pagImagenUrl };
}

const styles = StyleSheet.create({
  portada: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 14,
  },
  portadaFotoContenedor: {
    position: "relative",
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: "hidden",
  },
  portadaFoto: {
    width: 64,
    height: 64,
  },
  portadaFotoPlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  portadaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  portadaCamaraIcono: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    padding: 3,
  },
  portadaInfo: {
    flex: 1,
  },
  portadaTituloFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  portadaTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  portadaTituloEditFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  portadaTituloInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PRINCIPAL,
    paddingVertical: 2,
  },
  portadaFecha: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  navFecha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  navFechaBoton: {
    padding: 6,
  },
  navFechaBotonDisabled: {
    opacity: 0.4,
  },
  navFechaCentro: {
    alignItems: "center",
  },
  navFechaTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  navFechaDia: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
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
  cardImagen: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
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
    backgroundColor: COLOR_PRINCIPAL,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
