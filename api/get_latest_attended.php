<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db_connection.php';

try {
    // Fetch all attended families
    $stmt = $pdo->prepare("
        SELECT id, name, attended, updated_at
        FROM onam2025_registrations
        WHERE attended = 1
        ORDER BY updated_at ASC
    ");
    $stmt->execute();
    $families = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'families' => $families
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
