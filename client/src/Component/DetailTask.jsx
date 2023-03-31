import React,{useEffect, useState, useContext} from 'react'
import axios from 'axios';
import { Context } from "../Context/Context";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/Spinner';
import { Form, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash,faSquare, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'


function DetailTask() {
  const [isEdit, setIsEdit] =useState(false)
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const [repo, setRepo] = useState()
  const [userRepo, setUserRepo] = useState([])
  const [status, setStatus] = useState()
  
  const [loading, setLoading] = useState(true);

  const [issues, setIssues] = useState([])

  const {issueData, setIssueData} = useContext(Context)

useEffect(()=>{
  console.log(status)
async function updateState(){
  let s = status
  const LabelUrl =issueData.labels[0].url
  console.log(LabelUrl)
  let color = '';
  if(status === 'open'){
    color = '6c757d'
  }else if(status === 'In%20progress'){
    color = 'dc3545'
    s = 'In progress'
  }else{
    color='198754'
  }
  const data ={
    name: s,
    color: color,
  }

  await axios.patch(LabelUrl, data ,{
    headers:{
          "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
    }}).then(data => console.log(data))
    .catch(err => console.log(err))

    getIssue()
  }
  if(status){
    updateState()
  }
  

},[status])

async function getIssue(){
  console.log(issueData)
  await axios.get(issueData.url, {
    headers:{
      "Authorization": 'token ' +localStorage.getItem("access_token")
      }
  })
    .then(data=>{
      console.log(data.data)
      setIssues(data.data)
    }).catch(err => console.log(err))
  setIssueData(issueData);
  setLoading(false)
}

useEffect(()=>{
  //從url取得repoName
  const url = issueData.repository_url;
  const repoName = url.split("/").pop()
  setRepo(repoName)
  getIssue()

},[])

  async function updateData(req, res) {
    const data = {
        "title":title,
        "body":content 
    }
    console.log(data)
      await axios.patch(issueData.url, data, {
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
    const a = await axios.patch(issueData.url, data, {
        headers:{
            "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
            }
    }).then(data =>console.log(data))
    .catch(err => console.log(err))
    console.log(a)
}

const icon = () => {
  return <FontAwesomeIcon icon={faEllipsisVertical} />
}

  return (
    <div className='container'> 
    {loading ? (
       <div className='d-flex justify-content-center'>
      	   <Spinner animation="border" />
      </div>
      ) : (
        <>
      <h2 className='py-3'>Issue Details</h2>  
      <Card className='container'>
        <Card.Body>
          <Card.Title className='row'>
            <DropdownButton
              className='col'
                drop="end"
                variant="white"
                // title={issueData.labels[0].name}
                title="open"
              >
              <Dropdown.Item eventKey="1" onClick={e => setStatus('open')} className='text-secondary'><FontAwesomeIcon icon={faSquare} size="2xs" /> open</Dropdown.Item>
              <Dropdown.Item eventKey="2" onClick={e => setStatus('In%20progress')} className='text-danger'> <FontAwesomeIcon icon={faSquare} size="2xs" /> In progress</Dropdown.Item>
              <Dropdown.Item eventKey="3" onClick={e => setStatus('Done')} className='text-success'><FontAwesomeIcon icon={faSquare} size="2xs" /> Done</Dropdown.Item>
            </DropdownButton>
            <DropdownButton 
              className="col d-flex justify-content-end" 
              variant="white"
              title={icon()}>
              <Dropdown.Item onClick={e => setIsEdit(true)} className="text-secondary"><FontAwesomeIcon icon={faPenToSquare} size="xs" /> Edit</Dropdown.Item>
              <Dropdown.Item onClick={e => deleteData(e)} className="text-danger"><FontAwesomeIcon icon={faTrash} size="xs" /> Delete</Dropdown.Item>
            </DropdownButton>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            repo : {repo}
          </Card.Subtitle>
        {isEdit ? 
        <Form>
        <Card.Title className='py-3'>
        
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" value={issues.title} />
            </Col>
          </Form.Group>
          </Card.Title>
          <Card.Text>
          <Form.Group as={Row} row={3} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              Body
            </Form.Label>
            <Col sm={10}>
              <Form.Control as="textarea" rows={4} value={issues.body} />
            </Col>
          </Form.Group>
        </Card.Text>
        </Form>
          : 
            <>
            <Card.Title className='py-3'>
              Title : {issues.title}
            </Card.Title>
            <Card.Text className='py-3'>
              body : {issues.body}
            </Card.Text>
            </>
          }
          
          <Card.Text className='py-3 text-secondary'>
            update : {new Date(issues.updated_at).toLocaleString()}
          </Card.Text>
          {isEdit && <Button variant="primary" onClick={e => updateData}>確定</Button>}
        </Card.Body>
      </Card>

      {issueData && issueData.labels.map(each => {return(
        <p>{each.name}</p>
      )})}

      </>
      )}
    </div>
  )
}

export default DetailTask

// update
// const UPDATE_ISSUE_MUTATION = `
//   mutation {
//     updateIssue(input: {id: "ISSUE_ID", title: "NEW_TITLE", body: "NEW_BODY"}) {
//       issue {
//         id
//         title
//         body
//       }
//     }
//   }
// `;
// axios.post("https://api.github.com/graphql", {
//   query: UPDATE_ISSUE_MUTATION
// }, {
//   headers: {
//     Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
//   }
// })
// .then(response => {
//   console.log(response.data);
// })
// .catch(error => {
//   console.error(error);
// });

// create
// mutation {
//   createIssue(input: {repositoryId: "REPO_ID", title: "ISSUE_TITLE", body: "ISSUE_BODY"}) {
//     issue {
//       id
//       title
//       body
//     }
//   }
//}