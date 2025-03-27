import React,{useState,useEffect} from "react";

// import { useNavigate } from "react-router-dom";
import { database, ref } from "../components/firebase";
import { onChildChanged } from "firebase/database";

export default function Order(){
    const [product,setProduct] = useState([]);
    const [listProduct,setListProduct] = useState(localStorage.getItem("listProduct") ?  JSON.parse(localStorage.getItem("listProduct")) : []);
    const [totalSelected,setTotalSelected] = useState(0);
    const [orderStatus,setOrderStatus] = useState("");
    const [orderComplete,setOrderComplete] = useState(localStorage.getItem("orderStatus")==="true");
    const [showOrderComplete,setShowOrderComplete] = useState(orderComplete);
    const [table,setTable] = useState(1);
    const [orderID,setOrderID] = useState(0);
    // const navigate = useNavigate();
    const [openMenu,setOpenMenu] = useState(false);
    // const [order, setOrder] = useState({ name: "", price: "", quantity: 1 });
    const [productsl,setProductSl] = useState({
        id : "",
        img:"",
        name:"",
        price:"",
        quantity: "",
    });
    // mở giao diện order thành công và ẩn giao diện order
    // else{
    //     setListProduct([]);
    // }

    // useEffect(()=>{
    //     if(orderComplete){
    //         const storedProducts = JSON.parse(localStorage.getItem("listProduct")) || [];
    //         console.log("B",storedProducts);
    //         setListProduct((prev)=>[...prev,...storedProducts]);
    //         console.log("ABC",listProduct);
    //         console.log("ABC",JSON.parse(localStorage.getItem("listProduct")));
    //     }
    // },[]);//eslint-disable-line
    useEffect(()=>{
         console.log("useEffect chạy, orderComplete:", orderComplete);
        if(orderComplete == true){
            LoadOrderComplete();
        }
        setShowOrderComplete(orderComplete);
    },[orderComplete]);//eslint-disable-line


    const LoadOrderComplete = ()=>{
        console.log("Đã gọi");
        const orderContainer = document.querySelector(".order-complete");
        setTotalSelected(0);
        orderContainer.replaceChildren();
        listProduct.map((sp)=>{
                            orderContainer.innerHTML += `
                                <div class="order-product_item" >
                                    <div class="product-item_image">
                                        <img src= "${sp.image}" alt=""/>
                                    </div>
                                    <div class="product-item_content">
                                        <p>${sp.name}</p>
                                        <p>${Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</p>
                                    </div>
                                </div>
                                `
                                setTotalSelected((prev)=>Number(prev) + Number(sp.price));
                            })
        // listProduct.map((sp)=>{
        //     let item = {
        //                 listProduct.map((sp)=>{
        //                     <div className="order-product_item" >
        //                         <div className="product-item_image">
        //                             <img src={sp.image} alt=""/>
        //                         </div>
        //                         <div className="product-item_content">
        //                             <p>{sp.name}</p>
        //                             <p>{Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</p>
        //                         </div>
        //                     </div>
        //                 })
        //             }document.createElement("div");
        //     item.className = "order-product_item";
        //     item.innerHTML = ``
        // })
        
    }


    // mở menu cho mobile
    const handleOpenMenu = (e) =>{
        if(openMenu == false){
            e.target.style.right = 'calc(50vw)';
            e.target.innerHTML = ">";
            document.querySelector(".phone-menu").style.right = '0';
        }
        else{
            e.target.style.right = '0';
            e.target.innerHTML = "<";
            document.querySelector(".phone-menu").style.right = '-50vw';
        }
        setOpenMenu((prev)=>!prev);
    }


    const orderClick = async()=>{
        if(orderComplete){ //kiểm tra nếu là tạo đơn hàng mới
            setOrderComplete(false);
            localStorage.setItem("orderStatus",false);
            setListProduct([]);
            localStorage.setItem("listProduct","");
            return;
        }


        console.log("ListProduct",listProduct);
        const orderInformation = {
            orderName : "",
            userID : localStorage.getItem("userID")??null,
            tableID :document.getElementById("table").value,
            total : totalSelected,
            note :  document.getElementById("note").value,
            orderStatus:"Xác nhận"

        }
        const response = await fetch("/api/order.php?action=insert",{
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: listProduct , information: orderInformation}) // Chuyển danh sách sản phẩm thành JSON
    });
        const text = await  response.text();
        console.log("Response từ server:", text);

        const result = JSON.parse(text);
        alert(result.message);
        if(result.status == "Success"){
            document.querySelector(".list-product_slected").replaceChildren();
            alert(result.orderID);
            setOrderID(Number(result.orderID));
            localStorage.setItem("orderID",result.orderID);
            setOrderComplete(true);
            setTotalSelected(0);
            localStorage.setItem("orderStatus",true);
            localStorage.setItem("listProduct",JSON.stringify(listProduct));
            console.log(JSON.parse(localStorage.getItem("listProduct")));
            // setListProduct([]);
        }
        // navigate("/Order/Manager");

    }

    // Cập nhật khi thay đổi trạng thái đơn hàng
    useEffect(()=>{
        const orderRef = ref(database,"orders");
        
        const unsubscribe = onChildChanged(orderRef,(snapshot)=>{
            console.log("OrderID",localStorage.getItem("orderID"));
            console.log("snapShot2");
            const data = snapshot.val();
            const id = snapshot.key;
            setOrderID(Number(localStorage.getItem("orderID")));
            console.log("Da nhan sk");
            console.log(id +"and"+orderID);
            if(data && Number(id) == Number(localStorage.getItem("orderID"))){
                console.log("OK ROI");
                document.getElementById("status").innerHTML =`Trạng thái: <b style={{color:"red"}}>${data.status}</b>`;
            }
        });
        return () => unsubscribe();
    },[]);//eslint-disable-line




    useEffect(()=>{
        fetch("http://coffee.local/api/product.php?action=allOfType")
        .then((response)=> response.json())
        .then((data)=>{
            setProduct(data);
    })
        .catch((err)=>console.error(err));
    },[])
    

    const increaseClick = (event) =>{
        const quantity = event.target.parentNode.querySelector(".btn span");
        const totalClass = event.target.parentNode.parentNode.querySelector(".total");

        const price = event.target.parentNode.dataset.price;
        // console.log(price);

        const quantityItem = Number(quantity.innerHTML) + 1;
        totalClass.innerText = Number(price * quantityItem).toLocaleString("vi-VN",{style:"currency",currency:"VND"});
        quantity.innerHTML = quantityItem;

        setTotalSelected((prev) => prev + Number(price));
        setListProduct((prev) =>
            prev.map((sp) =>
                sp.id == Number(event.target.parentNode.dataset.id)
                ?{...sp,quantity:Number(sp.quantity) + 1}
                :sp
            )
        )
        console.log(listProduct);
        console.log(event.target.parentNode.dataset.id);
    }

    const reduceClick = (event) =>{
        const quantity = event.target.parentNode.querySelector(".btn span");
        const totalClass = event.target.parentNode.parentNode.querySelector(".total");

        const price = event.target.parentNode.dataset.price;

        if(Number(quantity.innerHTML) <= 1)
        {
           const item = event.target.parentNode.parentNode.parentNode;
           const itemParent = document.querySelector(".list-product_slected");

           itemParent.removeChild(item);
           setListProduct((prev) =>prev.filter((sp) => sp.id !== Number(event.target.parentNode.dataset.id)));
            // prev.map((sp) =>
            //     sp.id === Number(event.target.parentNode.dataset.id)
            //     ?{...sp=[]}
            //     :product
            // )
        // )
        }

        const quantityItem = Number(quantity.innerHTML) - 1;
        totalClass.innerText = Number(price * quantityItem).toLocaleString("vi-VN",{style:"currency",currency:"VND"});
        quantity.innerHTML = quantityItem;

        // console.log(`${totalSelected} - ${price} = ${Number(totalSelected)- Number(price)}`)
        setTotalSelected((prev) => prev - Number(price));

        setListProduct((prev) =>
            prev.map((sp) =>
                sp.id === Number(event.target.parentNode.dataset.id)
                ?{...sp,quantity:sp.quantity - 1}
                :sp
            )
        )
        
    }

    useEffect(()=>{
        const total = document.querySelector(".order-total_content h3");

        total.innerText = "Tổng tiền: " + totalSelected.toLocaleString("vi-VN",{style:"currency",currency:"VND"});
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
    

    
    useEffect(()=>{
        if (productsl.name =="") return;
        const orderContainer = document.querySelector(".list-product_slected");
        let existingItem = orderContainer.querySelector(`[data-name='${productsl.name}']`);

        if (existingItem) 
            {
                    let quantitySpan = existingItem.querySelector(".btn span");
                    quantitySpan.innerText = +quantitySpan.innerText + 1;
                    setListProduct((prev) =>
                        prev.map((sp) =>
                            sp.id === Number(existingItem.dataset.id)
                            ?{...sp,quantity:sp.quantity + 1}
                            :sp
                        )
                    )
            } 
        else {
                    let item = document.createElement("div");
                    item.className = "order-product_item";
                    item.setAttribute("data-name", productsl.name);
                    item.innerHTML = `
                        <div class="product-item_image"><img src="${productsl.img}" alt="${productsl.name}"/></div>
                        <div class="product-item_content">
                            <p>${productsl.name}</p>
                        </div>
                        <div class="product-item_btn">
                                <div class="btn" data-id=${productsl.id} data-price=${productsl.price}>
                                    <button class="increase">+</button>
                                    <span>1</span>
                                    <button class="reduce">-</button>
                                </div>
                                <p class="total">${Number(productsl.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</p>
                        </div>
                    `;
                    orderContainer.appendChild(item);
                    
                    const itemProduct = [{id:productsl.id,name:productsl.name,image:productsl.img
                        ,status:productsl.orderStatus,
                        price:productsl.price,quantity:productsl.quantity}];

                    setListProduct((prev)=>[...prev,...itemProduct]);
                    // console.log("list2",listProduct);

                    item.querySelector(".increase").addEventListener("click",increaseClick);
                    item.querySelector(".reduce").addEventListener("click",reduceClick);
                    setTotalSelected((prev)=>prev + parseInt(productsl.price));
                    // console.log(productsl.price);
                    // console.log(totalSelected+" "+productsl.price);
        }


    },[productsl])// eslint-disable-line react-hooks/exhaustive-deps

    return(
        <>
            <div className="order-container">
                <div className="order-note">
                    <h2>Lưu ý</h2>
                </div>
                <div style={{display : showOrderComplete ? "none" : "flex"}} className="list-product_slected" id="listProduct">
                </div>
                <div style={{display : showOrderComplete ? "none" : "flex"}} className="slected-product" id="slProduct">
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
                <div style={{display : showOrderComplete ? "flex" : "none"}} className="order-complete">
                </div>

                <div style={{display : showOrderComplete ? "none" : "grid"}} id="order-total" className="order-total">

                    <div className="note">
                        <label htmlFor="note">
                            Ghi chú
                        </label>
                        <input type="text" name="note" id="note"/>
                    </div>
                    <div className="order-total_content">
                        <h3 id="total">Tổng tiền:</h3>
                        <label htmlFor="table">Chọn bàn:</label>
                        <select name="table" id="table" value={table} onChange={(e)=>{setTable(e.target.value)}}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                        <button id="order" onClick={orderClick}>Order</button>
                    </div>
                </div>
                <div style={{display : showOrderComplete ? "grid" : "none"}} id="order-complete" className="order-total">

                    <div className="note">
                        <label htmlFor="note">
                            Ghi chú
                        </label>
                        <input type="text" name="note" id="note" disabled/>
                    </div>
                    <div className="order-total_content">
                        <h3 id="total">Tổng tiền:{Number(totalSelected).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</h3>
                        <h3 id="table2">Bàn:{table}</h3>
                        <h3 id="status">Trạng thái: <b style={{color:"red"}}>Xác nhận</b></h3>
                        <button id="order" onClick={orderClick}>New Order</button>
                        <button id="pay" onClick={orderClick}>Thanh toán</button>
                    </div>
                </div>

            </div>
            <div className="phone-menu">
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
            </div>
            <button onClick={handleOpenMenu} className="open-menu">{"<"}</button>
        </>
    )
}