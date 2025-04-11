import React,{useState,useEffect,useRef} from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import styles from "../index.module.css";
import logo from "/Images/logo-removebg-preview.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell,faUser } from "@fortawesome/free-solid-svg-icons";
import { database, ref, onChildAdded } from "./firebase";

function Header() {
  const location = useLocation();
  const menuRef = useRef([]);

  const productRef = useRef(null);
  const userRef = useRef(null);
  const orderRef = useRef(null);
  const orderManagerRef = useRef(null);
  const IngredinetRef = useRef(null);
  const stIngredientRef = useRef(null);
  const statisticalRef = useRef(null);


  const navigate = useNavigate();

  const menuPaths = location.pathname.split("/")[1];
  //Tìm trong đang mở
  // const index = menuPaths.indexOf(location.pathname);

  const[activeIndex,setActiveIndex] = useState(menuPaths);

  const[role,setRole] = useState(null);

  const[loginStatus,setLoginStatus] = useState(1);

  const[notifications,setNotifications] = useState(0);

  // localStorage.setItem("lastOrderId",0);

  const [lastOrderId, setLastOrderId] = useState(localStorage.getItem("lastOrderId") || 0);
  // const [lastOrderId, setLastOrderId] = useState(0);



  // Kiểm tra đăng nhập
  useEffect(()=>{
    setLoginStatus(localStorage.getItem("status") ?? 0);
    const login = document.querySelectorAll(`.${styles.Login}`);
    console.log("Login Status: ",loginStatus);
    if(loginStatus==1){
      login[0].style.display = "none";
      login[1].style.display ="block";
    }
    else if(loginStatus == 0){
      login[0].style.display = "block";
      login[1].style.display ="none";
    }
  },[loginStatus]);


  // Kiểm tra quyền
  useEffect(()=>{
    const manager = document.getElementById("Manager");
    const notification = document.getElementById("Notification");
    const userRole = localStorage.getItem("role");

    console.log("Role: ",role);

    if(userRole == "" || userRole == null){
      manager.style.display = "none";
      notification.style.display = "none";
      orderRef.current.style.display = "none";
      document.getElementById("Statistical").style.display = "none";
      setRole(userRole);
    }
    else if (userRole == 0){
      manager.style.display = "block";
      orderRef.current.style.display = "block";
      productRef.current.style.display = "none";
      userRef.current.style.display ="none";
      IngredinetRef.current.style.display = "none";
      statisticalRef.current.style.display = "none";
      notification.style.display = "flex";
      document.getElementById("Statistical").style.display = "none";
      setRole(userRole);
    }
    else if(userRole == 1){
      manager.style.display = "block";
      productRef.current.style.display = "block";
      userRef.current.style.display ="block";
      IngredinetRef.current.style.display = "block";
      statisticalRef.current.style.display = "block";
      notification.style.display = "flex";
      document.getElementById("Statistical").style.display = "block";
      setRole(userRole);
    }
  },[role]);

  // Nhận thông báo khi có đơn hàng hàng
  useEffect(()=>{
        const orderRefs = ref(database, "orders");
        const handleNewOrder = (snapshot) =>{
          const orderId = snapshot.key;
          console.log("cos don hang");
          console.log("lastOrderID: ",lastOrderId + "orderID: ",orderId);
          // setLastOrderId(orderId);
          if (!lastOrderId || Number(orderId) > Number(lastOrderId)) {
            console.log("Đơn hàng mới");
            console.log(notifications);
            setNotifications((prev) => prev+1);
            localStorage.setItem("lastOrderId",orderId);
            // console.log("order id:",orderId);
            setLastOrderId(orderId);
            // console.log(lastOrderId);
            // ShowNotificationNumber();
          }
        }
        const unsubscribe = onChildAdded(orderRefs, handleNewOrder);
        return()=>unsubscribe();
    },[]);// eslint-disable-line react-hooks/exhaustive-deps

  // Hiện  thị số đơn hàng

  useEffect(()=>{
    ShowNotificationNumber();
  },[notifications])// eslint-disable-line
  function ShowNotificationNumber(){
    // if(notifications==0){
    //   return;
    // }

    document.querySelector(`.${styles.Notification_number}`).innerHTML= notifications;
    console.log("OK");
  }

  // Active menu-item đang dc chọn
  useEffect(()=>{

        localStorage.setItem("activeIndex", menuPaths);
        const active = document.querySelector(`.${styles.active}`);
        if(active){
          active.classList?.remove(styles.active);
        }
        const listLi =  document.getElementById(`${menuPaths}`);
        // console.log("abc:",listLi);
        listLi?.classList.add(styles.active);
        
  },[location]);//eslint-disable-line
  
  //Thêm class activeactive
  // const handleClick = (event,index) => {
  //   const active = document.querySelector(`.${styles.active}`);
  //   if(active){
  //     active.classList?.remove(styles.active);
  //   }
  //   event.currentTarget.parentNode.classList.add(styles.active);
  //   setActiveIndex(index);
  // }

  // useEffect(() => {
  //   // Thêm event listener cho từng phần tử
  //   document.querySelectorAll("li").forEach((sp, key) => {
  //     if (sp) {
        
  //       sp.addEventListener("click",(event)=> handleClick(event,key));

  //       // Cleanup function: Xóa event listener khi component unmount
  //       return () => sp.removeEventListener("click",(event)=> handleClick(event,key));
  //     }
  //   });
  // }, []);
  return (
    <header>
        <img className={styles.logo} style={{backgroundColor: "inherit"}} src={logo} alt="Logo"/>
        <nav className={styles["main-menu"]}>
            <ol>
              <li id="home" className={styles.active} ref={(el) => menuRef.current[0] = el}><Link to="/home">Home</Link></li>
              <li id="Menu" className={styles.dropdown} ref={(el) => menuRef.current[1] = el}>
                    <Link  to="/Menu/all" className={styles["dropdown-btn"]}>Menu</Link>
                    <div className={styles["dropdown-content"]}>
                        <Link to="/Menu/all">Tất cả</Link>
                        <Link to="/Menu/Coffee">Coffee</Link>
                        <Link to="/Menu/Tea">Trà sữa</Link>
                        <Link to="/Menu/Fruit-Tea">Trà trái cây</Link>
                        <Link to="/Menu/Fruit-Puree">Trái cây xay</Link>
                        <Link to="/Menu/Cake">Bánh ngọt</Link>
                    </div>
              </li>
              <li id="Order" ref={orderRef}>
                <Link to="/Order">Đặt hàng</Link>
              </li>
              <li id="Manager" className={`${styles.dropdown} ${styles.menu2}`} ref={(el) => menuRef.current[2] = el}>
                    <Link to="/Manager/ProductManager" className={styles["dropdown-btn"]} >Quản lý</Link>
                    <div className={styles["dropdown-content"]}>
                        <Link ref={productRef} to="/Manager/ProductManager">Quản lý sản phẩm</Link>
                        <Link ref={userRef} to="/Manager/Users">Quản lý nhân viên</Link>
                        <Link ref={orderManagerRef} to="/Manager/Order">Quản lý đơn hàng</Link>
                        <Link ref={IngredinetRef} to="/Manager/Ingredient">Quản lý Nguyên liệu</Link>
                        {/* <Link to="#">Trà trái cây</Link>
                        <Link to="#">Trái cây xay</Link>
                        <Link to="#">Bánh ngọt</Link> */}
                    </div>
              </li>
              <li id="Statistical" className={`${styles.dropdown} ${styles.menu2}`} ref={(el) => menuRef.current[2] = el}>
                    <Link to="/Statistical/Statistical-Ingredient" className={styles["dropdown-btn"]} >Báo cáo</Link>
                    <div className={styles["dropdown-content"]}>
                        <Link ref={stIngredientRef} to="/Statistical/Statistical-Ingredient">Thống kê nguyên liệu</Link>
                        <Link ref={statisticalRef} to="/Statistical/Revenue-statistics">Thống kê doanh thu</Link>
                        {/* <Link to="#">Trà trái cây</Link>
                        <Link to="#">Trái cây xay</Link>
                        <Link to="#">Bánh ngọt</Link> */}
                    </div>
              </li>
              {/* <Link ref={(el) => menuRef.current[4] = el} to="TuyenDung.html">Tuyển dụng</Link> */}
            </ol>
        </nav>
        <div className={styles.Notification} id="Notification">
          <span className={styles.Notification_number}>0</span>
          <FontAwesomeIcon onClick={()=>{navigate("/Manager/Order");setNotifications(0)}} className={styles.bellIcon} icon={faBell}></FontAwesomeIcon>
        </div>
        <div className={styles.Login}>
          <Link to="/Login">Login</Link>
        </div>
        <div className={styles.Login}>
          <FontAwesomeIcon icon={faUser} className={styles.Login_icon}></FontAwesomeIcon>
          <div className={styles.user_Drop_Down}>
                <ol>
                  <li onClick={()=>{navigate("/User-profile")}}>Profile</li>
                  <li onClick={()=>{setRole(null); setLoginStatus(0); 
                      localStorage.setItem("role",""); localStorage.setItem("status",0),
                      localStorage.setItem("userID","");
                      navigate("/home");
                      window.location.reload();}}>
                      Log out
                  </li>
                </ol>
          </div>
        </div>
    </header>
  );
}

export default Header;
