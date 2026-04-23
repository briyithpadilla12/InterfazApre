import { useRegistroViewModel } from "@/src/viewModels/registro";
import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Collapsible from "react-native-collapsible";

export default function RegistroPerfil() {

  const { registrar, cargando, error } = useRegistroViewModel();

  const [tipoDocumento, setTipoDocumento] = useState<string>("");
  const [numeroDocumento, setNumeroDocumento] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [mostrarContraseña, setMostrarContraseña] = useState(false);


  const manejarRegistro = async () => {
    const fueExitoso = await registrar({
      aprTipoDocumento: tipoDocumento,
      aprNroDocumento: numeroDocumento,
      aprPassword: password,
      correoPersonal: correo,
    });

    if (fueExitoso) {
      router.push({
        pathname: "/verificarCod",
        params: { numeroDocumento }
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Regístrate</Text>

        <View style={styles.fila}>
          <View style={styles.columna}>
            <Text style={styles.label}>Tipo de documento</Text>

            <Pressable onPress={() => setOpen(!open)}>
              <View style={styles.selector}>
                <TextInput
                  style={styles.input}
                  placeholder="Selecciona"
                  value={tipoDocumento}
                  editable={false}
                  pointerEvents="none"
                />
                <Feather
                  name={open ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="#333"
                />
              </View>
            </Pressable>

            <Collapsible collapsed={!open}>
              <View style={styles.dropdown}>
                <Pressable
                  style={styles.opcion}
                  onPress={() => {
                    setTipoDocumento("CC");
                    setOpen(false);
                  }}
                >
                  <Text>CC</Text>
                </Pressable>

                <Pressable
                  style={styles.opcion}
                  onPress={() => {
                    setTipoDocumento("TI");
                    setOpen(false);
                  }}
                >
                  <Text>TI</Text>
                </Pressable>
              </View>
            </Collapsible>
          </View>

          <View style={styles.columna}>
            <Text style={styles.label}>Número de documento</Text>
            <TextInput
              style={styles.input}
              value={numeroDocumento}
              onChangeText={setNumeroDocumento}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Correo personal</Text>
        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
         <View style={styles.contenedorContraseña}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
           secureTextEntry={!mostrarContraseña}
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

        <Pressable style={styles.boton} onPress={manejarRegistro} disabled={cargando}>
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBoton}>Regístrar</Text>
          )}
        </Pressable>

        {error && (
          <Text style={{ color: "red", marginTop: 10 }}>
            {error}
          </Text>
        )}

        <Text style={styles.terminos}>
          Al registrarte acepta los Términos de servicio y la Política de privacidad
        </Text>

        <Link href="/Login" style={styles.login}>
          ¿Ya tienes cuenta?
        </Link>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    contenedor: {
        flexGrow: 1,
        backgroundColor: "#f2f4f7",
        justifyContent: "center",
        padding: 16,
    },
     contenedorContraseña: {
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 10,
   
    borderColor: "#d3d3d3",
    marginBottom: 15,
  },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#101828",
    },
    fila: {
        flexDirection: "row",
        gap: 10,
    },
    columna: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        color: "#475467",
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d0d5dd",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: "#fff",
        flex: 1
    },
    boton: {
        backgroundColor: "#085394",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 20,
    },
    textoBoton: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 15,
    },
    terminos: {
        fontSize: 12,
        color: "#667085",
        textAlign: "center",
        marginTop: 16,
    },
    login: {
        marginTop: 14,
        textAlign: "center",
        color: "#101828",
        fontWeight: "500",
    },

    dropdown: {
        borderWidth: 1,
        borderColor: "#d0d5dd",
        borderRadius: 10,
        marginTop: 4,
        backgroundColor: "#fff",
    },

    opcion: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e4e7ec",
    },
    selector: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#d0d5dd",
  borderRadius: 10,
  paddingHorizontal: 8,
  paddingVertical: 6,
},

});
