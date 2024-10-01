import React, { useEffect, useState } from 'react';
import './KanbanBoard.css';
import TicketCard from './TicketCard'; // Import the TicketCard component
import Icons from './Icons'; // Import the Icons

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // Store users mapping here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState('user'); // Default grouping by user
  const [sortBy, setSortBy] = useState('priority'); // Default sorting by priority
  const [displayOptions, setDisplayOptions] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null); // State for selected ticket title
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user

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

  // Map priority levels to labels and icons
  const priorityLabels = {
    4: { label: 'Urgent', icon: <Icons.UrgentPriorityColorIcon /> },
    3: { label: 'High', icon: <Icons.UrgentPriorityGreyIcon /> },
    2: { label: 'Medium', icon: <Icons.HighPriorityIcon /> },
    1: { label: 'Low', icon: <Icons.MediumPriorityIcon /> },
    0: { label: 'No Priority', icon: <Icons.NoPriorityIcon /> },
  };

  // Group tickets based on selected criteria
  const groupTickets = (tickets) => {
    const grouped = {};
    tickets.forEach((ticket) => {
      const key = groupBy === 'status' ? ticket.status : usersMap[ticket.userId]; // Group by status or user name
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
        return b.priority - a.priority; // Descending order by priority
      }
      return a.title.localeCompare(b.title); // Ascending order by title
    });
  };

  const groupedTickets = groupTickets(tickets);

  // Prepare for displaying tickets in priority groups when ordering by priority
  const priorityGroups = {};
  tickets.forEach((ticket) => {
    const priorityKey = priorityLabels[ticket.priority]; // Get both icon and label for the priority
    const priorityGroupKey = ticket.priority; // Store the numeric priority for correct grouping

    if (!priorityGroups[priorityGroupKey]) {
      priorityGroups[priorityGroupKey] = {
        label: priorityKey.label,
        icon: priorityKey.icon,
        tickets: []
      };
    }
    priorityGroups[priorityGroupKey].tickets.push(ticket);
  });

  return (
    <div className="kanban-board">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="controls">
            <button onClick={() => setDisplayOptions(prev => !prev)}>
              <Icons.DisplayIcon /> Display
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
            {sortBy === 'priority' ? (
              Object.entries(priorityGroups).map(([key, group]) => (
                <div className="user-column" key={key}>
                  <div className="user-header">
                    {/* Render both the icon and label */}
                    {group.icon}
                    <span>{group.label}</span>
                    <span className="count">{group.tickets.length}</span>
                  </div>
                  <div className="ticket-container">
                    {sortTickets(group.tickets).map((ticket) => (
                      <TicketCard 
                        key={ticket.id} 
                        ticket={{ ...ticket, userId: usersMap[ticket.userId] }} 
                        showUserPhoto={groupBy !== 'user'} 
                        onTitleSelect={setSelectedTitle} 
                        onUserSelect={setSelectedUser} 
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              Object.entries(groupedTickets).length === 0 ? (
                <p>No tickets available.</p>
              ) : (
                Object.entries(groupedTickets).map(([key, group]) => (
                  <div className="user-column" key={key}>
                    <div className="user-header">
                      <span>{key}</span>
                      <span className="count">{group.length}</span>
                    </div>
                    <div className="ticket-container">
                      {sortTickets(group).map((ticket) => (
                        <TicketCard 
                          key={ticket.id} 
                          ticket={{ ...ticket, userId: usersMap[ticket.userId] }} 
                          showUserPhoto={groupBy !== 'user'} 
                          onTitleSelect={setSelectedTitle} 
                          onUserSelect={setSelectedUser} 
                        />
                      ))}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanBoard;
