import React,{useEffect, useState, useContext} from 'react'
import axios from 'axios';
import { Context } from "../Context/Context";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash,faSquare } from '@fortawesome/free-solid-svg-icons'
//import { faTrash } from '@fortawesome/free-regular-svg-icons'


function DetailTask() {
  const [isEdit, setIsEdit] =useState(false)
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const [repo, setRepo] = useState()
  const [userRepo, setUserRepo] = useState([])
  const [status, setStatus] = useState()
  

  const [issues, setIssues] = useState([])

  const {issueUrl, setIssueUrl} = useContext(Context)



useEffect(()=>{
console.log(issueUrl)
},[issueUrl])

useEffect(()=>{
  async function getIssue(){
    await axios.get(issueUrl)
    .then(data=>{
      console.log(data.data)
      setIssues(data.data)
    }).catch(err => console.log(err))
  }
  getIssue()
},[])

  async function updateData(req, res) {
    const data = {
        "title":title,
        "body":content 
    }
    console.log(data)
      await axios.patch(issueUrl, data, {
      headers:{
            "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
            }
    }).then(data =>console.log(data))
    .catch(err => console.log(err))
}

async function deleteData() {
    const data = {
        "state":"closed",
    }
    const a = await axios.patch(issueUrl, data, {
        headers:{
            "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
            }
    }).then(data =>console.log(data))
    .catch(err => console.log(err))
    console.log(a)
}


  return (
    <div className='container'> 
      <Card>
        <Card.Body>
          <Card.Title className='row'>
            <DropdownButton
              className='col no-arrow'
                id="issue_id"
                drop="end"
                variant="white"
                title={issues.state}
                onToggle={false}
              >
              <Dropdown.Item eventKey="1" onClick={e => setStatus(1)} className='text-secondary'><FontAwesomeIcon icon={faSquare} size="2xs" /> open</Dropdown.Item>
              <Dropdown.Item eventKey="2" onClick={e => setStatus(2)} className='text-danger'> <FontAwesomeIcon icon={faSquare} size="2xs" /> In progress</Dropdown.Item>
              <Dropdown.Item eventKey="3" className='text-success'><FontAwesomeIcon icon={faSquare} size="2xs" /> Done</Dropdown.Item>
            </DropdownButton>
            <DropdownButton 
              className="col d-flex justify-content-end" 
              id="dropdown-basic-button" 
              variant="white"
              title="&#8942;">
              <Dropdown.Item onClick={e => setIsEdit(true)} className="text-secondary"><FontAwesomeIcon icon={faPenToSquare} size="xs" /> Edit</Dropdown.Item>
              <Dropdown.Item onClick={e => deleteData(e)} className="text-danger"><FontAwesomeIcon icon={faTrash} size="xs" /> Delete</Dropdown.Item>
            </DropdownButton>
          </Card.Title>
          <Card.Title>
            Title : {issues.title}
          </Card.Title>
          <Card.Text>
            body : {issues.body}
          </Card.Text>
          {isEdit && <Button variant="primary" onClick={e => updateData}>確定</Button>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default DetailTask