import { Articulo } from "../models/articulo";
import ArticulosServices from "../services/articulosService";

export class ArticulosViewModel {

    private articulos: Articulo[] = [];
    private servicio: ArticulosServices;

    constructor(servicio: ArticulosServices) {
        this.servicio = servicio;
    }

    public getArticulos(): Articulo[] {
        return this.articulos;
    }

    public async cargarArticulos(): Promise<Articulo[]> {
        const datos = await this.servicio.obtenerArticulos();
        this.articulos = datos;
        return this.articulos;
    }

    public async obtenerArticuloPorId(id: string): Promise<Articulo | null> {
        const idNum = Number(id);
        if (isNaN(idNum)) return null;

        if (this.articulos.length === 0) {
            await this.cargarArticulos();
        }

        return this.articulos.find(a => a.id === idNum) || null;
    }
}
