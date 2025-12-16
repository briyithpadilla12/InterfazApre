import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Link, Stack } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
<>
    <Stack.Screen options={{ title: 'Oops! Página no encontrada' ,
        headerShown: false
      }} />
    <View style={styles.container}>

    
      <View style={styles.content}>

        <Text style={styles.title}>Inicio de sesión</Text>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>¿Aún no tienes cuenta?</Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}> Regístrate</Text>
          </TouchableOpacity>
        </View>

    
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

     
        <Text style={styles.label}>Contraseña </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Ingresa tu contraseña"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Feather name={showPass ? "eye-off" : "eye"} size={22} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>¿Olvidaste la contraseña?</Text>
        </TouchableOpacity>

       
       <Link href="/(tabs)/homeScreen" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Acceder</Text>
        </TouchableOpacity>
        </Link>

     
        <Text style={styles.legal}>
          Al registrarse, acepta los{" "}
          <Text style={styles.link}>Términos de servicio</Text> y la{" "}
          <Text style={styles.link}>Política de privacidad</Text>.
        </Text>

      </View>

    </View>
</>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    width: "90%",           
    maxWidth: 400,          
    
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  registerText: {
    fontSize: 15,
    color: "#555",
  },
  registerLink: {
    fontSize: 15,
    color: "#0d5bbf",
    fontWeight: "600",
  },

  label: {
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

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderColor: "#d3d3d3",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },

  forgotText: {
    color: "#0d5bbf",
    textDecorationLine: "underline",
    fontSize: 14,
    alignSelf: "flex-start",
    marginBottom: 25,
  },

  button: {
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
  buttonText: {
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
  link: {
    color: "#0d5bbf",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});
