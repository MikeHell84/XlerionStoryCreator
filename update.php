<?php
header('Content-Type: application/json');

// --- Función para encontrar un ítem por su ID dentro de un proyecto ---
function find_item_by_id(&$project, $itemId) {
    $categories = ['chapters', 'characters', 'places', 'objects'];
    foreach ($categories as $category) {
        if (isset($project[$category])) {
            foreach ($project[$category] as $index => &$item) {
                // Generar un ID consistente si no existe
                $currentItemId = isset($item['id']) ? $item['id'] : ($project['id'] . '-' . $category . '-' . $index);
                if ($currentItemId === $itemId) {
                    return $item;
                }
            }
        }
    }
    return null;
}

$response = ['success' => false, 'message' => 'Acción no válida.'];
$data_file = 'data.json';

// Leer el cuerpo de la solicitud
$input = json_decode(file_get_contents('php://input'), true);

if ($input && isset($input['action'])) {
    $fp = null;
    try {
        // --- Bloquear el archivo para evitar condiciones de carrera ---
        $fp = fopen($data_file, 'r+');
        if (!$fp || !flock($fp, LOCK_EX)) {
            throw new Exception('No se pudo obtener acceso exclusivo al archivo de datos. Inténtalo de nuevo.');
        }

        $file_size = filesize($data_file);
        $projects = [];

        if ($file_size > 0) {
            $projects_json = fread($fp, $file_size);
            $projects = json_decode($projects_json, true);
            // Validar que el JSON es un array
            if (!is_array($projects)) {
                throw new Exception('El archivo data.json está corrupto o no tiene el formato esperado (debe ser un array).');
            }
        }

        $action = $input['action'];
        $itemId = $input['itemId'];
        $userEmail = $input['userEmail'];

        $item_found = false;

        // --- Buscar el ítem en todos los proyectos ---
        foreach ($projects as &$project) {
            // Asegurarse de que el proyecto es un array antes de buscar
            if (!is_array($project)) continue;

            $item = find_item_by_id($project, $itemId);
            if ($item !== null) {
                if ($action === 'add_rating') {
                    $rating = $input['rating'];
                    if (!isset($item['ratings'])) {
                        $item['ratings'] = [];
                    }

                    // Comprobar si el usuario ya ha calificado este ítem
                    $already_rated = false;
                    foreach ($item['ratings'] as $r) {
                        if (isset($r['userEmail']) && $r['userEmail'] === $userEmail) {
                            $already_rated = true;
                            break;
                        }
                    }

                    if ($already_rated) {
                        $response['message'] = 'Ya has calificado este ítem.';
                    } else {
                        $item['ratings'][] = ['userEmail' => $userEmail, 'rating' => (int)$rating];
                        $response = ['success' => true, 'message' => 'Calificación guardada.'];
                    }
                } elseif ($action === 'add_comment') {
                    $message = $input['message'];
                    if (!isset($project['comments'])) {
                        $project['comments'] = [];
                    }

                    // Comprobar si el usuario ya ha comentado en este ítem específico
                    $already_commented = false;
                    foreach ($project['comments'] as $c) {
                        if (isset($c['itemId'], $c['userEmail']) && $c['itemId'] === $itemId && $c['userEmail'] === $userEmail) {
                            $already_commented = true;
                            break;
                        }
                    }

                    if ($already_commented) {
                        $response['message'] = 'Ya has comentado en este ítem.';
                    } else {
                        // Sanitizar el mensaje para evitar problemas de seguridad básicos
                        $sanitized_message = htmlspecialchars(strip_tags($message));
                        $project['comments'][] = [
                            'itemId' => $itemId,
                            'userEmail' => $userEmail,
                            'message' => $sanitized_message,
                            'timestamp' => $input['timestamp']
                        ];
                        $response = ['success' => true, 'message' => 'Comentario guardado.'];
                    }
                }
                $item_found = true;
                break; // Salir del bucle de proyectos una vez que se encuentra y procesa el ítem
            }
        }

        if (!$item_found) {
            $response['message'] = 'El ítem especificado no fue encontrado en ningún proyecto.';
        }

        // --- Guardar los cambios en el archivo solo si la operación fue exitosa ---
        if ($response['success']) {
            // Volver al inicio del archivo para sobrescribir
            rewind($fp);
            // Truncar el archivo al tamaño actual de los datos a escribir
            ftruncate($fp, 0);
            fwrite($fp, json_encode($projects, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
    } catch (Exception $e) {
        // Capturar cualquier error y establecer un mensaje de respuesta
        http_response_code(500); // Internal Server Error
        $response = ['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()];
    } finally {
        // Asegurarse de que el bloqueo siempre se libere y el archivo se cierre
        if ($fp) {
            flock($fp, LOCK_UN); // Liberar el bloqueo
            fclose($fp);
        }
    }
}

echo json_encode($response);
?>