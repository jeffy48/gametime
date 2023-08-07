import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getDetails } from '../../store/group';

function EventDetailGroupCard({groupId}) {
  const dispatch = useDispatch();
  const details = useSelector(state => state.group ? state.group.details : {});

  useEffect(() => {
    dispatch(getDetails(groupId));
  }, [dispatch])

  return (
    <div className="event-detail__groupcard__container">
      <NavLink exact to={`/groups/${groupId}`}>
        <img src />
        <div>{details?.name}</div>
        {details?.private
          ? <div>Private</div>
          : <div>Public</div>
        }
      </NavLink>
    </div>
  );
};

export default EventDetailGroupCard;
