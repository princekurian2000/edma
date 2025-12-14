<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $regId = intval($data['id'] ?? 0);

    if ($regId <= 0) {
        throw new Exception("Invalid registration ID");
    }

    // Update attended AND updated_at
    $stmt = $pdo->prepare("
        UPDATE onam2025_registrations 
        SET attended = 1, updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([$regId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Attendance marked"]);
    } else {
        echo json_encode(["success" => false, "message" => "No rows updated"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
