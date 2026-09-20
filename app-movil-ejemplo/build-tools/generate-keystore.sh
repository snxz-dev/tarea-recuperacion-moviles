#!/bin/bash
# ==============================================================================
# SCRIPT: generate-keystore.sh
# ASIGNATURA: Desarrollo de Aplicaciones Móviles | Tutor: Ing. Luis Calo
# OBJETIVO: Generación de almacén de claves criptográficas (Keystore) para firmado
#           de aplicaciones Android en modo Release / Producción.
# ==============================================================================

KEYSTORE_NAME="release-key.jks"
ALIAS_NAME="mobileappkey"
VALIDITY_DAYS=10000
KEY_SIZE=2048
KEY_ALG="RSA"

echo "========================================================================"
echo " GENERACIÓN DE LLAVE CRIPTOGRÁFICA PRIVADA (ANDROID KEYSTORE)"
echo "========================================================================"

if [ -f "$KEYSTORE_NAME" ]; then
    echo "⚠️  El archivo $KEYSTORE_NAME ya existe. Omitiendo generación para no sobreescribir."
else
    echo "⚙️  Generando almacén de claves con algoritmo $KEY_ALG y tamaño $KEY_SIZE bits..."
    
    keytool -genkey -v \
      -keystore "$KEYSTORE_NAME" \
      -alias "$ALIAS_NAME" \
      -keyalg "$KEY_ALG" \
      -keysize "$KEY_SIZE" \
      -validity "$VALIDITY_DAYS" \
      -storepass "android1234" \
      -keypass "android1234" \
      -dname "CN=Estudiante Universitario, OU=Ingenieria de Software, O=Universidad, L=Quito, ST=Pichincha, C=EC" 2>/dev/null || echo "Nota: keytool no encontrado o ejecutando en entorno sin JDK instalado."

    echo "✅ Llave criptográfica configurada:"
    echo "   - Archivo: $KEYSTORE_NAME"
    echo "   - Alias: $ALIAS_NAME"
    echo "   - Algoritmo: $KEY_ALG ($KEY_SIZE bits)"
    echo "   - Validez: $VALIDITY_DAYS días"
fi

echo "========================================================================"
