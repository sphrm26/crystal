$(document).ready(function () {
  const datepickerDOM = $("#start_time");
  const dateObject = datepickerDOM.persianDatepicker({
    inline: false,
    format: "LLLL",
    viewMode: "day",
    initialValue: false,
    minDate: false,
    maxDate: false,
    autoClose: true,
    position: "auto",
    altFormat: "lll",
    altField: "#altfieldExample",
    onlyTimePicker: false,
    onlySelectOnDate: false,
    calendarType: "persian",
    inputDelay: 800,
    observer: false,
    calendar: {
      persian: {
        locale: "fa",
        showHint: true,
        leapYearMode: "algorithmic",
      },
      gregorian: {
        locale: "en",
        showHint: true,
      },
    },
    navigator: {
      enabled: true,
      scroll: {
        enabled: true,
      },
      text: {
        btnNextText: "<",
        btnPrevText: ">",
      },
    },
    toolbox: {
      enabled: true,
      calendarSwitch: {
        enabled: true,
        format: "MMMM",
      },
      todayButton: {
        enabled: true,
        text: {
          fa: "امروز",
          en: "Today",
        },
      },
      submitButton: {
        enabled: true,
        text: {
          fa: "تایید",
          en: "Submit",
        },
      },
      text: {
        btnToday: "امروز",
      },
    },
    timePicker: {
      enabled: true,
      step: 1,
      hour: {
        enabled: true,
        step: null,
      },
      minute: {
        enabled: true,
        step: null,
      },
      second: {
        enabled: true,
        step: null,
      },
      meridian: {
        enabled: false,
      },
    },
    dayPicker: {
      enabled: true,
      titleFormat: "YYYY MMMM",
    },
    monthPicker: {
      enabled: true,
      titleFormat: "YYYY",
    },
    yearPicker: {
      enabled: true,
      titleFormat: "YYYY",
    },
    responsive: true,
    onSelect: function () {
      var persianDateTime = new persianDate([
        date.year,
        date.month,
        date.date,
        date.hour,
        date.minute,
        date.second,
        0,
      ]);

      var start_time = document.getElementById("start_time");
      start_time.timestamp = persianDateTime.format("X");
    },
  });
  const date = dateObject.getState().view;

  const datepickerDOM2 = $("#end_time");
  const dateObject2 = datepickerDOM2.persianDatepicker({
    inline: false,
    format: "LLLL",
    viewMode: "day",
    initialValue: false,
    minDate: false,
    maxDate: false,
    autoClose: true,
    position: "auto",
    altFormat: "lll",
    altField: "#altfieldExample",
    onlyTimePicker: false,
    onlySelectOnDate: false,
    calendarType: "persian",
    inputDelay: 800,
    observer: false,
    calendar: {
      persian: {
        locale: "fa",
        showHint: true,
        leapYearMode: "algorithmic",
      },
      gregorian: {
        locale: "en",
        showHint: true,
      },
    },
    navigator: {
      enabled: true,
      scroll: {
        enabled: true,
      },
      text: {
        btnNextText: "<",
        btnPrevText: ">",
      },
    },
    toolbox: {
      enabled: true,
      calendarSwitch: {
        enabled: true,
        format: "MMMM",
      },
      todayButton: {
        enabled: true,
        text: {
          fa: "امروز",
          en: "Today",
        },
      },
      submitButton: {
        enabled: true,
        text: {
          fa: "تایید",
          en: "Submit",
        },
      },
      text: {
        btnToday: "امروز",
      },
    },
    timePicker: {
      enabled: true,
      step: 1,
      hour: {
        enabled: true,
        step: null,
      },
      minute: {
        enabled: true,
        step: null,
      },
      second: {
        enabled: true,
        step: null,
      },
      meridian: {
        enabled: false,
      },
    },
    dayPicker: {
      enabled: true,
      titleFormat: "YYYY MMMM",
    },
    monthPicker: {
      enabled: true,
      titleFormat: "YYYY",
    },
    yearPicker: {
      enabled: true,
      titleFormat: "YYYY",
    },
    responsive: true,
    onSelect: function () {
      var persianDateTime2 = new persianDate([
        date2.year,
        date2.month,
        date2.date,
        date2.hour,
        date2.minute,
        date2.second,
        0,
      ]);

      var end_time = document.getElementById("end_time");
      end_time.timestamp = persianDateTime2.format("X");
    },
  });

  const date2 = dateObject2.getState().view;
});
