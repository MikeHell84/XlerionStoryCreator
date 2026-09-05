<?php
// publish.php — hardened, backward-compatible.
// Publica proyectos sobrescribiendo data.json con validación, backup y token opcional.

header('Content-Type: application/json');

// 0. Cargar config opcional (si no existe, modo compatible sin token).
$config = [];
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    $loaded = include $configFile;
    if (is_array($loaded)) {
        $config = $loaded;
    }
}
$requiredToken = isset($config['publish_token']) ? trim((string)$config['publish_token']) : '';
$maxBytes = isset($config['publish_max_bytes']) ? (int)$config['publish_max_bytes'] : (60 * 1024 * 1024);

// 1. Solo POST.
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido. Solo se aceptan peticiones POST.']);
    exit;
}

// 2. Token opcional: solo se exige si config.php define uno no vacío.
//    Se acepta vía header X-Publish-Token o campo JSON "token" (no se guarda).
$headers = function_exists('getallheaders') ? getallheaders() : [];
$headerToken = '';
foreach ($headers as $k => $v) {
    if (strtolower((string)$k) === 'x-publish-token') {
        $headerToken = trim((string)$v);
        break;
    }
}

$json_data = file_get_contents('php://input');
if ($json_data === false || $json_data === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Cuerpo de petición vacío.']);
    exit;
}

if (strlen($json_data) > $maxBytes) {
    http_response_code(413);
    echo json_encode(['success' => false, 'message' => 'Payload demasiado grande.']);
    exit;
}

$projects = json_decode($json_data, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'JSON inválido: ' . json_last_error_msg()]);
    exit;
}

// Formatos aceptados (compatibles hacia atrás):
//   - Antiguo: [...] (array directo de proyectos)
//   - Nuevo: { "token": "...", "projects": [...], "theme": {...} }
//     El campo "theme" es opcional y se guarda como theme.json para que la
//     página pública aplique el diseño configurado en el panel.
$bodyToken = '';
$theme = null;
if (is_array($projects) && array_key_exists('projects', $projects)) {
    if (array_key_exists('token', $projects)) {
        $bodyToken = trim((string)$projects['token']);
    }
    if (array_key_exists('theme', $projects) && is_array($projects['theme'])) {
        $theme = $projects['theme'];
    }
    $projects = $projects['projects'];
}

if ($requiredToken !== '') {
    $provided = $headerToken !== '' ? $headerToken : $bodyToken;
    if (!hash_equals($requiredToken, $provided)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No autorizado. Token de publicación inválido.']);
        exit;
    }
}

if (!is_array($projects)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos inválidos. Se esperaba un array de proyectos en formato JSON.']);
    exit;
}

// 3. Validación estructural ligera (no rechaza campos extra para no romper).
if (count($projects) > 500) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Demasiados proyectos (máx. 500).']);
    exit;
}
foreach ($projects as $i => $p) {
    if (!is_array($p)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Proyecto #$i inválido: se esperaba un objeto."]);
        exit;
    }
    if (!isset($p['name']) || !is_string($p['name']) || trim($p['name']) === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Proyecto #$i sin nombre válido."]);
        exit;
    }
    foreach (['chapters', 'characters', 'places', 'objects'] as $cat) {
        if (isset($p[$cat]) && !is_array($p[$cat])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Proyecto #$i: '$cat' debe ser un array."]);
            exit;
        }
    }
}

// 4. Backup del data.json anterior (conserva las últimas 5 copias).
$file_path = __DIR__ . '/data.json';
if (file_exists($file_path)) {
    $backupDir = __DIR__ . '/backups';
    if (!is_dir($backupDir)) {
        @mkdir($backupDir, 0755, true);
    }
    if (is_dir($backupDir)) {
        @copy($file_path, $backupDir . '/data-' . date('Ymd-His') . '.json');
        $old = glob($backupDir . '/data-*.json');
        if (is_array($old) && count($old) > 5) {
            sort($old);
            foreach (array_slice($old, 0, count($old) - 5) as $f) {
                @unlink($f);
            }
        }
    }
}

// 5. Escritura atómica con bloqueo exclusivo.
$json_to_write = json_encode($projects, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
if ($json_to_write === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al codificar JSON.']);
    exit;
}

$tmp = $file_path . '.tmp';
if (file_put_contents($tmp, $json_to_write, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al escribir en el archivo data.json. Verifica los permisos del servidor.']);
    exit;
}
if (!@rename($tmp, $file_path)) {
    @unlink($tmp);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al reemplazar data.json.']);
    exit;
}

// 6. Tema opcional para la página pública (no falla la publicación si no se puede guardar).
$themeSaved = false;
if (is_array($theme)) {
    $theme['updatedAt'] = time();
    $themePath = __DIR__ . '/theme.json';
    $themeTmp = $themePath . '.tmp';
    if (file_put_contents($themeTmp, json_encode($theme, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false) {
        if (@rename($themeTmp, $themePath)) {
            $themeSaved = true;
        } else {
            @unlink($themeTmp);
        }
    }
}

echo json_encode(['success' => true, 'message' => 'data.json actualizado correctamente.', 'themeSaved' => $themeSaved]);
