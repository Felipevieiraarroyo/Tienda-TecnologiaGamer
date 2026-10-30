# Starter del desafío grupal S3

## Arrancar

```bash
npm install
npm run dev
```

Abre http://localhost:5173 e inicia sesión con tu usuario de clase.
¿No tienes usuario? Créalo en https://api-funval-g6.onrender.com/docs → `POST /auth/register`.

## Qué ya viene hecho

- Vite + React 19 + TypeScript + Tailwind 4
- React Router con todas las rutas conectadas (`App.tsx` — no hace falta tocarlo)
- Axios con el interceptor de **request** (pega el token)
- Store de Zustand con `persist` (la sesión sobrevive al F5)
- Login completo con react-hook-form + zod
- Layout con header y navegación, tarjeta de producto, hook `useApi`
- Página `/laboratorio` para probar los componentes de UI
- Página `/admin/productos` (solo admin) para crear los productos de la tienda, con imagen
- `src/tema.ts` + colores `marca-*` en `src/index.css` para la identidad de su tienda

## Dónde está cada tarea

Busca `TODO [` en el proyecto (Ctrl + Shift + F).

```
src/
├── tema.ts                          TODOS: nombre, textos y categorías de su tienda
├── index.css                        TODOS: paleta marca-* y fuente
├── lib/axios.ts                     TODO [A] interceptor de respuesta (401)
├── components/
│   ├── RutaProtegida.tsx            TODO [A]
│   ├── RutaPublica.tsx              TODO [A]
│   ├── InputFotoPerfil.tsx          TODO [B]
│   ├── Paginacion.tsx               TODO [C]
│   ├── ListaProductos.tsx           TODO [D]  ← aquí se juntan C y D
│   ├── ErrorBoundary.tsx            TODO [D]
│   └── ui/                          TODO [D]  Skeleton, AlertaBanner, EstadoVacio
├── services/
│   ├── perfil.ts                    TODO [B] FormData
│   └── productos.ts                 TODO [C] getPagina
└── pages/
    ├── LoginPage.tsx                TODO [A] aviso de sesión expirada
    ├── PerfilPage.tsx               TODO [B]
    └── ProductosPage.tsx            TODO [C] solo productos de la tienda + useSearchParams
```

## API

Base: `https://api-funval-g6.onrender.com` · Swagger: `/docs`

| Método | Ruta                                   | Uso                                                                  |
| ------ | -------------------------------------- | -------------------------------------------------------------------- |
| POST   | `/auth/login`                          | `{ email, password }` → `{ access_token, user_name, user_role }`     |
| GET    | `/auth/me`                             | Perfil del usuario (requiere token)                                  |
| PUT    | `/auth/perfil`                         | `multipart/form-data` con `name` y `foto` (requiere token)           |
| GET    | `/products/?skip=0&limit=6&category=X` | Lista de productos (pública). `category` es exacto                   |
| POST   | `/products/`                           | Crear producto (solo admin)                                          |
| POST   | `/upload/`                             | `multipart/form-data` con `file` → `{ url, public_id }` (solo admin) |
| GET    | `/users/`                              | Lista de usuarios (para el extra de métricas)                        |

## Crear repositorio y desplegarlo en vercel/netlify/githubpages

# cada miembro debera trabajar en su respectiva rama dependiendo de lo que esta realizando.

## Persona C: catálogo paginado

Trabajo local en la rama `persona-c`.

### Qué cambió

- `src/services/productos.ts`: `getPagina` calcula `skip = (pagina - 1) * porPagina`.
  Para una categoría pide `limit = porPagina + 1`: muestra los primeros seis y
  usa el séptimo solamente para saber si hay otra página (`hayMas`).
- La opción **Todas** consulta exclusivamente las categorías de `tema.categorias`.
  La API solo acepta una categoría exacta por petición, por lo que se combinan
  las respuestas, se ordenan por ID y se extrae la página del conjunto.
  Se pide a cada categoría hasta el final de la página solicitada más uno:
  no se descarga el catálogo global ni se filtra después de paginarlo.
  Esta solución hace una petición por categoría; el volumen crece en páginas
  avanzadas. Un catálogo grande necesitaría soporte del backend para filtrar
  varias categorías en una sola consulta paginada.
- `src/pages/ProductosPage.tsx`: la URL es la fuente del estado de página y
  categoría mediante `useSearchParams`. Recargar, compartir el enlace y usar
  Atrás/Adelante conservan la selección. Una categoría ajena vuelve a `Todas`;
  una página inválida vuelve a `1`. La corrección reemplaza la entrada actual
  del historial y conserva otros parámetros. Cambiar categoría vuelve a página 1.
- `src/components/Paginacion.tsx`: Anterior se deshabilita en página 1;
  Siguiente cuando no hay más datos; ambos durante la carga. Incluye etiqueta
  accesible de navegación, foco de teclado y anuncio del número de página.
- `src/tema.ts`: categorías iniciales `Gamer-Teclados`, `Gamer-Mouses`,
  `Gamer-Audifonos` y `Gamer-Monitores`. Son los mismos valores usados por el
  formulario de carga de productos; el equipo puede ajustarlos aquí.

La página mantiene las props existentes de `ListaProductos` para integrarse con
la persona D. Los skeletons, alertas, estado vacío y ErrorBoundary siguen siendo
responsabilidad de D. El buscador con debounce es un extra pendiente.

### Probar y presentar

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 5184
```

Inicia sesión con tu usuario de clase y visita `/productos`. Para demostrar
Siguiente hacen falta al menos siete productos de la tienda; para demostrarlo
en una categoría, al menos siete en esa categoría. No se crearon productos en
la API compartida como parte de esta implementación. En la consulta del
30 de octubre de 2026 no había productos con las categorías `Gamer-` configuradas.

1. Abre `/productos?categoria=Gamer-Teclados&pagina=1`.
2. Explica que seis tarjetas requieren una petición con `skip=0&limit=7`.
3. Pulsa Siguiente: la URL pasa a `pagina=2` y la petición usa `skip=6&limit=7`.
4. Recarga: se mantienen categoría y página.
5. Cambia categoría: se vuelve a página 1. Prueba Atrás y Adelante.
6. Prueba `/productos?categoria=Ropa-Polos&pagina=abc`: se corrige a `Todas`, página 1.
7. Selecciona Todas: solo se combinan las categorías configuradas de la tienda.

Frase para la demo: «Mi parte conecta el catálogo con la API, mantiene los filtros
en la URL y controla la paginación. Pido un producto adicional para saber si hay
siguiente página sin depender de un total. Las categorías compartidas en el tema
evitan mostrar productos de otros equipos».

### Validación local

- `npm run build`: compilación de TypeScript y build de Vite.
- `npm run lint`: revisión estática; el hook compartido `useApi` conserva tres
  advertencias previas, ajenas a los archivos de C.
- Prueba automatizada de navegador con respuestas simuladas: 24 productos sin
  duplicados ni productos de otro grupo, límites de paginación, parámetros de
  la API, bloqueo durante carga, filtros, recarga, historial, seis páginas
  inválidas, respuesta vacía, error del servidor y vista móvil.
  Las respuestas simuladas y la sesión de prueba se limitaron al navegador de
  pruebas; no se añadieron al código de la aplicación ni al backend.
