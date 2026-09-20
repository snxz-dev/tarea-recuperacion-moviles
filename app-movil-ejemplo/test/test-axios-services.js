/**
 * ============================================================================
 * SCRIPT DE PRUEBAS DE INTEGRACIÓN: test-axios-services.js
 * ASIGNATURA: Desarrollo de Aplicaciones Móviles
 * TUTOR: Ing. Luis Calo
 * ============================================================================
 * DESCRIPCIÓN:
 * Este script ejecuta pruebas end-to-end de consumo de servicios REST utilizando
 * la biblioteca Axios a través de nuestro cliente personalizado apiClient.js.
 * 
 * Evalúa:
 * - Peticiones GET (Listado y filtrado)
 * - Petición POST (Envío de datos JSON)
 * - Petición PUT (Modificación)
 * - Petición DELETE (Eliminación)
 * - Manejo y captura de errores HTTP
 */

const productService = require('../src/api/productService');

async function runIntegrationTests() {
  console.log('===============================================================');
  console.log(' INICIO DE PRUEBAS DE INTEGRACIÓN: SERVICIOS REST CON AXIOS');
  console.log(' Tutor: Ing. Luis Calo | Entorno: Node.js / Runtime Móvil');
  console.log('===============================================================\n');

  try {
    // -------------------------------------------------------------------------
    // TEST 1: GET - Obtener lista de productos
    // -------------------------------------------------------------------------
    console.log('>>> [TEST 1] Ejecutando GET /products?limit=3 ...');
    const getResult = await productService.getProducts(3);
    console.log(`✓ Estado HTTP: ${getResult.status} (${getResult.statusText})`);
    console.log(`✓ Latencia de red: ${getResult.durationMs}ms`);
    console.log(`✓ Cantidad de productos recibidos: ${getResult.data.length}`);
    console.log(`✓ Ejemplo de producto: [ID ${getResult.data[0].id}] ${getResult.data[0].title} - $${getResult.data[0].price}\n`);

    // -------------------------------------------------------------------------
    // TEST 2: GET - Obtener categorías
    // -------------------------------------------------------------------------
    console.log('>>> [TEST 2] Ejecutando GET /products/categories ...');
    const catResult = await productService.getCategories();
    console.log(`✓ Estado HTTP: ${catResult.status} | Categorías disponibles: ${catResult.data.join(', ')}\n`);

    // -------------------------------------------------------------------------
    // TEST 3: POST - Crear un nuevo producto
    // -------------------------------------------------------------------------
    console.log('>>> [TEST 3] Ejecutando POST /products ...');
    const newProductData = {
      title: 'Dispositivo Móvil Test Android AVD',
      price: 299.99,
      description: 'Dispositivo virtual para pruebas de laboratorio de desarrollo móvil.',
      category: 'electronics'
    };
    const postResult = await productService.createProduct(newProductData);
    console.log(`✓ Estado HTTP: ${postResult.status} (${postResult.statusText})`);
    console.log(`✓ ID asignado por el servidor REST: ${postResult.data.id}`);
    console.log(`✓ Título registrado: ${postResult.data.title}\n`);

    // -------------------------------------------------------------------------
    // TEST 4: PUT - Actualizar producto
    // -------------------------------------------------------------------------
    console.log('>>> [TEST 4] Ejecutando PUT /products/1 ...');
    const updateResult = await productService.updateProduct(1, {
      title: 'Producto Actualizado vía Axios Móvil',
      price: 150.00
    });
    console.log(`✓ Estado HTTP: ${updateResult.status} | Título modificado: ${updateResult.data.title}\n`);

    // -------------------------------------------------------------------------
    // TEST 5: DELETE - Eliminar producto
    // -------------------------------------------------------------------------
    console.log('>>> [TEST 5] Ejecutando DELETE /products/1 ...');
    const deleteResult = await productService.deleteProduct(1);
    console.log(`✓ Estado HTTP: ${deleteResult.status} | Eliminación confirmada correctamente.\n`);

    console.log('===============================================================');
    console.log(' RESULTADO: TODAS LAS PRUEBAS DE CONSUMO REST FUERON EXITOSAS');
    console.log('===============================================================');
  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA EJECUCIÓN DE LAS PRUEBAS:', error.message);
    if (error.status) console.error(`Código HTTP de error: ${error.status}`);
  }
}

runIntegrationTests();
