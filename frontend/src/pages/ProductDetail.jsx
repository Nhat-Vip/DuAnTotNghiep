import React ,{useState,useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import styles from "../productDetail.module.css";

export default function ProductDetail(){
    const {state:product} = useLocation();
    const navigate = useNavigate();
    // const [size,setSize] = useState(0);
    const [extraPrice,setExtraPrice] = useState(0);
    const sizePrices= [0,6000,10000];

    const sp = product.sp;

    let basePrice = Number(sp.price);
    
    // useEffect(()=>{
        
    // },[size])

    const selectedSizeClick = (event) =>{
        
        setExtraPrice(sizePrices[Number(event.currentTarget.getAttribute("data-size"))]);
        updateTotal();
        
        document.querySelector(`.${styles.selected}`).classList.remove(styles.selected);
        event.currentTarget.classList.add(styles.selected);
    }

    useEffect(() => {
        updateTotal();
    }, [extraPrice]);// eslint-disable-line react-hooks/exhaustive-deps
    // function setSize(price, element) {
    //     extraPrice = sizePrices[size];
    //     updateTotal();
        
    //     document.querySelectorAll(".size-btn").forEach(btn => btn.classList.remove("selected"));
    //     element.classList.add("selected");
    // }
    
    function updateTotal() {
        let toppings = document.querySelectorAll(`.${styles.topping} button.${styles.selected}`);
        let toppingPrice = Array.from(toppings).reduce((sum, item) => sum + Number(item.getAttribute("data-price")), 0);
        let total = basePrice + extraPrice + toppingPrice;
        document.querySelector(`.${styles.total}`).innerText = `Tổng: ${Number(total).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}`;
    }
    const toppingClick = (event)=>{
        event.target.classList.toggle(`${styles.selected}`);
        updateTotal();
        
    }
    useEffect(()=>{
        document.querySelectorAll(`.${styles.topping} button`).forEach(button => {
            button.addEventListener("click",toppingClick)
            return () => button.removeEventListener("click",toppingClick)
        })
        
    },[])// eslint-disable-line react-hooks/exhaustive-deps

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
                        <button data-size ="0" className={`${styles["size-btn"]} ${styles["selected"]}`} onClick={selectedSizeClick}>Nhỏ + 0 đ</button>
                        <button data-size ="1" className={styles["size-btn"]} onClick={selectedSizeClick}>Vừa + 6.000 đ</button>
                        <button data-size ="2" className={styles["size-btn"]} onClick={selectedSizeClick}>Lớn + 10.000 đ</button>
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