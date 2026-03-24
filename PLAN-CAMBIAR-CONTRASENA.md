# Plan: Arreglar pantalla Cambiar contraseña

## Problemas reportados
1. No aparece mensaje de éxito al actualizar correctamente.
2. No aparece mensaje de error al equivocarse.
3. El botón mantiene color opaco en vez del azul de la app.

---

## Análisis paso a paso

### 1. Flujo de navegación
- Usuario: Configuración → "Cambiar contraseña" (Link href="/cambiarContra")
- `cambiarContra.tsx` se monta dentro del Stack del layout principal.

### 2. Flujo al enviar el formulario
1. Usuario llena campos y pulsa "Cambiar contraseña"
2. `manejarCambio()` llama a `cambiarPassword(passwordActual, nuevaPassword)`
3. ViewModel llama a `AutenticacionUsuServices.CambiarPassword()`
4. API: `PUT /api/Aprendiz/cambiar-password` con `{ passwordActual, passwordNueva }`
5. Si OK: `setExito(true)` en el ViewModel
6. Si error: `setError(mensaje)` en el ViewModel
7. El componente debe mostrar `{exito && <cajaExito>}` o `{error && <textoError>}`

### 3. Bug identificado: reset() borra los mensajes al re-renderizar

```javascript
useEffect(() => {
  return () => reset();  // cleanup se ejecuta cuando cambian las dependencias
}, [reset]);  // reset es una nueva función en cada render
```

**Qué ocurre:**
1. `setExito(true)` o `setError("...")` provoca un re-render.
2. En cada render, `reset` es una función nueva (no está memoizada).
3. Al cambiar `[reset]`, React ejecuta el cleanup del effect anterior: `reset()`.
4. `reset()` hace `setError(null)` y `setExito(false)`.
5. Los mensajes se borran antes de mostrarse.

**Solución:** Memoizar `reset` con `useCallback` para que la referencia sea estable y el cleanup solo se ejecute al desmontar.

### 4. API
- Endpoint: `PUT /api/Aprendiz/cambiar-password`
- Body: `{ passwordActual, passwordNueva }` (camelCase; ASP.NET acepta ambos)
- Respuestas: 200 OK, 400 (contraseña incorrecta), 401 (no autorizado)

### 5. Botón
- Estilo actual: `backgroundColor: "#085394"` (ya aplicado en código).
- Si sigue viéndose opaco: posible caché de Metro/Expo o el botón deshabilitado (opacity 0.6).
- Revisar que el color se aplique siempre que el botón esté habilitado.

---

## Correcciones aplicadas

1. **ViewModel:** `reset` envuelto en `useCallback([])` para referencia estable → el cleanup del `useEffect` ya no se ejecuta en cada re-render.
2. **Pantalla:** Añadido `scrollRef` y scroll automático al final cuando hay `exito` o `error`, para que el mensaje quede visible.
3. **Botón:** Base en gris; al habilitar se aplica `botonActivo` con `#085394`, sombra y elevación para que se distinga bien.
4. **Mensajes:** Cajas para éxito (verde) y error (rojo), con estilos que destacan los mensajes.
5. **extraerMensajeError:** Soporte de `detail`, `title` y fallback para 400.
