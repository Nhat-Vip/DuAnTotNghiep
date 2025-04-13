import React ,{useEffect,useState,useRef} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "../index.css"

export default function User(){
    const [user,setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState({
        id: "",
        name: "",
        email: "",
        sdt: "",
        role: "Nhân viên",
        pwd: "",
        status: "Hoạt động"
    });
    const formRef = useRef(null);

    function loadUser(){
        fetch("/api/Users.php?action=get")
                .then((response)=>response.json())
                .then((data)=>{
                    console.log(data)
                    setUser(data)
                })
                .catch((error)=> console.log(error));
    }

    useEffect(()=>{
        loadUser();
    },[])

    const handleRowClick = (sp) => {
        setSelectedUser({
            id:sp.userID,
            name: sp.fullName,
            email: sp.email,
            sdt: sp.sdt,
            pwd: sp.userPwd,
            status: sp.userStatus == 1 ? "Hoạt động" : "Ngưng hoạt động",
            role: sp.userRole == 0 ? "Nhân viên" : "Sếp"
        });
    };
    const handleUserClick = async(event,type)=>{
        event.preventDefault();
        // Kiểm tra xem có đang xóa chính tk đang đăng nhập không
        console.log(localStorage.getItem("userID")+" "+event.target.parentNode.parentNode.dataset.id);
        if(localStorage.getItem("userID") == event.target.parentNode.parentNode.dataset.id){
            toast.error("Không thể tự xóa chính mình",{position:"top-center"});
            return;
        }

        const formData = new FormData();
        formData.append("fullName", selectedUser.name);
        formData.append("userID", type == "delete" ? event.target.parentNode.parentNode.dataset.id : selectedUser.id);
        formData.append("email",selectedUser.email);
        formData.append("sdt", selectedUser.sdt);
        formData.append("pwd", selectedUser.pwd);
        formData.append("status", selectedUser.status == "Hoạt động" ? 1 : 0);
        formData.append("role", selectedUser.role == "Nhân viên" ? 0 : 1);

        console.log(formData.status);
        try{
            const reponse = await fetch(`/api/Users.php?action=${type}`,{
                method:"POST",
                // headers:{"Content-Type":"application/json"},
                body:formData
            });

            const text = await reponse.text();
            console.log(text);

            if (!text) {
                console.error("Empty response from server");
                return;
            }

            try {
                const result = JSON.parse(text);
                console.log("Parsed JSON:", result);
            
                // const result = JSON.parse(text);
                // console.log("Kết quả từ server: ",result);

                if(result.status == "Success"){
                    toast.success(result.message,{position:"top-center"});
                    formRef.current.reset();
                    setSelectedUser({name: "",
                                    email: "",
                                    sdt: "",
                                    role: "",
                                    pwd: "",
                                    status: "Hoạt động"});
                    loadUser();
                }
                else{
                    toast.error(result.message,{position:"top-center"});
                }
            }
            catch (error) {
                console.error("Error parsing JSON:", error);
                return;
            }
        }
        catch(err){
            console.log("Error: ",err);
        }

    }
    return(
        <div className="form-product-container">
            <ToastContainer />
            <div className="form-product">
                <h2>User</h2>
                <form method="post" ref={formRef}>
                    <input value={selectedUser.name} onChange={(e) => setSelectedUser({...selectedUser,name:e.target.value})} style={{"--i":"45%"}} type="text" placeholder="Tên nhân viên"/>
                    <input value={selectedUser.email} onChange={(e) => setSelectedUser({...selectedUser,email:e.target.value})} style={{"--i":"45%"}} type="text" placeholder="Email"/>
                    <input value={selectedUser.sdt} onChange={(e) => setSelectedUser({...selectedUser,sdt:e.target.value})} style={{"--i":"45%"}} type="text" placeholder="Số điện thoại"/>
                    {/* <input value={selectedProduct.quantity} style={{"--i":"30%"}} type="text" placeholder="Số lượng"/> */}
                    <input onChange={(e) => setSelectedUser({...selectedUser,pwd:e.target.value})} type="password" placeholder="Mật khẩu" style={{"--i":"45%"}}/>
                    <select value={selectedUser.role}  name="type" id="type" style={{"--i":"45%"}} onChange={(e)=>setSelectedUser({...selectedUser,role:e.target.value})}>
                        <option value="Nhân viên">Nhân viên</option>
                        <option value="Sếp">Sếp</option>
                    </select>
                    <select value={selectedUser.status}  name="status" id="status" style={{"--i":"45%"}} onChange={(e)=>setSelectedUser({...selectedUser,status:e.target.value})}>
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                    </select>
                    <input type="submit" onClick={(e)=>handleUserClick(e,"insert")} value="Thêm" style={{"--i":"45%"}}/>
                    <input type="button" onClick={(e)=>handleUserClick(e,"update")} value="Sửa" style={{"--i":"45%"}}/>
                </form>
            </div>
            <div className="List-product_manager">
                <h2>Danh sách nhân viên</h2>
                <table>
                    <thead>
                        <tr>
                            <th style={{"--i":"15%"}}>Tên nhân viên</th>
                            <th style={{"--i":"15%"}}>Email</th>
                            <th style={{"--i":"10%"}}>Số điện thoại</th>
                            <th style={{"--i":"10%"}}>Vai trò</th>
                            <th style={{"--i":"20%"}}>Trạng thái</th>
                            <th style={{"--i":"15%"}}>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            user.map((sp,key)=>(
                                <tr className="item" key={key} data-id={sp.userID} onClick={() => handleRowClick(sp)}>
                                    <td>{sp.fullName}</td>
                                    <td>{sp.email}</td>
                                    <td>{sp.sdt}</td>
                                    <td>{sp.userRole == 0 ? "Nhân viên" : "Sếp"}</td>
                                    <td>{sp.userStatus == 0 ? "Ngưng hoạt động" : "Hoạt động"}</td>
                                    {/* <td>{sp.productType}</td> */}
                                    <td><button onClick={(e)=>{handleUserClick(e,"delete")}}>Xóa</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}