import React from "react";
import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css';

function Navigation({isLoaded}) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="nav-container">
        <NavLink exact to="/" className="logo">
          <img className="logo-img" src="https://www.meetup.com/mu_static/en-US/logo--script.257d0bb1.svg"/>
        </NavLink>
      {isLoaded && (
        <div className="profile">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
};

export default Navigation;
