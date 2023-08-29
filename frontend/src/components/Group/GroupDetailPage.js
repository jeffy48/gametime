import { getDetails } from "../../store/group";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import './GroupDetailPage.css';
import DeleteGroupModal from './DeleteGroupModal.js';
import OpenModalButton from "../Modal/OpenModalButton";
import './DeleteGroupModal.css';

function GroupDetailPage() {
  const history = useHistory();
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const details = useSelector(state => state.group ? state.group.details : {});
  const sessionUser = useSelector(state => state.session.user);
  console.log(details);

  useEffect(() => {
    dispatch(getDetails(groupId));
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
    <main className="group-detail-page">
      <div className="group-detail-page__back">
        {"<  "}
        <NavLink exact to="/groups">
          Groups
        </NavLink>
      </div>
      <div className="group-detail-page__card">
        <img style={{objectFit: "contain", height: "22vw", width: "50vw"}} src={details?.previewImage}/>
        <div className="group-detail-page__card__name">{details?.name}</div>
        <div className="group-detail-page__card__location">{details?.city}, {details?.state}</div>
        <div className="group-detail-page__card__numevents">
          <div className="grouppage__other"># events · {details?.type ? 'Private' : 'Public'}</div>
        </div>
        <div className="group-detail-page__card__organizer">Organized by {details?.Organizer?.firstName} {details?.Organizer?.lastName}</div>
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
      <div className="group-detail-page__bottom__container">
        <div className="group-detail-page__bottom">
          <div className="group-detail-page__bottom__orghead">Organizer</div>
          <div className="group-detail-page__bottom__organizer">{details?.Organizer?.firstName} {details?.Organizer?.lastName}</div>
          <div className="group-detail-page__bottom__abouthead">What we're about</div>
          <div className="group-detail-page__bottom__about">{details?.about}</div>
          <div className="group-detail-page__bottom__events">
            {/* Upcoming events component */}
          </div>
          <div className="group-detail-page__bottom__past-events">
            {/* Past events component */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default GroupDetailPage;
