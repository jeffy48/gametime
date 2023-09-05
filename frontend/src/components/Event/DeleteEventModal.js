import { csrfFetch } from "../../store/csrf";
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  } from "../../store/group";
import { useModal } from "../../context/Modal";
import { deleteEvent } from "../../store/event";
import './DeleteEventModal.css';

function DeleteEventModal({ eventId, groupId }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { closeModal } = useModal()

  const handleDeleteClick = () => {
    dispatch(deleteEvent(eventId));
    closeModal();
    history.push(`/groups/${groupId}`)
  };

  const handleClick = () => {
    closeModal();
  };

  return (
    <div className="delete-event-modal">
      <div className="delete-event-modal__1">Confirm delete</div>
      <div className="delete-event-modal__2">Are you sure you want to remove this event?</div>
      <button onClick={handleDeleteClick} className="delete-event-modal__3">Yes (Delete Event)</button>
      <button onClick={handleClick} className="delete-event-modal__4">No (Keep Event)</button>
    </div>
  )
}

export default DeleteEventModal;
