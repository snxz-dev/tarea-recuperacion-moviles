# Tarea de Recuperación: Dispositivos Móviles, APIs REST con Axios y Generación de APK

**Asignatura:** Desarrollo de Aplicaciones Móviles  
**Docente / Tutor:** Ing. Luis Calo  
**Calificación:** 10 / 10 Puntos  

---

## 📦 Estructura de Entregables

```
tarea-recuperacion-moviles/
├── informe/
│   ├── Informe_Tecnico_Investigacion_Moviles.pdf   # <<< ENTREGABLE 1: Archivo PDF final con carátula y normas APA 7
│   ├── informe_investigacion.html                  # Versión web del informe
│   └── generar_pdf_pdfkit.js                       # Script de compilación del PDF
│
├── app-movil-ejemplo/                              # <<< ENTREGABLE 2: Código fuente del proyecto práctico
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiClient.js                        # Cliente Axios singleton con Interceptores
│   │   │   └── productService.js                   # Servicios CRUD (GET, POST, PUT, DELETE)
│   │   ├── styles/
│   │   │   └── app.css                             # Estilos móviles responsivos
│   │   ├── index.html                              # Interfaz interactiva de smartphone
│   │   └── app.js                                  # Lógica UI y consola de telemetría Axios
│   ├── test/
│   │   └── test-axios-services.js                  # Pruebas automatizadas de consumo REST
│   ├── build-tools/
│   │   ├── generate-keystore.sh                    # Generación de certificado RSA 2048 bits
│   │   ├── build-apk-workflow.sh                   # Empaquetado APK, zipalign y apksigner
│   │   └── adb-device-manager.sh                   # Comandos ADB para dispositivo real vs AVD
│   └── README.md                                   # Documentación técnica del proyecto móvil
│
└── package.json                                    # Dependencias del proyecto
```

---

## 🚀 Comandos Rápidos de Demostración

### 1. Ejecutar las pruebas de consumo REST con Axios:
```bash
node app-movil-ejemplo/test/test-axios-services.js
```

### 2. Regenerar el PDF en cualquier momento:
```bash
node informe/generar_pdf_pdfkit.js
```

### 3. Ejecutar los scripts de firmado y generación de APK:
```bash
chmod +x app-movil-ejemplo/build-tools/*.sh
bash app-movil-ejemplo/build-tools/build-apk-workflow.sh
bash app-movil-ejemplo/build-tools/adb-device-manager.sh
```

---

## 📋 Resumen del Contenido del Informe

1. **Carátula Institucional:** Portada formal con datos de la asignatura, tutor Ing. Luis Calo, estudiante y período 2026.
2. **Objetivos:** 1 Objetivo General y 4 Objetivos Específicos medibles.
3. **Marco Teórico Exhaustivo:**
   - *Módulo 1:* Dispositivos Reales vs. Dispositivos Virtuales (Emuladores, Simuladores y AVD). Qué es, cómo funciona, arquitectura, matriz comparativa técnica, ventajas y desventajas.
   - *Módulo 2:* APIs y Servicios Web en Móviles (Protocolo HTTP/HTTPS, Métodos, RESTful, Cliente Axios, Interceptores, Comparativa Axios vs Fetch, ventajas y desventajas).
   - *Módulo 3:* Generación y Compilación de APK (Anatomía interna de un APK, Pipeline D8/R8/AAPT2/Gradle, Debug vs Release, proceso Keystore, Zipalign a 4 bytes, Apksigner y AAB).
4. **Desarrollo del Ejemplo Práctico:** Documentación paso a paso de la arquitectura, fragmentos de código, capturas de pruebas y flujo de compilación.
5. **Conclusiones:** 5 conclusiones técnicas profundas y fundamentadas.
6. **Bibliografía:** 10 referencias bibliográficas estandarizadas en **Normas APA 7ma edición**.
