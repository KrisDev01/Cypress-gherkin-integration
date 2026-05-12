# Integración de Cypress con Gherkin (Cucumber) y TypeScript

---
##  Requisitos previos

- **Node.js** (versión 18 o superior)
---
##  Estructura del proyecto
Una vez configurado, tu proyecto debería tener esta estructura:

cypress-gherkin/ # Raíz del proyecto  
├── .vscode/ # Configuración de VS Code  
│ └── settings.json # Configuración para Gherkin  
├── cypress/  
│ ├── e2e/ # Pruebas end-to-end  
│ │ └── carpeta-tests/ # Suite de pruebas  
│ │ ├── gherkin.feature # Escenarios en Gherkin  
│ │ └── steps-test.ts # Implementación de pasos (TypeScript)  
│ ├── fixtures/ # Datos de prueba (JSON)  
│ ├── support/ # Comandos personalizados  
│ │ ├── commands.ts # Comandos personalizados  
│ │ └── e2e.ts # Configuración global  
│ └── tsconfig.json # Configuración de TypeScript para Cypress  
├── cypress.config.ts # Configuración principal (TypeScript)  
├── tsconfig.json # Configuración base de TypeScript  
├── package.json # Dependencias y scripts  
└── package-lock.json # Bloqueo de versiones

text

---
##  Instalación paso a paso
### 1. Crear el proyecto
```bash
npm init -y

### 2. Instalar dependencias

Dependencias principales:

bash

npm install cypress @badeball/cypress-cucumber-preprocessor @bahmutov/cypress-esbuild-preprocessor --save-dev

Dependencias de TypeScript:

bash

npm install typescript ts-loader @types/node @types/cypress --save-dev

### 3. Verificar las versiones instaladas

json

{
  "cypress": "^15.14.2",
  "@badeball/cypress-cucumber-preprocessor": "^24.0.1",
  "@bahmutov/cypress-esbuild-preprocessor": "^2.2.3",
  "typescript": "^6.0.3",
  "@types/node": "^20.0.0",
  "@types/cypress": "^1.1.3"
}

---

## Configuración de archivos

### `package.json`

Agrega la configuración del preprocessor dentro de tu `package.json`:

json

{
## posibles scripts por tags 
  "scripts": {
    "test": "cypress run",
    "test:open": "cypress open",
    "test:smoke": "cypress run --env tags='@smoke'",
    "test:regression": "cypress run --env tags='@regression'",
    "test:headed": "cypress run --headed",
    "test:chrome": "cypress run --browser chrome"
  },
 ## agregar esto en tu package.json 
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": "cypress/e2e/**/*.{js,ts}",
    "filterSpecs": true,
    "omitFiltered": true
  }
}

Explicación de las opciones:

- `stepDefinitions`: Ruta donde buscar archivos de pasos (incluye `.ts`)
- `filterSpecs`: Filtra automáticamente por tags
- `omitFiltered`: Omite specs sin tags coincidentes

### `tsconfig.json` (Configuración base de TypeScript)

Crea este archivo en la raíz del proyecto:

json

{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020", "dom"],
    "types": ["cypress", "node"],
    "module": "commonjs",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@cypress/*": ["cypress/*"]
    }
  },
  "include": [
    "cypress/**/*.ts",
    "cypress/**/*.js",
    "cypress.config.ts"
  ],
  "exclude": ["node_modules"]
}

Explicación de opciones clave:

- `target: "es2020"`: Versión moderna de JavaScript
- `lib`: Librerías disponibles (para navegador y Node.js)
- `types`: Tipos globales disponibles
- `strict`: Modo estricto de TypeScript
- `paths`: Atajos de importación

### `cypress/tsconfig.json` (TypeScript para pruebas)

Crea este archivo dentro de la carpeta `cypress/`:

json

{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["cypress", "node"],
    "isolatedModules": false
  },
  "include": [
    "**/*.ts",
    "**/*.js"
  ],
  "exclude": ["node_modules"]
}

### `cypress.config.ts` (Configuración principal con TypeScript)

Crea este archivo en la raíz del proyecto:

typescript

import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
export default defineConfig({
  e2e: {
    specPattern: "**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents: async (on, config) => {
      await addCucumberPreprocessorPlugin(on, config);
      
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      
      return config;
    },
  },
});

### `cypress/support/e2e.ts` (Archivo de soporte)

### Archivo `.feature` (Gherkin)

Ruta:`cypress/e2e/carpeta/tu-gherkin.feature`

gherkin

### Archivo de steps (TypeScript)

Ruta: `cypress/e2e/carpeta/steps.ts`

typescript

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
// Tipado de parámetros (opcional pero recomendado)

## Configuración de VS Code (opcional pero recomendada)

Esta configuración elimina los warnings amarillos en archivos `.feature` y habilita autocompletado para TypeScript.

### Crear `.vscode/settings.json`

json

{
    "cucumberautocomplete.steps": [
        "cypress/e2e/**/*.ts"
    ],
    "cucumberautocomplete.syncfeatures": "cypress/e2e/**/*.feature",
    "cucumberautocomplete.strictGherkinCompletion": true,
    "cucumber.features": [
        "cypress/e2e/**/*.feature"
    ],
    "cucumber.glue": [
        "cypress/e2e/**/*.ts"
    ]
}

### Extensiones recomendadas para VS Code

Instala estas extensiones:

Cucumber (Gherkin) Full Support de Alexander Krechik

Después de instalar y configurar, recarga VS Code** (`Ctrl+Shift+P` → "Reload Window").

## Ejecutar las pruebas

### Comandos básicos

|Comando|Descripción|
|---|---|
|`npx cypress run`|Ejecuta todas las pruebas en modo headless|
|`npx cypress open`|Abre el Test Runner interactivo|
|`npx cypress run --browser chrome`|Ejecuta en Chrome|
|`npx cypress run --headed`|Ejecuta con interfaz visible|
|`npm run test`|Usando el script de package.json|

### Filtrar por tags

bash

# Ejecutar escenarios con @smoke
npx cypress run --env tags="@smoke"
# Ejecutar con múltiples tags (OR)
npx cypress run --env tags="@smoke or @regression"
# Ejecutar con múltiples tags (AND)
npx cypress run --env tags="@smoke and @regression"
# Excluir un tag
npx cypress run --env tags="not @slow"

### Usando scripts de npm (recomendado)

bash

# Ejecutar todos los tests
npm run test
# Abrir interfaz interactiva
npm run test:open
# Ejecutar solo smoke tests
npm run test:smoke
# Ejecutar regression tests
npm run test:regression
# Ejecutar con interfaz visible
npm run test:headed
# Ejecutar en Chrome
npm run test:chrome