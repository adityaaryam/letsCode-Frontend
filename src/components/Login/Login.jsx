import React, { useState, useEffect } from "react";
import '../Register.css'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login(props) {
    const navigate = useNavigate()
    const [fpass, setFpass] = useState(false)
    const [fpassCode, setFpassCode] = useState("")
    const [fpassEmail, setFpassEmail] = useState(false)
    const [newPass, setNewPass] = useState(false)
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    function checkPass(pass) {
        let up = false;
        let down = false;
        let num = false;
        let spchar = false;
        if (pass.length < 8)
            return 0;

        for (let i = 0; i < pass.length; i++) {
            if (pass[i] >= 'A' && pass[i] <= 'Z')
                up = true;
            if (pass[i] >= 'a' && pass[i] <= 'z')
                down = true;
            if (pass[i] >= '0' && pass[i] <= '9')
                num = true;
            if (pass[i] === '~' || pass[i] === '!' || pass[i] === '@' || pass[i] === '#' || pass[i] === '$' || pass[i] === '%' || pass[i] === '^' || pass[i] === '&' || pass[i] === '*')
                spchar = true;
        }
        return (up && down && num && spchar);
    }

    useEffect(() => {
        const params = new URLSearchParams();
        if (localStorage.getItem('userReToken')) {
            let token = localStorage.getItem('userReToken');
            params.append('token', token)
            axios.post('https://letscode-wnxr.onrender.com/check', params, config)
                .then(res => {
                    if (res.data.message === 200) {

                        props.setLoginUser(res.data.user);
                        // console.log(res.data.user)
                    }
                })
        }
        if (localStorage.getItem('userReToken')) {
            navigate('/');
        }
    }, []);

    const [user, setUser] = useState({
        email: "",
        password: "",
        newPassword: "",
        ReNewPassword: "",
        verificationCode: ""

    })
    const handleForgotPass = () => {
        setFpass(true);
        setFpassEmail(true);
    }
    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }
    const handleFPassCode = () => {
        const { email } = user;
        if (!email) {
            toast("Please Enter your email", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
        else {
            let randCode = "";
            randCode = Math.floor(Math.random() * 16777215).toString(16);
            if (randCode.length === 5)
                randCode += '0';
            setFpassCode(randCode);
            let userData = {
                email: email,
                code: randCode
            }
            axios.post("https://letscode-wnxr.onrender.com/checkuser&sendCode", userData)
                .then(function (res) {
                    console.log(res.data)
                    toast(res.data.message, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    if (res.data.status) {
                        setNewPass(true)
                        setFpassEmail(false)
                    }
                })
        }
    }
    const handlePassChange = () => {
        let msg = "";
        const { verificationCode, newPassword, ReNewPassword } = user;
        if (!verificationCode || !newPassword || !ReNewPassword)
            msg = "Please fill all the fields";
        else if (verificationCode !== fpassCode)
            msg = "Verification Code is Incorrect";
        else if (!checkPass(newPassword))
            msg = "Password conditions not met"
        else if (newPassword !== ReNewPassword)
            msg = "Re-entered password does not match. Please Re-check"
        if(msg)
        toast(msg, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        if(checkPass(newPassword) && newPassword===ReNewPassword)
        {
            axios.post('https://letscode-wnxr.onrender.com/updatepassword',user)
                .then(function(res){
                    toast(res.data.message, {
                        position: "top-center",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setFpass(false);
                    setFpassEmail(false);
                    setNewPass(false);
                })
        }
    }
    
    const login = () => {
        const { email, password } = user;
        if (email && password) {
            axios.post("https://letscode-wnxr.onrender.com/login", user)
                .then(function (res) {
                    toast(res.data.message, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })

                    props.setLoginUser(res.data.user)
                    if (res.data.user) {
                        console.log(localStorage.getItem)
                        localStorage.setItem('userMain', JSON.stringify(res.data.user));
                        localStorage.setItem('userToken', res.data.token);
                        localStorage.setItem('userReToken', res.data.retoken);
                        navigate('/')
                    }


                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        else
        {
            toast('Please fill all the fields', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }

    }
    return (
        <div className="registerBG">
            <div className="box center" >
                {console.log(user)}
                <div className={fpass ? "hide" : ""}>
                    <h1>Welcome Back</h1>
                    <p className="logintocont">Login to continue</p>
                    <div>
                        <input name="email" value={user.email} className="form-control input" type="email" placeholder="registered-mail@email.com" onChange={handleChange}></input>
                        <input name="password" value={user.password} className="form-control input" type="password" placeholder="Password" onChange={handleChange}></input>
                        <button type="submit" className="btn" onClick={login}>Login</button>
                        <p><a onClick={handleForgotPass} className="forgot">Forgot Password?</a></p>
                        <p className="foot">New User? <a href="/register">Sign Up</a> </p>
                    </div>
                </div>
                <div className={!fpassEmail ? "hide" : ""}>
                    <h1>Reset Password</h1>
                    <p className="logintocont">Enter your registered Email</p>
                    <div>
                        <input name="email" value={user.email} className="form-control input" type="email" placeholder="registered-mail@email.com" onChange={handleChange}></input>
                        <button type="submit" className="btn" onClick={handleFPassCode}>Get Code</button>
                    </div>
                </div>
                <div className={!newPass ? "hide" : ""}>
                    <h1>Reset Password</h1>
                    <div >
                        <input name="verificationCode" value={user.verificationCode} className="form-control input" type="text" placeholder="Code Sent on your Email" onChange={handleChange}></input>
                        <Tippy className="tippystyle" placement="right" content={<div>Min Length 8<br />Must contain atleast:<br /> 1 uppercase, 1 lowercase, 1 number <br /> and 1 special char:<br /> ~ , ! , @ , # , $ , % , ^ , & , * </div>}>
                            <input name="newPassword" value={user.newPassword} className="form-control input" type="password" placeholder="Enter New Password" onChange={handleChange}></input>
                        </Tippy>
                        <input name="ReNewPassword" value={user.ReNewPassword} className="form-control input" type="password" placeholder="Re-Enter New Password" onChange={handleChange}></input>
                        <button type="submit" className="btn" onClick={handlePassChange}>Reset Password</button>
                    </div>
                </div>
            </div>
            <ToastContainer />

        </div>
    )
}
export default Login