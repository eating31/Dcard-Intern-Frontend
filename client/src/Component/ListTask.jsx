import React,{useEffect, useState, useContext, useRef} from 'react'
import { Context } from "../Context/Context";
import axios from 'axios';
import AddTask from './AddTask';
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';

import Card from 'react-bootstrap/Card';

function ListTask() {
    const [userData, setUserData] = useState({})
    const [userIssues, setUserIssues] = useState([])
    const {issueData, setIssueData} = useContext(Context)
    const {userName, setUserName} = useContext(Context)
    const history = useNavigate()
    
    const [loginLoading, setLoginLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

  
    const [cardLoading, setCarfLoading] = useState(false);
    // const getSingleRepoIssues = async()=>{
    //     await axios.get("https://api.github.com/repos/eating31/"+repo+"/issues")
    //     .then(data =>{
    //         console.log(data.data)
    //         setUserIssues(data.data)


    //     })
    // }

    useEffect(()=>{
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
          // getUserData()
         // 底下位置要動 不然他已經做好了但還沒顯示
        }

    },[])
 
async function getUserData(req, res) {
    await axios.get('https://api.github.com/user', {
        headers:{
            "Authorization": 'Bearer ' + localStorage.getItem("access_token")
        }
     })
     .then((data) => {
        console.log(data)
        setUserName(data.data.name)
        setUserData(data.data)
      }).catch(err =>console.log(err))
 }

// async function updateData(req, res) {
//     const data = {
//         "title":title,
//         "body":content 
//     }
//     console.log(data)
//     const a = await axios.patch("https://api.github.com/repos/eating31/"+repo+"/issues/2", data, {
//         headers:{
//             "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
//             }
//     }).then(data =>console.log(data))
//     .catch(err => console.log(err))
//     console.log(a)
// }

function Detail(e, content) {
    e.preventDefault();
    console.log(content.labels[0].url)
    setIssueData(content);
    history('/detail')

}

async function searchData(req, res) {
    setCarfLoading(true)
    // 所有資料
    const a = await axios.get(`https://api.github.com/search/issues?q=user:eating31+sort:created&per_page=6&page=${page}`,{
        headers:{
            "Authorization": 'token ' +localStorage.getItem("access_token")
            }
    }).then(data =>{
        console.log(data.data)
        const temp = data.data.items
        // setUserIssues(data.data.items)

        setUserIssues([...userIssues, ...temp]);
        setPage(page + 1);
        setHasMore(temp.length === 10);


    }).then(()=> setCarfLoading(false))
    .catch(err => console.log(err))
    console.log(a)
}


const [token, setToken] = useState(null);
const [selectedScopes, setSelectedScopes] = useState([]);

useEffect(()=>{
    console.log(selectedScopes)
},[selectedScopes])
const CLIENT_ID = "7e2ec405ab8a9a9c9528";


// 使用GitHub OAuth2 API授权用户并请求访问令牌
const handleLogin = async () => {
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${selectedScopes.join(" ")}`;
  console.log(url)
  window.location.assign(url);
};

// 在用户选择的范围中切换
const toggleScope = (scope) => {
  if (selectedScopes.includes(scope)) {
    setSelectedScopes(selectedScopes.filter((s) => s !== scope));
  } else {
    setSelectedScopes([...selectedScopes, scope]);
  }
};

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
        temp = "updated now";
    } else if (secondsAgo < 3600) {
        temp = `updated ${Math.floor(secondsAgo / 60)} minutes ago`
    } else if (secondsAgo < 86400){
        temp = `updated ${Math.floor(secondsAgo / 3600)} hours ago`
    }else{
        const options = { month: "short", day: "numeric" };
        temp =`updated ${new Date(timestamp).toLocaleDateString("en-US", options)}`
    }
    return temp
}



  return (
    <div className="container">
      {loginLoading ? (
         <div className='d-flex justify-content-center'>
            <Spinner animation="border" />
         </div>
        ) : (
            <div>
            ok
            </div>
        )}

        {localStorage.getItem("access_token") ?
        <div>
        <h1>Success!</h1>
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
        <Button className="btn" variant="primary" type="submit">
        Submit
      </Button>
      </Form.Group>

      </Row>
    </Form>
        </div>
        <div className="p-4 d-flex justify-content-end">
        <AddTask />
        </div>
        <h3>Get User Data</h3>
        {/* <button onClick={getPrivateIssues}>Get private issue</button> */}
        <button onClick={searchData}>Get Data</button>
        <button onClick={getUserData}>Get User</button>
            {Object.keys(userData).length !== 0 ?
            <>
              <h4>Hi there {userData.login}</h4>

              <a href={userData.html_url}>
                <img width="100px" height="100px" src={userData.avatar_url} />
              </a>
              <Row xs={1} md={2} className="g-4">
                {/* 不確定等待圈圈是不是要放這 */}
              {cardLoading ? (
                <div className='d-flex justify-content-end'>
                   <Spinner animation="border" />
                   </div>
                ) : (
                    <>
              {userIssues.length !== 0 && userIssues.map(each => {
                const a = TimeDiff(each.created_at)

                return(
            <a href='/' className="text-decoration-none text-dark" onClick={e=>Detail(e, each)}>
                    <Col>
                      <Card key={each.id}>
                        <Card.Body>
                          <Card.Subtitle className="mb-2 text-muted">
                            <Badge pill bg={Bg(each.labels[0].color)}>{each.labels[0].name}</Badge>
                            {"  "}{a}
                          </Card.Subtitle>
                          <Card.Title>{each.title}</Card.Title>
                          <Card.Text>
                          {each.body.slice(0,50)}...more
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                </a>
              )})}
                
                </>
                )}
              </Row>
            </>
            :
            <></>    
            }
        </div>
        :
        <>
        <h1>You haven't login</h1>
        <p>请登录以授权此应用程序访问您的GitHub数据。</p>
          <ul>
            <li>
              <label>
                <input type="checkbox" onChange={() => toggleScope("user")} checked={selectedScopes.includes("user")} />
                访问用户资料
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" onChange={() => toggleScope("repo")} checked={selectedScopes.includes("repo")} />
                访问用户存储库
              </label>
            </li>
          </ul>
          <button onClick={handleLogin}>登录</button>
        {/* <a href='/login'> Login</a> */}
        </>
    }

    </div>
  )
}

export default ListTask