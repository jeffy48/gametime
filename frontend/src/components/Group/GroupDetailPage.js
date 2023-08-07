import { getDetails } from "../../store/group";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom'

function GroupDetailPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const details = useSelector(state => state.group ? state.group.details : {});
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(getDetails(groupId));
  }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Feature coming soon");
  };

  const renderLoginButton = () => {
    if (!sessionUser) return;

    const isOrganizer = () => {
      if (sessionUser.id === details.organizerId) return true;
    };

    if (sessionUser && isOrganizer()) return;

    return (
      <form onSubmit={handleSubmit}>
        <button type="submit">Join this Group</button>
      </form>
    );
  };

  return (
    <main>
      <div>
        {"<  "}
        <NavLink exact to="/groups">
          Groups
        </NavLink>
      </div>
      <div>
        {/* background image */}
        <div>{details?.name}</div>
        <div>{details?.city}, {details?.state}</div>
        <div>{/* number of events*/} events · {details?.private ? 'Private' : 'Public'}</div>
        <div>Organized by {details?.Organizer?.firstName} {details?.Organizer?.lastName}</div>
        {renderLoginButton()}
      </div>
      <div>
        <div>Organizer</div>
        <div>{details?.Organizer?.firstName} {details?.Organizer?.lastName}</div>
        <div>What we're about</div>
        <div>{details?.about}</div>
        <div>

        </div>
      </div>

    </main>
  );
};

export default GroupDetailPage;
