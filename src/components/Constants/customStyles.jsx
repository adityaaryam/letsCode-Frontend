export const customStyles = {
    control: (styles) => ({
      ...styles,
      width: "100%",
      maxWidth: "14rem",
      minWidth: "12rem",
      borderRadius: "5px",
      color: "#000",
      fontSize: "0.8rem",
      lineHeight: "1.75rem",
      fontFamily: "'Montserrat', sans-serif",

      backgroundColor: "#FFFFFF",
      cursor: "pointer",
      border: "2px solid #000000",
      ":hover": {
        border: "2px solid #000000",
        boxShadow: "none",
      },
      marginBottom: "10px",
      marginTop:"-15px",
    }),
    option: (styles) => {
      return {
        ...styles,
        color: "#000",
        fontSize: "0.8rem",
        lineHeight: "1.75rem",
        width: "100%",
        fontFamily: "'Montserrat', sans-serif",

        background: "#fff",
        ":hover": {
          color: "#000",
          cursor: "pointer",
        },
      };
    },
    menu: (styles) => {
      return {
        ...styles,
        backgroundColor: "#fff",
        maxWidth: "14rem",
        border: "2px solid #000000",
        borderRadius: "5px",
        // boxShadow: "5px 5px 0px 0px rgba(0,0,0);",
      };
    },
  
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#000",
        fontSize: "0.8rem",
        lineHeight: "1.75rem",
      };
    },
  };