import { NavLink } from "react-router-dom";
import { getGroups } from "../../store/group.js";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GroupDetailPage } from './GroupDetailPage.js';
import { useLocation } from 'react-router-dom';
import "./GroupPage.css";
import NumberOfEvents from "../Event/NumberOfEvents.js";

function GroupPage() {
  const dispatch = useDispatch();
  const groupList = useSelector(state => state.group ? state.group.list : []);

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch])

  return (
    <main>
      <div className="list">
        <div className="headers">
          <NavLink to='/events'
            style={{color: "dark grey"}}>Events
          </NavLink>
          <NavLink to='/groups'
            style={{color: "teal", textDecoration: "underline", cursor: "default"}}>Groups
          </NavLink>
        </div>
        <div className="groups-list-caption">Groups in Meetup</div>
        {groupList?.map(group => {
          return (
            <div className="groupslist">
              <NavLink key={group.id} to={`/groups/${group.id}`}>
                <img src={group.previewImage} style={{objectFit: "contain", height: "200px", width: "400px"}}/>
                <div className="name">{group.name}</div>
                <div className="city">{group.city}, {group.state}</div>
                <div className="group-about">{group.about}</div>
                <NumberOfEvents group={group}/>
              </NavLink>
            </div>
          )
        })}
      </div>
    </main>
  );
};

export default GroupPage;
