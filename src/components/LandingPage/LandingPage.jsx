import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './LandingPage.css'
import logo from '../../Assets/LogoFinal.png'
function LandingPage(props){
    const navigate = useNavigate()
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
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
    return(
        <div>
            {/* <h1>hello register now</h1> */}
            <img src={logo} width="250px" />
            
        </div>
    )
}

export default LandingPage