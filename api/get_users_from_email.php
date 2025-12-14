<?php
// CORS headers
header("Access-Control-Allow-Origin: *"); // allow your frontend origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_connection.php';

if (!isset($_GET['email']) || empty($_GET['email'])) {
    echo json_encode(['exists' => false, 'message' => 'Email parameter missing']);
    exit;
}

$email = $_GET['email'];

try {
    // 1️⃣ Find family_id from the given email
    $stmt = $pdo->prepare("SELECT family_id FROM members WHERE email = ?");
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    if (!$row) {
        echo json_encode(['exists' => false]);
        exit;
    }

    $familyId = $row['family_id'];

    // 2️⃣ Fetch family details (including membership_type)
    $stmtFamily = $pdo->prepare("SELECT membership_type FROM families WHERE id = ?");
    $stmtFamily->execute([$familyId]);
    $family = $stmtFamily->fetch();

    $membershipType = $family ? $family['membership_type'] : null;

    // 3️⃣ Fetch members in this family
    $stmtMembers = $pdo->prepare("SELECT id, name, email, phone, dob, photo_path 
                                  FROM members WHERE family_id = ?");
    $stmtMembers->execute([$familyId]);
    $members = $stmtMembers->fetchAll(PDO::FETCH_ASSOC);

    // 4️⃣ Calculate totals
    $totalMembers = count($members);
    $totalKids = 0;
    $today = new DateTime();

    foreach ($members as $member) {
        if (!empty($member['dob'])) {
            $dob = new DateTime($member['dob']);
            $age = $today->diff($dob)->y;
            if ($age < 10) {
                $totalKids++;
            }
        }
    }

    $totalAdults = $totalMembers - $totalKids;

    // 5️⃣ Check if already registered in onam2025_registrations
    $stmtReg = $pdo->prepare("SELECT * FROM onam2025_registrations WHERE family_id = ?");
    $stmtReg->execute([$familyId]);
    $registration = $stmtReg->fetch(PDO::FETCH_ASSOC);

    if ($registration) {
        // ✅ Already registered
        echo json_encode([
            'exists' => true,
            'family_id' => $familyId,
            'membership_type' => $membershipType,
            'already_registered' => true,
            'registration_details' => $registration
        ]);
        exit;
    }

    // 6️⃣ Not registered → return family details
    echo json_encode([
        'exists' => true,
        'family_id' => $familyId,
        'membership_type' => $membershipType,
        'members' => $members,
        'total_members' => $totalMembers,
        'total_kids' => $totalKids,
        'total_adults' => $totalAdults,
        'already_registered' => false
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['exists' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
