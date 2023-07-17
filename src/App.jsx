import React, { useState } from "react";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import Home from "./components/Home/Home.jsx"
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import { Navigate } from "react-router-dom";
import AllSubmissions from "./components/AllSubmissions/AllSubmissions.jsx"
import Page404 from "./Page404.jsx";
function App(){
const [user, setLoginUser]=useState({})
    return(
        <div>
            <Router>
                <Routes>
                    <Route exact path="/" element={user&&user._id?<Home user={user}/>:<Login setLoginUser={setLoginUser}/>}/>
                    {!(user&&user._id)}&&<Route path="/login" element={<Login setLoginUser={setLoginUser}/>}/>
                    {!(user&&user._id)}<Route path="/register" element={<Register/>}/>
                    {user&&user._id}&&<Route path="/mySubmissions" element={<AllSubmissions/>}/>
                    <Route path="/404" element={<Page404/>}/>
                    <Route path="*" element={<Navigate to="/404"/>}/>
                </Routes>
            </Router>
        </div>
        
    )
}

export default App;