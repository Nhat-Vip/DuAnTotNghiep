import React,{useState,useEffect} from 'react'

export default function Statistical(){
        const [product,setProduct] = useState([]); 
    
        useEffect(()=>{
            fetch("http://coffee.local/api/product.php?action=all")
            .then((response)=> response.json())
            .then((data)=>{ 
                if (Array.isArray(data)) {
                setProduct(data);
                } else {
                console.error("API trả về không phải mảng:", data);
                setProduct([]);
            }   
                })
            .catch((error)=> console.log(error));
        },[]);
    return(
        <div className="Statistical">
        <div className="Statistical-content">
            
            <input type="text" placeholder="Tìm kiếm sản phẩm.." style={{"--i":"40%"}}/>
            <select name="type" id="type" style={{"--i":"25%"}}>
                <option value="Coffee">Coffee</option>
                <option value="Trà sữa">Trà sữa</option>
                <option value="Trà trái cây">Trà trái cây</option>
                <option value="Trái cây xay">Trái cây xay</option>
                <option value="Bánh ngọt">Bánh ngọt</option>
            </select>
            <select name="date" id="date" style={{"--i":"25%"}}>
                <option value="day">Day</option>
                <option value="month">Month</option>
            </select>
        </div>
        <div className="Statistical-table">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Đã bán</th>
                        <th>Tổng</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        product.map((sp,key)=>(
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{sp.productName}</td>
                                <td>{Number(sp.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                                <td>10</td>
                                <td>200.000 đ</td>
                            </tr>
                        ))
                    }
                    {/* <tr>
                        <td>1</td>
                        <td>Cà phê đá</td>
                        <td>20.000 đ</td>
                        <td>10</td>
                        <td>200.000 đ</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Cà phê đá</td>
                        <td>20.000 đ</td>
                        <td>10</td>
                        <td>200.000 đ</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Cà phê đá</td>
                        <td>20.000 đ</td>
                        <td>10</td>
                        <td>200.000 đ</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Cà phê đá</td>
                        <td>20.000 đ</td>
                        <td>10</td>
                        <td>200.000 đ</td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    </div>
    );
}