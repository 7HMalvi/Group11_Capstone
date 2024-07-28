import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../common/Navbar";


export default function Layout({ children })
 {
  const { pathname } = useLocation();
     const loginRoute = pathname.toLowerCase() === "/signup" || pathname.toLowerCase() === "/login" || pathname.toLowerCase() === "/";
  return 
  (
    <div>
    {!loginRoute && <Navbar />}
    {children}
    </div>
  );
}