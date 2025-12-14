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

function resizeImage($imagePath, $maxWidth = 800, $maxHeight = 800, $quality = 80) {
    list($width, $height, $type) = getimagesize($imagePath);

    // Calculate new dimensions
    $aspectRatio = $width / $height;
    if ($width > $height) {
        $newWidth = min($maxWidth, $width);
        $newHeight = $newWidth / $aspectRatio;
    } else {
        $newHeight = min($maxHeight, $height);
        $newWidth = $newHeight * $aspectRatio;
    }

    // Create image from file
    switch ($type) {
        case IMAGETYPE_JPEG:
            $image = imagecreatefromjpeg($imagePath);
            break;
        case IMAGETYPE_PNG:
            $image = imagecreatefrompng($imagePath);
            break;
        case IMAGETYPE_GIF:
            $image = imagecreatefromgif($imagePath);
            break;
        default:
            throw new Exception("Unsupported image type.");
    }

    // Create resized image
    $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    // Save the resized image
    switch ($type) {
        case IMAGETYPE_JPEG:
            imagejpeg($resizedImage, $imagePath, $quality);
            break;
        case IMAGETYPE_PNG:
            imagepng($resizedImage, $imagePath);
            break;
        case IMAGETYPE_GIF:
            imagegif($resizedImage, $imagePath);
            break;
    }

    // Free memory
    imagedestroy($image);
    imagedestroy($resizedImage);
}

try {
    // Collect family details
    $houseNo = $_POST['houseNo'] ?? '';
    $addressLine = $_POST['addressLine'] ?? '';
    $postalCode = $_POST['postalCode'] ?? '';
    $location = $_POST['location'] ?? '';
    $otherLocation = $_POST['otherLocation'] ?? '';
    $membershipType = $_POST['membershipType'] ?? '';
    $otherMembership = $_POST['otherMembership'] ?? '';

    if ($location === 'Other') $location = $otherLocation;
    if ($membershipType === 'Other') $membershipType = $otherMembership;

    // Insert into families table
    $stmt = $pdo->prepare("INSERT INTO families (house_no, address_line, postal_code, location, membership_type) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$houseNo, $addressLine, $postalCode, $location, $membershipType]);
    $familyId = $pdo->lastInsertId();

    if (!$familyId) {
        throw new Exception("Failed to get inserted family ID.");
    }

    // Flatten and parse FormData into nested structure
    $flatPost = [];
    foreach ($_POST as $key => $value) {
        $flatPost[$key] = $value;
    }
    parse_str(http_build_query($flatPost), $parsedPost);

    // Debug: write to server log for verification
    file_put_contents('debug_post.txt', print_r($_POST, true));
    file_put_contents('debug_parsed.txt', print_r($parsedPost, true));

    $insertedMembers = [];

    // Insert members
    if (isset($parsedPost['members']) && is_array($parsedPost['members'])) {
        foreach ($parsedPost['members'] as $index => $member) {
            $name = $member['name'] ?? '';
            $email = $member['email'] ?? '';
            $phone = $member['phone'] ?? '';
            $dob = $member['dob'] ?? '';
            $photoPath = '';

            // Check if photo is uploaded for this member
            if (isset($_FILES["members"]['tmp_name'][$index]['photo']) && $_FILES["members"]['error'][$index]['photo'] === UPLOAD_ERR_OK) {
                $photoTmpName = $_FILES["members"]['tmp_name'][$index]['photo'];
                $photoName = $_FILES["members"]['name'][$index]['photo'];

                // Generate unique photo name
                $uniquePhotoName = uniqid('photo_' . time() . '_', true) . '.' . pathinfo($photoName, PATHINFO_EXTENSION);
                $photoPath = 'uploads/' . $uniquePhotoName;

                // Ensure the upload directory exists
                if (!is_dir('uploads')) {
                    mkdir('uploads', 0755, true);
                }

                // Move the uploaded photo to the target directory
                if (!move_uploaded_file($photoTmpName, $photoPath)) {
                    throw new Exception("Error uploading photo for member $name.");
                }

                // Resize the photo and compress to reduce file size
                resizeImage($photoPath); // Resize and compress the image
            }

            // Insert member into members table with photo path
            $stmt = $pdo->prepare("INSERT INTO members (family_id, name, email, phone, dob, photo_path) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$familyId, $name, $email, $phone, $dob, $photoPath]);

            // Add to insertedMembers array
            $insertedMembers[] = [
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'dob' => $dob,
                'photoPath' => $photoPath
            ];
        }
    }

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Family and members saved successfully.',
        'familyId' => $familyId,
        'members' => $insertedMembers
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
