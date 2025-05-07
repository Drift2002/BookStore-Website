import {createBrowserRouter,  } from "react-router-dom";
import App from "../App";
import Register from "../components/Register";
import Login from "../components/Login";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import Profile from "../pages/Profile"


const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            index: true,
            element: null
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        {
          path: "/cart",
          element: <Cart/>
        },
        {
          path: "/checkout",
          element: <Checkout/>
        },
        {
          path: "/profile",
          element: <Profile/>
        }
      ]
    },
  ]);

  export default router;