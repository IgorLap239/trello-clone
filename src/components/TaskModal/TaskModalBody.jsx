import React, { useState } from 'react';
import { Modal, Container, Row, Col } from 'react-bootstrap';
import { TaskDescription } from './TaskDescription/TaskDescription';
import { CheckList } from './CheckList/CheckList';
import { LabelsDropdown } from './SideMenu/LabelDropdown/LabelsDropdown';
import { CheckListDropdown } from './SideMenu/CheckListDropdown';
import { DeadlineDropdown } from './SideMenu/DeadlineDropdown';
import { CurrentLabels } from './CurrentLabels';

const TaskModalBody = () => {
  const [labels, setLabels] = useState([]);
  const [checkLists, setCheckList] = useState([]);
  const changeCheckList = (value) => {
    setCheckList([...checkLists, value])
  }
  const changeLabels = (value) => {
    setLabels([...labels, value]);
  }
  const removeLabel = (value) => {
    setLabels([
      ...labels.slice(0, value),
      ...labels.slice(value + 1)
    ]);
  }

  /*const removeLabel = (value) => {
    setLabels([
      ...labels.slice(0, value),
      ...labels.slice(value + 1)
    ]);
  }*/


  return (
    <Modal.Body>
      <Container>
        <Row className='content'>
          <Col xs={14} md={10} className='main-content'>
          <div className='services-content'>
            {labels.length > 0 && (
              <CurrentLabels labels={labels} />
            )}
          </div>
          <TaskDescription/>
          { checkLists.map((item, i) => 
              <CheckList key={i} id={`${i}`} title={item} />
            )}
          </Col>
          <Col className="side-buttons" xs={4} md={2}>
            <LabelsDropdown labels={labels} changeLabels={changeLabels} remove={removeLabel}/>
            <CheckListDropdown changeCheckList={changeCheckList}/>
            <DeadlineDropdown/>
          </Col>
        </Row>
      </Container>
    </Modal.Body>
  )
}

export { TaskModalBody };