import "./App.css";
import React , { useState } from "react";


const Name = ["Kornik"];
const navElem = ["Our Teachers", "Our offer", "About us"];
const sub = ["Subjects"];
const signIn = ["SING IN"];
const subjectList = ["• Mathematics" , "• Physics" , "• English" , "• 5D geometry by KK"]

function App() {
  const [status, setStatus] = useState <undefined| number> (undefined);
  const [open , setOpen] = useState(false);

  return (
    <div>
      <div className="mainNav">
        <div className="insideMain">
          {Name.map((name) => (
            <div className="logo-Name">{name}</div>
          ))}
          <div className="navBlocksCont">
            {navElem.map((elem, index) => (
              <div
                key={index}
                className={`navBlocks ${status === index ? "underlined" : ""}`}
                onMouseEnter={() => setStatus(index)}
                onMouseLeave={() => setStatus(undefined)}>
                  {elem}
              </div>
            ))}
          </div>
              

          <div className = "subject-container">

            {sub.map((subj) => (
              <div className = "subjects" 
              onMouseEnter={() =>{setOpen(!open)}}
              onMouseLeave={() =>{setOpen(open)}}>
                {subj} 
              </div>
            ))}    

            <div className = {`dropdown-subjects ${open ? `active` : `inactive`} `}>
              <ul className = "dropdownItem">
                {subjectList.map((subList) => (<div className = "subItem">{subList}</div>))}
             </ul> 
            </div>
          </div>

          {signIn.map((sign) => (
            <div className="signing">{sign}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
