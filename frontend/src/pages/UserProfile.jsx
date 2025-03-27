import React from "react";
import { Link} from "react-router-dom";

export default function UserProfile(){

    return(
        <div className="userProfile">
            <h2>Thông tin cá nhân</h2>
            <form>
                <label for="fullname">* Họ tên</label>
                <input type="text" id="fullname" value=""/>

                <label for="phone">* Số điện thoại</label>
                <input type="tel" id="phone" value="" />

                {/* <label for="dob">* Ngày sinh</label>
                <input type="date" id="dob" value="2003-06-12" /> */}

                <label for="email">* Email</label>
                <input type="email" id="email" value="" />

                <label for="role">Vai trò</label>
                <input type="text" id="role" value="" disabled />


                <label for="gender">Giới tính</label>
                <select id="gender">
                    <option selected>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                </select>

                <Link to="/Change-Password">Đổi mật khẩu?</Link>
                <button type="submit">Cập nhật</button>
            </form>
        </div>
    );
}