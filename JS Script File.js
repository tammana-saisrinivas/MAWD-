// Dark Mode Toggle
document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});

// Spinner
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const spinner = document.getElementById("spinner");
        if (spinner) spinner.style.display = "none";
    }, 800);
});

// Show only the selected section
function showOnly(id) {
    ["landingOptions", "adminLogin", "studentLogin", "adminPortal", "studentPortal"].forEach(function(val) {
        const el = document.getElementById(val);
        if (el) el.style.display = (val === id ? "" : "none");
    });
}

// LANDING PAGE NAVIGATION
document.getElementById("adminOption").onclick = function() { showOnly("adminLogin"); };
document.getElementById("studentOption").onclick = function() { showOnly("studentLogin"); };
document.getElementById("backToLanding1").onclick = function(e) { e.preventDefault(); showOnly("landingOptions"); };
document.getElementById("backToLanding2").onclick = function(e) { e.preventDefault(); showOnly("landingOptions"); };

// ADMIN LOGIN
document.getElementById("adminLoginForm").onsubmit = function(e) {
    e.preventDefault();
    const [username, password] = Array.from(this.querySelectorAll("input")).map(inp => inp.value.trim());
    if(username === "admin" && password === "admin123") {
        showOnly("adminPortal");
        hideAllAdminSections();
    } else {
        alert("Invalid admin credentials!");
    }
};

function hideAllAdminSections() {
    ["addStudentSection","studentListSection","scheduleSection","projectsSection","competitionsSection","markingSystemSection"]
      .forEach(id => { const el=document.getElementById(id); if(el) el.style.display="none"; });
}

// ADMIN PORTAL NAV
document.getElementById("showAddStudent").onclick = function() {
    hideAllAdminSections();
    document.getElementById("addStudentSection").style.display = "";
};
document.getElementById("showStudentList").onclick = function() {
    hideAllAdminSections();
    document.getElementById("studentListSection").style.display = "";
    renderStudentList();
};
document.getElementById("showProjects").onclick = function() {
    hideAllAdminSections();
    document.getElementById("projectsSection").style.display = "";
    renderAdminProjectList();
};
document.getElementById("showCompetitions").onclick = function() {
    hideAllAdminSections();
    document.getElementById("competitionsSection").style.display = "";
    renderAdminCompetitionList();
};
document.getElementById("showSchedule").onclick = function() {
    hideAllAdminSections();
    document.getElementById("scheduleSection").style.display = "";
    renderEventList();
};
document.getElementById("showMarkingSystem").onclick = function() {
    hideAllAdminSections();
    document.getElementById("markingSystemSection").style.display = "";
    renderMarkingBatchSelect();
};
document.getElementById("adminLogout").onclick = function() {
    showOnly("landingOptions");
};

// ADD STUDENT
document.getElementById("addStudentForm").onsubmit = function(e) {
    e.preventDefault();
    const [name, roll, password] = Array.from(this.querySelectorAll("input")).map(inp => inp.value.trim());
    if (!name || !roll || !password) return;
    let students = JSON.parse(localStorage.getItem("students") || "[]");
    if (students.find(s => s.roll === roll)) {
        document.getElementById("addStudentMsg").textContent = "Student already exists!";
        return;
    }
    students.push({name, roll, password});
    localStorage.setItem("students", JSON.stringify(students));
    document.getElementById("addStudentMsg").textContent = "Student added!";
    this.reset();
    setTimeout(() => {document.getElementById("addStudentMsg").textContent = "";}, 1500);
    renderStudentList();
};

// DELETE STUDENT
function renderStudentList() {
    let students = JSON.parse(localStorage.getItem("students") || "[]");
    let tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";
    students.forEach((s, idx) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${s.name}</td><td>${s.roll}</td>
            <td><button onclick="deleteStudent(${idx})">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}
window.deleteStudent = function(idx) {
    let students = JSON.parse(localStorage.getItem("students") || "[]");
    students.splice(idx, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderStudentList();
};

// ADMIN PROJECTS
document.getElementById("addProjectForm").onsubmit = function(e) {
    e.preventDefault();
    const [title, roll] = Array.from(this.querySelectorAll("input")).map(inp => inp.value.trim());
    if (!title || !roll) return;
    let projects = JSON.parse(localStorage.getItem("projects") || "[]");
    projects.push({title, roll, status: "Assigned", files: []});
    localStorage.setItem("projects", JSON.stringify(projects));
    this.reset();
    renderAdminProjectList();
};
function renderAdminProjectList() {
    let projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const ul = document.getElementById("projectList");
    ul.innerHTML = "";
    if (!projects.length) {
        ul.innerHTML = "<li>No projects assigned yet.</li>";
    }
    projects.forEach((prj, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <b>${prj.title}</b> → <span style="color:#17a2b8">${prj.roll}</span>
            <span style="margin-left:7px;font-size:0.95em;">[${prj.status}]</span>
            <button onclick="deleteProject(${idx})" style="margin-left:10px;">Delete</button>
        `;
        ul.appendChild(li);
    });
}
window.deleteProject = function(idx) {
    let projects = JSON.parse(localStorage.getItem("projects") || "[]");
    projects.splice(idx, 1);
    localStorage.setItem("projects", JSON.stringify(projects));
    renderAdminProjectList();
};

// ADMIN COMPETITIONS
document.getElementById("addCompetitionForm").onsubmit = function(e) {
    e.preventDefault();
    const [name, date] = Array.from(this.querySelectorAll("input")).map(inp => inp.value.trim());
    if (!name || !date) return;
    let competitions = JSON.parse(localStorage.getItem("competitions") || "[]");
    competitions.push({name, date});
    localStorage.setItem("competitions", JSON.stringify(competitions));
    this.reset();
    renderAdminCompetitionList();
    renderCompetitionBoard();
};
function renderAdminCompetitionList() {
    let competitions = JSON.parse(localStorage.getItem("competitions") || "[]");
    const ul = document.getElementById("competitionList");
    ul.innerHTML = "";
    if (!competitions.length) {
        ul.innerHTML = "<li>No competitions scheduled yet.</li>";
    }
    competitions.forEach((comp, idx) => {
        const li = document.createElement("li");
        li.textContent = `${comp.date}: ${comp.name}`;
        li.innerHTML += ` <button onclick="deleteCompetition(${idx})" style="margin-left:10px;">Delete</button>`;
        ul.appendChild(li);
    });
}
window.deleteCompetition = function(idx) {
    let competitions = JSON.parse(localStorage.getItem("competitions") || "[]");
    competitions.splice(idx, 1);
    localStorage.setItem("competitions", JSON.stringify(competitions));
    renderAdminCompetitionList();
    renderCompetitionBoard();
};

// SCHEDULE: Add/Show Events
document.getElementById("addEventForm").onsubmit = function(e) {
    e.preventDefault();
    const [title, date] = Array.from(this.querySelectorAll("input")).map(inp => inp.value.trim());
    if (!title || !date) return;
    let events = JSON.parse(localStorage.getItem("events") || "[]");
    events.push({title, date});
    localStorage.setItem("events", JSON.stringify(events));
    this.reset();
    renderEventList();
};
function renderEventList() {
    let events = JSON.parse(localStorage.getItem("events") || "[]");
    const ul = document.getElementById("eventList");
    ul.innerHTML = "";
    if (!events.length) {
        ul.innerHTML = "<li>No scheduled events yet.</li>";
    }
    events.forEach((ev) => {
        const li = document.createElement("li");
        li.textContent = `${ev.date}: ${ev.title}`;
        ul.appendChild(li);
    });
}

// MARKING SYSTEM (Admin)
document.getElementById("showMarkingSystem").onclick = function() {
    hideAllAdminSections();
    document.getElementById("markingSystemSection").style.display = "";
    renderMarkingBatchSelect();
};
function renderMarkingBatchSelect() {
    let students = JSON.parse(localStorage.getItem("students")||"[]");
    let batchSet = new Set(students.map(s => s.roll.slice(0,7)));
    let batchSelect = document.getElementById("markBatchSelect");
    batchSelect.innerHTML = "";
    batchSet.forEach(batch => {
      let opt = document.createElement("option");
      opt.value = batch; opt.textContent = batch;
      batchSelect.appendChild(opt);
    });
    batchSelect.onchange = renderMarkingTable;
    renderMarkingTable();
}
function renderMarkingTable() {
    let students = JSON.parse(localStorage.getItem("students")||"[]");
    let marks = JSON.parse(localStorage.getItem("marks")||"[]");
    let batch = document.getElementById("markBatchSelect").value;
    let tbody = document.querySelector("#markStudentTable tbody");
    tbody.innerHTML = "";
    students.filter(s => s.roll.startsWith(batch)).forEach(s => {
      let m = marks.find(mk => mk.roll === s.roll) || {};
      let lab = m.lab || {};
      let exam = m.exam || {};
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.roll}</td>
        <td><input type="number" min="0" max="10" value="${lab.mark||""}" style="width:50px" /></td>
        <td><input type="number" min="0" max="100" value="${exam.mark||""}" style="width:60px" /></td>
        <td>
          <select>
            <option${lab.status==="Pending"?" selected":""}>Pending</option>
            <option${lab.status==="Submitted"?" selected":""}>Submitted</option>
            <option${lab.status==="Evaluated"?" selected":""}>Evaluated</option>
          </select>
        </td>
        <td><button onclick="saveMark('${s.roll}', this)">Save</button></td>
      `;
      tbody.appendChild(tr);
    });
}
window.saveMark = function(roll, btn) {
    let tr = btn.closest("tr");
    let labMark = tr.children[2].querySelector("input").value;
    let examMark = tr.children[3].querySelector("input").value;
    let status = tr.children[4].querySelector("select").value;
    let marks = JSON.parse(localStorage.getItem("marks") || "[]");
    let idx = marks.findIndex(mk => mk.roll === roll);
    const entry = {roll,
      lab: {mark: labMark, status: status},
      exam: {mark: examMark}
    };
    if(idx >= 0) marks[idx] = entry;
    else marks.push(entry);
    localStorage.setItem("marks", JSON.stringify(marks));
    alert("Marks updated for "+roll);
    renderMarkingTable();
};

// STUDENT LOGIN
document.getElementById("studentLoginForm").onsubmit = function(e) {
    e.preventDefault();
    const inputs = this.querySelectorAll("input");
    const name = inputs[0].value.trim();
    const roll = inputs[1].value.trim();
    const password = inputs[2].value.trim();
    let students = JSON.parse(localStorage.getItem("students") || "[]");
    let found = students.find(s => s.name === name && s.roll === roll && s.password === password);
    if (found) {
        localStorage.setItem("studentName", name);
        localStorage.setItem("studentRoll", roll);
        showStudentPortal();
    } else {
        alert("Invalid student credentials!");
    }
};
document.getElementById("studentLogout").onclick = function() {
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentRoll");
    showOnly("landingOptions");
};
function showStudentPortal() {
    showOnly("studentPortal");
    document.getElementById("studentNameDisplay").textContent = localStorage.getItem("studentName") || "Student";
    setActiveTab(document.querySelector('.stud-tab[data-tab="timetableTab"]'));
    renderStudentEvents();
    renderStudentProjects();
    renderStudentCompetitions();
}

// Student Portal Tabs
const studTabs = document.querySelectorAll(".stud-tab");
studTabs.forEach(tab => {
    tab.onclick = function() { setActiveTab(tab); };
});
function setActiveTab(tab) {
    studTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".student-tab-content").forEach(div => div.style.display = "none");
    document.getElementById(tab.dataset.tab).style.display = "";
    if(tab.dataset.tab === "marksTab") renderStudentMarks();
}

// STUDENT EVENTS
function renderStudentEvents() {
    let events = JSON.parse(localStorage.getItem("events") || "[]");
    const ul = document.getElementById("studentEvents");
    ul.innerHTML = "";
    if (!events.length) {
        ul.innerHTML = "<li>No scheduled events yet.</li>";
    }
    events.forEach(ev => {
        const li = document.createElement("li");
        li.textContent = `${ev.date}: ${ev.title}`;
        ul.appendChild(li);
    });
}

// STUDENT PROJECTS
function renderStudentProjects() {
    let projects = JSON.parse(localStorage.getItem("projects") || "[]");
    let rollNo = localStorage.getItem("studentRoll");
    const ul = document.getElementById("studentProjects");
    ul.innerHTML = "";
    let found = false;
    projects.forEach((prj, idx) => {
        if (prj.roll === rollNo) {
            found = true;
            ul.innerHTML += `<li>
                <b>${prj.title}</b>
                <span style="color:#17a2b8;margin-left:7px;">[${prj.status}]</span>
                ${prj.files && prj.files.length ? "<br>Uploads: "+prj.files.map(f=>f.name).join(', ') : ""}
            </li>`;
        }
    });
    if (!found) ul.innerHTML = "<li>No projects assigned.</li>";
}
document.getElementById("projectUploadForm").onsubmit = function(e) {
    e.preventDefault();
    const title = this.querySelector('input[type="text"]').value.trim();
    const fileInput = this.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    let rollNo = localStorage.getItem("studentRoll");
    let projects = JSON.parse(localStorage.getItem("projects") || "[]");
    let found = false;
    projects.forEach(prj => {
        if (prj.roll === rollNo && prj.title === title) {
            if (!prj.files) prj.files = [];
            prj.files.push({name: file.name, time: Date.now()});
            prj.status = "In Progress";
            found = true;
        }
    });
    if (found) {
        localStorage.setItem("projects", JSON.stringify(projects));
        document.getElementById("projectUploadMsg").textContent = "Project update uploaded!";
        renderStudentProjects();
    } else {
        document.getElementById("projectUploadMsg").textContent = "No such project assigned.";
    }
    setTimeout(()=>{document.getElementById("projectUploadMsg").textContent = "";}, 1800);
    this.reset();
};

// STUDENT COMPETITIONS
function renderStudentCompetitions() {
    let competitions = JSON.parse(localStorage.getItem("competitions") || "[]");
    const ul = document.getElementById("studentCompetitions");
    ul.innerHTML = "";
    if (!competitions.length) {
        ul.innerHTML = "<li>No competitions available.</li>";
    }
    competitions.forEach(comp => {
        const li = document.createElement("li");
        li.textContent = `${comp.date}: ${comp.name}`;
        ul.appendChild(li);
    });
}
function renderCompetitionBoard() {
    const board = document.getElementById("competitionBoard");
    if(!board) return;
    board.innerHTML = `
        <div class="competition-card card glass">
            <h3>✈️ Aerotron 2.0</h3>
            <p>January 2024</p>
        </div>
        <div class="competition-card card glass">
            <h3>🛩️ IIT Bombay Airbus Aerodesign Challenge</h3>
            <p>December 2024</p>
        </div>
        <div class="competition-card card glass">
            <h3>✈️ Aerotron 3.0</h3>
            <p>February 2025</p>
        </div>
        <div class="competition-card card glass">
            <h3>🚁 SAE DDC</h3>
            <p>April 2025</p>
        </div>
    `;
}

// STUDENT MARKS
function renderStudentMarks() {
    let roll = localStorage.getItem("studentRoll");
    let marks = JSON.parse(localStorage.getItem("marks")||"[]");
    let m = marks.find(mk => mk.roll === roll);
    let tbody = document.querySelector("#studentMarksTable tbody");
    tbody.innerHTML = "";
    if(!m) {
      tbody.innerHTML = "<tr><td colspan='4'>No marks available yet.</td></tr>";
      return;
    }
    tbody.innerHTML += `
      <tr>
        <td>Lab</td>
        <td>All Subjects</td>
        <td>${m.lab && m.lab.mark!==undefined ? m.lab.mark : "-"}</td>
        <td>${m.lab && m.lab.status ? m.lab.status : "-"}</td>
      </tr>
      <tr>
        <td>Exam</td>
        <td>All Subjects</td>
        <td>${m.exam && m.exam.mark!==undefined ? m.exam.mark : "-"}</td>
        <td>-</td>
      </tr>
    `;
}

// Lab Record Upload
document.getElementById("labUpload").onchange = function() {
    document.getElementById("labUploadMsg").textContent = "Logbook uploaded successfully!";
    setTimeout(() => {document.getElementById("labUploadMsg").textContent = "";}, 2000);
};

// Payment
document.getElementById("payNowBtn").onclick = function() {
    document.getElementById("paymentMsg").textContent = "Payment successful!";
    setTimeout(() => {document.getElementById("paymentMsg").textContent = "";}, 2000);
};

// On load
showOnly("landingOptions");
renderCompetitionBoard();
