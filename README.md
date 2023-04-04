# Dcard-Intern-Frontend

## 啟動專案

### 取得權限
1. 登入github -> settings -> developer settings -> OAuth apps 新增auth
2. 自訂名稱，並在Homepage URL和Authorization callback URL輸入http://localhost:3000
3. 新增後即可獲得Client ID
4. 登入github -> settings -> developer settings -> Personal access token -> tokens 新增classic
5. 自訂名稱並將repo和user打勾
6. 新增即可Client Secret

### 設定專案
1. git clone https://github.com/eating31/Intern-Frontend
2. 進入資料夾 cd Intern-Frontend 
3. 建立.env的檔案並輸入 CLIENT_ID = "xxxxxxx", CLIENT_SECRET = "xxxxxxx"
4. 將前階段獲得的 client_id和 secret 填入.env的檔案中
5. 再進入前端資料夾 cd client 
6. 再次建立.env的檔案並輸入 REACT_APP_CLIENT_ID = "xxxxxxx"

### 執行專案
1. 開啟兩個cmd
2. cd Intern-Frontend 執行 node server.js (確定port是4000)
3. cd Intern-Frontend/client 執行 npm start (確定port是3000)


## 設計架構
