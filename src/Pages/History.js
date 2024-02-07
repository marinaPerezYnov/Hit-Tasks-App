import { useEffect, useState } from "react";

export const History = () => {
  const [history, setHistory] = useState([]);

  const getHistory = () => {
    //TODO : Récupération de l'historique
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div>
      <h1>History</h1>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            <p>{item.date}</p>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
