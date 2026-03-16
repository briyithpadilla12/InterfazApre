# Análisis: "No se encontró tu diario" y cards sin validar pertenencia

## Resumen

- **Modelo Diario (tu código):** tiene `diaId`, `diaTitulo`, `diaAprendizFk`. No se usa `id` en el modelo Diario.
- **Modelo PaginaDiarioResumen:** es un tipo **solo de front** para la lista; tiene `id` (mapeado desde `pagId`/`PagId` de la API o un hash). El modelo que tú pasaste para crear página es `PaginaDiario` (pagTitulo, pagContenido, pagDiarioFk, pagEmocionFk), sin `id`.

---

## 1. Por qué sale "No se encontró tu diario"

### Dónde se produce el mensaje

- **Archivo:** `src/viewModels/paginaDiarioViewModel.tsx`
- **Línea:** `if (!p.pagDiarioFk) return "No se encontró tu diario";`
- Es decir: se muestra cuando **`pagDiarioFk` es falsy** (0, undefined, null) al llamar a `guardarPagina`.

### Flujo hasta ese mensaje

1. **nuevaPaginaDiario.tsx** – `manejarGuardar`:
   - `const d = diario ?? (await asegurarDiario());`
   - Si `d` es null, se muestra el error del diario y no se llama a `guardarPagina`.
   - Si `d` no es null, se llama:
     - `guardarPagina({ ..., pagDiarioFk: d.diaId, ... });`

2. Conclusión: el mensaje "No se encontró tu diario" solo puede aparecer si **`d.diaId` es 0 o undefined**. Es decir, el objeto `d` (diario que viene del estado o de `asegurarDiario()`) **no tiene un `diaId` válido**.

### Posibles causas (sin cambiar código, solo análisis)

- **A) La API devuelve el ID del diario con otro nombre**
  - En .NET es habitual devolver el PK como `Id`, no como `DiaId`.
  - En el servicio se usa: `raw.diaId ?? raw.DiaId` y **no** `raw.Id`.
  - Si la respuesta es `{ Id: 5, DiaTitulo: "...", DiaAprendizFk: 4 }`, entonces `raw.DiaId` es undefined y `diaId` queda **0**.
  - Eso explicaría que después `d.diaId` sea 0 y falle la validación.

- **B) GET /Diario/activos devuelve algo no esperado**
  - Si no es un array (ej. `{ data: [...] }`), en el servicio se hace `if (!Array.isArray(data)) return []`, y luego se intenta crear diario con POST.
  - Si el POST devuelve el diario dentro de un wrapper (ej. `{ data: { Id: 5, ... } }`), en el servicio se hace `normalizarDiario(data ?? {})`; si `data` es el wrapper, se estaría normalizando `{ data: { ... } }` y ni `DiaId` ni `Id` estarían en el primer nivel, y `diaId` quedaría 0.

- **C) userId no existe o no coincide**
  - Si `obtenerUserIdDesdeToken(token)` devuelve null, `asegurarDiario` devuelve null y no se llega a `guardarPagina` con "No se encontró tu diario" (se sale antes). Pero si el token trae otro claim (ej. `sub` en lugar de `nameid`) y no se mapea, el backend podría rechazar o devolver algo que no normalizamos bien.

- **D) POST /Diario devuelve vacío o error**
  - Si GET devuelve [] y el POST falla (ej. 400/409), `asegurarDiario` hace catch y devuelve null; entonces no se llamaría `guardarPagina` con un `d` sin diaId. Pero si el POST responde 200 y el body viene en otro formato (ej. solo `{ success: true }` sin el objeto diario), entonces `normalizarDiario(data)` daría `diaId: 0`.

Para saber cuál es: hay que ver en consola qué devuelve GET /Diario/activos y qué devuelve POST /Diario (y con qué claves: `Id` vs `DiaId`, y si viene envuelto en `data`).

---

## 2. Por qué las cards no validan si “te pertenecen”

### Cómo se cargan las cards

- **Pantalla:** `app/(drawer)/diarioScreen.tsx`
- **Llamada:** `PaginaDiarioService.listarActivos()` → GET **/PaginaDiario/activos**
- No se envía ningún parámetro (ni `diarioId`, ni `aprendizId`). Solo se usa el **token** en el header.

### Dónde está el “problema”

- La pantalla **confía en que el backend** solo devuelve páginas del usuario logueado.
- En el cliente **no se hace**:
  - Obtener “mi diario” (GET Diario/activos o similar).
  - Obtener `diarioId` del usuario.
  - Filtrar (o pedir) las páginas por ese `diarioId`.

Por tanto:

- Si **GET /PaginaDiario/activos** en tu API devuelve **solo** las páginas del usuario (filtrando por token/sesión), entonces en la app solo se verían las tuyas, pero **por comportamiento del backend**, no porque el front valide pertenencia.
- Si **GET /PaginaDiario/activos** devuelve **todas** las páginas activas de cualquier usuario, entonces en la app se muestran todas, y **no hay ninguna validación en el cliente** que filtre por “mi diario” o “mi usuario”.

Para comprobarlo: en los logs de DEBUG hay que ver si cada ítem de activos trae algo como `pagDiarioFk`/`PagDiarioFk` (o `diarioId`) y comparar con el `diaId` de “tu” diario. Si no tenemos en pantalla el diario del usuario, no podemos filtrar por pertenencia en el front.

---

## 3. Sobre “en el modelo del diario estás utilizando id”

- En **src/models/diario.ts** el tipo es:
  - `diaId`, `diaTitulo`, `diaAprendizFk`
- No hay propiedad `id` en el modelo Diario en el código.

Donde sí hay `id` es en **PaginaDiarioResumen** (lista de resúmenes para las cards). Ese `id` es:
- O el `pagId`/`PagId` que devuelve la API para cada página,
- O un número generado en front (hash) si no hay id.

Si tu modelo de backend para Diario no tiene `id` sino otro nombre (ej. `Id` en la API), el problema no es el nombre en TypeScript (`diaId`) sino que en **diarioService** al normalizar solo se mira `raw.diaId` y `raw.DiaId`, y no `raw.Id`. Los DEBUG que se añaden permiten ver las claves reales de la respuesta (incluido si viene `Id`) para confirmar esa causa.

---

## 4. Qué comprobar con los DEBUG

- **Diario / guardar:**
  - Respuesta cruda de GET /Diario/activos (y si es array o objeto con otra estructura).
  - Respuesta cruda de POST /Diario (claves del objeto: ¿Id, DiaId, algo más?).
  - Valor de `d` y `d.diaId` justo antes de `guardarPagina`.
  - Valor de `p.pagDiarioFk` cuando falla la validación en el ViewModel.

- **Cards / pertenencia:**
  - Respuesta cruda de GET /PaginaDiario/activos: cuántos ítems y si traen `pagDiarioFk`/`PagDiarioFk` (o `diarioId`).
  - Si en esta pantalla se tuviera el `diaId` del usuario, se podría filtrar en cliente por `pagDiarioFk === miDiaId`; ahora mismo no se obtiene ese `diaId` en diarioScreen.

Con eso se puede identificar la causa exacta del “No se encontró tu diario” y si hace falta filtrar por diario en el cliente o en el backend.
