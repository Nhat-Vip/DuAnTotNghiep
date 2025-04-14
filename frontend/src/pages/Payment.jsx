import React,{useState,useEffect} from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { database, ref } from "../components/firebase";
import { onChildChanged } from "firebase/database";

export default function Payment(){

    // const [listProduct,setListProduct] = useState(localStorage.getItem("listProduct")?JSON.parse(localStorage.getItem("listProduct")) : []);
    const location = useLocation();
    const {total,orderDetails} = location.state;
    console.log(orderDetails);

    const [product,setProduct] = useState([]);
    // console.log(listProduct);
    // const total = localStorage.getItem("total");
    useEffect(()=>{
        const orderRef = ref(database,"orders");
        
        const unsubscribe = onChildChanged(orderRef,(snapshot)=>{
            // console.log("OrderID",localStorage.getItem("orderID"));
            console.log("snapShot2");
            const data = snapshot.val();
            const id = snapshot.key;
            const orderID = orderDetails.OrderID;
            // setOrderID(Number(localStorage.getItem("orderID")));
            console.log("Da nhan sk");
            console.log(id + "and" + orderID);
            if(data && Number(id) == orderID && data.information.status == "success"){
                console.log("OK ROI");
                alert("Thanh toán thành công");
                // document.getElementById("status").innerHTML =`Trạng thái: <b style={{color:"red"}}>${data.status}</b>`;
            }
        });
        return () => unsubscribe();
    },[]);

    useEffect(()=>{
            fetch("/api/product.php?action=all")
            .then((response)=>response.json())
            .then((data)=>{
                setProduct(data);
            })
            .catch((err)=>console.error("Lỗi: ",err));
        },[]);


    return(
            <div className="payment-container">
                    <h1><FontAwesomeIcon id="icon" icon={faCircleCheck} /> Đặt hàng thành công</h1>
                    <div className="payment-type">
                        <p>Hướng dẫn thanh toán</p>
                        <div className="payment-type-content">
                            <div className="payment-type_qr">
                                <p>Cách 1 : Mở app ngân hàng và quét QR</p>
                                <img src={`https://qr.sepay.vn/img?acc=0379530805&bank=MB&amount=${total}&des=DH${orderDetails.OrderID}&template=compact`} alt="qr-code" width={300} />
                                <span>Trạng thái: Chờ thanh toán ....</span>
                            </div>
                            <div className="payment-type_handmade">
                                <p>Cách 2: Chuyển khoản thủ công theo thông tin</p>
                                <div className="handmade-content">
                                    <img src="https://qr.sepay.vn/assets/img/banklogo/MB.png" alt="" />
                                    <p>Ngân hàng MB Bank</p>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Chủ tài khoản:</td>
                                                <td><b>Nguyễn Cự Nhật</b></td>
                                            </tr>
                                            <tr>
                                                <td>Số TK:</td>
                                                <td><b>0379530805</b></td>
                                            </tr>
                                            <tr>
                                                <td>Số tiền:</td>
                                                <td><b>{Number(total).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</b></td>
                                            </tr>
                                            <tr>
                                                <td>Nội dung CK: DH{orderDetails.OrderID}</td>
                                                <td><b>Nguyễn Cự Nhật</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="payment-note">
                                    <p>Lưu ý: Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống 
                                        tự xác nhận thanh toán
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-information">
                        <span>Thông tin đơn hàng</span>
                        {
                            orderDetails.map((sp)=>(
                                <div className="item">
                                    <span>{product.find((prd)=>Number(prd.productID) == Number(sp.productID))?.productName}</span>
                                    <span>{sp.quantity}</span>
                                    <span>{sp.price}</span>
                                </div>
                            ))
                        }
                        
                        <div className="total">
                            <span>Tổng</span>
                            <span>{Number(total).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</span>
                        </div>
                    </div>
                    <Link onClick={() => window.history.back()}> {"<"} Quay lại</Link>
            </div>
    )
}