import React, { useState } from "react";
import axios from "axios";


function Test() {
  const [token, setToken] = useState(null);
  const [selectedScopes, setSelectedScopes] = useState([]);


  const CLIENT_ID = "7e2ec405ab8a9a9c9528";
  const REDIRECT_URI = "http://localhost:3000/login";


  // 使用GitHub OAuth2 API授权用户并请求访问令牌
  const handleLogin = async () => {
    const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${selectedScopes.join(" ")}`;
    console.log(url)
    window.location.assign(url);
  };

  // 通过GitHub API获取当前用户的资料
  const fetchUserData = async () => {
    const response = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
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
      {token ? (
        <>
          <p>您已通过GitHub身份验证。</p>
          <button onClick={fetchUserData}>获取用户数据</button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default Test;
