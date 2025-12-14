<?php
// Enable error reporting for debugging
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);
require 'db_connection.php';

// Load config and Composer autoloader
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../vendor/autoload.php';  // Adjust if your vendor folder location is different

use Pusher\Pusher;

// Setup Pusher client
$options = [
    'cluster' => PUSHER_APP_CLUSTER,
    'useTLS' => true
];
$pusher = new Pusher(
    PUSHER_APP_KEY,
    PUSHER_APP_SECRET,
    PUSHER_APP_ID,
    $options
);

// Predefined options for specific winners
$options = [
'JOHN SAMUEL',
'PHILOMOL VARGHESE',
'MRUDHULA',
'SOBIN',
'JISHA POULOSE',
'JIJU',
'JAMES',
'REMYA RENJU',
];

// Fetch the winner information from the chitti_C_Control table
$stmt = $pdo->query("SELECT winner_name, is_random FROM chitti_D_Control LIMIT 1");
$winner = $stmt->fetch(PDO::FETCH_ASSOC);

if ($winner) {
    $isRandom = $winner['is_random'];
    
    if ($isRandom) {
        // Generate a random winner from the predefined list
        $winnerName = $options[array_rand($options)]; // Select a random winner
    } else {
        // Use the specific winner from the database
        $winnerName = $winner['winner_name'];
    }

    // Determine the index of the winner in the options array
    $winnerIndex = array_search($winnerName, $options);
    
    if ($winnerIndex !== false) {
        // Calculate the angle based on the winner's index
        $spinAngle = ($winnerIndex * (360 / count($options))) + (360 / count($options) / 2); // Center the angle
    } else {
        // If the winner is not found in the predefined list, generate a random spin angle
        $spinAngle = 360 * 5 + rand(0, 360)+10;
    }
} else {
    // If no winner is found, generate a random spin angle
    $spinAngle = 360 * 5 + rand(0, 360);
}

// Data to send to clients
$data = ['angle' => $spinAngle];

// Trigger event on channel
$pusher->trigger('chittiD-channel', 'chittiD-event', $data);

// Return JSON response
echo json_encode(['success' => true, 'angle' => $spinAngle]);
?>
