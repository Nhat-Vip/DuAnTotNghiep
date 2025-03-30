import React,{useState} from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword(){
    const [oldPwd,setOldPwd] = useState(null);
    const [newPwd,setNewPwd] = useState(null);
    const [confirmPwd,setConfirmPwd] = useState(null);
    const [showPassword,setShowPassword] = useState(false);
    const navigate = useNavigate();


    const changePassword = async(e) =>{
        e.preventDefault();
        if(oldPwd == ""||newPwd == "" || confirmPwd == ""){
            alert("Không đc để trống dữ liệu");
            return;
        }
        else if(newPwd != confirmPwd){
            alert("Mật khẩu mới phải giống xác nhận mật khẩu");
            return
        }

        const response = await fetch(`/api/Users.php?action=change&id=${localStorage.getItem("userID")}`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                newPwd: newPwd,
                oldPwd: oldPwd
            })
        });

        const text = await response.text();

        console.log("Raw response: ",text);

        const result = JSON.parse(text);

        console.log("Kết quả từ server: ",result);

        alert(result.message);
        if(result.status == "Success"){
            localStorage.setItem("userID","");
            localStorage.setItem("status","");
            localStorage.setItem("role","");
            navigate("/Login");
        }



    }


    return(
        <div className="Change-password">
            <h2>Đổi mật khẩu</h2>
            <form id="change-password-form">
                <label htmlFor="current-password">* Mật khẩu hiện tại</label>
                <input type={showPassword ? "text" : "password"} id="current-password" placeholder="Nhập mật khẩu hiện tại" onChange={(e)=>setOldPwd(e.target.value)} required/>

                <label htmlFor="new-password">* Mật khẩu mới</label>
                <input type={showPassword ? "text" : "password"} id="new-password" placeholder="Nhập mật khẩu mới" onChange={(e)=>setNewPwd(e.target.value)} required/>

                <label htmlFor="confirm-password">* Xác nhận mật khẩu mới</label>
                <input type={showPassword ? "text" : "password"} id="confirm-password" placeholder="Nhập lại mật khẩu mới" onChange={(e)=>setConfirmPwd(e.target.value)} required/>

                <label htmlFor="togglePassword">Hiển thị mật khẩu
                    <input type="checkbox" id="togglePassword" onChange={()=>setShowPassword((prev)=>!prev)}/> 
                </label>


                <button type="submit" onClick={(e)=>changePassword(e)}>Cập nhật mật khẩu</button>
            </form>
        </div>
    )
}