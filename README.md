# Finanzas Personales

Aplicación desktop multiplataforma para gestionar finanzas personales.

## Stack tecnológico

* Electron
* React + Vite
* NestJS
* TypeScript
* TailwindCSS
* Prisma
* SQLite
* Node.js

## Arquitectura
El proyecto está organizado como un monorepo utilizando npm workspaces.

```text
finanzas-personales/
├── apps/
│   ├── backend/      # API local con NestJS
│   ├── desktop/      # Aplicación desktop con Electron
│   └── frontend/     # Interfaz con React + Vite
│
├── packages/         # Paquetes compartidos
│
├── package.json
└── package-lock.json
```

### Desktop

Electron funciona como contenedor de la aplicación.

Durante el desarrollo:

```text
Electron
   ↓
BrowserWindow
   ↓
React + Vite
   ↓
http://localhost:5173
```

El proceso principal de Electron se encuentra en:

```text
apps/desktop/src/main.ts
```

y se compila hacia:

```text
apps/desktop/dist/main.js
```

### Backend

El backend está desarrollado con NestJS y está pensado para ejecutarse localmente junto con la aplicación desktop.

```text
apps/backend/
```
### Frontend

La interfaz está desarrollada con React + Vite:

```text
apps/frontend/
```

## Desarrollo

El proyecto utiliza npm workspaces para administrar las distintas aplicaciones desde un único repositorio.

El objetivo es poder levantar toda la aplicación con un único comando:

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

## Requisitos
* Node.js >= 22.12.0
* npm >= 11