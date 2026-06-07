# Página de Crear Outfit - Documentación Completa

## 📋 Descripción General

La página de crear outfit permite a los usuarios:
1. Nombrar su outfit
2. Seleccionar una ocasión
3. Buscar y seleccionar prendas de su armario
4. Guardar el outfit para uso futuro

## 🏗️ Estructura del Proyecto

```
src/app/(dashboard)/create-outfit/
├── page.tsx                           # Página principal
├── store/
│   └── useOutfitStore.ts             # Hook de estado (preparado para Zustand)
├── services/
│   └── outfit.service.ts             # Servicio de API para outfits
└── components/
    ├── OutfitNameInput.tsx           # Input para nombre
    ├── OccasionSelector.tsx          # Dropdown de ocasiones
    ├── SelectedGarmentsSection.tsx    # Visualización de prendas seleccionadas
    └── AddGarmentsSection.tsx        # Sección para agregar prendas
```

## 🎨 Características Principales

### 1. **OutfitNameInput**
- Input de texto para el nombre del outfit
- Validación integrada en la página
- Placeholder: "Escribe aquí"

### 2. **OccasionSelector**
- Dropdown con 10 ocasiones predefinidas
- Ocasiones: Casual, Deportivo, Formal, Fiesta, Trabajo, Playa, Viaje, Cita, Noche, Reunión Familiar
- Click fuera cierra el dropdown automáticamente

### 3. **SelectedGarmentsSection**
- Muestra las prendas ya seleccionadas en grid
- Botón para remover prendas (hover)
- Mensaje si no hay prendas seleccionadas

### 4. **AddGarmentsSection**
- Búsqueda en tiempo real de prendas
- Categorías: Sweater, Jacket, Pants, Shoes, Accessorie, Shirt, T-Shirt, Dress, Skirt, Hoodie, Polo, Blazer, Shorts
- Tabs para cambiar categoría
- Visual indica si una prenda ya está seleccionada
- Grid responsive

### 5. **useOutfitStore Hook**
Hook de estado personalizado que maneja:
- Nombre del outfit
- Ocasión seleccionada
- Prendas seleccionadas
- Métodos para agregar/remover prendas
- Método para resetear el formulario

**Funciones:**
- `setOutfitName(name)` - Actualiza nombre
- `setOccasion(occasion)` - Actualiza ocasión
- `addGarment(garment)` - Agrega prenda (sin duplicados)
- `removeGarment(garmentId)` - Remueve prenda
- `reset()` - Limpia el formulario
- `getGarmentsByType(type)` - Obtiene prendas por tipo
- `isGarmentSelected(garmentId)` - Verifica si está seleccionada

### 6. **outfitService**
Servicio que comunica con la API:
- `createOutfit(outfitData)` - Crea un nuevo outfit
- `updateOutfit(outfitId, outfitData)` - Actualiza un outfit

## 🔄 Flujo de Datos

```
page.tsx
  ↓
  ├─→ useOutfitStore (estado local)
  │   └─→ AddGarmentsSection
  │       └─→ GarmentCard
  │
  ├─→ OutfitNameInput
  ├─→ OccasionSelector
  ├─→ SelectedGarmentsSection
  │   └─→ GarmentCard
  │
  └─→ outfitService (API call)
```

## ✅ Validaciones

En `page.tsx`:
1. ✓ Nombre del outfit no está vacío
2. ✓ Ocasión está seleccionada
3. ✓ Al menos una prenda está seleccionada
4. ✓ No permite guardar si hay errores

## 🎨 Estilos

- Gradientes lineales: `bg-linear-to-b`, `bg-linear-to-r` (Tailwind v4)
- Colores: Slate, Blue, White
- Responsive: sm, md, lg breakpoints
- Transiciones suaves con `duration-200`

## 🔮 Preparación para Zustand

El hook `useOutfitStore` está diseñado para ser fácilmente convertible a Zustand:

### Cambios necesarios:
1. Instalar: `npm install zustand`
2. Reemplazar implementación en `useOutfitStore.ts`
3. Actualizar forma de consumir el store en `page.tsx`

Ver archivo `/memories/repo/create-outfit-zustand-migration.md` para detalles completos.

## 📱 Responsive Design

- **Mobile**: Columna simple, padding 6
- **Tablet**: Gradual shift a 2 columnas
- **Desktop**: Layout completo con sidebar

## 🚀 Uso Futuro

El código es modular y preparado para:
- ✓ Fácil integración con Zustand
- ✓ Posible agregar persistencia local
- ✓ Integración con API real
- ✓ Agregar más ocasiones dinámicamente
- ✓ Soporte para categorías personalizadas
