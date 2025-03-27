// import { useEffect, useState } from "react";
// import { database, ref, onChildAdded } from "./firebase";

// export default function Admin(){
//     const [notifications, setNotifications] = useState([]);
//     useEffect(()=>{
//         const orderRef = ref(database, "orders");
//         onChildAdded(orderRef,(snapshot) =>{
//             console.log("Don hang moiw");
//             const order = snapshot.val();
//             setNotifications((prev)=>[...prev,`🚀 Đơn hàng mới: ${order.name} - ${order.price} VND`]);
//         })
//     },[])

//     return (
//     <div>
//       <h1>Thông báo đơn hàng</h1>
//       <ul>
//         {notifications.map((msg, index) => (
//           <li key={index}>{msg}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
