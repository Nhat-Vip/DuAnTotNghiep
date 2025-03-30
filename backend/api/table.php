<?php
header("Access-Control-Allow-Origin: *"); // Cho phép mọi nguồn gọi API
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

    include_once "../config/database.php";

    function getTable(){
        global $conn;

        $sql = "SELECT*from tbltable";

        $result = $conn->query($sql);

        $table = [];

        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                $table[] = $row;
            }
        }
        echo json_encode($table,JSON_UNESCAPED_UNICODE);
        exit();
    }

    $action = $_GET["action"];

    if($action == "get"){
        getTable();
    }
    else{
        echo json_encode(["status"=>"Error","message"=>"Can't not found action: $action"]);
    }
?>