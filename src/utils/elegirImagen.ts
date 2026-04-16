import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export interface ImagenElegida {
  uri: string;
  mimeType?: string;
}

async function pedirPermisoCamara(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permiso necesario",
      "Debes permitir el acceso a la cámara para tomar fotos."
    );
    return false;
  }
  return true;
}

async function pedirPermisoGaleria(): Promise<boolean> {
  if (Platform.OS === "web") return true;
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permiso necesario",
      "Debes permitir el acceso a la galería para seleccionar fotos."
    );
    return false;
  }
  return true;
}

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 0.85,
  allowsEditing: false,
};

/**
 * Muestra un Alert con opciones "Tomar foto" / "Elegir de galería" / "Cancelar"
 * y devuelve la URI + mime de la imagen seleccionada, o null si se cancela.
 */
export function elegirImagen(): Promise<ImagenElegida | null> {
  return new Promise((resolve) => {
    Alert.alert("Agregar imagen", "¿De dónde quieres tomar la imagen?", [
      {
        text: "Tomar foto",
        onPress: async () => {
          if (!(await pedirPermisoCamara())) return resolve(null);
          const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
          if (result.canceled || !result.assets?.length) return resolve(null);
          const asset = result.assets[0];
          resolve({ uri: asset.uri, mimeType: asset.mimeType ?? undefined });
        },
      },
      {
        text: "Elegir de galería",
        onPress: async () => {
          if (!(await pedirPermisoGaleria())) return resolve(null);
          const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
          if (result.canceled || !result.assets?.length) return resolve(null);
          const asset = result.assets[0];
          resolve({ uri: asset.uri, mimeType: asset.mimeType ?? undefined });
        },
      },
      { text: "Cancelar", style: "cancel", onPress: () => resolve(null) },
    ]);
  });
}
