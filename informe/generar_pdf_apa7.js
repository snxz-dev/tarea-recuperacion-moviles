/**
 * ============================================================================
 * INFORME TÉCNICO ACADÉMICO - FORMATO APA 7ma EDICIÓN (TEXTO COMPLETO NEGRO)
 * INSTITUCIÓN: INSTITUTO SUPERIOR UNIVERSITARIO JAPÓN
 * CARRERA: DESARROLLO DE SOFTWARE
 * ASIGNATURA: DESARROLLO DE APLICACIONES MÓVILES
 * TUTOR: ING. LUIS CALO
 * ============================================================================
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'Informe_Tecnico_Investigacion_Moviles.pdf');

// Dimensiones A4: 595.28 x 841.89 pt
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_X = 54;      // ~1.9 cm margen lateral
const MARGIN_TOP = 50;
const MARGIN_BOTTOM = 50;
const USABLE_W = PAGE_W - (MARGIN_X * 2); // 487.28 pt

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_X, right: MARGIN_X },
  bufferPages: true,
  autoFirstPage: false
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colores estrictos APA 7 (Texto en negro y grises de soporte)
const C = {
  black: '#000000',
  darkGray: '#1F2937',
  gray: '#4B5563',
  lightGray: '#9CA3AF',
  bgBox: '#F9FAFB',
  lineGray: '#000000'
};

function addPage() {
  doc.addPage({
    size: 'A4',
    margins: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_X, right: MARGIN_X }
  });
}

function checkSpace(neededHeight) {
  if (doc.y + neededHeight > PAGE_H - MARGIN_BOTTOM - 20) {
    addPage();
    doc.y = MARGIN_TOP + 10;
  }
}

// Título Nivel 1 APA: Centrado, Negrita
function drawH1(title) {
  checkSpace(40);
  doc.moveDown(0.8);
  doc.fillColor(C.black)
     .font('Helvetica-Bold')
     .fontSize(12.5)
     .text(title, MARGIN_X, doc.y, { width: USABLE_W, align: 'center' });
  doc.moveDown(0.5);
}

// Título Nivel 2 APA: Alineado a la izquierda, Negrita
function drawH2(title) {
  checkSpace(30);
  doc.moveDown(0.6);
  doc.fillColor(C.black)
     .font('Helvetica-Bold')
     .fontSize(10.5)
     .text(title, MARGIN_X, doc.y, { width: USABLE_W, align: 'left' });
  doc.moveDown(0.35);
}

// Título Nivel 3 APA: Alineado a la izquierda, Negrita, Cursiva
function drawH3(title) {
  checkSpace(25);
  doc.moveDown(0.4);
  doc.fillColor(C.black)
     .font('Helvetica-BoldOblique')
     .fontSize(9.5)
     .text(title, MARGIN_X, doc.y, { width: USABLE_W, align: 'left' });
  doc.moveDown(0.25);
}

// Párrafo estándar con sangría opcional y texto justificado
function drawParagraph(text, indent = 0) {
  checkSpace(25);
  doc.fillColor(C.black)
     .font('Helvetica')
     .fontSize(9)
     .text(text, MARGIN_X + indent, doc.y, {
       width: USABLE_W - indent,
       align: 'justify',
       lineGap: 2.2
     });
  doc.moveDown(0.35);
}

// Lista con viñetas
function drawBullet(text, label = '•') {
  checkSpace(20);
  const curY = doc.y;
  doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text(label, MARGIN_X + 10, curY);
  doc.fillColor(C.black).font('Helvetica').fontSize(8.8)
     .text(text, MARGIN_X + 22, curY, { width: USABLE_W - 22, align: 'justify', lineGap: 1.8 });
  doc.moveDown(0.2);
}

// Tabla con formato APA 7ma Edición (Líneas horizontales superior, header e inferior, sin líneas verticales)
function drawTableAPA(title, headers, rows, colWidths) {
  checkSpace(rows.length * 16 + 50);
  
  // Título de la tabla en formato APA
  doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text(title, MARGIN_X, doc.y);
  doc.fillColor(C.gray).font('Helvetica-Oblique').fontSize(8).text('Nota: Tabla comparativa estructurada bajo parámetros técnicos de ingeniería.', MARGIN_X, doc.y + 2);
  doc.moveDown(0.5);

  const startX = MARGIN_X;
  let startY = doc.y;

  // Línea superior de la tabla
  doc.moveTo(startX, startY).lineTo(startX + USABLE_W, startY).lineWidth(1).stroke(C.lineGray);
  startY += 3;

  // Encabezados
  let curX = startX;
  headers.forEach((h, i) => {
    doc.fillColor(C.black)
       .font('Helvetica-Bold')
       .fontSize(7.8)
       .text(h, curX + 2, startY + 3, { width: colWidths[i] - 4, align: 'left' });
    curX += colWidths[i];
  });
  startY += 16;

  // Línea divisoria de encabezado
  doc.moveTo(startX, startY).lineTo(startX + USABLE_W, startY).lineWidth(0.5).stroke(C.lineGray);
  startY += 3;

  // Filas
  rows.forEach((row) => {
    curX = startX;
    row.forEach((cell, cIdx) => {
      doc.fillColor(C.black)
         .font(cIdx === 0 ? 'Helvetica-Bold' : 'Helvetica')
         .fontSize(7.5)
         .text(cell, curX + 2, startY + 2, { width: colWidths[cIdx] - 4, lineGap: 1 });
      curX += colWidths[cIdx];
    });
    startY += 16;
  });

  // Línea inferior de la tabla
  doc.moveTo(startX, startY).lineTo(startX + USABLE_W, startY).lineWidth(1).stroke(C.lineGray);
  doc.y = startY + 8;
  doc.moveDown(0.3);
}

// Bloque de Código / Comandos con marco formal
function drawCodeBlock(codeText, fontSize = 7) {
  const lines = codeText.split('\n');
  const blockHeight = lines.length * 9 + 10;
  checkSpace(blockHeight + 15);

  const startY = doc.y;
  doc.rect(MARGIN_X, startY, USABLE_W, blockHeight).fillAndStroke(C.bgBox, C.lineGray);
  
  doc.fillColor(C.black)
     .font('Courier')
     .fontSize(fontSize)
     .text(codeText, MARGIN_X + 8, startY + 5, { width: USABLE_W - 16, lineGap: 1.5 });
  
  doc.y = startY + blockHeight + 6;
  doc.moveDown(0.3);
}

// ============================================================================
// PÁGINA 1: CARÁTULA FORMAL INSTITUCIONAL (INSTITUTO SUPERIOR UNIVERSITARIO JAPÓN)
// ============================================================================
addPage();

doc.y = 80;
doc.fillColor(C.black)
   .font('Helvetica-Bold')
   .fontSize(15)
   .text('INSTITUTO SUPERIOR UNIVERSITARIO JAPÓN', MARGIN_X, doc.y, { width: USABLE_W, align: 'center' });

doc.moveDown(0.4);
doc.fillColor(C.black)
   .font('Helvetica-Bold')
   .fontSize(11)
   .text('CARRERA DE DESARROLLO DE SOFTWARE', MARGIN_X, doc.y, { width: USABLE_W, align: 'center' });

doc.moveDown(0.3);
doc.fillColor(C.gray)
   .font('Helvetica')
   .fontSize(9.5)
   .text('ASIGNATURA: DESARROLLO DE APLICACIONES MÓVILES', MARGIN_X, doc.y, { width: USABLE_W, align: 'center' });

doc.moveDown(2);
doc.moveTo(MARGIN_X + 40, doc.y).lineTo(PAGE_W - MARGIN_X - 40, doc.y).lineWidth(1).stroke(C.black);

doc.moveDown(2);
doc.fillColor(C.gray)
   .font('Helvetica-Bold')
   .fontSize(9)
   .text('INFORME DE INVESTIGACIÓN Y DESARROLLO TÉCNICO', MARGIN_X, doc.y, { width: USABLE_W, align: 'center', characterSpacing: 1 });

doc.moveDown(0.6);
doc.fillColor(C.black)
   .font('Helvetica-Bold')
   .fontSize(12.5)
   .text(
     'DISPOSITIVOS REALES Y VIRTUALES, CONSUMO DE SERVICIOS WEB REST MEDIANTE AXIOS Y PROCESO DE GENERACIÓN DE APK EN APLICACIONES MÓVILES',
     MARGIN_X + 10, doc.y, { width: USABLE_W - 20, align: 'center', lineGap: 3 }
   );

doc.moveDown(2.5);
const boxW = USABLE_W - 30;
const boxX = MARGIN_X + 15;
const infoY = doc.y;
doc.rect(boxX, infoY, boxW, 110).lineWidth(0.8).stroke(C.black);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('DATOS INFORMATIVOS:', boxX + 12, infoY + 10);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('DOCENTE / TUTOR:', boxX + 12, infoY + 28);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('Ing. Luis Calo', boxX + 120, infoY + 28);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('ESTUDIANTE / AUTOR:', boxX + 12, infoY + 44);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('Estudiante de Desarrollo de Software', boxX + 120, infoY + 44);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('TEMA ASIGNADO:', boxX + 12, infoY + 60);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('Dispositivos, APIs REST con Axios y APKs', boxX + 120, infoY + 60);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('CALIFICACIÓN:', boxX + 12, infoY + 76);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('Rúbrica de Recuperación (10 Puntos)', boxX + 120, infoY + 76);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('PERÍODO ACADÉMICO:', boxX + 12, infoY + 92);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('2026 | Quito - Ecuador', boxX + 120, infoY + 92);

// ============================================================================
// PÁGINA 2: OBJETIVOS Y TEMAS
// ============================================================================
addPage();
doc.y = MARGIN_TOP;

drawH1('1. TEMA Y OBJETIVOS DE LA INVESTIGACIÓN');

drawH2('1.1. Delimitación del Tema');
drawParagraph(
  'El presente trabajo de investigación aborda tres pilares fundamentales en la ingeniería de software para dispositivos móviles: la evaluación y contraste entre entornos de ejecución físicos y virtuales (Emuladores, Simuladores y Android Virtual Device - AVD), la arquitectura de comunicación basada en servicios web REST sobre el protocolo HTTP/HTTPS utilizando el cliente avanzado Axios, y el ciclo de compilación, optimización de memoria (zipalign) y firmado criptográfico (apksigner) para la generación de archivos ejecutables APK en la plataforma Android.'
);

drawH2('1.2. Objetivo General');
drawParagraph(
  'Analizar, contrastar e implementar los fundamentos teóricos y prácticos relativos a los entornos de prueba móviles, el consumo de servicios web REST mediante la biblioteca Axios y el ciclo completo de empaquetado y firmado de paquetes de aplicación APK en Android, desarrollando una solución práctica modular para evidenciar el comportamiento de cada alternativa tecnológica.'
);

drawH2('1.3. Objetivos Específicos');
drawBullet('Investigar y categorizar los principios de funcionamiento, arquitectura de bajo nivel, ventajas y desventajas de dispositivos móviles reales, emuladores basados en hipervisores (QEMU/AVD) y simuladores de software.');
drawBullet('Examinar la arquitectura RESTful y el protocolo HTTP/HTTPS en redes móviles, analizando las capacidades técnicas de Axios frente a alternativas nativas como Fetch en términos de interceptores, gestión de timeouts y control de excepciones.');
drawBullet('Describir el pipeline de compilación de Android (bytecode DEX, compilador D8/R8, empaquetador AAPT2, Gradle) y el procedimiento de firmado digital con keytool, zipalign y apksigner bajo esquemas v1, v2 y v3.');
drawBullet('Construir una aplicación móvil funcional que integre un cliente Axios centralizado con operaciones CRUD en tiempo real y documentar los scripts de despliegue y construcción de APK para su validación en entornos reales y virtuales.');

// ============================================================================
// PÁGINA 3: MARCO TEÓRICO - DISPOSITIVOS REALES Y VIRTUALES
// ============================================================================
drawH1('2. MARCO TEÓRICO');

drawH2('2.1. Dispositivos Reales y Dispositivos Virtuales');
drawParagraph(
  'El desarrollo de aplicaciones móviles exige verificar la correcta ejecución del software en múltiples dimensiones de hardware, arquitecturas de procesamiento y versiones del sistema operativo. La fragmentación del ecosistema Android requiere una estrategia integral de pruebas que combine dispositivos físicos y plataformas virtualizadas.'
);

drawH3('2.1.1. Dispositivo Móvil Real (Hardware Nativo)');
drawParagraph(
  '¿Qué es? Un dispositivo móvil real es una unidad física comercial (smartphone, tablet o dispositivo embebido) equipada con un circuito integrado System-on-Chip (SoC) basado en arquitectura ARM o ARM64, memoria RAM, módulos de almacenamiento no volátil, circuitos de radiofrecuencia (4G/5G, Wi-Fi, Bluetooth Low Energy, NFC) y un conjunto de sensores físicos (GPS, acelerómetro, giroscopio, cámaras y lectores biométricos).'
);
drawParagraph(
  '¿Cómo funciona y su Arquitectura? La aplicación se ejecuta de forma nativa sobre el Android Runtime (ART) con compilación híbrida AOT (Ahead-of-Time) y JIT (Just-in-Time). El runtime interactúa directamente con el kernel de Linux y los controladores de la capa de abstracción de hardware (HAL). La comunicación de depuración con el equipo de desarrollo se establece a través del protocolo Android Debug Bridge (ADB), ya sea por interfaz física USB o conexión TCP/IP inalámbrica.'
);
drawParagraph(
  'Ventajas: Ofrece una fidelidad absoluta (100%) en la respuesta táctil, tasa de refresco (Hz) y gestos multi-touch. Permite medir con exactitud métricas críticas de ingeniería como el consumo energético de la batería en miliamperios (mAh), el estrangulamiento térmico (thermal throttling) ante cargas prolongadas de CPU/GPU y el comportamiento ante caídas de señal de red móvil.'
);
drawParagraph(
  'Desventajas: Representa un costo económico elevado para adquirir múltiples modelos de diferentes fabricantes (Samsung, Xiaomi, Motorola, Google). Sufre degradación física de baterías por ciclos continuos de carga durante el desarrollo y presenta dificultades para escalar en pipelines de integración continua (CI/CD).'
);

drawH3('2.1.2. Emuladores vs. Simuladores: Diferencias de Arquitectura');
drawParagraph(
  'En el ámbito de la virtualización móvil, existe una distinción técnica fundamental entre emuladores y simuladores:'
);
drawBullet('Emulador (Hardware + Software): Modela tanto la arquitectura de hardware como la pila de software del dispositivo objetivo. Emula las instrucciones de la CPU, registros, memoria y controladores de periféricos mediante hipervisores y traducción binaria (Binary Translation). Un ejemplo es el Android Virtual Device (AVD), el cual ejecuta el kernel Linux real de Android y todo el sistema operativo sobre QEMU y aceleradores de hardware como KVM en Linux o HAXM/Hyper-V en Windows.');
drawBullet('Simulador (Solo Software): Modela únicamente la interfaz de usuario, las bibliotecas y las APIs de alto nivel del sistema operativo objetivo, ejecutándose directamente sobre el hardware y el kernel del equipo anfitrión. Un ejemplo es el iOS Simulator de Xcode sobre macOS o los simuladores de viewport web en navegadores. No emula hardware de bajo nivel ni traduce instrucciones de procesador.');

// ============================================================================
// PÁGINA 4: AVD Y TABLA COMPARATIVA
// ============================================================================
checkSpace(150);
drawH3('2.1.3. Android Virtual Device (AVD)');
drawParagraph(
  '¿Qué es y cómo funciona? Un AVD es una configuración de emulación administrada por el Android SDK que combina un perfil de hardware (tamaño de pantalla, densidad DPI, memoria RAM) con una imagen del sistema (System Image x86_64 o ARM64). Funciona sobre el motor QEMU 2.0+ utilizando virtualización asistida por hardware y aceleración gráfica por GPU (OpenGL/Vulkan passthrough).'
);
drawParagraph(
  'Ventajas del AVD: Permite probar aplicaciones en diversas versiones de Android (desde API 21 hasta API 35+) sin adquirir hardware adicional. Facilita la simulación de eventos externos como llamadas telefónicas entrantes, envío de SMS, variación de nivel de batería, rotación de pantalla y rutas GPS personalizadas. Es fundamental para pruebas automatizadas con frameworks como Espresso o Appium en servidores CI/CD.'
);
drawParagraph(
  'Desventajas del AVD: Requiere considerables recursos de hardware en la computadora anfitriona (mínimo 16 GB de RAM y procesador con soporte de virtualización VT-x/AMD-V). No reproduce con exactitud el comportamiento térmico real ni las peculiaridades de capas de personalización propietarias de los fabricantes (como One UI o MIUI).'
);

drawTableAPA(
  'Tabla 1. Matriz Técnica Comparativa de Entornos de Ejecución Móvil',
  ['Criterio Técnico', 'Dispositivo Real', 'Emulador AVD (QEMU)', 'Simulador (Software)'],
  [
    ['Nivel de Virtualización', 'Nativo (Sin virtualizar)', 'Hardware y Software Completo', 'Solo APIs / Capa Software'],
    ['Fidelidad de Pruebas', '100% (Prueba de oro)', '90% - 95% (Muy Alta)', '70% - 80% (Media)'],
    ['Consumo en Host (PC)', 'Nulo (Usa su CPU/RAM)', 'Muy Alto (2 - 4 GB RAM / CPU)', 'Bajo - Moderado'],
    ['Pruebas de Sensores/Red', 'Físicas y reales', 'Simuladas por GUI / Telnet', 'Limitadas / Mocks'],
    ['Integración CI/CD', 'Compleja y costosa', 'Excelente (Headless)', 'Muy Rápida y Ligera'],
    ['Costo de Adquisición', 'Alto (Múltiples equipos)', 'Gratuito (Con Android SDK)', 'Gratuito e Integrado']
  ],
  [100, 125, 135, 127]
);

// ============================================================================
// PÁGINA 5: MARCO TEÓRICO - APIS Y SERVICIOS REST CON AXIOS
// ============================================================================
checkSpace(180);
drawH2('2.2. APIs y Servicios Web para Aplicaciones Móviles');
drawParagraph(
  'En las arquitecturas móviles modernas, los dispositivos cliente delegan el procesamiento intensivo y la persistencia de datos a servidores remotos mediante el consumo de APIs (Application Programming Interfaces) bajo el modelo arquitectónico REST.'
);

drawH3('2.2.1. Protocolo HTTP/HTTPS y Arquitectura REST');
drawParagraph(
  'El protocolo HTTP (RFC 7231) sobre capas de transporte seguro TLS (HTTPS) define la semántica de comunicación cliente-servidor mediante métodos estándar: GET (consulta segura e idempotente), POST (creación de recursos), PUT (reemplazo completo), PATCH (modificación parcial) y DELETE (eliminación). Los códigos de estado categorizan las respuestas del servidor: 2xx (Éxito), 4xx (Errores del cliente como 400 Bad Request, 401 Unauthorized, 404 Not Found) y 5xx (Errores internos del servidor).'
);
drawParagraph(
  'La arquitectura REST (Representational State Transfer) establece principios clave: comunicación sin estado (Statelessness), donde cada solicitud contiene toda la autenticación requerida; direccionamiento unívoco de recursos mediante URIs lógicas; e intercambio de cargas útiles estructuradas en formato JSON (JavaScript Object Notation).'
);

drawH3('2.2.2. Axios para Consumo de Servicios en Aplicaciones Móviles');
drawParagraph(
  '¿Qué es? Axios es un cliente HTTP isomórfico basado en Promesas ECMAScript (async/await) compatible con Node.js, navegadores y entornos móviles multiplataforma como React Native y Capacitor.'
);
drawParagraph(
  '¿Cómo funciona su Arquitectura? Axios encapsula las llamadas nativas de red utilizando XMLHttpRequest o adaptadores HTTP nativos. Integra transformación automática de datos JSON, soporte para cancelación de solicitudes mediante AbortController, control explícito de timeouts y una arquitectura de Interceptores de Red.'
);
drawParagraph(
  'Interceptores de Request y Response: El interceptor de petición permite inyectar dinámicamente cabeceras de autorización (tokens Bearer JWT) y registrar marcas de tiempo antes de que la solicitud salga del dispositivo. El interceptor de respuesta captura las respuestas del servidor, calcula la latencia en milisegundos y normaliza de forma unificada los códigos de error HTTP para proteger la interfaz de usuario.'
);

drawTableAPA(
  'Tabla 2. Comparativa Técnica: Cliente Axios vs Fetch API Nativa',
  ['Característica', 'Cliente Axios', 'Fetch API Nativa'],
  [
    ['Transformación JSON', 'Automática (Serializa y parsea data)', 'Manual (Requiere invocar response.json())'],
    ['Interceptores Globales', 'Nativos (Request y Response)', 'No soportados (Requiere envoltorios custom)'],
    ['Manejo de Errores (4xx/5xx)', 'Rechaza la promesa automáticamente', 'Resuelve con éxito (Obliga a validar res.ok)'],
    ['Control de Timeouts Móviles', 'Nativo mediante propiedad timeout: 10000', 'Requiere AbortSignal.timeout() manual'],
    ['Cancelación de Peticiones', 'Soporte con AbortController', 'Soporte con AbortController'],
    ['Protección XSRF / Headers', 'Integrada por defecto', 'Configuración manual']
  ],
  [120, 185, 182]
);

// ============================================================================
// PÁGINA 6: MARCO TEÓRICO - GENERACIÓN Y FIRMADO DE APK
// ============================================================================
checkSpace(180);
drawH2('2.3. Proceso de Generación y Compilación de APK (Android Package)');
drawParagraph(
  'El archivo APK es el formato ejecutable y paquete de distribución para el sistema operativo Android. Funciona como un contenedor comprimido (basado en formato ZIP) que agrupa todos los elementos necesarios para la instalación de la aplicación.'
);

drawH3('2.3.1. Anatomía Interna de un Archivo APK');
drawBullet('AndroidManifest.xml: Manifiesto binario con permisos (INTERNET), actividades, servicios y configuraciones de hardware.');
drawBullet('classes.dex: Bytecode ejecutable en formato Dalvik Executable generado por el compilador D8/R8 para el runtime ART.');
drawBullet('resources.arsc: Tabla de recursos precompilados que almacena identificadores numéricos, textos, dimensiones y temas.');
drawBullet('res/ y assets/: Recursos visuales compilados (layouts, mipmaps) y archivos estáticos (fuentes, bundles JavaScript).');
drawBullet('lib/: Bibliotecas nativas compiladas en C/C++ (.so) segmentadas por arquitectura ABI (arm64-v8a, armeabi-v7a, x86_64).');
drawBullet('META-INF/: Certificados criptográficos y manifiestos de firma digital (CERT.RSA, CERT.SF, MANIFEST.MF).');

drawH3('2.3.2. Pipeline de Compilación, Debug vs. Release y Firmado Digital');
drawParagraph(
  'El pipeline de compilación de Android transforma el código fuente mediante las siguientes etapas: 1) Compilación de código a bytecode Java (.class) y posterior transformación a bytecode Dalvik (classes.dex) mediante el compilador D8/R8 con ofuscación y reducción de código; 2) Compilación de recursos mediante AAPT2 (Android Asset Packaging Tool); 3) Ensamblado del paquete APK por Gradle; 4) Alineación de memoria con zipalign; 5) Firma digital criptográfica con apksigner.'
);
drawParagraph(
  'Variantes Debug vs Release: La variante Debug incluye banderas de depuración (android:debuggable="true") y se firma con un certificado genérico (debug.keystore). La variante Release optimiza el código mediante ofuscación y Tree Shaking con R8/ProGuard, y exige la firma con un Keystore privado protegido por contraseña.'
);
drawParagraph(
  'Zipalign y Apksigner: Zipalign alinea los archivos no comprimidos del ZIP en múltiplos de 4 bytes (32 bits), permitiendo al kernel de Android leer recursos directamente mediante mapeo de memoria mmap() sin consumos innecesarios de RAM. Apksigner aplica firmas criptográficas en esquemas v1 (JAR), v2 (bloque completo del APK) y v3 (rotación de claves), garantizando autenticidad e integridad contra manipulaciones de código.'
);

// ============================================================================
// PÁGINA 7: DESARROLLO DEL EJEMPLO PRÁCTICO
// ============================================================================
checkSpace(200);
drawH1('3. DESARROLLO DEL EJEMPLO PRÁCTICO');

drawH2('3.1. Arquitectura de la Aplicación Móvil Desarrollada');
drawParagraph(
  'Como demostración práctica se construyó la aplicación móvil "MobileStore & API Hub", diseñada con una arquitectura por capas desacoplada: Capa de Presentación (Interfaz responsiva con viewport de smartphone), Capa de Controladores (src/app.js), Capa de Servicios REST (src/api/productService.js) y Capa de Cliente HTTP (src/api/apiClient.js).'
);

drawH2('3.2. Implementación del Cliente Axios con Interceptores');
drawParagraph(
  'El módulo apiClient.js centraliza la comunicación con la API REST remota, configurando un timeout de 10 segundos para tolerancia a redes móviles, inyectando cabeceras de autorización Bearer JWT y calculando la latencia en milisegundos:'
);

drawCodeBlock(
`// src/api/apiClient.js - Instancia Centralizada con Interceptores
const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Platform': 'Android-Mobile-App'
  }
});

// 1. Interceptor de Petición (Request): Inyección de Token y Telemetría
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date() };
  config.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  console.log(\`[HTTP OUT] [\${config.method.toUpperCase()}] -> \${config.url}\`);
  return config;
});

// 2. Interceptor de Respuesta (Response): Latencia y Mapeo de Errores
apiClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    return { success: true, status: response.status, data: response.data, durationMs: duration };
  },
  (error) => {
    const status = error.response ? error.response.status : 'ERR_NETWORK';
    return Promise.reject({ success: false, status, message: error.message });
  }
);

module.exports = apiClient;`
);

drawH2('3.3. Resultados de Pruebas de Integración y Consumo REST');
drawParagraph(
  'Se ejecutó la suite automatizada test-axios-services.js contra la API REST pública, validando satisfactoriamente las operaciones CRUD con medición de latencia:'
);

drawCodeBlock(
`===============================================================
 PRUEBAS DE INTEGRACIÓN DE SERVICIOS REST CON AXIOS
 Tutor: Ing. Luis Calo | Entorno: Node.js / Runtime Móvil
===============================================================
>>> [TEST 1] GET /products?limit=3   -> 200 OK | Latencia: 3499ms | 3 items
>>> [TEST 2] GET /categories         -> 200 OK | Latencia: 196ms  | 4 categorías
>>> [TEST 3] POST /products          -> 201 Created | Latencia: 198ms | ID: 21
>>> [TEST 4] PUT /products/1         -> 200 OK | Latencia: 197ms | Modificado
>>> [TEST 5] DELETE /products/1      -> 200 OK | Latencia: 199ms | Confirmado
===============================================================
 RESULTADO: TODAS LAS PRUEBAS DE CONSUMO REST FUERON EXITOSAS
===============================================================`
);

drawH2('3.4. Pipeline de Construcción, Alineación y Firmado de APK');
drawParagraph(
  'A través de los scripts build-tools/generate-keystore.sh y build-tools/build-apk-workflow.sh se ejecutó la secuencia de compilación:'
);

drawCodeBlock(
`# 1. Generación de Keystore con algoritmo RSA de 2048 bits
keytool -genkey -v -keystore release-key.jks -alias mobileappkey -keyalg RSA -keysize 2048 -validity 10000

# 2. Alineación de límites de 4 bytes con zipalign (Optimización de memoria mmap)
zipalign -p -f -v 4 ./dist-apk/app-unsigned-unaligned.apk ./dist-apk/app-unaligned.apk

# 3. Firmado criptográfico con apksigner (Esquemas v1, v2 y v3)
apksigner sign --ks release-key.jks --out ./dist-apk/MobileStore-Release-Signed.apk ./dist-apk/app-unaligned.apk

# 4. Verificación de firma digital
apksigner verify --verbose ./dist-apk/MobileStore-Release-Signed.apk`
);

// ============================================================================
// PÁGINA 8: CONCLUSIONES Y BIBLIOGRAFÍA APA 7
// ============================================================================
checkSpace(200);
drawH1('4. CONCLUSIONES');

drawParagraph(
  '1. Complementariedad Estratégica de Entornos de Prueba: La investigación demostró que los emuladores basados en AVD/QEMU y los simuladores de software son herramientas óptimas para acelerar el ciclo de desarrollo temprano e integración continua (CI/CD). No obstante, las pruebas en dispositivos físicos reales son indispensables e insustituibles para auditar métricas críticas como el consumo de batería (mAh), la disipación térmica de la CPU y la respuesta táctil nativa.'
);
drawParagraph(
  '2. Superioridad Técnica de Axios en Aplicaciones Móviles: Frente a la API Fetch nativa, Axios proporciona una arquitectura más robusta y desacoplada gracias a su sistema de interceptores globales. Esto permite centralizar la inyección de credenciales JWT Bearer, auditar la latencia de red en tiempo real y estandarizar el tratamiento de códigos de error HTTP (4xx y 5xx) en una sola capa de software.'
);
drawParagraph(
  '3. Resiliencia ante la Inestabilidad de Conectividad Móvil: El establecimiento de tiempos de espera explícitos (timeouts) y la captura semántica de excepciones en Axios protegen el hilo principal de la interfaz de usuario (UI Thread) ante interrupciones de conectividad 4G/5G, garantizando una experiencia de usuario sólida y predecible.'
);
drawParagraph(
  '4. Eficiencia de Memoria y Seguridad Criptográfica en Android: El proceso de alineación a 4 bytes mediante zipalign optimiza sustancialmente el consumo de memoria RAM en el dispositivo mediante lectura directa mmap(). Complementariamente, el firmado con apksigner bajo esquemas v2 y v3 asegura la integridad inmutable del archivo APK, evitando alteraciones maliciosas del código.'
);
drawParagraph(
  '5. Validez del Enfoque por Capas en el Desarrollo de Software: La arquitectura modular implementada en el proyecto "MobileStore & API Hub" demostró que una separación estricta de responsabilidades entre la capa de presentación, los servicios de negocio y el cliente HTTP facilita el mantenimiento, simplifica la ejecución de pruebas unitarias y optimiza el empaquetado final de la aplicación.'
);

drawH1('5. BIBLIOGRAFÍA');

const biblio = [
  'Android Open Source Project. (2024). Android Debug Bridge (adb) architecture and command reference. Android Developers. https://developer.android.com/tools/adb',
  'Axios Community. (2024). Axios HTTP client documentation: Interceptors, instances and error handling. Axios HTTP. https://axios-http.com/docs/intro',
  'Fielding, R. T. (2000). Architectural styles and the design of network-based software architectures (Doctoral dissertation, University of California, Irvine).',
  'Google Developers. (2024a). Run apps on the Android Emulator and manage Android Virtual Devices (AVD). Android Studio Documentation. https://developer.android.com/studio/run/emulator',
  'Google Developers. (2024b). Sign your app: APK Signature Scheme v2, v3 and keytool management. Android Developers Guide. https://developer.android.com/studio/publish/app-signing',
  'Google Developers. (2024c). Reduce app size and optimize alignment with zipalign. Android Studio Tools. https://developer.android.com/tools/zipalign',
  'IETF (Internet Engineering Task Force). (2014). Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content (RFC 7231). https://datatracker.ietf.org/doc/html/rfc7231',
  'Martin, R. C. (2018). Clean Architecture: A craftsman’s guide to software structure and design. Prentice Hall.',
  'Meier, R., & Lake, I. (2018). Professional Android (4th ed.). Wrox - John Wiley & Sons.',
  'Smyth, N. (2023). Android Studio Panda Essentials - Kotlin Edition: Developing Android Apps Using Android Studio and Kotlin. Payload Media.'
];

biblio.forEach(b => {
  checkSpace(20);
  doc.fillColor(C.black)
     .font('Helvetica')
     .fontSize(8)
     .text(b, MARGIN_X + 15, doc.y, {
       width: USABLE_W - 15,
       align: 'justify',
       lineGap: 1.5,
       indent: -15 // Sangría francesa APA 7
     });
  doc.moveDown(0.25);
});

// ============================================================================
// NUMERACIÓN DE PÁGINAS APA 7 (ENCABEZADO SUPERIOR DERECHO)
// ============================================================================
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  
  if (i > 0) { // Omitir en carátula
    // Encabezado superior APA 7 (Running head a la izquierda, número a la derecha)
    doc.fillColor(C.gray)
       .font('Helvetica')
       .fontSize(7.5)
       .text('INSTITUTO SUPERIOR UNIVERSITARIO JAPÓN | DESARROLLO DE SOFTWARE', MARGIN_X, 25, { width: USABLE_W / 2 });
    
    doc.text(`Página ${i + 1} de ${totalPages}`, MARGIN_X + USABLE_W / 2, 25, {
      width: USABLE_W / 2,
      align: 'right'
    });

    doc.moveTo(MARGIN_X, 35).lineTo(MARGIN_X + USABLE_W, 35).lineWidth(0.5).stroke(C.lineGray);
  }
}

doc.end();

writeStream.on('finish', () => {
  console.log('===============================================================');
  console.log(' ¡INFORME ACADÉMICO APA 7ma GENERADO CON ÉXITO!');
  console.log(` Institución: INSTITUTO SUPERIOR UNIVERSITARIO JAPÓN`);
  console.log(` Carrera: DESARROLLO DE SOFTWARE | Tutor: ING. LUIS CALO`);
  console.log(` Archivo: ${outputPath}`);
  console.log(` Total de Páginas: ${totalPages}`);
  console.log('===============================================================');
});
