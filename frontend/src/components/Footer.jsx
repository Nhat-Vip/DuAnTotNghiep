import React from 'react'
import styles from "../index.module.css";
export default function Footer(){
    return(
    <footer>
        <div className={styles["footer-container"]}>
            <div className={styles.content}>
                <h5>Giới thiệu</h5>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur harum debitis et nisi sed hic,
                    impedit est possimus voluptates in obcaecati beatae! Eum ipsum deleniti illum cupiditate blanditiis
                    laudantium possimus?</p>
            </div>
            <div className={styles.content}>
                <h5>Giới thiệu</h5>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur harum debitis et nisi sed hic,
                    impedit est possimus voluptates in obcaecati beatae! Eum ipsum deleniti illum cupiditate blanditiis
                    laudantium possimus?</p>
            </div>
            <div className={styles.content}>
                <h5>SDT:00000000000</h5>
                <span>Địa chỉ</span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur harum debitis et nisi sed hic,
                    impedit est possimus voluptates in obcaecati beatae! Eum ipsum deleniti illum cupiditate blanditiis
                    laudantium possimus?</p>
            </div>
            <div className={`${styles.content} ${styles.bottom}`}>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit mollitia molestiae reiciendis,
                    aut, possimus in dolorum optio, harum placeat aspernatur vel accusantium natus minima officia ipsum
                    modi! Fugit, nam commodi!</p>
            </div>
        </div>
    </footer>
    );
}