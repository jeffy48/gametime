import { getDetails } from "../../store/event";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom'
import './EventDetailPage.css';
import EventDetailGroupCard from "../Group/EventDetailGroupCard";

function EventDetailPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const details = useSelector(state => state.event ? state.event.details : {});
  console.log(details);
  const startDate = details?.startDate?.slice(0, 10);
  const startTime = details?.startDate?.slice(11, 16);
  const endDate = details?.endDate?.slice(0, 10);
  const endTime = details?.endDate?.slice(11, 16);

  useEffect(() => {
    dispatch(getDetails(eventId));
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
          <EventDetailGroupCard groupId={details?.Group?.id}/>
          <div className="event-detail__bottom__info">
            <div className="event-detail__bottom__info__time">
              <i style={{height: "16px", width: "16px"}} class="fa-regular fa-clock"></i>
              <div className="event-detail__bottom__info__time__container">
                <div className="event-detail__bottom__info__time__startTime">
                  START {startDate} · {startTime}
                </div>
                <div className="event-detail__bottom__info__time__endTime">
                  END {endDate} · {endTime}
                </div>
              </div>
            </div>
            <div className="event-detail__bottom__info__price">
              <i class="fa-solid fa-dollar-sign"></i>
              {details?.price}
            </div>
            <div className="event-detail__bottom__info__location">
              <i class="fa-solid fa-map-pin"></i>
              {details?.type}
            </div>
          </div>
        </div>
        <div className="event-detail-caption">Details</div>
        <div className="event-detail-details">{details?.description}</div>
      </div>
    </main>
  );
}

export default EventDetailPage;
