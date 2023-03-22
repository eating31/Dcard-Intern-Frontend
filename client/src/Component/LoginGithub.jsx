import React from 'react'

function LoginGithub() {

    const CLIENT_ID = '7e2ec405ab8a9a9c9528';

    function UserLogin() {
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
    }
  return (
    <div>LoginGithub
         <button onClick={UserLogin}>
                Login
            </button>
    </div>
  )
}

export default LoginGithub