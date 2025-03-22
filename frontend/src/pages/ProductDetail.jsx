import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import styles from "../productDetail.module.css";

export default function ProductDetail(){
    const {state:product} = useLocation();
    const navigate = useNavigate();

    const sp = product.sp;
    // const navigate = useNavigate();


    return(
        <div className={styles.container}>
            <ol className={styles["path-item"]}>
                <li><a href="/menu">Menu</a></li>/
                <li onClick={()=>{navigate(`/menu/${sp.productType}`,{state:sp.productType})}}>
                    {sp.productType}
                </li>/
                <li>{sp.productName}</li>
            </ol>
            <div className={styles.content}>
                <div className={styles["image-section"]}>
                    <img src={sp.image_path} alt="Coffee" className={styles["product-image"]}/>
                </div>
                <div className={styles["info-section"]}>
                    <h1>The Coffee House <br/><strong>{sp.productName}</strong></h1>
                    <p className={styles.price}>
                        {Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}
                    </p>
                    <h3 style={{fontSize:"15px", fontWeight :"bold", padding:"5px"}}>Chọn size (bắt buộc)</h3>
                    <div className={styles.option}>
                        <button className={`${styles["size-btn"]} ${styles["selected"]}`} onclick="setSize(0, this)">Nhỏ + 0 đ</button>
                        <button className={styles["size-btn"]} onclick="setSize(6000, this)">Vừa + 6.000 đ</button>
                        <button className={styles["size-btn"]} onclick="setSize(10000, this)">Lớn + 10.000 đ</button>
                    </div>
                    <h3 style={{fontSize:"15px", fontWeight :"bold", padding:"5px"}}>Topping</h3>
                    <div className={styles.topping}>
                        <button data-price="10000">Thạch Sương Sáo + 10.000 đ</button>
                        <button data-price="10000">Thạch Kim Quất + 10.000 đ</button>
                        <button data-price="10000">Thạch Cà Phê + 10.000 đ</button>
                        <button data-price="10000">Foam Phô Mai + 10.000 đ</button>
                        <button data-price="10000">Shot Espresso + 10.000 đ</button>
                        <button data-price="10000">Sốt Caramel + 10.000 đ</button>
                        <button data-price="10000">Trân châu trắng + 10.000 đ</button>
                        <button data-price="10000">Đào Miếng + 10.000 đ</button>
                        <button data-price="10000">Hạt Sen + 10.000 đ</button>
                        <button data-price="10000">Trái Vải + 10.000 đ</button>
                        <button data-price="10000">Kem Phô Mai Macchiato + 10.000 đ</button>
                    </div>
                    <p className={styles.total}>Tổng: 39.000 đ</p>
                    <button className={styles["order-btn"]}>Đặt giao tận nơi</button>
                </div>
            </div>
        </div>
    )
}