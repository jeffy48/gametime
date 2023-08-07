import { getDetails } from "../../store/event";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom'
import './EventDetailPage.css';

function EventDetailPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const details = useSelector(state => state.event ? state.event.details : {});
  console.log(details);

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
    <main>
      <div className="subheader">
        <div className="event-breadcrumb">
          {"<  "}
          <NavLink exact to="/events">
            Events
          </NavLink>
        </div>
        <div className="event-name">{details?.name}</div>
        <div className="event-host">Hosted by {"placeholder"}</div>
      </div>
      <div className="event-details">
        <div className="event-grid">
          <div className="event-detail-image">
            <img src={findPreview()}/>
          </div>
          {/* EventGroup component */}
          <div className="event-detail-box">
            <div>

            </div>
            <div>
              {/* dollar icon */}
              {details?.price}
            </div>
            <div>
              {/* map pin icon */}
              {details?.type}
            </div>
          </div>
        </div>
        <div>{details?.description}</div>
      </div>
    </main>
  );
}

export default EventDetailPage;
