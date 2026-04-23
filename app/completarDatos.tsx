import React from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCompletarDatosViewModel } from "@/src/viewModels/completarDatosViewModel";

function renderInput(
  label: string,
  value: string,
  onChange: (v: string) => void,
  campo: string,
  keyboard: "default" | "numeric" | "email-address" | "phone-pad" = "default"
) {
  return (
    <View style={styles.inputContainer} key={campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        placeholder={`Ingresa ${label.toLowerCase()}`}
        placeholderTextColor="#999"
      />
    </View>
  );
}

export default function CompletarDatosScreen() {
  const { documento } = useLocalSearchParams<{ documento: string }>();
  const router = useRouter();
  const {
    formulario,
    actualizarCampo,
    cargando,
    error,
    guardar,
    busquedaCiudad,
    cambiarBusquedaCiudad,
    mostrarResultadosCiudad,
    ciudadesFiltradas,
    ciudadSeleccionada,
    seleccionarCiudad,
    cargandoCiudades,
    errorCiudades,
  } =
    useCompletarDatosViewModel(documento ?? "");

  const handleGuardar = async () => {
    Keyboard.dismiss();
    const ok = await guardar();
    if (ok) {
      router.replace({
        pathname: "/asignarFicha",
        params: { documento: String(documento ?? "") },
      });
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.contenedor} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>Completar tu perfil</Text>
          <Text style={styles.subtitulo}>
            Para usar la aplicación necesitamos que completes la siguiente información.
          </Text>

          {renderInput("Fecha de nacimiento (YYYY-MM-DD)", formulario.aprFechaNac, (v) => actualizarCampo("aprFechaNac", v), "aprFechaNac")}
          {renderInput("Nombre", formulario.aprNombre, (v) => actualizarCampo("aprNombre", v), "aprNombre")}
          {renderInput("Segundo nombre", formulario.aprSegundoNombre, (v) => actualizarCampo("aprSegundoNombre", v), "aprSegundoNombre")}
          {renderInput("Apellido", formulario.aprApellido, (v) => actualizarCampo("aprApellido", v), "aprApellido")}
          {renderInput("Segundo apellido", formulario.aprSegundoApellido, (v) => actualizarCampo("aprSegundoApellido", v), "aprSegundoApellido")}
          {renderInput("Correo institucional", formulario.aprCorreoInstitucional, (v) => actualizarCampo("aprCorreoInstitucional", v), "aprCorreoInstitucional", "email-address")}
          {renderInput("Dirección", formulario.aprDireccion, (v) => actualizarCampo("aprDireccion", v), "aprDireccion")}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ciudad</Text>
            <TextInput
              style={styles.input}
              value={busquedaCiudad}
              onChangeText={cambiarBusquedaCiudad}
              placeholder={
                ciudadSeleccionada
                  ? ciudadSeleccionada.ciuNombre
                  : "Escribe al menos 3 letras para buscar"
              }
              placeholderTextColor="#999"
            />
            {cargandoCiudades ? (
              <Text style={styles.ayudaTexto}>Cargando ciudades...</Text>
            ) : errorCiudades ? (
              <Text style={styles.errorInline}>{errorCiudades}</Text>
            ) : busquedaCiudad.trim().length > 0 && busquedaCiudad.trim().length < 3 ? (
              <Text style={styles.ayudaTexto}>Escribe al menos 3 letras.</Text>
            ) : null}

            {mostrarResultadosCiudad && busquedaCiudad.trim().length >= 3 && ciudadesFiltradas.length > 0 ? (
              <View style={styles.resultadosBox}>
                {ciudadesFiltradas.map((c) => (
                  <Pressable
                    key={c.ciuCodigo}
                    style={styles.resultadoItem}
                    onPress={() => seleccionarCiudad(c)}
                  >
                    <Text style={styles.resultadoTitulo}>{c.ciuNombre}</Text>
                    <Text style={styles.resultadoSub}>
                      {c.regional?.regNombre ?? "Sin regional"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
          {renderInput("Teléfono", formulario.aprTelefono, (v) => actualizarCampo("aprTelefono", v), "aprTelefono", "phone-pad")}
          {renderInput("EPS", formulario.aprEps, (v) => actualizarCampo("aprEps", v), "aprEps")}
          {renderInput("Patología", formulario.aprPatologia, (v) => actualizarCampo("aprPatologia", v), "aprPatologia")}
          {renderInput("Tipo de población", formulario.aprTipoPoblacion, (v) => actualizarCampo("aprTipoPoblacion", v), "aprTipoPoblacion")}
          {renderInput("Teléfono acudiente", formulario.aprTelefonoAcudiente, (v) => actualizarCampo("aprTelefonoAcudiente", v), "aprTelefonoAcudiente", "phone-pad")}
          {renderInput("Nombre acudiente", formulario.aprAcudNombre, (v) => actualizarCampo("aprAcudNombre", v), "aprAcudNombre")}
          {renderInput("Apellido acudiente", formulario.aprAcudApellido, (v) => actualizarCampo("aprAcudApellido", v), "aprAcudApellido")}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.boton, cargando && styles.botonDeshabilitado]}
            onPress={handleGuardar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBoton}>Guardar y continuar</Text>
            )}
          </Pressable>
        </ScrollView>
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
    paddingBottom: 40,
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
    marginBottom: 20,
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  boton: {
    backgroundColor: "#085394",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  botonDeshabilitado: {
    opacity: 0.7,
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
  ayudaTexto: {
    marginTop: 6,
    fontSize: 12,
    color: "#6b7280",
  },
  errorInline: {
    marginTop: 6,
    fontSize: 12,
    color: "#dc2626",
  },
  resultadosBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    maxHeight: 220,
    backgroundColor: "#fff",
  },
  resultadoItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  resultadoTitulo: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  resultadoSub: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b7280",
  },
});
