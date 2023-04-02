import {useState, createContext} from "react";

export const Context = createContext();

export const ContextProvider = (props) =>{
    const [issueData, setIssueData] = useState();
    const [userName, setUserName] = useState();

  const [detailShow, setDetailShow] = useState(false)
  const [isAdd, setIsAdd] = useState(false);
  const [allRepo, setAllRepo] = useState([]);
  const [repo, setRepo] = useState();
  const [searchAll, setSearchAll] =useState(false)



    return (
        <Context.Provider value={{ issueData, setIssueData,
                                   userName, setUserName,
                                   detailShow, setDetailShow,
                                   isAdd, setIsAdd,
                                   allRepo, setAllRepo,
                                   repo, setRepo,
                                   searchAll, setSearchAll
                                   }}>
            {props.children}
        </Context.Provider>
    )
}