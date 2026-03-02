import Catalog from './pages/Catalog';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import Home from './pages/Home';
import MyProducts from './pages/MyProducts';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Admin from './pages/Admin';
import __Layout from './Layout.jsx';

export const PAGES = {
    "Catalog": Catalog,
    "CreateProduct": CreateProduct,
    "EditProduct": EditProduct,
    "Home": Home,
    "MyProducts": MyProducts,
    "ProductDetail": ProductDetail,
    "Profile": Profile,
    "Login": Login,
    "Admin": Admin,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
