import React,{useEffect,useState,useRef} from "react";

export default function Statistical_Ingredient(){
    const [Ingredient,setIngredient] = useState([]);
    const [stIngredient,setStIngredient] = useState([]);
    const [changeIndex,setChangeIndex] = useState(0);

    const [subStIngredient,setSubStIngredient] = useState({
        id : "",
        name: "",
        ingredientId : "",
        userID : "",
        subUserId:"",
        quantity: "",
        note : ""
    });
    const formRef = useRef([]);

    const Load_StIngredient = () =>{
        fetch("/api/StIngredient.php?action=all")
        .then((response)=>response.json())
        .then((data)=> setStIngredient(data))
        .catch((err)=>console.error("Error: ",err));
    }
    const Load_Ingredient = () =>{
        fetch("/api/Ingredient.php?action=all")
        .then((response)=>response.json())
        .then((data)=> setStIngredient(data))
        .catch((err)=>console.error("Error: ",err));
    }

    useEffect(()=>{
        if(changeIndex == 0){
            document.getElementById("Ingredient").style.display = "table";
            document.getElementById("StIngredient").style.display = "none";
            Load_Ingredient();
        }
        else{
            document.getElementById("Ingredient").style.display = "none";
            document.getElementById("StIngredient").style.display = "table";
            Load_StIngredient();
        }
    },[changeIndex]);

    const handleStIngredientClick = async (type,event) =>{
        event.preventDefault();

        console.log(subStIngredient);
        console.log(type);

        if(subStIngredient.name == ""){
            alert("Vui lòng chọn nguyên liệu cần cập nhật");
        }

        const formData = new FormData();
        formData.append("id",subStIngredient.id);
        formData.append("ingredientId",subStIngredient.ingredientId);
        formData.append("userID",subStIngredient.userID);
        formData.append("subUserID",localStorage.getItem("userID"));
        formData.append("name",subStIngredient.name);
        formData.append("quantity",subStIngredient.quantity);
        formData.append("note",subStIngredient.note);

        console.log(formData.get("id"));
        try{
            const response = await fetch(`/api/StIngredient.php?action=${type}`,{
                method: "POST",
                body: formData
            });

            const text =  await response.text();
            console.log("Raw response: ",text);

            try{
                const result = JSON.parse(text);
                console.log("Kết quả từ server: ",result);
                if(result.status == "Success"){
                    alert(result.message);
                    setSubStIngredient({
                        id : "",
                        name: "",
                        ingredientId : "",
                        userID : localStorage.getItem("userID"),
                        subUserId:"",
                        quantity: "",
                        note : ""
                    });
                    Load_StIngredient();
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
            console.error("Có lỗi xảy ra: ",err);
            alert("Có lỗi xảy ra khi gửi form");
        }

    }

    const handleRowClick = (sp) => {
        setSubStIngredient({
            ingredientId : sp.ingredientId,
            name: sp.ingredientName,
            quantity: Number(sp.quantity),
            userID: localStorage.getItem("userID")
        })
    }
    const handleRowV2Click = (sp) => {
        setSubStIngredient({
            id : sp.stIngredientId,
            ingredientId : sp.ingredientId,
            name: sp.ingredientName,
            userID: sp.userID,
            quantity: Number(sp.quantity),
            note : sp.note
        })
    }

    const handleChange = () =>{
        if (changeIndex == 0){
            setChangeIndex(1);
        }
        else{
            setChangeIndex(0);
        }
    }

    return(
        <div className="form-product-container">
            <div className="form-product">
                <h2>Thống kê nguyên liệu</h2>
                <form method="post" ref={formRef} action={`/api/product.php?action=insert&id=${subStIngredient.id}`} encType="multipart/form-data">
                    <input name="name" value={subStIngredient.name ??" "} style={{"--i":"45%"}} type="text" placeholder="Tên nguyên liệu" 
                    onChange={(e) => setSubStIngredient({...subStIngredient, name: e.target.value})} disabled/>

                    <input value={subStIngredient.quantity} style={{"--i":"45%"}} type="text" placeholder="Số lượng" 
                    onChange={(e)=>setSubStIngredient({...subStIngredient,quantity: e.target.value})}/>

                    <input name="note" value={subStIngredient.note ??""} style={{"--i":"100%"}} type="text" placeholder="Ghi chú" 
                    onChange={(e) => setSubStIngredient({...subStIngredient, note: e.target.value})} />

                    {/* <input type="submit" onClick={(event)=>{handleStIngredientClick("insert",event)}} value="Thêm" style={{"--i":"45%"}}/> */}
                    <input type="button" value="Sửa" style={{"--i":"100%"}} onClick={(event)=>{handleStIngredientClick(changeIndex == 0 ? "insert":"update",event)}}/>
                </form>
            </div>
            <div className="List-product_manager">
                <select className="change" name="Statiscal" id="Statiscal" onChange={handleChange}>
                    <option value="Nguyên liệu">Nguyên liệu</option>
                    <option value="Lịch sử thống kê">Lịch sử thống kê</option>
                </select>
                <h2>Danh sách sản phẩm</h2>
                <table id="Ingredient">
                    <thead>
                        <tr>
                            <th style={{"--i":"50%"}}>Tên sản phẩm</th>
                            {/* <th style={{"--i":"30%"}}>Giá nhập</th> */}
                            <th style={{"--i":"50%"}}>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            stIngredient.map((sp)=>(
                                <tr className="item"  onClick={() => handleRowClick(sp)}>
                                    <td>{sp.ingredientName}</td>
                                    {/* <td>{Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</td> */}
                                    <td>{Number(sp.quantity)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <table id="StIngredient">
                    <thead>
                        <tr>
                            <th style={{"--i":"25%"}}>Tên sản phẩm</th>
                            <th style={{"--i":"25%"}}>Số lượng</th>
                            <th style={{"--i":"25%"}}>Ghi chú</th>
                            <th style={{"--i":"25%"}}>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            stIngredient.map((sp)=>(
                                <tr className="item" onClick={() => handleRowV2Click(sp)}>
                                    <td>{sp.ingredientName}</td>
                                    <td>{Number(sp.quantity)}</td>
                                    <td>{sp.note}</td>
                                    <td>{sp.userID}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}