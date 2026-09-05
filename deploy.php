<?php
// deploy.php — Despliegue a GitHub Pages vía Contents API.
// POST JSON: { "action": "test" | "publish", "repo"?: "owner/repo", "branch"?: "main" }
// El token (GITHUB_TOKEN) vive SOLO en el servidor (.env, config.php o
// variable de entorno) y NUNCA se devuelve en las respuestas.

header('Content-Type: application/json');

function send($success, $message, $data = [], $code = 200) {
    http_response_code($code);
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $data));
    exit;
}

// --- Cargar secretos del servidor ---
function load_dotenv($file) {
    $out = [];
    if (!file_exists($file)) return $out;
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        $pos = strpos($line, '=');
        if ($pos === false) continue;
        $k = trim(substr($line, 0, $pos));
        $v = trim(substr($line, $pos + 1));
        if (strlen($v) >= 2 && (($v[0] === '"' && substr($v, -1) === '"') || ($v[0] === "'" && substr($v, -1) === "'"))) {
            $v = substr($v, 1, -1);
        }
        $out[$k] = $v;
    }
    return $out;
}

$env = load_dotenv(__DIR__ . '/.env');
$cfg = [];
if (file_exists(__DIR__ . '/config.php')) {
    $loaded = include __DIR__ . '/config.php';
    if (is_array($loaded)) $cfg = $loaded;
}

$token = getenv('GITHUB_TOKEN');
if (!$token && isset($env['GITHUB_TOKEN'])) $token = trim($env['GITHUB_TOKEN']);
if (!$token && isset($cfg['github_token'])) $token = trim($cfg['github_token']);
$defaultRepo = getenv('GITHUB_REPO');
if (!$defaultRepo && isset($env['GITHUB_REPO'])) $defaultRepo = trim($env['GITHUB_REPO']);
if (!$defaultRepo && isset($cfg['github_repo'])) $defaultRepo = trim($cfg['github_repo']);
if (!$defaultRepo) $defaultRepo = 'miguelxlerion/TotalDarkness';
$defaultBranch = getenv('GITHUB_BRANCH');
if (!$defaultBranch && isset($env['GITHUB_BRANCH'])) $defaultBranch = trim($env['GITHUB_BRANCH']);
if (!$defaultBranch && isset($cfg['github_branch'])) $defaultBranch = trim($cfg['github_branch']);
if (!$defaultBranch) $defaultBranch = 'main';

// --- Puerta opcional: mismo token de publicación que publish.php ---
$requiredPublish = isset($cfg['publish_token']) ? trim((string)$cfg['publish_token']) : '';
if ($requiredPublish !== '') {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $provided = '';
    foreach ($headers as $k => $v) {
        if (strtolower((string)$k) === 'x-publish-token') { $provided = trim((string)$v); break; }
    }
    if (!hash_equals($requiredPublish, $provided)) {
        send(false, 'No autorizado.', [], 401);
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    send(false, 'Método no permitido. Solo POST.', [], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) $input = [];
$action = $input['action'] ?? '';
$repo = isset($input['repo']) ? trim((string)$input['repo']) : $defaultRepo;
$branch = isset($input['branch']) ? trim((string)$input['branch']) : $defaultBranch;

if (!preg_match('#^[\w.-]+/[\w.-]+$#', $repo)) {
    send(false, 'Repositorio inválido. Usa el formato "propietario/repo".', [], 400);
}
if (!preg_match('#^[\w./-]+$#', $branch)) {
    send(false, 'Rama inválida.', [], 400);
}
if ($action !== 'test' && $action !== 'publish' && $action !== 'save_token' && $action !== 'token_status') {
    send(false, 'Acción no válida. Usa "test", "publish", "save_token" o "token_status".', [], 400);
}

// --- action=token_status: barato, sin llamar a GitHub ---
if ($action === 'token_status') {
    send(true, $token ? 'Token configurado.' : 'Sin token.', ['token_configured' => (bool)$token]);
}

// --- action=save_token: guarda el token en el .env del servidor ---
// El token nunca se devuelve. Vacío = borrarlo.
if ($action === 'save_token') {
    $newToken = isset($input['token']) ? trim((string)$input['token']) : '';
    if ($newToken !== '' && (!preg_match('#^[A-Za-z0-9_]+$#', $newToken) || strlen($newToken) < 20 || strlen($newToken) > 255)) {
        send(false, 'Token con formato inválido. Pega el token tal como lo genera GitHub.', [], 400);
    }
    $envFile = __DIR__ . '/.env';
    $lines = file_exists($envFile) ? file($envFile, FILE_IGNORE_NEW_LINES) : [];
    if ($lines === false) $lines = [];
    $found = false;
    foreach ($lines as $i => $line) {
        if (preg_match('#^\s*GITHUB_TOKEN\s*=#', $line)) {
            $lines[$i] = 'GITHUB_TOKEN=' . $newToken;
            $found = true;
            break;
        }
    }
    if (!$found) {
        if (!empty($lines) && trim(end($lines)) !== '') $lines[] = '';
        $lines[] = 'GITHUB_TOKEN=' . $newToken;
    }
    $tmp = $envFile . '.tmp';
    if (file_put_contents($tmp, implode("\n", $lines) . "\n", LOCK_EX) === false || !@rename($tmp, $envFile)) {
        @unlink($tmp);
        send(false, 'No se pudo escribir el .env. Verifica los permisos del servidor.', [], 500);
    }
    @chmod($envFile, 0600);
    send(true, $newToken === '' ? 'Token eliminado del servidor.' : 'Token guardado en el servidor.', ['token_configured' => $newToken !== '']);
}

// Verificación SSL (configurable solo para entornos locales rotos).
$verifySsl = true;
if (array_key_exists('github_verify_ssl', $cfg)) $verifySsl = (bool)$cfg['github_verify_ssl'];

function ssl_help($err) {
    if (stripos((string)$err, 'ssl') === false && stripos((string)$err, 'certificate') === false) return '';
    return ' Parece un problema de certificados SSL de este PHP (frecuente en Windows/XAMPP): descarga https://curl.se/ca/cacert.pem y apunta curl.cainfo y openssl.cafile a ese archivo en php.ini (luego reinicia). Solo como último recurso en local: añade \'github_verify_ssl\' => false en config.php.';
}

// --- Cliente GitHub API (cURL) ---
function gh($method, $url, $token, $payload = null, $verify = true) {
    $ch = curl_init($url);
    $headers = ['User-Agent: XlerionStoryCreator', 'Accept: application/vnd.github+json'];
    if ($token) $headers[] = 'Authorization: Bearer ' . $token;
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_SSL_VERIFYPEER => $verify,
        CURLOPT_SSL_VERIFYHOST => $verify ? 2 : 0,
    ];
    if ($payload !== null) {
        $opts[CURLOPT_POSTFIELDS] = json_encode($payload);
        $headers[] = 'Content-Type: application/json';
        $opts[CURLOPT_HTTPHEADER] = $headers;
    }
    curl_setopt_array($ch, $opts);
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($body === false) return ['code' => 0, 'data' => null, 'error' => ($err !== '' ? $err : 'fallo de conexión desconocido')];
    return ['code' => $code, 'data' => json_decode($body, true), 'error' => null];
}

$setupSteps = [
    'Crea un token en GitHub: Settings → Developer settings → Personal access tokens → Tokens (classic), con permiso "repo".',
    'Guárdalo en el servidor como GITHUB_TOKEN en el archivo .env (junto a este script).',
    'Vuelve aquí y pulsa "Probar conexión".',
];

if ($action === 'test') {
    // Capa 1: cURL disponible en PHP.
    if (!function_exists('curl_init')) {
        send(false, 'Este PHP no tiene la extensión cURL activada. Actívala para poder conectar con GitHub.', ['token_configured' => (bool)$token], 200);
    }
    // Capa 2: salida a internet (sin autenticación).
    $ping = gh('GET', 'https://api.github.com/rate_limit', null, null, $verifySsl);
    if ($ping['code'] === 0) {
        send(false, 'El servidor no logra contactar api.github.com: ' . $ping['error'] . '.' . ssl_help($ping['error']) . ' Si nada funciona, revisa firewall/proxy del hosting.', ['token_configured' => (bool)$token], 200);
    }
    // Capa 3: token configurado.
    if (!$token) {
        send(false, 'Sin token configurado en el servidor.', ['setup' => $setupSteps, 'token_configured' => false], 200);
    }
    // Capa 4: token válido y repo accesible.
    $r = gh('GET', "https://api.github.com/repos/{$repo}", $token, null, $verifySsl);
    if ($r['code'] === 0) {
        send(false, 'Fallo de red hacia GitHub: ' . $r['error'] . '.' . ssl_help($r['error']), ['token_configured' => true], 200);
    }
    if ($r['code'] === 401) {
        send(false, 'GitHub rechaza el token (401): inválido, revocado o caducado. Genera uno nuevo (classic, permiso "repo") y guárdalo otra vez.', ['token_configured' => true], 200);
    }
    if ($r['code'] === 403) {
        $detail = (is_array($r['data']) && isset($r['data']['message'])) ? ' GitHub dice: ' . $r['data']['message'] : '';
        send(false, 'Acceso denegado (403). Si el token es fine-grained necesita permiso Contents: lectura/escritura en este repo.' . $detail, ['token_configured' => true], 200);
    }
    if ($r['code'] === 404) {
        send(false, 'Repositorio no encontrado o sin acceso (404). Revisa "propietario/repo" y que el token tenga permiso sobre él.', ['token_configured' => true], 200);
    }
    if ($r['code'] !== 200 || !is_array($r['data'])) {
        send(false, 'GitHub respondió con error ' . $r['code'] . '. Inténtalo de nuevo.', ['token_configured' => true], 200);
    }
    $pages = gh('GET', "https://api.github.com/repos/{$repo}/pages", $token, null, $verifySsl);
    $pagesInfo = null;
    if ($pages['code'] === 200 && is_array($pages['data'])) {
        $pagesInfo = [
            'url' => $pages['data']['html_url'] ?? null,
            'status' => $pages['data']['status'] ?? null,
        ];
    }
    send(true, 'Conexión OK.', [
        'repo' => $r['data']['full_name'] ?? $repo,
        'private' => $r['data']['private'] ?? null,
        'default_branch' => $r['data']['default_branch'] ?? null,
        'pages' => $pagesInfo,
        'pages_note' => $pagesInfo ? null : 'Pages no detectado: actívalo en el repo (Settings → Pages) para ver la página pública.',
        'token_configured' => true,
    ]);
}

// --- action=publish ---
if (!$token) {
    send(false, 'Sin token configurado en el servidor. Configura GITHUB_TOKEN primero.', ['setup' => $setupSteps], 200);
}
// Publicar decenas de archivos (data.json pesa MB) supera los 30 s que
// php -S impone por defecto. Se amplía solo para esta acción.
if (function_exists('set_time_limit')) {
    @set_time_limit(600);
}
if (function_exists('ignore_user_abort')) {
    @ignore_user_abort(true);
}

// Sincronización del sitio COMPLETO: se recorre el directorio y se sube
// todo menos la lista de exclusión (secretos, cachés, utilidades locales).
// Así ningún cambio se queda sin publicar.
$denyDirs = ['.git', 'backups', 'node_modules', '.vscode', '.idea'];
$denyFiles = ['.env', 'config.php', 'settings.json'];
$denyExt = ['tmp', 'log'];
$denyNames = ['Thumbs.db', '.DS_Store', 'launch.ps1', 'launcher.bat', 'convert.js'];
$files = [];
$skippedBig = [];
$base = __DIR__;
$it = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::LEAVES_ONLY
);
foreach ($it as $file) {
    if (!$file->isFile()) continue;
    $rel = str_replace('\\', '/', substr($file->getPathname(), strlen($base) + 1));
    $parts = explode('/', $rel);
    $skip = false;
    foreach ($parts as $seg) {
        if (in_array($seg, $denyDirs, true)) { $skip = true; break; }
    }
    if ($skip) continue;
    $name = end($parts);
    if (in_array($name, $denyFiles, true) || in_array($name, $denyNames, true)) continue;
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (in_array($ext, $denyExt, true)) continue;
    if ($file->getSize() > 25 * 1024 * 1024) { $skippedBig[] = $rel; continue; }
    $files[$rel] = $file->getPathname();
}
if (!isset($files['data.json'])) {
    send(false, 'No existe data.json en el servidor. Usa primero "Publicar (Web)".', [], 400);
}
if (empty($files)) {
    send(false, 'No hay archivos para publicar.', [], 400);
}

$published = [];
$commitUrl = null;
foreach ($files as $repoPath => $localPath) {
    $content = file_get_contents($localPath);
    if ($content === false) {
        send(false, "No se pudo leer {$repoPath} en el servidor.", [], 500);
    }
    if (strlen($content) > 90 * 1024 * 1024) {
        send(false, "{$repoPath} es demasiado grande para la API de GitHub.", [], 400);
    }
    // SHA actual (null si el archivo no existe aún en el repo)
    $sha = null;
    $cur = gh('GET', 'https://api.github.com/repos/' . $repo . '/contents/' . $repoPath . '?ref=' . urlencode($branch), $token, null, $verifySsl);
    if ($cur['code'] === 200 && is_array($cur['data']) && isset($cur['data']['sha'])) {
        $sha = $cur['data']['sha'];
    } elseif ($cur['code'] !== 404 && $cur['code'] !== 200) {
        $why = $cur['code'] === 0 ? (' Fallo de red: ' . ($cur['error'] ?? '')) : '';
        send(false, "No se pudo leer {$repoPath} en GitHub (HTTP {$cur['code']}).{$why}", [], 200);
    }
    $payload = [
        'message' => 'Publicar desde Xlerion Story Creator (' . date('Y-m-d H:i:s') . ')',
        'content' => base64_encode($content),
        'branch' => $branch,
    ];
    if ($sha) $payload['sha'] = $sha;
    $put = gh('PUT', 'https://api.github.com/repos/' . $repo . '/contents/' . $repoPath, $token, $payload, $verifySsl);
    if ($put['code'] !== 200 && $put['code'] !== 201) {
        $detail = '';
        if (is_array($put['data']) && isset($put['data']['message'])) $detail = ' ' . $put['data']['message'];
        if ($put['code'] === 0) $detail .= ' Fallo de red: ' . ($put['error'] ?? '');
        send(false, "Error al subir {$repoPath} (HTTP {$put['code']}).{$detail}", [], 200);
    }
    $published[] = $repoPath;
    if (is_array($put['data']) && isset($put['data']['commit']['html_url'])) {
        $commitUrl = $put['data']['commit']['html_url'];
    }
}

// Intentar activar Pages (rama + raíz) si aún no lo está. Best-effort.
$pagesNote = null;
$chk = gh('GET', "https://api.github.com/repos/{$repo}/pages", $token, null, $verifySsl);
if ($chk['code'] === 404) {
    $en = gh('POST', "https://api.github.com/repos/{$repo}/pages", $token, [
        'source' => ['branch' => $branch, 'path' => '/'],
    ], $verifySsl);
    if ($en['code'] === 201 || $en['code'] === 200) {
        $pagesNote = 'GitHub Pages activado automáticamente (rama ' . $branch . ').';
    } else {
        $pagesNote = 'Activa Pages a mano: repo → Settings → Pages → rama ' . $branch . ', carpeta /(root).';
    }
} elseif ($chk['code'] === 200 && is_array($chk['data']) && isset($chk['data']['html_url'])) {
    $pagesNote = 'Sitio: ' . $chk['data']['html_url'] . 'Xlerion-Total-Darkness.html';
}

send(true, 'Publicado en GitHub (' . count($published) . ' archivos). Pages se actualizará en 1-3 minutos.', [
    'files' => $published,
    'omitted_large' => $skippedBig,
    'commit_url' => $commitUrl,
    'deployed_at' => time(),
    'pages_note' => $pagesNote,
]);
