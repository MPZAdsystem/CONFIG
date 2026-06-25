<?php
/**
 * api_check_session.php — Sprawdzenie czy sesja użytkownika jest aktywna
 * 
 * Używane przez frontend do auto-logowania po odświeżeniu strony.
 * Zwraca status sesji i nazwę zalogowanego użytkownika.
 */
session_start();
header('Content-Type: application/json; charset=utf-8');

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        'status'     => 'OK',
        'logged_in'  => true,
        'user'       => $_SESSION['user'] ?? 'unknown',
        'login_time' => $_SESSION['login_time'] ?? null
    ]);
} else {
    echo json_encode([
        'status'    => 'OK',
        'logged_in' => false
    ]);
}
