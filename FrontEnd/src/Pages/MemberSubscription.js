import React, { useState, useEffect } from "react";
import { Button, FormControl, TextField, Box } from "@mui/material";

export const MemberSubscription = () => {
  const [membersLists, setMembersLists] = useState([]);
  const [newMember, setNewMember] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    //getAllListMembers && deleteOneMember
    // Filtrer en fonction de familyKey enregistré dans le sessionStorage
    fetch(
      `http://localhost:8081/getAllListMembers?userId=${sessionStorage.getItem(
        "userId"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data list members : ", data);
        setMembersLists(data.data);
      })
      .catch((error) => console.log("error", error));
  }, []);
  console.log("membersLists : ", membersLists);
  function createNewMember() {
    fetch(`http://localhost:8081/createNewMember`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        userId: sessionStorage.getItem("userId"),
        familyKey: sessionStorage.getItem("familyKey"),
        email: email,
      }),
    })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log("error", error));
  }

  function deleteMember(id) {
    fetch(`http://localhost:8081/deleteOneMember`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        id: id,
        userId: sessionStorage.getItem("userId"),
        familyKey: sessionStorage.getItem("familyKey"),
        email: email,
      }),
    })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <div>
      <h2
        style={{
          fontSize: "xx-large",
        }}
      >
        MemberSubscription
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          margin: "5% 10%",
        }}
      >
        {membersLists.map((el) => (
          <ul
            style={{
              border: "1px solid black",
              backgroundColor: "white",
              padding: "10px 5%",
              width: "15%",
              borderRadius: "5px",
            }}
          >
            <li>
              {el.email}
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteMember(el.id)}
              >
                Supprimer
              </Button>
            </li>
          </ul>
        ))}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => setNewMember(true)}
            variant="contained"
            color="primary"
          >
            Ajouter un nouveau membre
          </Button>
          {newMember && (
            <FormControl
              sx={{
                marginTop: "5%",
              }}
            >
              <TextField
                id="standard-basic"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                label="Email du membre"
              />
              <Button
                onClick={createNewMember}
                variant="contained"
                color="primary"
              >
                Ajouter
              </Button>
            </FormControl>
          )}
        </Box>
      </div>
    </div>
  );
};
