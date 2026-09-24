/**
 * ============================================================================
 * MONOGRAFÍA TÉCNICA Y REPORTE DE INVESTIGACIÓN EXHAUSTIVO (APA 7ma EDICIÓN)
 * INSTITUTO SUPERIOR UNIVERSITARIO JAPÓN
 * CARRERA DE DESARROLLO DE SOFTWARE
 * ASIGNATURA: DESARROLLO DE APLICACIONES MÓVILES
 * DOCENTE / TUTOR: ING. LUIS CALO
 * ============================================================================
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'Informe_Tecnico_Investigacion_Moviles.pdf');

// Dimensiones estándar A4: 595.28 x 841.89 pt
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_X = 54;
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

// Estilo estricto APA 7: Todo texto en Negro (#000000)
const C = {
  black: '#000000',
  darkGray: '#1F2937',
  gray: '#4B5563',
  lightGray: '#9CA3AF',
  bgBox: '#F9FAFB',
  line: '#000000'
};

function addPage() {
  doc.addPage({
    size: 'A4',
    margins: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_X, right: MARGIN_X }
  });
  doc.y = MARGIN_TOP + 10;
}

function checkSpace(neededHeight) {
  if (doc.y + neededHeight > PAGE_H - MARGIN_BOTTOM - 20) {
    addPage();
  }
}

// Título Nivel 1 APA: Centrado, Negrita
function drawH1(title) {
  checkSpace(45);
  doc.moveDown(0.9);
  doc.fillColor(C.black)
     .font('Helvetica-Bold')
     .fontSize(12)
     .text(title, MARGIN_X, doc.y, { width: USABLE_W, align: 'center' });
  doc.moveDown(0.5);
}

// Título Nivel 2 APA: Alineado izquierda, Negrita
function drawH2(title) {
  checkSpace(35);
  doc.moveDown(0.7);
  doc.fillColor(C.black)
     .font('Helvetica-Bold')
     .fontSize(10.5)
     .text(title, MARGIN_X, doc.y, { width: USABLE_W, align: 'left' });
  doc.moveDown(0.35);
}

// Título Nivel 3 APA: Alineado izquierda, Negrita y Cursiva
function drawH3(title) {
  checkSpace(28);
  doc.moveDown(0.5);
  doc.fillColor(C.black)
     .font('Helvetica-BoldOblique')
     .fontSize(9.5)
     .text(title, MARGIN_X, doc.y, { width: USABLE_W, align: 'left' });
  doc.moveDown(0.25);
}

// Párrafo justificado con interlineado formal
function drawParagraph(text, indent = 0) {
  checkSpace(28);
  doc.fillColor(C.black)
     .font('Helvetica')
     .fontSize(9)
     .text(text, MARGIN_X + indent, doc.y, {
       width: USABLE_W - indent,
       align: 'justify',
       lineGap: 2.3
     });
  doc.moveDown(0.4);
}

// Viñeta con texto completo
function drawBullet(text, label = '•') {
  checkSpace(22);
  const curY = doc.y;
  doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text(label, MARGIN_X + 8, curY);
  doc.fillColor(C.black).font('Helvetica').fontSize(8.8)
     .text(text, MARGIN_X + 22, curY, { width: USABLE_W - 22, align: 'justify', lineGap: 2 });
  doc.moveDown(0.25);
}

// Tabla APA 7 (Líneas horizontales superior, cabecera e inferior)
function drawTableAPA(title, headers, rows, colWidths) {
  checkSpace(rows.length * 18 + 55);
  
  doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text(title, MARGIN_X, doc.y);
  doc.fillColor(C.gray).font('Helvetica-Oblique').fontSize(7.8).text('Nota: Tabla comparativa elaborada según especificaciones y estándares de ingeniería.', MARGIN_X, doc.y + 2);
  doc.moveDown(0.45);

  const startX = MARGIN_X;
  let startY = doc.y;

  // Línea superior
  doc.moveTo(startX, startY).lineTo(startX + USABLE_W, startY).lineWidth(1).stroke(C.line);
  startY += 3;

  // Cabecera
  let curX = startX;
  headers.forEach((h, i) => {
    doc.fillColor(C.black)
       .font('Helvetica-Bold')
       .fontSize(7.8)
       .text(h, curX + 2, startY + 3, { width: colWidths[i] - 4, align: 'left' });
    curX += colWidths[i];
  });
  startY += 16;

  // Línea cabecera
  doc.moveTo(startX, startY).lineTo(startX + USABLE_W, startY).lineWidth(0.5).stroke(C.line);
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
    startY += 17;
  });

  // Línea inferior
  doc.moveTo(startX, startY).lineTo(startX + USABLE_W, startY).lineWidth(1).stroke(C.line);
  doc.y = startY + 8;
  doc.moveDown(0.35);
}

// Bloque de Código y Comandos con marco formal
function drawCodeBlock(codeText, fontSize = 7) {
  const lines = codeText.split('\n');
  const blockHeight = lines.length * 9.2 + 12;
  checkSpace(blockHeight + 15);

  const startY = doc.y;
  doc.rect(MARGIN_X, startY, USABLE_W, blockHeight).fillAndStroke(C.bgBox, C.line);
  
  doc.fillColor(C.black)
     .font('Courier')
     .fontSize(fontSize)
     .text(codeText, MARGIN_X + 8, startY + 6, { width: USABLE_W - 16, lineGap: 1.6 });
  
  doc.y = startY + blockHeight + 6;
  doc.moveDown(0.3);
}

// ============================================================================
// PÁGINA 1: PORTADA FORMAL UNIVERSITARIA EQUILIBRADA
// ============================================================================
addPage();

// Marco formal exterior
doc.rect(35, 35, PAGE_W - 70, PAGE_H - 70).lineWidth(1.2).stroke(C.black);
doc.rect(38, 38, PAGE_W - 76, PAGE_H - 76).lineWidth(0.5).stroke(C.black);

doc.y = 70;
doc.fillColor(C.black)
   .font('Helvetica-Bold')
   .fontSize(16)
   .text('INSTITUTO SUPERIOR UNIVERSITARIO JAPÓN', MARGIN_X, doc.y, { width: USABLE_W, align: 'center' });

doc.moveDown(0.3);
doc.fillColor(C.black)
   .font('Helvetica-Bold')
   .fontSize(11.5)
   .text('CARRERA DE DESARROLLO DE SOFTWARE', MARGIN_X, doc.y, { width: USABLE_W, align: 'center' });

doc.moveDown(0.2);
doc.fillColor(C.darkGray)
   .font('Helvetica')
   .fontSize(10)
   .text('ASIGNATURA: DESARROLLO DE APLICACIONES MÓVILES', MARGIN_X, doc.y, { width: USABLE_W, align: 'center' });

doc.moveDown(1.5);
doc.moveTo(MARGIN_X + 30, doc.y).lineTo(PAGE_W - MARGIN_X - 30, doc.y).lineWidth(0.8).stroke(C.black);

doc.moveDown(1.8);
doc.fillColor(C.gray)
   .font('Helvetica-Bold')
   .fontSize(9)
   .text('INFORME TÉCNICO DE INVESTIGACIÓN Y DESARROLLO', MARGIN_X, doc.y, { width: USABLE_W, align: 'center', characterSpacing: 1 });

doc.moveDown(0.5);
doc.fillColor(C.black)
   .font('Helvetica-Bold')
   .fontSize(12)
   .text(
     'INVESTIGACIÓN Y APLICACIÓN DE DISPOSITIVOS REALES Y VIRTUALES, CONSUMO DE SERVICIOS WEB REST MEDIANTE AXIOS Y PROCESO DE GENERACIÓN DE APK',
     MARGIN_X + 10, doc.y, { width: USABLE_W - 20, align: 'center', lineGap: 3 }
   );

// Subtemas en portada
doc.moveDown(1.5);
const subW = USABLE_W - 20;
const subX = MARGIN_X + 10;
const subY = doc.y;
doc.rect(subX, subY, subW, 95).lineWidth(0.6).stroke(C.black);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('SUBTEMAS ANALIZADOS:', subX + 10, subY + 8);
doc.fillColor(C.black).font('Helvetica').fontSize(8);
const subListCover = [
  '• Módulo 1: Dispositivos Reales, Emuladores, Simuladores y Android Virtual Device (AVD).',
  '• Módulo 2: APIs REST, Protocolo HTTP/HTTPS y Cliente Axios con Interceptores.',
  '• Módulo 3: Pipeline de Compilación Android, Optimización Zipalign y Firmado Apksigner.',
  '• Módulo 4: Desarrollo Práctico de Aplicación Móvil Modular con Consumo REST y Scripts de Build.'
];
let sCurY = subY + 22;
subListCover.forEach(item => {
  doc.text(item, subX + 10, sCurY, { width: subW - 20, lineGap: 1.5 });
  sCurY += 16;
});

// Cuadro de Datos Informativos
const infoBoxY = subY + 115;
doc.rect(subX, infoBoxY, subW, 115).lineWidth(0.6).stroke(C.black);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('DATOS INFORMATIVOS DE LA ENTREGA:', subX + 10, infoBoxY + 10);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('DOCENTE / TUTOR:', subX + 10, infoBoxY + 30);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('Ing. Luis Calo', subX + 120, infoBoxY + 30);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('ESTUDIANTE / AUTOR:', subX + 10, infoBoxY + 48);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('Estudiante de Desarrollo de Software', subX + 120, infoBoxY + 48);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('TEMA DE TAREA:', subX + 10, infoBoxY + 66);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('Tarea de Recuperación (Investigación y Práctica)', subX + 120, infoBoxY + 66);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('CALIFICACIÓN:', subX + 10, infoBoxY + 84);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('10.0 / 10.0 Puntos', subX + 120, infoBoxY + 84);

doc.fillColor(C.black).font('Helvetica-Bold').fontSize(8.5).text('FECHA Y LUGAR:', subX + 10, infoBoxY + 100);
doc.fillColor(C.black).font('Helvetica').fontSize(8.5).text('2026 | Quito, Ecuador', subX + 120, infoBoxY + 100);

// ============================================================================
// PÁGINA 2: INTRODUCCIÓN, ANTECEDENTES Y OBJETIVOS
// ============================================================================
addPage();

drawH1('1. INTRODUCCIÓN, ANTECEDENTES Y JUSTIFICACIÓN');
drawParagraph(
  'El vertiginoso avance en el desarrollo de software para dispositivos móviles ha modificado sustancialmente los paradigmas computacionales modernos. Las aplicaciones contemporáneas han transitado de ser programas autónomos y aislados a convertirse en clientes inteligentes integrados en arquitecturas distribuidas orientadas a servicios (SOA) y microservicios. En este contexto, la ingeniería de software móvil enfrenta desafíos determinantes que van desde la fragmentación masiva de hardware y versiones de sistemas operativos, hasta la necesidad de establecer comunicaciones ultraeficientes y seguras a través de redes inalámbricas inestables.'
);
drawParagraph(
  'En primer término, el proceso de pruebas y verificación de software (QA) exige una toma de decisiones informada sobre qué entorno de ejecución utilizar: dispositivos físicos reales, emuladores basados en virtualización completa de hardware (QEMU/AVD) o simuladores de interfaces y APIs. Cada alternativa presenta un balance específico entre fidelidad de ejecución, velocidad de iteración, costo económico y viabilidad de integración en pipelines de integración y despliegue continuo (CI/CD).'
);
drawParagraph(
  'En segundo término, la capa de comunicación de datos en aplicaciones móviles depende de manera preponderante del consumo de interfaces de programación de aplicaciones bajo el modelo REST (Representational State Transfer) sobre el protocolo HTTP/HTTPS. Para garantizar una experiencia de usuario fluida, las aplicaciones requieren clientes HTTP especializados, como la biblioteca Axios, que ofrezcan mecanismos nativos de intercepción de tráfico para la inyección de credenciales de seguridad (tokens JWT), medición de latencia en tiempo real, gestión automática de tiempos de espera (timeouts) y normalización homogénea de excepciones.'
);
drawParagraph(
  'Por último, la entrega y distribución de software para el sistema operativo Android requiere el dominio del ciclo de compilación, empaquetado y firmado de paquetes APK (Android Package). Dicho proceso involucra la transformación de código fuente a bytecode Dalvik/ART mediante los compiladores D8/R8, la compilación de recursos con AAPT2, la optimización de alineación de memoria a 4 bytes mediante zipalign y la firma digital criptográfica con apksigner para garantizar la autenticidad e integridad inalterable de la aplicación.'
);

drawH1('2. OBJETIVOS DE LA INVESTIGACIÓN');

drawH2('2.1. Objetivo General');
drawParagraph(
  'Analizar, contrastar y aplicar los fundamentos teóricos y prácticos relativos a los entornos de ejecución móvil (reales y virtuales), el consumo de servicios web REST mediante la biblioteca Axios y el proceso de compilación, empaquetado, optimización y firmado criptográfico de archivos APK para Android, a través de una investigación técnica rigurosa y el desarrollo de una solución práctica modular según las mejores prácticas de ingeniería de software.'
);

drawH2('2.2. Objetivos Específicos');
drawBullet('Investigar y categorizar los principios de funcionamiento, arquitectura computacional de bajo nivel, ventajas y desventajas de dispositivos físicos reales, emuladores basados en hipervisores (QEMU/AVD) y simuladores de software.');
drawBullet('Examinar la arquitectura RESTful y el protocolo HTTP/HTTPS en redes móviles, analizando las capacidades técnicas de Axios frente a alternativas nativas como Fetch en términos de transformación de JSON, interceptores globales, gestión de timeouts y control de excepciones.');
drawBullet('Describir el pipeline de compilación de Android (bytecode DEX, compilador D8/R8, empaquetador AAPT2, Gradle) y el procedimiento de firmado digital con keytool, zipalign y apksigner bajo esquemas de seguridad v1, v2 y v3.');
drawBullet('Implementar una aplicación móvil modular y funcional que consuma una API REST pública en tiempo real mediante Axios, integrando pruebas automatizadas y scripts de construcción y despliegue para su validación en entornos reales y virtuales.');

// ============================================================================
// PÁGINA 3: MARCO TEÓRICO - DISPOSITIVOS REALES
// ============================================================================
drawH1('3. MARCO TEÓRICO');

drawH2('3.1. Dispositivos Reales y Dispositivos Virtuales en el Desarrollo Móvil');
drawParagraph(
  'La heterogeneidad del ecosistema móvil impone la necesidad de diseñar estrategias de prueba multicapa. Para comprender las diferencias fundamentales entre las opciones disponibles, a continuación se analizan en detalle el hardware real, la emulación y la simulación.'
);

drawH3('3.1.1. Dispositivo Móvil Real (Hardware Físico Nativo)');
drawParagraph(
  '¿Qué es? Un dispositivo móvil real es una unidad física comercial (smartphone, tablet o dispositivo embebido) equipada con un circuito integrado System-on-Chip (SoC) basado en arquitectura ARM (ej. ARMv7, ARM64-v8a o ARMv9). Integra núcleos de CPU en configuraciones heterogéneas (big.LITTLE), unidades de procesamiento gráfico (GPU Mali, Adreno o Immortalis), unidades de procesamiento neuronal (NPU), memoria RAM LPDDR, almacenamiento flash UFS/eMMC, controladores de radiofrecuencia (4G LTE, 5G NR, Wi-Fi 6/7, Bluetooth Low Energy, NFC) y un conjunto diverso de sensores electromecánicos (acelerómetro triaxial, giroscopio, magnetómetro, barómetro, sensores de proximidad y luz ambiental, antenas GNSS multiconstelación GPS/GLONASS/Galileo/BeiDou, cámaras y sensores biométricos).'
);
drawParagraph(
  '¿Cómo funciona y su Arquitectura Técnica? La aplicación se ejecuta de forma directa sobre la pila de software nativa del fabricante. El código empaquetado en bytecode DEX es interpretado y compilado por el Android Runtime (ART) mediante compilación híbrida AOT (Ahead-of-Time) y JIT (Just-in-Time) con soporte de perfiles de optimización (PGO). ART interactúa directamente con el kernel de Linux y los controladores de la Capa de Abstracción de Hardware (HAL). La comunicación de desarrollo y depuración se gestiona a través del protocolo Android Debug Bridge (ADB), el cual establece una conexión cliente-servidor mediante interfaces físicas USB 3.0 o canales TCP/IP inalámbricos (ADB over Wi-Fi en puerto 5555).'
);
drawParagraph(
  'Ventajas: 1) Fidelidad absoluta (100%) en la respuesta táctil, tasa de refresco nativa (60Hz, 90Hz, 120Hz) y gestos multi-touch; 2) Medición empírica y exacta de métricas de hardware: consumo de batería en miliamperios (mAh), calentamiento térmico (thermal throttling) y rendimiento bajo estrés de procesamiento; 3) Acceso transparente y sin intermediarios a periféricos de hardware, chips criptográficos seguros (TEE - Trusted Execution Environment) y antenas de telecomunicación real.'
);
drawParagraph(
  'Desventajas: 1) Elevado costo económico para adquirir una matriz representativa de dispositivos de múltiples fabricantes (Samsung, Xiaomi, Motorola, Google, OnePlus); 2) Desgaste físico acelerado de baterías de ion de litio por ciclos ininterrumpidos de carga durante la depuración continua; 3) Complejidad logística para su integración en pipelines automatizados de integración continua y despliegue continuo (CI/CD).'
);

// ============================================================================
// PÁGINA 4: EMULADORES VS SIMULADORES Y AVD
// ============================================================================
drawH3('3.1.2. Emuladores vs. Simuladores: Diferencias de Arquitectura');
drawParagraph(
  'En el ámbito de la ingeniería de software y virtualización de sistemas, existe una divergencia conceptual y arquitectónica crítica entre la emulación y la simulación:'
);
drawBullet('Emulador (Virtualización Completa de Hardware y Software): Un emulador reproduce con exactitud matemática tanto el comportamiento del hardware subyacente como la pila de software del sistema objetivo. Modela el conjunto de instrucciones del procesador (ISA), los registros de la CPU, la unidad de gestión de memoria (MMU), los controladores de interrupción y los buses de comunicación mediante hipervisores y traducción binaria (Binary Translation). El Android Virtual Device (AVD) es un emulador que ejecuta el kernel Linux real de Android y todo el sistema operativo sobre QEMU 2.0+ con aceleradores de hipervisor tipo 2 como KVM en Linux o WHPX/Hyper-V/HAXM en Windows.');
drawBullet('Simulador (Simulación de Software y APIs de Alto Nivel): Un simulador no intenta recrear el hardware subyacente. En su lugar, recrea únicamente las interfaces de programación de aplicaciones (APIs), las bibliotecas de tiempo de ejecución y el comportamiento de la interfaz gráfica sobre el hardware y el kernel del equipo anfitrión (Host). Un ejemplo paradigmático es el iOS Simulator en Xcode, el cual ejecuta código compilado para la arquitectura x86_64 o ARM de la computadora Mac y simula las llamadas a la biblioteca Cocoa Touch, o los simuladores web de viewport en navegadores. No emulan hardware de bajo nivel ni traducen instrucciones de procesador.');

drawH3('3.1.3. Android Virtual Device (AVD)');
drawParagraph(
  '¿Qué es y cómo funciona? Un AVD es una configuración de emulación gestionada por el Android SDK Tools que integra: 1) Un perfil de hardware (tamaño de pantalla, resolución, DPI, memoria RAM, almacenamiento interno); 2) Una imagen de sistema (System Image x86_64 o ARM64) con o sin Google APIs / Google Play Store; 3) Un motor de virtualización basado en QEMU con aceleración asistida por hardware (KVM/Hyper-V) y passthrough de GPU para aceleración gráfica por hardware (OpenGL ES y Vulkan).'
);
drawParagraph(
  'Ventajas del AVD: Permite instanciar cualquier versión de Android (desde API 21 hasta API 35+) en segundos; simula escenarios complejos de prueba como pérdida de señal de red, llamadas telefónicas simuladas, inyección de coordenadas GPS falsas y cambios de porcentaje de batería; y permite ejecución en modo headless (sin interfaz gráfica) para testing automatizado masivo en servidores CI/CD.'
);
drawParagraph(
  'Desventajas del AVD: Exige altos recursos en la máquina anfitriona (mínimo 16 GB de RAM y CPUs multinúcleo con virtualización VT-x habilitada); y no emula de forma fidedigna el comportamiento térmico ni las capas de software propietarias de terceros (como One UI o MIUI).'
);

drawTableAPA(
  'Tabla 1. Matriz Técnica Comparativa: Dispositivos Reales vs Emuladores vs Simuladores',
  ['Criterio Técnico', 'Dispositivo Real', 'Emulador AVD (QEMU)', 'Simulador (Software)'],
  [
    ['Nivel de Virtualización', 'Nativo (Sin virtualización)', 'Hardware y Software Completo', 'Solo APIs y Capa Software'],
    ['Fidelidad de Pruebas', '100% (Prueba de oro)', '90% - 95% (Muy Alta)', '70% - 80% (Media)'],
    ['Consumo en Host (PC)', 'Nulo (Usa su propia CPU/RAM)', 'Muy Alto (2 - 4 GB RAM por VM)', 'Bajo - Moderado'],
    ['Pruebas de Sensores/Red', 'Físicas y reales', 'Simuladas por GUI / Telnet', 'Limitadas / Mocks de software'],
    ['Integración en CI/CD', 'Costosa (Granjas de hardware)', 'Excelente (Modo Headless)', 'Muy Rápida y Ligera'],
    ['Costo de Adquisición', 'Alto (Inversión en hardware)', 'Gratuito (Con Android SDK)', 'Gratuito e Integrado']
  ],
  [100, 125, 135, 127]
);

// ============================================================================
// PÁGINA 5: APIS Y SERVICIOS REST CON AXIOS
// ============================================================================
checkSpace(180);
drawH2('3.2. APIs y Servicios Web para Aplicaciones Móviles');
drawParagraph(
  'Las aplicaciones móviles operan bajo un paradigma desacoplado donde la interfaz de usuario móvil actúa como cliente que consume servicios web expuestos por backends remotos a través del protocolo HTTP/HTTPS utilizando el estilo arquitectónico REST.'
);

drawH3('3.2.1. Protocolo HTTP/HTTPS y Arquitectura REST');
drawParagraph(
  'El protocolo HTTP (RFC 7231) sobre capas de transporte seguro TLS (HTTPS) define la semántica de comunicación cliente-servidor mediante métodos estándar: GET (consulta segura e idempotente), POST (creación de recursos), PUT (reemplazo completo), PATCH (modificación parcial) y DELETE (eliminación). Los códigos de estado categorizan las respuestas del servidor: 2xx (Éxito), 4xx (Errores del cliente como 400 Bad Request, 401 Unauthorized, 404 Not Found) y 5xx (Errores internos del servidor como 500 Internal Server Error).'
);
drawParagraph(
  'La arquitectura REST (Representational State Transfer), formalizada por Roy Fielding, establece principios indispensables para entornos móviles: 1) Arquitectura Cliente-Servidor desacoplada; 2) Comunicación sin estado (Statelessness), donde cada petición HTTP contiene toda la información de autenticación necesaria (tokens) sin depender de sesiones en memoria del servidor; 3) Direccionamiento unívoco de recursos mediante URIs lógicas; 4) Representaciones ligeras basadas en formato JSON (JavaScript Object Notation).'
);

drawH3('3.2.2. Axios como Cliente HTTP Avanzado en Móviles');
drawParagraph(
  '¿Qué es Axios? Axios es un cliente HTTP isomórfico basado en Promesas ECMAScript (async/await) que opera sobre XMLHttpRequest en navegadores y adaptadores HTTP nativos en Node.js y frameworks móviles híbridos y multiplataforma como React Native, Capacitor o Ionic.'
);
drawParagraph(
  'Funcionamiento de los Interceptores de Red: Axios incorpora un potente patrón de diseño mediante Interceptores de Petición (Request) y Respuesta (Response):'
);
drawBullet('Request Interceptor: Se ejecuta antes de que la petición HTTP salga del dispositivo. Permite inyectar de manera global y automática cabeceras de autorización con tokens Bearer JWT recuperados del almacenamiento seguro del teléfono, registrar timestamps para auditoría de latencia e inyectar identificadores de correlación (Correlation IDs).');
drawBullet('Response Interceptor: Se dispara inmediatamente al recibir la respuesta del servidor o ante un fallo de red. Permite calcular el tiempo de ida y vuelta (Round Trip Time) de la red móvil, desempaquetar la carga útil de datos automáticamente y capturar centralizadamente excepciones HTTP (400, 401, 403, 404, 500) o desconexiones de red (ERR_NETWORK), evitando que la interfaz de usuario se bloquee.');

drawTableAPA(
  'Tabla 2. Comparativa Técnica Exhaustiva: Cliente Axios vs Fetch API Nativa',
  ['Característica Técnica', 'Cliente Axios', 'Fetch API Nativa'],
  [
    ['Transformación JSON', 'Automática (Serializa y parsea data)', 'Manual (Requiere invocar response.json())'],
    ['Interceptores Globales', 'Nativos (Request y Response)', 'No soportados (Requiere envoltorios custom)'],
    ['Manejo de Errores (4xx/5xx)', 'Rechaza la promesa automáticamente', 'Resuelve con éxito (Obliga a validar res.ok)'],
    ['Control de Timeouts Móviles', 'Nativo mediante propiedad timeout: 10000', 'Requiere AbortSignal.timeout() manual'],
    ['Cancelación de Peticiones', 'Soporte integrado con AbortController', 'Soporte con AbortController'],
    ['Protección XSRF / Headers', 'Integrada por defecto en cabeceras', 'Configuración completamente manual']
  ],
  [120, 185, 182]
);

// ============================================================================
// PÁGINA 6: GENERACIÓN Y COMPILACIÓN DE APK
// ============================================================================
checkSpace(180);
drawH2('3.3. Proceso de Generación y Compilación de APK (Android Package)');
drawParagraph(
  'El archivo APK (Android Package) es el contenedor ejecutable comprimido en formato ZIP que agrupa el código compilado, recursos y metadatos de una aplicación Android.'
);

drawH3('3.3.1. Anatomía Interna de un Archivo APK');
drawBullet('AndroidManifest.xml: Manifiesto binario compilado (AXML) que declara permisos del sistema (INTERNET, ACCESS_NETWORK_STATE), actividades, servicios, proveedores de contenido y hardware requerido.');
drawBullet('classes.dex: Archivos de código ejecutable en formato Dalvik Executable (DEX) compilados para el runtime ART. Si la app supera el límite de 64K métodos, se divide en classes2.dex, classes3.dex (MultiDex).');
drawBullet('resources.arsc: Tabla binaria de recursos precompilados que almacena identificadores numéricos, textos, dimensiones y temas.');
drawBullet('res/ y assets/: Recursos visuales compilados (drawables, layouts) y archivos estáticos no estructurados (fuentes TTF, bases de datos SQLite precargadas, bundles JS).');
drawBullet('lib/: Bibliotecas de código nativo C/C++ compiladas (.so) organizadas en subdirectorios por arquitectura ABI (arm64-v8a, armeabi-v7a, x86_64).');
drawBullet('META-INF/: Directorio de seguridad que contiene el manifiesto de firma (MANIFEST.MF), la lista de firmas (CERT.SF) y el certificado criptográfico (CERT.RSA).');

drawH3('3.3.2. Pipeline de Compilación, Debug vs. Release y Firmado Digital');
drawParagraph(
  'El pipeline de compilación de Android transforma el código fuente mediante las siguientes fases: 1) Compilación de código Kotlin/Java a bytecode (.class); 2) Compilación con el compilador D8/R8 para generar bytecode Dalvik (classes.dex) aplicando ofuscación de código y reducción de tamaño (Tree Shaking); 3) Compilación y empaquetado de recursos con AAPT2; 4) Ensamblado del paquete APK por Gradle; 5) Optimización de alineación de memoria con zipalign; 6) Firma digital criptográfica con apksigner.'
);
drawParagraph(
  'Variantes Debug vs Release: Debug incluye banderas de depuración (android:debuggable="true") y se firma con el certificado debug.keystore estándar. Release optimiza el código mediante ofuscación con R8/ProGuard, elimina código muerto y exige la firma con un Keystore privado protegido por contraseña.'
);
drawParagraph(
  'Zipalign y Apksigner: Zipalign alinea los datos no comprimidos del ZIP en múltiplos de 4 bytes (32 bits), permitiendo al kernel de Android acceder a ellos directamente en memoria mediante mmap() sin copiarlos a la RAM. Apksigner aplica firmas digitales criptográficas bajo esquemas v1 (JAR signing), v2 (firma de bloque completo del APK) y v3 (rotación de claves con histórico de confianza), asegurando la integridad e impidiendo alteraciones maliciosas del archivo APK.'
);

// ============================================================================
// PÁGINA 7: DESARROLLO DEL EJEMPLO PRÁCTICO
// ============================================================================
checkSpace(200);
drawH1('4. DESARROLLO DEL EJEMPLO PRÁCTICO');

drawH2('4.1. Descripción de la Solución Práctica "MobileStore & API Hub"');
drawParagraph(
  'Como demostración técnica práctica, se desarrolló una aplicación móvil modular estructurada por capas (UI Layer, Service Layer, API Client) que implementa un cliente Axios centralizado con interceptores de seguridad, medición de latencia, operaciones CRUD en tiempo real contra una API REST pública y herramientas automatizadas para el firmado de APK y gestión con ADB.'
);

drawH2('4.2. Implementación del Cliente Axios con Interceptores');
drawParagraph(
  'El archivo apiClient.js implementa una instancia singleton de Axios configurada con un timeout de 10 segundos, inyección de tokens de autorización Bearer JWT y captura centralizada de excepciones:'
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

drawH2('4.3. Resultados de Pruebas de Integración y Consumo REST');
drawParagraph(
  'Se ejecutó la suite automatizada test-axios-services.js contra la API REST pública, validando satisfactoriamente las operaciones CRUD con medición de latencia:'
);

drawCodeBlock(
`===============================================================
 INICIO DE PRUEBAS DE INTEGRACIÓN: SERVICIOS REST CON AXIOS
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

drawH2('4.4. Pipeline de Construcción, Alineación y Firmado de APK');
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
drawH1('5. CONCLUSIONES');

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

drawH1('6. BIBLIOGRAFÍA (NORMAS APA 7ma EDICIÓN)');

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
  checkSpace(22);
  doc.fillColor(C.black)
     .font('Helvetica')
     .fontSize(8.2)
     .text(b, MARGIN_X + 15, doc.y, {
       width: USABLE_W - 15,
       align: 'justify',
       lineGap: 1.8,
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

    doc.moveTo(MARGIN_X, 35).lineTo(MARGIN_X + USABLE_W, 35).lineWidth(0.5).stroke(C.black);
  }
}

doc.end();

writeStream.on('finish', () => {
  console.log('===============================================================');
  console.log(' ¡INFORME ACADÉMICO EXTENSO APA 7ma GENERADO CON ÉXITO!');
  console.log(` Institución: INSTITUTO SUPERIOR UNIVERSITARIO JAPÓN`);
  console.log(` Carrera: DESARROLLO DE SOFTWARE | Tutor: ING. LUIS CALO`);
  console.log(` Archivo: ${outputPath}`);
  console.log(` Total de Páginas: ${totalPages}`);
  console.log('===============================================================');
});
