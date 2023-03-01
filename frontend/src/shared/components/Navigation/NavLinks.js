import "./NavLinks.css";

import React, { useContext } from "react";

import { AuthContext } from "./../FormElements/context/auth-context";
import Button from "../FormElements/Button";
import { NavLink } from "react-router-dom";

const NavLinks = (props) => {
  const ctx = useContext(AuthContext);

  const logoutHandler = () => {
    ctx.logout();
  };
  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/'>HOME</NavLink>
      </li>
      {ctx.isLoggedIn && (
        <li>
          <NavLink to='/u1/posters'>MY POSTERS</NavLink>
        </li>
      )}
      {ctx.isLoggedIn && (
        <li>
          <NavLink to='/posters/new'>ADD POSTER</NavLink>
        </li>
      )}
      {!ctx.isLoggedIn && (
        <li>
          <NavLink to='/auth'>LOGIN</NavLink>
        </li>
      )}
      {ctx.isLoggedIn && (
        <li>
          <Button onClick={logoutHandler}>
            LOGOUT
          </Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
