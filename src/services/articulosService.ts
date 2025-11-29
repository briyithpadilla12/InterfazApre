import articles from "../content/articles.json";
import { Articulo } from "../models/articulo";

export default class ArticulosServices {

    async obtenerArticulos(): Promise<Articulo[]> {
        return articles.map((item) => ({
            id: item.id,
            titulo: item.titulo,
            resumen: item.resumen ?? "",
            parrafos: item.parrafos ?? []
        }));
    }
}
