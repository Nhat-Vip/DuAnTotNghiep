import React ,{useEffect,useState} from "react";
import { useNavigate ,useLocation} from "react-router-dom";
// import styles from "../menu.module.css"
// import ProductDetail from "./ProductDetail";
import "../index.css"


export default function Menu(){
    const navigate = useNavigate();
    const location = useLocation();
    const menuPath = location.pathname.split("/");
    const menuItem = menuPath[menuPath.length-1].replace("-"," ");

    const [product,setProduct] = useState({});
    const [subProduct,setSubProduct] = useState({});
    const [menuSelected,setMenuSelected] = useState(menuItem);

    useEffect(()=>{
        // const menuPath = location.pathname.split("/");
        // const menuItem = menuPath[menuPath.length-1].replace("-","");
        document.querySelector("li.active")?.classList.remove("active");
        document.getElementById(menuItem).classList.add("active");
        setMenuSelected(menuItem);
    },[location]);//eslint-disable-line

    useEffect(()=>{
        fetch("/api/product.php?action=allOfType")
        .then((response)=> response.json())
        .then((data)=>{ 
            console.log("Product Data:", data);
            setProduct(data);
            setSubProduct(data);
            })
        .catch((error)=> console.log(error));
    },[]);
    useEffect(()=>{
        if(menuSelected == "all"){
            setSubProduct(product);
        }
        else{
            const allProducts = Object.values(product).flat();
            const subProduts = allProducts.filter((sp)=>{
                return(
                    sp.productType?.toLowerCase().includes(menuSelected.toLowerCase())
                )
            });
            console.log(subProduts);
            setSubProduct(groupByCategory(subProduts));
        }
        console.log(menuSelected);
    },[menuSelected,product])


    const groupByCategory = (products) => {
        return products.reduce((acc, product) => {
            const key = product.productType; // Nhóm theo category
            if (!acc[key]) acc[key] = []; // Nếu chưa có nhóm, tạo mảng mới
            acc[key].push(product);
            return acc;
        }, {});
    };


    const menuItemClick = (event)=>{
        document.querySelector("li.active")?.classList.remove("active");
        event.currentTarget.classList.add("active");
        const name = event.currentTarget.dataset.name;
        navigate(`/Menu/${name}`)
        setMenuSelected(name);
    }

    const productCLick = (sp) =>{
        // const name = sp.productName;
        // const image =  sp.image_path;
        // const detail = sp.detail;
        // const price = sp.price;

        navigate(`/product/${sp.productName}`,{state:{sp}});
    }
    return(
        <div className="container">
            <aside className="menu-slidebar">
            {/* <img src="/Images/background_menu.png" alt="" /> */}
                <ul className="menu-slidebar-content">
                    <li id="all" data-name = "all" onClick={menuItemClick}>Tất cả</li>
                    <li id="Coffee" data-name = "Coffee" onClick={menuItemClick}>Coffee</li>
                    <li id="Tea" data-name = "Tea" onClick={menuItemClick}>Trà sữa</li>
                    <li id="Fruit Tea" data-name = "Fruit-Tea" onClick={menuItemClick}>Trà trái cây</li>
                    <li id="Fruit Puree" data-name = "Fruit-Puree" onClick={menuItemClick}>Trái cây xay</li>
                    <li id="Cake" data-name = "Cake" onClick={menuItemClick}>Bánh ngọt</li>
                </ul>
            </aside>
            <div className="List-product">

                {
                    Object.keys(subProduct).map((type)=>(
                        <div key={type}>
                            <h3>{type}</h3>
                            <div key={type} className="product_item">
                                {subProduct[type].map((sp)=>(
                                    <div key={sp.productID} className="List-product_item" onClick={()=>{productCLick(sp)}}>
                                        <img src={sp.image_path} className="List-product_item-img" alt=""/>
                                        <p >{sp.productName}</p>
                                        <p style={{fontWeight:"normal",paddingTop:"5px",opacity:"0.7"}}>{Number(sp.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                                    </div>
                                ))}
                            </div>
                        </div> 
                    ))
                }

                {/* <h3>Coffee</h3>
                <div className="product_item">
                    <div className="List-product_item">
                        <img src="/frontend/public/Images/bo sua pho mai.webp" className="List-product_item-img" alt=""/>
                        <p>Bò sữa phô mai</p>
                        <p>10.000đ</p>
                    </div>
                    <div className="List-product_item">
                        <img src="/frontend/public/Images/dau pho mai.webp" className="List-product_item-img" alt=""/>
                        <p>Bò sữa phô mai</p>
                        <p>10.000đ</p>
                    </div>
                    <div className="List-product_item">
                        <img src="/frontend/public/Images/dau pho mai.webp" className="List-product_item-img" alt=""/>
                        <p>Bò sữa phô mai</p>
                        <p>10.000đ</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
