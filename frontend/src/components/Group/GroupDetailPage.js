import { getDetails } from "../../store/group";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import './GroupDetailPage.css';
import DeleteGroupModal from './DeleteGroupModal.js';
import OpenModalButton from "../Modal/OpenModalButton";
import './DeleteGroupModal.css';
import { getGroupEvents } from "../../store/event";

function GroupDetailPage() {
  const history = useHistory();
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const details = useSelector(state => state.group ? state.group?.details : {});
  const sessionUser = useSelector(state => state.session?.user);
  const groupEvents = useSelector(state => state.event ? state.event?.groupEvents : []);
  const today = new Date();
  let upcomingGroupEvents = groupEvents?.filter((event) => new Date(event?.startDate) > today);
  let pastGroupEvents = groupEvents?.filter((event) => new Date(event?.startDate) < today);

  useEffect(() => {
    dispatch(getDetails(groupId));
    dispatch(getGroupEvents(groupId))
  }, [dispatch])

  const handleOnClick = () => {
    alert("Feature coming soon");
  };

  const handleClick = () => {
    history.push(`/groups/${groupId}/events/new`)
  }

  const handleUpdateClick = () => {
    history.push(`/groups/${groupId}/edit`)
  }

  const isOrganizer = () => {
    if (sessionUser?.id === details?.organizerId) return true;
  };

  const renderJoinButton = () => {
    if (!sessionUser) return false;

    if (sessionUser && isOrganizer()) return false;

    return true;
  };

  const renderButtons = () => {
    if (sessionUser && isOrganizer()) return true;
    else return false;
  };

  return (
    <div className="group-detail-page">
      <div className="group-detail-page__top">
        <div className="group-detail-page__back">
          {'< '}
          <NavLink exact to="/groups">
            Groups
          </NavLink>
        </div>
        <div className="group-detail-page__card">
          <div className="group-detail-page__card__image-container">
            <img src={details?.previewImage}/>
          </div>
          <div className="group-detail-page__card__right">
            <div className="group-detail-page__card__info-container">
              <div className="group-detail-page__card__name">{details?.name}</div>
              <div className="group-detail-page__card__location">{details?.city}, {details?.state}</div>
              <div className="group-detail-page__card__numevents">
                {details?.numEvents} events · {details?.type ? 'Private' : 'Public'}
              </div>
              <div className="group-detail-page__card__organizer">Organized by {details?.Organizer?.firstName} {details?.Organizer?.lastName}</div>
            </div>
            <div className="group-detail-page__card__button-container">
              {renderJoinButton() && (
              <button onClick={handleOnClick}>Join this group</button>
              )}
              {renderButtons() && (
              <div className="group-detail-page__card__orgbuttons">
                <button onClick={handleClick}>Create Event</button>
                <button onClick={handleUpdateClick}>Update</button>
                <OpenModalButton
                  groupId={groupId}
                  buttonText="Delete"
                  modalComponent={<DeleteGroupModal groupId={groupId}/>}
                />
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="group-detail-page__bottom__container">
        <div className="group-detail-page__bottom">
          <div className="group-detail-page__bottom__orghead">Organizer</div>
          <div className="group-detail-page__bottom__organizer">{details?.Organizer?.firstName} {details?.Organizer?.lastName}</div>
          <div className="group-detail-page__bottom__abouthead">What we're about</div>
          <div className="group-detail-page__bottom__about">{details?.about}</div>
          <div className="group-detail-page__bottom__events">
            {upcomingGroupEvents?.length > 0 && <h1>Upcoming Events ({upcomingGroupEvents?.length})</h1>}
              {upcomingGroupEvents?.map(event => {
              const localStartDateObj = new Date(event?.startDate);
              const startYear = localStartDateObj.getFullYear();
              const startMonth = localStartDateObj.getMonth() + 1;
              const startDay = localStartDateObj.getDate();
              const startHour = localStartDateObj.getHours();
              const startMin = localStartDateObj.getMinutes();
              return (
                <NavLink className="group-detail-page__events__container" key={event?.id} to={`/events/${event?.id}`}>
                  <div className="group-detail-page__events__main">
                    <div className="group-detail-page__events__image-container">
                      <img src={event?.previewImage}/>
                    </div>
                    <div className="group-detail-page__events__info-container">
                      <div className="group-detail-page__events__date">{startYear + '-' + startMonth.toString().padStart(2, '0') + '-' + startDay.toString().padStart(2, '0')} · {startHour.toString().padStart(2, '0') + ':' + startMin.toString().padStart(2, '0')}</div>
                      <div className="group-detail-page__events__name">{event?.name}</div>
                      <div className="group-detail-page__events__location">{event.Venue !== null ? event?.Venue?.city + ', ' + event?.Venue?.state : 'Online'}</div>
                    </div>
                  </div>
                  <div className="group-detail-page__events__desc">
                    {event?.description}
                  </div>
                </NavLink>
              )
              })}
            {pastGroupEvents?.length > 0 && <h1>Past Events</h1>}
            <div>
              {pastGroupEvents?.map(event => {
                const localStartDateObj = new Date(event?.startDate);
                const startYear = localStartDateObj.getFullYear();
                const startMonth = localStartDateObj.getMonth() + 1;
                const startDay = localStartDateObj.getDate();
                const startHour = localStartDateObj.getHours();
                const startMin = localStartDateObj.getMinutes();
                return (
                  <NavLink className="group-detail-page__events__container" key={event?.id} to={`/events/${event?.id}`}>
                    <div className="group-detail-page__events__main">
                      <div className="group-detail-page__events__image-container">
                        <img src={event?.previewImage}/>
                      </div>
                      <div className="group-detail-page__events__info-container">
                        <div className="group-detail-page__events__date">{startYear + '-' + startMonth.toString().padStart(2, '0') + '-' + startDay.toString().padStart(2, '0')} · {startHour.toString().padStart(2, '0') + ':' + startMin.toString().padStart(2, '0')}</div>
                        <div className="group-detail-page__events__name">{event?.name}</div>
                        <div className="group-detail-page__events__location">{event.Venue !== null ? event?.Venue?.city + ', ' + event?.Venue?.state : 'Online'}</div>
                      </div>
                    </div>
                    <div className="group-detail-page__events__desc">
                      {event?.description}
                    </div>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
