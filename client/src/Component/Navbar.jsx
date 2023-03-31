import React, { useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavbarReact from 'react-bootstrap/Navbar';
import { Context } from "../Context/Context";

function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState();
  const {userName, setUserName} = useContext(Context)

  const url = 'https://github.com/login/oauth/authorize?client_id=7e2ec405ab8a9a9c9528'
console.log(process.env.REACT_APP_CLIENT_ID)

useEffect(()=>{

  setTimeout(()=>{
    if(localStorage.getItem("access_token") === null){
      setIsLoggedIn(false)
      console.log('logout')
     }else{
      console.log('login')
      setIsLoggedIn(true)
     }
  },1000)

},[])

  function handleSelect(eventKey){
    if(eventKey === '3'){
      setIsLoggedIn(true)
      // window.location.assign('https://github.com/login/oauth/authorize?client_id=7e2ec405ab8a9a9c9528')
    }else{
      setIsLoggedIn(false)
      localStorage.removeItem("access_token")
      const currentUrl = window.location.href;

      // Remove the 'code' query parameter
      const newUrl = currentUrl.replace(/(\?|&)code=[^&]+/, '');

      // Navigate to the new URL
      setTimeout(() => {
        window.location.replace(newUrl);
      }, 500);

    }
    console.log(eventKey)
  }


  return (
    <NavbarReact bg="light" expand="lg">
    <Container>
      <NavbarReact.Brand href="/">Dcard-Intern</NavbarReact.Brand>
      <NavbarReact.Toggle aria-controls="basic-navbar-nav" />
      <NavbarReact.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto" onSelect={handleSelect}>
          {isLoggedIn ? (
            <>
            <Nav.Link disabled>Hello, {userName}!</Nav.Link>
            <Nav.Link eventKey="2" href="#link">Logout</Nav.Link>
            </>
          ) : (
            <Nav.Link eventKey="3" href={url} >Login</Nav.Link>
          )}
        </Nav>
      </NavbarReact.Collapse>
    </Container>
  </NavbarReact>
  )
}

export default Navbar


