import React from "react";
import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css';

function Navigation({isLoaded}) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="navbar">
      <NavLink exact to="/" className="navbar__logo">
        <img className="navbar__logo__img" src="https://www.meetup.com/mu_static/en-US/logo--script.257d0bb1.svg"/>
      </NavLink>
      {sessionUser &&
        <NavLink exact to="/groups/new" className="navbar__new-group">Start a new group</NavLink>
      }
      {isLoaded && (
      <div className="navbar__profile">
        <ProfileButton user={sessionUser} />
      </div>
      )}
    </div>
  );
};

export default Navigation;
