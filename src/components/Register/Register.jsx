import React, { useEffect, useState } from "react";
import '../Register.css'
import axios from "axios";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confPassword: "",
        verificationCode: ""
    })

    const [code, setCode] = useState("")

    const [renderverif, setRenderverif] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('userReToken')) {
            console.log(localStorage.getItem('userReToken'));
            navigate('/');
        }
        
    }, []);
    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
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
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }


    const sendCode = async (e) => {
        e.preventDefault();
        const { name, email, password, confPassword } = user
        // let tempName=
        let randCode = "";
        randCode = await Math.floor(Math.random() * 16777215).toString(16);
        if (randCode.length === 5)
            randCode += '0';
        if (name && email && checkPass(password) && password === confPassword) {

            const params = new URLSearchParams();
            params.append('email', email)
            params.append('vericode', randCode)
            axios.post("https://letscode-wnxr.onrender.com/emailverif", params, config)
                .then(function (res) {
                    let emailExist = res.data
                    if (emailExist) {
                        toast('Account with this e-Mail already exists', {
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
                        setRenderverif(true);
                        // console.log(renderverif)
                        toast('Code has been sent to your email', {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })

                        setCode(randCode)
                        console.log(randCode);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
            console.log("all correct")
        }
        else {
            if (!name || !email || !password) {
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
            else if (!checkPass(password) || password !== confPassword) {
                toast(password !== confPassword ? 'Passwords do not match' : 'Passwords Conditions not met', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setUser({
                    name: name,
                    email: email,
                    password: "",
                    confPassword: ""
                })
            }

            else {
                toast("Error! Please try again", {
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
    }
    const register = (e) => {
        e.preventDefault();

        if (user.verificationCode === code) {
            const params = new URLSearchParams();
            const { name, email, password, confPassword } = user
            params.append('name', name)
            params.append('email', email)
            params.append('password', password)
            params.append('confPassword', confPassword)
            axios.post("https://letscode-wnxr.onrender.com/register", params, config)
                .then(function (res) {
                    // let userinfo=res.data;
                    // navigate('/login')
                    toast("Welcome to Judge0 " + res.data + ", Please Log In", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setTimeout(() => {
                        navigate('/login')
                    }, 3500)

                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        else {
            toast("Code Incorrect. Please re-Check", {
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

        <div>
            <div className="registerBG">
                <div className="box center">
                    {console.log(user)}
                    <div className={renderverif ? "hide" : ""}>
                        <h1>Sign Up</h1>
                        <div>
                            <input className="form-control input" name="name" value={user.name} type="text" placeholder="Full Name" required onChange={handleChange}></input>
                            <input className="form-control input" name="email" value={user.email} type="email" placeholder="your-mail@email.com" required onChange={handleChange}></input>
                            <Tippy className="tippystyle" placement="right" content={<div>Min Length 8<br />Must contain atleast:<br /> 1 uppercase, 1 lowercase, 1 number <br /> and 1 special char:<br /> ~ , ! , @ , # , $ , % , ^ , & , * </div>}>
                                <input className="form-control input" id="password" name="password" value={user.password} type="password" required placeholder="Password" onChange={handleChange}></input>
                            </Tippy>
                            <input className="form-control input" name="confPassword" value={user.confPassword} type="password" required placeholder="Confirm Password" onChange={handleChange}></input>
                            <button type="submit" className="btn" onClick={sendCode}>Sign Up</button>
                            <p className="foot">Have an Account? <a href="/login">Log In</a> </p>
                        </div>
                    </div>
                    <div className={!renderverif ? 'hide' : ""}>
                        <h1>Verify e-Mail</h1>
                        <input className="form-control input" name="verificationCode" value={user.verificationCode} type="text" placeholder="Code Sent on e-Mail" onChange={handleChange} autoComplete="none" ></input>
                        <button type="submit" className="btn" onClick={register}>Verify Code</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
export default Register