import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'
import './buttons.css'
import CodeEditorWindow from "./CodeEditorWindow";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import { langOptions } from "../Constants/langOptions";
import { customStyles } from "../Constants/customStyles";
import Select from "react-select";
import { languages } from "monaco-editor";
import {Buffer} from 'buffer';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home(props){
    const navigate=useNavigate();
    const [homeVis,setHomeVis]=useState(true);
    const [lang, setLang]=useState(langOptions[0].value);
    const [defCode, setDefCode]=useState(langOptions[0].def);
    const [custIn, setCustIn]= useState("");
    const [code, setCode]=useState(langOptions[0].def);
    const [langDetails, setLangDetails]=useState(langOptions[0]);
    const [isCompiling, setIsCompiling]= useState(false);
    const [todis, settodis]=useState("");
    const [accepted, setAccpted]=useState(false);
    const [mem,setmem]=useState("");
    const [tim,setTim]=useState("");

    const getOutput = (outputDetails) => {
        let statusId = outputDetails?.status?.id;
    
        if (statusId === 6) {
          // compilation error
          
          settodis(Buffer.from(outputDetails?.compile_output,'base64').toString('binary'));
        } 
        else if (statusId === 3) {
          let temp=Buffer.from(outputDetails.stdout,'base64').toString('binary');
          settodis(temp!==null? temp:"");
          setAccpted(true);
          setmem(outputDetails?.memory);
          setTim(outputDetails?.time);
        } 
        else if (statusId === 5) {
          settodis("Time Limit Exceeded");
        } 
        else {
          settodis(Buffer.from(outputDetails?.stderr,"base64"))
        }
    };

    const showSuccessToast = (msg) => {
        toast.success(msg || `Compiled Successfully!`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
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

    const logout=()=>{
        console.log("Logging Out")
        localStorage.clear();
        navigate("/login",{ replace: true })
        
    }
    
    const handleDropDown=(event)=>{
        setLang(event.value);
        setDefCode(event.def);
        setCode(event.def);
        setLangDetails(event); 
    }
    const apiKeys=[process.env.REACT_APP_RAPID_API_KEY0, process.env.REACT_APP_RAPID_API_KEY1, process.env.REACT_APP_RAPID_API_KEY2, process.env.REACT_APP_RAPID_API_KEY3, 
              process.env.REACT_APP_RAPID_API_KEY4,process.env.REACT_APP_RAPID_API_KEY5,process.env.REACT_APP_RAPID_API_KEY6,process.env.REACT_APP_RAPID_API_KEY7]
    const checkStatus = async (token,apikey) => {

        const options = {
          method: "GET",
          url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
            "X-RapidAPI-Key": apikey,
          },
        };
        try {
          let response = await axios.request(options);
          let statusId = response.data.status?.id;
          // Processed - we have a result
        //   setOutput({inProg: true, msg:statuses[statusId-1]});
          if (statusId === 1 || statusId === 2) {
            // still processing
            setTimeout(() => {
              checkStatus(token,apikey)
            }, 2000)
            return
          } else {
            setIsCompiling(false)
            getOutput(response.data);
            showSuccessToast(`Compiled Successfully!`)
            // console.log('response.data', response.data);
            // console.log(Buffer.from(response.data.stdout,'base64').toString('binary'));
            let nece={
                name:langDetails.name,
                outputTodis:response.data,
                currUser: JSON.parse(localStorage.getItem('userMain'))._id
            }
            let msg={custIn, code, nece};
            axios.post("https://letscode-wnxr.onrender.com/compile",msg)
                .then(function(res){
                    console.log(res);
                })
                .catch(function(err){
                    console.log(err);
                })
            return
          }
        } catch (err) {
          console.log("err", err);
          setIsCompiling(false);
          showErrorToast();
        }
    };

    const handleExecute=(event)=>{
        setIsCompiling(true);
        setAccpted(false);
        let necessary={
            id:langDetails.id,
            name:langDetails.name,
            value:langDetails.value
        }
        const dataToCompile={
            language_id: necessary.id,
            source_code: Buffer.from(code, 'binary').toString('base64'),
            stdin: Buffer.from(custIn,'binary').toString('base64'),        
        };
        let apiKey=apiKeys[Math.floor(8*Math.random())];
        const options={
            method: "POST",
            url: process.env.REACT_APP_RAPID_API_URL,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "content-type": "application/json",
                "Content-Type": "application/json",
                "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
                "X-RapidAPI-Key": apiKey,
            },
            data: dataToCompile,
        };
        axios
            .request(options)
            .then(function(res){
                console.log("res data", res.data);
                const token= res.data.token;
                showSuccessToast(`Submitted`)
                checkStatus(token,apiKey);
            })
            .catch((err)=>{
                let error = err.response ? err.response.data : err;
                console.log(error);
                showErrorToast(`Error 404. Please re-Submit`)
                setIsCompiling(false);
            });
    };
    
    const onCodeChange = (action, data) => {
        switch (action) {
          case "code": {
            setCode(data);
            break;
          }
          default: {
            console.warn("case not handled!", action, data);
          }
        }
    };
    const handleMySubs=()=>{
        navigate('/mySubmissions',{replace:true})
    }
    let ExecutionClass="mybtn pheasant-demure-button outline dark hover icon blink round-corner";
    let diableExecutionClass="mydisable pheasant-demure-button outline dark hover icon blink round-corner";
    let acceptClass="memTime";
    let disableAcceptClass="diableMemTime"
    const passExecute=()=>{
        return;
    }

    return(
        <div className={!homeVis? "HomeHide":""}>
            <div className="homepage">
                <div className="headerGrid">
                    <h1 className="headergridItem1">Hello {props.user.name}</h1>
                    <div className="headergridItem3"><span className="logouttext" onClick={handleMySubs}>My Submissions</span></div>
                    <div className="headergridItem2"><span className="logouttext" onClick={logout}>Logout</span></div>
                </div>
                <Select
                placeholder={`C++ (GCC 9.2.0)`}
                options={langOptions}
                styles={customStyles}
                defaultValue={lang}
                isSearchable={false}
                onChange={handleDropDown}
                />
                <div className="codeGrid">
                    <CodeEditorWindow code={code} language={lang} defualtCode={defCode} onChange={onCodeChange}/>
                    <div className="codeGridItem2">
                        <OutputWindow todis={todis} />
                        <CustomInput customInput={custIn} setCustomInput={setCustIn}/>
                         <button type="button" onClick={isCompiling==false?handleExecute:passExecute} className={isCompiling==false? ExecutionClass : diableExecutionClass}>
                            <span className="label">{isCompiling==false? 'Execute': 'Executing...'}</span>
                            <span className="material-icons icon">chevron_right</span>
                        </button>
                        <p className={accepted==true? acceptClass: disableAcceptClass}>Memory: {mem}</p>
                        <p className={accepted==true? acceptClass: disableAcceptClass}>Time: {tim}</p>
                    </div>
                    

                </div>
                
            </div>
            <ToastContainer />

        </div>
    )
}

export default Home