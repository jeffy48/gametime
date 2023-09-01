import { getEvents } from "../../store/event";
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import './EventPage.css';

function EventPage() {
  const dispatch = useDispatch();
  const eventList = useSelector(state => state.event ? state.event.list : []);
  console.log(eventList)

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch])

  return (
    <main>
      <div className="event-page">
        <div className="event-page__head">
          <NavLink to='/events'
            style={{color: "teal", textDecoration: "underline", cursor: "default"}}>Events
          </NavLink>
          <NavLink to='/groups'
            style={{color: "dark grey"}}>Groups
          </NavLink>
        </div>
        <div className="event-page__caption">Events in Meetup</div>
        {eventList?.map(event => {
          const localStartDateObj = new Date(event?.startDate);
          const startYear = localStartDateObj.getFullYear();
          const startMonth = localStartDateObj.getMonth() + 1;
          const startDay = localStartDateObj.getDate();
          const startHour = localStartDateObj.getHours();
          const startMin = localStartDateObj.getMinutes();
          return (
            <div className="event-page__list">
              <NavLink key={event?.id} to={`/events/${event?.id}`}>
                <img src={event?.previewImage} style={{objectFit: "contain", height: "16vw", width: "28vw"}}/>
                <div className="event-page__list__date">{startYear + '-' + startMonth.toString().padStart(2, '0') + '-' + startDay.toString().padStart(2, '0')} · {startHour.toString().padStart(2, '0') + ':' + startMin.toString().padStart(2, '0')}</div>
                <div className="event-page__list__name">{event?.name}</div>
                <div className="event-page__list__location">{event?.Venue?.city}, {event?.Venue?.state}</div>
                <div className="event-page__list__type">{event?.type}</div>
                <div className="event-page__list__desc">{event?.description}</div>
              </NavLink>
            </div>
          )
        })}
      </div>
    </main>
  );
};

export default EventPage;
