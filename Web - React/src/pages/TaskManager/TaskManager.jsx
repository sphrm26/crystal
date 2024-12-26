import { useState } from "react";

import Navbar from "../../component/navbar/Navbar";
import Board from "../../component/Kaban/Board";

const TaskManager = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  return (
    <div>
      <Navbar>
        <button
          className="btn-task"
          onClick={() => {
            toggleOffcanvas();
          }}
        >
          Add Task
        </button>
      </Navbar>
      <Board />
    </div>
  );
};

export default TaskManager;
