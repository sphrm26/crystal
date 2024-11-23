import { useState, useEffect } from "react";
import "./Sidebar.css";
import moment from "moment";

const Sidebar = ({
  show,
  onHide,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  selectedEvent,
  selectedDate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
      setStartTime(
        selectedEvent.start ? moment(selectedEvent.start).format("HH:mm") : ""
      );
      setEndTime(
        selectedEvent.end ? moment(selectedEvent.end).format("HH:mm") : ""
      );
    } else if (selectedEvent) {
      setTitle(selectedEvent.title || "");
      setDate(selectedEvent.start || "");
      setStartTime(
        selectedEvent.start ? moment(selectedEvent.start).format("HH:mm") : ""
      );
      setEndTime(
        selectedEvent.end ? moment(selectedEvent.end).format("HH:mm") : ""
      );
    } else {
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setDescription("");
      setPriority("");
    }
  }, [selectedEvent, selectedDate]);

  const handleSubmit = () => {
    console.log(selectedEvent);

    if (selectedEvent && !selectedDate) {
      fetch("http://185.220.227.124:8080/EditTask", {
        method: "POST",
        body: JSON.stringify({
          id: selectedEvent.id,
          title: title,
          description: description,
          priority: priority,
          duration: duration,
          start_time: moment(date)
            .set({
              hour: startTime.split(":")[0],
              minute: startTime.split(":")[1],
            })
            .unix(),
          end_time: moment(date)
            .set({ hour: endTime.split(":")[0], minute: endTime.split(":")[1] })
            .unix(),
          user_name: "react",
          password: "wasd1234",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          try {
            console.log(json);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
      const updatedEvent = {
        ...selectedEvent,
        title,
        description,
        priority,
        duration,
        start: moment(date)
          .set({
            hour: startTime.split(":")[0],
            minute: startTime.split(":")[1],
          })
          .toDate(),
        end: moment(date)
          .set({
            hour: endTime.split(":")[0],
            minute: endTime.split(":")[1],
          })
          .toDate(),
      };
      console.log(updatedEvent);
      onEditEvent(updatedEvent);
    } else {
      fetch("http://185.220.227.124:8080/addTask", {
        method: "POST",
        body: JSON.stringify({
          start_time: moment(date)
            .set({
              hour: startTime.split(":")[0],
              minute: startTime.split(":")[1],
            })
            .unix(),
          end_time: moment(date)
            .set({
              hour: endTime.split(":")[0],
              minute: endTime.split(":")[1],
            })
            .unix(),
          title: title,
          description: description,
          priority: priority,
          duration: duration,
          user_name: "react",
          password: "wasd1234",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          const newEvent = {
            id: json.task_id,
            title,
            description,
            priority,
            duration,
            start: moment(date)
              .set({
                hour: startTime.split(":")[0],
                minute: startTime.split(":")[1],
              })
              .toDate(),
            end: moment(date)
              .set({
                hour: endTime.split(":")[0],
                minute: endTime.split(":")[1],
              })
              .toDate(),
          };
          console.log(newEvent);

          onAddEvent(newEvent);
        });
    }
  };

  // Function to handle date change and disable past dates
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    // const today = new Date().toISOString().split("T")[0];

    // // Only update date state if selected date is not in the past
    // if (selectedDate >= today) {
    //   setDate(selectedDate);
    // }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      onDeleteEvent(selectedEvent.id);
    }
  };

  return (
    <div className={`sidebar ${show ? "show" : ""}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h3>{selectedEvent ? "Edit Event" : "Add Event"}</h3>
          <button className="close-btn" onClick={onHide}>
            Close
          </button>
        </div>
        <div className="sidebar-body">
          <label>Title</label>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>description</label>
          <input
            type="text"
            placeholder="Event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>priority</label>
          <input
            type="number"
            placeholder="Event priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
          <label>duration</label>
          <input
            type="time"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <label>Date</label>
          <input
            type="date"
            value={moment(date).format("YYYY-MM-DD")}
            onChange={handleDateChange}
          />
          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSubmit}>
            {selectedEvent && !selectedDate ? "Update" : "Submit"}
          </button>
          {selectedEvent && !selectedDate && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
