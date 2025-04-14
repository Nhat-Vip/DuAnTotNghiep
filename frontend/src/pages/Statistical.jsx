import React,{useState,useEffect} from 'react'

export default function Statistical(){
        const [statistical,setStatistical] = useState([]);
        const [subStatistical,setSubStatistical] = useState([]);
        const [dateTime,setDateTime] = useState("day");
        const [statisticalType,setStatisticalType] = useState("product");
    
        useEffect(()=>{
            fetch("/api/Statistical.php?action=product")
            .then((response)=> response.json())
            .then((data)=>{ 
                if (Array.isArray(data)) {
                setStatistical(data);
                setSubStatistical(data);
                console.log(data);
                } else {
                console.error("API trả về không phải mảng:", data);
                setStatistical([]);
            }   
                })
            .catch((error)=> console.log(error));
        },[]);

        const ChangeStatistical = (type) => {
            fetch(`/api/Statistical.php?action=${type}`)
            .then((response)=>response.json())
            .then((data)=>{
                setSubStatistical(data);
                setStatistical(data);})
            .catch((err)=>console.log(err));
            setStatisticalType(type);
        }

        useEffect(()=>{
            LoadDate(dateTime);
        },[statistical]);//eslint-disable-line


        const LoadDate = () =>{
                if(dateTime == "day"){
                    const today = new Date().toISOString().split("T")[0];
                    const data  = statistical.filter((sta)=>{
                        console.log(sta.orderDate);
                        const orderDate = new Date(sta.orderDate)?.toISOString().split("T")[0];
                        console.log("Today",today + "orderDate",orderDate);
                        return orderDate == today
                    })
                    setSubStatistical(data);
                    // setDateTime("day");
                    console.log("TODAY ",data);
                }
                else{
                    const data = statistical.filter((sta)=>{
                        // const Month = new Date(sta.orderDate).getMonth()+1;
                        const thisMonth = new Date().getMonth()+1;
                        return(
                            new Date(sta.orderDate).getMonth() +1 == thisMonth
                        )
                    })
                    setSubStatistical(data);
                    // setDateTime("month");
                    console.log("TO MONTH ",data);
            }
        }

        useEffect(()=>{
            LoadDate(dateTime);
        },[dateTime]);//eslint-disable-line

    return(
        <div className="Statistical">
        <div className="Statistical-content">
            
            <input type="text" placeholder="Tìm kiếm sản phẩm.." style={{"--i":"40%"}}/>
            <select name="type" id="type" style={{"--i":"25%"}} onChange={(e)=>ChangeStatistical(e.target.value)}>
                <option value="product">Sản phẩm</option>
                <option value="ingredient">Nguyên liệu</option>
                <option value="order">Hóa đơn</option>
            </select>
            <select name="date" id="date" value={dateTime} style={{"--i":"25%"}} onChange={(e)=>setDateTime(e.target.value)}>
                <option value="day">Day</option>
                <option value="month">Month</option>
            </select>
        </div>
        <div className="Statistical-table">
            <table style={{display: statisticalType == "product" ? "table" : "none"}}>
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
                        subStatistical.map((sp,key)=>(
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{sp.productName}</td>
                                <td>{Number(sp.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                                <td>{sp.quantity}</td>
                                <td>{Number(sp.total).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr style={{backgroundColor:"white"}}>
                        <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold", fontSize: "2rem" }}>Tổng:</td>
                        <td style={{ fontWeight: "bold", fontSize: "1.7rem", color:"red" }}>
                            {
                            Number(
                                subStatistical.reduce((sum, sp) => sum + Number(sp.total), 0)
                            ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                            }
                        </td>
                    </tr>
                </tfoot>
            </table>
            <table style={{display: statisticalType == "ingredient" ? "table" : "none"}}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nhân viên</th>
                        <th>Tên nguyên liệu</th>
                        <th>Số lượng</th>
                        <th>Thời gian</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        subStatistical.map((sp,key)=>(
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{sp.userName}</td>
                                <td>{sp.IngredientName}</td>
                                <td>{Number(sp.quantity)}</td>
                                <td>{sp.orderDate}</td>
                                <td>{sp.note}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <table style={{display: statisticalType == "order" ? "table" : "none"}}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên khách</th>
                        <th>Nhân viên</th>
                        <th>Bàn</th>
                        <th>Ghi chú</th>
                        <th>Thời gian</th>
                        <th>SDT</th>
                        <th>Tổng</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        subStatistical.map((sp,key)=>(
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{sp.OrderName}</td>
                                <td>{sp.fullName}</td>
                                <td>{sp.tableID}</td>
                                <td>{sp.note}</td>
                                <td>{sp.orderDate}</td>
                                <td>{sp.sdt}</td>
                                <td>{Number(sp.total).toLocaleString("vi-VN",{style:"currency",currency:"VND"})}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
    );
}