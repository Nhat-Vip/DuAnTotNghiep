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
    $fullName = !empty($_POST["fullName"]) ? $conn->real_escape_string($_POST["fullName"]) : "";
    $email = !empty($_POST["email"]) ? $conn->real_escape_string($_POST["email"]) : "";
    $sdt = !empty($_POST["sdt"]) ? $conn->real_escape_string($_POST["sdt"]) : "";
    $userPwd = !empty($_POST["pwd"]) ? $conn->real_escape_string($_POST["pwd"]) : "";
    $userRole = !empty($_POST["role"]) ? $conn->real_escape_string($_POST["role"]) : "0";
    $userStatus = !empty($_POST["status"]) ? $conn->real_escape_string($_POST["status"]) : "";
    $userID = !empty($_POST["userID"]) ? $conn->real_escape_string($_POST["userID"]) : "";
    
}

function GetUser(){
    global $conn;
    $id = $_GET["id"];
    if(empty($id)){
        echo json_encode(["status"=>"Error","message"=>"ID không đúng"]);
        exit();
    }


    $sql = "SELECT * From users where userID = '$id'";

    $result = $conn->query($sql);

    $user = [];

    if($result->num_rows>0){
        $user = $result->fetch_assoc();
    }

    echo json_encode($user,JSON_UNESCAPED_UNICODE);
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

function updateuserProfile(){
    global $conn,$sdt,$email;
    $id = $_GET["id"];

    if(empty($email) || empty($sdt)){
        echo json_encode(["status" => "Error", "message" => "Không đc để trống dữ liệu"]);
        exit();
    }
    elseif(!filter_var($email,FILTER_VALIDATE_EMAIL)){
        echo json_encode(["status" => "Error", "message" => "Email không hợp lệ"]);
        exit();
    } 
    elseif (!preg_match("/^\d{10,11}$/", $sdt)) {
        echo json_encode(["status" => "Error", "message" => "Vui lòng nhập đúng định dạng số điện thoại"]);
        exit();
    }

    $sql = "UPDATE users
            Set sdt = '$sdt',
                email = '$email'
            Where userID = '$id'";
    if($conn->query($sql) == true){
        echo json_encode(["status"=>"Success","message"=>"Cập nhật thành công"]);
        exit();
    }
    else{
        echo json_encode(["status" => "Error", "message" => "Cập nhật không thành côngcông"]);
        exit();
    }

}
function ChangePwd(){
    global $conn;
    $id = $_GET["id"];

    $data = json_decode(file_get_contents("php://input"),true);

    $oldPwd = $data["oldPwd"];
    $newPwd = $data["newPwd"];

    $check = $conn->query("SELECT*from users where userID = '$id'");
    if($check->num_rows>0){
        $checkPwd = $check->fetch_assoc();

        if(!password_verify($oldPwd,$checkPwd["userPwd"])){
            echo json_encode(["status"=>"Error","message"=>"Mật khẩu cũ không đúng"]);
            exit();
        }
    }
    $pwdHash =  password_hash($newPwd,PASSWORD_DEFAULT);
    $sql = "UPDATE users
            set userPwd = '$pwdHash'
            where userID = '$id'";
    $result = $conn->query(($sql));

    if($result == true){
        echo json_encode(["status"=>"Success","message"=>"Đổi mật khẩu thành công"]);
        exit();
    }
    else{
        echo json_encode(["status"=>"Error","message"=>"Đổi mật khẩu thất bại"]);
        exit();
    }


}

$action = $_GET["action"] ?? "";

if ($action == "insert"){
    insertUser();
}
elseif($action == "find"){
    GetUser();
}
elseif($action=="update"){
    updateUser();
}
elseif($action=="updateProfile"){
    updateuserProfile();
}
elseif($action=="delete"){
    removeUser();
}
elseif($action == "get"){
    getAll();
}
elseif($action == "change"){
    ChangePwd();
}

else{
    echo json_encode(["status"=>"Error","message"=>"Error $action"]);
    exit();
}
// getAll();
?>