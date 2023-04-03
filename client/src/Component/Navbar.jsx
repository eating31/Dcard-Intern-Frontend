import React, { useState, useEffect, useContext } from 'react'
import {Container, Nav, NavDropdown, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import NavbarReact from 'react-bootstrap/Navbar';
import { Context } from "../Context/Context";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState();
  const {isAdd, setIsAdd }= useContext(Context)


useEffect(()=>{
  if(localStorage.getItem("access_token") === null){
    setIsLoggedIn(false)
    console.log('logout')
   }else{
    console.log('login')
    setIsLoggedIn(true)
   }

},[])

  function handleSelect(Key){
   if (Key === '2'){
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
            <Nav className='pe-3 d-flex align-items-center'>Hello, {localStorage.getItem("user_name")}!</Nav>
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
            
              <NavDropdown title={<img width="40px" height="40px"  className="rounded-circle" src={localStorage.getItem("avatar_url")} />}>
                <NavDropdown.Item eventKey="1" href={localStorage.getItem("html_url")} target="_black">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="2" href="#link">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <Nav.Link eventKey="3" href="/" >Login</Nav.Link>
          )}
        </Nav>
      </NavbarReact.Collapse>
    </Container>
  </NavbarReact>
  )
}

export default Navbar


