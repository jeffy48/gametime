import { useDispatch, useSelector } from 'react-redux';
import { getGroupEvents } from "../../store/event.js";
import { useEffect } from "react";

function NumberOfEvents({ group }) {
  const dispatch = useDispatch();
  const eventList = useSelector(state => state.event ? state.event.events : []);

  useEffect(() => {
    dispatch(getGroupEvents(group.id))
  }, [dispatch]);

  return (
    <div className="other">{eventList.length} events · {group.private ? 'Private' : 'Public'}</div>
  );
};

export default NumberOfEvents;
