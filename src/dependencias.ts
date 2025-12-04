// src/app/dependencies.ts

import ArticulosServices from "../src/services/articulosService";
import { ArticulosViewModel } from "../src/viewModels/articulosViewModel"

// Instanciar UNA sola vez
const articulosService = new ArticulosServices();
export const articulosViewModel = new ArticulosViewModel(articulosService);
