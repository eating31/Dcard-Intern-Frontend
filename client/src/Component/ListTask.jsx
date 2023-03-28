import React,{useEffect, useState, useContext} from 'react'
import { Context } from "../Context/Context";
import axios from 'axios';
import AddTask from './AddTask';
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';

import Card from 'react-bootstrap/Card';
import moment from 'moment';

function ListTask() {
   // const [rerender, setRerender] = useState(false)
    const [userData, setUserData] = useState({})
    const [userIssues, setUserIssues] = useState([])
    const {issueData, setIssueData} = useContext(Context)
    const {userName, setUserName} = useContext(Context)
    const history = useNavigate()
    // const [repo, setRepo] = useState()

    const [isLoading, setIsLoading] = useState(false);


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
                setIsLoading(true);
                await axios.get("http://localhost:4000/getAccessToken?code="+ codeParams)
                .then(data =>{
                    if(data.data.access_token) {
                        localStorage.setItem("access_token",data.data.access_token);
                        // setRerender(!rerender)
                    }
                })
                .then(()=> getUserData())
                .catch(err => console.log(err))
                .finally(()=>  setIsLoading(false))
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

// async function getPrivateIssues(req, res) {
//     const query = `{ 
//         user(login:"eating31") { 
//             repositories(first: 100) {
//                 nodes {
//                   name
//                   id
//                   issues(first: 100, states: [OPEN, CLOSED]) {
//                     nodes {
//                       id
//                       title
//                       body
//                       labels(first:1) {
//                         edges {
//                           node {
//                             name
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//         }
//       }`
//       const a = await axios.post("https://api.github.com/graphql", {query},{
//         headers:{
//             "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
//         }
//       }).then(data =>{console.log(data.data.data.user.repositories.nodes)
//         //setUserIssues(data.data.data.user.issues.nodes)
//     }).catch(err => console.log(err))
//       console.log(a)
// }

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
    
    // 所有資料
    const a = await axios.get("https://api.github.com/search/issues?q=user:eating31+sort:created&per_page=10&page=1",{
        headers:{
            "Authorization": 'token ' +localStorage.getItem("access_token")
            }
    }).then(data =>{console.log(data.data)
        console.log(data.data)
    setUserIssues(data.data.items)
    })
    .catch(err => console.log(err))
    console.log(a)
}


// function logout() {
//     localStorage.removeItem("access_token");
//     history(0)
// }

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
  return (
    <div className="container">
        <div>
      {isLoading ? (
        <div>Loading...</div>
        ) : (
            <div>
            ok
            </div>
        )}
        </div>

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
              {userIssues.length !== 0 && userIssues.map(each => {
                const now = moment()
                const create = moment(each.created_at.slice(0,10))
                const day = now.diff(create, 'day')
                console.log(day)
                return(
            <a href='/' className="text-decoration-none text-dark" onClick={e=>Detail(e, each)}>
                    <Col>
                      <Card key={each.id}>
                        <Card.Body>
                          <Card.Subtitle className="mb-2 text-muted">
                            <Badge pill bg={Bg(each.labels[0].color)}>{each.labels[0].name}</Badge>
                            {"  "}{day}{" days ago"}
                          </Card.Subtitle>
                          <Card.Title>{each.title}</Card.Title>
                          <Card.Text>
                          {each.body.slice(0,50)}...
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                </a>
              )})}
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