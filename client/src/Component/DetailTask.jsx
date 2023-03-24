import React,{useEffect, useState} from 'react'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


function DetailTask() {
  const [isEdit, setIsEdit] =useState(false)
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const [repo, setRepo] = useState()
  const [userRepo, setUserRepo] = useState([])



  async function getUserRepo() {
    await axios.get("http://localhost:4000/getUserRepo", {
        headers:{
            "Authorization": "Bearer"+ localStorage.getItem("access_token")
            }
        })
        .then(data =>{
            console.log(data.data.RepoData);
            setUserRepo(data.data.RepoData)
        }
        ).catch(err => console.log(err))
}

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
    <div> 
      <Card>
        <Card.Body>
          <Card.Title className='row'>
            <DropdownButton
              className='col'
                id="issue_id"
                drop="end"
                variant="white"
                title="open"
              >
              <Dropdown.Item eventKey="1">open</Dropdown.Item>
              <Dropdown.Item eventKey="2">In progress</Dropdown.Item>
              <Dropdown.Item eventKey="3">Done</Dropdown.Item>
            </DropdownButton>
            <DropdownButton className="col d-flex justify-content-end" id="dropdown-basic-button" title="..." noCaret>
              <Dropdown.Item onClick={e => setIsEdit(true)}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={e => deleteData}>Delete</Dropdown.Item>
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