import { useState, useEffect } from "react";
import "./Sidebar.css"; // Import your CSS file for styling
import moment from "moment";
import { getCookie } from "../login/Login.jsx"

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
  const [category, setCategory] = useState("");
  const [isDone, setIsDone] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState("");
  const [duration, setDuration] = useState("");
  const [cachedCategories, setCachedCategories] = useState([]);

  useEffect(() => {
    if (selectedEvent) {
      selectedDate ? setDate(selectedDate) : null;
      setTitle(selectedEvent.title || "");
      setDate(selectedEvent.start || "");
      setStartTime(
        selectedEvent.start ? moment(selectedEvent.start).format("HH:mm") : ""
      );
      setEndTime(
        selectedEvent.end ? moment(selectedEvent.end).format("HH:mm") : ""
      );
      setCategory(selectedEvent.category)
      setIsDone(selectedEvent.is_done)

      const hours = Math.floor(selectedEvent.duration / 60);
      const mins = selectedEvent.duration % 60;
      var strDur = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      setDuration(strDur)
      if (selectedEvent.duration == 0) {
        setDuration("")
      }
    } else {
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setDescription("");
      setPriority("");
      setCategory("بدون گروه");
      setDuration("");
      setIsDone("");
    }

    fetchCategories();
  }, [selectedEvent, selectedDate]);

  const fetchCategories = async () => {

    if (cachedCategories.length != 0) {
      return
    }

    try {
      const response = await fetch("http://185.220.227.124:8080/getCategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          user_name: getCookie("username"),
          password: getCookie("password"),
        }),
      });
      const data = await response.json();

      data.categories.push({
        Id: 0,
        Name: "بدون گروه"
      })

      const defaultCategory = data.categories.find(cat => cat.Id === 0);
      if (defaultCategory) {
        setCategory(defaultCategory.Name);
      }
      setCachedCategories(data.categories)
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = () => {

    if (selectedEvent?.id) {
      console.log("sepehr: ", isDone)
      fetch("http://185.220.227.124:8080/EditTask", {
        method: "POST",
        body: JSON.stringify({
          id: selectedEvent.id,
          title: title,
          description: description,
          priority: priority,
          duration: Number(duration.split(':')[0]) * 60 + Number(duration.split(':')[1]),
          is_done: isDone,
          category_name: category,
          start_time: moment(date)
            .set({
              hour: startTime.split(":")[0],
              minute: startTime.split(":")[1],
            })
            .unix(),
          end_time: moment(date)
            .set({ hour: endTime.split(":")[0], minute: endTime.split(":")[1] })
            .unix(),
          user_name: getCookie("username"),
          password: getCookie("password"),
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
          duration: Number(duration.split(':')[0]) * 60 + Number(duration.split(':')[1]),
          is_done: isDone,
          category_name: category,
          user_name: getCookie("username"),
          password: getCookie("password"),
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
      fetch("http://185.220.227.124:8080/deleteTask", {
        method: "POST",
        body: JSON.stringify({
          id: selectedEvent.id,
          user_name: getCookie("username"),
          password: getCookie("password"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          onDeleteEvent(selectedEvent.id);
        });
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

          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {cachedCategories.map((cat) => (
              <option key={cat.Id} value={cat.Name}>
                {cat.Name}
              </option>
            ))}
          </select>


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

          <label>is done</label>
          <select
            value={isDone}
            onChange={(e) => setIsDone(e.target.value)}
          >
            <option key={"false"} value="false">
              false
            </option>
            <option key={"true"} value="true">
              true
            </option>
          </select>

          <button className="btn btn-primary" onClick={handleSubmit}>
            {selectedEvent?.id ? "Update" : "Submit"}
          </button>
          {selectedEvent?.id && (
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
