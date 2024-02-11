/* REACT */
import { useEffect, useState } from "react";

/* MUI */
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

/* UTILS */
import "./styles/list.css";

export const ListTasks = () => {
  const [listTasks, setListTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", value: 0 });
  
  // Fonctionnalité d'ajout de tâche et de pourcentage est fonctionnelle 
  const addNewTask = () => {
    console.log(JSON.stringify({ name: newTask.name, taskValue: newTask.value, userId: sessionStorage.getItem("userId") }))
    fetch("http://localhost:8081/addTasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      },
      body: JSON.stringify({ name: newTask.name, taskValue: newTask.value, userId: sessionStorage.getItem("userId") }),
    })
    .then((response) => response.json())
    .then((data) => {
      getTasks(); // Actualiser la liste des tâches après l'ajout
    })
    .catch((error) => console.log("Error adding new task", error));
  };

  // Fonctionnalité de récupération des tâches est fonctionnelle
  const getTasks = () => {
    fetch(`http://localhost:8081/getAllTasks/${sessionStorage.getItem("userId")}`, {
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
      return setListTasks(data.data);
    })
    .catch((error) => console.log("Error retrieving tasks", error));
  };

  //Fonctionnalité permettant d'enregistrer en base de données les pourcentages effectués des tâches
  const saveTasks = ({task}) => {

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    // Les mois sont indexés à partir de 0, donc ajoutez 1 pour obtenir le mois réel
    const month = currentDate.getMonth() + 1;
    
    // Formattez la date au format YYYY-MM
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}`;

    const valueTasksCompleted = task.taskValue;

    fetch("http://localhost:8081/addHistoric", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      },
      body: JSON.stringify({ date: formattedDate, valueTasksCompleted: valueTasksCompleted, userId: sessionStorage.getItem("userId") }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("data : ", data);
    })
    .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getTasks();
  }, []);

  //Fonctonnalité de suppression de tâche est fonctionnelle
  const deleteTask = (taskId) => {
    // Créé une requête qui permettra de supprimer une tâche en fonction de son id en tenant compte de la fonction ci-dessus
    fetch(`http://localhost:8081/deleteOneTasks`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + sessionStorage.getItem("token")
      },
      body: JSON.stringify({ id: taskId }),
    })
    .then((response) => response.json())
    .then((data) => {
      getTasks(); // Actualiser la liste des tâches après la suppression
    })
    .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <h3 className="title">ListTasks</h3>
      <div className="formToAddTask">
        <div style={{width:"40%"}}>
          <TextField id="outlined-basic" sx={{width: "80%"}} type="text" label="Task" variant="outlined" onChange={(e) => {return setNewTask({ ...newTask, name: e.target.value })}} />
          <TextField id="outlined-basic" sx={{width: "20%"}} type="number" label="Percent" variant="outlined" onChange={(e) => {return setNewTask({ ...newTask, value: e.target.value })}} />
        </div>
        <Button sx={{
          margin: "2%",
          backgroundColor: "#5d0b0b",
          color: "white",
          fontSize: "unset", width: "40%" }} onClick={addNewTask}>
          Add new task
        </Button>
      </div>
      <ul>
        {listTasks.map((task) => (
          <li key={task.id} className="button">
            <div className="tasks">
              <p className="description">{task.name}</p>
              <div style={{
                    display: "flex",
                    alignItems: "center",
              }}>
                <p className="percentValueList">{task.taskValue} %</p>
                <Button 
                  sx={{
                    margin: "2%",
                    color: "#5d0b0b",
                    fontSize: "unset" }} 
                onClick={() => deleteTask(task.id)}><DeleteForeverIcon sx={{fontSize: "xx-large"}}/></Button>
                <Button 
                  sx={{
                    margin: "2%",
                    color: "#5d0b0b",
                    fontSize: "unset" }}
                onClick={() => saveTasks({task})}><TaskAltIcon sx={{fontSize: "xx-large"}}/></Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
