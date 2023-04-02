import React,{useEffect, useState, useContext} from 'react'
import axios from 'axios';
import { Button, Modal, Form, Spinner} from 'react-bootstrap';
import Select from 'react-select'
import { Context } from '../Context/Context';

function AddTask() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [selectRepo, setSelectRepo] = useState()
    const [allRepo, setAllRepo]= useState([])
    const [loading, setLoading] = useState(false)
    const [finishModal, setFinishModal] = useState(false)
    const {isAdd, setIsAdd }= useContext(Context)

    const handleClose = () => {
        setIsAdd(false)
        setFinishModal(false);
    };

    useEffect(()=>{
        if(isAdd){
            async function getUserRepo() {
                await axios.get("https://api.github.com/user/repos", {
                    headers:{
                        "Authorization": "Bearer "+ localStorage.getItem("access_token")
                        }
                    })
                    .then(data =>{
                        const newArr = data.data.map((item) => ({ value: item.name, label: item.name }));
                        setAllRepo(newArr)
                    }
                    ).catch(err => console.log(err))
            }
            getUserRepo()
        }
    },[isAdd])

    async function postData(req, res) {
        const data = {
            "title":title,
            "body":content, 
            "labels": [
                {
                  "name": "open",
                  "color": "6c757d"
                }
              ]
        }
        if(title){   
            if(content.length <= 30){
                alert('請輸入超過30字')
            }else{
                setLoading(true)
                await axios.post("https://api.github.com/repos/eating31/"+selectRepo+"/issues", data,{
                    headers:{
                        "Authorization": "bearer " + localStorage.getItem("access_token")
                        }
                }).then(data =>console.log(data))
                .catch(err => console.log(err))
                handleClose()
                setLoading(false)
                setFinishModal(true)
            }
        }else{
            alert('請輸入標題')
        }
    }

function finishClose(){
  setFinishModal(false)
  window.location.reload()
}

  return (
    <div>
    <Button variant="primary" onClick={() => setIsAdd(true)}>
       Add
    </Button>
    
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}
      show={isAdd}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add an issue
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Repo</Form.Label>
            <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={allRepo[0]}
                onChange={e => setSelectRepo(e.value)}
                options={allRepo}
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Body</Form.Label>
                <Form.Control as="textarea" rows={3} value={content} onChange={e => setContent(e.target.value)}/>
                <Form.Text id="passwordHelpBlock" muted>
                    至少輸入30個字
                </Form.Text>
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                取消
            </Button>
            <Button variant="primary" onClick={e =>postData(e)} disabled={loading}>
                {loading &&
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    />
                }
                {"  "}確定
            </Button>
      </Modal.Footer>
    </Modal>

    <Modal show={finishModal} onHide={finishClose} animation={false} centered>
        <Modal.Header>
          <Modal.Title>Create an issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>Successfully created an issue</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={finishClose}>
            確定
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AddTask