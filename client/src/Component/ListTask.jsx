import React,{useEffect, useState} from 'react'
import axios from 'axios';
import AddTask from './AddTask';

function ListTask() {
    const [rerender, setRerender] = useState(false)
    const [userData, setUserData] = useState({})
    const [userIssues, setUserIssues] = useState([])
    const [userRepo, setUserRepo] = useState([])
    const [repo, setRepo] = useState()
    
    const [title, setTitle] = useState()
    const [modalShow, setModalShow] = useState(false)
    const [content, setContent] = useState()

    useEffect(()=>{
        // const getList = async()=>{
        //     await axios.get("https://api.github.com/repos/eating31/"+repo+"/issues")
        //     .then(data =>{
        //         console.log(data.data)
        //         setUserIssues(data.data)
        //     })
        // }
        if(repo){   
           //  getList()
            
        }
    },[repo])

    const getSingleRepoIssues = async()=>{
        await axios.get("https://api.github.com/repos/eating31/"+repo+"/issues")
        .then(data =>{
            console.log(data.data)
            setUserIssues(data.data)
        })
    }

    useEffect(()=>{
        const querytring = window.location.search;
        const urlParams = new URLSearchParams(querytring);
        console.log(urlParams)
        const codeParams = urlParams.get("code")
        console.log(codeParams)

        if(codeParams &&(localStorage.getItem("access_token")===null)){
            async function getAccessToken() {
                await axios.get("http://localhost:4000/getAccessToken?code="+ codeParams)
                .then(data =>{
                    if(data.data.access_token) {
                        localStorage.setItem("access_token",data.data.access_token);
                        setRerender(!rerender)
                    }
                }).catch(err => console.log(err))
            }
          getAccessToken()
         // 底下位置要動 不然他已經做好了但還沒顯示
          searchData()
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
        setUserData(data.data)
      }).catch(err =>console.log(err))
 }

async function postData(req, res) {
    const data = {
        "title":title,
        "body":content 
    }
    if(title){   
        const a = await axios.post("https://api.github.com/repos/eating31/"+repo+"/issues", data,{
            headers:{
                "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
                }
        }).then(data =>console.log(data))
        .catch(err => console.log(err))
        console.log(a)
    }
}

// async function getIssues(req, res) {
//     const query = `{ 
//         user(login:"eating31") { 
//           issues(last:10) {
//             nodes{
//               title,
//               body,
//               closedAt
//               }
//             }
//         }
//       }`
//       const a = await axios.post("https://api.github.com/graphql", {query},{
//         headers:{
//             "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
//         }
//       }).then(data =>{console.log(data.data.data)
//         setUserIssues(data.data.data.user.issues.nodes)
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

// async function deleteData(req, res) {
//     const data = {
//         "state":"closed",
//     }
//     console.log(data)
//     const a = await axios.patch("https://api.github.com/repos/eating31/"+repo+"/issues/1", data, {
//         headers:{
//             "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
//             }
//     }).then(data =>console.log(data))
//     .catch(err => console.log(err))
//     console.log(a)
// }


async function searchData(req, res) {
    // 所有資料
    const a = await axios.get("https://api.github.com/search/issues?q=user:eating31",{
        headers:{
            "Authorization": process.env.REACT_APP_GITHUB_TOKEN
            }
    }).then(data =>{console.log(data.data.items)
    setUserIssues(data.data.items)
    })
    .catch(err => console.log(err))
    console.log(a)
}

  return (
    <div>
        {localStorage.getItem("access_token") ?
        <>
        <h1>Success!</h1>
        <button onClick={()=>{ localStorage.removeItem("access_token"); setRerender(!rerender) }}> Log out</button>
        <h3>Get User Data</h3>
        <button onClick={getUserData}>Get Data</button>
            {Object.keys(userData).length !== 0 ?
            <>
              <h4>Hi there {userData.login}</h4>

              <a href={userData.html_url}>
                <img width="100px" height="100px" src={userData.avatar_url} />
              </a>

              {userIssues.length !== 0 && userIssues.map(a => {return(
                <>
                    <h4>{a.title}</h4>
                    <p>{a.body}</p>
                </>
              )})}
              <AddTask />
            </>
            :
            <></>    
            }
        </>
        :
        <>
        <h1>You haven't login</h1>
        <a href='/login'> Login</a>
        </>
    }

    </div>
  )
}

export default ListTask