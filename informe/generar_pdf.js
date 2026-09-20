/**
 * ============================================================================
 * SCRIPT DE COMPILACIÓN A PDF: generar_pdf.js
 * Generador automático del documento formal académico mediante Puppeteer
 * Tutor: Ing. Luis Calo
 * ============================================================================
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function generateAcademicPDF() {
  console.log('===============================================================');
  console.log(' INICIANDO COMPILACIÓN DEL INFORME ACADÉMICO A FORMATO PDF');
  console.log(' Tutor: Ing. Luis Calo | Rúbrica: 10 Puntos');
  console.log('===============================================================\n');

  const htmlPath = path.join(__dirname, 'informe_investigacion.html');
  const pdfOutputPath = path.join(__dirname, 'Informe_Tecnico_Investigacion_Moviles.pdf');

  console.log(`📄 Leyendo documento fuente: ${htmlPath}`);

  // Iniciar navegador headless
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();

  // Cargar el archivo HTML
  await page.goto(`file://${htmlPath}`, {
    waitUntil: ['load', 'networkidle0']
  });

  // Esperar renderizado completo de fuentes de Google
  await page.evaluateHandle('document.fonts.ready');

  console.log('⚙️  Renderizando páginas y aplicando estilos de impresión A4...');

  await page.pdf({
    path: pdfOutputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm'
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 15mm;">
        <span>Desarrollo de Aplicaciones Móviles</span>
        <span>Tutor: Ing. Luis Calo</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #64748b; width: 100%; display: flex; justify-content: space-between; padding: 0 15mm;">
        <span>Tarea de Recuperación - Investigación y Práctica</span>
        <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
      </div>
    `
  });

  await browser.close();

  console.log(`\n✅ INFORME PDF GENERADO CON ÉXITO:`);
  console.log(`📁 Ubicación: ${pdfOutputPath}`);
  console.log('===============================================================');
}

generateAcademicPDF().catch((err) => {
  console.error('❌ Error durante la generación del PDF:', err);
  process.exit(1);
});
