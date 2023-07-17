import React, { useEffect, useState } from "react";
import './Home.css'
import Editor from "@monaco-editor/react";


const CodeEditorWindow = ({ onChange, language, code , defualtCode}) => {
  const [value, setValue] = useState(code || "");
  const[defCode, setDefCode]=useState("");
  const [keyval,setkeyval]=useState(0);
  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };
  useEffect(()=>{
    setDefCode(defualtCode);
    setValue(defualtCode);
    setkeyval(!keyval);
  },[defualtCode])
  
  function handleEditorValidation(markers) {
    // model markers
    markers.forEach((marker) => console.log("onValidate:", marker.message));
  }
  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl" key={keyval}>
      <Editor
        height="75vh"
        width={`100%`}
        language={language}
        value={value}
        theme={"vs-dark"}
        defaultValue={defualtCode}
        onChange={handleEditorChange}
        onValidate={handleEditorValidation}
      />
    </div>
  );
};
export default CodeEditorWindow;