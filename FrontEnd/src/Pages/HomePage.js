/* REACT */
import React, { useState } from "react";

/* UTILS */
import RandomValueWeek from "../Components/randomValueWeek/randomValueWeek";
import "./styles/home.css";

export const HomePage = () => {
  return (
    <>
      <div className="containerHomePage">
        <ul className="list">
          <li className="detailObjectifs">
            Conservez toutes vos tâches et tous vos projets en un seul endroit,
            accessible depuis n'importe quel appareil connecté à Internet.
            <hr className="divider" />
          </li>
          <li className="detailObjectifs">
            Créez des listes hebdomadaires de choses à faire et fixez des
            objectifs réalisables pour chaque jour.
            <hr className="divider" />
          </li>
          <li className="detailObjectifs">
            Gardez une vue d'ensemble de vos progrès et ajustez vos priorités en
            fonction de vos besoins.
            <hr className="divider" />
          </li>
        </ul>
        <RandomValueWeek />
      </div>
    </>
  );
};
