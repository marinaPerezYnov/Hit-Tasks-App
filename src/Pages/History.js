/* REACT */
import { useEffect, useState } from "react";

/* UTILS */
import PieChart from "./../Utils/Diagramms/percent";
import data from "./../Utils/Mocks/History/mocks";
import "./styles/history.css";

/* MUI */
import { Box } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';


export const History = () => {
  const [history, setHistory] = useState([]);
  const [date, setDate] = useState(new Date());
  // const [calendarOpen, setCalendarOpen] = useState(false);

  // Fonction pour ouvrir le calendrier
  // const handleOpenCalendar = () => {
  //   setCalendarOpen(true);
  // };

  const getHistory = () => {
    // Obtenez la date actuelle
    const currentDate = new Date(date);
    console.log("currentDate : ", currentDate);
    // Récupérez l'année et le mois
    const year = currentDate.getFullYear();
    console.log("year : ", year);
    // Les mois sont indexés à partir de 0, donc ajoutez 1 pour obtenir le mois réel
    const month = (currentDate.getMonth() + 1);
    console.log("month : ", month);
    console.log("format date : ", `${year}-${month.toString().padStart(2, '0')}`)
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

      const arrDatasets = data.data.map(item => ({
        id: parseInt(item.id),
        datasets: [{
          label: `Dataset ${item.id}`,
          data: [parseInt(item.valueTasksCompleted), 10, 10, 10, 10, 10],
          backgroundColor: [
            'red',
            'white',
            'white',
            'white',
            'white',
            'white',
          ],
          hoverOffset: 4
        }]
      }));
      return setHistory([data.data[0].date, arrDatasets]);
    })
    .catch((error) => console.log("error", error));
  };

  useEffect(() => {
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={date} 
        views={['month', 'year']} 
        value={date}
        onChange={(newDate) => {
          setDate(newDate);
          // setCalendarOpen(false); // Fermer le calendrier lors de la sélection d'une date
        }}
        // open={calendarOpen} // Utiliser l'état pour contrôler l'ouverture/fermeture du calendrier
        // onClose={() => setCalendarOpen(false)} // Fermer le calendrier lorsqu'on clique à l'extérieur
        // slots={{ day: false, month: true, year: true }}
        // renderInput={(params) => (
        //   <TextField
        //     {...params}
        //     onClick={handleOpenCalendar} // Ouvrir le calendrier lorsqu'on clique sur le champ de saisie
        //   />
        // )}
      />
      </LocalizationProvider>

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
