import React, { useState } from 'react'
import {Form, Button} from 'react-bootstrap'

function Login() {
    const [scope, setscope] = useState('user+repo')

    const handleLogin = async () => {
      const url = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=${scope}&redirect_uri=http://localhost:3002`;
      window.location.assign(url);
    };


  return (
    <div className='container' style={{ paddingTop: '70px' }}>
    <h2 className='pt-4'>請選擇登入權限</h2>
    <Form className='p-3'>
        <div className="mb-3">
          <Form.Check 
            type='radio'
            label='private and public repository'
            value='user+repo'
            checked={scope === 'user+repo'}
            onChange={e=>setscope(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check 
            type='radio'
            label='public repository'
            value='user'
            checked={scope === 'user'}
            onChange={e=>setscope(e.target.value)}
          />
        </div>
    </Form>
     
      <Button onClick={handleLogin}>登入</Button>
    </div>
  )
}

export default Login