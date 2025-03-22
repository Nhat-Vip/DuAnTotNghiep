<?php
    header("Access-Control-Allow-Origin: *"); // Cho phép gọi API từ frontend
    header("Content-Type: application/json; charset=UTF-8");

    include_once "../config/database.php"; // Import kết nối database
    include_once "../config/upload.php"; // Import upload ảnh

    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header("Content-Type: application/json; charset=UTF-8");


    // Truy vấn danh sách sản phẩm
    function GetAllOfType()
    {
        global $conn;

        $sql = $sql = "SELECT * FROM product ORDER BY productType";;
        $result = $conn->query($sql);

        $products = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $type = $row["productType"];
                $products[$type][] = $row;
            }
        }

        // Trả về JSON
        echo json_encode($products, JSON_UNESCAPED_UNICODE);
    }

    function GetAll()
    {
        global $conn;
        $sql = "SELECT * FROM product";
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

    function UpdateProduct($id)
    {
        global $conn;

        if (!isset($_POST["productName"], $_POST["price"], $_POST["type"], $_POST["status"], $_POST["detail"])) {
            echo json_encode(["status" => "error", "message" => "Thiếu dữ liệu cần cập nhật"]);
            exit();
        }
        // $id = $conn -> real_escape_string(($_POST["id"]));

        // $id = (int)$id;
        // var_dump($id);

        $name = $conn->real_escape_string($_POST["productName"]);
        $price = $conn->real_escape_string($_POST["price"]);
        $type = $conn->real_escape_string($_POST["type"]);
        $status = $conn->real_escape_string($_POST["status"]);
        $detail = $conn->real_escape_string($_POST["detail"]);

        $image = isset($_FILES["image"]) ? $_FILES["image"] : null;

        $sql = "UPDATE product 
                SET productName = '$name', 
                    price = '$price', 
                    productStatus = '$status', 
                    detail = '$detail', 
                    productType = '$type'";

        if ($image !== null) {
            $result = upload($image);

            if ($result) { // Kiểm tra nếu upload thành công
                $image_path = "/Images/" . basename($image["name"]);
                $sql .= ", image_path = '$image_path'";
            }
        }

        // Thêm điều kiện WHERE
        $sql .= " WHERE productID = '$id'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Cập nhật thành công"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Lỗi khi cập nhật: " . $conn->error]);
        }
    }
    function InsertProduct(){
        global $conn;

        if (!isset($_POST["productName"], $_POST["price"], $_POST["type"], $_POST["status"], $_POST["detail"],$_FILES["image"])) {
            echo json_encode(["status" => "error", "message" => "Thiếu dữ liệu cần cập nhật"]);
            exit();
        }

        $name = $conn->real_escape_string($_POST["productName"]);
        $price = $conn->real_escape_string($_POST["price"]);
        $type = $conn->real_escape_string($_POST["type"]);
        $status = $conn->real_escape_string($_POST["status"]);
        $detail = $conn->real_escape_string($_POST["detail"]);

        $image = isset($_FILES["image"]) ? $_FILES["image"] : null;

        $image_path = "/Images/" . basename($image["name"]);

        $sql = "Insert into product
                Values ('','$name','$price','$image_path','$status','$detail','$type');
                ";
        $result = upload($image);

        if($conn->query($sql) === true){
            echo json_encode(["status"=>"success","message"=>"Thêm sản phẩm thành công"]);
        }
        else{
            echo json_encode(["status" => "error", "message" => "Lỗi khi thêm: " . $conn->error]);
        }
    }
    
    function DeleteProduct($id)
    {
        global $conn;
        $sql = "Delete from product
               Where productID = '$id';
               ";
        if($conn->query($sql) === true){
            echo json_encode(["status"=>"success","message" => "Xóa sản phẩm thành công"]);
        } 
        else {
            echo json_encode(["status" => "error", "message" => "Lỗi khi xóa: " . $conn->error]);
        }
    }


    $action = $_GET['action'] ?? ''; // Lấy action từ URL (nếu có)
    // $postAction = $_POST['action'] ?? '';
    $id = $_GET['id'] ?? $_POST['id'] ?? '';

    if ($action === "update") {
        if ($id) {
            UpdateProduct($id);
        }
    }
    elseif($action == "insert"){
        InsertProduct();
    }
    elseif($action == "delete"){
        DeleteProduct($id);
    }
    else if ($action === "all") {
        GetAll();
    } elseif ($action === "allOfType") {
        GetAllOfType();
    } else {
        echo json_encode(["error" => "Invalid action"], JSON_UNESCAPED_UNICODE);
    }
?>