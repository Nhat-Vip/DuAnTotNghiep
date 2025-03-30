import React,{useEffect,useState} from "react";
import { data, Link} from "react-router-dom";

export default function UserProfile(){

    const [userProfile,setUserProfile] = useState({});
    const [sdt,setSdt] = useState("");
    const [email,setEmail] = useState("");

    useEffect(()=>{
        loadProfile();
    },[]);

    const loadProfile = () =>{
        fetch(`/api/Users.php?action=find&id=${localStorage.getItem("userID")}`)
                .then((response)=>response.json())
                .then((data)=>{
                    setUserProfile(data);
                    setEmail(data.email);
                    setSdt(data.sdt);
                });
    }

    const handleUpdateCLick = async(e) =>{
        e.preventDefault();

        const formData = new FormData();
        formData.append("sdt",sdt);
        formData.append("email",email);

        const response = await fetch(`/api/Users.php?action=updateProfile&id=${userProfile.userID}`,{
            method:"POST",
            body:formData
        });

        const text =  await response.text();
        console.log("Raw response: ",text);

        const result = JSON.parse(text);
        console.log("Kết quả từ server: ",result.message);
        alert(result.message);
        if(result.status){
            loadProfile();
        }


    }

    // console.log(userProfile);

    return(
        <div className="userProfile">
            <h2>Thông tin cá nhân</h2>
            <form>
                <label htmlFor="fullname">* Họ tên</label>
                <input type="text" id="fullname" value={userProfile?.fullName || ""} disabled/>

                <label htmlFor="phone">* Số điện thoại</label>
                <input type="tel" id="phone" value={sdt || ""} onChange={(e)=>setSdt(e.target.value)} />

                {/* <label htmlFor="dob">* Ngày sinh</label>
                <input type="date" id="dob" value="2003-06-12" /> */}

                <label htmlFor="email">* Email</label>
                <input type="email" id="email" value={email || ""} onChange={(e)=>{setEmail(e.target.value)}}/>

                <label htmlFor="role">Vai trò</label>
                <input type="text" id="role" value={userProfile.role == 1 ? "Quản lý" : "Nhân viên"} disabled />


                {/* <label htmlFor="gender">Giới tính</label>
                <select id="gender">
                    <option selected>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                </select> */}

                <Link to="/Change-Password">Đổi mật khẩu?</Link>
                <button type="submit" onClick={(e)=>handleUpdateCLick(e)}>Cập nhật</button>
            </form>
        </div>
    );
}