import React from 'react';
import { Modal, Container, Row, Col } from 'react-bootstrap';
import { TaskDescription } from './TaskDescription/TaskDescription';
import { CheckList } from './CheckList/CheckList';
import { LabelsDropdown } from './SideMenu/LabelDropdown/LabelsDropdown';
import { CheckListDropdown } from './SideMenu/CheckListDropdown';
import { DeadlineDropdown } from './SideMenu/DeadlineDropdown/DeadlineDropdown';
import { MembersDropdown } from './SideMenu/MembersDropdown/MembersDropdown';
import { CoversDropdown } from './SideMenu/CoversDropdown/CoversDropdown';
import { CurrentLabels } from './ServicesPanel/CurrentLabels';
import { CurrentDeadline } from './ServicesPanel/CurrentDeadline';
import { CurrentMembers } from './ServicesPanel/CurrentMembers';

const TaskModalBody = ({
  dateValue,
  changeDeadline,
  showDeadline,
  setDeadlineView,
  useDeadlineRange,
  setDeadlineRange,
  deadlineTime,
  changeDeadlineTime,
  activeLabels,
  changeActiveLabels,
  labels,
  changeLabels,
  remove,
  changeCheckList,
  checkLists,
  taskDescription,
  setTaskDescription,
  cardId,
  addCheckBox,
  changeCheckboxTitle,
  removeCheckBox,
  changeProgress,
  removeCheckList,
  removeCheckListItem,
  checkboxes,
  checkedCheckboxes,
  setSaveDeadline,
  colorCover,
  setColorCover,
  pictureCover,
  setPictureCover,
  addColorCover,
  addPictureCover
}) => {
  return (
    <Modal.Body>
      <Container>
        <Row className="content">
          <Col xs={14} md={10} className="main-content">
            <div className="services-content">
              {showDeadline && <CurrentMembers />}
              {activeLabels.length > 0 && (
                <CurrentLabels
                  activeLabels={activeLabels}
                  changeActiveLabels={changeActiveLabels}
                  labels={labels}
                  changeLabels={changeLabels}
                  remove={remove}
                />
              )}
              {showDeadline && (
                <CurrentDeadline
                  dateValue={dateValue}
                  changeDeadline={changeDeadline}
                  setDeadlineView={setDeadlineView}
                  useDeadlineRange={useDeadlineRange}
                  setDeadlineRange={setDeadlineRange}
                  deadlineTime={deadlineTime}
                  changeDeadlineTime={changeDeadlineTime}
                  setSaveDeadline={setSaveDeadline}
                />
              )}
            </div>
            <TaskDescription
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
              cardId={cardId}
            />
            {checkLists.map((item) => (
              <CheckList key={item.id} id={item.id} title={item.title} 
              addCheckBox={addCheckBox}
              changeCheckboxTitle={changeCheckboxTitle}
              removeCheckBox={removeCheckBox}
              changeProgress={changeProgress}
              removeCheckList={removeCheckList}
              removeCheckListItem={removeCheckListItem}
              checkboxes={checkboxes}
              checkedCheckboxes={checkedCheckboxes}/>
            ))}
          </Col>
          <Col className="side-buttons" xs={4} md={2}>
            <MembersDropdown />
            <LabelsDropdown
              activeLabels={activeLabels}
              changeActiveLabels={changeActiveLabels}
              labels={labels}
              changeLabels={changeLabels}
              remove={remove}
            />
            <CheckListDropdown changeCheckList={changeCheckList} />
            <DeadlineDropdown
              dateValue={dateValue}
              changeDeadline={changeDeadline}
              setDeadlineView={setDeadlineView}
              useDeadlineRange={useDeadlineRange}
              setDeadlineRange={setDeadlineRange}
              deadlineTime={deadlineTime}
              changeDeadlineTime={changeDeadlineTime}
              setSaveDeadline={setSaveDeadline}
            />
            <CoversDropdown 
              colorCover={colorCover}
              pictureCover={pictureCover}
              addColorCover={addColorCover}
              addPictureCover={addPictureCover}
            />
          </Col>
        </Row>
      </Container>
    </Modal.Body>
  );
};

export { TaskModalBody };
