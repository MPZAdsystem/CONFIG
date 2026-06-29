<?php
/**
 * api_graphics.php — Listuje pliki graficzne z folderu Zapisane_grafiki lub Zapisane grafiki
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$pathsToCheck = [
    dirname(__DIR__) . '/Zapisane_grafiki',
    dirname(__DIR__) . '/Zapisane grafiki',
    dirname(__DIR__) . '/public_html/Zapisane_grafiki',
];

$graphicsDir = null;
foreach ($pathsToCheck as $p) {
    if (is_dir($p)) {
        $graphicsDir = $p;
        break;
    }
}

if (!$graphicsDir) {
    echo json_encode([]);
    exit;
}

$files = [];
$validExts = ['jpg', 'jpeg', 'png', 'pdf', 'tif', 'tiff'];

foreach (scandir($graphicsDir) as $file) {
    if ($file === '.' || $file === '..') continue;
    $filePath = $graphicsDir . '/' . $file;
    if (!is_file($filePath)) continue;

    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (!in_array($ext, $validExts)) continue;

    $folderName = basename($graphicsDir);
    
    $files[] = [
        'name' => $file,
        'download_url' => $folderName . '/' . rawurlencode($file)
    ];
}

echo json_encode($files, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
