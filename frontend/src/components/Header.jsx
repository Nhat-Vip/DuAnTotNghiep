import React,{useState,useEffect,useRef} from "react";
import { Link,useLocation } from "react-router-dom";
import styles from "../index.module.css";
import logo from "/Images/logo-removebg-preview.png";

function Header() {
  const location = useLocation();
  const menuRef = useRef([]);

  //Tìm trong đang mở
  const menuPaths = ["/", "/Menu/all", "/Manager/ProductManager", "/Order", "/TuyenDung"];
  const index = menuPaths.indexOf(location.pathname);

  const[activeIndex,setActiveIndex] = useState(index);

  useEffect(()=>{
        
        localStorage.setItem("activeIndex", activeIndex);
        const active = document.querySelector(`.${styles.active}`);
        if(active){
          active.classList?.remove(styles.active);
        }
        const listLi =  document.getElementsByTagName("li");
        listLi[activeIndex]?.classList.add(styles.active);
        
  },[activeIndex])
  
  const handleClick = (event,index) => {
    const active = document.querySelector(`.${styles.active}`);
    if(active){
      active.classList?.remove(styles.active);
    }
    event.currentTarget.classList.add(styles.active);
    setActiveIndex(index);
  }

  useEffect(() => {
    // Thêm event listener cho từng phần tử
    document.querySelectorAll("li").forEach((sp, key) => {
      if (sp) {
        
        sp.addEventListener("click",(event)=> handleClick(event,key));

        // Cleanup function: Xóa event listener khi component unmount
        return () => sp.removeEventListener("click",(event)=> handleClick(event,key));
      }
    });
  }, []);
  return (
    <header>
        <img className={styles.logo} style={{backgroundColor: "inherit"}} src={logo} alt="Logo"/>
        <nav className={styles["main-menu"]}>
            <ol>
              <li className={styles.active} ref={(el) => menuRef.current[0] = el}><Link to="/">Home</Link></li>
              <li ref={(el) => menuRef.current[1] = el}>
                <div className={styles.dropdown}>
                    <Link  to="/Menu/all" className={styles["dropdown-btn"]}>Menu</Link>
                    <div className={styles["dropdown-content"]}>
                        <Link to="#">Tất cả</Link>
                        <Link to="#">Coffee</Link>
                        <Link to="#">Trà sữa</Link>
                        <Link to="#">Trà trái cây</Link>
                        <Link to="#">Trái cây xay</Link>
                        <Link to="#">Bánh ngọt</Link>
                    </div>
                </div>
              </li>
              <li ref={(el) => menuRef.current[2] = el}>
                <div className={`${styles.dropdown} ${styles.menu2}`}>
                    <Link to="/Manager/ProductManager" className={styles["dropdown-btn"]}>Quản lý</Link>
                    <div className={styles["dropdown-content"]}>
                        <Link to="/Manager/ProductManager">Quản lý sản phẩm</Link>
                        <Link to="/Manager/Users">Quản lý nhân viên</Link>
                        <Link to="/Manager/Statistical">Thống kê sản phẩm</Link>
                        {/* <Link to="#">Trà trái cây</Link>
                        <Link to="#">Trái cây xay</Link>
                        <Link to="#">Bánh ngọt</Link> */}
                    </div>
                </div>
              </li>
              <li ref={(el) => menuRef.current[3] = el}>
                <Link to="/Order">Đặt hàng</Link
                ></li>
              {/* <Link ref={(el) => menuRef.current[4] = el} to="TuyenDung.html">Tuyển dụng</Link> */}
            </ol>
        </nav>
        <div className={styles.Login}>
            <Link to="/Login">Login</Link>
        </div>
    </header>
  );
}

export default Header;
