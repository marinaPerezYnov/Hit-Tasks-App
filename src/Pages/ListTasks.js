/* REACT */
import { useEffect, useState } from "react";

/* MUI */
import { Button } from "@mui/material";

/* UTILS */
import { tasks } from "./../Utils/Mocks/Tasks/mocks"
import "./styles/list.css";
export const ListTasks = () => {
  const [listTasks, setListTasks] = useState(tasks);
  const [newTask, setNewTask] = useState({ name: "", value: 0 });

  const addNewTask = () => {
    //TODO : Création d'une nouvelle tâche
  };

  const evoluateTask = () => {
    //TODO : Affecte à la tâche une valeur comprise entre 30 et 100
  };

  const getTasks = () => {
    //TODO : Récupération de toutes les tâches
  };

  useEffect(() => {
    getTasks();
  }, []);

  const ButtonEvoluate = (task) => {
    return (
      <Button sx={{
        margin: "2%",
        backgroundColor: "black",
        color: "wheat",
        fontSize: "unset"
      }} onClick={evoluateTask}>
        Evoluate task
      </Button>
    );
  };
  return (
    <div>
      <h3 className="title">ListTasks</h3>

      <Button sx={{
            margin: "2%",
            backgroundColor: "#5d0b0b",
            color: "white",
            fontSize: "unset", width: "40%" }} onClick={addNewTask}>Add new task</Button>
      <ul>
        {listTasks.map((task) => (
          <li key={task.id} className="button">
            <div className="tasks">
              <p className="description">{task.description}</p>
              <p className="percentValueList">{task.value} %</p>
            </div>
            <ButtonEvoluate />
          </li>
        ))}
      </ul>
    </div>
  );
};
