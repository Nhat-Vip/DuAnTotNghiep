import React,{useState,useEffect} from "react";

export default function Order(){
    const [product,setProduct] = useState([]);
    const [productsl,setProductSl] = useState({
        img:"",
        name:"",
        price:"",
        quantity: "",
    });

    useEffect(()=>{
        fetch("http://coffee.local/api/product.php?action=allOfType")
        .then((response)=> response.json())
        .then((data)=>{
            console.log(data);
            setProduct(data);
    })
        .catch((err)=>console.error(err));
    },[])
    

    const hanldeClick = (sp) => {
        setProductSl({
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
            } 
        else {
                    let item = document.createElement("div");
                    item.className = "order-product_item";
                    item.setAttribute("data-name", productsl.name);
                    item.innerHTML = `
                        <div class="product-item_image"><img src="${productsl.img}" alt="${productsl.name}"/></div>
                        <div class="product-item_content">
                            <p>${productsl.name}</p>
                            <div class="product-item_btn">
                                <div class="btn">
                                    <button class="increase">+</button>
                                    <span>1</span>
                                    <button class="reduce">-</button>
                                </div>
                                <p class="total">${Number(productsl.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</p>
                            </div>
                        </div>
                    `;
                    orderContainer.appendChild(item);
        }


    },[productsl])

    return(
        <div className="order-container">
        <div className="list-product_slected">
            {/* <div className="order-product_item">
                <div className="product-item_image">
                    <img src="/Images/bo sua pho mai.webp" alt=""/>
                </div>
                <div className="product-item_content">
                    <p>Bo sua pho mai</p>
                    <div className="product-item_btn">
                        <div className="btn">
                            <button className="increase">+</button>
                            <span>1</span>
                            <button className="reduce">-</button>
                        </div>
                        <p className="total">10.000d</p>
                    </div>
                </div>
            </div> */}
        </div>
        <div className="slected-product">

            {
                Object.keys(product).map((type)=>(
                    <div key={type}>
                        <h3>{type}</h3>
                            {
                                product[type].map((sp)=>(
                                    <div className="order-product_item" onClick={()=>hanldeClick(sp)}>
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

            
            
            {/* <div className="order-product_item">
                <div className="product-item_image">
                    <img src="/Images/ca phe sua da.webp" alt=""/>
                </div>
                <div className="product-item_content">
                    <p>Ca phe den da</p>
                    <p>10.000d</p>
                </div>
            </div> */}
        </div>
        <div className="order-total">
            <div className="note">
                <label htmlFor="note">
                    Ghi chú
                </label>
                <input type="text" name="note"/>
            </div>
            <div className="order-total_content">
                <h3>Tổng tiền:00000</h3>
                <label htmlFor="table">Chọn bàn:</label>
                <select name="table" id="table">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <button>Order</button>

            </div>
        </div>
    </div>
    )
}