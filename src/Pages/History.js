/* REACT */
import { useEffect, useState } from "react";

/* UTILS */
import PieChart from "./../Utils/Diagramms/percent";
import data from "./../Utils/Mocks/History/mocks";
import "./styles/history.css";

/* DAYJS */
import dayjs from "dayjs";

/* MUI */
import { Box } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LinearBuffer from "./../Components/loader/loader";
import 'dayjs/locale/fr';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const History = () => {
  const [history, setHistory] = useState([]);
  // dayjs(date)
  const [date, setDate] = useState(dayjs());
  // const [calendarOpen, setCalendarOpen] = useState(false);
  const [week, setWeek] = useState(0);

  const [showLoader, setShowLoader] = useState(false);

  const valuesForDatasets = [
    {
      value: 0,
      week: 0
    },{
      value: 0,
      week: 0
    },{
      value: 0,
      week: 0
    },{
      value: 0,
      week: 0
    }
  ];
  // Fonction pour ouvrir le calendrier
  // const handleOpenCalendar = () => {
  //   setCalendarOpen(true);
  // };
  function getWeekNumer(data, id) {
    data.data.forEach((item) => {
      const date = new Date(item.date);
      // je récupére le jour du mois
      const day = date.getDate();
      const week = Math.ceil(day / 7);

      // Si les items sont dans la même semaine, additionnez les valeurs item.valueTasksCompleted et enregistrer la somme dans valuesForDatasets
        switch (week) {
          case 1:
            valuesForDatasets[0].week = week;
            // Si deux éléments sont dans la même semaine, additionnez les valeurs item.valueTasksCompleted et enregistrer la somme dans valuesForDatasets[0].value
            valuesForDatasets[0].value += Number(item.valueTasksCompleted);
            break 
          case 2:
            valuesForDatasets[1].week = week;
            // Si deux éléments sont dans la même semaine, additionnez les valeurs item.valueTasksCompleted et enregistrer la somme dans valuesForDatasets[1].value
            valuesForDatasets[1].value += Number(item.valueTasksCompleted);
            break 
          case 3:
            valuesForDatasets[2].week = week;
            // Si deux éléments sont dans la même semaine, additionnez les valeurs item.valueTasksCompleted et enregistrer la somme dans valuesForDatasets[2].value
            valuesForDatasets[2].value += Number(item.valueTasksCompleted);
            break 
          case 4:
            valuesForDatasets[3].week = week;
            // Si deux éléments sont dans la même semaine, additionnez les valeurs item.valueTasksCompleted et enregistrer la somme dans valuesForDatasets[3].value
            valuesForDatasets[3].value += Number(item.valueTasksCompleted);
            break;
          default:
            return 0;
        }
        // const currentWeekDataset = valuesForDatasets.find(
        //   (dataset) => dataset.week === week
        // );
    
        // if (currentWeekDataset) {
        //   currentWeekDataset.value += Number(item.valueTasksCompleted);
        // }
    });
  }
  const getHistory = () => {
    // Obtenez la date actuelle
    const currentDate = new Date(date);
    // Récupérez l'année et le mois
    const year = currentDate.getFullYear();
    // Les mois sont indexés à partir de 0, donc ajoutez 1 pour obtenir le mois réel
    const month = (currentDate.getMonth() + 1);
    fetch(`http://localhost:8081/getAllHistoric?userId=${sessionStorage.getItem("userId")}&date=${year}-${month.toString().padStart(2, '0')}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + sessionStorage.getItem("token")
      }
    })
    .then(response => {
      // Vérifiez le statut de la réponse
      if (!response.ok) {
        throw new Error('Erreur réseau ou serveur: ' + response.status);
      }
      // Parse la réponse JSON
      return response.json();
    })
    .then((data) => {
      if (data.data.length === 0) {
        return setHistory([]);
      }
      getWeekNumer(data);
      // si data.data.length est === 0, alors on doit retourner un tableau vide 
      // si data.data.length est < 4, alors on doit ajouter des objets dans data.data pour que data.data.length soit égal à 4
      if(data.data.length < 4) {
        for (let i = data.data.length; i < 4; i++) {
          data.data.push({
            id: i,
            date: `${year}-${month.toString().padStart(2, '0')}`,
            valueTasksCompleted: 0
          });
        }
      }
      // récupérer la valeur week retournée par la fonction getWeekNumer et l'associer au label de datasets
      const arrDatasets = data.data.map((item,index) => (
        {
        id: parseInt(item.id),
        datasets: [{
          label: `Dataset ${valuesForDatasets[index].week !== 0 ? valuesForDatasets[index].week : null}`,
          data: [parseInt(valuesForDatasets[index].value), 10, 10, 10, 10, 10],
          backgroundColor: [
            '#114550',
            'white',
            'white',
            'white',
            'white',
            'white',
          ],
          hoverOffset: 4
        }]
      }));
      setShowLoader(false);
      // Le tableau arrDatasets doit être composé de 4 objets, chaque objet doit contenir un tableau datasets
      // Chaque tableau datasets doit contenir un objet avec les clés label, data, backgroundColor et hoverOffset

      return setHistory([data.data[0].date, arrDatasets]);
    })
    .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    setShowLoader(true);
    getHistory();
  }, [date]);

  const styles = {
    box: {
      display: "flex",
      border: "1px solid white",
      width: "35%",
      paddingLeft: "2%",
      margin: "2% auto",
      backgroundColor: "#ffffff6b",
    },
  };
  
  const responsivStyles = {
    '@media (max-width: 600px)': {
      width: "55%",
    },
    '@media (min-width: 993px)': {
      width: "22%",
      marginLeft: "10%"
    }
  }

  return (
    <div>
      <h3 className="title">History</h3>
      <LocalizationProvider dateAdapter={AdapterDayjs} locale="fr">
      <DatePicker
        label={date.format('YYYY-MM')} 
        views={['month', 'year']} 
        defaultValue={date}
        value={date}
        onChange={(newDate) => {
          setDate(newDate);
        }}
      />
      </LocalizationProvider>
      <div>
        {showLoader && <LinearBuffer />}
      </div>
      <div className="containerBox">
        {history[1] ? 
          history[1].map((data, index) => (
            <>
              <Box key={data.id} sx={{...styles.box, ...responsivStyles}}>
                <div style={{display:"flex", flexDirection: "column"}}>
                  <h4 style={{marginBottom:"0"}}>Semaine {index +1}</h4> 
                  <p className="color">{data.datasets[0].data[0]} % effectué</p>
                </div>
                <PieChart date={history[0]} datasets={data.datasets} />
              </Box>
            </>
          ))
          : 
          <Box sx={{
            backgroundColor: "antiquewhite",
            padding: "5% 15%",
            margin: "5% auto"
          }}>
            <h4 style={{textAlign: "center"}}>No data for this month</h4>
          </Box>
        }
      </div>
    </div>
  );
};
