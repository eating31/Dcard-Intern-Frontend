import React,{ useState, useContext } from 'react'
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import {Context} from '../Context/Context'

function SearchBar() {
    const [keyword, setKeyword] = useState('')
    const {userName, setUserName} = useContext(Context)
    const {allIssue, setAllIssue} = useContext(Context)
    const {cardLoading, setCarfLoading} = useContext(Context)
    const {totalData, setTotalData} = useContext(Context)
    const [loading, setLoading] = useState(false)

    const [labels, setLabels] = useState([ 
        { name: "open", isChecked: false },
        { name: "In progress", isChecked: false },
        { name: "Done", isChecked: false }
])

const handleChange = (e) =>{
    const { name, checked } = e.target;
    console.log(name)
    if (name === "allSelect") {
      let tempLabels = labels.map((label) => {
        return { ...label, isChecked: checked };
      });
      setLabels(tempLabels);
    } else {
      let tempLabels = labels.map((label) =>
      label.name === name ? { ...label, isChecked: checked } : label
      );
      setLabels(tempLabels);
    }
  };

  const handleKeyDown = (event) =>{
    if (event.key === 'Enter'){
        handelSubmit()
    }
  }

  async function handelSubmit(){
    setLoading(true)
    const selectLabel = labels.filter(e =>e.isChecked===true)
    const query = selectLabel.map((label) => `"${label.name}"`).join(',');
    console.log(selectLabel)
    let url=''
    if(selectLabel.length === 0){
        url=`https://api.github.com/search/issues?q=is:open+user:${userName.login}+${keyword}`
    }else{
        url=`https://api.github.com/search/issues?q=is:open+user:${userName.login}+label:${query}+${keyword}`
    }

    try{
        await axios.get(url,{
            headers:{
                "Authorization": 'Bearer ' +localStorage.getItem("access_token")
                }
        }).then((data)=>{
            setTotalData(data.data.items.length)
            setAllIssue(data.data.items)
        }).then(()=>{
            setCarfLoading(false)
            setLoading(false)
        })
    }catch(err){
        console.log(err)
    }
}

  return (
    <div className='bg-dark p-2 px-5 mt-4 rounded-pill'>
    <Form>
        <Row className="my-1">
            <Col className="col-12 col-lg-6 pt-2 d-flex justify-content-end text-white">
                <Form.Group as={Col}>
                <Form.Label className="form-label pe-2">State:</Form.Label>
                    <Form.Check inline label="全選" name="allSelect" type="checkbox" checked={!labels.some((label) => label.isChecked !== true)} onChange={handleChange} />
                    {labels.map((label, index) => (
                        <Form.Check key={index} inline name={label.name} label={label.name} type="checkbox" checked={label.isChecked || false} onChange={handleChange} />
                    ))}
                </Form.Group>
            </Col>

            <Col className="col-auto col-lg-1 pt-2 d-flex justify-content-start text-white">
            <Form.Label className="form-label align-self-center">search:</Form.Label>
            </Col>
            <Col className="col-auto col-lg-3">
            <Form.Control type="text" placeholder="issue content..." value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={handleKeyDown} />
            </Col>

            <Col className="col-12 col-lg-2 d-flex justify-content-end">
            <Button type="button" className="btn btn-light rounded-pill" onClick={handelSubmit} disabled={loading}>
            {loading ?
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                    :
                    <FontAwesomeIcon icon={faMagnifyingGlass} /> } 
                    {"  "}Search
            </Button>
            </Col>
        </Row>
    </Form>
    </div>
  )
}

export default SearchBar