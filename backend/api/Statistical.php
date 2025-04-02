<?php
header("Access-Control-Allow-Origin: *"); // Cho phép mọi nguồn gọi API
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/database.php";

function GetProduct(){
    global $conn;

    $sql = "select prd.productName as 'productName',MIN(ord.orderDate), prd.price as 'price',SUM(ordt.quantity * prd.price) as 'total', sum(ordt.quantity) as 'quantity' From orders ord join orderdetails ordt
            on ord.orderID = ordt.orderID
            join product prd on prd.productID = ordt.productID
            where ord.orderStatus = 'Đã thanh toán'
            group by ordt.productID;";


    $statistical = [];

    $result = $conn->query($sql);

    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $statistical[] = $row; 
        }
    }

    echo json_encode($statistical);
}
function GetIngredient(){
    global $conn;

    $sql = "SELECT si.quantity,us.fullName as 'userName',si.IngredientName,
            si.stIngredientDate as 'orderDate',si.note FROM statistical_ingredient si 
            join users us on si.userID = us.userID;";


    $statistical = [];

    $result = $conn->query($sql);

    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $statistical[] = $row; 
        }
    }

    echo json_encode($statistical);
}
function GetOrder(){
    global $conn;

    $sql = "SELECT * FROM orders ord
            join users us on ord.userID = us.userID;";


    $statistical = [];

    $result = $conn->query($sql);

    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $statistical[] = $row; 
        }
    }

    echo json_encode($statistical);
}

$action = $_GET["action"];

if($action == "product"){
    GetProduct();
}
elseif($action == "ingredient"){
    GetIngredient();
}
elseif($action == "order"){
    GetOrder();
}
else{
    echo json_encode("Can't not found $action");
}


?>