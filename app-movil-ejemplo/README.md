# MobileStore & API Hub - Proyecto Práctico de Desarrollo Móvil

**Asignatura:** Desarrollo de Aplicaciones Móviles  
**Docente / Tutor:** Ing. Luis Calo  
**Tema:** Dispositivos Reales y Virtuales, Consumo de APIs REST con Axios y Generación de APK  

---

## 📱 Descripción del Proyecto

Este proyecto práctico complementa la investigación técnica desarrollada para la Tarea de Recuperación. Implementa una arquitectura por capas orientada a aplicaciones móviles híbridas y nativas, integrando un cliente robusto de comunicación HTTP mediante **Axios**, interceptores de seguridad y telemetría, y el flujo completo de empaquetado y firmado de paquetes **Android APK**.

---

## 🏛️ Estructura de la Solución

```
app-movil-ejemplo/
├── src/
│   ├── api/
│   │   ├── apiClient.js         # Cliente Axios singleton con Request & Response Interceptors
│   │   ├── productService.js    # Operaciones CRUD (GET, POST, PUT, DELETE)
│   │   └── errorHandler.js      # Manejador centralizado de estados HTTP (4xx, 5xx, Network)
│   ├── components/              # Elementos modulares de interfaz de usuario
│   ├── styles/
│   │   └── app.css              # Estilos responsivos con viewport de smartphone
│   ├── index.html               # Vista principal de la aplicación móvil
│   └── app.js                   # Lógica de interacción y consola Axios en tiempo real
├── test/
│   └── test-axios-services.js   # Pruebas de integración automatizadas contra API REST real
├── build-tools/
│   ├── generate-keystore.sh     # Generación de certificado RSA 2048 bits con keytool
│   ├── build-apk-workflow.sh    # Pipeline de empaquetado, zipalign y apksigner
│   └── adb-device-manager.sh    # Comandos de despliegue en dispositivo físico vs AVD
└── README.md                    # Documentación del proyecto
```

---

## 🚀 Guía de Ejecución Rápida

### 1. Pruebas de Integración con Axios
Para ejecutar las pruebas automatizadas que consumen la API REST real y evalúan los interceptores:

```bash
# Desde la raíz de la tarea
node app-movil-ejemplo/test/test-axios-services.js
```

### 2. Ejecución de la Interfaz Móvil
Puedes abrir el archivo `src/index.html` en cualquier navegador para visualizar el frame del dispositivo móvil y probar la consola en tiempo real, latencia y creación de productos.

### 3. Pipeline de Generación de APK y Firmado
Para ejecutar los scripts de compilación y empaquetado:

```bash
chmod +x app-movil-ejemplo/build-tools/*.sh
./app-movil-ejemplo/build-tools/generate-keystore.sh
./app-movil-ejemplo/build-tools/build-apk-workflow.sh
./app-movil-ejemplo/build-tools/adb-device-manager.sh
```

---

## 🔑 Características Clave Implementadas

1. **Cliente Axios Centralizado:**
   - Inyección automática de cabeceras de autorización (`Authorization: Bearer <token>`).
   - Medición de latencia de red móvil (*Round Trip Time* en milisegundos).
   - Timeouts configurados a 10 segundos para mitigar interrupciones en conexiones móviles.
2. **Control de Errores Semántico:**
   - Identificación y mapeo de errores HTTP 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error) y caídas de conectividad (`ERR_NETWORK`).
3. **Flujo de Empaquetado APK:**
   - Documentación técnica del paso de Bytecode DEX, AAPT2, optimización de 4 bytes con `zipalign` y firmado con `apksigner`.
