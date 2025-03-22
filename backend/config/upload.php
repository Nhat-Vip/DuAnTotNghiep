<?php

function upload($image_path){
    $target_dir = realpath(__DIR__ . "/../../frontend/public/Images/") . DIRECTORY_SEPARATOR;;

    $target_file = $target_dir . basename($image_path["name"]);

    $upload_Status = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));


    // echo $target_dir;
    // echo $target_file;

    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }


    $check = getimagesize($_FILES["image"]["tmp_name"]);
    if($check){
        $upload_Status = 1;
    }
    else{
        $upload_Status = 0;
    }


    //Check xem file ảnh đã tồn tại chưachưa
    if (file_exists($target_file)) {
        //echo json_encode(["status"=>"error","message"=>"File already exits"]);
        return false;
    }

    //Giới hạn size
    if ($_FILES["image"]["size"] > 500000) {
        //echo json_encode(["status" => "error", "message" => "Sorry, your file is too large."]);
        return false;
    }

    // Giới hạn loại ảnh
    if (
        $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
        && $imageFileType != "gif"
    ) 
    {
        //echo json_encode(["status" => "error", "message" => "Sorry, only JPG, JPEG, PNG & GIF files are allowed."]);
        return false;
    }

    if ($upload_Status == 0) {
        //echo json_encode(["status" => "error", "message" => "Sorry, your file was not uploaded."]);
        return false;
    } 
    else 
    {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            // echo json_encode(["status" => "success", "image_path" => "/Images/" . basename($image_path["name"])]);
            // echo json_encode(["status" => "success", "message" => "Success"]);
            return true;
            // $respose = json_encode(["status" => "success", "image_path" => "/Images/" . basename($image_path["name"])]);
            // return $respose; //["status" => "success", "image_path" => "/Images/" . basename($image_path["name"])];
        } else {
            //echo json_encode(["status" => "error", "message" => "Sorry, there was an error uploading your file."]);
            return false;
        }
    }
}



?>