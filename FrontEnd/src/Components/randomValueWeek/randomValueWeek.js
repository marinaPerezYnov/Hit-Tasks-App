// Composant dédié à la génération de valeur total maximale à effectuer dans la semaine

/* REACT */
import React, { useState, useEffect } from "react";

/* UTILS */
import "../../Pages/styles/randomValueWeek.css";

export default function RandomValueWeek() {
    const [valueWeek, setValueWeek] = useState(0);
    
    const generateValue = () => {
        //TODO : Générer une valeur aléatoire comprise entre 30 et 100 qui ne peux être qu'un divisible de 10
        setValueWeek(Math.floor(Math.random() * 8 + 3) * 10);

        fetch("http://localhost:8081/addValueTasksWeek", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            },
            body: JSON.stringify({ weekValue: Math.floor(Math.random() * 8 + 3) * 10, userId: sessionStorage.getItem("userId") }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("data : ", data)
        })
        .catch((error) => console.log("error", error));
    };
    
    useEffect(() => {
        // On créée une requête qui permettra de récupérer les données de la table User en fonction de l'id de l'utilisateur
        fetch(`http://localhost:8081/userDetails/${sessionStorage.getItem("userId")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
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
            console.log("data", data);
            // Si l'utilisateur possède déjà une valeur de la semaine, on l'affiche
            if (data.valueWeek > 30) {
                setValueWeek(data.valueWeek);
            } else {
                generateValue();
            }
        })
        .catch((error) => console.log("error", error));
    }, [sessionStorage.getItem("userId")]);

    return (
        <div className="containerValue">
            <h3 className="titleValue">Value to complete of the week</h3>
            <p className="percentValue"><span className="percent">{valueWeek}</span></p>
        </div>
    );
}
