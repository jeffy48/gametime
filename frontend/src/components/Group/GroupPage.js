import { NavLink } from "react-router-dom";
import { getGroups } from "../../store/group.js";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./GroupPage.css";

function GroupPage() {
  const dispatch = useDispatch();
  const groupList = useSelector(state => state.group ? state.group.list : []);
  console.log('list:', groupList)

  useEffect(() => {
    dispatch(getGroups());
    // groupList?.map(group => {
    //   return id;
    // })
  }, [dispatch])

  return (
    <main>
      <div className="grouppage__list">
        <div className="grouppage__headers">
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
                <img src={group.previewImage} style={{objectFit: "contain", height: "16vw", width: "28vw"}}/>
                <div className="grouplist__name">{group.name}</div>
                <div className="grouplist__city">{group.city}, {group.state}</div>
                <div className="grouplist__about">{group.about}</div>
                <div className="grouplist__other">{group.numEvents} events · {groupList?.private ? 'Private' : 'Public'}</div>
              </NavLink>
            </div>
          )
        })}
      </div>
    </main>
  );
};

export default GroupPage;
