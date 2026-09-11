## Desarrollo

El proyecto utiliza npm workspaces para administrar las distintas aplicaciones desde un único repositorio.

Para iniciar todo el entorno de desarrollo:

```bash
npm run dev
```

Este comando inicia:

* Frontend React + Vite
* Backend NestJS
* Aplicación desktop Electron

La arquitectura durante el desarrollo es:

```text
                    npm run dev
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       Vite :5173      NestJS       Electron
          │              │              │
          │              │              ↓
          └──────────────┴────────── React
```

Electron carga el frontend de Vite mediante:

```text
http://localhost:5173
```

El proceso principal de Electron se compila desde:

```text
apps/desktop/src/main.ts
```

hacia:

```text
apps/desktop/dist/main.js
```

### Scripts principales

Desde la raíz del proyecto:

```bash
npm run dev
```

Inicia todo el entorno de desarrollo.

Los scripts específicos de cada aplicación pueden ejecutarse mediante npm workspaces cuando sea necesario.