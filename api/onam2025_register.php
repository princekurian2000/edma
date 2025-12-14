<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db_connection.php';

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Validate required fields
$requiredFields = [
    'name',
    'email',
    'membershipType',
    'totalAdults',
    'totalKids',
    'totalGuestAdults',
    'totalGuestKids',
    'totalAdditionalAdults',
    'totalAdditionalKids',
    'totalAmount'
];

foreach ($requiredFields as $field) {
    if (!isset($input[$field])) {
        echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
        exit;
    }
}

$name = $input['name'];
$email = $input['email'];
$familyId = isset($input['familyId']) ? (int)$input['familyId'] : null; // ✅ optional but preferred
$membershipType = $input['membershipType'];
$totalAdults = (int)$input['totalAdults'];
$totalKids = (int)$input['totalKids'];
$totalGuestAdults = (int)$input['totalGuestAdults'];
$totalGuestKids = (int)$input['totalGuestKids'];
$totalAdditionalAdults = (int)$input['totalAdditionalAdults'];
$totalAdditionalKids = (int)$input['totalAdditionalKids'];
$totalAmount = (float)$input['totalAmount'];

try {
    $stmt = $pdo->prepare("
        INSERT INTO onam2025_registrations
        (family_id, name, email, membership_type, total_adults, total_kids, total_guest_adults, total_guest_kids, total_additional_adults, total_additional_kids, total_amount, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $familyId,
        $name,
        $email,
        $membershipType,
        $totalAdults,
        $totalKids,
        $totalGuestAdults,
        $totalGuestKids,
        $totalAdditionalAdults,
        $totalAdditionalKids,
        $totalAmount
    ]);

    echo json_encode(['success' => true, 'message' => 'Registration successful!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
