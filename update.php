<?php
// update.php — hardened, backward-compatible.
// Acciones: add_rating, add_comment. Mantiene el mismo contrato JSON de respuesta.

header('Content-Type: application/json');

// --- Config opcional ---
$config = [];
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    $loaded = include $configFile;
    if (is_array($loaded)) {
        $config = $loaded;
    }
}
$rateMax = isset($config['rate_limit_max']) ? max(1, (int)$config['rate_limit_max']) : 30;
$rateWindow = isset($config['rate_limit_window_seconds']) ? max(60, (int)$config['rate_limit_window_seconds']) : 600;

// --- Rate limiting sencillo por IP (fichero), fail-open si no se puede escribir ---
function rate_limit_ok($max, $window) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $dir = __DIR__ . '/backups';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $file = $dir . '/ratelimit-' . preg_replace('/[^a-zA-Z0-9_.-]/', '_', $ip) . '.json';
    $now = time();
    $hits = [];
    if (file_exists($file)) {
        $raw = @file_get_contents($file);
        $arr = json_decode((string)$raw, true);
        if (is_array($arr)) {
            $hits = $arr;
        }
    }
    $hits = array_values(array_filter($hits, function ($t) use ($now, $window) {
        return is_numeric($t) && ($now - (int)$t) < $window;
    }));
    if (count($hits) >= $max) {
        return false;
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
    return true;
}

if (!rate_limit_ok($rateMax, $rateWindow)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Demasiadas peticiones. Inténtalo de nuevo en unos minutos.']);
    exit;
}

// --- Funciones de ayuda ---

function get_projects() {
    if (!file_exists(__DIR__ . '/data.json')) {
        return null;
    }
    $json_data = file_get_contents(__DIR__ . '/data.json');
    if ($json_data === false) {
        return null;
    }
    $data = json_decode($json_data, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }
    return $data;
}

function save_projects($projects) {
    $tmp = __DIR__ . '/data.json.tmp';
    $ok = file_put_contents($tmp, json_encode($projects, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    if ($ok === false) {
        return false;
    }
    return @rename($tmp, __DIR__ . '/data.json');
}

function send_response($success, $message, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

function clean_text($s, $maxLen) {
    $s = is_string($s) ? $s : '';
    $s = strip_tags($s);
    $s = trim(preg_replace('/\s+/', ' ', $s));
    if (function_exists('mb_substr')) {
        return mb_substr($s, 0, $maxLen, 'UTF-8');
    }
    return substr($s, 0, $maxLen);
}

function valid_email($e) {
    $e = trim((string)$e);
    if (strlen($e) > 254) {
        return false;
    }
    return filter_var($e, FILTER_VALIDATE_EMAIL) !== false;
}

// --- Lógica Principal ---

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    send_response(false, 'Método no permitido.', 405);
}

$raw = file_get_contents('php://input');
$input = json_decode((string)$raw, true);

if (!$input || !isset($input['action'])) {
    send_response(false, 'Acción no válida.', 400);
}

$projects = get_projects();
if ($projects === null) {
    send_response(false, 'No se pudo leer el archivo de datos del proyecto.', 500);
}
if (!is_array($projects)) {
    send_response(false, 'Archivo de datos corrupto.', 500);
}

$action = $input['action'];
if ($action !== 'add_rating' && $action !== 'add_comment') {
    send_response(false, 'Acción no válida.', 400);
}

$project_id = isset($input['projectId']) ? trim((string)$input['projectId']) : '';
$item_id = isset($input['itemId']) ? trim((string)$input['itemId']) : '';
$user_email = isset($input['userEmail']) ? trim((string)$input['userEmail']) : '';

if ($project_id === '' || strlen($project_id) > 128 || $item_id === '' || strlen($item_id) > 256) {
    send_response(false, 'Faltan datos requeridos (projectId, itemId, userEmail).', 400);
}
if (!valid_email($user_email)) {
    send_response(false, 'Correo electrónico no válido.', 400);
}

// Buscar el proyecto
$project_index = -1;
foreach ($projects as $index => $p) {
    if (isset($p['id']) && $p['id'] === $project_id) {
        $project_index = $index;
        break;
    }
}

if ($project_index === -1) {
    send_response(false, 'Proyecto no encontrado.', 404);
}

// Buscar el ítem dentro del proyecto
$item_found = false;
$categories = ['chapters', 'characters', 'places', 'objects'];

foreach ($categories as $category) {
    if (isset($projects[$project_index][$category]) && is_array($projects[$project_index][$category])) {
        foreach ($projects[$project_index][$category] as $item_idx => &$item) {
            if (!is_array($item)) {
                continue;
            }
            $current_item_id = $item['id'] ?? $project_id . '-' . $category . '-' . $item_idx;
            if ($current_item_id === $item_id) {

                if ($action === 'add_rating') {
                    $rating = $input['rating'] ?? null;
                    if ($rating === null || !is_numeric($rating) || (int)$rating < 1 || (int)$rating > 5) {
                        send_response(false, 'Calificación no válida.', 400);
                    }

                    if (!isset($item['ratings']) || !is_array($item['ratings'])) {
                        $item['ratings'] = [];
                    }

                    // Verificar si el usuario ya calificó este ítem (soporta formato
                    // antiguo [5,4] y nuevo [{userEmail, rating}]).
                    foreach ($item['ratings'] as $r) {
                        if (is_array($r) && isset($r['userEmail']) && $r['userEmail'] === $user_email) {
                            send_response(false, 'Ya has calificado este elemento.');
                        }
                    }

                    $item['ratings'][] = ['userEmail' => $user_email, 'rating' => (int)$rating];
                    $item_found = true;
                    break 2;

                } elseif ($action === 'add_comment') {
                    $message = clean_text($input['message'] ?? '', 2000);
                    $timestamp = $input['timestamp'] ?? (time() * 1000);
                    $timestamp = is_numeric($timestamp) ? (int)$timestamp : (time() * 1000);

                    if ($message === '') {
                        send_response(false, 'El mensaje del comentario no puede estar vacío.', 400);
                    }

                    if (!isset($projects[$project_index]['comments']) || !is_array($projects[$project_index]['comments'])) {
                        $projects[$project_index]['comments'] = [];
                    }

                    // Evitar doble comentario del mismo usuario en el mismo ítem.
                    foreach ($projects[$project_index]['comments'] as $c) {
                        if (is_array($c)
                            && ($c['itemId'] ?? null) === $item_id
                            && ($c['userEmail'] ?? null) === $user_email) {
                            send_response(false, 'Ya has comentado este elemento.');
                        }
                    }

                    $projects[$project_index]['comments'][] = [
                        'itemId' => $item_id,
                        'userEmail' => $user_email,
                        'message' => $message,
                        'timestamp' => $timestamp
                    ];
                    $item_found = true;
                    break 2;
                }
            }
        }
        unset($item);
    }
}

if ($item_found) {
    if (save_projects($projects)) {
        send_response(true, 'Acción completada con éxito.');
    } else {
        send_response(false, 'Error al guardar los datos del proyecto.', 500);
    }
} else {
    send_response(false, 'Ítem no encontrado.', 404);
}
