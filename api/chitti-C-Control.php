<?php
header('Content-Type: text/html; charset=utf-8');
header("Access-Control-Allow-Origin: *");
require 'db_connection.php'; // Include your database connection file

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $winnerType = $_POST['winnerType'] ?? 'random';
    $specificWinner = $_POST['specificWinner'] ?? null;

    // Determine the winner name based on user selection
    if ($winnerType === 'specific' && $specificWinner) {
        $winnerName = $specificWinner;
        $isRandom = 0; // Not random
    } else {
        // Generate a random winner from the predefined list
        $options = [
              'SIJO JACOB',
'THOMAS (JESSY)',
'VICKY',
'JAIMON(JULIE)',
'JAISON(VINIMA)',
'ALI',
'JAYA(NISHA COLLEGUE)',
        ];
        $winnerName = $options[array_rand($options)]; // Select a random winner
        $isRandom = 1; // Random winner
    }

    // Delete existing entry if it exists
    $deleteStmt = $pdo->prepare("DELETE FROM chitti_C_Control");
    $deleteStmt->execute();

    // Store the result in the database
    $stmt = $pdo->prepare("INSERT INTO chitti_C_Control (winner_name, is_random) VALUES (?, ?)");
    $stmt->execute([$winnerName, $isRandom]);

    echo "<h2>Winner: $winnerName</h2>";
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chitti-C Control</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }
        select, button {
            padding: 10px;
            margin: 10px;
            width: 200px;
        }
    </style>
</head>
<body>

<h1>Chitti-C Control</h1>

<form method="POST" action="">
    <label for="winnerType">Select Winner Type:</label>
    <select id="winnerType" name="winnerType" onchange="toggleSpecificWinner()">
        <option value="random">Random Winner</option>
        <option value="specific">Specific Winner</option>
    </select><br>

    <label for="specificWinner">Specific Winner:</label>
    <select id="specificWinner" name="specificWinner" disabled>
        <option value="">Select a winner</option>
        <?php
        // Predefined options for specific winners
        $options = [
            'SIJO JACOB',
'THOMAS (JESSY)',
'VICKY',
'JAIMON(JULIE)',
'JAISON(VINIMA)',
'ALI',
'JAYA(NISHA COLLEGUE)',
        ];
        
        foreach ($options as $option) {
            echo "<option value=\"$option\">$option</option>";
        }
        ?>
    </select><br>

    <button type="submit">Spin</button>
</form>

<script>
function toggleSpecificWinner() {
    const winnerType = document.getElementById('winnerType').value;
    const specificWinnerSelect = document.getElementById('specificWinner');
    specificWinnerSelect.disabled = winnerType !== 'specific';
}
</script>

</body>
</html>
