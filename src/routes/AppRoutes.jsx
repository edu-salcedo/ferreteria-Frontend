
import { Routes, Route } from 'react-router-dom';
import Home from "../pages/home/Home"

import Products from '../pages/products/Products';
import ProductDetail from '../pages/products/ProductDetail';
import Upload from '../pages/other/Upload';
import ProductsAdmin from '../pages/products/ProductsAdmin';
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/checkout/Checkout';

const AppRoutes = () => (

    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productosAdmin" element={<ProductsAdmin />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
    </Routes>

);

export default AppRoutes;