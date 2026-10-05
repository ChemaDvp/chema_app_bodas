# Ritmo · Gestión de bodas y eventos

Aplicación React mobile-first para organizar eventos como DJ: próximas bodas, peticiones musicales, cronograma, presupuesto y perfil.

## Desarrollo local

Requisitos: Node.js 20 o posterior.

```bash
npm install
npm run dev
```

Para generar y previsualizar el sitio estático:

```bash
npm run build
npm run preview
```

## Despliegue en GitHub Pages

El workflow `.github/workflows/deploy.yml` construye y publica la aplicación al hacer push a `main` o al ejecutarlo manualmente. En el repositorio, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Estructura

- `src/components/`: acceso/registro, layout con navegación inferior y componentes compartidos.
- `src/pages/`: Inicio, Peticiones, Mi boda, Presupuesto y Cuenta.
- `src/data/demoData.js`: datos iniciales de muestra.
- `src/index.css`: estilos base y directivas Tailwind CSS.

El acceso y los datos son una demostración local del frontend; no hay autenticación ni persistencia en servidor. Conecta un proveedor de autenticación y una API/base de datos antes de usar información real de clientes.