import { csrfFetch } from "../../store/csrf";
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteGroup } from "../../store/group";
import { useModal } from "../../context/Modal";

function DeleteGroupModal() {
  const history = useHistory();
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const closeModal = useModal()

  const handleDeleteClick = (e, groupId) => {
    e.preventDefault();
    dispatch(deleteGroup(groupId));
    history.push("/groups")
  };

  const handleClick = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="delete-group-modal">
      <div className="delete-group-modal__1">Confirm delete</div>
      <div className="delete-group-modal__2">Are you sure you want to remove this group?</div>
      <button onClick={handleDeleteClick} className="delete-group-modal__3">Yes (Delete Group)</button>
      <button onClick={handleClick} className="delete-group-modal__4">No (Keep Group)</button>
    </div>
  )
}

export default DeleteGroupModal;
