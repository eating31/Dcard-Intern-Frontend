import React,{useEffect, useState, useContext, useRef} from 'react'
import { Context } from "../Context/Context";
import axios from 'axios';
import AddTask from './AddTask';
// import { useNavigate } from 'react-router-dom';

import DetailTask from './DetailTask';
import Login from './Login';
import Siders from './Siders'
import { Form, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';

function ListTask() {
    const [userData, setUserData] = useState({})
    const [userIssues, setUserIssues] = useState([])
    const {issueData, setIssueData} = useContext(Context)
    const {userName, setUserName} = useContext(Context)
    // const history = useNavigate()
    
    const {detailShow, setDetailShow} = useContext(Context)

    const [loginLoading, setLoginLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [top, setTop] = useState(0);


    const [test, setTest] = useState(false)

    const [cardLoading, setCarfLoading] = useState(false);
    // const getSingleRepoIssues = async()=>{
    //     await axios.get("https://api.github.com/repos/eating31/"+repo+"/issues")
    //     .then(data =>{
    //         console.log(data.data)
    //         setUserIssues(data.data)


    //     })
    // }

    useEffect(()=>{
        console.log(issueData)
    },[issueData])

    useEffect(() => {
        const querytring = window.location.search;
        const urlParams = new URLSearchParams(querytring);
        console.log(urlParams)
        const codeParams = urlParams.get("code")

        console.log(codeParams)

        if(codeParams &&(localStorage.getItem("access_token")===null)){
            async function getAccessToken() {
                setLoginLoading(true);
                await axios.get("http://localhost:4000/getAccessToken?code="+ codeParams)
                .then(data =>{
                    if(data.data.access_token) {
                        localStorage.setItem("access_token",data.data.access_token);
                        // setRerender(!rerender)
                    }
                })
                .then(()=> getUserData())
                .catch(err => console.log(err))
                .finally(()=>  setLoginLoading(false))
            }
            getAccessToken()
         // 底下位置要動 不然他已經做好了但還沒顯示
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
    await axios.get(`https://api.github.com/search/issues?q=user:eating31+sort:created&per_page=12&page=${page}`,{
        headers:{
            "Authorization": 'token ' +localStorage.getItem("access_token")
            }
    }).then(data =>{
        console.log(data.data)
        const temp = data.data.items
        // setUserIssues(data.data.items)

        setUserIssues(preIssues => [...preIssues, ...temp]);
        setPage(page + 1);
        setHasMore(temp.length === 12);


    }).then(()=> setCarfLoading(false))
    .catch(err => console.log(err))
    
}

function handelSubmit(){
console.log('submit')
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

useEffect(()=>{
console.log(hasMore)
},[hasMore])

useEffect(() => {
  if (top >= scrollablePageHeight-30) {
    console.log('iii')
    if( (localStorage.getItem("access_token") !== null && hasMore)){
        searchData()
    }
  }
}, [top]);

const handleClose = () => {
  setTest(false)
};

  return (
    <div className="row">
        <div className='col-3'>
            <Siders />
        </div>
        <div className='col-9 pe-5'>
      {loginLoading &&
         <div className='d-flex justify-content-center'>
            <Spinner animation="border" />
         </div>
        }

        {localStorage.getItem("access_token") ?
        <div>
{/* test div */}
            <div>

        <div className='bg-info rounded-pill'>
        <Form className='px-5 py-2'>
      <Row className="mb-3">
        <Form.Group as={Col} className="mb-3" id="formGridCheckbox">
            <Form.Check inline label="全選" type="checkbox" />
            <Form.Check inline label="Open" type="checkbox" />
            <Form.Check inline label="In progress" type="checkbox" />
            <Form.Check inline label="Done" type="checkbox" />
        </Form.Group>

        <Form.Group as={Col}  className="mb-3" controlId="formHorizontalEmail">
        <Form.Label column sm={2}>
          search
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="email" placeholder="issue name..." />
        </Col>
      </Form.Group>

      <Form.Group as={Col} className="d-flex justify-content-end">
        <Button className="btn" variant="primary" onClick={handelSubmit}>
        Submit
      </Button>
      </Form.Group>

      </Row>
    </Form>
        </div>
        <div className="p-4 d-flex justify-content-end">
        <AddTask />
        </div>

            {Object.keys(userData).length !== 0 ?
            <>

              <Row xs={1} md={2} className="g-4">
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