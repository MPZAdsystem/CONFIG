<?php
/**
 * fix_permissions.php — Skrypt pomocniczy do naprawy uprawnień katalogu files/
 */
header('Content-Type: text/plain; charset=utf-8');

$baseDir = dirname(__DIR__) . '/files';

echo "Ścieżka katalogu files: " . $baseDir . "\n";

if (is_dir($baseDir)) {
    echo "Katalog istnieje. Próba zmiany uprawnień na 0777...\n";
    if (chmod($baseDir, 0777)) {
        echo "SUKCES: Zmieniono uprawnienia katalogu 'files' na 0777.\n";
    } else {
        echo "BŁĄD: Nie udało się zmienić uprawnień za pomocą chmod().\n";
    }
} else {
    echo "Katalog nie istnieje. Próba utworzenia z uprawnieniami 0777...\n";
    if (mkdir($baseDir, 0777, true)) {
        chmod($baseDir, 0777); // upewnienie się
        echo "SUKCES: Utworzono katalog 'files' z uprawnieniami 0777.\n";
    } else {
        echo "BŁĄD: Nie udało się utworzyć katalogu 'files'.\n";
    }
}
