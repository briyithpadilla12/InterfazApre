import React from "react";
import { View, Text, ScrollView , StyleSheet} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

   
      <View style={styles.centerHeader}>
        <Ionicons name="heart-circle" size={60} color="#00a36c" />
        <Text style={styles.title}>Sobre Nosotros</Text>
        <Text style={styles.subtitle}>Healthy Mind</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <FontAwesome5 name="graduation-cap" size={28} color="#00a36c" />
          <Text style={styles.cardTitle}>Desarrollado por SENA</Text>
        </View>

        <Text style={styles.cardText}>
          Healthy Mind es una aplicación desarrollada por aprendices del
          Servicio Nacional de Aprendizaje – SENA, como parte de nuestro
          proceso de formación en Análisis y Desarrollo de Software.
        </Text>

        <Text style={styles.cardText}>
          Sin embargo, más allá de ser un proyecto académico, nace con el
          propósito de convertirse en una herramienta real de apoyo para los
          aprendices y psicólogos de la institución.
        </Text>
      </View>

      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="people" size={28} color="#00a36c" />
          <Text style={styles.cardTitle}>Nuestro Objetivo</Text>
        </View>

        <Text style={styles.cardText}>
          Nuestro objetivo es servir como un puente de comunicación y
          acompañamiento, que facilite la gestión de citas, el seguimiento de
          procesos psicológicos y el acceso a recursos que promuevan el
          bienestar emocional.
        </Text>
      </View>

   
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="heart" size={28} color="#00a36c" />
          <Text style={styles.cardTitle}>Nuestros Valores</Text>
        </View>

        <Text style={styles.cardText}>
          Creemos firmemente que la tecnología también puede cuidar de la salud mental,
          por eso diseñamos esta app con valores de{" "}
          <Text style={styles.bold}>empatía, confianza y compromiso</Text>,
          garantizando siempre la privacidad de la información.
        </Text>
      </View>

      
      <View style={styles.centerHeader}>
        <MaterialIcons name="shield" size={60} color="#1a73e8" />
        <Text style={styles.title}>Privacidad</Text>
      </View>

      <Text style={styles.description}>
        Tu información personal y datos de salud mental están completamente protegidos.
        Implementamos las mejores prácticas de seguridad para garantizar que tu privacidad
        esté siempre resguardada.
      </Text>

     
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          En Healthy Mind unimos{" "}
          <Text style={styles.bold}>innovación y solidaridad</Text>{" "}
          para aportar, desde nuestra formación como aprendices,
          al bienestar integral de toda la comunidad SENA.
        </Text>
      </View>

   
      <Text style={styles.version}>Versión 1.0.0 • SENA 2025</Text>
      <Text style={styles.footer}>Desarrollado con ❤️ por aprendices SENA</Text>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },

  
  centerHeader: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    marginTop: 8,
    fontWeight: "bold",
     color: "#085394",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 4,
    color: "#00a36c",
    textAlign: "center",
  },

 
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 20,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },

  cardText: {
    fontSize: 16,
    color: "#4f4f4f",
    lineHeight: 22,
    marginBottom: 10,
  },

  bold: {
    fontWeight: "bold",
  },

  /* PRIVACIDAD */
  description: {
    fontSize: 16,
    color: "#4f4f4f",
    lineHeight: 22,
    marginBottom: 20,
  },

  highlightBox: {
    backgroundColor: "#e6f7ef",
    padding: 18,
    borderRadius: 12,
    marginBottom: 25,
  },

  highlightText: {
    fontSize: 15,
    color: "#1a1a1a",
    lineHeight: 22,
  },

  version: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 13,
    color: "#7a7a7a",
  },
  footer: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 13,
    color: "#7a7a7a",
    marginBottom: 40,
  },
});
