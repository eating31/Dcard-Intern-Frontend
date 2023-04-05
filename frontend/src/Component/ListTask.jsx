import React,{useEffect, useState, useContext, useRef} from 'react'
import { Context } from "../Context/Context";
import axios from 'axios';

import AddTask from './AddTask';
import DetailTask from './DetailTask';
// import Login from './Login';
import Siders from './Siders'
import SearchBar from './SearchBar';

import { Row, Col, Card, Spinner, Badge } from 'react-bootstrap';

function ListTask() {
    const {issueData, setIssueData} = useContext(Context)
    const {userName, setUserName} = useContext(Context)
    const {detailShow, setDetailShow} = useContext(Context)

    const [loginLoading, setLoginLoading] = useState(false);
    const {cardLoading, setCarfLoading} = useContext(Context)

    const [page, setPage] = useState(1);
    const {totalData, setTotalData} = useContext(Context)

    const [hasMore, setHasMore] = useState(true);
    const [top, setTop] = useState(0);
    
    const { repo, setRepo} = useContext(Context)
    const { allRepo, setAllRepo} = useContext(Context)
    const {searchAll, setSearchAll} =useContext(Context)

    const {allIssue, setAllIssue} = useContext(Context)

    const [clickedLinks, setClickedLinks] = useState([]);

    useEffect(() => {
        const querytring = window.location.search;
        const urlParams = new URLSearchParams(querytring);
        const codeParams = urlParams.get("code")
        if(codeParams &&(localStorage.getItem("access_token")===null)){
            async function getAccessToken() {
                setLoginLoading(true);
                await axios.get("http://localhost:4000/getAccessToken?code="+ codeParams)
                .then(data =>{
                    if(data.data.access_token) {
                        localStorage.setItem("access_token",data.data.access_token);
                    }
                })
                .then(()=> getUserData())
                .catch(err => console.log(err))
                .finally(()=>  setLoginLoading(false))
            }
            getAccessToken()
        }else{
            getUserData()
        }

    },[])

    useEffect(()=>{
        setTotalData(0)
        setPage(1)
    },[searchAll])

    useEffect(()=>{
        if(page===1){
            searchData()
        }
    },[page])

    useEffect(()=>{
        const getAllRepos = async()=>{
            try{
                await axios.get(`https://api.github.com/search/repositories?q=user:${userName.login}`, {
                    headers:{
                        "Authorization": 'Bearer ' + localStorage.getItem("access_token")
                    }
                 })
                .then(data =>{
                    setAllRepo(data.data.items)
                })
            }catch(err){
                console.log(err)
            }
        }
        getAllRepos()
        searchData()
    },[userName])

    
 
    useEffect(()=>{
        const getSingleRepoIssues = async()=>{
            setCarfLoading(true)
                await axios.get(`https://api.github.com/search/issues?q=repo:${userName.login}/${repo}+is:open+sort:created`, {
                    headers:{
                        "Authorization": 'Bearer ' + localStorage.getItem("access_token")
                    }
                 })
                .then(data =>{
                    setAllIssue(data.data.items)
                    setTotalData(data.data.items.length)
                    setHasMore(data.data.items.length === 10);
    
                }).then(()=>setCarfLoading(false))
                .catch(err=> console.log(err))
            }
        if(repo){
            getSingleRepoIssues()
        }    
    },[repo])    

async function getUserData(req, res) {
    await axios.get('https://api.github.com/user', {
        headers:{
            "Authorization": 'Bearer ' + localStorage.getItem("access_token")
        }
     })
     .then((data) => {
        setUserName(data.data)
        console.log(data)
        localStorage.setItem("user_name",data.data.name);
        localStorage.setItem("avatar_url",data.data.avatar_url);
        localStorage.setItem("html_url",data.data.html_url);
      }).catch(err =>console.log(err))
 }

async function Detail(e, content) {
    e.preventDefault();
    setIssueData(content);
    setDetailShow(true)
    setClickedLinks([...clickedLinks, content.id])
}

async function searchData(req, res) {
    setCarfLoading(true)
    console.log(userName)
    // 所有資料
    try{
        await axios.get(`https://api.github.com/search/issues?q=user:${userName.login}+is:open+sort:created&per_page=10&page=${page}`,{
            headers:{
                "Authorization": 'token ' +localStorage.getItem("access_token")
                }
        }).then(data =>{
            console.log(data.data)
            const temp = data.data.items
            setAllIssue(preIssues => [...preIssues, ...temp]);
            setPage(page + 1);
            setTotalData(totalData + temp.length)
            setHasMore(temp.length === 10);
        }).then(()=> setCarfLoading(false))
    }catch(err){
        console.log(err)
    }
}

const Bg = (color) =>{
    if(color === '198754'){
        return 'success'
    }else if(color === 'ededed'){
        return 'secondary'
    }else{
        return 'danger'
    }
}

const TimeDiff = (timestamp) =>{
    const secondsAgo = Math.floor((new Date() - new Date(timestamp)) / 1000);
    let temp ='';
    if (secondsAgo < 60) {
        temp = "created now";
    } else if (secondsAgo < 3600) {
        temp = `created ${Math.floor(secondsAgo / 60)} minutes ago`
    } else if (secondsAgo < 86400){
        temp = `created ${Math.floor(secondsAgo / 3600)} hours ago`
    }else{
        const options = { month: "short", day: "numeric" };
        temp =`created ${new Date(timestamp).toLocaleDateString("en-US", options)}`
    }
    return temp
}

useEffect(() => {
  function handleScroll() {
    setTop(document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

const scrollablePageHeight = document.documentElement.scrollHeight -  window.innerHeight;

useEffect(() => {
  if (top >= scrollablePageHeight-30) {
    console.log('iii')
    if( (localStorage.getItem("access_token") !== null && hasMore)){
        searchData()
    }
  }
}, [top]);

const isClicked = (issue) => clickedLinks.includes(issue.id)

  return (
    <div className='row'  style={{ paddingTop: '70px' }}>
         <div className='col-2'>
            <Siders />
        </div>
       <div className='col-9'>
      {loginLoading &&
         <div className='d-flex justify-content-center'>
            <Spinner animation="border" />
         </div>
        }

        {localStorage.getItem("access_token") ?
        <div style={{ paddingLeft: '100px' }}>
            <div>
                <SearchBar />

        <div className="py-3 d-flex justify-content-between">
            <div>
                共有{totalData}筆資料
            </div>
            <div>
                <AddTask />
            </div>
        </div>
        
              <Row md={1} lg={2} className="g-4">
              {cardLoading ? (
                  <div className='d-flex justify-content-center'>
                     <Spinner animation="border" />
                  </div>
                ) : (
                    <>
              {allIssue.length !== 0 && allIssue.map((each, index) => {
                const a = TimeDiff(each.created_at)

                return(
                    <a href='#' className='text-decoration-none' onClick={e=>Detail(e, each)} key={index}  style={{ color: isClicked(each) ? 'gray' : 'black' }}>
                        <Col>
                        <Card>
                            <Card.Body>
                            <Card.Subtitle className="mb-2 text-muted">
                                <Badge pill bg={Bg(each.labels[0].color)}>{each.labels[0].name}</Badge>
                                {"  "}{a}
                            </Card.Subtitle>
                            <Card.Title>{each.title}</Card.Title>
                            <Card.Text>
                            {each.body.slice(0,20)}...more
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        </Col>
                    </a>
              )})}
                
                </>
                )}
              </Row>
              {!hasMore && (
                <div className="p-3 d-flex justify-content-center">
                    <p className='text-secondary'>已經是最後了</p>
                </div>
                
                )}
           
        </div> 
        </div>
        :
        <></>
        // <h1>尚未登入請登入</h1>
    }

</div>
<DetailTask />
    </div>
  )
}

export default ListTask