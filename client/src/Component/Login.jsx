import React, {useEffect, useState} from 'react'

function Login() {
    const [token, setToken] = useState(null);
    const [selectedScopes, setSelectedScopes] = useState([]);

    useEffect(()=>{
        console.log(selectedScopes)
    },[selectedScopes])
    const CLIENT_ID = "7e2ec405ab8a9a9c9528";


    // 使用GitHub OAuth2 API授权用户并请求访问令牌
    const handleLogin = async () => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=${selectedScopes.join(" ")}`;
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

  return (
    <div>
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
    {/* <a href='/login'> Login</a> */}</div>
  )
}

export default Login