import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function OrderTracking(){
    const [order,setOrder] = useState([]);
    const [text,setText] = useState("");

    const navigate = useNavigate()

    const findOrder = async() =>{
        console.log("DH: ",text);
        const response = await fetch(`/api/order.php?action=find&id=${text}`);
        const text2 = await response.text();
        console.log("Raw response: ",text);

        const result = JSON.parse(text2);
        console.log("Kết quả từ server: ",result);
        document.querySelector(".orderTracking_content").style.display = "flex";
        if(result.status == "Error"){
            document.querySelector(".orderTracking_content").innerHTML=
                `<h3>Không tìm thấy đơn hàng hãy kiểm tra lại số điện thoại hoặc mã đơn hàng</h3>`;
        }
        else{
            setOrder(result);
        }
        // .catch((err)=>console.error(err));
    }

    return(
        <div className="orderTracking_container">
            <div className="Search">
                <input type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Tra cứu đơn hàng theo số điện thoại hoặc mã đơn hàng"/>
                <button onClick={findOrder}>Tìm</button>
            </div>
            <div className="orderTracking_content">
                <table>
                    <thead>
                        <tr>
                            <th style={{"--i":"15%"}}>Mã DH</th>
                            <th style={{"--i":"20%"}}>SDT</th>
                            {/* <th style={{"--i":"10%"}}>Trạng thái</th> */}
                            <th style={{"--i":"30%"}}>Ghi chú</th>
                            <th style={{"--i":"15%"}}>Tổng tiền</th>
                            <th style={{"--i":"15%"}}>Trạng thái</th>
                            {/* <th style={{"--i":"15%"}}>Trạng thái</th> */}
                            {/* <th style={{"--i":"10%"}}>Xóa</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            order?.map((sp)=>(
                                <tr className="item" key={sp.productID}>
                                    <td>{"DH"+sp.orderID}</td>
                                    <td>{sp.sdt}</td>
                                    {/* <td>{sp.detail}</td> */}
                                    <td>{sp.note}</td>
                                    {/* <td>{sp.sdt}</td> */}
                                    <td>{Number(sp.total).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</td>
                                    <td>{sp.orderStatus}</td>
                                    {/* <td><button onClick={(event)=>{handleFormClick("delete",event)}}>Xóa</button></td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="close" onClick={()=>navigate("/home")}>
                X
            </div>
        </div>
    )
}