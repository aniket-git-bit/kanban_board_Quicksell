import React, { useState } from 'react';
import './TicketCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';


const TicketCard = ({ ticket, showUserPhoto, onTitleSelect, onUserSelect }) => {
  const [isDone, setIsDone] = useState(ticket.isDone || false);

  const handleCheckboxChange = () => {
    setIsDone(!isDone);
  };

  const handleClick = () => {
    if (onTitleSelect && typeof onTitleSelect === 'function') {
      onTitleSelect(ticket.title);
    }
    if (onUserSelect && typeof onUserSelect === 'function') {
      onUserSelect(ticket.userId);
    }
  };

  return (
    <div className="ticket-card" onClick={handleClick}>
      <div className="ticket-header">
        <span className="ticket-id">{ticket.id}</span>
        {showUserPhoto && (
          <img
            src={ticket.userPhoto}
            alt={`${ticket.userId}'s avatar`}
            className="user-photo"
          />
        )}
        <span className={`status-circle ${ticket.available ? 'available' : 'not-available'}`}></span>
      </div>

      <div className="ticket-title-wrapper">
        <input
          type="checkbox"
          checked={isDone}
          onChange={handleCheckboxChange}
          className="ticket-checkbox"
        />
        <h3 className={`ticket-title ${isDone ? 'done' : ''}`}>{ticket.title}</h3>
      </div>
      <FontAwesomeIcon icon={faExclamation} className="icon-background" />
      <span className="ticket-tag">Feature Request</span>
    </div>
  );
};

export default TicketCard;


