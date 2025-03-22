import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.jsx"; // Kiểm tra đường dẫn này có đúng không
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Menu from "./pages/Menu.jsx";
import Product from "./pages/Product.jsx";
import Statistical from "./pages/statistical.jsx";
import Login from "./pages/Login.jsx";
import MainLayout from "./MainLayout";
import ManagerLayout from "./ManagerLayout";
import Order from "./pages/Order.jsx";
import User from "./pages/User.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
 // Nếu muốn giữ Header trên tất cả các trang


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<MainLayout> <Home /> </MainLayout>} />
          <Route path="/Menu/:Type" element={<MainLayout><Menu /> </MainLayout>}/>
          <Route path="/collections/all" element={<MainLayout> <Header /> </MainLayout>}/>
          <Route path="/Manager/ProductManager" element={<MainLayout> <Product /> </MainLayout>}/>
          <Route path="/Manager/Statistical" element={<MainLayout> <Statistical /> </MainLayout>}/>
          <Route path="/Order" element={<MainLayout> <Order /> </MainLayout>}/>
          <Route path="/Manager/Users" element={<MainLayout> <User /> </MainLayout>}/>
          <Route path="/Product/:id" element={<MainLayout> <ProductDetail /> </MainLayout>}/>
          <Route path="/Login" element={<ManagerLayout> <Login /> </ManagerLayout>}/>
        </Routes>
    </Router>
  );
}

export default App;


