// Composant permettant d'utiliser Menu de MUI pour la navigation en mode mobile

import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import IconButton from '@mui/material/IconButton';

export default function HeaderMobile() {
    const [open, setOpen] = useState(false);
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
  }
  return (
    <div className='navMobile'>
        <Button   
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            sx={{backgroundColor:"white"}}
            onClick={handleClick}>
                <IconButton>
                    <MenuOpenIcon />
                </IconButton>
            </Button>

      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={open}
        open={open}
        onClose={handleClose}
        sx= {{
          width: '20ch',
          top: '102px',
        }}
        anchorOrigin={{
            vertical: 'top', // positionnement par rapport au conteneur (l'élément qui déclenche le menu)
            horizontal: 'right',
          }}
      >
        <MenuItem onClick={handleClose}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Link style={style} to="/">Home</Link>
                <Link style={style} to="/login">Login</Link>
                <Link style={style} to="/register">Register</Link>
                <Link style={style} to="/listTasks">ListTasks</Link>
                <Link style={style} to="/history">Historique</Link>
            </div>
        </MenuItem>
      </Menu>
    </div>
  );
}