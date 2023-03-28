import {useState, createContext} from "react";

export const Context = createContext();

export const ContextProvider = (props) =>{
    const [issueData, setIssueData] = useState();
    const [userName, setUserName] = useState();



    return (
        <Context.Provider value={{issueData, setIssueData, userName, setUserName}}>
            {props.children}
        </Context.Provider>
    )
}