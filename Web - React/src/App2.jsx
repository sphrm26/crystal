import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-jalaali";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "./component/Sidebar.jsx";
import "./App.css";

moment.loadPersian({ usePersianDigits: false, dialect: "persian-modern" });
const localizer = momentLocalizer(moment);

const customFormats = {
  dateFormat: (date) => moment(date).format("jD"), // روز ماه (1، 2، ...)
  dayFormat: (date) => moment(date).format("jD"), // تاریخ روز در ویوهای ماهانه و هفتگی
  monthHeaderFormat: (date) => moment(date).format("jMMMM jYYYY"), // ماه و سال (مثال: آبان 1403)
  weekHeaderFormat: ({ start, end }) =>
    `${moment(start).format("jD jMMMM")} - ${moment(end).format("jD jMMMM")}`, // بازه زمانی هفته
  dayHeaderFormat: (date) => moment(date).format("dddd jD jMMMM jYYYY"), // تاریخ کامل روز (مثال: شنبه 26 آبان 1403)
  agendaDateFormat: (date) => moment(date).format("dddd jD jMMMM"), // تاریخ روز در نمای agenda
  agendaTimeFormat: (date) => moment(date).format("HH:mm"), // زمان در نمای agenda
  eventTimeRangeFormat: ({ start, end }) =>
    `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`, // بازه زمانی رویداد
  dayRangeHeaderFormat: ({ start, end }) =>
    `${moment(start).format("jD jMMMM")} - ${moment(end).format("jD jMMMM")}`, // بازه زمانی روزها
};

const App = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
        localizer={localizer}
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
