import React from 'react'
import styles from "../index.module.css";
export default function Footer(){
    return(
    <footer>
        <div className={styles["footer-container"]}>
            <div className={styles.content}>
                <img width={300} src="./Images/logo-removebg-preview.png" alt="" />
                <h3>VỀ CHÚNG TÔI</h3>
                <p>CAT CAFE LUÔN HƯỚNG TỚI NHỮNG ĐIỀU TỐT NHẤT CHO KHÁCH HÀNG</p>
            </div>
            <div className={styles.content}>
                <h3>LIÊN HỆ</h3>
                <ol>
                    <li>Email:ABC@gmail.com</li>
                    <li>Địa Chỉ: đường ABC , thành phố Biên hòa ,tỉnh Đồng Nai </li>
                    <li>Số điện thoại:098765436</li>
                    
                </ol>
                <h3>HỖ TRỢ VÀ CHÍNH SÁCH</h3>
                <ol>
                    <li>– Quy chế hoạt động và Chính sách bảo mật.</li>
                    <li>– Chính sách vận chuyển.</li>
                    <li>– Chính sách thanh toán.</li>
                </ol>
            </div>
            <div className={styles.content}>
                <img src="/Images/poster-removebg-preview.png" alt="Poster" />
            </div>
        </div>
        <div className={`${styles.content} ${styles.bottom}`}>
            <p>Công ty cổ phần thương mại nhóm 1
                nằm tại phổ thông cao đẳng FPT Đồng Nai 
            </p>
        </div>
    </footer>
    );
}