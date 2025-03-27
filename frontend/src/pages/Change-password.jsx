import React from "react";

export default function ChangePassword(){

    return(
        <div class="Change-password">
            <h2>Đổi mật khẩu</h2>
            <form id="change-password-form">
                <label for="current-password">* Mật khẩu hiện tại</label>
                <input type="password" id="current-password" placeholder="Nhập mật khẩu hiện tại" required/>

                <label for="new-password">* Mật khẩu mới</label>
                <input type="password" id="new-password" placeholder="Nhập mật khẩu mới" required/>

                <label for="confirm-password">* Xác nhận mật khẩu mới</label>
                <input type="password" id="confirm-password" placeholder="Nhập lại mật khẩu mới" required/>

                <button type="submit">Cập nhật mật khẩu</button>
            </form>
        </div>
    )
}