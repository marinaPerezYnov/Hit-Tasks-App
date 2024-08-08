/*
Composant qui contiendra un calendrier de la bibliothèque MUI
*/
import React, { useState, useEffect } from "react";
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
import DoneIcon from "@mui/icons-material/Done";
import CreditScoreIcon from "@mui/icons-material/CreditScore";

const today = dayjs();
const twoPM = dayjs().set("hour", 14).startOf("hour");

export const Calendar = ({
  setAddNewTask,
  listTasks,
  setCurrentTasks,
  currentTasks,
}) => {
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
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: nameTask,
        taskValue: valueTask,
        userId: sessionStorage.getItem("userId"),
        date: new Date(selectedDate).toISOString(),
        time: `${selectedTime.hour()}:${selectedTime.minute()}`,
      }),
    })
      .then((response) => {
        response.json();
      })
      .catch((error) => {
        console.log("Error adding new task", error);
      });
  }

  const CustomDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const currentDay = new Date(day);
    let date;
    let isSelected = false;

    for (let i = 0; i < listTasks.length; i++) {
      for (let j = 0; j < listTasks[i].length; j++) {
        date = new Date(listTasks[i][j]?.date);
        if (
          date.getDate() === currentDay.getDate() &&
          date.getMonth() === currentDay.getMonth() &&
          date.getFullYear() === currentDay.getFullYear()
        ) {
          isSelected = true;
        }
      }
    }

    const showDetailsListForDay = () => {
      const arrOfTasks = [];
      for (let i = 0; i < listTasks.length; i++) {
        for (let j = 0; j < listTasks[i].length; j++) {
          date = new Date(listTasks[i][j]?.date);
          if (
            date.getDate() === currentDay.getDate() &&
            date.getMonth() === currentDay.getMonth() &&
            date.getFullYear() === currentDay.getFullYear()
          ) {
            arrOfTasks.push(listTasks[i][j]);
          }
        }
        // const date = new Date(listTasks[i][0]?.date);
        // if(date.getDate() === currentDay.getDate()) {
        //   console.log("liste : ", listTasks[i][0]);
        //   arrOfTasks.push(listTasks[i][0]);
        // }
      }
      console.log("arrOfTasks : ", arrOfTasks);
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
          onClick={() => {
            setCurrentTasks([]);
            showDetailsListForDay();
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
      alignItems="self-start"
      justifyContent="center"
      margin={10}
    >
      {newTask === true ? (
        <Box
          sx={{
            marginTop: "0",
            marginBottom: "10%",
            backgroundColor: "white",
            padding: "5%",
            borderRadius: "10px",
          }}
        >
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              width: "95%",
            }}
          >
            <TextField
              id="nameTask"
              sx={{
                width: "70%",
              }}
              label="Nom de la tâche"
              onChange={(e) => {
                setNameTask(e.target.value);
              }}
            />
            <TextField
              id="valueTask"
              sx={{
                width: "20%",
              }}
              label="Valeur"
              onChange={(e) => {
                setValueTask(e.target.value);
              }}
            />
          </FormControl>
          {isClosedForm ? (
            <Button
              sx={{
                backgroundColor: "black",
                color: "white",
                marginTop: "5%",
                marginLeft: "20%",
                width: "70%",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
              onClick={() => {
                document.getElementById("calendar").style.display = "flex";
                setIsClosedForm(false);
              }}
            >
              Sélectionnez une date
            </Button>
          ) : (
            <Button
              sx={{
                justifyContent: "right",
                paddingRight: "5%",
                paddingTop: "5%",
                marginLeft: "20%",
                width: "70%",
              }}
              onClick={() => {
                document.getElementById("calendar").style.display = "none";
                setIsClosedForm(true);
              }}
            >
              Fermer le calendrier
            </Button>
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
                margin: "5% auto",
                width: "auto",
                display: "none",
              }}
            >
              <Grid
                item
                sx={{
                  backgroundColor: "white",
                  padding: "0 !important",
                  boxShadow: "2px 2px 8px 0px #7a6108",
                  width: "50%",
                  minHeight: "350px",
                }}
              >
                <DateCalendar
                  defaultValue={today}
                  onChange={(newDate) => {
                    setSelectedDate(newDate);
                  }}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>
              <Grid
                item
                sx={{
                  backgroundColor: "white",
                  padding: "0 !important",
                  boxShadow: "2px 2px 8px 0px #7a6108",
                  width: "50%",
                  minHeight: "350px",
                }}
              >
                <p
                  style={{
                    fontSize: "1.2rem",
                  }}
                >
                  Sélectionnez un horaire
                </p>
                <TimeClock
                  defaultValue={twoPM}
                  onChange={(newTime) => {
                    setSelectedTime(newTime);
                  }}
                  sx={{
                    marginTop: "15%",
                    width: "100%",
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          <Button
            sx={{
              backgroundColor: "black",
              color: "white",
              marginTop: "5%",
              marginLeft: "20%",
              width: "70%",
            }}
            onClick={setATask}
          >
            Ajouter la tâche
          </Button>
        </Box>
      ) : (
        // Modifier le positionnement des blocs pour optimiser la visibilité ainsi que l'accessibilité
        // Uniformiser le visuel dans le cas où l'on souhaiterai créer une nouvelle tâche
        // Uniformiser le visuel dans le cas où l'on souhaiterai visualiser le descriptif du bloc d'explications
        // Visualiser le calendrier de recherche ainsi que le visuel des tâches rajoutées
        <Grid
          item
          sx={{
            maxWidth: "45%",
            listZtyle: "none",
            backgroundColor: "white",
            padding: "5% 2% 2% 2%",
            width: "45%",
            textAlign: "left",
            borderTopLeftRadius: "15%",
            borderBottomRightRadius: "15%",
            borderTop: "10px solid rgb(93, 11, 11)",
            borderBottom: "7px solid rgb(48 107 131)",
            fontSize: "1.2em",
          }}
        >
          <Box
            sx={{
              padding: "5%",
            }}
          >
            <h4
              style={{
                color: "rgb(93, 11, 11)",
              }}
            >
              <span>Ajoutez des éléments importants à votre calendrier</span>{" "}
              pour une meilleure visualisation de votre planning.
            </h4>
            <p>
              <CreditScoreIcon
                sx={{
                  marginRight: "5%",
                }}
              />
              Rendez-vous, événements, deadlines... tout sera centralisé au même
              endroit.
            </p>
            <ul
              style={{
                marginTop: "10%",
                textAlign: "initial",
                listStyle: "none",
                paddingLeft: "0",
              }}
            >
              <li
                style={{
                  paddingLeft: "2%",
                  marginBottom: "4%",
                  display: "flex",
                  width: "65%",
                  alignItems: "center",
                }}
              >
                <DoneIcon
                  sx={{
                    marginRight: "5%",
                  }}
                />
                Créer des tâches et les organiser par catégories
              </li>
              <hr />
              <li
                style={{
                  paddingLeft: "2%",
                  marginBottom: "4%",
                  display: "flex",
                  width: "65%",
                  alignItems: "center",
                }}
              >
                <DoneIcon
                  sx={{
                    marginRight: "5%",
                  }}
                />
                Définir des priorités et des dates d'échéance
              </li>
              <hr />
              <li
                style={{
                  paddingLeft: "2%",
                  marginBottom: "4%",
                  display: "flex",
                  width: "65%",
                  alignItems: "center",
                }}
              >
                <DoneIcon
                  sx={{
                    marginRight: "5%",
                  }}
                />
                Ajouter des notes et des rappels
              </li>
              <hr />
              <li
                style={{
                  paddingLeft: "2%",
                  marginBottom: "4%",
                  display: "flex",
                  width: "65%",
                  alignItems: "center",
                }}
              >
                <DoneIcon
                  sx={{
                    marginRight: "5%",
                  }}
                />
                Synchroniser votre calendrier avec vos autres appareils
              </li>
              <hr />
              <li
                style={{
                  paddingLeft: "2%",
                  marginBottom: "4%",
                  display: "flex",
                  width: "65%",
                  alignItems: "center",
                }}
              >
                <DoneIcon
                  sx={{
                    marginRight: "5%",
                  }}
                />
                Suivre votre avancement et votre productivité
              </li>
            </ul>
          </Box>
        </Grid>
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
            marginTop: "0",
            width: "50%",
          }}
        >
          <Grid
            item
            sx={{
              backgroundColor: "white",
              padding: "0 !important",
              boxShadow: "2px 2px 8px 0px #7a6108",
              width: "45%",
              minHeight: "350px",
            }}
          >
            <DateCalendar
              defaultValue={today}
              slots={{
                day: CustomDay,
              }}
              sx={{
                width: "100%",
              }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Grid
        item
        sx={{
          position: "fixed",
          left: "65%",
          top: "80%",
        }}
      >
        <h2>Organisez votre temps</h2>
        <Button
          onClick={() => {
            setNewTask(true);
          }}
          sx={{
            backgroundColor: "black",
            color: "white",
          }}
        >
          Créez une nouvelle tâche
        </Button>
      </Grid>
    </Grid>
  );
};
