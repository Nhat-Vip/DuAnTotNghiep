<?php
header("Access-Control-Allow-Origin: *"); // Cho phép mọi nguồn gọi API
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/database.php";

$sql = "select prd.productName as 'productName', prd.price as 'price',sum(ord.total) as 'total', sum(ordt.quantity) as 'quantity' From orders ord join orderdetails ordt
        on ord.orderID = ordt.orderID
        join product prd on prd.productID = ordt.productID
        where ord.orderStatus = 'Xác nhận'
        group by ordt.productID;";


$statistical = [];

$result = $conn->query($sql);

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        $statistical[] = $row; 
    }
}

echo json_encode($statistical);

?>