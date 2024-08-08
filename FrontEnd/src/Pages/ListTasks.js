/* REACT */
import React, { useEffect, useState } from "react";

/* MUI */
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearBuffer from "../Components/loader/loader";

import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

/* UTILS */
import "./styles/list.css";
import { useNavigate } from "react-router-dom";
import { Calendar } from "./Calendar";

export const ListTasks = () => {
  const [listTasks, setListTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", value: 0 });
  const [showLoader, setShowLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [addNewestTask, setAddNewTask] = useState({
    name: "",
    taskValue: 0,
    userId: sessionStorage.getItem("userId"),
    date: "",
    time: "",
  });
  const today = dayjs();

  const [currentTasks, setCurrentTasks] = useState([]);
  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  // Fonctionnalité de récupération des tâches est fonctionnelle
  const getTasks = () => {
    fetch(
      `http://localhost:8081/getAllTasks/${sessionStorage.getItem(
        "userId"
      )}&familyKey=${sessionStorage.getItem("familyKey")}`,
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
        //ajouter une propriété isFinish à chaque objets de data.data
        data.data.forEach((item) => {
          item.isFinish = false;
        });
        return setListTasks(data.data);
      })
      .catch((error) => console.log("Error retrieving tasks", error));
    return navigate("/listTasks");
  };

  //Fonctionnalité permettant d'enregistrer en base de données les pourcentages effectués des tâches
  useEffect(() => {
    getTasks();
    setShowLoader(true);
    // Obtenez la date actuelle
    const currentDate = new Date();
    // Récupérez l'année et le mois
    const year = currentDate.getFullYear();
    // Les mois sont indexés à partir de 0, donc ajoutez 1 pour obtenir le mois réel
    const month = currentDate.getMonth() + 1;

    fetch(
      `http://localhost:8081/getAllHistoric?userId=${sessionStorage.getItem(
        "userId"
      )}&date=${year}-${month
        .toString()
        .padStart(2, "0")}&familyKey=${sessionStorage.getItem("familyKey")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
      .then((response) => {
        // Vérifiez le statut de la réponse
        if (!response.ok) {
          throw new Error("Erreur réseau ou serveur: " + response.status);
        }
        // Parse la réponse JSON
        return response.json();
      })
      .then((data) => {
        // fusionner dans un seul tableau les tableaux de données récupérées dans data.data
        const tableauFusionne = data.data.reduce(
          (acc, tableau) => acc.concat(tableau),
          []
        );

        // On va boucler sur le tableau de données et si l'id de la tâche correspnd à l'id de listTask, alors on va modifier le style de la tâche
        tableauFusionne.forEach((item) => {
          listTasks.forEach((task) => {
            if (item.taskId === task.id) {
              task.isFinish = true;

              return setListTasks([...listTasks]);
            }
          });
        });
        setShowLoader(false);
      })
      .catch((error) => console.log("error", error));
  }, []);

  //Fonctonnalité de suppression de tâche est fonctionnelle
  const deleteTask = (taskId) => {
    // Fermer la pop up après le click sur oui/non
    setShowLoader(true);
    // Créé une requête qui permettra de supprimer une tâche en fonction de son id en tenant compte de la fonction ci-dessus
    fetch(`http://localhost:8081/deleteOneTasks`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({ id: taskId }),
    })
      .then((response) => response.json())
      .then((data) => {
        getTasks();
        window.location.reload();
        navigate("/listTasks");
        setShowLoader(false);
        handleClose();
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <h3 className="title">Liste de tâches</h3>
      <Calendar
        setAddNewTask={setAddNewTask}
        listTasks={listTasks}
        setCurrentTasks={setCurrentTasks}
        currentTasks={currentTasks}
      />
      <div>{showLoader && <LinearBuffer />}</div>
      <ul>
        {currentTasks.length > 0 && currentTasks !== undefined ? (
          currentTasks.map((task, index) => (
            <>
              <li key={task.id} className="button">
                <div
                  className="tasks"
                  style={{
                    // Si la tâche est terminée, alors on change la couleur de fond en rouge, sinon en bleu
                    backgroundColor: "white",
                    color: task.isFinish ? "green" : "black",
                  }}
                >
                  <p className="description">{task.name}</p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <p className="percentValueList">{task.taskValue} %</p>
                    {Number(sessionStorage.getItem("userId")) ===
                      task.userId && (
                      <>
                        <Button
                          sx={{
                            margin: "2%",
                            color: "#5d0b0b",
                            fontSize: "unset",
                          }}
                          onClick={() => {
                            handleOpen();
                          }}
                        >
                          <Tooltip title="Delete the task">
                            <DeleteForeverIcon sx={{ fontSize: "xx-large" }} />
                          </Tooltip>
                        </Button>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "50%",
                            height: "50%",
                            backgroundColor: "white !important",
                          }}
                        >
                          <Box>
                            <Button
                              sx={{
                                marginLeft: "100%",
                                marginBottom: "10%",
                                backgroundColor: "brown",
                                color: "white",
                              }}
                              onClick={handleClose}
                            >
                              X
                            </Button>
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                            >
                              Voulez vous vraiment supprimer cette tâche?
                            </Typography>
                            <Button
                              onClick={() => {
                                deleteTask(task.id);
                                handleClose();
                              }}
                            >
                              Oui
                            </Button>
                            <Button
                              onClick={() => {
                                handleClose();
                              }}
                            >
                              Non
                            </Button>
                          </Box>
                        </Modal>
                      </>
                    )}
                  </div>
                </div>
              </li>
            </>
          ))
        ) : (
          <p> No tasks</p>
        )}
      </ul>
    </div>
  );
};
