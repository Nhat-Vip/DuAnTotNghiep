import React, { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";

export default function OrderDetail(){
    const location = useLocation();
    const {subOrder,orderDetails} = location.state;
    const [product,setProduct] = useState([]);
    const [status,setStatus] = useState(subOrder.orderStatus);
    const navigate = useNavigate();
    useEffect(()=>{
        fetch("/api/product.php?action=all")
        .then((response)=>response.json())
        .then((data)=>{
            setProduct(data);
        })
        .catch((err)=>console.error("Lỗi: ",err));
    },[]);

    
    
    
    const handleUpdateClick = async(e) =>{
        e.preventDefault();
        const id = subOrder.orderID;

        const response = await fetch("/api/order.php?action=update",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id,status})
        });

        const text = await response.text();
        console.log("Raw response: ",text);

        const result = JSON.parse(text);
        console.log("Kết quả từ server: ",result);

        if(result.status == "Success"){
            alert(result.message);
        }
        else {
            alert(result.message);
        }
    }


    return(
        <>
            <div className="form-product-container">
                <div className="form-product">
                    <h2>Sản phẩm</h2>
                    <form method="post" encType="multipart/form-data">
                        <input name="productName" value={subOrder.OrderName} style={{"--i":"47%"}} type="text" placeholder="Tên sản phẩm" disabled/>

                        <input name="price" value={subOrder.total} style={{"--i":"47%"}} type="text" placeholder="Tổng" disabled />

                        <input value={"Bàn: "+subOrder.tableID} style={{"--i":"30%"}} type="text" placeholder="Số bàn" disabled/>
                        <select value={status} name="status" id="status" style={{"--i":"47%"}} onChange={(e)=>setStatus(e.target.value)}>
                            <option value="Xác nhận">Xác nhận</option>
                            <option value="Đang làm">Đang làm</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            <option value="Đã thanh toán">Đã thanh toán</option>
                            <option value="Đã hủy">Đã hủy</option>
                        </select>
                        <input name="detail" value={subOrder.note} type="text" placeholder="Ghi chú" style={{"--i":"100%"}} disabled/>
                        <input type="button" value="Cập nhật" style={{"--i":"100%"}} onClick={(event)=>{handleUpdateClick(event)}}/>
                    </form>
                </div>
                <div className="List-product_manager">
                    <h2>Danh sách sản phẩm</h2>
                    <table>
                        <thead>
                            <tr>
                                <th style={{"--i":"25%"}}>Tên sản phẩm</th>
                                <th style={{"--i":"20%"}}>Số lượng</th>
                                <th style={{"--i":"25%"}}>Giá</th>
                                {/* <th style={{"--i":"10%"}}>Trạng thái</th>
                                <th style={{"--i":"20%"}}>Chi tiết</th>
                                <th style={{"--i":"15%"}}>Loại</th>
                                <th style={{"--i":"10%"}}>Xóa</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderDetails.map((sp) => {
                                    return(
                                        <tr className="item" key={sp.productID}>
                                            {/* <td><img src={sp.image_path} alt="product"/></td> */}
                                            <td>{product.find((prd)=>Number(prd.productID) == Number(sp.productID))?.productName}</td>
                                            <td>{sp.quantity}</td>
                                            <td>{Number(sp.subtotal).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</td>
                                            {/* <td>{sp.detail}</td>
                                            <td>{sp.productType}</td>
                                            <td><button onClick={(event)=>{handleFormClick("delete",event)}}>Xóa</button></td> */}
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="close" onClick={()=>navigate("/Manager/Order")}>
                X
            </div>
        </>
    )
}