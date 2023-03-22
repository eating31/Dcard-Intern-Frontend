import React,{useEffect, useState} from 'react'
import axios from 'axios';

function ListTask() {
    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({})

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
    // console.log(localStorage.getItem("access_token"))
    await axios.get("http://localhost:4000/getUserData", {
        headers:{
            "Authorization": "Bearer"+ localStorage.getItem("access_token")
            }
        }).then(data =>
            setUserData(data.data.UserData)
        ).catch(err => console.log(err))
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