import { createContext, useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateLoan from "./components/CreateLoan";
import axios from "axios";

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const navigate = (path) => {
    window.location.pathname = path;
  };

  const fetchUser = async (token) => {
    try {
      console.log(token);
      const userDetails = await axios.get(
        "https://loan-app-be-onjz.onrender.com/api/v1/auth/",
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      if (!userDetails.data) throw "No user found";
      setUser(userDetails.data.user);
      setToken(token);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchUser(token);
  }, []);
  const ProtectedRoutes = ({ component }) => {
    return <>{isLoggedIn ? component : <Login />}</>;
  };

  const UnProtectedRoutes = ({ component }) => {
    return <>{!isLoggedIn ? component : <Home />}</>;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoutes component={<Home />} />,
    },
    {
      path: "/login",
      element: <UnProtectedRoutes component={<Login />} />,
    },
    {
      path: "/signup",
      element: <UnProtectedRoutes component={<Signup />} />,
    },
    {
      path: "/createLoan",
      element: <ProtectedRoutes component={<CreateLoan />} />,
    },
  ]);

  return (
    <>
      {/* <Login /> */}
      {/* <Signup/> */}
      {/* <Home /> */}
      <AuthContext.Provider
        value={{
          isLoggedIn,
          setLoggedIn,
          user,
          setUser,
          token,
          setToken,
        }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  );
}

export default App;
