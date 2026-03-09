import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Collapsible from "react-native-collapsible";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAsignarFichaViewModel } from "@/src/viewModels/asignarFichaViewModel";
import { formatearLabel } from "@/src/services/fichaService";

function CampoReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.campoReadonly}>
      <Text style={styles.campoLabel}>{label}</Text>
      <Text style={styles.campoValor}>{value || "—"}</Text>
    </View>
  );
}

export default function AsignarFichaScreen() {
  const { documento } = useLocalSearchParams<{ documento: string }>();
  const router = useRouter();
  const [openSelect, setOpenSelect] = useState(false);
  const {
    fichas,
    fichaSeleccionada,
    setFichaSeleccionada,
    busqueda,
    buscar,
    cargarFichas,
    cargando,
    cargandoBusqueda,
    error,
    asignar,
  } = useAsignarFichaViewModel(documento ?? "");

  useEffect(() => {
    cargarFichas();
  }, [cargarFichas]);

  const handleAsignar = async () => {
    Keyboard.dismiss();
    const ok = await asignar();
    if (ok) {
      router.replace("/(drawer)/(tabs)/homeScreen");
    }
  };

  if (!documento?.trim()) {
    return (
      <SafeAreaView style={styles.contenedor} edges={["top", "left", "right"]}>
        <Text style={styles.errorText}>
          No se encontró el documento. Inicia sesión nuevamente.
        </Text>
      </SafeAreaView>
    );
  }

  const prog = fichaSeleccionada?.programaFormacion;
  const nivel = prog?.nivelFormacion;
  const area = prog?.area;
  const centro = prog?.centro;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.contenedor} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          overScrollMode="always"
        >
          <Text style={styles.titulo}>Asignar ficha de formación</Text>
          <Text style={styles.subtitulo}>
            Es obligatorio que te asignes a una ficha activa para poder solicitar citas y usar la aplicación.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Buscar o seleccionar ficha *</Text>
            <TextInput
              style={styles.inputBusqueda}
              value={busqueda}
              onChangeText={buscar}
              placeholder="Escribe para buscar por código o programa..."
              placeholderTextColor="#999"
              editable={!cargandoBusqueda}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ficha seleccionada</Text>
            <Pressable onPress={() => setOpenSelect(!openSelect)}>
              <View style={styles.selector}>
                <Text
                  style={[
                    styles.selectorTexto,
                    !fichaSeleccionada && styles.placeholder,
                  ]}
                  numberOfLines={1}
                >
                  {fichaSeleccionada
                    ? formatearLabel(fichaSeleccionada)
                    : cargandoBusqueda
                    ? "Cargando fichas..."
                    : "Selecciona tu ficha"}
                </Text>
                <Feather
                  name={openSelect ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="#333"
                />
              </View>
            </Pressable>
            <Collapsible collapsed={!openSelect}>
              <ScrollView
                style={styles.dropdown}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {fichas.map((f) => (
                  <Pressable
                    key={f.ficCodigo}
                    style={styles.opcion}
                    onPress={() => {
                      setFichaSeleccionada(f);
                      setOpenSelect(false);
                    }}
                  >
                    <Text style={styles.textoOpcion}>{formatearLabel(f)}</Text>
                  </Pressable>
                ))}
                {fichas.length === 0 && !cargandoBusqueda && (
                  <Text style={styles.sinResultados}>No hay fichas disponibles</Text>
                )}
              </ScrollView>
            </Collapsible>
          </View>

          {fichaSeleccionada && (
            <View style={styles.detallesCard}>
              <Text style={styles.detallesTitulo}>Detalles de la ficha seleccionada</Text>
              <CampoReadOnly
                label="Código de ficha"
                value={String(fichaSeleccionada.ficCodigo)}
              />
              <CampoReadOnly
                label="Programa de formación"
                value={prog?.progNombre ?? ""}
              />
              <CampoReadOnly
                label="Modalidad"
                value={prog?.progModalidad ?? ""}
              />
              <CampoReadOnly
                label="Forma de modalidad"
                value={prog?.progFormaModalidad ?? ""}
              />
              <CampoReadOnly
                label="Nivel de formación"
                value={nivel?.nivForNombre ?? ""}
              />
              <CampoReadOnly
                label="Jornada"
                value={
                  fichaSeleccionada.ficJornada
                    ? fichaSeleccionada.ficJornada.charAt(0).toUpperCase() +
                      fichaSeleccionada.ficJornada.slice(1)
                    : ""
                }
              />
              <CampoReadOnly
                label="Área"
                value={area?.areaNombre ?? ""}
              />
              <CampoReadOnly
                label="Centro"
                value={centro?.cenNombre ?? ""}
              />
              <CampoReadOnly
                label="Fecha inicio"
                value={fichaSeleccionada.ficFechaInicio ?? ""}
              />
              <CampoReadOnly
                label="Fecha fin"
                value={fichaSeleccionada.ficFechaFin ?? ""}
              />
              <CampoReadOnly
                label="Estado"
                value={fichaSeleccionada.ficEstadoFormacion ?? ""}
              />
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>

        <View style={styles.botonContainer}>
          <Pressable
            style={[
              styles.boton,
              (cargando || !fichaSeleccionada) && styles.botonDeshabilitado,
            ]}
            onPress={handleAsignar}
            disabled={cargando || !fichaSeleccionada}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBoton}>Asignar y continuar</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  botonContainer: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#f4f6f8",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  inputBusqueda: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  selectorTexto: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
  placeholder: {
    color: "#999",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: "#fff",
    maxHeight: 220,
  },
  opcion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e7ec",
  },
  textoOpcion: {
    fontSize: 14,
    color: "#333",
  },
  sinResultados: {
    padding: 16,
    textAlign: "center",
    color: "#888",
    fontSize: 14,
  },
  detallesCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  detallesTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
  },
  campoReadonly: {
    marginBottom: 12,
  },
  campoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  campoValor: {
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
  },
  boton: {
    backgroundColor: "#085394",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    marginTop: 12,
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});
