

import React, { useState } from 'react';
import './TicketCard.css'; // Import the CSS file for styling

const TicketCard = ({ ticket }) => {
  const [isDone, setIsDone] = useState(ticket.isDone || false); // Maintain state for whether the ticket is marked as done

  const handleCheckboxChange = () => {
    setIsDone(!isDone); // Toggle the done state
  };

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <span className="ticket-cam">{ticket.id}</span>
        <img
          src={ticket.userPhoto} // Assuming `userPhoto` is a property of `ticket`
          alt={`${ticket.userId}'s avatar`}
          className="user-photo"
        />
        <span  className={`status-circle ${ticket.available ? 'available' : 'not-available'}`}></span>
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
      <span className="ticket-tag">Feature Request</span>
  
    </div>
  );
};

export default TicketCard;
