var idOfEditTask = 0;

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

window.onload = async function () {
  closeEventPupup();
  // let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  // let today = new Date().toLocaleDateString('fa-IR', options);
  // console.log(today);

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

  var hour = 0;
  for (let i = 0; i < 23; i++) {
    var iDiv = document.createElement("div");
    iDiv.className = "hour";
    hour += 1;

    var text = document.createElement("div");
    text.innerHTML = hour + ":00";
    // text.style.border = "1px";
    // text.style.borderColor = "white";
    // text.style.borderBlockStyle = "solid";
    text.style.fontSize = "small";
    iDiv.appendChild(text);

    iDiv.style.top = 2 + "%";
    var hourDiv = document.getElementById("7").appendChild(iDiv);
  }

  var startOfTheWeek = new Date();

  // set dates of the week
  for (let i = 0; i < 7; i++) {
    let today = new Date();
    let dayOfWeek = today.getDay();
    let firstDay = new Date();
    firstDay.setDate(today.getDate() - dayOfWeek + 5 - i);

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
    startOfTheWeek = firstDay;
  }

  startOfTheWeek.setHours(0, 0, 0, 0);
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
      console.log(json.tasks[j]);
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
};

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

function nextWeek() {
  alert("goToNextWeek not implemented");
}

function goToLastWeek() {
  alert("goToLastWeek not implemented");
}
