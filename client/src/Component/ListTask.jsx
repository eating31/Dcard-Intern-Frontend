import React,{useEffect, useState} from 'react'
import axios from 'axios';

function ListTask() {
    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({})
    const [userIssues, setUserIssues] = useState([])
    const [userRepo, setUserRepo] = useState([])
    const [repo, setRepo] = useState()
    const [title, setTitle] = useState()
    const [content, setContent] = useState()

    useEffect(()=>{
        const getList = async()=>{
            await axios.get("https://api.github.com/repos/eating31/"+repo+"/issues")
            .then(data =>{
                console.log(data.data)
                setUserIssues(data.data)
            })
        }
        if(repo){   
            getList()
        }
    },[repo])

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
        }

    },[])

async function getUserData() {
    await axios.get("http://localhost:4000/getUserData", {
        headers:{
            "Authorization": "Bearer"+ localStorage.getItem("access_token")
            }
        })
        .then(data =>{
            console.log(data.data);
            setUserData(data.data.UserData)
        }
        ).catch(err => console.log(err))
}

async function getUserRepo() {
    await axios.get("http://localhost:4000/getUserRepo", {
        headers:{
            "Authorization": "Bearer"+ localStorage.getItem("access_token")
            }
        })
        .then(data =>{
            console.log(data.data.RepoData);
            setUserRepo(data.data.RepoData)
        }
        ).catch(err => console.log(err))
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
console.log(title);
console.log(content);
}

async function getIssues(req, res) {
    const query = `{ 
        user(login:"eating31") { 
          issues(last:10) {
            nodes{
              title,
              body,
              closedAt
              }
            }
        }
      }`
      const a = await axios.post("https://api.github.com/graphql", {query},{
        headers:{
            "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
        }
      }).then(data =>{console.log(data.data.data)
        setUserIssues(data.data.data.user.issues.nodes)
    }).catch(err => console.log(err))
      console.log(a)
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
    const a = await axios.get("https://api.github.com/search/issues?q=user:eating31 per_page=10",{
        headers:{
            "Authorization": process.env.REACT_APP_GITHUB_TOKEN
            }
    }).then(data =>console.log(data))
    .catch(err => console.log(err))
    console.log(a)
}

  return (
    <div>ListTask
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

              <button onClick={getUserRepo}>Get Repo</button>
              {userRepo.length !== 0 && userRepo.map(each=>{ return(
                <>
                <button className='btn' onClick={e => setRepo(each.name)}>{each.name} </button>
                </>
              )})}
              <button onClick={getIssues}>Get Issue</button>
              {userIssues.length !== 0 && userIssues.map(a => {return(
                <>
                    <p>{a.title}</p>
                </>
              )})}
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
    <br />
    <label>Title</label>
    <input type="text" value={title} onChange={e => setTitle(e.target.value)}></input>
    <br />
    <label>body</label>
    <input type="textarea" value={content} onChange={e => setContent(e.target.value)}></input>
    <button onClick={postData}>新增</button>
    <br />
    <button onClick={searchData}>search</button>
    </div>
  )
}

export default ListTask