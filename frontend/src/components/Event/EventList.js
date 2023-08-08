import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';


function EventList() {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(groupId)
    dispatch(getGroupEvents(groupId))
  }, [dispatch])

  return (
    <div className='group-event-list'>
      <h1>Upcoming Events {("#")}</h1>
      <div className="group-event-list__container">
        <div>
        </div>
      </div>
    </div>
  );
}

export default EventList;
