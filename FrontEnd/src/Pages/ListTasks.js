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
import  {getHistoric}  from "../Utils/Requests/Tasks/tasksRequests";
import  {getTasks}  from "../Utils/Requests/Tasks/tasksRequests";
import  {deleteTask}  from "../Utils/Requests/Tasks/tasksRequests";

export const ListTasks = () => {
  // Liste des tâches
  const [listTasks, setListTasks] = useState([]);

  //Correspond au loader de la page
  const [showLoader, setShowLoader] = useState(false);

  //Ouvre la modal
  const [open, setOpen] = useState(false);

  //Ajout d'une nouvelle tâche
  const [addNewestTask, setAddNewTask] = useState({
    name: "",
    userId: sessionStorage.getItem("userId"),
    date: "",
    time: "",
  });

  //Fonctionnalité de création de tâche est fonctionnelle
  const [currentTasks, setCurrentTasks] = useState([]);
  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const navigate = useNavigate();
  const [haveTask, setHaveTask] = useState(false);

  const today = dayjs();
  const twoPM = dayjs().set("hour", 14).startOf("hour");

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(twoPM);

  useEffect(() => {

    if(currentTasks.length > 0 && currentTasks !== undefined) {
      setHaveTask(true);
    } else {
      setHaveTask(false);
    }
  }, [currentTasks]);
  
  // Obtenez la date actuelle
  const currentDate = new Date();
  // Récupérez l'année et le mois
  const year = currentDate.getFullYear();
  // Les mois sont indexés à partir de 0, donc ajoutez 1 pour obtenir le mois réel
  const month = currentDate.getMonth() + 1;

  //Fonctionnalité permettant d'enregistrer en base de données les pourcentages effectués des tâches
  useEffect(() => {
    getHistoric(listTasks, setListTasks, year, month, setShowLoader);
    getTasks(setListTasks, navigate);
    setShowLoader(true);
  }, [addNewestTask]);

  useEffect(() => {
    getTasks(setListTasks, navigate);
    setShowLoader(true);
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    console.log("currentTasks : ", currentTasks);
  }, [currentTasks]);

  return (
    <div>
      <h3 className="title">Liste de tâches</h3>
      <div style={{
        display: "flex",
        flexDirection: "row-reverse",
        width: "100%",
        height: "100%",
        padding: "2%",
        flexWrap: "wrap",
      }}>
        <Calendar
          setAddNewTask={setAddNewTask}
          listTasks={listTasks}
          setCurrentTasks={setCurrentTasks}
          currentTasks={currentTasks}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          haveTask={haveTask}
        />
        <ul 
          style={{
            border: haveTask ? "3px solid #ab7f40" : "inherit",
            backgroundColor: haveTask ? "white" : "inherit",
            width: haveTask ? "45%": "inherit",
          }}
        >
          {currentTasks.length > 0 && currentTasks !== undefined && (
            currentTasks.map((task, index) => (
                <li key={task.id} className="buttonTask">
                  <div
                    className="tasks"
                    style={{
                      // Si la tâche est terminée, alors on change la couleur de fond en rouge, sinon en bleu
                      backgroundColor: "white",
                      color: task.isFinish ? "green" : "black",
                    }}
                  >
                    <p className="description">{task.name} - {task.date}</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
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
                                  deleteTask(task.id, setShowLoader, navigate, handleClose)
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
            ))
          ) 
          // : (
          //   <p> No tasks</p>
          // )
          }
        </ul>
      </div>
      <div>{showLoader && <LinearBuffer />}</div>
    </div>
  );
};
