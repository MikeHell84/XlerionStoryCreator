<?php
// icon.php — Sube una imagen y regenera el set completo de iconos del sitio:
// favicon.ico (16/32/48), icons/favicon-32x32.png, icons/apple-touch-icon.png
// (180), icons/icon-192x192.png e icons/icon-512x512.png.
// POST multipart con campo "icon" (PNG/JPG/WebP cuadrado, máx. 5 MB).
// Requiere la extensión GD de PHP.

header('Content-Type: application/json');

function fail($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $msg]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    fail('Método no permitido. Solo POST.', 405);
}
if (!function_exists('imagecreatetruecolor')) {
    fail('Este PHP no tiene la extensión GD activada (php.ini: extension=gd).', 500);
}
if (!isset($_FILES['icon']) || $_FILES['icon']['error'] !== UPLOAD_ERR_OK) {
    fail('No se recibió ningún archivo válido (campo "icon").');
}

$tmp = $_FILES['icon']['tmp_name'];
if (filesize($tmp) > 5 * 1024 * 1024) {
    fail('La imagen supera los 5 MB.');
}
$info = @getimagesize($tmp);
if ($info === false || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
    fail('Formato no soportado. Usa PNG, JPG o WebP.');
}
if (min($info[0], $info[1]) < 256) {
    fail('La imagen es muy pequeña (mínimo 256×256).');
}

switch ($info[2]) {
    case IMAGETYPE_JPEG: $src = imagecreatefromjpeg($tmp); break;
    case IMAGETYPE_PNG: $src = imagecreatefrompng($tmp); break;
    case IMAGETYPE_WEBP: $src = imagecreatefromwebp($tmp); break;
    default: $src = false;
}
if (!$src) fail('No se pudo leer la imagen.');

$sw = imagesx($src); $sh = imagesy($src);
$side = min($sw, $sh);
$sx = (int)(($sw - $side) / 2); $sy = (int)(($sh - $side) / 2);
$out = __DIR__;

function icon_resized($src, $sx, $sy, $side, $size) {
    $dst = imagecreatetruecolor($size, $size);
    imagecopyresampled($dst, $src, 0, 0, $sx, $sy, $size, $size, $side, $side);
    return $dst;
}

$made = [];
$targets = [
    'icons/icon-512x512.png' => 512,
    'icons/icon-192x192.png' => 192,
    'icons/apple-touch-icon.png' => 180,
    'icons/favicon-32x32.png' => 32,
];
foreach ($targets as $rel => $size) {
    $im = icon_resized($src, $sx, $sy, $side, $size);
    if (!imagepng($im, $out . '/' . $rel, 6)) { imagedestroy($im); imagedestroy($src); fail("No se pudo escribir {$rel}. Revisa permisos.", 500); }
    imagedestroy($im);
    $made[] = $rel;
}

// favicon.ico multi-tamaño (16/32/48, BMP 32bpp)
$sizes = [16, 32, 48];
$entries = ''; $blobs = '';
$offset = 6 + 16 * count($sizes);
foreach ($sizes as $size) {
    $im = icon_resized($src, $sx, $sy, $side, $size);
    $px = '';
    for ($y = $size - 1; $y >= 0; $y--) {
        for ($x = 0; $x < $size; $x++) {
            $c = imagecolorat($im, $x, $y);
            $px .= chr(($c >> 16) & 0xFF) . chr(($c >> 8) & 0xFF) . chr($c & 0xFF) . chr(0xFF);
        }
    }
    imagedestroy($im);
    $rowAnd = (int)(($size + 31) / 32) * 4;
    $andMask = str_repeat("\x00", $rowAnd * $size);
    $blob = pack('V', 40) . pack('V', $size) . pack('V', $size * 2) . pack('v', 1) . pack('v', 32)
        . pack('V', 0) . pack('V', 0) . pack('V', 0) . pack('V', 0) . pack('V', 0) . pack('V', 0)
        . $px . $andMask;
    $entries .= chr($size) . chr($size) . "\x00\x00\x01\x00\x20\x00" . pack('V', strlen($blob)) . pack('V', $offset);
    $offset += strlen($blob);
    $blobs .= $blob;
}
if (file_put_contents($out . '/favicon.ico', pack('v', 0) . pack('v', 1) . pack('v', count($sizes)) . $entries . $blobs, LOCK_EX) === false) {
    imagedestroy($src);
    fail('No se pudo escribir favicon.ico. Revisa permisos.', 500);
}
$made[] = 'favicon.ico';
imagedestroy($src);

echo json_encode(['success' => true, 'message' => 'Iconos regenerados.', 'files' => $made]);
