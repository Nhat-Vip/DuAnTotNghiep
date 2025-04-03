<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *"); // Cho phép mọi nguồn gọi API
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/database.php";


require __DIR__ . '/../vendor/autoload.php';

use Kreait\Firebase\Factory;

ini_set('display_errors', 1);
error_reporting(E_ALL);


$factory = (new Factory)
    ->withServiceAccount(__DIR__ . '/coffeeshopmanager-7ec48-firebase-adminsdk-fbsvc-f7ae2e149d.json')
    ->withDatabaseUri('https://coffeeshopmanager-7ec48-default-rtdb.asia-southeast1.firebasedatabase.app/');

$database = $factory->createDatabase();
function GetAll()
{
    global $conn;
    $sql = "SELECT * from orders where orderStatus != 'Đã thanh toán' and orderStatus != 'Đã hủy'";

    $order = [];

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $order[] = $row;
        }
    }

    echo json_encode($order, JSON_UNESCAPED_UNICODE);
}

function GetAllOrdDetail()
{
    global $conn;
    $sql = "SELECT * from orderdetails";

    $order = [];

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $order[] = $row;
        }
    }

    echo json_encode($order, JSON_UNESCAPED_UNICODE);
}

function FindOrder(){
    global $conn;
    $orderId = $_GET['id'] ?? "";
    if(empty($orderId)){
        echo json_encode("OrderID: $orderId");
        exit();
    }
    preg_match('/DH(\d+)/',$orderId,$matches);
    if(!empty($matches)){
        $orderId = end($matches);
    }
    $result = $conn->query("SELECT*from orders where orderID = '$orderId' or sdt = '$orderId' AND orderStatus NOT IN ('Hoàn thành', 'Đã hủy', 'Đã thanh toán')");
    $order = [];
    if($result->num_rows>0){
        while($row = $result->fetch_assoc()){
            $order[] = $row;
        }
    }
    else{
        echo json_encode(["id"=>"$orderId","status"=>"Error","message"=>"Không tìm thấy đơn hàng"]);
        exit();
    }

    echo json_encode($order, JSON_UNESCAPED_UNICODE);
    exit();
}

function InsertOrder()
{
    $data = json_decode(file_get_contents("php://input"), true);

    $order = $data["information"];
    $orderName = $order["orderName"];
    $sdt = !empty($order["sdt"]) ? "'". $order["sdt"] ."'" : "'0000000000'";
    $userID = !empty($order["userID"]) ? "'" . $order["userID"] . "'" : "NULL";
    $tableID = $order["tableID"];
    $total = $order["total"];
    $note = $order["note"] ?? "";
    $orderStatus = $order["orderStatus"];
    // exit();
    if (empty($orderName)) {
        $orderName = "Khách lẻ";
    }

    if(!preg_match("/^\d{10,11}$/",str_replace("'","",$sdt))){
        echo json_encode(["status"=>"Error","message"=>"Số điện thoại không hợp lệ"]);
        exit();
    }

    global $conn;
    $conn->begin_transaction();
    $sql = "Insert into orders(OrderName,sdt,userID,tableID,total,note,orderStatus)
            Values('$orderName',$sdt,$userID,'$tableID','$total','$note','$orderStatus')";

    if ($conn->query($sql) == true) {
        $orderID = $conn->insert_id;

        foreach ($data["products"] as $item) {

            if($item["quantity"] == 0){
                continue;
            }

            $quantity = $item["quantity"] ?? 1;
            $subTotal = (int)$quantity * (int)$item["price"];
            $productID = $item["productID"]??$item["id"];

            $sql = "Insert into orderdetails(subtotal,quantity,productID,OrderID)
                    Values('$subTotal','$quantity','$productID','$orderID')";
            if ($conn->query($sql) == false) {
                $conn->rollback();
                echo json_encode(["status" => "error", "message" => "Thêm đơn hàng thất bại s"]);
                exit();
            }
        }
    } elseif ($conn->error) {
        global $orderID;

        $conn->rollback();
        echo json_encode(["status" => "error", "message" => "Thêm đơn hàng thất bại " . $conn->error]);
        exit();
    }
    $conn->commit();




    global $database;

    if (!$data || !isset($data["products"])) {
        echo json_encode(["error" => "Dữ liệu JSON không hợp lệ"]);
        exit;
    }

    $database->getReference("orders/$orderID")->set($data);

    echo json_encode(["orderID" => "$orderID","status" => "Success", "message" => "Đơn hàng đã gửi đi"]);
    exit();
}

function UpdateOrder()
{
    global $conn;

    $data = json_decode(file_get_contents("php://input"),true);
    $id = $data["id"] ?? "";
    $status = $data["status"] ?? "";
    $total = $data["total"];
    $sql = "UPDATE orders
            set orderStatus = '$status',
            total = '$total'
            where orderID = '$id'";

    if (empty($id)) {
        echo json_encode(["status" => "Error", "message" => "ID đơn hàng không tồn tại"]);
        exit();
    }
    if ($conn->query($sql) == true) {
        global $database;
        $database->getReference("orders/$id")->update(["status" => $status]);
        echo json_encode(["orderID"=>"$id","status" => "Success", "message" => "Cập nhật thành công"]);
        exit();
    } else {
        echo json_encode(["status" => "Error", "message" => "Cập nhật thất bại"]);
        exit();
    }
    
}

$action = $_GET["action"];

if ($action == "insert") {
    InsertOrder();
} elseif ($action == "update") {
    UpdateOrder();
} elseif ($action == "all") {
    GetAll();
} elseif ($action == "ordDetail") {
    GetAllOrdDetail();
}
elseif($action == "find"){
    FindOrder();
}
else {
    echo json_encode(["error" => "Invalid action"], JSON_UNESCAPED_UNICODE);
    exit();
}



// if ($_SERVER["REQUEST_METHOD"] == "POST") {
//     $name = $_POST["name"];
//     $price = $_POST["price"];
//     $quantity = $_POST["quantity"];

//     $orderData = [
//         'name' =>$name,
//         'price' => $price,
//         'quantity' => $quantity,
//         'time' => time()
//     ];

//     $database->getReference('orders')->push($orderData);

//     echo json_encode(["message" => "Đơn hàng đã gửi lên Firebase!"]);
// }
