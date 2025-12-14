<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require 'db_connection.php';

$familyId = $_POST['familyId'] ?? '';

if (!$familyId) {
    echo json_encode(['success' => false, 'message' => 'Family ID missing.']);
    exit;
}

$house_no = $_POST['house_no'] ?? '';
$address_line = $_POST['address_line'] ?? '';
$location = $_POST['location'] ?? '';
$postal_code = $_POST['postal_code'] ?? '';
$membership_type = $_POST['membership_type'] ?? '';

$query = $pdo->prepare("UPDATE families SET house_no = ?, address_line = ?, location = ?, postal_code = ?, membership_type = ? WHERE id = ?");
$updated = $query->execute([$house_no, $address_line, $location, $postal_code, $membership_type, $familyId]);

echo json_encode(['success' => $updated]);
