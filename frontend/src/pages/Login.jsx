import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "../login.css"


export default function Login(){
    const[userName,setUserName] = useState("");
    const[userPwd,setUserPwd] = useState("");

    const navigate = useNavigate();

    const handleLogin = async(event)=>{
        event.preventDefault();

        const response = await fetch("/api/login.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({userName,userPwd})
        });

        const result = await response.json();
        console.log(result);

        if(result.status =="Success"){
            localStorage.setItem("role",result.role);
            localStorage.setItem("userID",result.userID);
            localStorage.setItem("status",1);
            navigate("/home");
        }
        else {
            alert(result.message); // Báo lỗi nếu sai tài khoản
        }
    }

    return (
        <>
            <div className="wrapper-container">
                <a href="/home">X</a>
                <div className="wrapper">
                    <div className="login_box">
                        <div className="login-header">
                            <span>Login</span>
                        </div>
                
                        <div className="input_box">
                            <input type="text" id="user" className="input-field" required onChange={(e)=>setUserName(e.target.value)}/>
                            <label htmlFor="user" className="label">Username</label>
                            <i className="bx bx-user icon"></i>
                        </div>
                
                        <div className="input_box">
                            <input type="password" id="pass" className="input-field" required onChange={(e)=>setUserPwd(e.target.value)}/>
                            <label htmlFor="pass" className="label">Password</label>
                            <i className="bx bx-lock-alt icon"></i>
                        </div>
                
                        <div className="input_box">
                            <input type="submit" className="input-submit" onClick={handleLogin} value="Login" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}