# Cerberus IA — Compilar APK desde un móvil

## Método recomendado: GitHub Actions

1. Crea un repositorio nuevo en GitHub llamado `Cerberus-IA`.
2. Sube TODOS los archivos de esta carpeta al repositorio.
3. En GitHub abre la pestaña **Actions**.
4. Selecciona **Construir APK de Cerberus IA**.
5. Pulsa **Run workflow** si no se inició automáticamente.
6. Espera a que termine el trabajo.
7. En la ejecución terminada, abre **Artifacts** y descarga `Cerberus-IA-APK`.
8. Dentro del ZIP estará `app-debug.apk`.

GitHub Actions permite conservar archivos generados por un flujo como artefactos descargables.

## Importante

Este proyecto es una base Capacitor para Android. Capacitor convierte una aplicación web en una aplicación móvil y permite añadir funciones nativas posteriormente.

La versión actual NO incluye todavía:
- una API de IA real;
- generación de imágenes;
- generación de vídeo;
- automatización completa de TikTok;
- creador de aplicaciones;
- firma de APK para distribución en Google Play.

Esos módulos pueden añadirse después sin cambiar el método de compilación.
