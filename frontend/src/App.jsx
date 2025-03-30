import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.jsx"; // Kiểm tra đường dẫn này có đúng không
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Menu from "./pages/Menu.jsx";
import Product from "./pages/Product.jsx";
import Statistical from "./pages/Statistical.jsx";
import Login from "./pages/Login.jsx";
import MainLayout from "./MainLayout";
import ManagerLayout from "./ManagerLayout";
import Order from "./pages/Order.jsx";
import User from "./pages/User.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import ChangePassword from "./pages/Change-password.jsx";
import Ingredient from "./pages/Ingredient.jsx";
import Statistical_Ingredient from "./pages/Statiscal_Ingredient.jsx";
import Order_Manager from "./pages/Order-Manager.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Payment from "./pages/Payment.jsx";
// import Admin from "./components/Admin.jsx";
 // Nếu muốn giữ Header trên tất cả các trang


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<MainLayout> <Home /> </MainLayout>} />
          <Route path="/home" element={<MainLayout> <Home /> </MainLayout>} />
          <Route path="/Menu/:Type" element={<MainLayout><Menu /> </MainLayout>}/>
          <Route path="/collections/all" element={<MainLayout> <Header /> </MainLayout>}/>
          <Route path="/Manager/ProductManager" element={<MainLayout> <Product /> </MainLayout>}/>
          <Route path="/Manager/Statistical" element={<MainLayout> <Statistical /> </MainLayout>}/>
          <Route path="/Order" element={<MainLayout> <Order /> </MainLayout>}/>
          <Route path="/Manager/Users" element={<MainLayout> <User /> </MainLayout>}/>
          <Route path="/Product/:id" element={<MainLayout> <ProductDetail /> </MainLayout>}/>
          <Route path="/User-profile" element={<MainLayout> <UserProfile /> </MainLayout>}/>
          <Route path="/Manager/Ingredient" element={<MainLayout> <Ingredient /> </MainLayout>}/>
          <Route path="/Manager/Statistical-Ingredient" element={<MainLayout> <Statistical_Ingredient /> </MainLayout>}/>
          <Route path="/Manager/Order" element={<MainLayout> <Order_Manager /> </MainLayout>}/>
          <Route path="/Change-password" element={<MainLayout> <ChangePassword /> </MainLayout>}/>
          {/* <Route path="/Order/Manager" element={<MainLayout> <Admin /> </MainLayout>}/> */}
          <Route path="/Order-Detail" element={<ManagerLayout> <OrderDetail /> </ManagerLayout>}/>
          <Route path="/Login" element={<ManagerLayout> <Login /> </ManagerLayout>}/>
          <Route path="/Payment" element={<ManagerLayout> <Payment /> </ManagerLayout>}/>
        </Routes>
    </Router>
  );
}

export default App;


