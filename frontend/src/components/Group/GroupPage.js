import { NavLink } from "react-router-dom";
import { getGroups } from "../../store/group.js";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./GroupPage.css";

function GroupPage() {
  const dispatch = useDispatch();
  const groupList = useSelector(state => state.group ? state.group.list : []);

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch])

  return (
    <div className="grouppage">
      <div className="grouppage__headers">
        <NavLink className="grouppage__headers__event"to='/events'>
          Events
        </NavLink>
        <NavLink to='/groups'
          style={{color: "teal", textDecoration: "underline", cursor: "default"}}>Groups
        </NavLink>
      </div>
      <div className="grouppage__caption">Groups in Meetup</div>
      {groupList?.map(group => {
        return (
          <NavLink className="grouppage__card" key={group.id} to={`/groups/${group.id}`}>
            <div className="grouppage__card__image-container">
              <img src={group.previewImage}/>
            </div>
            <div className="grouppage__card__info-container">
              <div className="grouppage__card__name">{group.name}</div>
              <div className="grouppage__card__city">{group.city}, {group.state}</div>
              <div className="grouppage__card__about">{group.about}</div>
              <div className="grouppage__card__other">{group.numEvents} events · {groupList?.private ? 'Private' : 'Public'}</div>
            </div>
          </NavLink>
        )
      })}
    </div>
  );
};

export default GroupPage;
