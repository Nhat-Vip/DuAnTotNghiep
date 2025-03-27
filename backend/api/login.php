<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"),true);
$userName = $data["userName"] ?? "";
$userPwd = $data["userPwd"] ?? "";



$sql = "Select * From users  where email = '$userName'";
$result = $conn->query($sql);

if($result->num_rows > 0){
    $user = $result->fetch_assoc();
    if(password_verify($userPwd,$user["userPwd"])){
        echo json_encode([
            "status"=>"Success",
            "message" => "Đăng nhập thành công",
            "userID" => $user["userID"],
            "role" => $user["userRole"]
        ]);
    }
    else{
        echo json_encode(["status"=>"Error","message"=>"Sai mật khẩu"]);
        exit();
    }
}
else
{
    echo json_encode(["status" => "error", "message" => "Sai tài khoản hoặc mật khẩu"]);
}
?>