import React from "react";
import "../login.css"


export default function Login(){
    return (
        <>
            <div className="wrapper-container">
                <a href="/">X</a>
                <div className="wrapper">
                    <div className="login_box">
                        <div className="login-header">
                            <span>Login</span>
                        </div>
                
                        <div className="input_box">
                            <input type="text" id="user" className="input-field" required />
                            <label for="user" className="label">Username</label>
                            <i className="bx bx-user icon"></i>
                        </div>
                
                        <div className="input_box">
                            <input type="password" id="pass" className="input-field" required />
                            <label for="pass" className="label">Password</label>
                            <i className="bx bx-lock-alt icon"></i>
                        </div>
                
                        <div className="input_box">
                            <input type="submit" className="input-submit" value="Login" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}