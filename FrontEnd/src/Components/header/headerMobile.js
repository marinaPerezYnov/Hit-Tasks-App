// Composant permettant d'utiliser Menu de MUI pour la navigation en mode mobile

import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate } from "react-router-dom";

export default function HeaderMobile() {
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setIsAuth(true);
      return navigate("/");
    }
  }, [sessionStorage.getItem("token")]);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const style = {
    textDecoration: "none",
    color: "white",
    border: "1px solid black",
    width: "100%",
    padding: "8%",
    backgroundColor: "black",
    textAlign: "center",
    marginBottom: "2%",
  };
  return (
    <div className="navMobile">
      <Button
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        sx={{ backgroundColor: "white" }}
        onClick={handleClick}
      >
        <IconButton>
          <MenuOpenIcon />
        </IconButton>
      </Button>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={open}
        open={open}
        onClose={handleClose}
        sx={{
         top: "60px",
        }}
        anchorOrigin={{
          vertical: "top", // positionnement par rapport au conteneur (l'élément qui déclenche le menu)
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClose}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isAuth ? (
              <>
                <Link style={style} to="/">
                Accueil
                </Link>
                <Link style={style} to="/listTasks">
                  Liste de tâches
                </Link>
                <Link style={style} to="/tasksOrganisators">
                  Organisateur de temps
                </Link>
                <Link style={style} to="/accountSubscription">
                  Abonnement
                </Link>
                {sessionStorage.getItem("subscriptionKey") === "2" && (
                  <Link style={style} to="/addNewMember">
                    Ajouter un membre
                  </Link>
                )}
                <Link style={style} to="/history">
                  Historique
                </Link>
                <Link style={style} to="/logout" onClick={() => {
                  sessionStorage.clear()}}>
                  Logout
                </Link>
              </>
            ): (
              <>
                <Link style={style} to="/login">
                  Login
                </Link>
                <Link style={style} to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
