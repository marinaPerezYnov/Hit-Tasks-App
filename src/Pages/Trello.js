import React, { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { COLUMN_NAMES } from "./../Components/trello/Constants";
// import { tasks } from "./../Components/trello/tasks";

import "./styles/trello.css";

const saveTasks = (datas) => {
    // Modifier pour enregistrer la tâche qui contient comme status COLUMN_NAMES.DONE alors enregistrer la tâche dans la table historic
    const currentDate = new Date(datas.data.date);
    const year = currentDate.getFullYear();
    // Les mois sont indexés à partir de 0, donc ajoutez 1 pour obtenir le mois réel
    const month = currentDate.getMonth() + 1;
    
    // Formattez la date au format YYYY-MM
    // const formattedDate = `${year}-${month.toString().padStart(2, '0')}`;
    const formattedDate = `${currentDate}`;
    console.log("task value : ", datas.data.taskValue);
    fetch("http://localhost:8081/addHistoric", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      },
      body: JSON.stringify({taskId: datas.data.id ,date: formattedDate, valueTasksCompleted: datas.data.taskValue, userId: sessionStorage.getItem("userId") }),
    })
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
  };

  // Fonction qui permettra d'enregistrer en base de données le nouveau status de la tâche : /updateStatusTasks
  const updateStatusTasks = (id, status) => {
    let newStatus;
    if(status === COLUMN_NAMES.DO_IT)
        newStatus = 0;
    else if(status === COLUMN_NAMES.IN_PROGRESS)
        newStatus = 1;
    else if(status === COLUMN_NAMES.AWAITING_REVIEW)
        newStatus = 2;
    else if(status === COLUMN_NAMES.DONE)
        newStatus = 3;

    fetch("http://localhost:8081/updateStatusTasks", {
     method: "PUT",
        headers: {
         "Content-Type": "application/json",
         "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify({ id: id, status: newStatus }),
    })
    .then((response) => response.json())
    .then((data) => {
        if(newStatus === 3) {
            saveTasks(data);
        }
    })
    .catch((error) => console.log("error", error));
};


const MovableItem = ({
  name,
  index,
  currentColumnName,
  moveCardHandler,
  setItems
}) => {
  const changeItemColumn = (currentItem, columnName) => {
    setItems((prevState) => {
      return prevState.map((e) => {
        if(columnName !== currentItem.currentColumnName) {
            updateStatusTasks(e.id, columnName);
        }
        return {
          ...e,
          column: e.name === currentItem.name ? columnName : e.column
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
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: "Our first type", // <-- Ajoutez cette ligne
    item: { index, name, currentColumnName },
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
      isDragging: monitor.isDragging()
    })
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
      canDrop: monitor.canDrop()
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
    }
  });

  const getBackgroundColor = () => {
    if (isOver) {
      if (canDrop) {
        return "rgb(188,251,255)";
      } else if (!canDrop) {
        return "rgb(255,188,188)";
      }
    } else {
      return "";
    }
  };

  return (
    <div
      ref={drop}
      className={className}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <p>{title}</p>
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
    fetch(`http://localhost:8081/getAllTasks/${sessionStorage.getItem("userId")}&familyKey=${sessionStorage.getItem("familyKey")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network error or server error: ' + response.status);
      }
      return response.json();
    })
    .then((data) => {
        setItems(data.data.map((item, index) => {
            if (item[0]?.status === 0) {
                return {id: item[0].id, name: item[0].name, column: DO_IT}
            } else if (item[0]?.status === 1) {
                return {id: item[0].id, name: item[0].name, column: IN_PROGRESS}
            } else if (item[0]?.status === 2) {
                return {id: item[0].id, name: item[0].name, column: AWAITING_REVIEW}
            } else if (item[0]?.status === 3) {
                return {id: item[0].id, name: item[0].name, column: DONE}
            }
        }));
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
    if(items !== undefined) {
      return items
      .filter((item) => item.column === columnName)
      .map((item, index) => (
        <MovableItem
          key={item.id}
          name={item.name}
          currentColumnName={item.column}
          setItems={setItems}
          index={index}
          moveCardHandler={moveCardHandler}
        />
      ));
    }
  };

  const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE } = COLUMN_NAMES;

  return (
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
  );
};
