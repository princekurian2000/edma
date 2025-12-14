<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db_connection.php';

if (!isset($_GET['email']) || empty($_GET['email'])) {
    echo json_encode(['exists' => false, 'message' => 'Email parameter missing']);
    exit;
}

$email = $_GET['email'];

try {
    $stmt = $pdo->prepare("SELECT family_id FROM members WHERE email = ?");
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    if (!$row) {
        echo json_encode(['exists' => false]);
    } else {
        echo json_encode(['exists' => true, 'family_id' => $row['family_id']]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['exists' => false, 'message' => 'Server error']);
}
?>
