import { getEvents } from "../../store/event";
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

function EventPage() {
  const dispatch = useDispatch();
  const eventList = useSelector(state => state.event ? state.event.list : []);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch])

  return (
    <main>
      <div className="list">
        <div className="headers">
          <NavLink to='/events'
            style={{color: "teal", textDecoration: "underline", cursor: "default"}}>Events
          </NavLink>
          <NavLink to='/groups'
            style={{color: "dark grey"}}>Groups
          </NavLink>
        </div>
        <div className="">Events in Meetup</div>
        {eventList?.map(event => {
          return (
            <div className="">
              <NavLink key={event.id} to={`/events/${event.id}`}>
                <img src={event.previewImage} style={{objectFit: "contain", height: "200px", width: "400px"}}/>
                <div className="">{event.startDate}</div>
                <div className="">{event.name}</div>
                <div className="">{event.city}, {event.state}</div>
                <div className="">{event.about}</div>
              </NavLink>
            </div>
          )
        })}
      </div>
    </main>
  );
};

export default EventPage;
