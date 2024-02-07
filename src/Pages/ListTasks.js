import { useEffect, useState } from "react";

export const ListTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", value: 0 });
  const addNewTask = () => {
    //TODO : Création d'une nouvelle tâche
  };

  const evoluateTask = () => {
    //TODO : Affecte à la tâche une valeur comprise entre 30 et 100
  };

  const getTasks = () => {
    //TODO : Récupération de toutes les tâches
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <h1>ListTasks</h1>

      <button onClick={addNewTask}>Add new task</button>

      <ul>
        <li>
          <p>Task 1</p>
          <button onClick={evoluateTask}>Evoluate task</button>
        </li>
        <li>
          <p>Task 2</p>
          <button onClick={evoluateTask}>Evoluate task</button>
        </li>
        <li>
          <p>Task 3</p>
          <button onClick={evoluateTask}>Evoluate task</button>
        </li>
      </ul>
    </div>
  );
};
