import {useState, createContext} from "react";

export const Context = createContext();

export const ContextProvider = (props) =>{
    const [issueData, setIssueData] = useState();
    const [allIssue, setAllIssue] = useState([]);
    const [userName, setUserName] = useState();

  const [detailShow, setDetailShow] = useState(false)
  const [isAdd, setIsAdd] = useState(false);
  const [allRepo, setAllRepo] = useState([]);
  const [repo, setRepo] = useState();
  const [totalData, setTotalData] = useState(0)
  const [searchAll, setSearchAll] =useState(false)
  const [cardLoading, setCarfLoading] = useState(false);



    return (
        <Context.Provider value={{ issueData, setIssueData,
                                   userName, setUserName,
                                   allIssue, setAllIssue,
                                   detailShow, setDetailShow,
                                   isAdd, setIsAdd,
                                   allRepo, setAllRepo,
                                   repo, setRepo,
                                   searchAll, setSearchAll,
                                   cardLoading, setCarfLoading,
                                   totalData, setTotalData
                                   }}>
            {props.children}
        </Context.Provider>
    )
}