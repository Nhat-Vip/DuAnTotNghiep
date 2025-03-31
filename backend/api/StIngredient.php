<?php
header("Access-Control-Allow-Origin: *"); // Cho phép gọi API từ frontend
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/database.php"; // Import kết nối database

if($_SERVER['REQUEST_METHOD'] == "POST"){
    $id = $conn->real_escape_string($_POST["id"]) ?? "";
    $ingredientId = $conn->real_escape_string($_POST["ingredientId"]) ?? "";
    $userID = $conn->real_escape_string($_POST["userID"]) ?? "";
    $subUserID = $conn->real_escape_string($_POST["subUserID"]) ?? "";
    $name = $conn->real_escape_string($_POST["name"]) ?? "";
    $quantity = $conn->real_escape_string($_POST["quantity"]) ?? "";
    $note = $conn->real_escape_string($_POST["note"]);
}

function check(){
    global $action, $subUserID, $userID, $quantity,$id,$note;

    if(!isset($quantity)){
        echo json_encode(["status"=>"Error","message"=>"Không đc để trống số lượng"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif(!is_float((float)$quantity)){
        echo json_encode(["status" => "Error", "message" => "Số lượng phải là số"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif($userID != $subUserID && $action == "update"){
        echo json_encode(["status"=>"Error","message"=>"Bạn không thể sửa thống kê của người khác"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif(!isset($id) && $action == "update"){
        echo json_encode(["status"=>"Error","message"=>"Chưa chọn nguyên liệu để sửa"], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

function GetAll(){
    global $conn;
    $todayStart = date("Y-m-d 00:00:00");
    $todayEnd = date("Y-m-d 23:59:59");

    $sql = "SELECT * FROM statistical_ingredient
    where stIngredientDate between '$todayStart' 
    and '$todayEnd'";

    $result = $conn->query($sql);

    $stIngredient = [];

    if ($result->num_rows>0){
        while($row = $result->fetch_assoc()){
            $stIngredient[] = $row;
        }
    }

    echo json_encode($stIngredient,JSON_UNESCAPED_UNICODE);
}

function Insert(){
    global $conn,$ingredientId,$userID,$quantity,$note,$name;
    check();
    if(!isset($note) || empty($note)){
        $note = 'Empty';
    }
    $sql = "INSERT into statistical_ingredient(ingredientId,userID,quantity,ingredientName,note)
            Values('$ingredientId','$userID','$quantity','$name','$note')";
    $sql2 = "UPDATE ingredient
             SET quantity = '$quantity'
             WHERE ingredientId = '$ingredientId'";

    $conn->begin_transaction();
    if($conn->query($sql2) == false){
        $conn->rollback();
        echo json_encode(["status" => "Error", "Thất bại"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    if($conn->query($sql) == true){
        echo json_encode(["status"=>"Success","message"=>"Thành công"], JSON_UNESCAPED_UNICODE);
    }
    else{
        $conn->rollback();
        echo json_encode(["status"=>"Error","Thất bại"], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $conn->commit();
}

function Update(){
    global $conn, $id, $quantity, $note;
    check();
    $sql = "UPDATE statistical_ingredient
            SET quantity = '$quantity',
                note = '$note'
            Where stIngredientId = '$id'";
    if($conn->query($sql) == true){
        echo json_encode(["status"=>"Success","message"=>"Thành công"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    else{
        echo json_encode(["status"=>"Error","message"=>"Thất bại"], JSON_UNESCAPED_UNICODE);
        exit();
    }
}
$action = $_GET["action"];

if($action == "all"){
    GetAll();
}
elseif($action == "insert"){
    Insert();
}
elseif($action == "update"){
    Update();
}
?>