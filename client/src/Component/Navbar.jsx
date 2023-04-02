import React, { useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container';
import {Nav, NavDropdown} from 'react-bootstrap';
import NavbarReact from 'react-bootstrap/Navbar';
import { Context } from "../Context/Context";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState();
  const {userName, setUserName} = useContext(Context)
  const {isAdd, setIsAdd }= useContext(Context)

  const url = 'https://github.com/login/oauth/authorize?client_id=7e2ec405ab8a9a9c9528'

  console.log(userName)

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
    }else if (eventKey === '2'){
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
    <NavbarReact bg="light" fixed="top">
    <Container>
      <NavbarReact.Brand href="/">Dcard-Intern</NavbarReact.Brand>
      <NavbarReact.Toggle aria-controls="basic-navbar-nav" />
      <NavbarReact.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto" onSelect={handleSelect}>
          {isLoggedIn ? (
            <>
            <Nav className='pe-3 d-flex align-items-center'>Hello, {userName.name}!</Nav>
            
        <Nav className='d-flex align-items-center'>
          <OverlayTrigger
              placement='bottom'
              overlay={
                <Tooltip>
                  Add an issue
                </Tooltip>
              }
            >
              <Button variant="white" className='border-0' onClick={e => setIsAdd(true)}><FontAwesomeIcon icon={faPlus} /> </Button>
            </OverlayTrigger>
          </Nav>
            
            <NavDropdown title={<img width="40px" height="40px"  className="rounded-circle" src={userName.avatar_url} />}>
              <NavDropdown.Item eventKey="1" href={userName.html_url} target="_black">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item eventKey="2" href="#link">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
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


