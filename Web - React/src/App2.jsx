import { useState, useEffect } from "react";
import { momentLocalizer } from "react-big-calendar";
import BigCalendar from "jalali-react-big-calendar";
import moment from "moment";
import momentJl from "moment-jalaali";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "./component/sidebar/Sidebar.jsx";
import Login from "./component/login/Login.jsx";
import Tasks from "./component/tasks/Tasks.jsx";
import "./App.css";
import FetchCategories from "./apis/getCategories.jsx";
import FetchTasks from "./apis/getTasks.jsx";

momentJl.loadPersian({ usePersianDigits: false, dialect: "persian-modern" });
const localizerJl = momentLocalizer(momentJl);

const App = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment().toDate());
  const [cachedTasks, setCachedTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [pageType, setTypeOfPage] = useState(null);
  const [cachedCategories, setCachedCategories] = useState([]);

  useEffect(() => {
    const fetchTasks = async (date) => {
      try {
        // console.log(data);

        const now = momentJl(date);
        const monthKey = now.format("jYYYY-jMM");

        if (cachedTasks[monthKey]) {
          console.log(`Tasks for ${monthKey} are already cached.`);
          setEvents(cachedTasks[monthKey]);
          return;
        }

        console.log(`Fetching tasks for month: ${monthKey}`);
        const startTime = now.startOf("JMonth").format("X");
        const endTime = now.endOf("JMonth").format("X");

        const tasks = await FetchTasks(startTime, endTime)

        let categories = [];
        if (cachedCategories.length == 0) {
          categories = await FetchCategories()
          setCachedCategories(categories)
        }

        const formattedEvents = tasks.map((task) => {
          const startDate = new Date(task.PlanedTime.StartTime);
          const endDate = new Date(task.PlanedTime.EndTime);

          categories.map((cat) => {
            if (cat.Id == task.CategoryId) {
              task.categoryName = cat.Name
            }
          })

          return {
            id: task.ID,
            title: task.Title,
            description: task.Description,
            duration: task.Duration,
            priority: task.Priority,
            start: startDate,
            end: endDate,
            category: task.categoryName,
            is_done: task.IsDone,
          };
        });

        setCachedTasks((prev) => ({
          ...prev,
          [monthKey]: formattedEvents,
        }));

        console.log(formattedEvents);

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(currentDate);
  }, [currentDate, cachedTasks]);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
    setShowOffcanvas(false);
  };

  const handleEditEvent = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setShowOffcanvas(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
    setShowOffcanvas(false);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowOffcanvas(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedEvent(null);
    setSelectedDate(slotInfo.start);
    setShowOffcanvas(true);
    const defaultEvent = {
      start: slotInfo.start,
      end: slotInfo.end,
    };
    setSelectedEvent(defaultEvent);
  };

  const handleNavigate = (newDate) => {
    console.log("Navigated to:", newDate);
    setCurrentDate(newDate);
  };

  if (pageType == "tasks") {
    return (
      <div className="calender-container">
        <div className="btn-container">
          <button
            className="btn-event"
            onClick={() => {
              setSelectedEvent(null);
              toggleOffcanvas();
            }}
          >
            Add Event
          </button>
          <Login />
          <button
            className="btn-event"
            onClick={() => {
              setTypeOfPage("calender");
            }}
          >
            calender
          </button>
        </div>
        <Sidebar
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          selectedEvent={selectedEvent}
          selectedDate={selectedDate}
        />
        <Tasks
          onSelectEvent={handleSelectEvent}
        >
        </Tasks>
      </div>
    );
  }

  return (
    <div className="calender-container">
      <div className="btn-container">
        <button
          className="btn-event"
          onClick={() => {
            setSelectedEvent(null);
            toggleOffcanvas();
          }}
        >
          Add Event
        </button>
        <Login />
        <button
          className="btn-event"
          onClick={() => {
            setTypeOfPage("tasks");
          }}
        >
          tasks
        </button>
      </div>
      <Sidebar
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        selectedEvent={selectedEvent}
        selectedDate={selectedDate}
      />
      <BigCalendar
        events={events}
        localizer={localizerJl}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "85vh" }}
        onSelectEvent={handleSelectEvent}
        onNavigate={handleNavigate}
        onSelectSlot={handleSelectSlot}
        selectable
        messages={{
          today: "امروز",
          previous: "قبلی",
          next: "بعدی",
          month: "ماه",
          week: "هفته",
          day: "روز",
          agenda: "برنامه‌ها",
          date: "تاریخ",
          time: "زمان",
          event: "رویداد",
        }}
      />
    </div>
  );
};

export default App;
