# Tarea de Recuperación: Dispositivos Móviles, Consumo de APIs REST con Axios y Generación de APK

**Asignatura:** Desarrollo de Aplicaciones Móviles  
**Docente / Tutor:** Ing. Luis Calo  
**Calificación Objetivo:** 10.0 / 10.0 Puntos  
**Entorno de Ejecución:** Node.js, JavaScript Moderno (ES6+), Axios HTTP Client, Android SDK Build Tools  

---

## 📑 Tabla de Contenidos
1. [Descripción General](#-descripción-general)
2. [Estructura del Repositorio y Entregables](#-estructura-del-repositorio-y-entregables)
3. [¿Cómo se Construyó la Solución? (Arquitectura por Capas)](#-cómo-se-construyó-la-solución-arquitectura-por-capas)
4. [Implementación a Fondo de Axios](#-implementación-a-fondo-de-axios)
   - [¿Por qué Axios y cómo funciona?](#por-qué-axios-y-cómo-funciona)
   - [Interceptores de Petición (Request Interceptors)](#1-interceptores-de-petición-request-interceptors)
   - [Interceptores de Respuesta (Response Interceptors)](#2-interceptores-de-respuesta-response-interceptors)
   - [Comparativa Técnica: Axios vs Fetch](#3-comparativa-técnica-axios-vs-fetch-nativo)
5. [Dispositivos Reales vs Emuladores (AVD) vs Simuladores Web](#-dispositivos-reales-vs-emuladores-avd-vs-simuladores-web)
6. [Flujo de Generación y Firmado de APK](#-flujo-de-generación-y-firmado-de-apk)
7. [Guía de Instalación y Ejecución Rápida](#-guía-de-instalación-y-ejecución-rápida)
8. [Comandos para Subir este Repositorio a GitHub](#-comandos-para-subir-este-repositorio-a-github)

---

## 📱 Descripción General

Este proyecto contiene la resolución integral de la **Tarea de Recuperación** solicitada por el **Ing. Luis Calo**, cubriendo tanto la investigación teórica formal en formato **PDF** con normas APA 7ma edición, como el desarrollo de una **aplicación móvil visual interactiva** ("*MobileStore & API Hub*") que implementa buenas prácticas de consumo de servicios web mediante **Axios**, interceptores de seguridad, medición de latencia y herramientas de construcción de paquetes **Android APK**.

---

## 📦 Estructura del Repositorio y Entregables

```
tarea-recuperacion-moviles/
├── informe/
│   ├── Informe_Tecnico_Investigacion_Moviles.pdf   # <<< ENTREGABLE 1: Documento PDF formal con carátula y APA 7
│   ├── informe_investigacion.html                  # Versión HTML académica
│   └── generar_pdf_pdfkit.js                       # Script de compilación a PDF
│
├── app-movil-ejemplo/                              # <<< ENTREGABLE 2: Código fuente de la aplicación práctica
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiClient.js                        # Cliente Axios singleton con Interceptores
│   │   │   └── productService.js                   # Servicios CRUD (GET, POST, PUT, DELETE)
│   │   ├── styles/
│   │   │   └── app.css                             # Estilos móviles (Frame de smartphone, notch, animaciones)
│   │   ├── index.html                              # Interfaz visual de smartphone
│   │   └── app.js                                  # Lógica UI y consola de telemetría Axios
│   ├── test/
│   │   └── test-axios-services.js                  # Pruebas automatizadas de consumo REST
│   ├── build-tools/
│   │   ├── generate-keystore.sh                    # Generación de certificado RSA 2048 bits con keytool
│   │   ├── build-apk-workflow.sh                   # Pipeline de empaquetado APK, zipalign y apksigner
│   │   └── adb-device-manager.sh                   # Comandos ADB para dispositivo físico vs emulador AVD
│   └── README.md                                   # Documentación técnica específica del código
│
├── package.json                                    # Scripts y dependencias
├── .gitignore                                      # Exclusión de node_modules y temporales
└── README.md                                       # Guía general del proyecto
```

---

## 🏛️ ¿Cómo se Construyó la Solución? (Arquitectura por Capas)

La aplicación sigue el principio de **Separación de Responsabilidades (*Clean Architecture*)**:

```
+-------------------------------------------------------------------------+
| [1. UI Layer (Vistas)]      -> src/index.html & app.css (Frame Móvil)  |
|          │                                                              |
|          ▼                                                              |
| [2. Controller/View Logic]  -> src/app.js (Eventos, Filtros, Modal)    |
|          │                                                              |
|          ▼                                                              |
| [3. Service Layer]          -> src/api/productService.js (CRUD REST)    |
|          │                                                              |
|          ▼                                                              |
| [4. HTTP Client (Axios)]    -> src/api/apiClient.js (Interceptores)     |
|          │                                                              |
|          ▼ (Peticiones HTTPS con JSON Payload)                          |
| [5. Backend Remoto]         -> Cloud REST API (FakeStore / DummyJSON)   |
+-------------------------------------------------------------------------+
```

---

## ⚡ Implementación a Fondo de Axios

### ¿Por qué Axios y cómo funciona?
**Axios** es una biblioteca cliente HTTP basada en **Promesas ECMAScript** (`async/await`) que funciona de forma isomórfica (tanto en navegadores como en Node.js y entornos móviles como React Native o Capacitor). Se seleccionó frente a la función nativa `fetch` por su capacidad de **transformación automática de JSON**, **control nativo de timeouts** y su arquitectura de **Interceptores**.

### 1. Interceptores de Petición (*Request Interceptors*)
Se ejecutan **antes** de que la petición HTTP salga del dispositivo móvil. En `apiClient.js` se implementó para:
- **Inyección automática de Tokens de Seguridad:** Adjunta el encabezado `Authorization: Bearer <token_jwt>` en todas las solicitudes salientes sin tener que escribirlo manualmente en cada función.
- **Registro de Marca de Tiempo (*Timestamp*):** Guarda la hora exacta de salida para calcular la latencia de la red móvil en milisegundos.

```javascript
// src/api/apiClient.js
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date() };
  config.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  console.log(`[HTTP OUT] [${config.method.toUpperCase()}] -> ${config.url}`);
  return config;
});
```

### 2. Interceptores de Respuesta (*Response Interceptors*)
Se ejecutan **inmediatamente al recibir la respuesta del servidor** o al detectarse un error de red:
- **Cálculo de Latencia en Tiempo Real:** Resta el tiempo actual del tiempo guardado en la petición para reportar la velocidad de la red (`Duration: XX ms`).
- **Normalización Unificada de Errores:** Intercepta códigos de estado `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error` o fallos por desconexión de red (`ERR_NETWORK`), emitiendo mensajes claros a la interfaz sin romper la aplicación.

```javascript
apiClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    return { success: true, status: response.status, data: response.data, durationMs: duration };
  },
  (error) => {
    // Control semántico de errores
    const status = error.response ? error.response.status : 'ERR_NETWORK';
    return Promise.reject({ success: false, status, message: error.message });
  }
);
```

### 3. Comparativa Técnica: Axios vs Fetch Nativo

| Característica | Cliente Axios | Fetch API Nativa |
| :--- | :--- | :--- |
| **Transformación JSON** | **Automática** (desempaqueta `response.data`) | **Manual** (requiere `await response.json()`) |
| **Interceptores Globales** | **Soportados de fábrica** | No soportados (requiere wrappers complejos) |
| **Manejo de Errores (4xx/5xx)**| **Rechaza la promesa** automáticamente | Resuelve con éxito (obliga a chequear `res.ok`) |
| **Timeouts para Redes Móviles** | **Nativo** (`timeout: 10000`) | Requiere `AbortSignal.timeout()` manual |

---

## 📱 Dispositivos Reales vs Emuladores (AVD) vs Simuladores Web

| Tipo de Entorno | Nivel de Virtualización | Velocidad de Iteración | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Simulador Web (Este Proyecto)** | Simula Viewport y APIs de software sobre el navegador. | **Ultra rápida (milisegundos)** | Diseño visual de UI, maquetación rápida y pruebas de servicios REST con Axios. |
| **Emulador AVD (Android SDK)** | Emula hardware completo (CPU ARM/x86, RAM, Kernel Linux) con QEMU/KVM. | **Moderada** | Pruebas de integración con el sistema Android, ciclo de vida de actividades y permisos. |
| **Dispositivo Físico Real** | Ejecución nativa directa sobre el procesador y sensores del teléfono. | **Depende de conexión USB/Wi-Fi** | Prueba de oro final: consumo real de batería, rendimiento térmico, biometría y gestos multi-touch. |

---

## 🛠️ Flujo de Generación y Firmado de APK

El proceso de empaquetado de una aplicación Android consta de los siguientes pasos automatizados en la carpeta `build-tools/`:

1. **Generación de Clave Privada (Keystore):**  
   Utilizando `keytool`, se crea un certificado RSA de 2048 bits con validez de 10.000 días:
   ```bash
   keytool -genkey -v -keystore release-key.jks -alias mobileappkey -keyalg RSA -keysize 2048 -validity 10000
   ```
2. **Compilación y Ensamblado con Gradle:**  
   El compilador **D8/R8** convierte el código a bytecode **DEX (*classes.dex*)** y la herramienta **AAPT2** compila los recursos gráficos y el `AndroidManifest.xml` binario.
3. **Alineación de Memoria con Zipalign:**  
   Alinea los archivos no comprimidos en múltiplos de 4 bytes para que el kernel de Android acceda a ellos directamente mediante `mmap()` sin recargar la memoria RAM.
   ```bash
   zipalign -p -f -v 4 app-unsigned-unaligned.apk app-unaligned.apk
   ```
4. **Firmado Criptográfico con Apksigner:**  
   Aplica los esquemas de firma **v2** y **v3** para garantizar que el APK no pueda ser modificado por terceros:
   ```bash
   apksigner sign --ks release-key.jks --out MobileStore-Release-Signed.apk app-unaligned.apk
   ```

---

## 🚀 Guía de Instalación y Ejecución Rápida

### 1. Iniciar la Aplicación Móvil Visual en el Navegador
```bash
npm start
```
Abre en tu navegador favorito: **`http://localhost:3000`**

### 2. Ejecutar Pruebas Automatizadas de Consumo REST
```bash
npm test
```

### 3. Regenerar el Documento Académico PDF
```bash
npm run generate-pdf
```
El archivo se compilará en: `informe/Informe_Tecnico_Investigacion_Moviles.pdf`

### 4. Ejecutar el Pipeline de Empaquetado APK
```bash
npm run build-apk
```

---

## 📤 Comandos para Subir este Repositorio a GitHub

Para subir este proyecto a tu cuenta personal de GitHub:

1. Crea un repositorio nuevo y vacío en tu [GitHub](https://github.com/new) (por ejemplo: `tarea-recuperacion-moviles`).
2. En tu terminal ejecuta:

```bash
cd /home/snxz/Projects/tarea-recuperacion-moviles
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

*Desarrollado para la Asignatura de Desarrollo de Aplicaciones Móviles - Tutor: Ing. Luis Calo (Período 2026).*
