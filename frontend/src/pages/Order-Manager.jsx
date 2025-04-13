import React,{useEffect, useState} from "react";
import {useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Order_Manager(){
    const [order,setOrder] = useState([]);
    const [subOrder,setSubOrder] = useState([]);
    const [orderDetail,setOrderDetail] = useState([]);
    // const [tableSelected,setTableSelected] = useState(0);
    const [table,setTable] = useState([]);
    const [text,setText] = useState("");
    const navigate = useNavigate();

    const LoadOrder = () =>{
        fetch("/api/order.php?action=all")
        .then((response)=>response.json())
        .then((data)=> {setOrder(data);setSubOrder(data)})
        .catch((err)=>console.error(err));

         fetch("/api/order.php?action=ordDetail")
        .then((response)=>response.json())
        .then((data)=> setOrderDetail(data))
        .catch((err)=>console.error(err));
    }

    useEffect(()=>{
        LoadOrder();
    },[]);

    useEffect(() =>{
            fetch("/api/table.php?action=get")
            .then((response)=> response.json())
            .then((data)=>{
                setTable(data);
            })
            .catch((err)=>console.error("Lỗi: ",err));
    
            // if(localStorage.getItem("role")==""){
            //     // document.body.style.overflow = "hidden";
            //     document.getElementById("order-delivery").style.display = "grid";
            //     document.getElementById("order-total").style.display = "none";
            // }
            // else{
            //     document.getElementById("order-delivery").style.display = "none";
            //     document.getElementById("order-total").style.display = "grid";
            // }
        },[]);

    // console.log("Order",order);

    const handleRowClick = (sp) =>{
        const orderDetails = orderDetail.filter((ord)=> ord.OrderID == sp.orderID);
        const subOrder = order.find((s)=>s.orderID == sp.orderID);

        navigate("/Order-Detail",{state:{subOrder,orderDetails}});
    }

    const sort = (type) =>{
        if(type == "table"){
            const newOrders = [...order].sort((a,b)=>a.tableID - b.tableID);
            setSubOrder(newOrders);
        }
        else if(type == "date"){
            const newOrders = [...order].sort((a,b) => new Date(a.orderDate) -  new Date(b.orderDate));
            setSubOrder(newOrders);
        }
    }

    const search = async() =>{
        const response = await fetch(`/api/order.php?action=find&id=${text}`);
        const text2 = await response.text();
        console.log("Raw response: ",text2);

        const result = JSON.parse(text2);
        console.log("Kết quả từ server: ",result);
        if(result.status == "Error"){
           toast.error("Không tìm thấy đơn hàng",{position:"top-center"});
        }
        else{
            setSubOrder(result);
        }
    }

    const filterByTable = (e) =>{
        const newOrders = order.filter((ord)=>{
            return(
                ord.tableID == e.target.value 
            )
        });
        setSubOrder(newOrders);
    }

    return(
        <div className="form-product-container">
            <ToastContainer />
            <h2>Danh sách đơn hàng</h2>
            <div className="Search">
                <label htmlFor="search">
                    <input value={text} onChange={(e)=>setText(e.target.value.replace(/[^/.\d]/,""))} type="text" name="search" placeholder="Tra cứu đơn hàng theo số điện thoại"/>
                    <button onClick={search}>Tìm</button>
                </label>

                <select name="table" id="table"  onChange={(e)=>filterByTable(e)}>
                            {
                                table.map((tbl, key) => (
                                    <option key={key} value={tbl.tableID}>{tbl.tableID}</option>
                                ))
                            }
                        </select>
            </div>
            <div className="List-product_manager">
                <table>
                    <thead>
                        <tr>
                            <th style={{"--i":"15%"}}>Tên</th>
                            <th style={{"--i":"10%"}}>Bàn <FontAwesomeIcon className="sort" onClick={()=>sort("table")} icon={faArrowUpShortWide} /></th>
                            {/* <th style={{"--i":"10%"}}>Trạng thái</th> */}
                            <th style={{"--i":"15%"}}>Ghi chú</th>
                            <th style={{"--i":"15%"}}>Thời gian <FontAwesomeIcon className="sort" onClick={()=>sort("date")} icon={faArrowUpShortWide} /></th>
                            <th style={{"--i":"15%"}}>SDT</th>
                            <th style={{"--i":"10%"}}>Giá</th>
                            <th style={{"--i":"15%"}}>Trạng thái</th>
                            {/* <th style={{"--i":"10%"}}>Xóa</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            subOrder.map((sp)=>(
                                <tr className="item" key={sp.productID} onClick={() => handleRowClick(sp)}>
                                    <td>{sp.OrderName}</td>
                                    <td>{sp.tableID}</td>
                                    {/* <td>{sp.detail}</td> */}
                                    <td>{sp.note}</td>
                                    <td>{sp.orderDate}</td>
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