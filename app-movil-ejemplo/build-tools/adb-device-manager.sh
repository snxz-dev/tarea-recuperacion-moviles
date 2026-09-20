#!/bin/bash
# ==============================================================================
# SCRIPT: adb-device-manager.sh
# ASIGNATURA: Desarrollo de Aplicaciones Móviles | Tutor: Ing. Luis Calo
# OBJETIVO: Gestión y depuración en dispositivos reales y virtuales (AVD) vía ADB.
# ==============================================================================

echo "========================================================================"
echo " GESTOR DE DISPOSITIVOS ANDROID (REALES Y VIRTUALES - AVD)"
echo "========================================================================"

echo "1. Listando dispositivos conectados mediante Android Debug Bridge (ADB)..."
echo "   Comando: adb devices -l"
if command -v adb >/dev/null 2>&1; then
    adb devices -l
else
    echo "   [SIMULACIÓN DE ENTORNO ADB]"
    echo "   List of devices attached:"
    echo "   emulator-5554          device product:sdk_gphone64_x86_64 model:Pixel_7_Pro_API_34 device:emu64x"
    echo "   988a1b3248444a4758     device usb:1-1 product:redfin model:Pixel_5 device:redfin"
fi

echo ""
echo "2. Guía de Comandos Clave para el Desarrollador:"
echo "   - Iniciar Emulador AVD desde CLI:"
echo "     $ emulator -avd Pixel_7_API_34 -netdelay none -netspeed full"
echo ""
echo "   - Instalar APK en Emulador específico:"
echo "     $ adb -s emulator-5554 install -r ./dist-apk/MobileStore-Release-Signed.apk"
echo ""
echo "   - Instalar APK en Dispositivo Real físico:"
echo "     $ adb -d install -r ./dist-apk/MobileStore-Release-Signed.apk"
echo ""
echo "   - Conexión y depuración inalámbrica (ADB over Wi-Fi en Dispositivo Real):"
echo "     $ adb tcpip 5555"
echo "     $ adb connect 192.168.1.105:5555"
echo ""
echo "   - Inspección de logs en tiempo real filtrados por aplicación:"
echo "     $ adb logcat -s MobileStoreApp:V *:E"
echo "========================================================================"
