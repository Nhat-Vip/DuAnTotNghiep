<?php
header("Access-Control-Allow-Origin: *"); // Cho phép gọi API từ frontend
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/database.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $id = $conn->real_escape_string($_POST["id"]);
    $name = $conn->real_escape_string($_POST["name"]);
    $price = $conn->real_escape_string($_POST["price"]);
    $quantity = $conn->real_escape_string($_POST["quantity"]);
}

function check(){
    global $conn,$name,$price,$quantity,$action;

    if(!isset($name)||empty($name)){
        echo json_encode(["status"=>"Error","message"=>"Không đc để trống tên nguyên liệu"]);
        exit();
    }
    elseif($conn->query("SELECT * from ingredient where ingredientName = '$name'")->num_rows>0 && $action == "insert"){
        echo json_encode(["status" => "Error", "message" => "Nguyên liệu đã tồn tại"]);
        exit();
    }
    elseif(!isset($price)){
        echo json_encode(["status" => "Error", "message" => "Không đc để giá trống"]);
        exit();
    }
    elseif(!is_int((int)$price)){
        echo json_encode(["status" => "Error", "message" => "Giá phải là số"]);
        exit();
    }
    elseif(!isset($quantity)){
        echo json_encode(["status" => "Error", "message" => "Không đc để trống số lượng"]);
        exit();
    }
    elseif(!is_int((int)$quantity)){
        echo json_encode(["status" => "Error", "message" => "Số lượng phải là số"]);
        exit();
    }
}

function GetAll(){
    global $conn;

    $sql = "Select * From ingredient";

    $ingredient = [];

    $result = $conn->query($sql);
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $ingredient[] = $row;
        }
    }
    echo json_encode($ingredient, JSON_UNESCAPED_UNICODE);
    exit();
}

function InsertIngredient(){
    global $conn,$name,$price,$quantity;

    check();

    $sql = "INSERT into ingredient(ingredientName,price,quantity)
            Values('$name','$price','$quantity')";

    if($conn->query($sql) == true){
        echo json_encode(["status"=>"Success","message"=>"Thêm nguyên liệu thành công"]);
    }
    else{
        echo json_encode(["status"=>"Error","message"=>"Thêm nguyên liệu thất bại"]);
    }
}
function UpdateIngredient(){
    global $conn,$id, $name, $price, $quantity;

    check();

    $sql = "UPDATE ingredient
            SET ingredientName = '$name',
                price ='$price',
                quantity = '$quantity'
            WHERE ingredientId = '$id' ";
    if($conn->query($sql) == true){
        echo json_encode(["status"=>"Success","message"=>"Cập nhật thành công"]);
    }
    else{
        echo json_encode(["status"=>"Error","message"=>"Cập nhật thất bại"]);
    }
}
function DeleteIngredient(){
    global $conn,$id;

    $sql = "DELETE from ingredient
            where ingredientId = '$id'";
    if($conn->query($sql) == true){
        echo json_encode(["status"=>"Success","message"=>"Xóa thành công"]);
    }
    else{
        echo json_encode(["status"=>"Error","message"=>"Xóa thất bại"]);
    }
}

$action = $_GET["action"];

if($action == "all"){
    GetAll();
}
elseif($action == "insert"){
    InsertIngredient();
}
elseif($action == "update"){
    UpdateIngredient();
}
elseif($action == "delete"){
    DeleteIngredient();
}
else{
    echo json_encode(["error" => "Invalid action"], JSON_UNESCAPED_UNICODE);
    exit();
}
?>