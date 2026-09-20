/**
 * ============================================================================
 * MODULO: Servicio de Gestión de Productos (productService.js)
 * ASIGNATURA: Desarrollo de Aplicaciones Móviles
 * TUTOR: Ing. Luis Calo
 * ============================================================================
 * DESCRIPCIÓN:
 * Capa de servicio encargada de orquestar las operaciones REST (CRUD) sobre
 * el recurso 'products' utilizando el cliente Axios previamente configurado.
 * Implementa métodos asíncronos con manejo de promesas (async/await).
 */

const apiClient = require('./apiClient');

const productService = {
  /**
   * 1. GET: Obtener lista de productos con límite opcional
   * @param {number} limit - Cantidad máxima de registros
   * @returns {Promise<Array>} Lista de productos
   */
  async getProducts(limit = 10) {
    try {
      const response = await apiClient.get('/products', {
        params: { limit }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 2. GET: Obtener un producto por su ID
   * @param {number|string} id - Identificador único del producto
   * @returns {Promise<Object>} Datos del producto
   */
  async getProductById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 3. GET: Obtener categorías disponibles
   * @returns {Promise<Array>} Lista de categorías
   */
  async getCategories() {
    try {
      const response = await apiClient.get('/products/categories');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 4. GET: Filtrar productos por categoría
   * @param {string} category - Nombre de la categoría
   * @returns {Promise<Array>} Productos de la categoría
   */
  async getProductsByCategory(category) {
    try {
      const response = await apiClient.get(`/products/category/${encodeURIComponent(category)}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 5. POST: Crear un nuevo producto en el catálogo
   * @param {Object} productData - Datos del nuevo producto
   * @returns {Promise<Object>} Objeto creado con ID generado
   */
  async createProduct(productData) {
    try {
      const payload = {
        title: productData.title,
        price: parseFloat(productData.price),
        description: productData.description || 'Producto registrado desde la aplicación móvil',
        image: productData.image || 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
        category: productData.category || 'electronics'
      };

      const response = await apiClient.post('/products', payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 6. PUT: Actualizar un producto existente
   * @param {number|string} id - Identificador del producto
   * @param {Object} updatedFields - Campos a actualizar
   * @returns {Promise<Object>} Objeto actualizado
   */
  async updateProduct(id, updatedFields) {
    try {
      const response = await apiClient.put(`/products/${id}`, updatedFields);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 7. DELETE: Eliminar un producto del servidor
   * @param {number|string} id - Identificador del producto a suprimir
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = productService;
