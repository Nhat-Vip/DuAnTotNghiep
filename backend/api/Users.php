<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/database.php";



function getAll() {
    global $conn;
    $sql = "SELECT * FROM users";
    $result = $conn->query($sql);

    $products = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }

    // Trả về JSON
    echo json_encode($products, JSON_UNESCAPED_UNICODE);
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $fullName = $conn->real_escape_string($_POST["fullName"]);
    $email = $conn->real_escape_string($_POST["email"]);
    $sdt = $conn->real_escape_string($_POST["sdt"]);
    $userPwd = $conn->real_escape_string($_POST["pwd"]);
    $userRole = $conn->real_escape_string($_POST["role"]);
    $userStatus = $conn->real_escape_string($_POST["status"]);
    $userID = $conn->real_escape_string($_POST["userID"]);
    
}

function check(){
    try{
        global $conn,$fullName, $email, $sdt, $userPwd, $action;
        if(!isset($fullName)){
            echo json_encode(["status"=>"Error","message"=>"Vui lòng nhập tên"]);
            exit();
        }
        elseif(!isset($email)){
            echo json_encode(["status"=>"Error","message"=>"Vui lòng nhập email"]);
            exit();
        }
        elseif(!filter_var($email,FILTER_VALIDATE_EMAIL)){
            echo json_encode(["status"=>"Error","message"=>"Email không hợp lệ"]);
            exit();
        }
        elseif($conn->query("Select*from users where email='$email'")->num_rows>0 && $action=="insert"){
            echo json_encode(["status"=>"Error","message"=>"Email đã tồn tại"]);
            exit();
        }
        elseif(!isset($sdt)){
            echo json_encode(["status"=>"Error","message"=>"Vui lòng nhập số điện thoại"]);
            exit();
        }
        elseif(!preg_match("/^\d{10,11}$/",$sdt)){
            echo json_encode(["status"=>"Error","message"=>"Vui lòng nhập đúng định dạng số điện thoại"]);
            exit();
        }
        elseif($conn->query("select*from users where sdt = '$sdt'")->num_rows>0 && $action == "insert"){
            echo json_encode(["status"=>"Error","message"=>"Số điện thoại đã tồn tại"]);
            exit();
        }
        elseif(!isset($userPwd) || empty($userPwd)){
            $userPwd = "123";
        }
    }
    catch(Exception $err){
        echo json_encode(["status"=>"Error","message"=>$err->getMessage()]);
        exit();
    }
}

function insertUser(){
    global $conn,$fullName,$email,$sdt,$userPwd,$userRole,$userStatus;

    $pwdHash = password_hash($userPwd,PASSWORD_DEFAULT);

    $sql = "Insert into users(fullName,email,sdt,userPwd,userRole,userStatus)
            Values('$fullName','$email','$sdt','$pwdHash','$userRole','$userStatus')";

    check();

    if($conn->query($sql)){
        echo json_encode(["status"=>"Success","message"=>"Thêm nhân viên thành công"]);
        exit();
    }
    else if($conn->error){
        echo json_encode(["status"=>"Error","message"=>"Thêm nhân viên thất bại, Lỗi: ". $conn->error]);
        exit();
    }
}
function updateUser(){
    global $conn, $fullName, $email, $sdt, $userPwd, $userRole, $userStatus, $userID;

    try{
        check();
        $pwdHash = password_hash($userPwd,PASSWORD_DEFAULT);
        $sql = "UPDATE users 
                Set fullName='$fullName',email='$email',sdt = '$sdt',userPwd = '$pwdHash'
                , userRole='$userRole',userStatus = '$userStatus'
                Where userID = '$userID'";
        // $conn->query("SET SQL_SAFE_UPDATES = 0;");
        if($conn->query($sql)==true){
            echo json_encode(["status"=>"Success","message"=>"Cập nhật thành công"]);
            exit();
        }
        else if($conn->error){
            echo json_encode(["status"=>"Error","message"=>"Cập nhật thất bại, Lỗi: ". $conn->error]);
            exit();
        }
    }
    catch(Exception $e){
        echo json_encode(["status"=>"Error","message"=>"Lỗi: ".$e->getMessage()]);
        exit();
    }
}

function removeUser(){
    global $conn,$userID;
    $sql = "Delete from users
            where userID = '$userID'";
    if($conn->query($sql) == true){
        echo json_encode(["status"=>"Success","message"=>"Xóa user thành công"]);
        exit();
    }
    else{
        echo json_encode(["status"=>"Error","message"=>"Xóa không thành công"]);
    }
}
$action = $_GET["action"] ?? "";

if ($action == "insert"){
    insertUser();
}
elseif($action=="update"){
    updateUser();
}
elseif($action=="delete"){
    removeUser();
}
elseif($action == "get"){
    getAll();
}
// getAll();
?>