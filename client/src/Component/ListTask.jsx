import React,{useEffect, useState, useContext, useRef} from 'react'
import { Context } from "../Context/Context";
import axios from 'axios';
import AddTask from './AddTask';

import DetailTask from './DetailTask';
import Login from './Login';
import Siders from './Siders'
import { Form, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';

function ListTask() {
    const [labels, setLabels] = useState([ 
            { name: "open", isChecked: false },
            { name: "In progress", isChecked: false },
            { name: "Done", isChecked: false }
    ])
    const [keyword, setKeyword] = useState('')
    const [userData, setUserData] = useState({})
    const [userIssues, setUserIssues] = useState([])
    const {issueData, setIssueData} = useContext(Context)
    const {userName, setUserName} = useContext(Context)
    const {detailShow, setDetailShow} = useContext(Context)

    const [loginLoading, setLoginLoading] = useState(false);
    const [cardLoading, setCarfLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalData, setTotalData] = useState(0)
    const [hasMore, setHasMore] = useState(true);
    const [top, setTop] = useState(0);
    
    const { repo, setRepo} = useContext(Context)
    const { allRepo, setAllRepo} = useContext(Context)
    const {searchAll, setSearchAll} =useContext(Context)


    const getSingleRepoIssues = async()=>{
        setCarfLoading(true)
            await axios.get(`https://api.github.com/search/issues?q=repo:${userName.login}/${repo}+is:open+sort:created`, {
                headers:{
                    "Authorization": 'Bearer ' + localStorage.getItem("access_token")
                }
             })
            .then(data =>{
                setUserIssues(data.data.items)
                setTotalData(data.data.items.length)
                setHasMore(data.data.items.length === 10);

            }).then(()=>setCarfLoading(false))
            .catch(err=> console.log(err))
        }
    useEffect(()=>{
    if(userName){
        getSingleRepoIssues()
    }
    },[repo])
   

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
        getAllRepos()
        searchData()
    },[userName])

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
 
async function getUserData(req, res) {
    await axios.get('https://api.github.com/user', {
        headers:{
            "Authorization": 'Bearer ' + localStorage.getItem("access_token")
        }
     })
     .then((data) => {
        setUserName(data.data)
        setUserData(data.data)
      }).catch(err =>console.log(err))
 }

 async function Detail(e, content) {
    e.preventDefault();
    console.log(content)
    setIssueData(content);
    setDetailShow(true)

}

async function searchData(req, res) {
    setCarfLoading(true)
    // 所有資料
    try{
    await axios.get(`https://api.github.com/search/issues?q=user:${userName.login}+is:open+sort:created&per_page=10&page=${page}`,{
        headers:{
            "Authorization": 'token ' +localStorage.getItem("access_token")
            }
    }).then(data =>{
        console.log(data.data)
        const temp = data.data.items
        setUserIssues(preIssues => [...preIssues, ...temp]);
        setPage(page + 1);
        setTotalData(totalData + temp.length)
        setHasMore(temp.length === 10);

    }).then(()=> setCarfLoading(false))
    }catch(err){
        console.log(err)
    }
}

async function handelSubmit(){
    setCarfLoading(true)
    const selectLabel = labels.filter(e =>e.isChecked===true)
    const query = selectLabel.map((label) => `"${label.name}"`).join(',');
    let queryLabel=''
    if(query !==0){
        queryLabel='label:'+ query
    }

    console.log(queryLabel)
    // await axios.get(`https://api.github.com/search/issues?q=user:eating31+label:${query}`,{
    await axios.get(`https://api.github.com/search/issues?q=user:${userName.login}+${queryLabel}+${keyword}`,{
        headers:{
            "Authorization": 'Bearer ' +localStorage.getItem("access_token")
            }
    }).then(data =>{
        console.log(data.data)
        //const temp = data.data.items
        setTotalData(data.data.items.length)
        setUserIssues(data.data.items)
    }).then(()=>setCarfLoading(false))
    .catch(err => console.log(err))
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

function handleChange(e) {
  
    const { name, checked } = e.target;
    console.log(name)
    if (name === "allSelect") {
      let tempUser = labels.map((label) => {
        return { ...label, isChecked: checked };
      });
      setLabels(tempUser);
    } else {
      let tempUser = labels.map((label) =>
      label.name === name ? { ...label, isChecked: checked } : label
      );
      setLabels(tempUser);
    }
  };

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
            
        <div className='bg-info p-2 px-5 mt-4 rounded-pill'>
        <Form>
      <Row className="my-1">
        <Col className="col-12 col-lg-6 pt-2 d-flex justify-content-end">
            <Form.Group as={Col}>
            <Form.Label className="form-label pe-2">State:</Form.Label>
                <Form.Check inline label="全選" name="allSelect" type="checkbox" checked={!labels.some((label) => label.isChecked !== true)} onChange={handleChange} />
                {labels.map((label, index) => (
                     <Form.Check key={label.id} inline name={label.name} label={label.name} type="checkbox" checked={label.isChecked || false} onChange={handleChange} />
                ))}
            </Form.Group>
        </Col>

        <Col className="col-auto col-lg-1 pt-2 d-flex justify-content-start">
          <Form.Label className="form-label align-self-center">search:</Form.Label>
        </Col>
        <Col className="col-auto col-lg-3">
          <Form.Control type="text" placeholder="issue content..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        </Col>

        <Col className="col-12 col-lg-2 d-flex justify-content-end">
          <Button type="button" className="btn btn-dark rounded-pill" onClick={handelSubmit}>Search</Button>
        </Col>

      </Row>
    </Form>
        </div>
        <div className="py-3 d-flex justify-content-between">
            <div>
                共有{totalData}筆資料
            </div>
            <div>
            <AddTask />
            </div>
        </div>

            {Object.keys(userData).length !== 0 ?
            <>

              <Row md={1} lg={2} className="g-4">
                {/* 不確定等待圈圈是不是要放這 */}
              {cardLoading ? (
                  <div className='d-flex justify-content-center'>
                     <Spinner animation="border" />
                  </div>
                ) : (
                    <>
              {userIssues.length !== 0 && userIssues.map(each => {
                const a = TimeDiff(each.created_at)

                return(
                    <a href='#' className="text-decoration-none text-dark" onClick={e=>Detail(e, each)}>
                        <Col>
                        <Card key={each.id}>
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

               

            </>
            :
            <></>    
            }
        </div> 
        </div>
        :
        <Login />
    }

</div>
<DetailTask />
    </div>
  )
}

export default ListTask