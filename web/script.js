var idOfEditTask = 0;

window.onload = async function () {
  closeEventPupup();

  AddHourLinesForDay();

  // add hours column in table
  var hour = 0;
  for (let i = 0; i < 23; i++) {
    var iDiv = document.createElement("div");
    iDiv.className = "hour";
    hour += 1;

    var text = document.createElement("div");
    text.innerHTML = hour + ":00";
    text.style.fontSize = "small";
    iDiv.appendChild(text);

    iDiv.style.top = 2 + "%";
    document.getElementById("7").appendChild(iDiv);
  }

  var startOfTheWeek = new Date();

  setDayTitle(0);

  let dayOfWeek = startOfTheWeek.getDay();
  let firstDay = new Date();
  firstDay.setDate(startOfTheWeek.getDate() - dayOfWeek - 1);
  startOfTheWeek = firstDay;
  startOfTheWeek.setHours(0, 0, 0, 0);

  await getTasksOfCurrentWeek(startOfTheWeek);
};

function addEvent() {
  var start_time = document.getElementById("start_time").timestamp;
  var end_time = document.getElementById("end_time").timestamp;
  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;
  var duration = document.getElementById("duration").value;
  var priority = document.getElementById("priority").value;

  fetch("http://127.0.0.1:8080/addTask", {
    method: "POST",
    body: JSON.stringify({
      start_time: start_time,
      end_time: end_time,
      title: title,
      description: description,
      duration: duration,
      priority: priority,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json.message));

  document.getElementById("start_time").value = "";
  document.getElementById("end_time").value = "";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("duration").value = "";
  document.getElementById("priority").value = "";

  closeEventPupup();
}

// add line for start of the hour in each day
function AddHourLinesForDay() {
  for (let j = 0; j < 7; j++) {
    var num = 0;
    for (let i = 0; i < 23; i++) {
      var iDiv = document.createElement("div");
      iDiv.className = "line";
      num += 4;
      iDiv.style.top = num + "%";
      document.getElementById(j).appendChild(iDiv);
    }
  }
}

function EditEvent() {
  var start_time = document.getElementById("start_time").timestamp;
  var end_time = document.getElementById("end_time").timestamp;
  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;
  var duration = document.getElementById("duration").value;
  var priority = document.getElementById("priority").value;

  console.log(
    idOfEditTask,
    start_time,
    end_time,
    title,
    description,
    duration,
    priority
  );

  fetch("http://127.0.0.1:8080/EditTask", {
    method: "POST",
    body: JSON.stringify({
      id: idOfEditTask,
      start_time: start_time,
      end_time: end_time,
      title: title,
      description: description,
      duration: duration,
      priority: priority,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json.message));

  document.getElementById("start_time").value = "";
  document.getElementById("end_time").value = "";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("duration").value = "";
  document.getElementById("priority").value = "";

  closeEventPupup();
}

function addEventPupup() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("priority").value = null;
  document.getElementById("submitButton").onclick = function () {
    addEvent();
  };
  document.getElementById("eventPupup").style.visibility = "visible";
}

function EditEventPupup(
  taskID,
  start_time,
  end_time,
  title,
  description,
  priority
) {
  document.getElementById("start_time").value = start_time;
  document.getElementById("end_time").value = end_time;
  document.getElementById("title").value = title;
  document.getElementById("description").value = description;
  document.getElementById("priority").value = priority;
  document.getElementById("submitButton").onclick = function () {
    EditEvent();
  };
  document.getElementById("eventPupup").style.visibility = "visible";
  idOfEditTask = taskID;
}

function closeEventPupup() {
  document.getElementById("eventPupup").style.visibility = "hidden";
}

async function getTasksOfCurrentWeek(startOfTheWeek) {
  var timestampToday = startOfTheWeek.getTime();
  timestampToday = ~~(timestampToday / 1000);
  for (let i = 0; i < 7; i++) {
    var json = await getTask(timestampToday, timestampToday + 60 * 60 * 24);
    for (let j = 0; j < json.tasks.length; j++) {
      var taskStartDate = new Date(json.tasks[j].PlanedTime.StartTime);
      var taskStartDateToSeconds =
        taskStartDate.getHours() * 3600 +
        taskStartDate.getMinutes() * 60 +
        taskStartDate.getSeconds();

      var taskEndDate = new Date(json.tasks[j].PlanedTime.EndTime);
      var taskEndDateToSeconds =
        taskEndDate.getHours() * 3600 +
        taskEndDate.getMinutes() * 60 +
        taskEndDate.getSeconds();

      var taskTitle = json.tasks[j].Title;
      var taskDescription = json.tasks[j].Description;
      var taskPriority = json.tasks[j].Priority;
      var taskId = json.tasks[j].ID;

      var iDiv = document.createElement("div");
      iDiv.style.top = (taskStartDateToSeconds * 100) / 86400 + "%";
      iDiv.style.height =
        ((taskEndDateToSeconds - taskStartDateToSeconds) * 100) / 86400 + "%";
      iDiv.innerHTML = taskTitle;
      iDiv.className = "task";
      iDiv.onclick = (function (
        taskId,
        taskStartDate,
        taskEndDate,
        taskTitle,
        taskDescription,
        taskPriority
      ) {
        return function () {
          EditEventPupup(
            taskId,
            taskStartDate,
            taskEndDate,
            taskTitle,
            taskDescription,
            taskPriority
          );
        };
      })(
        json.tasks[j].ID,
        taskStartDate,
        taskEndDate,
        taskTitle,
        taskDescription,
        taskPriority
      );
      document.getElementById(i).appendChild(iDiv);
    }
    timestampToday += 60 * 60 * 24;
  }
}

// set dates of the week on title of each day
function setDayTitle(diffFromCurentWeek) {
  for (let i = 0; i < 7; i++) {
    let today = new Date();
    let dayOfWeek = today.getDay();
    let firstDay = new Date();
    firstDay.setDate(
      today.getDate() - dayOfWeek + 5 - i + 7 * diffFromCurentWeek
    );

    function formatDate(date) {
      let options = {
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("fa-IR", options);
    }

    let formattedDate = formatDate(firstDay);
    weekDays = document.getElementById("week_days-" + String(i));
    weekDays.innerHTML = formattedDate;
    if (new Date().getDate() == firstDay.getDate()) {
        weekDays.style.backgroundColor = "gold";
    }
    else{
        weekDays.style.backgroundColor = "rgb(28, 77, 89)";
    }
  }
}

async function getTask(start_time, end_time) {
  try {
    const response = await fetch("http://127.0.0.1:8080/getTasks", {
      method: "POST",
      body: JSON.stringify({
        start_time: start_time,
        end_time: end_time,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return null;
  }
}

var diffFromCurentWeek = 0;
async function goToNextWeek() {
  diffFromCurentWeek++;
  setDayTitle(diffFromCurentWeek);

  for (let i = 0; i < 7; i++) {
    document.getElementById(i).innerHTML = "";
  }
  AddHourLinesForDay();

  let today = new Date();
  let dayOfWeek = today.getDay();
  let firstDay = new Date();
  firstDay.setDate(today.getDate() - dayOfWeek - 1 + 7 * diffFromCurentWeek);
  today = firstDay;
  today.setHours(0, 0, 0, 0);

  await getTasksOfCurrentWeek(today);
}
async function goToLastWeek() {
  diffFromCurentWeek--;
  setDayTitle(diffFromCurentWeek);

  for (let i = 0; i < 7; i++) {
    document.getElementById(i).innerHTML = "";
  }
  AddHourLinesForDay();

  let today = new Date();
  let dayOfWeek = today.getDay();
  let firstDay = new Date();
  firstDay.setDate(today.getDate() - dayOfWeek - 1 + 7 * diffFromCurentWeek);
  today = firstDay;
  today.setHours(0, 0, 0, 0);

  await getTasksOfCurrentWeek(today);
}
