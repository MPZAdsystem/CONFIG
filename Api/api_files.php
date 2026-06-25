<?php
/**
 * api_files.php — Bezpośredni dostęp do plików projektów z katalogu files/
 * 
 * Struktura katalogu files/:
 *   files/
 *   ├── jan_kowalski/
 *   │   ├── EXPO_Projekt_Targowy.json
 *   │   ├── EXPO_Stoisko_ABC.json
 *   │   └── raport_bom.csv
 *   ├── anna_nowak/
 *   │   └── EXPO_Konferencja.json
 *   └── ...
 *
 * Tryby:
 *   GET api_files.php                         → Lista użytkowników (katalogów)
 *   GET api_files.php?user=jan_kowalski       → Lista projektów użytkownika (z metadanymi z JSON)
 *   GET api_files.php?user=jan_kowalski&download=plik.json  → Pobierz plik
 *
 * BEZ AUTORYZACJI — endpoint publiczny dla systemu wewnętrznego.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$baseFilesDir = dirname(__DIR__) . '/files';

// Tworzenie katalogu głównego jeśli nie istnieje
if (!is_dir($baseFilesDir)) {
    mkdir($baseFilesDir, 0755, true);
}

// ═══════════════════════════════════════════════════════════════
// TRYB: Pobieranie pliku
// GET api_files.php?user=X&download=Y
// ═══════════════════════════════════════════════════════════════
if (isset($_GET['download']) && isset($_GET['user'])) {
    $user = basename($_GET['user']);
    $filename = basename($_GET['download']);
    $filepath = $baseFilesDir . '/' . $user . '/' . $filename;

    // Walidacja realpath (ochrona path traversal)
    $realPath = realpath($filepath);
    $realBase = realpath($baseFilesDir);

    if ($realPath === false || strpos($realPath, $realBase) !== 0 || !is_file($realPath)) {
        http_response_code(404);
        echo json_encode(['status' => 'ERROR', 'message' => 'Plik nie znaleziony']);
        exit;
    }

    // Autodetekcja MIME
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $realPath);
    finfo_close($finfo);

    header('Content-Type: ' . ($mimeType ?: 'application/octet-stream'));
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($realPath));
    header('Cache-Control: no-cache');
    readfile($realPath);
    exit;
}

// ═══════════════════════════════════════════════════════════════
// TRYB: Lista projektów użytkownika
// GET api_files.php?user=jan_kowalski
// ═══════════════════════════════════════════════════════════════
if (isset($_GET['user'])) {
    $user = basename($_GET['user']);
    $userDir = $baseFilesDir . '/' . $user;

    if (!is_dir($userDir)) {
        http_response_code(404);
        echo json_encode(['status' => 'ERROR', 'message' => 'Użytkownik nie znaleziony']);
        exit;
    }

    $projects = [];

    foreach (scandir($userDir) as $file) {
        if ($file === '.' || $file === '..') continue;
        $filePath = $userDir . '/' . $file;
        if (!is_file($filePath)) continue;

        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $fileSize = filesize($filePath);
        $fileModified = filemtime($filePath);
        $fileCreated = filectime($filePath);

        $entry = [
            'filename'     => $file,
            'extension'    => $ext,
            'size'         => $fileSize,
            'size_human'   => formatBytes($fileSize),
            'created'      => date('Y-m-d H:i:s', $fileCreated),
            'modified'     => date('Y-m-d H:i:s', $fileModified),
            'download_url' => 'Api/api_files.php?user=' . urlencode($user) . '&download=' . urlencode($file)
        ];

        // Dla plików JSON — wyciągamy metadane projektu
        if ($ext === 'json') {
            $jsonContent = file_get_contents($filePath);
            $data = json_decode($jsonContent, true);

            if (is_array($data)) {
                $entry['project_name']    = $data['projectName'] ?? null;
                $entry['customer_name']   = $data['customerName'] ?? null;
                $entry['customer_email']  = $data['customerEmail'] ?? null;
                $entry['system']          = $data['system'] ?? null;
                $entry['version']         = $data['version'] ?? null;
                $entry['modules_count']   = isset($data['plan']) ? count($data['plan']) : 0;
                $entry['has_floor']       = isset($data['floorConfig']) && ($data['floorConfig']['type'] ?? 'none') !== 'none';
            }
        }

        $projects[] = $entry;
    }

    // Sortowanie: najnowsze najpierw
    usort($projects, function($a, $b) {
        return strtotime($b['modified']) - strtotime($a['modified']);
    });

    echo json_encode([
        'status'         => 'OK',
        'user'           => $user,
        'projects'       => $projects,
        'total_files'    => count($projects)
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ═══════════════════════════════════════════════════════════════
// TRYB: Lista użytkowników (katalogów w files/)
// GET api_files.php
// ═══════════════════════════════════════════════════════════════
$users = [];

foreach (scandir($baseFilesDir) as $item) {
    if ($item === '.' || $item === '..') continue;
    $itemPath = $baseFilesDir . '/' . $item;

    if (is_dir($itemPath)) {
        // Zliczanie plików i wyciągnięcie daty ostatniego projektu
        $fileCount = 0;
        $jsonCount = 0;
        $csvCount = 0;
        $latestModified = 0;

        foreach (scandir($itemPath) as $child) {
            if ($child === '.' || $child === '..') continue;
            $childPath = $itemPath . '/' . $child;
            if (!is_file($childPath)) continue;

            $fileCount++;
            $childExt = strtolower(pathinfo($child, PATHINFO_EXTENSION));
            if ($childExt === 'json') $jsonCount++;
            if ($childExt === 'csv') $csvCount++;

            $mtime = filemtime($childPath);
            if ($mtime > $latestModified) $latestModified = $mtime;
        }

        $users[] = [
            'name'            => $item,
            'total_files'     => $fileCount,
            'json_count'      => $jsonCount,
            'csv_count'       => $csvCount,
            'last_activity'   => $latestModified > 0 ? date('Y-m-d H:i:s', $latestModified) : null,
            'browse_url'      => 'Api/api_files.php?user=' . urlencode($item)
        ];
    }
}

// Sortowanie: ostatnia aktywność
usort($users, function($a, $b) {
    return strtotime($b['last_activity'] ?? '2000-01-01') - strtotime($a['last_activity'] ?? '2000-01-01');
});

echo json_encode([
    'status'      => 'OK',
    'users'       => $users,
    'total_users' => count($users)
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);


/**
 * Formatowanie rozmiaru pliku
 */
function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}
