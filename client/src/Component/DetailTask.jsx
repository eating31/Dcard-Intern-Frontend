import React,{useEffect, useState} from 'react'
import axios from 'axios';
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


  async function updateData(req, res) {
    const data = {
        "title":title,
        "body":content 
    }
    console.log(data)
    const a = await axios.patch("https://api.github.com/repos/eating31/"+repo+"/issues/2", data, {
        headers:{
            "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
            }
    }).then(data =>console.log(data))
    .catch(err => console.log(err))
    console.log(a)
}

async function deleteData(req, res) {
    const data = {
        "state":"closed",
    }
    console.log(data)
    const a = await axios.patch("https://api.github.com/repos/eating31/"+repo+"/issues/1", data, {
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
                title="open"
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
              <Dropdown.Item onClick={e => deleteData} className="text-danger"><FontAwesomeIcon icon={faTrash} size="xs" /> Delete</Dropdown.Item>
            </DropdownButton>
          </Card.Title>
          <Card.Title>
            Title : ...
          </Card.Title>
          <Card.Text>
            body : ...
          </Card.Text>
          {isEdit && <Button variant="primary" onClick={e => updateData}>確定</Button>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default DetailTask