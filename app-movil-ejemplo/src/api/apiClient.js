/**
 * ============================================================================
 * MODULO: Cliente HTTP Centralizado con Axios (apiClient.js)
 * ASIGNATURA: Desarrollo de Aplicaciones Móviles
 * TUTOR: Ing. Luis Calo
 * ============================================================================
 * DESCRIPCIÓN:
 * Este archivo implementa una instancia singleton de Axios configurada con:
 * 1. Base URL y cabeceras por defecto.
 * 2. Timeouts para manejo de latencia en redes móviles.
 * 3. Request Interceptor: Inyección dinámica de tokens de autenticación (Bearer JWT)
 *    y registro de marcas de tiempo para auditoría de latencia.
 * 4. Response Interceptor: Transformación unificada de respuestas y captura
 *    centralizada de errores HTTP (400, 401, 404, 500, Network Offline).
 */

const axios = require('axios');

// Configuración de constantes para la conexión móvil
const API_CONFIG = {
  BASE_URL: 'https://fakestoreapi.com',
  TIMEOUT_MS: 10000, // 10 segundos para tolerancia a redes móviles 3G/4G/5G
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Platform': 'Android-Mobile-App',
    'X-App-Version': '1.0.0'
  }
};

// Creación de la instancia personalizada de Axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT_MS,
  headers: API_CONFIG.DEFAULT_HEADERS
});

/**
 * ----------------------------------------------------------------------------
 * 1. INTERCEPTOR DE PETICIONES (REQUEST INTERCEPTOR)
 * ----------------------------------------------------------------------------
 * Se ejecuta ANTES de que la petición HTTP salga del dispositivo móvil.
 * Permite:
 * - Adjuntar tokens de sesión (JWT) en la cabecera Authorization.
 * - Inyectar identificadores de correlación (Correlation ID).
 * - Medir tiempos de inicio de la petición.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Registro de tiempo inicial para telemetría
    config.metadata = { startTime: new Date() };

    // Simulación de recuperación de token de almacenamiento seguro móvil (SecureStore/Keystore)
    const authToken = global.userAuthToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_token_mobile_app';
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log(`[HTTP REQUEST OUT] [${config.method.toUpperCase()}] -> ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[HTTP REQUEST ERROR] Fallo antes de emitir la petición:', error.message);
    return Promise.reject(error);
  }
);

/**
 * ----------------------------------------------------------------------------
 * 2. INTERCEPTOR DE RESPUESTAS (RESPONSE INTERCEPTOR)
 * ----------------------------------------------------------------------------
 * Se ejecuta INMEDIATAMENTE después de recibir la respuesta del servidor o
 * cuando ocurre una falla de red/código de estado HTTP >= 400.
 * Permite:
 * - Calcular la latencia de la red (Round Trip Time).
 * - Desempaquetar la carga útil (`response.data`).
 * - Normalizar errores HTTP para la capa de interfaz de usuario (UI).
 */
apiClient.interceptors.response.use(
  (response) => {
    // Cálculo de latencia
    const endTime = new Date();
    const durationMs = endTime - response.config.metadata.startTime;
    
    console.log(
      `[HTTP RESPONSE IN] [${response.status} ${response.statusText}] ` +
      `URL: ${response.config.url} | Latencia: ${durationMs}ms`
    );

    // Retorna un objeto estructurado enriquecido
    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      durationMs: durationMs,
      data: response.data,
      headers: response.headers
    };
  },
  (error) => {
    // Normalización de errores de red o códigos HTTP de error
    let normalizedError = {
      success: false,
      status: null,
      message: 'Error desconocido de comunicación.',
      details: null,
      isNetworkError: false,
      isTimeout: false
    };

    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx (4xx, 5xx)
      normalizedError.status = error.response.status;
      normalizedError.statusText = error.response.statusText;
      normalizedError.details = error.response.data;

      switch (error.response.status) {
        case 400:
          normalizedError.message = 'Solicitud incorrecta (Bad Request). Verifique los datos enviados.';
          break;
        case 401:
          normalizedError.message = 'No autorizado (Unauthorized). La sesión ha expirado o el token es inválido.';
          break;
        case 403:
          normalizedError.message = 'Acceso prohibido (Forbidden). No tiene permisos para este recurso.';
          break;
        case 404:
          normalizedError.message = 'Recurso no encontrado (Not Found) en el servidor.';
          break;
        case 500:
          normalizedError.message = 'Error interno en el servidor remoto (Internal Server Error).';
          break;
        default:
          normalizedError.message = `Error HTTP ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      // Error de tiempo de espera (Timeout móvil)
      normalizedError.isTimeout = true;
      normalizedError.message = `Tiempo de espera agotado (${API_CONFIG.TIMEOUT_MS}ms). La red móvil es inestable.`;
    } else if (error.request) {
      // La petición fue enviada pero no se recibió respuesta (Sin internet / Servidor caído)
      normalizedError.isNetworkError = true;
      normalizedError.message = 'Fallo de conectividad de red. Compruebe la conexión Wi-Fi o datos móviles.';
    } else {
      normalizedError.message = error.message;
    }

    console.error(`[HTTP ERROR] [Status: ${normalizedError.status}] -> ${normalizedError.message}`);
    return Promise.reject(normalizedError);
  }
);

module.exports = apiClient;
