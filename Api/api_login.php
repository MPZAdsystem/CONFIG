<?php
/**
 * api_login.php — Endpoint logowania przez API CMS (api.adsystem.pl)
 * 
 * Przyjmuje POST z cms_login i cms_password.
 * Wysyła zapytanie cURL do API CMS.
 * Jeśli status 200 → tworzy sesję PHP i zwraca {"status":"OK"}.
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

/**
 * Funkcja komunikacji z wewnętrznym API CMS
 */
function int_request($rq) {
    $post = '';
    foreach ($rq as $k => $v) {
        $post .= urlencode($k) . '=' . urlencode($v) . '&';
    }
    if (!empty($post)) {
        $post = '?' . $post;
    }

    $c = curl_init();
    curl_setopt($c, CURLOPT_URL, 'https://api.adsystem.pl/AA/' . $post);

    $strCookie = 'PHPSESSID=' . session_id() . '; path=/';
    curl_setopt($c, CURLOPT_COOKIE, $strCookie);

    curl_setopt($c, CURLOPT_HEADER, 0);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($c, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($c, CURLOPT_TIMEOUT, 15);

    session_write_close();
    $response = curl_exec($c);
    $httpCode = curl_getinfo($c, CURLINFO_HTTP_CODE);
    $curlError = curl_error($c);
    curl_close($c);

    if ($curlError) {
        return json_encode(['status' => 'CURL_ERROR', 'message' => $curlError]);
    }

    return $response;
}

// Tylko POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'ERROR', 'message' => 'Metoda niedozwolona. Użyj POST.']);
    exit;
}

// Odczyt danych z formularza lub JSON body
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $login = $input['cms_login'] ?? '';
    $passwd = $input['cms_password'] ?? '';
} else {
    $login = $_POST['cms_login'] ?? '';
    $passwd = $_POST['cms_password'] ?? '';
}

if (empty($login) || empty($passwd)) {
    http_response_code(400);
    echo json_encode(['status' => 'ERROR', 'message' => 'Brak danych logowania (cms_login, cms_password)']);
    exit;
}

// Sprawdzenie lokalnych danych testowych
if (($login === 'test' && $passwd === 'adsys222') || ($login === 'admin' && $passwd === 'admin123')) {
    $_SESSION['logged_in'] = true;
    $_SESSION['user'] = $login;
    $_SESSION['login_time'] = time();

    echo json_encode([
        'status' => 'OK',
        'user'   => $login
    ]);
    exit;
}

// Wysyłka do API CMS
$rq = [
    'cms_login'     => $login,
    'cms_passwd'    => $passwd,
    'cms_login_btn' => 'yeah'
];

$response = int_request($rq);
$data = json_decode($response, true);

// Sprawdzenie odpowiedzi — status 200 = OK
if (is_array($data) && isset($data['status']) && $data['status'] == 200) {
    // Restart sesji po pomyślnym logowaniu
    session_start();
    $_SESSION['logged_in'] = true;
    $_SESSION['user'] = $login;
    $_SESSION['login_time'] = time();

    echo json_encode([
        'status' => 'OK',
        'user'   => $login
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'status'  => 'ERROR',
        'message' => 'Nieprawidłowy login lub hasło'
    ]);
}
