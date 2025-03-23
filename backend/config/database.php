<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$server = "localhost";
$username = "root";
$port = 3307;
$password = "";
$dbname = "coffeeshopmanager";

$conn = new mysqli($server, $username, $password, $dbname,$port);

if ($conn->connect_error) {
    die(json_encode(["error" => "Kết nối thất bại: " . $conn->connect_error]));
}
