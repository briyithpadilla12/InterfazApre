import { Perfil } from "../models/perfil";

class PerfilService {
  async obtenerPerfil(): Promise<Perfil> {
    
    return {
      nombre: "Jean Carlos Coronell",
      rol: "APRENDIZ",
      programa: "ADSO NO.2998937",
      correoPersonal: "jeancoronell@gmail.com",
      correoSena: "JeanCoronell@soy.sena.edu.com",
      numeroID: "ID-1010006601",
      direccion: "Carrera 11 #25A-58",
      municipio: "Malambo",
      telefono: 3242010289,
    };
  }
}

export default new PerfilService();
