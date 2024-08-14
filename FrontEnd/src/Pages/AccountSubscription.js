import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";

export const AccountSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [familyKey, setFamilyKey] = useState(null);

  function sendFamilyKey(familyKey) {
    if (familyKey !== null) {
      fetch(`http://localhost:8081/checkFamilyKey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ familyKey: Number(familyKey) }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== "Ce code existe déjà") {
            fetch(
              `http://localhost:8081/updateSubscriptionKey/${sessionStorage.getItem(
                "userId"
              )}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                  subscriptionKey: 2,
                  familyKey: familyKey,
                }),
              }
            )
              .then((data) => {
                sessionStorage.setItem("subscriptionKey", 2);
                sessionStorage.setItem("familyKey", familyKey);
                setIsSubscribed(true);
              })
              .catch((error) => console.log("error", error));
          }
        })
        .catch((error) => console.log("error", error));
    }
  }

  function sendBuisnessKey(familyKey) {
    if (familyKey !== null) {
      fetch(`http://localhost:8081/checkFamilyKey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ familyKey: Number(familyKey) }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== "Ce code existe déjà") {
            fetch(
              `http://localhost:8081/updateSubscriptionKey/${sessionStorage.getItem(
                "userId"
              )}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                  subscriptionKey: 3,
                  familyKey: familyKey,
                }),
              }
            )
              .then((data) => {
                sessionStorage.setItem("subscriptionKey", 3);
                sessionStorage.setItem("familyKey", familyKey);
                setIsSubscribed(true);
              })
              .catch((error) => console.log("error", error));
          }
        })
        .catch((error) => console.log("error", error));
    }
  }

  // nom de chemin de route /updateSubscriptionKey $data['subscriptionKey'] $data['userId']
  function classicSubscription() {
    // fetch(`http://localhost:8081/updateSubscriptionKey/${sessionStorage.getItem("userId")}&subscriptionKey=1`, {
    //     method: "PUT",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": "Bearer " + sessionStorage.getItem("token")
    //     }
    // })
    // .then((data) => {
    //     console.log(data);
    //     setIsSubscribed(true)
    // })
    // .catch((error) => console.log("error", error));
  }

  function familySubscription() {
    // générer un nombre qui possède 6 chiffres aléatoire
    // function setFamilyKey(number) {
    // setFamilyKey(number);
    // }
    const randomNumber = Math.floor(Math.random() * 1000000);

    console.log(randomNumber.toString().padStart(6, "0"));
    // setFamilyKey(randomNumber.toString().padStart(6, '0'));
    sendFamilyKey(randomNumber.toString().padStart(6, "0"));
  }

  function buisnessSubscription() {
    const randomNumber = Math.floor(Math.random() * 1000000);

    console.log(randomNumber.toString().padStart(6, "0"));
    // setFamilyKey(randomNumber.toString().padStart(6, '0'));
    sendBuisnessKey(randomNumber.toString().padStart(6, "0"));
  }

  function ChangeSuscribeType() {
    return setIsSubscribed(false);
  }
  const styles = {
    BlocsToSubscribe: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      margin: "2%",
      flexWrap: "wrap",
    },
    Blocs: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: "2%",
      backgroundColor: "white",
      padding: "5%",
      width: "330px",
      borderRadius: "10px",
    },
    Button: {
      backgroundColor: "black",
      color: "wheat",
      fontSize: "unset",
      "&:hover": {
        backgroundColor: "rgb(25 118 210)!important",
        color: "white",
      },
    },
  };
  return (
    <>
      <Box>
        {isSubscribed && (
          <Button onClick={ChangeSuscribeType}>
            Would you like change your surscribe ?
          </Button>
        )}
        {!isSubscribed && (
          <>
            <h2
              style={{
                color: "white",
                fontSize: "xxx-large",
                textTransform: "uppercase",
                textShadow: "3px 1px 2px rgba(0, 0, 0, 0.5)",
              }}
            >
              Choix d'abonnements disponibles
            </h2>
            <Box sx={styles.BlocsToSubscribe}>
              <Box sx={styles.Blocs}>
                <h3
                  style={{
                    fontSize: "x-large",
                  }}
                >
                  Forfait Classic
                </h3>
                <p
                  style={{
                    fontSize: "1.2rem",
                  }}
                >
                  Pour 4,99€/Mois{" "}
                  <hr
                    style={{
                      margin: "5%",
                    }}
                  />{" "}
                  Vous aurez accès à toutes les fonctionnalités pour un compte
                  individuel
                </p>
                <Button sx={styles.Button} onClick={classicSubscription}>
                  Subscribe
                </Button>
              </Box>
              <Box sx={styles.Blocs}>
                <h3
                  style={{
                    fontSize: "x-large",
                  }}
                >
                  Forfait Familial
                </h3>
                <p
                  style={{
                    fontSize: "1.2rem",
                  }}
                >
                  Pour 6,99€/Mois{" "}
                  <hr
                    style={{
                      margin: "5%",
                    }}
                  />{" "}
                  Vous aurez accès à toutes les fonctionnalités synchronisées
                  pour un groupe allant jusqu'à 5 personnes
                </p>
                <Button sx={styles.Button} onClick={familySubscription}>
                  Subscribe
                </Button>
              </Box>
              <Box sx={styles.Blocs}>
                <h3
                  style={{
                    fontSize: "x-large",
                  }}
                >
                  Forfait Entreprise
                </h3>
                <p
                  style={{
                    fontSize: "1.2rem",
                  }}
                >
                  Pour 6,99€/Mois{" "}
                  <hr
                    style={{
                      margin: "5%",
                    }}
                  />{" "}
                  Vous aurez accès à toutes les fonctionnalités synchronisées
                  pour un groupe allant jusqu'à 5 personnes
                </p>
                <Button sx={styles.Button} onClick={buisnessSubscription}>
                  Subscribe
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};
