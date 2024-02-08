// Composant dédié à la génération de valeur total maximale à effectuer dans la semaine

/* REACT */
import React, { useState, useEffect } from "react";

/* UTILS */
import "./../../Pages/styles/randomValueWeek.css";

export default function RandomValueWeek() {
    const [valueWeek, setValueWeek] = useState(0);
    
    const generateValue = () => {
        //TODO : Générer une valeur aléatoire comprise entre 30 et 100 qui ne peux être qu'un divisible de 10
        setValueWeek(Math.floor(Math.random() * 8 + 3) * 10);
    };
    
    useEffect(() => {
        generateValue();
    }, []);
    // const styles = {
    //     container: {
    //         width: "50%",
    //     },
    //     title : {
    //         color: "white",
    //         fontSize: "xx-large",
    //         textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
    //     },
    //     percentValue: {
    //         color: "white",
    //         fontSize: "2em",
    //         backgroundColor: "#5d0b0b",
    //         padding: "3%",
    //         width: "80px",
    //         height: "80px",
    //         borderRadius: "50%",
    //         margin: "5% auto",
    //     },
    //     percent: {
    //         position : "relative",
    //         top: "20px",
    //     }
    // };

    return (
        <div className="containerValue">
            <h3 className="titleValue">Value to complete of the week</h3>
            <p className="percentValue"><span className="percent">{valueWeek}</span></p>
        </div>
    );
}
