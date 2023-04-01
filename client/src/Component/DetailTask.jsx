import React,{useEffect, useState, useContext} from 'react'
import axios from 'axios';
import { Context } from "../Context/Context";

import { Form, Row, Col, Card, Button, Spinner, Dropdown, DropdownButton, Modal } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash,faSquare, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'


function DetailTask() {
  const [isEdit, setIsEdit] =useState(false)
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const [repo, setRepo] = useState()
  const [status, setStatus] = useState()
  
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false)
  const [issues, setIssues] = useState([])

  const [modalShow, setModalShow] = useState(false)

  const {issueData, setIssueData} = useContext(Context)

  useEffect(()=>{
    //從url取得repoName
    const url = issueData.repository_url;
    const repoName = url.split("/").pop()
    setRepo(repoName)
    getIssue()
  
  },[])

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
  await axios.get(issueData.url, {
    headers:{
      "Authorization": 'token ' +localStorage.getItem("access_token")
      }
  })
    .then(data=>{
      setContent(data.data.body)
      setTitle(data.data.title)
      setIssues(data.data)
    }).catch(err => console.log(err))
  setIssueData(issueData);
  setLoading(false)
}

  async function updateData(req, res) {
    setEditLoading(true)
    const data = {
        "title":title,
        "body":content 
    }
    console.log(data)
      await axios.patch(issueData.url, data, {
      headers:{
            "Authorization": "bearer " + process.env.REACT_APP_GITHUB_TOKEN
            }
    }).then(() =>{
      getIssue()
      setIsEdit(false)
      setEditLoading(false)
    }).then(()=>{
      setModalShow(true)
    })
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

const handleClose = () => {
  setModalShow(false)
};

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
              <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}/>
            </Col>
          </Form.Group>
          </Card.Title>
          <Card.Text>
          <Form.Group as={Row} row={3} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              Body
            </Form.Label>
            <Col sm={10}>
              <Form.Control as="textarea" rows={4} value={content} onChange={e => setContent(e.target.value)} />
            </Col>
          </Form.Group>
        </Card.Text>
        </Form>
          : 
            <>
            <Card.Title className='py-3'>
              Title : {title}
            </Card.Title>
            <Card.Text className='py-3'>
              Body : {content}
            </Card.Text>
            </>
          }
          
          <Card.Text className='pt-3 text-secondary'>
            created : {new Date(issues.created_at).toLocaleString()}
          </Card.Text>
          <Card.Text className='text-secondary'>
            updated : {new Date(issues.updated_at).toLocaleString()}
          </Card.Text>
          
          {isEdit && 
            <Button variant="primary" onClick={e => updateData()} disabled={editLoading}>
               {editLoading &&
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    />
                }
                {"  "}確定
            </Button>}

        </Card.Body>
      </Card>

      {issueData && issueData.labels.map(each => {return(
        <p>{each.name}</p>
      )})}

      </>
      )}
     <div>
      <Modal show={modalShow} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Updated an issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>Successfully updated an issue</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            確定
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  )
}

export default DetailTask
