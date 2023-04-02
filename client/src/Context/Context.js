import {useState, createContext} from "react";

export const Context = createContext();

export const ContextProvider = (props) =>{
    const [issueData, setIssueData] = useState();
    const [userName, setUserName] = useState();

  const [detailShow, setDetailShow] = useState(false)
  const [isAdd, setIsAdd] = useState(false);



    return (
        <Context.Provider value={{ issueData, setIssueData,
                                   userName, setUserName,
                                   detailShow, setDetailShow,
                                   isAdd, setIsAdd
                                   }}>
            {props.children}
        </Context.Provider>
    )
}