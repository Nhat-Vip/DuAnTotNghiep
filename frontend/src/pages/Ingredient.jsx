import React,{useEffect,useState,useRef} from "react";


export default function Ingredient(){
    const [ingredient,setIngredient] = useState([]);
    const formRef = useRef([]);
    const [subIngredient,setSubIngredient] = useState({
        id : "",
        name : "",
        price : "",
        quantity: ""

    });

    const LoadIngredient = () =>{
        fetch("https://php-api-backend.onrender.com/api/Ingredient.php?action=all")
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            setIngredient(data);
        })
        .catch((err)=>console.log("Error: ",err))
    }

    useEffect (()=>{
        LoadIngredient();
    },[]);

    const handleIngredientClick = async (type,event)=>{
        event.preventDefault();
        console.log(subIngredient);
        const formData = new FormData();
        formData.append("id",subIngredient.id);
        formData.append("name",subIngredient.name);
        formData.append("price",Number(subIngredient.price.replace(/[^\d]/g,"")));
        formData.append("quantity",Number(subIngredient.quantity));

        // console.log(formData.get("id"));
        try{
            const reponse = await fetch(`https://php-api-backend.onrender.com/api/Ingredient.php?action=${type}`,{
                method:"POST",
                body:formData
            });

            const text = await reponse.text();

            console.log("Raw response: ",text);

            try{
                const result = JSON.parse(text);
                console.log("Kết quả từ server: ",result);

                if(result.status == "Success"){
                    alert(result.message);
                    formRef.current.reset();
                    setSubIngredient({
                        id:"",
                        name:"",
                        price:"",
                        quantity:""
                    });
                    LoadIngredient();
                }
                else{
                    alert(result.message);
                }
            }
            catch(err){
                console.error("Lỗi: ",err);
            }
        }
        catch(err){
            console.error("Lỗi xảy ra khi gửi lên server: ",err);
            alert("Có lỗi xảy ra khi gửi dữ liệu");
        }
    }

    const handleRowClick = (sp)=>{
        setSubIngredient({
            id : sp.ingredientId,
            name : sp.ingredientName,
            price : Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"}),
            quantity : Number(sp.quantity)
        })
    }
    return(
        <div className="form-product-container">
            <div className="form-product">
                <h2>Nguyên liệu</h2>
                <form method="post" ref={formRef} action={`https://php-api-backend.onrender.com/api/product.php?action=insert&id=${subIngredient.id}`} encType="multipart/form-data">
                    <input name="name" value={subIngredient.name} style={{"--i":"100%"}} type="text" placeholder="Tên nguyên liệu" 
                    onChange={(e) => setSubIngredient({...subIngredient, name: e.target.value})} />

                    <input name="price" value={subIngredient.price} style={{"--i":"45%"}} type="text" placeholder="Giá nhập" 
                    onChange={(e) => setSubIngredient({...subIngredient, price: e.target.value.replace(/[^\d.]/,"")})} />

                    <input value={subIngredient.quantity} style={{"--i":"45%"}} type="text" placeholder="Số lượng" 
                    onChange={(e)=>setSubIngredient({...subIngredient,quantity: e.target.value.replace(/[^\d.]/,"")})}/>
                    <input type="submit" onClick={(event)=>{handleIngredientClick("insert",event)}} value="Thêm" style={{"--i":"45%"}}/>
                    <input type="button" value="Sửa" style={{"--i":"45%"}} onClick={(event)=>{handleIngredientClick("update",event)}}/>
                </form>
            </div>
            <div className="List-product_manager">
                <h2>Danh sách sản phẩm</h2>
                <table>
                    <thead>
                        <tr>
                            <th style={{"--i":"25%"}}>Tên sản phẩm</th>
                            <th style={{"--i":"25%"}}>Giá nhập</th>
                            <th style={{"--i":"25%"}}>Số lượng</th>
                            <th style={{"--i":"25%"}}>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ingredient.map((sp)=>(
                                <tr className="item" key={sp.ingredientId} onClick={() => handleRowClick(sp)}>
                                    <td>{sp.ingredientName}</td>
                                    <td>{Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</td>
                                    <td>{Number(sp.quantity)}</td>
                                    <td><button onClick={(event)=>{handleIngredientClick("delete",event)}}>Xóa</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}