import { getEvents } from "../../store/event";
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import './EventPage.css';

function EventPage() {
  const dispatch = useDispatch();
  const eventList = useSelector(state => state.event ? state.event.list : []);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch])

  return (
    <div className="event-page">
      <div className="event-page__head">
        <NavLink to='/events'
          style={{color: "teal", textDecoration: "underline", cursor: "default"}}>Events
        </NavLink>
        <NavLink className="event-page__head__group"to='/groups'
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
          <NavLink className="event-page__card" key={event?.id} to={`/events/${event?.id}`}>
            <div className="event-page__main">
              <div className="event-page__image-container">
                <img src={event?.previewImage}/>
              </div>
              <div className="event-page__info-container">
                <div className="event-page__date">{startYear + '-' + startMonth.toString().padStart(2, '0') + '-' + startDay.toString().padStart(2, '0')} · {startHour.toString().padStart(2, '0') + ':' + startMin.toString().padStart(2, '0')}</div>
                <div className="event-page__name">{event?.name}</div>
                <div className="event-page__location">{event.Venue !== null ? event?.Venue?.city + ', ' + event?.Venue?.state : 'Online'}</div>
              </div>
            </div>
            <div className="event-page__desc">
              {event?.description}
            </div>
          </NavLink>
        )
      })}
    </div>
  );
};

export default EventPage;
