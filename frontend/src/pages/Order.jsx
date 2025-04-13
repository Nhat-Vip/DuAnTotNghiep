import React,{useState,useEffect} from "react";
import { Link ,useNavigate,useLocation} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { useNavigate } from "react-router-dom";

export default function Order(){
    const [product,setProduct] = useState([]);
    const [subProduct,setSubProduct] = useState([]);
    // const navigate = useNavigate();

    // const location = useLocation();
    // const params = new URLSearchParams(location.search);
    // const data = params.get("qr") ?? "";


    const [listProduct,setListProduct] = useState([]);
    const [totalSelected,setTotalSelected] = useState(0);
    // const [orderStatus,setOrderStatus] = useState(localStorage.getItem("Status") || "Xác nhận");
    // const [orderComplete,setOrderComplete] = useState(localStorage.getItem("orderStatus")==="true");
    // const [showOrderComplete,setShowOrderComplete] = useState(orderComplete);
    // const [orderID,setOrderID] = useState(0);
    // const [order,setOrder] = useState([]);
    // const role = localStorage.getItem("role");
    // const navigate = useNavigate();
    // const [openMenu,setOpenMenu] = useState(false);
    const [table,setTable] = useState([]);
    const [tableSelected,setTableSelected] = useState(0);

    // const [order, setOrder] = useState({ name: "", price: "", quantity: 1 });
    const [productsl,setProductSl] = useState({
        id : "",
        img:"",
        name:"",
        price:"",
        quantity: "",
    });

    useEffect(() =>{
        fetch("/api/table.php?action=get")
        .then((response)=> response.json())
        .then((data)=>{
            setTable(data);
        })
        .catch((err)=>console.error("Lỗi: ",err));
    },[]);



    // mở menu cho mobile
    // const handleOpenMenu = (e) =>{
    //     if(openMenu == false){
    //         e.target.style.right = 'calc(50vw)';
    //         e.target.innerHTML = ">";
    //         document.querySelector(".phone-menu").style.right = '0';
    //     }
    //     else{
    //         e.target.style.right = '0';
    //         e.target.innerHTML = "<";
    //         document.querySelector(".phone-menu").style.right = '-50vw';
    //     }
    //     setOpenMenu((prev)=>!prev);
    // }


    const orderClick = async()=>{
        // console.log("don moi:",orderComplete);
        // if(orderComplete){ //kiểm tra nếu là tạo đơn hàng mới
        //     // localStorage.setItem("Status","Xác nhận");
        //     // setOrderStatus("Xác nhận");
        //     // document.getElementById("status").innerHTML =`Trạng thái: <b style={{"color: red"}}>Xác nhận</b>`;
        //     // setOrderComplete(false);
        //     // localStorage.setItem("orderStatus",false);
        //     setListProduct([]);
        //     setTotalSelected(0);
        //     localStorage.setItem("listProduct","");
        //     return;
        // }


        if(listProduct.length<=0){
            alert("Vui lòng chọn sản phẩm");
            return;
        }

        console.log("ListProduct",listProduct);
        const orderInformation = {
            orderName : "",
            userID : localStorage.getItem("userID") ?? null,
            tableID :tableSelected,
            total : totalSelected,
            note :  document.getElementById("note").value,
            orderStatus:"Xác nhận"

        }
        console.log("sdt: ",orderInformation.sdt);
        console.log("Info: ",orderInformation);
        const response = await fetch("/api/order.php?action=insert",{
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: listProduct , information: orderInformation}) // Chuyển danh sách sản phẩm thành JSON
    });
        const text = await  response.text();
        console.log("Response từ server:", text);

        const result = JSON.parse(text);
        
        if(result.status == "Success"){
            toast.success(result.message,{position:"top-center"});
            // document.querySelector(".list-product_slected").replaceChildren();
            // setOrderID(Number(result.orderID));
            // localStorage.setItem("orderID",result.orderID);
            // setOrderComplete(true);
            setTotalSelected(0);
            // localStorage.setItem("orderStatus",true);
            // localStorage.setItem("listProduct",JSON.stringify(listProduct));
            // localStorage.setItem("total",totalSelected);
            // findOrder(result.orderID);
            console.log(JSON.parse(localStorage.getItem("listProduct")));
            setListProduct([]);
        }
        else{
            toast.error(result.message,{position:"top-center"});
        }
        // navigate("/Order/Manager");

    }


    // Cập nhật khi thay đổi trạng thái đơn hàng
    // useEffect(()=>{
    //     const orderRef = ref(database,"orders");
        
    //     const unsubscribe = onChildChanged(orderRef,(snapshot)=>{
    //         console.log("OrderID",localStorage.getItem("orderID"));
    //         console.log("snapShot2");
    //         const data = snapshot.val();
    //         const id = snapshot.key;
    //         setOrderID(Number(localStorage.getItem("orderID")));
    //         console.log("Da nhan sk");
    //         console.log(id +"and"+orderID);
    //         if(data && Number(id) == Number(localStorage.getItem("orderID"))){
    //             document.getElementById("status").innerHTML =`Trạng thái: <b style={{"color: red"}}>${data.status}</b>`;
    //             setOrderStatus(data.status);
    //             localStorage.setItem("Status",data.status);
    //             console.log("OK ROI");
                
    //         }
    //     });
    //     return () => unsubscribe();
    // },[]);//eslint-disable-line




    useEffect(()=>{
        fetch("/api/product.php?action=allOfType")
        .then((response)=> response.json())
        .then((data)=>{
            setProduct(data);
    })
        .catch((err)=>console.error(err));
    },[])
    

    const increaseClick = (id) =>{

        // const price = event.target.parentNode.dataset.price;
        // // console.log(price);

        // setTotalSelected((prev) => prev + Number(price));
        setListProduct((prev) =>
            prev.map((sp) =>
                sp.id == id
                ?{...sp,quantity:Number(sp.quantity) + 1}
                :sp
            )
        )
        // console.log(listProduct);
        // console.log(event.target.parentNode.dataset.id);
    }

    const reduceClick = (event,id) =>{
        const quantity = event.target.parentNode.querySelector(".btn input");

        // const price = event.target.parentNode.dataset.price;

        // if(Number(quantity.value) <= 1)
        // {
        //    const item = event.target.parentNode.parentNode.parentNode;
        //    const itemParent = document.querySelector(".list-product_slected");

        //    itemParent.removeChild(item);
        //    setListProduct((prev) =>prev.filter((sp) => sp.id !== id));
        //    return;
        // }

        // console.log(`${totalSelected} - ${price} = ${Number(totalSelected)- Number(price)}`)
        // setTotalSelected((prev) => prev - Number(price));

        setListProduct((prev) =>{
               const updatedList = prev.map((sp) =>
                sp.id === id ? { ...sp, quantity: sp.quantity - 1 } : sp
                ).filter(sp => sp.quantity > 0); // Xóa những sản phẩm có quantity = 0
                
                return updatedList;
            }
            
        )
        
    }

    const updateTotal = () =>{
        let total = listProduct.reduce((sum,sp)=>sum + (sp.quantity*sp.price),0);
        setTotalSelected(total);
    }

    useEffect(()=>{
        updateTotal();
    },[listProduct])

    useEffect(()=>{
        const total = document.querySelector(".order-total_content #total");
        // const total2 = document.querySelector(".order-total_content #total2");

        total.innerText = "Tổng tiền: " + totalSelected.toLocaleString("vi-VN",{style:"currency",currency:"VND"});
        // total2.innerText = "Tổng tiền: " + totalSelected.toLocaleString("vi-VN",{style:"currency",currency:"VND"});
    },[totalSelected])

    const hanldeClick = (sp) => {
        setProductSl({
            id : sp.productID,
            name: sp.productName,
            price: sp.price,
            quantity: 1,
            img : sp.image_path
        });
    };
    
    const hanldeTableClick = (e) =>{
        document.querySelector(".table.active")?.classList.remove("active");
        e.currentTarget.classList.add("active");
        setTableSelected(e.currentTarget.dataset.id);
    }

    const findProduct =(e) =>{
        if(e.key == "Enter"){
            const allProducts = Object.values(product).flat();
            const newProducts = allProducts.filter((sp)=>{
                return(
                    sp.productName.toLowerCase().includes(e.target.value.toLowerCase())
                )
            });
            setSubProduct(newProducts);
            
        }
    }
    const filterByType = (e) =>{

        if(e.target.value == "All"){
            setSubProduct([]);
            return;
        }

        const allProducts = Object.values(product).flat();
        const newProduct = allProducts.filter((sp)=>{
            return(
                sp.productType == e.target.value
                )
            });
        console.log("New: ",newProduct);
        setSubProduct(newProduct);
        
    }

    const changeQuantity = (id,value) =>{
        console.log("Dax vao sk");
        const newQuantity = Number(value.replace(/\D/g,"")) || 0;
        // const price = e.target.parentNode.dataset.price;
        // const oldTotal = e.target.dataset.quantity * price;
        // const newTotal = e.target.value * price;

        setListProduct((prev)=>
            prev.map((sp)=>
                sp.id == id ? {...sp,quantity:newQuantity}:sp
            )
        )
    }

    useEffect(()=>{
        if (productsl.name =="") return;
        // const orderContainer = document.querySelector(".list-product_slected");
        console.log("List Prodcut: ",listProduct);
        let existingItem = listProduct?.find((sp)=>sp.id == productsl.id);

        if (existingItem) 
            {
                    // let quantityInput = existingItem.querySelector(".btn input");
                    // quantityInput.value = quantityInput.value + 1;
                    setListProduct((prev) =>
                        prev.map((sp) =>
                            sp.id == Number(existingItem.id)
                            ?{...sp,quantity:sp.quantity + 1}
                            :sp
                        )
                    )
            } 
        else {
                    
                    const itemProduct = [{id:productsl.id,name:productsl.name,img:productsl.img
                        ,status:productsl.orderStatus,
                        price:productsl.price,quantity:productsl.quantity}];

                    setListProduct((prev)=>[...prev,...itemProduct]);
                    // console.log("list2",listProduct);

                    // item.querySelector(".increase").addEventListener("click",increaseClick);
                    // item.querySelector(".reduce").addEventListener("click",reduceClick);
                    setTotalSelected((prev)=>prev + parseInt(productsl.price));
                    // console.log(productsl.price);
                    // console.log(totalSelected+" "+productsl.price);
        }


    },[productsl])// eslint-disable-line react-hooks/exhaustive-deps

    return(
        <>
        <ToastContainer />
            <div className="order-container">
                <div className="order-note">
                    <h2>Chọn bàn</h2>
                    
                        <div data-id = '0' onClick={(e)=>hanldeTableClick(e)} className="table active">
                            <span>Mang về</span>
                        </div>
                    {
                        table.slice(1).map((tbl,key) =>(
                            <div data-id ={tbl.tableID} onClick={(e)=>hanldeTableClick(e)} key={key} className="table">
                                <span>Bàn {tbl.tableID}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="list-product_slected" id="listProduct">
                    {
                        listProduct.map((sp)=>(
                            <div className="order-product_item">
                                <div className="product-item_image"><img src={sp.img} alt={sp.name}/></div>
                                <div className="product-item_content">
                                    <p>{sp.name}</p>
                                </div>
                                <div className="product-item_btn">
                                        <div className="btn" data-id={sp.id} data-price={sp.price}>
                                            <button className="reduce" onClick={(e)=>reduceClick(e,sp.id)}>-</button>    
                                            <input type="text" value = {sp.quantity} onChange={(e)=>changeQuantity(sp.id,e.target.value)}/>
                                            <button className="increase" onClick={()=>increaseClick(sp.id)}>+</button>
                                        </div>
                                        <p className="total">{Number(sp.quantity*sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="slected-product" id="slProduct">
                    <input type="text" placeholder="Nhập tên sản phẩm" onKeyDown={(e)=>findProduct(e)}/>
                    <select name="productType" id="productType" onChange={(e)=>filterByType(e)}>    
                        <option value="All">All</option>
                        <option value="Coffee">Coffee</option>
                        <option value="Tea">Tea</option>
                        <option value="Fruit Tea">Fruit Tea</option>
                        <option value="Fruit Puree">Fruit Puree</option>
                        <option value="Cake">Cake</option>
                    </select>
                    <div id="Product">
                        {
                            subProduct.length > 0 ?

                            subProduct.map((sp)=>(
                            
                                <div key={sp.productID} className="order-product_item" onClick={()=>hanldeClick(sp)}>
                                    <div className="product-item_image">
                                        <img src={sp.image_path} alt=""/>
                                    </div>
                                    <div className="product-item_content">
                                        <p>{sp.productName}</p>
                                        <p>{Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</p>
                                    </div>
                                </div>
                            
                        ))

                        :

                            Object.keys(product).map((type)=>(
                                <div key={type}>
                                    <h3 className="product-item_type">{type}</h3>
                                        {
                                            product[type].map((sp)=>(
                                                <div key={type.productID} className="order-product_item" onClick={()=>hanldeClick(sp)}>
                                                    <div className="product-item_image">
                                                        <img src={sp.image_path} alt=""/>
                                                    </div>
                                                    <div className="product-item_content">
                                                        <p>{sp.productName}</p>
                                                        <p>{Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                </div>
                            ))
                        }
                    </div>

                </div>
                {/* <div style={{display : showOrderComplete ? "flex" : "none"}} className="order-complete">
                </div> */}
                {/* <div style={{display : showOrderComplete ? "none" : role !="" || data != "" ? "none" : "grid"}} id="order-delivery" className="order-total">
                    <div className="note">
                        <label htmlFor="note">
                            Ghi chú
                        </label>
                        <input type="text" name="note" id="note"/>
                    </div>
                    <div className="order-total_content">
                        <h3 id="total2">Tổng tiền:</h3>
                        <button id="order" onClick={()=>
                            {
                                document.body.style.overflow = "hidden";
                                document.querySelector(".order-delivery").style.display = "flex";

                            }}>
                                Order
                        </button>
                    </div>
                </div> */}
                <div id="order-total" className="order-total">

                    <div className="note">
                        <label htmlFor="note">
                            Ghi chú
                        </label>
                        <input type="text" name="note" id="note"/>
                    </div>
                    <div className="order-total_content">
                        <h3 id="total">Tổng tiền:</h3>
                        {/* <label htmlFor="table">Chọn bàn:</label> */}
                        {/* <select name="table" id="table" value={tableSelected} onChange={(e)=>{setTableSelected(e.target.value)}}>
                            {
                                table.map((tbl, key) => (
                                    <option key={key} value={tbl.tableID}>{tbl.tableID}</option>
                                ))
                            }
                        </select> */}
                        <button id="order" onClick={orderClick}>Order</button>
                    </div>
                </div>
                {/* <div style={{display : showOrderComplete ? "grid" : "none"}} id="order-complete" className="order-total">

                    <div className="note">
                        <label htmlFor="note">
                            Ghi chú
                        </label>
                        <input type="text" name="note" id="note" disabled/>
                    </div>
                    <div className="order-total_content">
                        <h3 id="total">Tổng tiền:{Number(totalSelected).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</h3>
                        <h3 id="table2">Bàn:{tableSelected}</h3>
                        <h3 id="status">Trạng thái: <b style={{color:"red"}}>{orderStatus}</b></h3>
                        <button id="order" onClick={orderClick}>New Order</button>
                        <button id="pay" onClick={()=> navigate("/Payment")}>Thanh toán</button>
                    </div>
                </div> */}

            </div>
            {/* <div className="phone-menu">
                <div className="slected-product">
                    {
                        Object.keys(product).map((type)=>(
                            <div key={type}>
                                <h3 className="product-item_type">{type}</h3>
                                    {
                                        product[type].map((sp)=>(
                                            <div key={type.productID} className="order-product_item" onClick={()=>hanldeClick(sp)}>
                                                <div className="product-item_image">
                                                    <img src={sp.image_path} alt=""/>
                                                </div>
                                                <div className="product-item_content">
                                                    <p>{sp.productName}</p>
                                                    <p>{Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                            </div>
                        ))
                    }
                </div>
            </div> */}
            {/* <div className="order-delivery" onClick={()=>{
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
            </div> */}
            {/* <button onClick={handleOpenMenu} className="open-menu">{"<"}</button> */}
        </>
    )
}