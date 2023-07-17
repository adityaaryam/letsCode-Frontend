import React, { useEffect, useState } from "react";
import './Home.css'

const OutputWindow = ({ todis }) => {
  const [keyy,setkey]=useState(1);
  
  useEffect(()=>{
    setkey(!keyy);
  },[todis])
  return (
    <div className="codeGridItem21">
      {/* {outputDetails ? <>{getOutput()}</> : null} */}
      <h1 >
        Output
      </h1>

      <textarea
        rows="5"
        columns="5"
        value={todis}
        placeholder="Click on Execute"
        className="customInput"
        key={keyy}
        disabled
      ></textarea>
    </div>
  );
};

export default OutputWindow;