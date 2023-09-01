import { getDetails, getEventAttendees } from "../../store/event";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom'
import './EventDetailPage.css';
import OpenModalButton from "../Modal/OpenModalButton";
import DeleteEventModal from "./DeleteEventModal";

function EventDetailPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const details = useSelector(state => state.event ? state.event.details : {});
  const attendees = useSelector(state => state.event ? state.event.attendees : {});
  const sessionUser = useSelector(state => state.session.user);
  const localStartDateObj = new Date(details?.startDate);
  const startYear = localStartDateObj.getFullYear();
  const startMonth = localStartDateObj.getMonth() + 1;
  const startDay = localStartDateObj.getDate();
  const startHour = localStartDateObj.getHours();
  const startMin = localStartDateObj.getMinutes();
  const localEndDateObj = new Date(details?.endDate);
  const endYear = localEndDateObj.getFullYear();
  const endMonth = localEndDateObj.getMonth() + 1;
  const endDay = localEndDateObj.getDate();
  const endHour = localEndDateObj.getHours();
  const endMin = localEndDateObj.getMinutes();
  console.log(details?.Group) // use this data to populate group card (need image, name, and type)

  useEffect(() => {
    dispatch(getDetails(eventId));

    if (sessionUser) {
      dispatch(getEventAttendees(eventId));
    }
  }, [dispatch])

  const findPreview = () => {
    const images = details?.EventImages; // array of objects [{}.{}]
    let previews  = [];

    for (let i = 0; i < images?.length; i++) {
      if (images[i]?.preview) {
        previews.unshift(images[i]?.url);
      };
    };

    return previews[previews.length-1];
  };

  const isHost = () => {
    const attendance = attendees?.Attendees;

    for (let i = 0; i < attendance?.length; i++) {
      if (attendance[i]?.id === sessionUser?.id && attendance[i]?.Attendance?.status === 'host') {
        return true;
      }
    }
  };

  const renderButton = () => {
    if (sessionUser && isHost()) return true;
    else return false;
  };

  const handleUpdate = () => {
    alert("Feature coming soon");
  };

  return (
    <main className="event-detail">
      <div className="event-detail__head">
        <div className="event-detail__head__back">
          {"<  "}
          <NavLink exact to="/events">
            Events
          </NavLink>
        </div>
        <div className="event-detail__head__name">{details?.name}</div>
        <div className="event-detail__head__host">Hosted by {details?.Group?.name}</div>
      </div>
      <div className="event-detail__bottom">
        <div className="event-detail__bottom__container">
          <div className="event-detail__bottom__image">
            <img style={{objectFit: "contain", height: "22vw", width: "50vw"}} src={findPreview()}/>
          </div>
          {/* <EventDetailGroupCard groupId={details?.Group?.id}/> */}
          <div className="event-detail__bottom__info">
            <div className="event-detail__bottom__info__time">
              <i style={{height: "16px", width: "16px"}} className="fa-regular fa-clock"></i>
              <div className="event-detail__bottom__info__time__container">
                <div className="event-detail__bottom__info__time__startTime">
                  START {startYear + '-' + startMonth.toString().padStart(2, '0') + '-' + startDay.toString().padStart(2, '0')} · {startHour.toString().padStart(2, '0') + ':' + startMin.toString().padStart(2, '0')}
                </div>
                <div className="event-detail__bottom__info__time__endTime">
                  END {endYear + '-' + endMonth.toString().padStart(2, '0') + '-' + endDay.toString().padStart(2, '0')} · {endHour.toString().padStart(2, '0') + ':' + endMin.toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="event-detail__bottom__info__price">
              <i className="fa-solid fa-dollar-sign"></i>
              {details?.price}
            </div>
            <div className="event-detail__bottom__info__location">
              <i className="fa-solid fa-map-pin"></i>
              {details?.type}
            </div>
            {renderButton() && (
              <div className="event-detail__bottom__info__button">
               <OpenModalButton
                 eventId={eventId}
                 groupId={details?.groupId}
                 buttonText="Delete"
                 modalComponent={<DeleteEventModal eventId={eventId} groupId={details?.groupId}/>}
               />
               <button onClick={handleUpdate}>Update</button>
             </div>
            )}
          </div>
        </div>
        <div className="event-detail-caption">Details</div>
        <div className="event-detail-details">{details?.description}</div>
      </div>
    </main>
  );
}

export default EventDetailPage;
