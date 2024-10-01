// // src/pages/BoardPage.js
// import React, { useState } from 'react';
// import KanbanBoard from '../components/KanbanBoard';

// function BoardPage() {
//   const [groupBy, setGroupBy] = useState('status');

//   return (
//     <div className="board-page">
//       <KanbanBoard groupBy={groupBy} /> {/* Pass the groupBy prop here */}
//     </div>
//   );
// }

// export default BoardPage;


import React from 'react';
import KanbanBoard from '../components/KanbanBoard';

function BoardPage() {
  return (
    <div className="board-page">
      <KanbanBoard />
    </div>
  );
}

export default BoardPage;
