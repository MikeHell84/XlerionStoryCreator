<?php
// publish.php

// 1. Configuración de seguridad básica
header('Content-Type: application/json');

// Solo permitir peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Método no permitido. Solo se aceptan peticiones POST.']);
    exit;
}

// 2. Recibir y decodificar los datos
$json_data = file_get_contents('php://input');
$projects = json_decode($json_data);

// Validar que los datos recibidos son un JSON válido y un array
if (json_last_error() !== JSON_ERROR_NONE || !is_array($projects)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Datos inválidos. Se esperaba un array de proyectos en formato JSON.']);
    exit;
}

// 3. Escribir los datos en data.json
$file_path = 'data.json';
$json_to_write = json_encode($projects, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

if (file_put_contents($file_path, $json_to_write) !== false) {
    // Éxito
    echo json_encode(['success' => true, 'message' => 'data.json actualizado correctamente.']);
} else {
    // Error de escritura
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Error al escribir en el archivo data.json. Verifica los permisos del servidor.']);
}
?>
