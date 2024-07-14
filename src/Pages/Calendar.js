/*
Composant qui contiendra un calendrier de la bibliothèque MUI
*/
import React, {useState, useEffect} from "react";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import { Button, FormControl } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DoneIcon from '@mui/icons-material/Done';

const today = dayjs();
const twoPM = dayjs().set("hour", 14).startOf("hour");

export const Calendar = ({setAddNewTask, listTasks, setCurrentTasks, currentTasks}) => {
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedTime, setSelectedTime] = useState(twoPM);
    const [newTask, setNewTask] = useState(false);
    const [isClosedForm, setIsClosedForm] = useState(true);
    const [nameTask, setNameTask] = useState("");
    const [valueTask, setValueTask] = useState(0);
  // Une fonctionnalité pour planifier le jour de la semaine où l'on souhaite faire une activité et sélectionner l'heure de début et l'heure de fin
  function setATask() {
    fetch("http://localhost:8081/addTasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem("token"), 
      },
      body: JSON.stringify({ 
        name: nameTask, 
        taskValue: valueTask, 
        userId: sessionStorage.getItem("userId"), 
        date: `${new Date(selectedDate)}`, 
        time: `${selectedTime.hour()}:${selectedTime.minute()}`
       }),
    })
    .then((response) => {
      response.json()
    })
    .catch((error) => {
      console.log("Error adding new task", error)
    });
  }

  const CustomDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const currentDay = new Date(day);
    let isSelected = false;

    for(let i = 0; i < listTasks.length; i++) {
      const date = new Date(listTasks[i][0]?.date);
      if(date.getDate() === currentDay.getDate()) {
        isSelected = true;
      }
    }

    const showDetailsListForDay = () => {
      const arrOfTasks = [];
      for(let i = 0; i < listTasks.length; i++) {
        const date = new Date(listTasks[i][0]?.date);
        if(date.getDate() === currentDay.getDate()) {
          arrOfTasks.push(listTasks[i][0]);
        }
      }
        setCurrentTasks(arrOfTasks);
    };

    return (
          <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={
              isSelected ? (
                <EventAvailableIcon
                  sx={{
                    fontSize: "small",
                    color: `black`,
                  }}
                  className="reserved-day"
                />
              ) : undefined
            }
          >
              <PickersDay
                {...other}
                onClick={()=>{
                  setCurrentTasks([]);
                  showDetailsListForDay()
                }}
                outsideCurrentMonth={outsideCurrentMonth}
                day={day}
              />
          </Badge>
    );
  };

  return (
    <Grid
      container
      columns={{ xs: 1, lg: 2 }}
      spacing={4}
      alignItems="center"
      justifyContent="center"
    >
        {newTask === true?(
            <Box sx={{
                marginTop: "10%",
                marginBottom: "10%",
                backgroundColor: "white",
                padding: "5%",
            }}>
                <FormControl sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "end",
                    width: "95%",
                }}>
                    <TextField id="nameTask" sx={{
                        width: "70%",
                    }} label="Nom de la tâche" onChange={(e) => {
                        setNameTask(e.target.value);
                    }} />
                    <TextField id="valueTask" sx={{
                        width: "20%",
                    }} label="Valeur" onChange={(e)=>{
                        setValueTask(e.target.value);
                    }} />
                </FormControl>
                {isClosedForm ? (
                    <Button sx={{
                        backgroundColor: "black",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "white",
                            color: "black",
                        }
                    }} onClick={()=>{
                        document.getElementById("calendar").style.display = "flex";
                        setIsClosedForm(false);
                    }}>Afficher le calendrier</Button>
                ):(
                    <Button sx={{
                        width: "100%",
                        justifyContent: "right",
                        paddingRight: "5%",
                        paddingTop: "5%",
                    }} onClick={()=>{
                        document.getElementById("calendar").style.display = "none";
                        setIsClosedForm(true);
                    }}>Cacher le calendrier</Button>
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid
                        container
                        columns={{ xs: 1, lg: 2 }}
                        spacing={4}
                        id="calendar"
                        alignItems="center"
                        justifyContent="space-evenly"
                        sx={{
                            margin: "15% auto",
                            width: "auto",
                            display: "none",
                        }}
                    >
                        <Grid item sx={{
                          backgroundColor: "white",
                          padding: "0 !important",
                          boxShadow: "2px 2px 8px 0px #7a6108",
                          width: "45%",
                          minHeight: "350px",
                        }}>
                          <DateCalendar 
                          defaultValue={today}
                          onChange={(newDate) => {
                            setSelectedDate(newDate);
                          }}
                           sx={{
                            width: "100%",
                          }} />
                        </Grid>
                        <Grid item sx={{
                          backgroundColor: "white",
                          padding: "0 !important",
                          boxShadow: "2px 2px 8px 0px #7a6108",
                          width: "45%",
                          minHeight: "350px",
                        }}>
                          <TimeClock defaultValue={twoPM}
                          onChange={(newTime) => {
                            setSelectedTime(newTime);
                          }}
                          sx={{
                              marginTop: "15%",
                              width: "100%",
                          }} />
                        </Grid>
                    </Grid>
                </LocalizationProvider>
                <Button sx={{
                    backgroundColor: "black",
                    color: "white",
                }} onClick={setATask}>Ajouter la tâche</Button>
            </Box>
        ):(
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Grid item sx={{
                    marginTop: "20%",
                    marginBottom: "20%",
                }}>
                    <h2>Organisez votre temps</h2>
                    <Button 
                    onClick={()=>{
                        setNewTask(true);
                    }}
                    sx={{
                        backgroundColor: "black",
                        color: "white",
                    }}
                    >Créez une nouvelle tâche</Button>
                </Grid>
                <Grid item sx={{
                    maxWidth: "70%",
                    backgroundColor: "black",
                    color: "bisque",
                    marginTop: "20%",
                    marginBottom: "20%",
                }}>
                    <Box sx={{
                        padding: "5%",
                    }}>
                        <h4 style={{
                            color: "darksalmon",
                        }}><span>Ajoutez des éléments importants à votre calendrier</span> pour une meilleure visualisation de votre planning. 
                        </h4>
                        <p>Rendez-vous, événements, deadlines... tout sera centralisé au même endroit.</p>
                        <ul style={{
                            marginTop: "15%",
                            textAlign: "initial",
                            listStyle: "none",
                        }}>
                            <li style={{
                                    paddingLeft: "2%",
                                    marginBottom: "2%",
                                    display: "flex",
                                    width: "65%",
                                    alignItems: "center",
                            }}>
                                <DoneIcon sx={{
                                    marginRight: "5%",
                                }} />
                                Créer des tâches et les organiser par catégories</li>
                            <li style={{
                                    paddingLeft: "2%",
                                    marginBottom: "2%",
                                    display: "flex",
                                    width: "65%",
                                    alignItems: "center",
                            }}>
                                <DoneIcon sx={{
                                    marginRight: "5%",
                                }} />
                                Définir des priorités et des dates d'échéance</li>
                            <li style={{
                                    paddingLeft: "2%",
                                    marginBottom: "2%",
                                    display: "flex",
                                    width: "65%",
                                    alignItems: "center",
                            }}>
                                <DoneIcon sx={{
                                    marginRight: "5%",
                                }} />
                                Ajouter des notes et des rappels</li>
                            <li style={{
                                    paddingLeft: "2%",
                                    marginBottom: "2%",
                                    display: "flex",
                                    width: "65%",
                                    alignItems: "center",
                            }}>
                                <DoneIcon sx={{
                                    marginRight: "5%",
                                }} />
                            Synchroniser votre calendrier avec vos autres appareils</li>
                            <li style={{
                                    paddingLeft: "2%",
                                    marginBottom: "2%",
                                    display: "flex",
                                    width: "65%",
                                    alignItems: "center",
                            }}>
                                <DoneIcon sx={{
                                    marginRight: "5%",
                                }} />
                                Suivre votre avancement et votre productivité</li>
                        </ul>
                    </Box>
                </Grid>
            </Box>
        )}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid
              container
              columns={{ xs: 1, lg: 2 }}
              spacing={4}
              id="calendarDetails"
              alignItems="center"
              justifyContent="space-evenly"
              sx={{
                  width: "33%",
              }}>
            <Grid item sx={{
              backgroundColor: "white",
              padding: "0 !important",
              boxShadow: "2px 2px 8px 0px #7a6108",
              width: "45%",
              minHeight: "350px",
            }}>
              <DateCalendar 
              defaultValue={today}
              slots={{
                day: CustomDay,
              }}
    
              sx={{
                width: "100%",
              }} />
            </Grid>
          </Grid>
        </LocalizationProvider>
    </Grid>
  );
}
