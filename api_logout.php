<?php
/**
 * api_logout.php — Endpoint wylogowania
 * 
 * Niszczy sesję PHP i czyści ciasteczka.
 */
session_start();
header('Content-Type: application/json; charset=utf-8');

// Czyszczenie danych sesji
$_SESSION = [];

// Usunięcie ciasteczka sesji
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Zniszczenie sesji
session_destroy();

echo json_encode([
    'status'  => 'OK',
    'message' => 'Wylogowano pomyślnie'
]);
