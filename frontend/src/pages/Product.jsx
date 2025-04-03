import React ,{useEffect,useState,useRef} from "react";
// import { data } from "react-router-dom";
// import "../index.css"

export default function Product(){
    const [product,setProduct] = useState([]);
    const [subProduct,setSubProduct] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState({
        id:"",
        name: "",
        price: "",
        quantity: "",
        type: "",
        status: "",
        detail: "",
        image:""
    });

    const formRef = useRef(null);

    const loadProduct = () => {
        fetch("/api/product.php?action=all")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setProduct(data);
                setSubProduct([...data].sort((a,b)=>b.productID - a.productID));
            })
            .catch((error) => console.log(error));
        };

    useEffect(()=>{
        loadProduct();
    },[])

    const handleRowClick = (sp) => {
        setSelectedProduct({
            id: sp.productID,
            name: sp.productName,
            price: Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"}),
            type: sp.productType,
            status: sp.productStatus == 1 ? "Còn" : "Hết",
            detail: sp.detail,
            image: sp.image_path
        });
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Lấy file đầu tiên
        if (file) {
            setSelectedFile(file);
        }
    };

    const sortByType = (e) =>{
        const newProduct = product.filter((sp)=>{
            return(
                sp.productType.toLowerCase().includes(e.target.value.toLowerCase())
            )
        });
        setSubProduct(newProduct);
    }

    const handleFormClick = async(type,event) =>{
        event.preventDefault();
            if (!selectedProduct.id&&type=="update") {
                alert("Chưa chọn sản phẩm để cập nhật!");
                return;
            }
        console.log("abc",selectedProduct);
        // if (!formRef.current) return;
        let id = selectedProduct.id;
        if(type == "delete"){
            id = event.target.dataset.id;
        }
        const formData = new FormData();
        formData.append("productName", selectedProduct.name);
        formData.append("price", Number(selectedProduct.price.replace(/[^\d]/g,"")));
        formData.append("type", selectedProduct.type == "" ? "Coffee" : selectedProduct.type);
        formData.append("status", selectedProduct.status === "Còn" ? "1" : "0");
        formData.append("detail", selectedProduct.detail);
        console.log(formData.get("type"));
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try{
            const response =  await fetch(`/api/product.php?action=${type}&id=${id}`,{
                method:"POST",
                body: formData
            });
            console.log(formData);
            const text = await response.text(); // Đọc phản hồi dưới dạng text để debug
            console.log("Raw Response:", text);
            
            try{
                const result = JSON.parse(text); // Chuyển đổi text thành JSON
                console.log("Kết quả từ server:", result);


                if (result.status === "success") {
                    alert(result.message);
                    formRef.current.reset(); // Reset form sau khi gửi thành công
                    setSelectedFile(null); // Xóa ảnh đã chọn
                    loadProduct();
                } else {
                    alert("Có lỗi xảy ra! " + result.message);
                }
            }
            catch(err){
                console.error("Lỗi: ",err);
            }
        }
        catch (error) {
            console.error("Lỗi khi gửi form:",error);
            alert("Gửi form thất bại!");
        }   
    }


    return(
        <div className="form-product-container">
            <div className="form-product">
                <h2>Sản phẩm</h2>
                <form method="post" ref={formRef} action={`/api/product.php?action=insert&id=${selectedProduct.id}`} encType="multipart/form-data">
                    <input name="productName" value={selectedProduct.name} style={{"--i":"47%"}} type="text" placeholder="Tên sản phẩm" 
                    onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})} />

                    <input name="price" value={selectedProduct.price} style={{"--i":"47%"}} type="text" placeholder="Giá bán" 
                    onChange={(e) =>{setSelectedProduct({...selectedProduct, price: e.target.value.replace(/[^\d.]/g,"")})}} />

                    {/* <input value={selectedProduct.quantity} style={{"--i":"30%"}} type="text" placeholder="Số lượng"/> */}
                    <select value={selectedProduct.type} name="type" id="type" style={{"--i":"47%"}} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, type: e.target.value})} >
                        <option value="Coffee">Coffee</option>
                        <option value="Tea">Tea</option>
                        <option value="Fruit Tea">Fruit Tea</option>
                        <option value="Fruit Puree">Fruit Puree</option>
                        <option value="Cake">Cake</option>
                    </select>
                    <select value={selectedProduct.status} name="status" id="status" style={{"--i":"47%"}} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, status: e.target.value})} >
                        <option value="Còn">Còn</option>
                        <option value="Hết">Hết</option>
                    </select>
                    <input name="detail" value={selectedProduct.detail} type="text" placeholder="Chi tiết sản phẩm" style={{"--i":"100%"}} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, detail: e.target.value})} />
                    <input type="file" name="image" id="image" accept="image/*" style={{"--i":"100%"}} required onChange={handleFileChange}/>
                    <input type="submit" onClick={(event)=>{handleFormClick("insert",event)}} value="Thêm" style={{"--i":"45%"}}/>
                    <input type="button" value="Sửa" style={{"--i":"45%"}} onClick={(event)=>{handleFormClick("update",event)}}/>
                </form>
            </div>
            <div className="List-product_manager">
                <h2>Danh sách sản phẩm</h2>
                <select className="change" name="productType" id="productType" onChange={(e)=>sortByType(e)}>
                    <option value="Coffee">Coffee</option>
                    <option value="Tea">Tea</option>
                    <option value="Fruit Tea">Fruit Tea</option>
                    <option value="Fruit Puree">Fruit Puree</option>
                    <option value="Cake">Cake</option>
                </select>
                <table>
                    <thead>
                        <tr>
                            <th style={{"--i":"20%"}}>Ảnh</th>
                            <th style={{"--i":"15%"}}>Tên sản phẩm</th>
                            <th style={{"--i":"10%"}}>Giá</th>
                            <th style={{"--i":"10%"}}>Trạng thái</th>
                            <th style={{"--i":"20%"}}>Chi tiết</th>
                            <th style={{"--i":"15%"}}>Loại</th>
                            <th style={{"--i":"10%"}}>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            subProduct.map((sp)=>(
                                <tr className="item" key={sp.productID} onClick={() => handleRowClick(sp)}>
                                    <td><img src={sp.image_path} alt="product"/></td>
                                    <td>{sp.productName}</td>
                                    <td>{Number(sp.price).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</td>
                                    <td>{sp.productStatus == 1 ? "Còn" : "Hết"}</td>
                                    <td>{sp.detail}</td>
                                    <td>{sp.productType}</td>
                                    <td><button data-id={sp.productID} onClick={(event)=>{handleFormClick("delete",event)}}>Xóa</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}