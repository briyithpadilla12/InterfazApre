import { useCambiarContraViewModel } from "@/src/viewModels/cambiarContraViewModel";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

export default function CambiarContraseña() {
  const { cambiarPassword, cargando, error, exito, reset } = useCambiarContraViewModel();
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  useEffect(() => {
    if (exito || error) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [exito, error]);

  useEffect(() => {
    if (exito) {
      const timer = setTimeout(() => router.back(), 2500);
      return () => clearTimeout(timer);
    }
  }, [exito]);

  const manejarCambio = async () => {
    Keyboard.dismiss();
    if (nuevaPassword !== confirmarPassword) {
      return;
    }
    const ok = await cambiarPassword(passwordActual, nuevaPassword);
    if (ok) {
      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
    }
  };

  const passwordsCoinciden = nuevaPassword === confirmarPassword || !confirmarPassword;
  const puedeEnviar =
    passwordActual.trim().length > 0 &&
    nuevaPassword.length >= 6 &&
    confirmarPassword === nuevaPassword &&
    !cargando;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.contenedor}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cajaInformativa}>
          <Text style={styles.textoInformativo}>
            Por tu seguridad, necesitamos verificar tu contraseña actual antes de establecer una nueva.
          </Text>
        </View>

        <Text style={styles.etiqueta}>Contraseña actual</Text>
        <TextInput
          placeholder="Ingresa tu contraseña actual"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={passwordActual}
          onChangeText={setPasswordActual}
          secureTextEntry
          editable={!cargando}
          autoCapitalize="none"
        />

        <Text style={styles.etiqueta}>Nueva contraseña</Text>
        <TextInput
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={nuevaPassword}
          onChangeText={setNuevaPassword}
          secureTextEntry
          editable={!cargando}
          autoCapitalize="none"
        />

        <Text style={styles.etiqueta}>Confirmar nueva contraseña</Text>
        <TextInput
          placeholder="Repite la nueva contraseña"
          placeholderTextColor="#9CA3AF"
          style={[styles.input, !passwordsCoinciden && confirmarPassword ? styles.inputError : null]}
          value={confirmarPassword}
          onChangeText={setConfirmarPassword}
          secureTextEntry
          editable={!cargando}
          autoCapitalize="none"
        />
        {!passwordsCoinciden && confirmarPassword ? (
          <Text style={styles.textoErrorCampo}>Las contraseñas no coinciden</Text>
        ) : null}

        {error ? (
          <View style={styles.cajaError}>
            <Text style={styles.textoError}>⚠ {error}</Text>
          </View>
        ) : null}
        {exito ? (
          <View style={styles.cajaExito}>
            <Text style={styles.textoExito}>✓ Contraseña actualizada correctamente</Text>
          </View>
        ) : null}

        <Pressable
          style={[
            styles.boton,
            !puedeEnviar && styles.botonDeshabilitado,
            puedeEnviar && styles.botonActivo,
          ]}
          onPress={manejarCambio}
          disabled={!puedeEnviar}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBoton}>Cambiar contraseña</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} disabled={cargando} style={styles.botonVolver}>
          <Text style={styles.textoVolver}>Volver</Text>
        </Pressable>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contenedor: {
    
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,

    paddingBottom: 40,
  },

  cajaInformativa: {
    backgroundColor: "#E8F1FF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },

  textoInformativo: {
    color: "#1F3A8A",
    fontSize: 14,
    lineHeight: 20,
  },

  etiqueta: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 18,
    color: "#111827",
  },

  inputError: {
    borderColor: "#dc2626",
  },
  textoErrorCampo: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
  cajaError: {
    backgroundColor: "#FEE2E2",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  textoError: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  cajaExito: {
    backgroundColor: "#D1FAE5",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#34D399",
  },
  textoExito: {
    color: "#059669",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  boton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#9CA3AF",
  },
  botonActivo: {
    backgroundColor: "#085394",
    shadowColor: "#085394",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  botonVolver: {
    alignItems: "center",
    marginTop: 16,
  },
  textoVolver: {
    color: "#6B7280",
    fontSize: 14,
  },
});
