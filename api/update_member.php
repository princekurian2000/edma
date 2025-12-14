<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require 'db_connection.php';

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$dob = $_POST['dob'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Member ID missing.']);
    exit;
}

// 1. Fetch existing photo path
$oldPhotoPath = null;
$stmt = $pdo->prepare("SELECT photo_path FROM members WHERE id = ?");
$stmt->execute([$id]);
$member = $stmt->fetch(PDO::FETCH_ASSOC);

if ($member) {
    $oldPhotoPath = $member['photo_path'];
}

// 2. Handle new photo upload
$photo_path = null;
if (!empty($_FILES['newPhoto']['name'])) {
    $uploadDir = 'uploads/';
    $filename = uniqid() . '_' . basename($_FILES['newPhoto']['name']);
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['newPhoto']['tmp_name'], $targetPath)) {
        $photo_path = $targetPath;

        // 3. Delete old photo if it exists and is not the same as new one
        if ($oldPhotoPath && file_exists($oldPhotoPath)) {
            unlink($oldPhotoPath);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Photo upload failed.']);
        exit;
    }
}

// 4. Update member info
if ($photo_path) {
    $query = $pdo->prepare("UPDATE members SET name = ?, email = ?, phone = ?, dob = ?, photo_path = ? WHERE id = ?");
    $result = $query->execute([$name, $email, $phone, $dob, $photo_path, $id]);
} else {
    $query = $pdo->prepare("UPDATE members SET name = ?, email = ?, phone = ?, dob = ? WHERE id = ?");
    $result = $query->execute([$name, $email, $phone, $dob, $id]);
}

// 5. Return result
echo json_encode(['success' => $result, 'photo_path' => $photo_path]);
