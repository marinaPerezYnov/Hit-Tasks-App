import React, { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { COLUMN_NAMES } from "../Components/trello/Constants";
// import { tasks } from "./../Components/trello/tasks";

import "./styles/trello.css";
import { Grid } from "@mui/material";
import { Switch } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { FormGroup } from "@mui/material";

const saveTasks = (datas) => {
  // Modifier pour enregistrer la tâche qui contient comme status COLUMN_NAMES.DONE alors enregistrer la tâche dans la table historic
  const currentDate = new Date(datas.data.date);
  const year = currentDate.getFullYear();
  // Les mois sont indexés à partir de 0, donc ajoutez 1 pour obtenir le mois réel
  const month = currentDate.getMonth() + 1;

  // Formattez la date au format YYYY-MM
  // const formattedDate = `${year}-${month.toString().padStart(2, '0')}`;
  const formattedDate = `${currentDate}`;

  fetch("http://localhost:8081/addHistoric", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify({
      taskId: datas.data.id,
      date: new Date(currentDate).toISOString(),
      userId: sessionStorage.getItem("userId"),
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};

// Fonction qui permettra d'enregistrer en base de données le nouveau status de la tâche : /updateStatusTasks
const updateStatusTasks = (id, status) => {
  let newStatus;
  if (status === COLUMN_NAMES.DO_IT) newStatus = 0;
  else if (status === COLUMN_NAMES.IN_PROGRESS) newStatus = 1;
  else if (status === COLUMN_NAMES.AWAITING_REVIEW) newStatus = 2;
  else if (status === COLUMN_NAMES.DONE) newStatus = 3;

  fetch("http://localhost:8081/updateStatusTasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify({ id: id, status: newStatus }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (newStatus === 3) {
        saveTasks(data);
      }
    })
    .catch((error) => console.log("error", error));
};

const MovableItem = ({
  name,
  index,
  id,
  currentColumnName,
  moveCardHandler,
  setItems,
}) => {
  const changeItemColumn = (currentItem, columnName) => {
    setItems((prevState) => {
      return prevState.map((e) => {
        if (
          columnName !== currentItem.currentColumnName &&
          e.id === currentItem.id
        ) {
          updateStatusTasks(e.id, columnName);
        }
        return {
          ...e,
          column: e.name === currentItem.name && e.id === currentItem.id ? columnName : e.column,
        };
      });
    });
  };

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "Our first type",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCardHandler(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "Our first type", // <-- Ajoutez cette ligne
    item: { index, name, currentColumnName, id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (dropResult) {
        const { name } = dropResult;
        const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE } = COLUMN_NAMES;
        switch (name) {
          case IN_PROGRESS:
            changeItemColumn(item, IN_PROGRESS);
            break;
          case AWAITING_REVIEW:
            changeItemColumn(item, AWAITING_REVIEW);
            break;
          case DONE:
            changeItemColumn(item, DONE);
            break;
          case DO_IT:
            changeItemColumn(item, DO_IT);
            break;
          default:
            break;
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  drag(drop(ref));

  return (
    <div ref={ref} className="movable-item" style={{ opacity }}>
      {name}
    </div>
  );
};

const Column = ({ children, className, title }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "Our first type",
    drop: () => ({ name: title }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    // Override monitor.canDrop() function
    canDrop: (item) => {
      const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE } = COLUMN_NAMES;
      const { currentColumnName } = item;
      return (
        currentColumnName === title ||
        (currentColumnName === DO_IT && title === IN_PROGRESS) ||
        (currentColumnName === IN_PROGRESS &&
          (title === DO_IT || title === AWAITING_REVIEW)) ||
        (currentColumnName === AWAITING_REVIEW &&
          (title === IN_PROGRESS || title === DONE)) ||
        (currentColumnName === DONE && title === AWAITING_REVIEW)
      );
    },
  });

  return (
    <div
      ref={drop}
      className={className}
      style={{
        minHeight: "120px",
        maxWidth: "20%",
        backgroundColor: "#282c34eb",
        color: "black",
        border: "0",
      }}
    >
      <p
        style={{
          color: "white",
          fontSize: "1.5rem",
          margin: "5% auto",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
};

export const Trello = () => {
  // Modifier le contenu de const items, setItems pour récupérer les tâches qui se trouvent dans la base de données
  // Modifier la table de Tasks pour y rajouter une valeur entre 0 et 3 pour définir l'emplacement de la tâche et la postionnée dans la bonne colonne

  const [items, setItems] = useState([]);

  useEffect(() => {
    // requête pour récupérer les tâches
    fetch(
      `http://localhost:8081/getAllTasks/${sessionStorage.getItem(
        "userId"
      )}&familyKey=${sessionStorage.getItem("familyKey")?sessionStorage.getItem("familyKey"):null}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error or server error: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        data.data.map(element => {
            if (element.status === 0) {
              setItems((prevState) => {
                return [...prevState.concat({ id: element.id, userId: element.userId, name: element.name, column: DO_IT })];
              });
            } else if (element.status === 1) {
              setItems((prevState) => {
                return [...prevState.concat({ id: element.id, userId: element.userId, name: element.name, column: IN_PROGRESS })];
              });
            } else if (element.status === 2) {
              setItems((prevState) => {
                return [...prevState.concat({ id: element.id, userId: element.userId, name: element.name, column: AWAITING_REVIEW })];
              });
            } else if (element.status === 3) {
              setItems((prevState) => {
                return [...prevState.concat({ id: element.id, userId: element.userId, name: element.name, column: DONE })];
              });
            }
        });
      })
      .catch((error) => console.log("Error retrieving tasks", error));
  }, []);

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];
    if (dragItem) {
      setItems((prevState) => {
        const coppiedStateArray = [...prevState];

        // remove item by "hoverIndex" and put "dragItem" instead
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);
        // remove item by "dragIndex" and put "prevItem" instead
        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);
        return coppiedStateArray;
      });
    }
  };

  const returnItemsForColumn = (columnName) => {
    if (items !== undefined) {
      return items
        .filter((item) => item.column === columnName)
        .map((item, index) => (
          <MovableItem
            key={item.id}
            name={item.name}
            id={item.id}
            currentColumnName={item.column}
            setItems={setItems}
            index={index}
            moveCardHandler={moveCardHandler}
          />
        ));
    }
  };

  const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE } = COLUMN_NAMES;
  useEffect(() => {
    console.log("liste items :", items);
  }, [items]);
  const handleStatusChange = (event, index) => {
    const updatedItems = [...items];
    if(updatedItems[index].column === DONE)
      return;
    updatedItems[index].column = event.target.value;
    setItems(updatedItems);
  };
  useEffect(() => {
  console.log("items", items);
  }, [items]);
  return (
    <div
      styles={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontSize: "xxx-large",
          color: "white",
          textTransform: "uppercase",
          textShadow: "3px 1px 2px rgba(0, 0, 0, 0.5)",
        }}
      >
        Organisateur de temps
      </h2>
      {sessionStorage.getItem("subscriptionKey") && sessionStorage.getItem("subscriptionKey") === "3" ? 
      (
        <>
        <div className="containerMobile">
              <div className="checkboxes" style={{
                width: "80%",
              }}>
                { items !== undefined ? 
                  items.map((item, index) => (
                    <Grid sx={{
                      border: "2px solid white",
                      padding: "0 5%",
                      margin: "5% auto",
                      backgroundColor: "#282c34",
                      color: "white",
                    }}>
                      <p key={item.id} style={{
                        color: "white",
                        fontSize: "1.5rem",
                        margin: "5% auto",
                        textAlign: "left",
                      }}>{item.name}</p>
                      <Grid sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignContent: "start",
                        alignItems: "baseline",
                        margin: "2%",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}>
                          <input 
                            type="checkbox" 
                            id="do-it" 
                            name="do-it" 
                            value={DO_IT}
                            checked={item.column === DO_IT}
                            onChange={(e) => handleStatusChange(e, index)}
                          />
                          <label htmlFor="do-it" style={{
                            marginLeft: "2%",
                          }}>{DO_IT}</label>
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}>
                          <input
                            type="checkbox"
                            id="in-progress"
                            name="in-progress"
                            value={IN_PROGRESS}
                            checked={item.column === IN_PROGRESS}
                            onChange={(e) => handleStatusChange(e, index)}
                          />
                          <label htmlFor="in-progress" style={{
                            marginLeft: "2%",
                          }}>{IN_PROGRESS}</label>
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}>
                          <input
                            type="checkbox"
                            id="awaiting-review"
                            name="awaiting-review"
                            value={AWAITING_REVIEW}
                            checked={item.column === AWAITING_REVIEW}
                            onChange={(e) => handleStatusChange(e, index)}
                          />
                          <label htmlFor="awaiting-review" style={{
                            marginLeft: "2%",
                          }}>{AWAITING_REVIEW}</label>
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}>
                          <input 
                            type="checkbox" 
                            id="done" 
                            name="done" 
                            value={DONE} 
                            checked={item.column === DONE} 
                            onChange={(e) => handleStatusChange(e, index)}
                          />
                          <label htmlFor="done" style={{
                            marginLeft: "2%",
                          }}>{DONE}</label>
                        </div>
                      </Grid>
                    </Grid>
                  ))
                  :
                  null
                }
              </div>
            </div>
            <div className="container">
              <DndProvider backend={HTML5Backend}>
                <Column title={DO_IT} className="column do-it-column">
                  {returnItemsForColumn(DO_IT)}
                </Column>
                <Column title={IN_PROGRESS} className="column in-progress-column">
                  {returnItemsForColumn(IN_PROGRESS)}
                </Column>
                <Column
                  title={AWAITING_REVIEW}
                  className="column awaiting-review-column"
                >
                  {returnItemsForColumn(AWAITING_REVIEW)}
                </Column>
                <Column title={DONE} className="column done-column">
                  {returnItemsForColumn(DONE)}
                </Column>
              </DndProvider>
            </div>
        </>
      ):
        <>
        {/* intégrer une méthode switch "à faire" à terminé pour chacune des tâche */}
        {items.map((item, index) => (
          item.column !== "Terminée" &&
            <>
            <FormGroup sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "0 30%",
              alignItems: "center",
              textAlign: "right",
              backgroundColor: "white",
              padding: "5px 30px",
            }}>
              <label>{item.name}</label>
              <FormControlLabel required control={<Switch />} label="Terminé" />
            </FormGroup>
          </>
        ))}
        </>
      }

    </div>
  );
};
