import api from "./apiCliente";

export interface TestResumen {
  testGenCodigo: number;
  plantillaNombre: string | null;
  plantillaDescripcion: string | null;
  testGenEstadoTest: string | null;
  fechaRealizacion: string | null;
  psicologo: { psiCodigo: number; psiNombre: string; psiApellido: string } | null;
}

export interface OpcionApi {
  plaOpcCodigo: number;
  plaOpcTexto: string;
  plaOpcOrden: number;
}

export interface PreguntaApi {
  plaPrgCodigo: number;
  plaPrgTexto: string;
  plaPrgTipo: string;
  plaPrgOrden: number;
  opciones: OpcionApi[];
}

export interface TestConPreguntas {
  testGenCodigo: number;
  testGenEstadoTest: string | null;
  plantillaNombre: string;
  preguntas: PreguntaApi[];
}

export interface RespuestaItem {
  preguntaId: number;
  opcionId: number;
}

/** Misma API que TestGeneral; ruta sin "Test" para evitar bloqueos en red/extensiones. */
const TEST_API = "evaluaciones-hm";

const TestService = {
  async misTests(): Promise<TestResumen[]> {
    const { data } = await api.get(`${TEST_API}/mis-tests`);
    return Array.isArray(data) ? data : [];
  },

  async preguntas(testId: number): Promise<TestConPreguntas> {
    const { data } = await api.get(`${TEST_API}/mis-tests/${testId}/preguntas`);
    return data;
  },

  async responder(testId: number, respuestas: RespuestaItem[]): Promise<void> {
    await api.post(`${TEST_API}/mis-tests/${testId}/responder`, { respuestas });
  },
};

export default TestService;
