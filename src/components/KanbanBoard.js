import React, { useEffect, useState, useMemo } from 'react';
import './KanbanBoard.css';
import TicketCard from './TicketCard';
import Icons from './Icons';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [usersMap, setUsersMap] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState('status');
  const [sortBy, setSortBy] = useState('priority');
  const [displayOptions, setDisplayOptions] = useState(false);
  const [setSelectedTitle] = useState(null);
  const [setSelectedUser] = useState(null);
  const [setSelectedStatus] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.tickets && data.users) {
        setTickets(data.tickets);

        const usersMap = {};
        data.users.forEach(user => {
          usersMap[user.id] = user.name;
        });
        setUsersMap(usersMap);
      } else {
        throw new Error('No tickets or users data found');
      }
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

  const priorityLabels = {
    4: { label: 'Urgent', icon: <Icons.UrgentPriorityColorIcon /> },
    3: { label: 'High', icon: <Icons.UrgentPriorityGreyIcon /> },
    2: { label: 'Medium', icon: <Icons.HighPriorityIcon /> },
    1: { label: 'Low', icon: <Icons.MediumPriorityIcon /> },
    0: { label: 'No Priority', icon: <Icons.NoPriorityIcon /> },
  };

  const statusLabels = {
    'In progress': { label: 'In Progress', icon: <Icons.InProgressIcon /> },
    'Todo': { label: 'To Do', icon: <Icons.ToDoIcon /> },
    'Backlog': { label: 'Backlog', icon: <Icons.BacklogIcon /> },
  };

  const addCard = (columnKey, priority) => {
    const title = prompt("Enter ticket title:", "New Ticket") || "New Ticket";
    const newCard = {
      id: `CARD-${Math.random().toString(36).substr(2, 9)}`, 
      title,
      status: columnKey,
      priority,
      userId: null, 
    };


    setTickets((prevTickets) => [...prevTickets, newCard]);
  };


  const groupTickets = (tickets) => {
    const grouped = {};
    tickets.forEach((ticket) => {
      const key = groupBy === 'status' ? ticket.status : usersMap[ticket.userId] || 'Unassigned'; // Handle undefined user
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(ticket);
    });
    return grouped;
  };

  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if (sortBy === 'priority') {
        return b.priority - a.priority; 
      }
      return a.title.localeCompare(b.title); 
    });
  };

  // eslint-disable-next-line
  const groupedTickets = useMemo(() => groupTickets(tickets), [tickets, groupBy]);

  const priorityGroups = {};
  tickets.forEach((ticket) => {
    const priorityKey = priorityLabels[ticket.priority];
    const priorityGroupKey = ticket.priority; 

    if (!priorityGroups[priorityGroupKey]) {
      priorityGroups[priorityGroupKey] = {
        label: priorityKey.label,
        icon: priorityKey.icon,
        tickets: [],
      };
    }
    priorityGroups[priorityGroupKey].tickets.push(ticket);
  });

  const handleTicketSelect = (ticket) => {
    setSelectedTitle(ticket.title);
    setSelectedUser(usersMap[ticket.userId]);
    setSelectedStatus(ticket.status);
  };

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
                    {group.icon}
                    <span style={{ marginLeft: '8px' }}>{group.label}</span>
                    <span className="count">{group.tickets.length}</span>
                    <button 
                      onClick={() => addCard(key, key)}
                      style={{ float: 'right' }}><Icons.AddIcon /></button>
                  </div>
                  <div className="ticket-container">
                    {sortTickets(group.tickets).map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={{ ...ticket, userId: usersMap[ticket.userId] }} 
                        showUserPhoto={groupBy !== 'user'} 
                        onTitleSelect={() => handleTicketSelect(ticket)}
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
                      {statusLabels[key]?.icon}
                      <span style={{ marginLeft: '8px' }}>{statusLabels[key]?.label || key}</span>
                      <span className="count">{group.length}</span>
                      <button 
                        onClick={() => addCard(key, 1)}
                        style={{ float: 'right' }}><Icons.AddIcon /></button>
                    </div>
                    <div className="ticket-container">
                      {sortTickets(group).map((ticket) => (
                        <TicketCard
                          key={ticket.id}
                          ticket={{ ...ticket, userId: usersMap[ticket.userId] }} 
                          showUserPhoto={groupBy !== 'user'} 
                          onTitleSelect={() => handleTicketSelect(ticket)}
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
