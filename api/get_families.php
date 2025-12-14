<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db_connection.php';

try {
    $stmt = $pdo->query("SELECT * FROM families");
    $families = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($families as &$family) {
        $stmtMembers = $pdo->prepare("SELECT name, email, phone, dob, photo_path FROM members WHERE family_id = ?");
        $stmtMembers->execute([$family['id']]);
        $family['members'] = $stmtMembers->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode(['success' => true, 'families' => $families]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
