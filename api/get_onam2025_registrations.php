<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db_connection.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            id,
            family_id,
            name,
            email,
            membership_type,
            total_adults,
            total_kids,
            total_guest_adults,
            total_guest_kids,
            total_additional_adults,
            total_additional_kids,
            total_amount,
            attended,
            created_at
        FROM onam2025_registrations
        ORDER BY created_at DESC
    ");
    $stmt->execute();
    $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'registrations' => $registrations
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
