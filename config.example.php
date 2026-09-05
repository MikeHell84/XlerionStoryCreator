<?php
// config.php — OPCIONAL. Copia este archivo como "config.php" y ajusta los valores.
// Si "config.php" no existe, la app sigue funcionando igual que antes (modo compatible).
// Esto es intencional para no romper instalaciones existentes.

return [
    // Token compartido para publish.php. Si se define (no vacío), publish.php lo exige
    // vía header HTTP "X-Publish-Token" o campo JSON "token".
    // Genera uno con: php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
    'publish_token' => '',

    // Límite de peticiones para update.php (ventana deslizante sencilla basada en ficheros).
    // Ej: máximo 30 acciones por IP cada 10 minutos.
    'rate_limit_max' => 30,
    'rate_limit_window_seconds' => 600,

    // Tamaño máximo aceptado en publish.php (en bytes). Por defecto 60 MB
    // (data.json con imágenes base64 puede ser pesado).
    'publish_max_bytes' => 60 * 1024 * 1024,

    // Despliegue a GitHub Pages (deploy.php). También puedes definirlos
    // en el .env como GITHUB_TOKEN / GITHUB_REPO / GITHUB_BRANCH
    // (el .env tiene prioridad). El token NUNCA se expone al navegador.
    'github_token' => '',
    'github_repo' => 'miguelxlerion/XlerionStoryCreator',
    'github_branch' => 'main',
    // Solo para PHP locales con SSL roto (Windows/XAMPP sin cacert).
    // En producción déjalo en true. Riesgo: desactiva la verificación
    // del certificado de api.github.com.
    'github_verify_ssl' => true,
];
