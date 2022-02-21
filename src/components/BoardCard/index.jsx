import React, { useState, useEffect } from 'react';

import { Card } from 'react-bootstrap';
import moment from 'moment';
import { Draggable } from 'react-beautiful-dnd';
import { useAuth } from '../../contexts/Auth';

import styles from './BoardCard.module.css';
import { TaskModalWindow } from '../TaskModal/TaskModal';
import { RenderCardTitle } from '../RenderCardTitle';

import { CardLabel } from '../CardLabel';

const BoardCard = ({
  columnId,
  card,
  columnTitle,
  cardId,
  cardIndex,
  updateCardTitle,
  handleCardDelete,
  cardsVisible,
  labels,
  setLabels,
  setLabelsUpdate,
  changeCardPos,
}) => {
  const [visible, setVisible] = useState(false);
  const { client } = useAuth();

  const [isEditTitleCard, setIsEditTitleCard] = useState(false);

  function closeHandle() {
    setVisible(false);
  }

  function openHandle() {
    setVisible(true);
  }

  const upsertCardTitle = async (val, cardId) => {
    await client.from('tsk_cards').upsert([{ crd_id: cardId, crd_title: val }]);
  };

  const handleCardSave = async (e, valueCard, cardId) => {
    e.stopPropagation();
    updateCardTitle(valueCard, cardId);
    setIsEditTitleCard(false);
    upsertCardTitle(valueCard, cardId);

    //getData('cards', null);
  };

  const handleCardClose = (e) => {
    e.stopPropagation();
    setIsEditTitleCard(false);
  };

  const handleCardEdit = (e) => {
    e.stopPropagation();
    setIsEditTitleCard(true);
  };

  const isCardVisible = () => {
    const currentCard = cardsVisible.find((el) => el.crd_id === card.crd_id);
    return currentCard === undefined || currentCard.visible ? true : false;
  };

  /* task modal window state */
  /* cover states */
  const [colorCover, setColorCover] = useState('');
  const [pictureCover, setPictureCover] = useState('');
  const [saveCover, setSaveCover] = useState(false);

  const addColorCover = (val) => {
    setColorCover(val);
    setPictureCover('');
    setSaveCover('true');
  };

  const addPictureCover = (val) => {
    setPictureCover(val);
    setColorCover('');
    setSaveCover('true');
  };

  const removeCover = () => {
    setPictureCover('');
    setColorCover('');
    setSaveCover('true');
  };

  useEffect(() => {
    saveColorCover();
    savePictureCover();
  }, [saveCover]);

  const saveColorCover = async () => {
    const { data, error } = await client
      .from('tsk_cards')
      .update({ crd_coverColor: colorCover })
      .eq('crd_id', cardId);
  };

  const savePictureCover = async () => {
    const { data, error } = await client
      .from('tsk_cards')
      .update({ crd_coverPic: pictureCover })
      .eq('crd_id', cardId);
  };

  /* end cover states */

  /* deadline states */

  const [value, onChange] = useState(new Date());
  const [showDeadline, setShowDeadline] = useState(false);
  const [isActiveRange, setIsActiveRange] = useState(false);
  const [deadlineTime, setDeadlineTime] = useState('');
  const [saveDeadline, setSaveDeadline] = useState(false);

  const changeDeadlineView = (val) => {
    setShowDeadline(val);
  };

  const setDeadlineRange = (val) => {
    setIsActiveRange(val);
  };

  const changeDeadlineTime = (val) => {
    setDeadlineTime(val);
  };

  useEffect(() => {
    if (saveDeadline) {
      saveDeadlineDate();
      setSaveDeadline(false);
    }
  }, [saveDeadline]);

  const saveDeadlineDate = async () => {
    let startDate;
    let deadlineDate;
    let savedTime = deadlineTime || null;
    if (Array.isArray(value)) {
      [startDate, deadlineDate] = [...value];
    } else {
      startDate = null;
      deadlineDate = value;
    }
    if (!showDeadline) {
      deadlineDate = null;
    }
    const { data, error } = await client
      .from('tsk_cards')
      .update({
        crd_deadlineDate: deadlineDate,
        crd_startDate: startDate,
        crd_deadlineTime: savedTime,
      })
      .eq('crd_id', cardId);
  };

  /* end of deadline states */

  const [activeLabels, setActiveLabels] = useState([]);
  const [activeLabelsUpdate, setActiveLabelsUpdate] = useState(false);

  useEffect(() => {
    if (activeLabelsUpdate) {
      saveСardLabels();
      setActiveLabelsUpdate(false);
    }
  }, [activeLabelsUpdate]);

  const saveСardLabels = async () => {
    let savedLabels = activeLabels;
    if (savedLabels.length === 0) {
      savedLabels = [];
    }
    const { data, error } = await client
      .from('tsk_cards')
      .update({ crd_labels: JSON.stringify(savedLabels) })
      .eq('crd_id', cardId);
  };

  const changeLabels = (val) => {
    const newItem = val;
    if (!newItem.id) {
      newItem.id = labels.length + 1;
    }
    if (Number(newItem.id) <= Number(labels.length)) {
      setLabels((prevState) =>
        prevState.map((item) => {
          if (Number(newItem.id) === Number(item.id)) {
            item.id = newItem.id;
            item.color = newItem.color;
            item.status = newItem.status;
            item.value = newItem.value;
          }
          return item;
        })
      );
      setLabelsUpdate(true);
    } else {
      setLabels([...labels, newItem]);
      setLabelsUpdate(true);
    }
  };

  const changeActiveLabels = (value) => {
    let index = -1;
    activeLabels.map((item) => {
      if (Number(value.id) === Number(item.id)) {
        index = activeLabels.indexOf(item);
      }

      return item;
    });
    if (index !== -1) {
      setActiveLabels((prevState) =>
        prevState.map((item) => {
          if (Number(value.id) === Number(item.id)) {
            item.id = value.id;
            item.color = value.color;
            item.value = value.value;
          }
          return item;
        })
      );
    } else {
      setActiveLabels([...activeLabels, value]);
    }
    setActiveLabelsUpdate(true);
  };

  const removeActiveLabel = (value) => {
    setActiveLabels([
      ...activeLabels.slice(0, value),
      ...activeLabels.slice(value + 1),
    ]);
  };
  /* end of labels states */

  /* checklists states */
  const [checkLists, setCheckList] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);
  const [changes, setChanges] = useState(false);

  const changeCheckList = (value) => {
    setCheckList([
      ...checkLists,
      { title: value, id: checkLists.length + 1, card: cardId },
    ]);
  };

  const saveCheckLists = async () => {
    let savedCardLists = checkLists.filter((list) => list.card == cardId);
    if (savedCardLists.length === 0) {
      savedCardLists = [];
    }
    const { data, error } = await client
      .from('tsk_cards')
      .update({ lists: JSON.stringify(savedCardLists) })
      .eq('crd_id', cardId);
  };

  const saveCheckboxes = async () => {
    let savedCardCheckboxes = checkboxes.filter(
      (checkbox) => checkbox.card == cardId
    );
    if (checkboxes.length === 0) {
      savedCardCheckboxes = [];
    }
    const { data, error } = await client
      .from('tsk_cards')
      .update({ checkboxes: JSON.stringify(savedCardCheckboxes) })
      .eq('crd_id', cardId);
  };

  useEffect(() => {
    if (checkLists.length > 0) {
      saveCheckLists();
    }
  }, [checkLists.length]);

  useEffect(() => {
    if (changes) {
      if (checkLists.length === 0) {
        saveCheckLists();
        saveCheckboxes();
      }
      setChanges(false);
    }
  }, [changes]);

  useEffect(() => {
    if (checkboxes.length >= 1) {
      saveCheckboxes();
    }
  }, [checkboxes]);

  useEffect(() => {
    client
      .from('tsk_checklists')
      .select('*')
      .eq('list_crd_id', card.id)
      .then(({ data, error }) => {
        if (data && data.length > 0) {
          if (!error) {
            setCheckList(() =>
              data[0].lists.length ? JSON.parse(data[0].lists) : []
            );
            setCheckboxes(() =>
              data[0].checkboxes ? JSON.parse(data[0].checkboxes) : []
            );
            setCheckedCheckboxes(() =>
              data[0].checkboxes
                ? JSON.parse(data[0].checkboxes)
                    .map((item) => {
                      return item.status
                        ? { id: item.id, listId: item.listId }
                        : 0;
                    })
                    .filter((item) => item !== 0)
                : []
            );
          }
        }
      });
  }, []);

  const addCheckBox = (listId) => {
    setCheckboxes((prevState) => {
      return [
        ...prevState,
        {
          title: '',
          id: prevState[prevState.length - 1]
            ? prevState[prevState.length - 1].id + 1
            : 1,
          status: false,
          listId: listId,
          card: cardId,
        },
      ];
    });
  };

  const onChangeCheckboxTitle = (e) => {
    const id = e.target.closest('.subtask').id;
    const value = e.target.value;
    setCheckboxes((prevState) => {
      return prevState.map((item) => {
        if (Number(id) === Number(item.id)) {
          item.title = value;
        }
        return item;
      });
    });
  };

  const changeProgress = (e) => {
    const id = Number(e.target.closest('.subtask').id);
    const listId = Number(e.target.closest('.check-list').dataset.num);
    const item = { id, listId };
    if (e.target.checked) {
      if (
        checkedCheckboxes.findIndex(
          (x) => x.id === id && x.listId === listId
        ) === -1
      ) {
        setCheckedCheckboxes((prevState) => {
          return [...prevState, item];
        });
        setCheckboxes((prevState) => {
          return prevState.map((item) => {
            if (Number(id) === Number(item.id)) {
              item.status = true;
            }
            return item;
          });
        });
      }
    } else {
      const index = checkedCheckboxes.findIndex(
        (x) => x.id === id && x.listId === listId
      );
      setCheckedCheckboxes((prevState) => {
        if (index === prevState.length - 1) {
          return [...prevState.slice(0, index)];
        } else if (index === 0) {
          return [...prevState.slice(index, prevState.length)];
        }
        return [...prevState.slice(0, index), ...prevState.slice(index + 1)];
      });
      setCheckboxes((prevState) => {
        return prevState.map((item) => {
          if (Number(id) === Number(item.id)) {
            item.status = false;
          }
          return item;
        });
      });
    }
  };

  const removeCheckList = (e) => {
    const id = e.target.closest('.check-list').dataset.num;
    const index = checkLists.findIndex(
      (x) => Number(x.card) == Number(cardId) && Number(x.id) == Number(id)
    );
    setCheckList((prevState) => {
      if (index === prevState.length - 1) {
        return [...prevState.slice(0, index)];
      } else if (index === 0) {
        return [...prevState.slice(index, prevState.length)];
      }
      return [...prevState.slice(0, index), ...prevState.slice(index + 1)];
    });
    setCheckboxes([
      ...checkboxes
        .filter((item) => item.listId != id)
        .filter((item) => item.card == cardId),
    ]);
    setChanges(true);
  };

  const removeCheckListItem = (e) => {
    const id = e.target.closest('.subtask').id;
    const listId = e.target.closest('.check-list').dataset.num;
    const index = checkedCheckboxes.findIndex(
      (x) => x.listId == listId && x.id == id
    );
    if (index !== -1) {
      setCheckedCheckboxes([
        ...checkedCheckboxes.slice(0, index),
        ...checkedCheckboxes.slice(index + 1),
      ]);
    }
    removeCheckbox(id, listId);
  };

  const removeCheckbox = (id, listId) => {
    let index = 0;
    checkboxes.map((item) => {
      if (
        Number(item.id) === Number(id) &&
        Number(item.listId) === Number(listId)
      ) {
        index = checkboxes.indexOf(item);
      }
      return item;
    });
    setCheckboxes([
      ...checkboxes.slice(0, index),
      ...checkboxes.slice(index + 1),
    ]);
  };
  /* end checklists state */

  /* download values from database */
  useEffect(() => {
    client
      .from('tsk_cards')
      .select('*')
      .eq('crd_id', cardId)
      .then(({ data, error }) => {
        if (data) {
          if (data.length > 0) {
            if (!error) {
              setActiveLabels(() =>
                data[0].crd_labels ? JSON.parse(data[0].crd_labels) : []
              );
              if (data[0].crd_deadlineDate) {
                if (data[0].crd_startDate) {
                  setIsActiveRange(true);
                  onChange([
                    new Date(data[0].crd_startDate),
                    new Date(data[0].crd_deadlineDate),
                  ]);
                } else {
                  let deadlineDate = new Date(data[0].crd_deadlineDate);
                  if (deadlineDate != new Date()) {
                    deadlineDate.setDate(deadlineDate.getDate() + 1);
                  }
                  onChange(deadlineDate);
                }
                if (data[0].crd_deadlineTime) {
                  setDeadlineTime(data[0].crd_deadlineTime);
                }
                setShowDeadline(true);
              }
              if (data[0].crd_coverPic) {
                setPictureCover(data[0].crd_coverPic);
              }
              if (data[0].crd_coverColor) {
                setColorCover(data[0].crd_coverColor);
              }
              setCheckList(() =>
                data[0].lists ? JSON.parse(data[0].lists) : []
              );
              setCheckboxes(() =>
                data[0].checkboxes ? JSON.parse(data[0].checkboxes) : []
              );
              setCheckedCheckboxes(() =>
                data[0].checkboxes
                  ? JSON.parse(data[0].checkboxes)
                      .map((item) => {
                        return item.status
                          ? { id: item.id, listId: item.listId }
                          : 0;
                      })
                      .filter((item) => item !== 0)
                  : []
              );
            }
          }
        }
      });
  }, []);
  /* end modal states */

  return (
    <Draggable draggableId={`${cardId}`} index={cardIndex}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {
            <TaskModalWindow
              visible={visible}
              closeHandle={closeHandle}
              title={card['crd_title']}
              column={columnTitle}
              dateValue={value}
              changeDeadline={onChange}
              showDeadline={showDeadline}
              setDeadlineView={changeDeadlineView}
              useDeadlineRange={isActiveRange}
              setDeadlineRange={setDeadlineRange}
              deadlineTime={deadlineTime}
              changeDeadlineTime={changeDeadlineTime}
              activeLabels={activeLabels}
              changeActiveLabels={changeActiveLabels}
              labels={labels}
              changeLabels={changeLabels}
              removeLabel={removeActiveLabel}
              checkLists={checkLists}
              changeCheckList={changeCheckList}
              cardId={cardId}
              addCheckBox={addCheckBox}
              changeCheckboxTitle={onChangeCheckboxTitle}
              removeCheckBox={removeCheckbox}
              changeProgress={changeProgress}
              removeCheckList={removeCheckList}
              removeCheckListItem={removeCheckListItem}
              checkboxes={checkboxes}
              checkedCheckboxes={checkedCheckboxes}
              setSaveDeadline={setSaveDeadline}
              colorCover={colorCover}
              pictureCover={pictureCover}
              addColorCover={addColorCover}
              addPictureCover={addPictureCover}
              removeCover={removeCover}
            />
          }

          {Number(card['crd_columnid']) === columnId && (
            <Card
              className={
                !isCardVisible() ? styles.card + ' ' + styles.hide : styles.card
              }
              onClick={openHandle}
            >
              <Card.Body>
                <div>
                  {colorCover && (
                    <div
                      className={styles.cover__color}
                      style={{ backgroundColor: colorCover }}
                    ></div>
                  )}
                  {pictureCover && (
                    <div className={styles.cover__pic}>
                      <img src={`${pictureCover}`} alt="" />
                    </div>
                  )}
                  {isEditTitleCard ? (
                    <RenderCardTitle
                      cardId={card.crd_id}
                      title={card.crd_title}
                      handleCardSave={handleCardSave}
                      handleCardClose={handleCardClose}
                    />
                  ) : (
                    <div className={'mb-3 ' + styles.title_container}>
                      <div className={styles.edit_container}>
                        <Card.Text>{card.crd_title}</Card.Text>
                        <div onClick={handleCardEdit}>
                          <i
                            className={`bi bi-pencil btn-secondary ${styles.btn_clipboard}`}
                          />
                        </div>
                      </div>
                      <div
                        className={styles.blosk_close}
                        onClick={() =>
                          handleCardDelete(
                            card.crd_id,
                            columnId,
                            card.crd_order
                          )
                        }
                      >
                        <i className={'bi bi-x-lg ' + styles.btn_close}></i>
                      </div>
                    </div>
                  )}
                </div>

                {showDeadline && (
                  <Card.Link href="#" className="p-1 btn btn-secondary">
                    <i className="bi bi-clock-fill" />
                    <span className={styles.ml}>
                      {Array.isArray(value)
                        ? moment(value[1]).format('DD MMM')
                        : moment(value).format('DD MMM')}
                    </span>
                  </Card.Link>
                )}
                <Card.Link href="#" className={`card-link ${styles.descrip}`}>
                  <i className="bi bi-justify-left btn-light" />
                </Card.Link>
                <Card.Link href="#">
                  <i className="bi bi-link-45deg btn-light" />
                </Card.Link>

                {checkboxes.length > 0 && (
                  <Card.Link href="#" draggable={false}>
                    <i className="bi bi-check2-square btn-light"></i>
                    <span className={'btn-light ' + styles.ml}>
                      {checkedCheckboxes.length}/{checkboxes.length}
                    </span>
                  </Card.Link>
                )}

                {activeLabels.length > 0 && (
                  <div className={styles.card_labels}>
                    {activeLabels.map(
                      (item) =>
                        item.status && <CardLabel key={item.id} item={item} />
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </Draggable>
  );
};

export { BoardCard };
