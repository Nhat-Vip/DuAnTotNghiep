import React ,{useEffect,useState} from "react";
// import "../index.css"

export default function User(){
    const [user,setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState({
        name: "",
        email: "",
        sdt: "",
        role: "",
        psw: "",
        status: ""
    });

    useEffect(()=>{
        fetch("http://coffee.local/api/Users.php")
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data)
            setUser(data)
        })
        .catch((error)=> console.log(error));

    },[])

    const handleRowClick = (sp) => {
        setSelectedUser({
            name: sp.fullName,
            email: sp.email,
            sdt: sp.sdt,
            psw: sp.userPwd,
            status: sp.userStatus == 1 ? "Hoạt động" : "Ngưng hoạt động",
            role: sp.userRole == 0 ? "Nhân viên" : "Sếp"
        });
    };

    return(
        <div className="form-product-container">
            <div className="form-product">
                <h2>User</h2>
                <form method="post">
                    <input value={selectedUser.name} onChange={(e) => setSelectedUser(e.target.value)} style={{"--i":"65%"}} type="text" placeholder="Tên nhân viên"/>
                    <input value={selectedUser.email} onChange={(e) => setSelectedUser(e.target.value)} style={{"--i":"30%"}} type="text" placeholder="Email"/>
                    <input value={selectedUser.sdt} onChange={(e) => setSelectedUser(e.target.value)} style={{"--i":"50%"}} type="text" placeholder="Số điện thoại"/>
                    {/* <input value={selectedProduct.quantity} style={{"--i":"30%"}} type="text" placeholder="Số lượng"/> */}
                    <input value={selectedUser.psw} onChange={(e) => setSelectedUser(e.target.value)} type="password" placeholder="Mật khẩu" style={{"--i":"45%"}}/>
                    <select  name="type" id="type" style={{"--i":"50%"}}>
                        <option value="Nhân viên">Nhân viên</option>
                        <option value="Sếp">Sếp</option>
                    </select>
                    <select  name="status" id="status" style={{"--i":"45%"}}>
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                    </select>
                    <input type="submit" value="Thêm sản phẩm" style={{"--i":"45%"}}/>
                    <input type="button" value="Sửa" style={{"--i":"45%"}}/>
                </form>
            </div>
            <div className="List-product_manager">
                <h2>Danh sách sản phẩm</h2>
                <table>
                    <thead>
                        <tr>
                            <th style={{"--i":"15%"}}>Ảnh</th>
                            <th style={{"--i":"15%"}}>Tên sản phẩm</th>
                            <th style={{"--i":"10%"}}>Giá</th>
                            <th style={{"--i":"10%"}}>Trạng thái</th>
                            <th style={{"--i":"20%"}}>Chi tiết</th>
                            <th style={{"--i":"15%"}}>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            user.map((sp,key)=>(
                                <tr className="item" key={key} onClick={() => handleRowClick(sp)}>
                                    <td>{sp.fullName}</td>
                                    <td>{sp.email}</td>
                                    <td>{sp.sdt}</td>
                                    <td>{sp.userRole == 0 ? "Nhân viên" : "Sếp"}</td>
                                    <td>{sp.userStatus == 0 ? "Ngưng hoạt động" : "Hoạt động"}</td>
                                    {/* <td>{sp.productType}</td> */}
                                    <td><button>Xóa</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}