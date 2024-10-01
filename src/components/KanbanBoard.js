import React, { useEffect, useState } from 'react';
import './KanbanBoard.css';
import TicketCard from './TicketCard'; // Import the TicketCard component

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // Store users mapping here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState('user'); // Default grouping by user
  const [sortBy, setSortBy] = useState('priority'); // Default sorting by priority
  const [displayOptions, setDisplayOptions] = useState(false);

  // Fetch tickets and users from the provided API
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      setTickets(data.tickets);
      
      // Create a map of user IDs to names
      const usersMap = {};
      data.users.forEach(user => {
        usersMap[user.id] = user.name; // Assuming usersData has 'id' and 'name' properties
      });
      setUsersMap(usersMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGroupChange = (event) => {
    setGroupBy(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Group tickets based on selected criteria
  const groupTickets = (tickets) => {
    const grouped = {};
    tickets.forEach((ticket) => {
      const key = groupBy === 'user' ? usersMap[ticket.userId] : ticket.status; // Group by user name or status
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(ticket);
    });
    return grouped;
  };

  // Sort tickets based on selected criteria
  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if (sortBy === 'priority') {
        return b.priority - a.priority; // Descending order
      }
      return a.title.localeCompare(b.title); // Ascending order
    });
  };

  const groupedTickets = groupTickets(tickets);

  return (
    <div className="kanban-board">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="controls">
            <button onClick={() => setDisplayOptions(prev => !prev)}>
              Display
            </button>
            {displayOptions && (
              <div className="options-container">
                <div className="grouping-options">
                  <label>
                    Grouping:
                    <select onChange={handleGroupChange} value={groupBy}>
                      <option value="status">Status</option>
                      <option value="user">Users</option>
                    </select>
                  </label>
                </div>
                <div className="ordering-options">
                  <label>
                    Ordering:
                    <select onChange={handleSortChange} value={sortBy}>
                      <option value="priority">Priority</option>
                      <option value="title">Title</option>
                    </select>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="user-container">
            {Object.entries(groupedTickets).length === 0 ? (
              <p>No tickets available.</p>
            ) : (
              Object.entries(groupedTickets).map(([key, group]) => (
                <div className="user-column" key={key}>
                  <div className="user-header">{key}</div>
                  <div className="ticket-container">
                    {sortTickets(group).map((ticket) => (
                      <TicketCard key={ticket.id} ticket={{ ...ticket, userId: usersMap[ticket.userId] }} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanBoard;
