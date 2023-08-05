import { NavLink } from "react-router-dom";
import { getGroups } from "../../store/group.js";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GroupDetailPage } from './GroupDetailPage.js';

function GroupPage() {
  const dispatch = useDispatch();
  const groupList = useSelector(state => state.group ? state.group.list : []);

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch])

  return (
    <main>
      <div>
        <div>Placeholder Events</div>
        {/* <NavLink to='/events'>Events</NavLink> */}
        <NavLink to='/groups'>Groups</NavLink>
      </div>
      <div>Groups in Meetup</div>
      <nav>
        {groupList?.map(group => {
          return (
            <NavLink key={group.id} to={`/groups/${group.id}`}>
              <div>
                <div style={{ backgroundImage: `url(${group.previewImage})`}}></div>
                <div>{group.name}</div>
                <div>{group.city}, {group.state}</div>
                <div>{group.about}</div>
                <div>{/* number of events*/} events · {group.private ? 'Private' : 'Public'}</div>
              </div>
            </NavLink>
          )
        })}
      </nav>
    </main>
  );
};

export default GroupPage;
