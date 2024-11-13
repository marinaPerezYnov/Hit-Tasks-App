import axios from "axios";
export const getTasks = (setListTasks, navigate) => {
    // '/getAllTasks/{userId}&familyKey={familyKey}',
    axios.get(`http://localhost:8081/getAllTasks/${sessionStorage.getItem(
      "userId"
    )}&familyKey=${typeof sessionStorage.getItem("familyKey") === Number ? sessionStorage.getItem("familyKey") : null}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    })
    .then((response) => {
        response.data.data.forEach((item) => {
            item.isFinish = false;
        });
        return setListTasks(response.data.data);
    })
    .then(() => navigate("/listTasks"))
    .catch((error) => console.log("Error retrieving tasks", error));
};

export const getHistoric = (listTasks, setListTasks, year, month, setShowLoader) => {
    fetch(
        `http://localhost:8081/getAllHistoric?userId=${sessionStorage.getItem(
          "userId"
        )}&date=${year}-${month
          .toString()
          .padStart(2, "0")}&familyKey=${sessionStorage.getItem("familyKey")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      )
        .then((response) => {
          // Vérifiez le statut de la réponse
          if (!response.ok) {
            throw new Error("Erreur réseau ou serveur: " + response.status);
          }
          // Parse la réponse JSON
          return response.json();
        })
        .then((data) => {
          // fusionner dans un seul tableau les tableaux de données récupérées dans data.data
          const tableauFusionne = data.data.reduce(
            (acc, tableau) => acc.concat(tableau),
            []
          );
  
          // On va boucler sur le tableau de données et si l'id de la tâche correspnd à l'id de listTask, alors on va modifier le style de la tâche
          tableauFusionne.forEach((item) => {
            listTasks.forEach((task) => {
              if (item.taskId === task.id) {
                task.isFinish = true;
  
                return setListTasks([...listTasks]);
              }
            });
          });
          setShowLoader(false);
        })
        .catch((error) => console.log("error", error));
}

export const deleteTask = (taskId, setShowLoader, navigate, handleClose) => {
  // Fermer la pop up après le click sur oui/non
  setShowLoader(true);
  // Créé une requête qui permettra de supprimer une tâche en fonction de son id en tenant compte de la fonction ci-dessus
  fetch(`http://localhost:8081/deleteOneTasks`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify({ id: taskId }),
  })
    .then((response) => response.json())
    .then((data) => {
      getTasks();
      window.location.reload();
      navigate("/listTasks");
      setShowLoader(false);
      handleClose();
    })
    .catch((error) => console.log("error", error));
};