<?php
/**
 * api_save.php — Zapisuje projekt (JSON i CSV) do katalogu files/{username}/
 * 
 * Przyjmuje POST z projectName, jsonData oraz csvData.
 * Wymaga aktywnej sesji użytkownika (logowanie przez api_login.php).
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
$baseFilesDir = dirname(__DIR__) . '/files';
$userDir = $baseFilesDir . '/' . $user;

// Tworzenie katalogu użytkownika jeśli nie istnieje
if (!is_dir($userDir)) {
    if (!mkdir($userDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['status' => 'ERROR', 'message' => 'Błąd tworzenia katalogu użytkownika na serwerze']);
        exit;
    }
}

// Odczyt danych z body (obsługa raw JSON lub standardowego POST)
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $projectName = $input['projectName'] ?? '';
    $jsonData = $input['jsonData'] ?? '';
    $csvData = $input['csvData'] ?? '';
} else {
    $projectName = $_POST['projectName'] ?? '';
    $jsonData = $_POST['jsonData'] ?? '';
    $csvData = $_POST['csvData'] ?? '';
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
$jsonFilepath = $userDir . '/' . $filenameBase . '.json';
$csvFilepath = $userDir . '/' . $filenameBase . '.csv';

$savedJson = false;
$savedCsv = false;

// Zapis pliku JSON
if (!empty($jsonData)) {
    if (file_put_contents($jsonFilepath, $jsonData) !== false) {
        $savedJson = true;
    }
}

// Zapis pliku CSV (BOM)
if (!empty($csvData)) {
    if (file_put_contents($csvFilepath, $csvData) !== false) {
        $savedCsv = true;
    }
}

if ($savedJson || $savedCsv) {
    echo json_encode([
        'status' => 'OK',
        'message' => 'Projekt i zestawienie BOM zostały pomyślnie zapisane na serwerze',
        'user' => $user,
        'project_name' => $projectName,
        'files' => [
            'json' => $savedJson ? $filenameBase . '.json' : null,
            'csv' => $savedCsv ? $filenameBase . '.csv' : null
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'ERROR', 'message' => 'Nie udało się zapisać plików na serwerze']);
}
