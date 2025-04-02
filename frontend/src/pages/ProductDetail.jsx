import React ,{useState,useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import styles from "../productDetail.module.css";

export default function ProductDetail(){
    const {state:product} = useLocation();
    const navigate = useNavigate();
    // const [size,setSize] = useState(0);
    const [topping,setTopping] = useState([]);
    const [total,setTotal] = useState(0);
    const [size,setSize] = useState(0);
    const [extraPrice,setExtraPrice] = useState(0);
    const sizePrices= [0,6000,10000];

    const sp = product.sp;

    let basePrice = Number(sp.price);
    
    // useEffect(()=>{
        
    // },[size])

    const selectedSizeClick = (event) =>{
        
        setExtraPrice(sizePrices[Number(event.currentTarget.getAttribute("data-size"))]);
        setSize(Number(event.currentTarget.getAttribute("data-size")));
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
        setTotal(total);
        document.querySelector(`.${styles.total}`).innerText = `Tổng: ${Number(total).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}`;
    }
    const toppingClick = (event)=>{
        event.target.classList.toggle(`${styles.selected}`);
        setTopping((prev)=>[...prev,"\n" + event.target.dataset.topping]);
        updateTotal();
        
    }
    useEffect(()=>{
        document.querySelectorAll(`.${styles.topping} button`).forEach(button => {
            button.addEventListener("click",toppingClick)
            return () => button.removeEventListener("click",toppingClick)
        })
        
    },[])// eslint-disable-line react-hooks/exhaustive-deps



    const orderClick = async () =>{
        const orderInformation = {
            orderName : "",
            userID : localStorage.getItem("userID") ?? null,
            tableID :0,
            total : total,
            sdt: document.getElementById("sdt").value ?? "",
            note : "Size: " + size + "\n" + "Topping: " + topping,
            orderStatus:"Xác nhận"
        }

        const response = await fetch("/api/order.php?action=insert",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({products:product,information:orderInformation})
        });

        const text = await response.text();
        console.log("Raw response: ",text);

        const result = JSON.parse(text);
        console.log("Kết quả từ server: ",result);

        if(result.status == "Success"){
            alert(result.message);
        }
        else{
            alert(result.message);
        }
    }

    return(
        <>
            <div className={styles.container}>
                <ol className={styles["path-item"]}>
                    <li><a href="/Menu/all">Menu</a></li>/
                    <li onClick={()=>{navigate(`/Menu/${sp.productType}`,{state:sp.productType})}}>
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
                            <button data-price="10000" data-topping="Thạch Sương Sáo">Thạch Sương Sáo + 10.000 đ</button>
                            <button data-price="10000" data-topping="Thạch Kim Quất">Thạch Kim Quất + 10.000 đ</button>
                            <button data-price="10000" data-topping="Thạch Cà Phê">Thạch Cà Phê + 10.000 đ</button>
                            <button data-price="10000" data-topping="Foam Phô Mai">Foam Phô Mai + 10.000 đ</button>
                            <button data-price="10000" data-topping="Shot Espresso">Shot Espresso + 10.000 đ</button>
                            <button data-price="10000" data-topping="Sốt Caramel">Sốt Caramel + 10.000 đ</button>
                            <button data-price="10000" data-topping="Trân châu trắng">Trân châu trắng + 10.000 đ</button>
                            <button data-price="10000" data-topping="Đào miếng">Đào Miếng + 10.000 đ</button>
                            <button data-price="10000" data-topping="Hạt sen">Hạt Sen + 10.000 đ</button>
                            <button data-price="10000" data-topping="Trái Vải">Trái Vải + 10.000 đ</button>
                            <button data-price="10000" data-topping="Kem Phô Mai Macchiaato">Kem Phô Mai Macchiato + 10.000 đ</button>
                        </div>
                        <p className={styles.total}>Tổng: 39.000 đ</p>
                        {/* <button className={styles["order-btn"]} onClick={()=>{
                            document.body.style.overflow = "hidden";
                            document.querySelector(".order-delivery").style.display = "flex";
                        }}>Đặt giao tận nơi</button> */}
                    </div>
                </div>
            </div>
            <div className="order-delivery" onClick={()=>{
                document.body.style.overflow = "auto";
                document.querySelector(".order-delivery").style.display = "none";
            }}>
                        <div className="order-delivery_content" onClick={(e)=>e.stopPropagation()}>
                            <label htmlFor="sdt">
                                Số điện thoại
                            </label>
                            <input type="text" name="sdt" id="sdt"/>
                            <label htmlFor="address">
                                Địa chỉ
                            </label>
                            <input type="text" name="address" id="address"/>
                            <button onClick={()=>{orderClick();
                                document.body.style.overflow = "auto";
                                document.querySelector(".order-delivery").style.display = "none";
                            }}>Xác nhận</button>
                        </div>
                    </div>
        </>
    )
}