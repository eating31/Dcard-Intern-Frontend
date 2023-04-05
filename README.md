# Dcard-Intern-Frontend

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


## 設計架構

### Backend
github 在取得access token時會有cors的問題，在前端嘗試許久最後決定寫個後端，並使用require(cors())的方式解決

### Frontend
使用react.js搭配react-bootstrap排版，並利用axios的方式取得github api資料
有try...catch的錯誤處理機制
因為功能不多，故將所有需求寫在同一個頁面

### Login
可以選擇登入權限，自行決定只授權public repository或是授權 public 和 private repository

### Navbar
可以在Navbar上選擇登出和查看個人檔案，也可以直接新增issue

### SideBar
列出所有的repo同時可以搜尋單一repo的所有issue

### SearhBar
可以根據state也可以以關鍵字搜尋issue的body和title

### Detail
點擊後即可看到issue的內容，包括創造、更新時間和對應的repository，也可在上面編輯、刪除相關內容及改變狀態

### AddIssue
有title和body防呆機制，repository的選單也可以直接輸入文字搜尋相關repository

