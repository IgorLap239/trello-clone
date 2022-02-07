import React from 'react';
import { Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { TaskModalBody } from './TaskModalBody'
import './TaskModalWindow.css'

const TaskModalWindow = ({ visible, closeHandle, title, column, dateValue, changeDeadline, showDeadline, setDeadlineView, useDeadlineRange, setDeadlineRange, deadlineTime, changeDeadlineTime }) => {
  return (
    <Modal show={visible}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    className='task-modal-window'
    >
      <Modal.Header closeButton onClick={closeHandle}>
      <div className="header-content d-flex flex-column">
        <Modal.Title>
        {title}
        </Modal.Title>
        <p className="text-start">
        in column <a href="#" className="link-secondary">{column}</a>
        </p>
      </div>
      </Modal.Header>
      <TaskModalBody 
      dateValue={dateValue} 
      changeDeadline={changeDeadline}
      showDeadline={showDeadline}
      setDeadlineView={setDeadlineView}
      useDeadlineRange={useDeadlineRange}
      setDeadlineRange={setDeadlineRange}
      deadlineTime={deadlineTime}
      changeDeadlineTime={changeDeadlineTime}
      />
    </Modal>
  )
}

export { TaskModalWindow };