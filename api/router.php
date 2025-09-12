<?php
// Router para el servidor PHP integrado

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Manejar peticiones OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('HTTP/1.1 200 OK');
    exit();
}

// Servir archivos de uploads con CORS
if (strpos($uri, '/api/uploads/') === 0) {
    // Eliminar /api del path para obtener la ruta correcta del archivo
    $relativePath = str_replace('/api', '', $uri);
    $filePath = __DIR__ . $relativePath;
    if (file_exists($filePath)) {
        header('Access-Control-Allow-Origin: *');
        
        // Determinar el tipo de contenido basado en la extensión
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        switch (strtolower($extension)) {
            case 'jpg':
            case 'jpeg':
                header('Content-Type: image/jpeg');
                break;
            case 'png':
                header('Content-Type: image/png');
                break;
            case 'gif':
                header('Content-Type: image/gif');
                break;
            case 'webp':
                header('Content-Type: image/webp');
                break;
            case 'pdf':
                header('Content-Type: application/pdf');
                break;
            case 'doc':
            case 'docx':
                header('Content-Type: application/msword');
                break;
            case 'txt':
                header('Content-Type: text/plain');
                break;
            case 'zip':
                header('Content-Type: application/zip');
                break;
            default:
                header('Content-Type: application/octet-stream');
                break;
        }
        
        readfile($filePath);
        exit();
    } else {
        http_response_code(404);
        echo 'File not found';
        exit();
    }
}

// Manejar rutas de API
if (strpos($uri, '/api/') === 0) {
    header('Access-Control-Allow-Origin: *');
    require_once __DIR__ . '/index.php';
    exit();
}

// Intentar servir archivos estáticos desde dist/
$staticFile = dirname(__DIR__) . '/dist' . $uri;

// Si es la raíz o un directorio, buscar index.html
if ($uri === '/' || is_dir($staticFile)) {
    $staticFile = rtrim($staticFile, '/') . '/index.html';
}

// Si el archivo existe en dist/, servirlo
if (file_exists($staticFile) && !is_dir($staticFile)) {
    $extension = pathinfo($staticFile, PATHINFO_EXTENSION);
    switch ($extension) {
        case 'html':
            header('Content-Type: text/html; charset=UTF-8');
            break;
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'json':
            header('Content-Type: application/json');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        case 'svg':
            header('Content-Type: image/svg+xml');
            break;
        case 'ico':
            header('Content-Type: image/x-icon');
            break;
    }
    readfile($staticFile);
    exit();
}

// Si no se encuentra nada, servir index.html para SPA routing
$indexFile = dirname(__DIR__) . '/dist/index.html';
if (file_exists($indexFile)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($indexFile);
    exit();
}

// Si definitivamente no hay nada, error 404
http_response_code(404);
echo json_encode(['error' => 'Not found']);
?>