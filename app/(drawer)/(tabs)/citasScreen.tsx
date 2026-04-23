import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useCitasViewModel } from "@/src/viewModels/citasViewModels";
import { ModalSolicitarCita } from "@/src/components/ModalSolicitarCita";
import type { Citas } from "@/src/models/citas";

type SeccionCitas = "estaSemana" | "semanaPasada" | "anteriores";

function parseFecha(fechaStr: string): Date | null {
  if (!fechaStr?.trim()) return null;
  const parts = fechaStr.trim().split(/[-/]/);
  if (parts.length < 3) {
    const d = new Date(fechaStr);
    return isNaN(d.getTime()) ? null : d;
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  const d = new Date(year, month, day, 12, 0, 0, 0);
  return isNaN(d.getTime()) ? null : d;
}

function getInicioSemana(d: Date): Date {
  const res = new Date(d);
  const dia = res.getDay();
  const diasHaciaLunes = (dia + 6) % 7;
  res.setDate(res.getDate() - diasHaciaLunes);
  res.setHours(0, 0, 0, 0);
  return res;
}

function getFinSemana(d: Date): Date {
  const inicio = getInicioSemana(d);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 6);
  fin.setHours(23, 59, 59, 999);
  return fin;
}

function categorizarCitas(citas: Citas[]): Record<SeccionCitas, Citas[]> {
  const hoy = new Date();
  hoy.setHours(12, 0, 0, 0);
  const inicioEstaSemana = getInicioSemana(hoy);
  const finEstaSemana = getFinSemana(hoy);
  const inicioSemanaPasada = new Date(inicioEstaSemana);
  inicioSemanaPasada.setDate(inicioSemanaPasada.getDate() - 7);
  const finSemanaPasada = new Date(finEstaSemana);
  finSemanaPasada.setDate(finSemanaPasada.getDate() - 7);

  const estaSemana: Citas[] = [];
  const semanaPasada: Citas[] = [];
  const anteriores: Citas[] = [];

  for (const cita of citas) {
    const fecha = parseFecha(cita.citFechaProgramada ?? "");
    if (!fecha) {
      anteriores.push(cita);
      continue;
    }

    if (fecha >= inicioEstaSemana && fecha <= finEstaSemana) {
      estaSemana.push(cita);
    } else if (fecha >= inicioSemanaPasada && fecha <= finSemanaPasada) {
      semanaPasada.push(cita);
    } else {
      anteriores.push(cita);
    }
  }

  const sortByDate = (a: Citas, b: Citas) => {
    const da = parseFecha(a.citFechaProgramada ?? "")?.getTime() ?? 0;
    const db = parseFecha(b.citFechaProgramada ?? "")?.getTime() ?? 0;
    return db - da;
  };
  estaSemana.sort(sortByDate);
  semanaPasada.sort(sortByDate);
  anteriores.sort(sortByDate);

  return { estaSemana, semanaPasada, anteriores };
}

const SECCIONES: { key: SeccionCitas; titulo: string }[] = [
  { key: "estaSemana", titulo: "Citas de esta semana" },
  { key: "semanaPasada", titulo: "Semana pasada" },
  { key: "anteriores", titulo: "Anteriores" },
];

export default function MiCitaCard() {
  const {
    citas,
    cargando,
    obtenerColorEstado,
    CancelarSolicitud,
    cargandoCancelar,
    SolicitarCita,
    errorEnvioCita,
    exitoEnvioCita,
    cargandoEnvioCita,
  } = useCitasViewModel();
  const [abrirModal, setAbrirModal] = useState(false);
  const [expandidos, setExpandidos] = useState<Record<SeccionCitas, boolean>>({
    estaSemana: true,
    semanaPasada: true,
    anteriores: false,
  });

  const porSeccion = useMemo(() => categorizarCitas(citas), [citas]);

  const toggleSeccion = (key: SeccionCitas) => {
    setExpandidos((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#085394" />
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Mis Citas</Text>
        <Text style={styles.subtitle}>Gestiona tus citas con psicólogos</Text>

        {citas.length > 0 ? (
          SECCIONES.map(({ key, titulo }) => {
            const lista = porSeccion[key];
            if (lista.length === 0) return null;

            const abierto = expandidos[key];
            return (
              <View key={key} style={styles.acordeon}>
                <Pressable
                  style={styles.acordeonHeader}
                  onPress={() => toggleSeccion(key)}
                >
                  <Text style={styles.acordeonTitulo}>{titulo}</Text>
                  <Text style={styles.acordeonContador}>({lista.length})</Text>
                  <Feather
                    name={abierto ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#085394"
                  />
                </Pressable>
                {abierto && (
                  <View style={styles.acordeonContenido}>
                    {lista.map((item, index) => (
                      <CardCita
                        key={item.citId ?? index}
                        item={item}
                        obtenerColorEstado={obtenerColorEstado}
                        CancelarSolicitud={CancelarSolicitud}
                        cargandoCancelar={cargandoCancelar}
                      />
                    ))}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.sinCitas}>No tienes citas registradas</Text>
        )}
      </ScrollView>

      <Pressable style={styles.botonFlotante} onPress={() => setAbrirModal(true)}>
        <Feather name="plus" size={28} color="#fff" />
        <Text style={styles.botonFlotanteTexto}>Solicitar cita</Text>
      </Pressable>

      <ModalSolicitarCita
        visible={abrirModal}
        onClose={() => setAbrirModal(false)}
        onSolicitar={SolicitarCita}
        errorEnvioCita={errorEnvioCita}
        exitoEnvioCita={exitoEnvioCita}
        cargandoEnvioCita={cargandoEnvioCita}
      />
    </View>
  );
}

function CardCita({
  item,
  obtenerColorEstado,
  CancelarSolicitud,
  cargandoCancelar,
}: {
  item: Citas;
  obtenerColorEstado: (e: string) => string;
  CancelarSolicitud: (id: number) => Promise<boolean>;
  cargandoCancelar: number | null;
}) {
  const color = obtenerColorEstado(item.citEstadoCita);
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <MaterialIcons name="event" size={22} color="#4b5563" />
        <Text style={styles.label}>
          <Text style={styles.bold}>Fecha:</Text> {item.citFechaProgramada ?? "----"}
        </Text>
      </View>

      <View style={styles.row}>
        <Feather name="user" size={22} color="#4b5563" />
        <Text style={styles.label}>
          <Text style={styles.bold}>Psicólogo de ficha:</Text>{" "}
          {item.psicologo?.psiNombre ?? "—"}
        </Text>
      </View>

      <View style={styles.row}>
        <Feather name="check-circle" size={22} color="#767676" />
        <Text style={styles.label}>
          <Text style={styles.bold}>Estado:</Text>
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: color + "20" }]}>
          <Text style={[styles.statusText, { color }]}>{item.citEstadoCita}</Text>
        </View>
      </View>

      {item.citEstadoCita?.toLowerCase() === "pendiente" && item.citId != null && (
        <Pressable
          style={styles.botonCancelar}
          onPress={() => CancelarSolicitud(item.citId!)}
          disabled={cargandoCancelar === item.citId}
        >
          {cargandoCancelar === item.citId ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.textoBotonCancelar}>Cancelar solicitud</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6b7280",
  },
  title: {
    fontSize: 22,
    color: "#085394",
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  acordeon: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  acordeonHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  acordeonTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#085394",
    flex: 1,
  },
  acordeonContador: {
    fontSize: 14,
    color: "#6b7280",
    marginRight: 8,
  },
  acordeonContenido: {
    padding: 12,
    paddingTop: 0,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 10,
  },
  bold: { fontWeight: "600" },
  statusBadge: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { fontWeight: "600", fontSize: 14 },
  botonCancelar: {
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  textoBotonCancelar: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  sinCitas: { color: "#6b7280", marginTop: 8 },
  botonFlotante: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: "#085394",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  botonFlotanteTexto: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
});
