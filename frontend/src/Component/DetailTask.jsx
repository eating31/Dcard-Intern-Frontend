import React,{useEffect, useState, useContext} from 'react'
import axios from 'axios';
import { Context } from "../Context/Context";
import { Form, Row, Col, Spinner, Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
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
  const [stateLoading, setStateLoading] = useState(false)
  const [issues, setIssues] = useState([])

  const [modalShow, setModalShow] = useState(false)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [deleteSuccessShow, setDeleteSuccessShow] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const {detailShow, setDetailShow} = useContext(Context)
  const {issueData, setIssueData} = useContext(Context)

useEffect(()=>{
   if(issueData){
      setIsEdit(false)
      setLoading(true)
      const url = issueData.repository_url;
      const repoName = url.split("/").pop()
      setRepo(repoName)
      getIssue()
    }
},[issueData])

useEffect(()=>{
 
    async function updateState(){
      setStateLoading(true)
      let s = status
      const LabelUrl =issueData.labels[0].url
      console.log(LabelUrl)
      let color = '';
      if(status === 'open'){
        color = 'ededed'
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
              "Authorization": "bearer " + localStorage.getItem("access_token")
        }}).then(data => console.log(data))
        .then(()=> setModalShow(true))
        .then(()=> setStateLoading(false))
        .then(()=> getIssue())
        .catch(err => console.log(err))
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
            "Authorization": "bearer " + localStorage.getItem("access_token")
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
  setDeleteLoading(true)
    const data = {
        "state":"closed",
    }
   await axios.patch(issueData.url, data, {
        headers:{
            "Authorization": "bearer " + localStorage.getItem("access_token")
            }
    }).then(() =>{
      setDeleteModalShow(false)
      setDeleteSuccessShow(true)
      setDeleteLoading(false)
    })
    .catch(err => console.log(err))
}

const icon = () => {
  return <FontAwesomeIcon icon={faEllipsisVertical} />
}

const handleClose = () => {
  setDetailShow(false)
};

const handleDeleteClose = () =>{
  setModalShow(false)
  setDetailShow(false)
  setDeleteSuccessShow(false)
  window.location.reload()
}

  return (
    <div className='container'> 
    <Modal show={detailShow} onHide={handleClose} animation={false} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Issue Details</Modal.Title>
        </Modal.Header>
        {loading ? 
       <Modal.Title className='d-flex justify-content-center py-5'>
      	   <Spinner animation="border" />
      </Modal.Title>
       :
        <Modal.Body className='px-5'>
        <Modal.Title className='row'>
        
            <DropdownButton
              id="my-dropdown-button"
              className='col'
                variant="white"
                title={<span  style={{
                            backgroundImage: `linear-gradient(transparent 30%,  #${issueData.labels[0].color} 100%)`,
                            padding: '3px 8px',
                            }}>
                  
                  {stateLoading &&
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                    }
                    {"  "} {issueData.labels[0].name}
                    </span>
                }
              >
              <Dropdown.Item eventKey="1" onClick={e => setStatus('open')} className='text-secondary'><FontAwesomeIcon icon={faSquare} size="2xs" /> open</Dropdown.Item>
              <Dropdown.Item eventKey="2" onClick={e => setStatus('In%20progress')} className='text-danger'> <FontAwesomeIcon icon={faSquare} size="2xs" /> In progress</Dropdown.Item>
              <Dropdown.Item eventKey="3" onClick={e => setStatus('Done')} className='text-success'><FontAwesomeIcon icon={faSquare} size="2xs" /> Done</Dropdown.Item>
            </DropdownButton>
            <DropdownButton
              id="my-dropdown-button"
              className="col d-flex justify-content-end custom-dropdown-button"
              variant="white"
              title={icon()}>
              <Dropdown.Item onClick={e => setIsEdit(true)} className="text-secondary"><FontAwesomeIcon icon={faPenToSquare} size="xs" /> Edit</Dropdown.Item>
              <Dropdown.Item onClick={e => setDeleteModalShow(true)} className="text-danger"><FontAwesomeIcon icon={faTrash} size="xs" /> Delete</Dropdown.Item>
            </DropdownButton>
          </Modal.Title>
        {isEdit ? 
        <Form>
        <Modal.Title className='py-3'>
        
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}/>
            </Col>
          </Form.Group>
          </Modal.Title>
          <Form.Group as={Row} row={3} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              Body
            </Form.Label>
            <Col sm={10}>
              <Form.Control as="textarea" rows={4} value={content} onChange={e => setContent(e.target.value)} />
            </Col>
          </Form.Group>
        </Form>
          : 
            <>
            <h5 className='py-3'>
              Title : {title}
            </h5>
            <p className='py-3' style={{ wordWrap: "break-word" }}>
              Body : {content}
            </p>
            </>
          }
          <p className="mb-2 text-muted"> repo : {repo} </p>
          <p className='pt-3 text-secondary'> created : {new Date(issues.created_at).toLocaleString()}</p>
          <p className='text-secondary'>updated : {new Date(issues.updated_at).toLocaleString()}</p>

        </Modal.Body>
}
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
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
                {"  "}確定修改
            </Button>}
        </Modal.Footer>
      </Modal>

    
      <Modal show={modalShow} onHide={handleDeleteClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Updated an issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>Successfully updated an issue</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleDeleteClose}>
            確定
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={deleteModalShow} onHide={e => setDeleteModalShow(false)} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete an issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>請問您確定要刪除這個issue嗎？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={e => setDeleteModalShow(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={e => deleteData(e)} disabled={deleteLoading}>
          {deleteLoading &&
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    />
                }
                {"  "}刪除
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteSuccessShow} onHide={handleDeleteClose} centere>
        <Modal.Header closeButton>
          <Modal.Title>
            Deleted an issue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          刪除成功!
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DetailTask
