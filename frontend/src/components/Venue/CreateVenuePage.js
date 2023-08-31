import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createVenue } from '../../store/venue';
import { useParams, useHistory } from 'react-router-dom';

function CreateVenuePage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [ address, setAddress ] = useState("");
  const [ city, setCity ] = useState("");
  const [ state, setState ] = useState("");
  const [ lat, setLat ] = useState("");
  const [ lng, setLng ] = useState("");
  const [ errors, setErrors ] = useState({});
  const { groupId } = useParams();
  // console.log(groupId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    // console.log('submitted')
    dispatch(createVenue(groupId, address, city, state, lat, lng));
    // console.log(venue);
    history.push(`/groups/${groupId}/events/new`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="create-venue-modal">
        <h1>Create a venue</h1>
        <label>
          <span>Address</span>
          <input
            type='text'
            value={address}
            placeholder='Street address'
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        {errors.address && <p className="create-venue-modal__errors">{errors.address}</p>}
        <label>
          <span>City</span>
          <input
            type='text'
            value={city}
            placeholder='City'
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        {errors.city && <p className="create-venue-modal__errors">{errors.city}</p>}
        <label>
          <span>State</span>
          <input
            type='text'
            value={state}
            placeholder='ST'
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        {errors.state && <p className="create-venue-modal__errors">{errors.state}</p>}
        <label>
          <span>Latitude</span>
          <input
            type='text'
            value={lat}
            placeholder='decimal'
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </label>
        {errors.lat && <p className="create-venue-modal__errors">{errors.lat}</p>}
        <label>
          <span>Longitude</span>
          <input
            type='text'
            value={lng}
            placeholder='decimal'
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </label>
        {errors.lng && <p className="create-venue-modal__errors">{errors.lng}</p>}
        <button disabled={!(address.length > 0) || !(city.length > 0) || !(state.length > 0) || !(lat) || !(lng)} type="submit">Create venue</button>
      </div>
    </form>
  );
};

export default CreateVenuePage;
