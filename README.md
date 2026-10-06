# Ritmo · Gestión de bodas y eventos

Aplicación web mobile-first para que un DJ gestione bodas, presupuestos, contenido multimedia y peticiones musicales. La experiencia prevista distingue entre una vista de administración para el DJ y una vista de consulta para cada pareja.

## Arquitectura

- **Frontend:** React 18, Vite y Tailwind CSS. Es una aplicación estática, sin servidor propio.
- **Hosting y despliegue:** GitHub Pages aloja el frontend. GitHub Actions instala dependencias, construye `dist/` y publica el sitio al hacer push a `main` o al ejecutar manualmente el workflow.
- **Backend y base de datos:** Supabase aloja PostgreSQL, Supabase Auth y Supabase Storage. El cliente web se conecta directamente a Supabase mediante `@supabase/supabase-js` y la API de datos.
- **Autorización:** las tablas usan Row Level Security (RLS). El cliente comprueba el rol en `user_roles` o la pertenencia a una boda en `wedding_members`; RLS debe seguir siendo la autoridad que limite cada operación.
- **Archivos:** `contenido-publico` guarda el material promocional común; `presupuestos` es un bucket privado para los PDF de cada boda.

No hay una API/servidor intermedio propio. Las credenciales de Supabase que usa el navegador son la URL del proyecto y la clave publishable; nunca debe incluirse una clave `secret` o `service_role` en el frontend.

## Estado de la integración

Ya está implementado el inicio de sesión con Supabase Auth, la consulta del rol y la comprobación de la boda vinculada. La pantalla de acceso no ofrece registro público y las cuentas sin rol ni boda asociada quedan bloqueadas. El frontend también permite solicitar el restablecimiento de contraseña y definir una nueva desde el enlace recibido por correo.

La conexión con Supabase está en su fase inicial: **las páginas principales aún usan datos locales de demostración**. Todavía no están implementados el alta/edición de bodas desde la interfaz, la carga de presupuestos y multimedia, la gestión persistente de canciones, las invitaciones QR/enlace ni la separación completa de las interfaces y acciones por rol. No usar todavía con información real de clientes.

## Modelo de datos de Supabase

El esquema inicial creado en el proyecto incluye:

| Tabla | Uso |
| --- | --- |
| `user_roles` | Rol de una cuenta, actualmente `admin` o `couple`. |
| `weddings` | Información y detalles de cada boda. |
| `wedding_members` | Cuentas vinculadas a cada boda. |
| `budgets` | Importes por boda, desplazamiento opcional y ruta del PDF. |
| `budget_notes` | Textos informativos asociados al presupuesto. |
| `songs` | Peticiones musicales, estado de revisión y usuario que las añadió. |
| `media_items` | Referencias al contenido promocional común y su orden/estado. |

El script inicial habilita RLS y configura políticas para administración y miembros. También impone en la base de datos un máximo de 30 canciones no rechazadas por boda. El flujo de invitaciones aún no existe; las parejas deben vincularse de forma controlada antes de habilitar su acceso.

## Requisitos

- Node.js 20 o posterior.
- Un proyecto de Supabase con las tablas, políticas RLS y buckets preparados.

## Desarrollo local

1. Copia `.env.example` como `.env.local`.
2. Rellena `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` con los valores de **Project URL** y la clave **publishable** de Supabase. No compartas ni publiques `.env.local`.
3. Instala dependencias e inicia Vite:

```bash
npm install
npm run dev
```

Vite sirve el sitio en `http://localhost:5173`. Para reiniciarlo, detén el proceso en la terminal con `Ctrl+C` y ejecuta de nuevo `npm run dev`. Los cambios en variables `.env` requieren reiniciar Vite.

Para generar y previsualizar el sitio estático:

```bash
npm run build
npm run preview
```

## Despliegue en GitHub Pages

El workflow está en `.github/workflows/deploy.yml`. En el repositorio de GitHub configura **Settings → Pages → Build and deployment → Source: GitHub Actions** y añade estos secretos de Actions:

- `VITE_SUPABASE_URL`: URL del proyecto Supabase.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: clave publishable de Supabase.

Al hacer push a `main`, Actions usa esos secretos durante el build de Vite y despliega `dist/`. Para autenticación, configura en Supabase **Authentication → URL Configuration** las URL de desarrollo y de producción del sitio.

## Estructura del código

```text
src/
├── App.jsx                       # Sesión, autenticación y resolución de acceso/rol
├── main.jsx                      # Punto de entrada React
├── index.css                     # Estilos globales y Tailwind
├── lib/
│   └── supabase.js               # Cliente Supabase y validación de variables
├── components/
│   ├── AuthScreen.jsx            # Inicio de sesión
│   ├── DashboardLayout.jsx       # Navegación y marco principal
│   ├── SectionHeading.jsx        # Encabezado reutilizable de sección
│   └── WeddingInspiration.jsx    # Collage y carrusel promocional de muestra
├── pages/
│   ├── DashboardPage.jsx         # Inicio
│   ├── RequestsPage.jsx          # Peticiones musicales (actualmente demo local)
│   ├── WeddingPage.jsx           # Información de boda (actualmente demo local)
│   ├── BudgetPage.jsx            # Presupuesto (actualmente demo local)
│   └── AccountPage.jsx           # Cuenta
└── data/
    └── demoData.js               # Datos de muestra del frontend
public/
└── images/                       # Imágenes locales usadas por la interfaz
```

## Notas de seguridad

- `.env.local` está excluido de Git; `.env.example` solo contiene valores de ejemplo.
- Solo se usa una clave publishable en el navegador; RLS y Storage policies controlan el acceso a los datos y archivos.
- Los buckets y las políticas deben mantenerse de acuerdo con la privacidad requerida: contenido promocional público y presupuestos privados.
- No guardar contraseñas ni claves secretas en el repositorio, el frontend o los logs.
