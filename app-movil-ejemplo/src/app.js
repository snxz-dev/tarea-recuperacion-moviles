/**
 * ============================================================================
 * SCRIPT PRINCIPAL: app.js
 * Control de Interfaz de Usuario y Orquestación Axios
 * Tutor: Ing. Luis Calo
 * ============================================================================
 */

let reqCount = 0;

// Configuración del cliente Axios para el navegador
const mobileAxios = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Platform': 'Android-Simulation-Web',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token_movil_calo'
  }
});

// Interceptor de Request
mobileAxios.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    reqCount++;
    document.getElementById('logger-counter').textContent = `${reqCount} requests`;
    addLog(`[OUT] ${config.method.toUpperCase()} ${config.url}`, 'info');
    return config;
  },
  (error) => {
    addLog(`[REQ ERROR] ${error.message}`, 'error');
    return Promise.reject(error);
  }
);

// Interceptor de Response
mobileAxios.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    document.getElementById('latency-text').textContent = `${duration} ms`;
    document.getElementById('status-dot').style.background = '#10b981';
    document.getElementById('status-dot').style.boxShadow = '0 0 8px #10b981';
    document.getElementById('api-status-text').textContent = `REST: ${response.status} OK`;
    
    addLog(`[IN] ${response.status} OK (${duration}ms) -> ${response.config.url}`, 'success');
    return response;
  },
  (error) => {
    document.getElementById('status-dot').style.background = '#ef4444';
    document.getElementById('status-dot').style.boxShadow = '0 0 8px #ef4444';
    
    const status = error.response ? error.response.status : 'ERR_NETWORK';
    document.getElementById('api-status-text').textContent = `REST: Error ${status}`;
    addLog(`[ERR] Status: ${status} | ${error.message}`, 'error');
    return Promise.reject(error);
  }
);

function addLog(msg, type = 'info') {
  const stream = document.getElementById('logs-stream');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  entry.textContent = `[${time}] ${msg}`;
  stream.insertBefore(entry, stream.firstChild);
  if (stream.children.length > 5) {
    stream.removeChild(stream.lastChild);
  }
}

// Cargar productos
let allProducts = [];

async function loadProducts() {
  const container = document.getElementById('products-list');
  container.innerHTML = `<div style="text-align: center; padding: 30px; color: #94a3b8;">Consultando API REST con Axios...</div>`;

  try {
    const response = await mobileAxios.get('/products?limit=8');
    allProducts = response.data;
    renderProducts(allProducts);
  } catch (error) {
    container.innerHTML = `
      <div style="background: rgba(239,68,68,0.1); border: 1px solid #ef4444; padding: 15px; border-radius: 12px; text-align: center;">
        <p style="color: #fca5a5; font-size: 13px; font-weight: bold;">Error al consumir API REST</p>
        <p style="color: #f87171; font-size: 11px; margin-top: 4px;">${error.message}</p>
        <button class="btn-primary" style="margin-top: 10px; font-size: 11px; padding: 6px 12px;" onclick="loadProducts()">Reintentar</button>
      </div>
    `;
  }
}

function renderProducts(products) {
  const container = document.getElementById('products-list');
  if (!products || products.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #94a3b8; padding: 20px;">No se encontraron productos.</p>`;
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}" class="product-img" loading="lazy" />
      <div class="product-info">
        <div>
          <h4 class="product-title">${p.title}</h4>
          <span class="product-cat">${p.category}</span>
        </div>
        <div class="product-meta">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button style="background: none; border: 1px solid #ef4444; color: #ef4444; border-radius: 6px; padding: 2px 8px; font-size: 11px; cursor: pointer;" onclick="deleteProductById(${p.id})">🗑️ Borrar</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function filterByCategory(category) {
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');

  if (category === 'all') {
    renderProducts(allProducts);
    return;
  }

  try {
    const response = await mobileAxios.get(`/products/category/${encodeURIComponent(category)}`);
    renderProducts(response.data);
  } catch (error) {
    console.error('Error al filtrar categoría:', error);
  }
}

async function handleCreateProduct(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-post');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  const payload = {
    title: document.getElementById('p-title').value,
    price: parseFloat(document.getElementById('p-price').value),
    category: document.getElementById('p-category').value,
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    description: 'Producto creado desde aplicación móvil mediante Axios POST'
  };

  try {
    const res = await mobileAxios.post('/products', payload);
    alert(`¡Éxito! Producto creado en API REST con ID generado: ${res.data.id}`);
    closeCreateModal();
    // Añadimos a la lista local para feedback visual inmediato
    allProducts.unshift({ ...payload, id: res.data.id || Date.now() });
    renderProducts(allProducts);
  } catch (error) {
    alert(`Error al crear producto: ${error.message}`);
  } finally {
    btn.textContent = 'Enviar POST';
    btn.disabled = false;
  }
}

async function deleteProductById(id) {
  if (!confirm(`¿Desea enviar petición DELETE a la API para el producto ID ${id}?`)) return;
  try {
    await mobileAxios.delete(`/products/${id}`);
    alert(`Petición DELETE /products/${id} completada exitosamente en el servidor.`);
    allProducts = allProducts.filter(p => p.id !== id);
    renderProducts(allProducts);
  } catch (error) {
    alert(`Error en DELETE: ${error.message}`);
  }
}

async function simulateHttpError() {
  try {
    await mobileAxios.get('/endpoint-inexistente-404');
  } catch (error) {
    console.log('Error 404 capturado por Axios Interceptor correctamente.');
  }
}

function openCreateModal() {
  document.getElementById('create-modal').style.display = 'flex';
}

function closeCreateModal() {
  document.getElementById('create-modal').style.display = 'none';
  document.getElementById('product-form').reset();
}

// Reloj del dispositivo móvil simulado
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const clockEl = document.getElementById('device-clock');
  if (clockEl) clockEl.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// Iniciar cargando productos
loadProducts();
