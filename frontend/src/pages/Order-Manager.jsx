import React,{useEffect, useState} from "react";
import {useNavigate } from "react-router-dom";

export default function Order_Manager(){
    const [order,setOrder] = useState([]);
    const [orderDetail,setOrderDetail] = useState([]);
    const navigate = useNavigate();

    const LoadOrder = () =>{
        fetch("/api/order.php?action=all")
        .then((response)=>response.json())
        .then((data)=> setOrder(data))
        .catch((err)=>console.error(err));

         fetch("/api/order.php?action=ordDetail")
        .then((response)=>response.json())
        .then((data)=> setOrderDetail(data))
        .catch((err)=>console.error(err));
    }

    useEffect(()=>{
        LoadOrder();
    },[]);

    // console.log("Order",order);

    const handleRowClick = (sp) =>{
        const orderDetails = orderDetail.filter((ord)=> ord.OrderID == sp.orderID);
        const subOrder = order.find((s)=>s.orderID == sp.orderID);

        navigate("/Order-Detail",{state:{subOrder,orderDetails}});
    }

    return(
        <div className="form-product-container">
            <h2>Danh sách đơn hàng</h2>
            <div className="List-product_manager">
                <table>
                    <thead>
                        <tr>
                            <th style={{"--i":"15%"}}>Tên</th>
                            <th style={{"--i":"10%"}}>Bàn</th>
                            {/* <th style={{"--i":"10%"}}>Trạng thái</th> */}
                            <th style={{"--i":"15%"}}>Ghi chú</th>
                            <th style={{"--i":"15%"}}>SDT</th>
                            <th style={{"--i":"10%"}}>Giá</th>
                            <th style={{"--i":"15%"}}>Trạng thái</th>
                            {/* <th style={{"--i":"10%"}}>Xóa</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            order.map((sp)=>(
                                <tr className="item" key={sp.productID} onClick={() => handleRowClick(sp)}>
                                    <td>{sp.OrderName}</td>
                                    <td>{sp.tableID}</td>
                                    {/* <td>{sp.detail}</td> */}
                                    <td>{sp.note}</td>
                                    <td>{sp.sdt}</td>
                                    <td>{Number(sp.total).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</td>
                                    <td>{sp.orderStatus}</td>
                                    {/* <td><button onClick={(event)=>{handleFormClick("delete",event)}}>Xóa</button></td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}