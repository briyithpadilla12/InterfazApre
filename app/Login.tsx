import ModalRecuperarContra from "@/src/components/ModalRecuperarContra";
import ModalRestablecerContra from "@/src/components/ModalRestablecerContra";
import { useInicioSesionViewModel } from "@/src/viewModels/inicioSesionViewModel";
import Feather from "@expo/vector-icons/Feather";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function PantallaInicioSesion() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const { error, cargando, iniciarSesion, limpiarError } = useInicioSesionViewModel();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRestablecerVisible, setModalRestablecerVisible] = useState(false);

  const abrirModal = () => {
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const cerrarModalRestablecer = () => {
    setModalRestablecerVisible(false);
  };

  const alExitoEnviadoCorreo = () => {
    setModalVisible(false);
    setModalRestablecerVisible(true);
  };
  const router = useRouter();
  const handleLogin = async () => {
    Keyboard.dismiss();
    try {
      const token = await iniciarSesion({
        correoPersonal: correo.trim(),
        password: contraseña,
      });
      console.log("token", token);
      router.replace("/comprobandoPerfil");
    } catch {
      // El error ya se muestra en el ViewModel
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.contenedor}>
        <View style={styles.contenido}>
          <Text style={styles.titulo}>Inicio de sesión</Text>

          <View style={styles.filaRegistro}>
            <Text style={styles.textoRegistro}>¿Aún no tienes cuenta?</Text>
            <Link asChild href="/Registro">
              <TouchableOpacity>
                <Text style={styles.enlaceRegistro}> Regístrate</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={styles.etiqueta}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu correo"
            value={correo}
            onChangeText={(t) => {
              setCorreo(t);
              if (error) limpiarError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!cargando}
          />

          <Text style={styles.etiqueta}>Contraseña</Text>
          <View style={styles.contenedorContraseña}>
            <TextInput
              style={styles.inputContrasena}
              placeholder="Ingresa tu contraseña"
              secureTextEntry={!mostrarContraseña}
              value={contraseña}
              onChangeText={(t) => {
                setContraseña(t);
                if (error) limpiarError();
              }}
              editable={!cargando}
            />
            <TouchableOpacity
              onPress={() => setMostrarContraseña(!mostrarContraseña)}
              disabled={cargando}
            >
              <Feather
                name={mostrarContraseña ? "eye" : "eye-off"}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <Pressable onPress={abrirModal} disabled={cargando}>
            <Text style={styles.textoOlvido}>¿Olvidaste tu contraseña?</Text>
          </Pressable>

          <ModalRecuperarContra
            visible={modalVisible}
            onClose={cerrarModal}
            onExitoEnviado={alExitoEnviadoCorreo}
          />

          <ModalRestablecerContra
            visible={modalRestablecerVisible}
            onClose={cerrarModalRestablecer}
          />

          <Pressable
            style={[styles.boton, cargando && styles.botonDeshabilitado]}
            onPress={handleLogin}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBoton}>Acceder</Text>
            )}
          </Pressable>

          {error && (
            <Text style={styles.textoError}>{error}</Text>
          )}
          <Text style={styles.legal}>
            Al iniciar sesión, aceptas los{" "}
            <Text style={styles.enlace} onPress={() => router.push("/terminos-condiciones")}>
              Términos de servicio
            </Text>{" "}
            y la{" "}
            <Text style={styles.enlace} onPress={() => router.push("/politica-privacidad")}>
              Política de privacidad
            </Text>
            .
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  contenido: {
    width: "90%",
    maxWidth: 400,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },

  filaRegistro: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },

  textoRegistro: {
    fontSize: 15,
    color: "#555",
  },

  enlaceRegistro: {
    fontSize: 15,
    color: "#0d5bbf",
    fontWeight: "600",
  },

  etiqueta: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 20,
  },

  contenedorContraseña: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderColor: "#d3d3d3",
    marginBottom: 15,
  },

  inputContrasena: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },

  textoOlvido: {
    color: "#0d5bbf",
    textDecorationLine: "underline",
    fontSize: 14,
    alignSelf: "flex-start",
    marginBottom: 25,
  },

  boton: {
    backgroundColor: "#0b5ed7",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  textoBoton: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  botonDeshabilitado: {
    opacity: 0.7,
  },

  textoError: {
    color: "#dc2626",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },

  legal: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    paddingHorizontal: 15,
  },

  enlace: {
    color: "#0d5bbf",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});


