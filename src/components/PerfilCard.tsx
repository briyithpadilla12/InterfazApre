import { View, Text, StyleSheet, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";

interface PerfilCardProps {
  nombreCompleto: string;
  correoPersonal: string;
  correoInstitucional: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  direccion: string;
  telefono: string;
  fechaNacimiento?: string;
  estadoAprendiz?: string;
  eps?: string;
  acudienteNombre?: string;
  acudienteApellido?: string;
  acudienteTelefono?: string;
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <View style={styles.row}>
      <Feather name={icon as any} size={18} color="#085394" style={styles.rowIcon} />
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function PerfilCard({
  nombreCompleto,
  correoPersonal,
  correoInstitucional,
  tipoDocumento,
  numeroDocumento,
  direccion,
  telefono,
  fechaNacimiento,
  estadoAprendiz,
  eps,
  acudienteNombre,
  acudienteApellido,
  acudienteTelefono,
}: PerfilCardProps) {
  console.log("[DEBUG PerfilCard] Props recibidas:", { nombreCompleto, correoPersonal, telefono });
  const docCompleto = [tipoDocumento, numeroDocumento].filter(Boolean).join(" ") || numeroDocumento;
  const acudienteCompleto = [acudienteNombre, acudienteApellido].filter(Boolean).join(" ");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.card}>
        <View style={styles.infoSection}>
          <Text style={styles.name}>{nombreCompleto || "—"}</Text>
          {estadoAprendiz ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{estadoAprendiz}</Text>
            </View>
          ) : null}

          <View style={styles.separator} />

          <InfoRow icon="mail" label="Correo personal" value={correoPersonal} />
          <InfoRow icon="mail" label="Correo institucional" value={correoInstitucional} />
          <InfoRow icon="credit-card" label="Documento" value={docCompleto} />
          <InfoRow icon="phone" label="Teléfono" value={telefono} />
          <InfoRow icon="map-pin" label="Dirección" value={direccion} />
          <InfoRow icon="calendar" label="Fecha de nacimiento" value={fechaNacimiento} />
          <InfoRow icon="activity" label="EPS" value={eps} />
          {acudienteCompleto || acudienteTelefono ? (
            <View style={styles.acudienteSection}>
              <Text style={styles.sectionTitle}>Acudiente</Text>
              <InfoRow icon="user" label="Nombre" value={acudienteCompleto} />
              <InfoRow icon="phone" label="Teléfono" value={acudienteTelefono} />
            </View>
          ) : null}

          <View style={styles.separator} />
          <Link asChild href="/editarPerfil">
            <Pressable style={styles.editButton}>
              <Feather name="edit-2" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    color: "#085394",
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  infoSection: {
    width: "100%",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#085394",
    textAlign: "center",
    marginBottom: 4,
  },
  badge: {
    alignSelf: "center",
    backgroundColor: "#e6f4ea",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 13,
    color: "#1e7e34",
    fontWeight: "600",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  rowIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  acudienteSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#085394",
    marginBottom: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#085394",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
