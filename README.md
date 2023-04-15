# react-github-oauth2-issue


## 啟動專案

### 取得權限
1. 登入github -> settings -> developer settings -> OAuth apps 新增auth
2. 自訂名稱，並在Homepage URL輸入http://localhost:3002/login 和Authorization callback URL輸入http://localhost:3002
3. 新增後即可獲得Client ID
4. 登入github -> settings -> developer settings -> Personal access token -> tokens 新增classic
5. 自訂名稱並將repo和user打勾
6. 新增即可Client Secret

### 設定專案
1. git clone https://github.com/eating31/Intern-Frontend
2. 進入後端資料夾 cd Intern-Frontend/backend
3. 建立.env的檔案並輸入 CLIENT_ID = "xxxxxxx", CLIENT_SECRET = "xxxxxxx"
4. npm install
5. 將前階段獲得的 client_id和 secret 填入.env的檔案中
6. 再進入前端資料夾 cd ../frontend 
7. 再次建立.env的檔案並輸入 REACT_APP_CLIENT_ID = "xxxxxxx"
8. npm install

### 執行專案
1. 開啟兩個cmd，分別近入前後端資料夾
2. cd backend 執行 node server.js (確定port是4000)
3. cd frontend 執行 npm start (確定port是3002)
