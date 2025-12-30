<?php
session_start();
header('Content-Type: application/json');

// --- Seguridad: Configuración desde Variables de Entorno (Docker) ---
$validEmail = getenv('ADMIN_EMAIL') ?: 'admin@rodetes.com';
$validPassword = getenv('ADMIN_PASSWORD') ?: 'admin';

// Leer entrada JSON
$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

// Debug logging
error_log("LOGIN ATTEMPT:");
error_log("Input Email: '" . $email . "'");
error_log("Input Password: '" . $password . "'");
error_log("Expected Email: '" . $validEmail . "'");
error_log("Expected Password: '" . $validPassword . "'");
error_log("Env ADMIN_EMAIL: '" . getenv('ADMIN_EMAIL') . "'");

if ($email === $validEmail && $password === $validPassword) {
    $_SESSION['is_logged_in'] = true;
    $_SESSION['admin_email'] = $email;
    echo json_encode(['success' => true]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas (Revisa logs)']);
}
?>
