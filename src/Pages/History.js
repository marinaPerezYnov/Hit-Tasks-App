/* REACT */
import { useEffect, useState } from "react";

/* UTILS */
import PieChart from "./../Utils/Diagramms/percent";
import data from "./../Utils/Mocks/History/mocks";
import "./styles/history.css";
/* MUI */
import { Box } from "@mui/material";

export const History = () => {
  const [history, setHistory] = useState(data);
  console.log("history : ", history.dataset1.datasets[0].data[0]);
  const getHistory = () => {
    //TODO : Récupération de l'historique
  };

  useEffect(() => {
    getHistory();
  }, []);

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
      <div className="containerBox">
        <Box sx={{
          ...styles.box,
          ...responsivStyles
        }}>
        <p className="color">{history.dataset1.datasets[0].data[0]} % effectué</p>
        <PieChart date={history.date} datasets={history.dataset1.datasets} />
      </Box>
        <Box sx={{
          ...styles.box,
          ...responsivStyles
        }}>
          <p className="color">{history.dataset2.datasets[0].data[0]} % effectué</p>
          <PieChart date={history.date} datasets={history.dataset2.datasets} />
        </Box>
        <Box sx={{
          ...styles.box,
          ...responsivStyles
        }}>
          <p className="color">{history.dataset3.datasets[0].data[0]} % effectué</p>
          <PieChart date={history.date} datasets={history.dataset3.datasets} />
        </Box>
        <Box sx={{
          ...styles.box,
          ...responsivStyles
        }}>
          <p className="color">{history.dataset4.datasets[0].data[0]} % effectué</p>
          <PieChart date={history.date} datasets={history.dataset4.datasets} />
        </Box>
      </div>
    </div>
  );
};
