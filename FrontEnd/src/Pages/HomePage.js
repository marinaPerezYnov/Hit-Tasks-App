/* REACT */
import React, { useState } from "react";

/* UTILS */
import RandomValueWeek from "../Components/randomValueWeek/randomValueWeek";
import "./styles/home.css";

export const HomePage = () => {
  return (
    <>
      <div className="container">
        <ul className="list">
          <li className="detailObjectifs">
            Keep all your tasks and projects in one place, accessible from any Internet-connected device.
            <hr className="divider" />
          </li>
          <li className="detailObjectifs">
            Create weekly to-do lists and set achievable goals for each day.
            <hr className="divider" />
          </li>
          <li className="detailObjectifs">
            Keep an overview of your progress and adjust your priorities according to your needs.
            <hr className="divider" />
          </li>
        </ul>
        <RandomValueWeek />
      </div>
    </>
  );
};
