<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db_connection.php';

if (!isset($_GET['familyId']) || empty($_GET['familyId'])) {
    echo json_encode(['success' => false, 'message' => 'familyId parameter missing']);
    exit;
}

$familyId = $_GET['familyId'];

try {
    // Fetch family info
    $stmtFamily = $pdo->prepare("SELECT id, house_no, address_line, postal_code, location, membership_type FROM families WHERE id = ?");
    $stmtFamily->execute([$familyId]);
    $family = $stmtFamily->fetch();

    if (!$family) {
        echo json_encode(['success' => false, 'message' => 'Family not found']);
        exit;
    }

    // Fetch members in family
    $stmtMembers = $pdo->prepare("SELECT id,name, email, phone, dob, photo_path FROM members WHERE family_id = ?");
    $stmtMembers->execute([$familyId]);
    $members = $stmtMembers->fetchAll();

    echo json_encode([
        'success' => true,
        'family' => $family,
        'members' => $members,
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>
