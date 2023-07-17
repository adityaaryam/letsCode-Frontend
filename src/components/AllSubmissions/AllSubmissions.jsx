import React, { useEffect, useState } from "react";
import './AllSubmissions.css'
import '../Home/Home.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyRow from "./MyRow";

function AllSubmissions(){
    const navigate=useNavigate();
    const handleGoToEditor=()=>{
        navigate('/',{ replace: true })
    }
    var INITIAL_LIST = [{
        byUser:"",
        code:"",
        custIn:"",
        language:"",
        toDis:"",
        __v:0,
        _id:""
    }]

    var [submissionArr, setSubmissionArr]=useState(INITIAL_LIST)
    const showErrorToast = (msg) => {
        toast.error(msg || `Something went wrong! Please try again.`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    useEffect(()=>{ 
        myFunction(); 
    },[])
    const myFunction=()=>{
        const options = {
            method: "POST",
            url: 'https://letscode-wnxr.onrender.com/getSubmissions',
            data:{currUser:JSON.parse(localStorage.getItem('userMain'))._id}
        };
        axios
            .request(options)
            .then(function(res){
                if(res.data!="Error")
                {
                    setSubmissionArr(res.data);
                }
                else
                {
                    showErrorToast(`Couldn't load Submissions, Try Again`)
                }
            })
            .catch((err)=>{
                console.log(err);
                showErrorToast(`Couldn't load Submissions, Try Again`)
    
            })
    }
  
    const logout=()=>{
        console.log("Logging Out")
        localStorage.clear();
        navigate("/login",{ replace: true })
        
    }

    return(
        <div className="subPage">
            <div className="homepage">
                <div className="headerGrid">
                    <h1 className="headergridItem1">Your Submissions</h1>
                    <div className="headergridItem3"><span className="logouttext" onClick={handleGoToEditor} >Code Editor</span></div>
                    <div className="headergridItem2"><span className="logouttext" onClick={logout} >Logout</span></div>
                </div>
                <MyRow dataArr={submissionArr}/>
            </div>
            <ToastContainer/>
        </div>
    )
}
export default AllSubmissions;