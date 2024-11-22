import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import momentJl from "moment-jalaali";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "./component/sidebar/Sidebar.jsx";
import "./App.css";

momentJl.loadPersian({ usePersianDigits: false, dialect: "persian-modern" });
const localizerJl = momentLocalizer(momentJl);

const customFormats = {
  dateFormat: (date) => momentJl(date).format("jD"), // روز ماه (1، 2، ...)
  dayFormat: (date) => momentJl(date).format("jD"), // تاریخ روز در ویوهای ماهانه و هفتگی
  monthHeaderFormat: (date) => momentJl(date).format("jMMMM jYYYY"), // ماه و سال (مثال: آبان 1403)
  weekHeaderFormat: ({ start, end }) =>
    `${momentJl(start).format("jD jMMMM")} - ${momentJl(end).format(
      "jD jMMMM"
    )}`, // بازه زمانی هفته
  dayHeaderFormat: (date) => momentJl(date).format("dddd jD jMMMM jYYYY"), // تاریخ کامل روز (مثال: شنبه 26 آبان 1403)
  agendaDateFormat: (date) => momentJl(date).format("dddd jD jMMMM"), // تاریخ روز در نمای agenda
  agendaTimeFormat: (date) => momentJl(date).format("HH:mm"), // زمان در نمای agenda
  eventTimeRangeFormat: ({ start, end }) =>
    `${momentJl(start).format("HH:mm")} - ${momentJl(end).format("HH:mm")}`, // بازه زمانی رویداد
  dayRangeHeaderFormat: ({ start, end }) =>
    `${momentJl(start).format("jD jMMMM")} - ${momentJl(end).format(
      "jD jMMMM"
    )}`, // بازه زمانی روزها
};

const App = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const now = moment();
    console.log(now.startOf("Month").format("X"));
    console.log(now.endOf("Month").format("X"));
    
    const fetchTasks = async () => {
      try {
        const now = moment();
        const startTime = now.startOf("Month").format("X");
        const endTime = now.endOf("Month").format("X");

        const response = await fetch("http://185.220.227.124:8080/getTasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            start_time: startTime,
            end_time: endTime,
            user_name: "react",
            password: "wasd1234",
          }),
        });

        const data = await response.json();
        if (!data.tasks || !Array.isArray(data.tasks)) {
          console.error("Invalid data format:", data);
          return [];
        }
        console.log(data.tasks);

        const formattedEvents = data.tasks.map((task) => {
          const startDate = task.PlanedTime.StartTime;
          const endDate = task.PlanedTime.EndTime;

          return {
            id: task.ID,
            title: task.Title,
            description: task.Description,
            duration: task.duration,
            priority: task.Priority,
            start: startDate,
            end: endDate,
          };
        });
        console.log(formattedEvents);
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  //   const handleAddEvent = (newEvent) => {
  //     const convertedEvent = {
  //       ...newEvent,
  //       start: moment(newEvent.start, "jYYYY/jMM/jDD").toDate(), // تبدیل به میلادی
  //       end: moment(newEvent.end, "jYYYY/jMM/jDD").toDate(), // تبدیل به میلادی
  //     };
  //     setEvents([...events, convertedEvent]);
  //     setShowOffcanvas(false);
  //   };

  //   const handleEditEvent = (updatedEvent) => {
  //     const convertedUpdatedEvent = {
  //       ...updatedEvent,
  //       start: moment(updatedEvent.start).toDate(), // تبدیل به میلادی
  //       end: moment(updatedEvent.end).toDate(), // تبدیل به میلادی
  //     };
  //     setEvents(
  //       events.map((event) =>
  //         event.id === updatedEvent.id ? convertedUpdatedEvent : event
  //       )
  //     );
  //     setShowOffcanvas(false);
  //   };

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
      </div>
      <Sidebar
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        selectedEvent={selectedEvent}
      />
      <Calendar
        localizer={localizerJl}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "85vh" }}
        onSelectEvent={handleSelectEvent}
        formats={customFormats} // قالب‌بندی شخصی‌سازی شده
        messages={{
          // پیام‌ها را فارسی می‌کنیم
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
