import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { useInicioSesionViewModel } from "@/src/viewModels/inicioSesionViewModel";
import { useRouter } from "expo-router";
import ModalRecuperarContra from "@/src/components/ModalRecuperarContra";
 
  


export default function PantallaInicioSesion() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const {error, cargando, iniciarSesion} = useInicioSesionViewModel()
   const [modalVisible, setModalVisible] = useState<boolean>(false);

  const abrirModal = () => {
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

const router = useRouter();
 const Userlogueado = async () => {
  try {
    const token = await iniciarSesion({
      CorreoPersonal: correo,
      Password: contraseña
    });

    console.log("LOGIN EXITOSO. TOKEN:", token);
     router.replace("/(drawer)");

  } catch (error) {
    console.log("Fallo login");
  }
};
  return (
    <>

      <View style={styles.contenedor}>
        <View style={styles.contenido}>

          <Text style={styles.titulo}>Inicio de sesión</Text>

          <View style={styles.filaRegistro}>
            <Text style={styles.textoRegistro}>¿Aún no tienes cuenta?</Text>
            <Link asChild href={"/Registro"}>
              <TouchableOpacity>
                <Text style={styles.enlaceRegistro}
                > Regístrate</Text>
              </TouchableOpacity></Link>
          </View>

          <Text style={styles.etiqueta}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu correo"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
          />

          <Text style={styles.etiqueta}>Contraseña</Text>
          <View style={styles.contenedorContraseña}>
            <TextInput
              style={styles.inputContrasena}
              placeholder="Ingresa tu contraseña"
              secureTextEntry={!mostrarContraseña}
              value={contraseña}
              onChangeText={setContraseña}
            />
            <TouchableOpacity
              onPress={() => setMostrarContraseña(!mostrarContraseña)}
            >
              <Feather
                name={mostrarContraseña ? "eye" : "eye-off"}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>

         <Pressable  onPress={abrirModal}>
        <Text style={styles.textoOlvido}>
          ¿Olvidaste tu contraseña?
        </Text>
      </Pressable>

      <ModalRecuperarContra
        visible={modalVisible}
        onClose={cerrarModal}
      />

          
            <Pressable style={styles.boton}
            onPress={Userlogueado}
            >
              <Text style={styles.textoBoton}>Acceder</Text>
            </Pressable >
        
             {error && (
          <Text style={{ color: "red", marginTop: 10 }}>
            {error}
          </Text>
        )}
          <Text style={styles.legal}>
            Al iniciar sesión, aceptas los{" "}
            <Text style={styles.enlace}>Términos de servicio</Text> y la{" "}
            <Text style={styles.enlace}>Política de privacidad</Text>.
          </Text>

        </View>
      </View>

    </>
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


