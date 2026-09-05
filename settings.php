<?php
// settings.php — Respaldo de ajustes del CMS en el servidor.
// Permite que la configuración y las API keys sobrevivan a cambios de
// puerto (cada puerto es un origen distinto en el navegador), a otros
// navegadores y a limpiezas de caché.
//
// Seguridad: SOLO responde a localhost (127.0.0.1 / ::1). Desde cualquier
// otra IP devuelve 404, igual que si no existiera.
// Además settings.json está bloqueado en .htaccess y router.php.

header('Content-Type: application/json');

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if ($ip !== '127.0.0.1' && $ip !== '::1') {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Not found.']);
    exit;
}

$file = __DIR__ . '/settings.json';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    if (!file_exists($file)) {
        echo json_encode(['success' => true, 'settings' => null]);
        exit;
    }
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        echo json_encode(['success' => true, 'settings' => null]);
        exit;
    }
    echo json_encode(['success' => true, 'settings' => $data]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$settings = (is_array($input) && isset($input['settings']) && is_array($input['settings']))
    ? $input['settings']
    : null;

if (!$settings || !isset($settings['ai']) || !is_array($settings['ai'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ajustes inválidos.']);
    exit;
}

// Guardado atómico. El JSON se valida de forma ligera: secciones esperadas.
$allowed = ['version', 'general', 'theme', 'ai', 'github', 'updatedAt'];
$settings = array_intersect_key($settings, array_flip($allowed));
$settings['serverSavedAt'] = time();

$tmp = $file . '.tmp';
if (file_put_contents($tmp, json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) === false
    || !@rename($tmp, $file)) {
    @unlink($tmp);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'No se pudo guardar.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Ajustes respaldados.']);
