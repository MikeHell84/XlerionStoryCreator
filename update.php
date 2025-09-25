<?php
header('Content-Type: application/json');

// --- Funciones de Ayuda ---

/**
 * Lee y decodifica el archivo data.json.
 * @return array|null Los proyectos o null si hay un error.
 */
function get_projects() {
    if (!file_exists('data.json')) {
        return null;
    }
    $json_data = file_get_contents('data.json');
    return json_decode($json_data, true);
}

/**
 * Guarda los proyectos en el archivo data.json.
 * @param array $projects El array de proyectos a guardar.
 * @return bool True si se guardó con éxito, false en caso contrario.
 */
function save_projects($projects) {
    // JSON_PRETTY_PRINT para que el archivo sea legible
    return file_put_contents('data.json', json_encode($projects, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
}

/**
 * Envía una respuesta JSON y termina el script.
 * @param bool $success
 * @param string $message
 * @param int $status_code (Opcional) Código de estado HTTP.
 */
function send_response($success, $message, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// --- Lógica Principal ---

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    send_response(false, 'Acción no válida.', 400);
}

$projects = get_projects();
if ($projects === null) {
    send_response(false, 'No se pudo leer el archivo de datos del proyecto.', 500);
}

$action = $input['action'];
$project_id = $input['projectId'] ?? null;
$item_id = $input['itemId'] ?? null;
$user_email = $input['userEmail'] ?? null;

if (!$project_id || !$item_id || !$user_email) {
    send_response(false, 'Faltan datos requeridos (projectId, itemId, userEmail).', 400);
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
    if (isset($projects[$project_index][$category])) {
        foreach ($projects[$project_index][$category] as $item_idx => &$item) {
            // Generar un ID consistente si no existe
            $current_item_id = $item['id'] ?? $project_id . '-' . $category . '-' . $item_idx;
            if ($current_item_id === $item_id) {
                
                if ($action === 'add_rating') {
                    $rating = $input['rating'] ?? null;
                    if ($rating === null || !is_numeric($rating) || $rating < 1 || $rating > 5) {
                        send_response(false, 'Calificación no válida.', 400);
                    }

                    if (!isset($item['ratings'])) $item['ratings'] = [];

                    // Verificar si el usuario ya calificó este ítem
                    foreach ($item['ratings'] as $r) {
                        if ($r['userEmail'] === $user_email) {
                            send_response(false, 'Ya has calificado este elemento.');
                        }
                    }

                    // Añadir la nueva calificación
                    $item['ratings'][] = ['userEmail' => $user_email, 'rating' => (int)$rating];
                    $item_found = true;
                    break 2; // Salir de ambos bucles foreach

                } elseif ($action === 'add_comment') {
                    $message = $input['message'] ?? null;
                    $timestamp = $input['timestamp'] ?? time() * 1000;

                    if (!$message || trim($message) === '') {
                        send_response(false, 'El mensaje del comentario no puede estar vacío.', 400);
                    }

                    if (!isset($projects[$project_index]['comments'])) $projects[$project_index]['comments'] = [];

                    // Añadir el nuevo comentario al array de comentarios del proyecto
                    $projects[$project_index]['comments'][] = [
                        'itemId' => $item_id,
                        'userEmail' => $user_email,
                        'message' => $message,
                        'timestamp' => $timestamp
                    ];
                    $item_found = true;
                    break 2; // Salir de ambos bucles foreach
                }
            }
        }
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

?>