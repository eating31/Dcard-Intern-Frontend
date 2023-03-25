import {useState, createContext} from "react";

export const Context = createContext();

export const ContextProvider = (props) =>{
    const [issueUrl, setIssueUrl] = useState();



    return (
        <Context.Provider value={{issueUrl, setIssueUrl }}>
            {props.children}
        </Context.Provider>
    )
}