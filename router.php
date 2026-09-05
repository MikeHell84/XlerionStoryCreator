<?php
// router.php — Router para el servidor de desarrollo PHP (php -S).
// Uso: php -S localhost:5173 router.php
// Bloquea archivos sensibles (.env, config.php, backups, temporales)
// que el servidor empotrado de PHP serviría como texto plano
// (no respeta .htaccess). El resto se sirve con normalidad.

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

// settings.json (claves de IA) solo existe para el propio servidor local.
$isLocal = ($_SERVER['REMOTE_ADDR'] ?? '') === '127.0.0.1' || ($_SERVER['REMOTE_ADDR'] ?? '') === '::1';
if (preg_match('#(^|/)settings\.json$#i', $path) && !$isLocal) {
    http_response_code(404);
    header('Content-Type: text/plain');
    echo 'Not found.';
    return true;
}

// Rutas/archivos que jamás deben exponerse por web.
if (
    preg_match('#(^|/)\.env($|\.)#i', $path)
    || preg_match('#(^|/)config\.php$#i', $path)
    || preg_match('#(^|/)backups/#i', $path)
    || preg_match('#\.(tmp|log)$#i', $path)
) {
    http_response_code(404);
    header('Content-Type: text/plain');
    echo 'Not found.';
    return true; // Petición manejada: no servir el archivo.
}

// Cualquier otro recurso: comportamiento por defecto de php -S.
return false;
