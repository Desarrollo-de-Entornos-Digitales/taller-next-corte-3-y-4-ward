# WARD - Wardrobe Management Application

Una aplicación web moderna para gestionar tu armario digital. WARD permite a los usuarios registrarse, iniciar sesión, agregar prendas de ropa a su armario personal, filtrar por tipos de prendas, ver detalles de cada prenda, y marcar favoritos.
Link de figma: https://www.figma.com/design/qydMi6x1UsHVyCrxn2qkG4/WARD?node-id=12-38&t=gDgf6Xd6a8drT4Xm-1

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Autenticación, Autorización y Gestión del Estado](#autenticación-autorización-y-gestión-del-estado)
- [Validación de Funcionalidades](#validación-de-funcionalidades)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## Descripción General

WARD es una aplicación **Next.js 16** con autenticación basada en tokens, gestión de estado con hooks de React, y una interfaz moderna construida con **Tailwind CSS** y **DaisyUI**.

**Stack Tecnológico:**

- **Frontend**: React 19, Next.js 16, TypeScript
- **Estilos**: Tailwind CSS 4, DaisyUI 5
- **Cliente HTTP**: Axios
- **Autenticación**: Basada en tokens (JWT) almacenados en cookies httpOnly

---

## Requisitos Previos

Antes de instalar WARD, asegúrate de tener:

- **Node.js**: v18.17 o superior
- **npm**: v9 o superior (o yarn/pnpm como alternativas)
- **Git**: Para clonar el repositorio
- **Variable de entorno API**: URL del servidor backend

---

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ward.git
cd ward
```

### 2. Instalar Dependencias

```bash
npm install
```

o con yarn:

```bash
yarn install
```

---

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API=http://localhost:3001/api
```

**Descripción de variables:**

- `NEXT_PUBLIC_API`: URL base del servidor backend (ej: `http://localhost:3001/api`)

### Estructura de Directorios Esperada

```
src/
├── app/
│   ├── (public)/           # Rutas públicas (login, register)
│   ├── (dashboard)/        # Rutas protegidas (requieren autenticación)
│   ├── common/             # Componentes, hooks, servicios compartidos
│   └── layout.tsx          # Layout raíz
├── lib/
│   └── axios/              # Configuración del cliente HTTP
├── util/                   # Utilidades generales
└── ...
```

---

## Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Modo Producción

```bash
npm run build
npm start
```

### Linting y Formato

```bash
npm run lint
npm run format
```

---

## Funcionalidades Implementadas

### 1. **Autenticación de Usuarios**

#### Login

- Endpoint: `POST /auth/login`
- Campos requeridos: email, password
- Respuesta: Token JWT almacenado en cookie httpOnly
- Ubicación: `src/app/(public)/login/`

**Flujo:**

1. Usuario ingresa credenciales en el formulario de login
2. Se envía solicitud a `loginAction` (server action)
3. Backend retorna `access_token`
4. Token se almacena en cookie httpOnly (seguro, no accesible por JavaScript)
5. Usuario es redirigido al dashboard

#### Registro

- Endpoint: `POST /auth/register`
- Campos requeridos: email, password, confirmPassword
- Ubicación: `src/app/(public)/register/`

**Flujo:**

1. Usuario completa formulario de registro
2. Validación de contraseñas coincidentes en cliente
3. Se envía solicitud a `registerAction`
4. Backend crea nuevo usuario y retorna token
5. Usuario es redirigido al dashboard

### 2. **Gestión del Armario (Garments)**

#### Agregar Prendas

- Ubicación: `src/app/(dashboard)/register-garment/`
- Permite al usuario agregar prendas a su armario personal
- Tipos soportados: Jacket, Shirt, Pants, T-Shirt, Sweater, Dress, Skirt, Shoes, etc.

#### Ver Listado de Prendas

- Ubicación: `src/app/(dashboard)/feed/`
- Muestra todas las prendas del usuario en grid responsivo
- Carga datos desde `GET /garments`

#### Filtrado por Tipo de Prenda

- Dropdown "Prendas" funcional permite filtrar por tipo
- Filtros de "Marca" y "Colores" están disponibles en UI pero deshabilitados (solo lógica de "Prendas")
- Botón "Aplicar" ejecuta el filtrado

#### Ver Detalle de Prenda

- Ruta dinámica: `src/app/(dashboard)/feed/[id]/`
- Navegación por click en card de prenda
- Muestra:
    - Imagen de la prenda
    - Tipo/nombre
    - Descripción
    - Estado (Disponible)
    - Botón para marcar como favorita
    - Botón para volver al feed

#### Marcar Favoritos

- Componente `FavoriteButton` en cada card y página de detalle
- Indica si una prenda es favorita
- Estado local en el componente

### 3. **Navegación Condicional**

#### NavBar Condicional

- El NavBar se oculta en rutas públicas (`/login`, `/register`)
- Se muestra en dashboard y rutas protegidas
- Componente: `ConditionalNavBar.tsx`

#### Logout

- Botón en NavBar para cerrar sesión
- Limpia token de sesión
- Redirige a login

### 4. **UI/UX**

#### Componentes Visuales

- **FilterPanel**: Panel de filtrado con bordes grises, layout horizontal
- **FilterBox**: Dropdowns para filtros con estilos personalizados
- **GarmentCard**: Cards con gradiente azul, efecto hover, botón favorito
- **Banner**: Sección superior con información
- **Footer**: Imagen SVG que abarca todo el ancho
- **PrimaryButton**: Botón azul principal

#### Responsive Design

- Grid dinámico que se adapta (1 col mobile, 4 cols desktop)
- Elementos flexibles con Tailwind CSS
- Soporte para tablets y dispositivos móviles

---

## Autenticación, Autorización y Gestión del Estado

### Autenticación

#### Sistema de Tokens JWT

1. **Almacenamiento Seguro**: Los tokens se guardan en cookies **httpOnly**, lo que previene acceso desde JavaScript (protección contra XSS)
2. **Ciclo de Vida**: Token válido por 7 días (configurado en `loginAction`)
3. **Envío Automático**: Axios está configurado para incluir automáticamente la cookie en cada request

**Archivos clave:**

- `src/app/(public)/login/login.action.ts`: Server action que autentica y establece cookie
- `src/app/(public)/register/register.action.ts`: Server action para registro de nuevos usuarios
- `src/lib/axios/client.ts`: Cliente HTTP configurado para incluir credenciales

#### Validación de Autenticación

```typescript
// En useGarments.ts
if (err.response?.status === 401) {
    setIsAuthenticated(false); // Usuario no autenticado
}
```

### Autorización

#### Protección de Rutas

1. **Rutas Públicas**: `/login`, `/register` - Accesibles sin autenticación
2. **Rutas Protegidas**: `/feed`, `/register-garment`, `/my-garments`, `/profile` - Requieren token válido
3. **Validación en Componentes**: Si la autenticación falla (401), se muestra mensaje "Authentication Required"

#### Estructura de Carpetas:

```
src/app/
├── (public)/              # Rutas sin protección
│   ├── login/
│   └── register/
├── (dashboard)/           # Rutas protegidas (convención de Next.js)
│   ├── feed/
│   ├── register-garment/
│   └── my-garments/
└── common/                # Componentes compartidos
```

### Gestión del Estado

#### Hooks Personalizados

**useGarments.ts** - Hook para gestionar prendas:

```typescript
const {
    garments, // Array de prendas
    loading, // Estado de carga
    error, // Mensaje de error
    isAuthenticated, // Estado de autenticación
    isUsingMockData, // Indica si usa datos de prueba
    refetch, // Función para recargar datos
} = useGarments();
```

**Características:**

- **Fetch en Montaje**: Los datos se cargan al montar el componente
- **Fallback a Mock Data**: Si el servidor no está disponible (error de red), usa datos de prueba (`getMockGarments()`)
- **Detección de No Autenticado**: Si recibe 401, establece `isAuthenticated = false`
- **Estado Local**: `favorites` se mantiene en estado local del componente con `useState`

#### Gestión de Favoritos

```typescript
const [favorites, setFavorites] = useState<Set<string>>(new Set());

const handleFavorite = (id: string, isFavorited: boolean) => {
    setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (isFavorited) newFavorites.add(id);
        else newFavorites.delete(id);
        return newFavorites;
    });
};
```

#### Gestión de Filtros

En `feed/page.tsx`:

```typescript
const [pendingType, setPendingType] = useState<string | null>(null); // Filtro en proceso
const [activeType, setActiveType] = useState<string | null>(null); // Filtro aplicado

// Al hacer clic en "Aplicar"
setActiveType(pendingType === 'All types' ? null : pendingType);
```

#### Persistencia de Datos

- **Backend**: Los datos se persisten en servidor
- **Cliente**: Estado temporal en componentes
- **Cookies**: Token persistente en navegador

#### Datos Mock (Fallback)

Si el servidor no está disponible:

```typescript
// src/util/garments.util.ts
export const getMockGarments = (): Garment[] => [
    { id: 'Jacket', type: 'Jacket', ... },
    { id: 'Shirt', type: 'Shirt', ... },
    // ...
]
```

---

## Validación de Funcionalidades

### Checklist de Prueba

#### 1. Autenticación

- [ ] **Login exitoso**
    - Pasos: Ir a `/login` → Ingresar credenciales válidas → Verificar redirección a `/feed`
    - Validación: Aparece navbar, token en cookies

- [ ] **Login fallido**
    - Pasos: Ingresar credenciales incorrectas
    - Validación: Mensaje de error "Usuario o contraseña incorrectos"

- [ ] **Registro exitoso**
    - Pasos: Ir a `/register` → Completar formulario → Clic en registrarse
    - Validación: Usuario creado, sesión iniciada automáticamente

- [ ] **Logout**
    - Pasos: En dashboard, clic en botón logout (NavBar)
    - Validación: Redirección a login, cookie eliminada

#### 2. Gestión del Armario

- [ ] **Ver listado de prendas**
    - Pasos: Login → `/feed`
    - Validación: Grid de cards con prendas cargadas

- [ ] **Agregar prenda**
    - Pasos: `/register-garment` → Completar formulario → Enviar
    - Validación: Prenda aparece en feed

- [ ] **Detalle de prenda**
    - Pasos: Hacer clic en una card
    - Validación: Navegación a `/feed/[tipo]`, muestra detalles y opciones

#### 3. Filtrado

- [ ] **Filtro por tipo de prenda funcional**
    - Pasos: En `/feed` → Seleccionar tipo en dropdown "Prendas" → Clic "Aplicar"
    - Validación: Grid muestra solo prendas del tipo seleccionado

- [ ] **Filtros deshabilitados**
    - Pasos: Intentar clickear "Marca" o "Colores"
    - Validación: No abre dropdown, aparece deshabilitado

- [ ] **Limpiar filtros**
    - Pasos: Aplicar filtro → Botón "Limpiar" (si existe)
    - Validación: Vuelve a mostrar todas las prendas

#### 4. Favoritos

- [ ] **Marcar como favorita**
    - Pasos: En card o detalle, clic en corazón
    - Validación: Corazón se rellena, cambia color

- [ ] **Desmarcar favorita**
    - Pasos: Clic en corazón nuevamente
    - Validación: Corazón se vacía

#### 5. UI/UX

- [ ] **NavBar visible en dashboard**
    - Pasos: Login → Ver `/feed`
    - Validación: NavBar aparece en top

- [ ] **NavBar oculto en login/register**
    - Pasos: Ir a `/login` o `/register`
    - Validación: NavBar no aparece

- [ ] **Footer visible en todas las páginas**
    - Pasos: Hacer scroll en cualquier página
    - Validación: Footer SVG abarca todo el ancho

- [ ] **Responsive en móvil**
    - Pasos: Abrir en dispositivo móvil o DevTools
    - Validación: Layout se adapta, cards apiladas en 1 columna

#### 6. Fallback de Datos Mock

- [ ] **Mock data si servidor no disponible**
    - Pasos: Apagar servidor backend → Refrescar `/feed`
    - Validación: Se muestra alerta amarilla, datos de prueba aparecen

#### 7. Validaciones de Formularios

- [ ] **Email válido en login**
    - Pasos: Ingresar email inválido
    - Validación: Mensaje de validación

- [ ] **Contraseñas coinciden en registro**
    - Pasos: Ingresar contraseñas diferentes
    - Validación: Error antes de enviar

---

## Estructura del Proyecto

```
ward/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── login/
│   │   │   │   ├── page.tsx              # UI de login
│   │   │   │   ├── login.action.ts       # Server action de autenticación
│   │   │   │   └── services/
│   │   │   │       └── login.service.ts  # Llamadas a API
│   │   │   └── register/
│   │   │       ├── page.tsx
│   │   │       ├── register.action.ts
│   │   │       └── services/
│   │   │           └── register.service.ts
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── feed/
│   │   │   │   ├── page.tsx              # Listado de prendas
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Detalle de prenda
│   │   │   ├── register-garment/
│   │   │   │   └── page.tsx              # Agregar prenda
│   │   │   ├── my-garments/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── components/
│   │   │   │   ├── FilterPanel.tsx       # Panel de filtros
│   │   │   │   ├── FilterBox.tsx         # Dropdown de filtro
│   │   │   │   ├── GarmentCard.tsx       # Card de prenda
│   │   │   │   ├── Banner.tsx
│   │   │   │   ├── NavBar.tsx            # Navegación principal
│   │   │   │   ├── Footer.tsx            # Footer con SVG
│   │   │   │   ├── FavoriteButton.tsx    # Botón favorito
│   │   │   │   ├── PrimaryButton.tsx
│   │   │   │   └── ... (otros componentes)
│   │   │   ├── hooks/
│   │   │   │   └── useGarments.ts        # Hook para gestionar prendas
│   │   │   └── services/
│   │   │       └── garment.service.ts    # Servicio API de prendas
│   │   │
│   │   ├── ConditionalNavBar.tsx         # NavBar condicional
│   │   ├── layout.tsx                    # Layout raíz
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── logout.action.ts              # Server action de logout
│   │
│   ├── lib/
│   │   └── axios/
│   │       └── client.ts                 # Cliente Axios configurado
│   │
│   └── util/
│       └── garments.util.ts              # Utilidades y mock data
│
├── public/
│   └── assets/
│       ├── Footer.svg
│       ├── Jacket.svg
│       ├── Shirt.svg
│       └── ... (otros iconos de prendas)
│
├── .env.local                            # Variables de entorno
├── next.config.ts                        # Configuración Next.js
├── tailwind.config.ts                    # Configuración Tailwind
├── tsconfig.json
├── package.json
└── README.md                             # Este archivo
```

---

## Endpoints de API Esperados

La aplicación espera los siguientes endpoints en el servidor backend:

| Método | Endpoint         | Autenticación     | Descripción                 |
| ------ | ---------------- | ----------------- | --------------------------- |
| POST   | `/auth/login`    | No                | Login de usuario            |
| POST   | `/auth/register` | No                | Registro de usuario         |
| GET    | `/garments`      | Sí (Bearer token) | Obtener prendas del usuario |
| POST   | `/garments`      | Sí                | Crear nueva prenda          |
| GET    | `/garments/:id`  | Sí                | Obtener detalle de prenda   |
| PUT    | `/garments/:id`  | Sí                | Actualizar prenda           |
| DELETE | `/garments/:id`  | Sí                | Eliminar prenda             |

**Nota**: El token se envía automáticamente en header `Authorization: Bearer <token>`

---

## Troubleshooting

### Error: "NEXT_PUBLIC_API is not defined"

- **Solución**: Crear archivo `.env.local` con variable `NEXT_PUBLIC_API`

### Error: "Authentication required" en todas las páginas

- **Solución**: Verificar que el servidor backend está corriendo en la URL configurada

### Las prendas no cargan

- **Verificar**:
    1. Backend está disponible en `NEXT_PUBLIC_API`
    2. Usuario está autenticado (token en cookies)
    3. Endpoint `/garments` retorna datos válidos

### Mock data se muestra en lugar de datos reales

- **Motivo**: Servidor backend no disponible o error de red
- **Solución**: Iniciar servidor backend, la app mostrará alerta amarilla

---

## Desarrollo Futuro

Funcionalidades planeadas para versiones futuras:

- [ ] Filtro de "Marca" funcional
- [ ] Filtro de "Colores" funcional
- [ ] Búsqueda de prendas por nombre
- [ ] Página de "Crear Outfits"
- [ ] Compartir outfits con otros usuarios
- [ ] Historial de prendas usadas

---

## Licencia

Este proyecto es parte del taller de Next.js. Todos los derechos reservados.

---

## Contacto y Soporte

Para preguntas o reportes de bugs, contacta al equipo de desarrollo.

**Última actualización**: Mayo 2026
