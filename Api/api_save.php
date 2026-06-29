<?php
/**
 * api_save.php — Zapisuje projekt (JSON i XLSX) na serwerze
 * 
 * Przyjmuje POST z projectName, jsonData oraz xlsData.
 * Wymaga aktywnej sesji użytkownika (logowanie przez api_login.php).
 * 
 * Pliki zapisywane są w 4 lokalizacjach:
 *   1. public_html/files/{user}/  — XLSX + JSON (główny katalog www)
 *   2. public_html/json/{user}/   — JSON (dedykowany folder w www)
 *   3. ../files/{user}/           — XLSX + JSON (folder nadrzędny)
 *   4. ../json/{user}/            — JSON (folder nadrzędny)
 */

session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Obsługa preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'ERROR', 'message' => 'Metoda niedozwolona. Użyj POST.']);
    exit;
}

// Sprawdzenie czy użytkownik jest zalogowany
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || empty($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['status' => 'ERROR', 'message' => 'Brak aktywnej sesji. Zaloguj się ponownie.']);
    exit;
}

$user = basename($_SESSION['user']);

// === Definicja katalogów docelowych ===
// 1. public_html/files/{user}/
$publicFilesDir = dirname(__DIR__) . '/files/' . $user;
// 2. public_html/json/{user}/
$publicJsonDir = dirname(__DIR__) . '/json/' . $user;
// 3. ../files/{user}/ (folder nadrzędny)
$parentFilesDir = dirname(dirname(__DIR__)) . '/files/' . $user;
// 4. ../json/{user}/ (folder nadrzędny)
$parentJsonDir = dirname(dirname(__DIR__)) . '/json/' . $user;

// Tworzenie katalogów jeśli nie istnieją
foreach ([$publicFilesDir, $publicJsonDir, $parentFilesDir, $parentJsonDir] as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// Odczyt danych z body (obsługa raw JSON lub standardowego POST)
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $projectName = $input['projectName'] ?? '';
    $jsonData = $input['jsonData'] ?? '';
    $xlsData = $input['xlsData'] ?? '';
} else {
    $projectName = $_POST['projectName'] ?? '';
    $jsonData = $_POST['jsonData'] ?? '';
    $xlsData = $_POST['xlsData'] ?? '';
}

if (empty($projectName)) {
    http_response_code(400);
    echo json_encode(['status' => 'ERROR', 'message' => 'Brak nazwy projektu (projectName)']);
    exit;
}

// Oczyszczenie nazwy projektu z niebezpiecznych znaków dla nazwy pliku
$safeProjectName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $projectName);
if (empty($safeProjectName)) {
    $safeProjectName = 'Projekt_' . time();
}

$filenameBase = 'EXPO_' . $safeProjectName;
$jsonFilename = $filenameBase . '.json';
$xlsFilename = $filenameBase . '.xlsx';

$results = [];

// === Zapis pliku JSON ===
if (!empty($jsonData)) {
    // 1. public_html/files/
    $r = @file_put_contents($publicFilesDir . '/' . $jsonFilename, $jsonData);
    $results['json_public_files'] = $r !== false;

    // 2. public_html/json/
    $r = @file_put_contents($publicJsonDir . '/' . $jsonFilename, $jsonData);
    $results['json_public_json'] = $r !== false;

    // 3. ../files/ (folder nadrzędny)
    $r = @file_put_contents($parentFilesDir . '/' . $jsonFilename, $jsonData);
    $results['json_parent_files'] = $r !== false;

    // 4. ../json/ (folder nadrzędny)
    $r = @file_put_contents($parentJsonDir . '/' . $jsonFilename, $jsonData);
    $results['json_parent_json'] = $r !== false;
}

// === Zapis pliku XLSX (Excel) ===
if (!empty($xlsData)) {
    $decodedXls = base64_decode($xlsData);
    if ($decodedXls !== false) {
        // 1. public_html/files/
        $r = @file_put_contents($publicFilesDir . '/' . $xlsFilename, $decodedXls);
        $results['xlsx_public_files'] = $r !== false;

        // 2. ../files/ (folder nadrzędny)
        $r = @file_put_contents($parentFilesDir . '/' . $xlsFilename, $decodedXls);
        $results['xlsx_parent_files'] = $r !== false;
    }
}

// Sprawdzenie czy przynajmniej główny zapis się powiódł
$mainSaved = !empty($results['json_public_files']) || !empty($results['xlsx_public_files']);

if ($mainSaved || count(array_filter($results)) > 0) {
    echo json_encode([
        'status' => 'OK',
        'message' => 'Projekt został pomyślnie zapisany na serwerze',
        'user' => $user,
        'project_name' => $projectName,
        'files' => [
            'json' => !empty($jsonData) ? $jsonFilename : null,
            'xlsx' => !empty($xlsData) ? $xlsFilename : null
        ],
        'save_details' => $results
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'ERROR',
        'message' => 'Nie udało się zapisać plików na serwerze',
        'save_details' => $results
    ]);
}

