import React,{useEffect, useState, useContext} from 'react'
import { Accordion, Card, Button,NavDropdown, ListGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { Context } from "../Context/Context";

function Siders() {

  const { repo, setRepo} = useContext(Context)
  const { allRepo, setAllRepo} = useContext(Context)
  const {searchAll, setSearchAll} =useContext(Context)

  return (
    <div style={{ display: 'flex', height: '100vh', width:'200px', overflow: 'scroll', position: 'fixed' }}>
       <Accordion flush style={{ width:'200px' }} defaultActiveKey="1">
      <Accordion.Item eventKey="0">
        <Accordion.Header variant="link" onClick={e => setSearchAll(!searchAll)}>All Issues</Accordion.Header>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Repo</Accordion.Header>
        <Accordion.Body>
          {allRepo.length >0 &&
        <ListGroup variant="flush" eventKey="1">
          {allRepo.map((repo,index) => 
            <ListGroup.Item action onClick={e => setRepo(repo.name) } key={index}>
            {repo.name}
          </ListGroup.Item>
          )}
        
        </ListGroup>
   }
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

    </div>
  )
}

export default Siders
