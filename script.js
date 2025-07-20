// Color palette for consistent chart colors
const colorPalette = {
  primary: [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
  ],
  light: [
    "#DBEAFE",
    "#FEE2E2",
    "#D1FAE5",
    "#FEF3C7",
    "#EDE9FE",
    "#CFFAFE",
    "#FCE7F3",
    "#ECFCCB",
  ],
  gender: ["#3B82F6", "#EC4899"], // Blue for male, Pink for female
  grades: ["#10B981", "#F59E0B", "#EF4444"], // Green, Yellow, Red for A, B, C
  subjects: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"],
};

// Navigation functions
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll(".page-content");
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  // Remove active class from all sidebar buttons
  const buttons = document.querySelectorAll(".sidebar-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected page
  document.getElementById(pageId).classList.add("active");

  // Add active class to clicked button
  event.target.closest(".sidebar-btn").classList.add("active");

  // Initialize charts for the active page
  setTimeout(() => {
    initializeChartsForPage(pageId);
  }, 100);
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function addTeacherAssignmentRow() {
  const container = document.getElementById("teacherAssignmentsContainer");
  if (!container) return;
  const div = document.createElement("div");
  div.className = "flex gap-2 mb-2 assignment-row";
  div.innerHTML = `
    <select name="assignmentClass[]" class="border rounded-lg px-3 py-2">
      <option value="">Select Class</option>
      <option value="5A">Grade 5A</option>
      <option value="5B">Grade 5B</option>
      <option value="5C">Grade 5C</option>
      <option value="6A">Grade 6A</option>
      <option value="6B">Grade 6B</option>
      <option value="6C">Grade 6C</option>
      <option value="7A">Grade 7A</option>
      <option value="7B">Grade 7B</option>
      <option value="7C">Grade 7C</option>
      <option value="8A">Grade 8A</option>
      <option value="8B">Grade 8B</option>
      <option value="8C">Grade 8C</option>
      <option value="9A">Grade 9A</option>
      <option value="9B">Grade 9B</option>
      <option value="9C">Grade 9C</option>
      <option value="10A">Grade 10A</option>
      <option value="10B">Grade 10B</option>
      <option value="10C">Grade 10C</option>
    </select>
    <select name="assignmentSubject[]" class="border rounded-lg px-3 py-2">
      <option value="">Select Subject</option>
      <option value="Mathematics">Mathematics</option>
      <option value="English">English</option>
      <option value="Science">Science</option>
      <option value="Social Studies">Social Studies</option>
      <option value="Hindi">Hindi</option>
      <option value="Computer">Computer</option>
      <option value="Other">Other</option>
    </select>
    <button type="button" class="text-red-500 hover:text-red-700" onclick="this.parentElement.remove()" title="Remove"><i class="fas fa-times"></i></button>
  `;
  container.appendChild(div);
}

// Update addTeacher to collect assignments
function addTeacher(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // Collect assignments
  const assignments = [];
  const classFields = form.querySelectorAll('select[name="assignmentClass[]"]');
  const subjectFields = form.querySelectorAll(
    'select[name="assignmentSubject[]"]'
  );
  for (let i = 0; i < classFields.length; i++) {
    const classVal = classFields[i].value;
    const subjectVal = subjectFields[i].value;
    if (classVal && subjectVal) {
      assignments.push({ class: classVal, subject: subjectVal });
    }
  }

  // Collect class teacher assignment
  const classTeacher = form.querySelector('select[name="classTeacher"]').value;

  // Here you would normally send the data to your backend
  alert(
    "Teacher added successfully!\nClass Teacher: " +
      classTeacher +
      "\nAssignments: " +
      JSON.stringify(assignments)
  );
  closeModal("teacherModal");
  form.reset();
  // Optionally clear assignment rows except the first
  const container = document.getElementById("teacherAssignmentsContainer");
  if (container) {
    container.innerHTML = "";
    addTeacherAssignmentRow();
  }
}

function addStudent(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // Here you would normally send the data to your backend
  alert("Student added successfully!");
  closeModal("studentModal");
  form.reset();
}

function submitMarks(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const maxMarks = parseInt(formData.get("maxMarks"));
  const marksObtained = parseInt(formData.get("marksObtained"));

  if (marksObtained > maxMarks) {
    alert("Marks obtained cannot be greater than maximum marks!");
    return;
  }

  // Calculate grade
  const percentage = (marksObtained / maxMarks) * 100;
  let grade = "F";
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B";
  else if (percentage >= 60) grade = "C";
  else if (percentage >= 50) grade = "D";

  // Add to recent entries table
  const tbody = document.getElementById("recentMarks");
  const newRow = tbody.insertRow(0);
  newRow.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
                  formData.get("studentName").split(" - ")[0]
                }</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formData.get(
                  "subject"
                )}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formData.get(
                  "testType"
                )}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${marksObtained}/${maxMarks}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formData.get(
                  "testDate"
                )}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">${grade}</span>
                </td>
            `;

  alert("Marks submitted successfully!");
  form.reset();
}

function clearMarksForm() {
  document.getElementById("marksForm").reset();
}

// Filter functions
function filterStudents() {
  const classFilter = document.getElementById("classFilter").value;
  const divisionFilter = document.getElementById("divisionFilter").value;
  const searchTerm = document
    .getElementById("studentSearch")
    .value.toLowerCase();

  const rows = document.querySelectorAll("#studentsTable tbody tr");

  rows.forEach((row) => {
    const rowClass = row.getAttribute("data-class");
    const rowDivision = row.getAttribute("data-division");
    const rowName = row.getAttribute("data-name").toLowerCase();

    let show = true;

    if (classFilter && rowClass !== classFilter) show = false;
    if (divisionFilter && rowDivision !== divisionFilter) show = false;
    if (searchTerm && !rowName.includes(searchTerm)) show = false;

    row.style.display = show ? "" : "none";
  });
}

// Utility to check if all filters are filled
function areAllMarksFiltersFilled() {
  return (
    document.getElementById("marksClass").value &&
    document.getElementById("marksDivision").value &&
    document.getElementById("marksTest").value &&
    document.getElementById("marksSubject").value &&
    document.getElementById("marksDate").value &&
    document.getElementById("marksMax").value
  );
}

// Enable/disable Load Students button based on filter completion
function updateLoadStudentsBtnState() {
  const btn = document.getElementById("loadStudentsBtn");
  if (!btn) return;
  btn.disabled = !areAllMarksFiltersFilled();
}

// Attach event listeners to all filter fields
[
  "marksClass",
  "marksDivision",
  "marksTest",
  "marksSubject",
  "marksDate",
  "marksMax",
].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", updateLoadStudentsBtnState);
    el.addEventListener("change", updateLoadStudentsBtnState);
  }
});

function handleLoadStudents() {
  if (!areAllMarksFiltersFilled()) {
    alert("Please fill all fields.");
    return;
  }
  loadStudentsForMarks();
}

function loadStudentsForMarks() {
  // Get selected filters
  const classVal = document.getElementById("marksClass")?.value;
  const division = document.getElementById("marksDivision")?.value;
  const subject = document.getElementById("marksSubject")?.value;
  const test = document.getElementById("marksTest")?.value;
  const date = document.getElementById("marksDate")?.value;
  const maxMarks = parseInt(document.getElementById("marksMax")?.value);

  // Only proceed if all filters are selected
  if (!classVal || !division || !subject || !test || !date || !maxMarks) {
    document.getElementById("marksEntryTableContainer").innerHTML = "";
    return;
  }

  // Filter students (ignore year)
  const filtered = studentsData.filter(
    (s) => s.class === classVal && s.division === division
  );

  // Render table
  let html = "";
  if (filtered.length === 0) {
    html =
      '<div class="text-red-500">No students found for this combination.</div>';
  } else {
    html = `<form id="bulkMarksForm" onsubmit="submitBulkMarks(event)">
      <div class="overflow-x-auto">
      <table class="w-full border border-gray-300 rounded-lg mb-4">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 border-b border-gray-300 text-left">Roll No</th>
            <th class="px-4 py-2 border-b border-gray-300 text-left">Name</th>
            <th class="px-4 py-2 border-b border-gray-300 text-left">Marks <span class='text-xs text-gray-500'>(out of ${maxMarks})</span></th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map(
              (s, i) => `
            <tr class="${i % 2 === 0 ? "bg-white" : "bg-gray-50"}">
              <td class="px-4 py-2 border-b border-gray-200">${s.roll}</td>
              <td class="px-4 py-2 border-b border-gray-200">${s.name}</td>
              <td class="px-4 py-2 border-b border-gray-200">
                <input type="number" name="marks_${
                  s.roll
                }" min="0" max="${maxMarks}" required class="border rounded px-2 py-1 w-24" placeholder="0-${maxMarks}" />
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      </div>
      <div class="flex justify-end"><button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit All Marks</button></div>
    </form>`;
  }
  document.getElementById("marksEntryTableContainer").innerHTML = html;
}

function submitBulkMarks(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const classVal = document.getElementById("marksClass").value;
  const division = document.getElementById("marksDivision").value;
  const subject = document.getElementById("marksSubject").value;
  const test = document.getElementById("marksTest").value;
  const date = document.getElementById("marksDate").value;
  const maxMarks = parseInt(document.getElementById("marksMax").value);

  // Collect marks for each student
  const filtered = studentsData.filter(
    (s) => s.class === classVal && s.division === division
  );
  let results = [];
  for (const s of filtered) {
    const marks = formData.get("marks_" + s.roll);
    if (
      marks === null ||
      marks === "" ||
      isNaN(marks) ||
      marks < 0 ||
      marks > maxMarks
    ) {
      alert(`Please enter valid marks for ${s.name} (0-${maxMarks})`);
      return;
    }
    results.push({
      roll: s.roll,
      name: s.name,
      marks: marks,
      subject,
      test,
      date,
      class: classVal,
      division,
    });
  }
  // Here you would send results to backend or process as needed
  alert("Marks submitted for " + results.length + " students!");
  // Optionally clear the table
  document.getElementById("marksEntryTableContainer").innerHTML = "";
}

// Chart initialization functions
function initializeChartsForPage(pageId) {
  switch (pageId) {
    case "dashboard":
      initializeDashboardCharts();
      break;
    case "teachers":
      initializeTeacherCharts();
      break;
    case "students":
      initializeStudentCharts();
      break;
    case "courses":
      initializeCourseCharts();
      break;
  }
}

function initializeDashboardCharts() {
  // Subject Performance Chart (replacing Student Enrollment by Grade)
  const subjectCtx = document.getElementById("subjectPerformanceChart");
  if (subjectCtx) {
    new Chart(subjectCtx, {
      type: "bar",
      data: {
        labels: [
          "Mathematics",
          "English",
          "Science",
          "Social Studies",
          "Hindi",
          "Computer",
        ],
        datasets: [
          {
            label: "Subject-wise Performance (Average)",
            data: [85, 78, 82, 76, 80, 88],
            backgroundColor: colorPalette.primary.slice(0, 6),
            borderColor: colorPalette.primary.slice(0, 6),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // Grade Distribution Chart
  const gradeCtx = document.getElementById("gradeDistributionChart");
  if (gradeCtx) {
    new Chart(gradeCtx, {
      type: "bar",
      data: {
        labels: [
          "Grade 5",
          "Grade 6",
          "Grade 7",
          "Grade 8",
          "Grade 9",
          "Grade 10",
        ],
        datasets: [
          {
            label: "Division A",
            data: [45, 42, 48, 46, 44, 41],
            backgroundColor: colorPalette.primary[2],
          },
          {
            label: "Division B",
            data: [43, 44, 46, 45, 42, 43],
            backgroundColor: colorPalette.primary[3],
          },
          {
            label: "Division C",
            data: [41, 43, 44, 43, 41, 42],
            backgroundColor: colorPalette.primary[0],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
      },
    });
  }

  // Gender Distribution Chart
  const genderCtx = document.getElementById("genderChart");
  if (genderCtx) {
    new Chart(genderCtx, {
      type: "doughnut",
      data: {
        labels: ["Male", "Female"],
        datasets: [
          {
            data: [647, 600],
            backgroundColor: colorPalette.gender,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  // Attendance Trends Chart
  const attendanceCtx = document.getElementById("attendanceChart");
  if (attendanceCtx) {
    new Chart(attendanceCtx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Attendance %",
            data: [94, 92, 95, 93, 96, 94, 93, 95, 94, 96, 95, 94],
            borderColor: colorPalette.primary[0],
            backgroundColor: colorPalette.light[0],
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 85,
            max: 100,
          },
        },
      },
    });
  }
}

function initializeTeacherCharts() {
  // Teachers by Department Chart
  const deptCtx = document.getElementById("teacherDepartmentChart");
  if (deptCtx) {
    new Chart(deptCtx, {
      type: "pie",
      data: {
        labels: [
          "Mathematics",
          "English",
          "Science",
          "Social Studies",
          "Languages",
          "Others",
        ],
        datasets: [
          {
            data: [15, 12, 14, 10, 8, 19],
            backgroundColor: colorPalette.primary.slice(0, 6),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  // Teacher Experience Distribution Chart
  const expCtx = document.getElementById("teacherExperienceChart");
  if (expCtx) {
    new Chart(expCtx, {
      type: "bar",
      data: {
        labels: [
          "0-2 years",
          "3-5 years",
          "6-10 years",
          "11-15 years",
          "15+ years",
        ],
        datasets: [
          {
            label: "Number of Teachers",
            data: [8, 15, 25, 20, 10],
            backgroundColor: colorPalette.primary[2],
            borderColor: colorPalette.primary[2],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

function initializeStudentCharts() {
  // Class-wise Student Count Chart
  const classCtx = document.getElementById("studentClassChart");
  if (classCtx) {
    new Chart(classCtx, {
      type: "bar",
      data: {
        labels: [
          "Grade 5",
          "Grade 6",
          "Grade 7",
          "Grade 8",
          "Grade 9",
          "Grade 10",
        ],
        datasets: [
          {
            label: "Number of Students",
            data: [129, 133, 138, 134, 127, 136],
            backgroundColor: colorPalette.primary[0],
            borderColor: colorPalette.primary[0],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // GPA Distribution Chart
  const gpaCtx = document.getElementById("studentGPAChart");
  if (gpaCtx) {
    new Chart(gpaCtx, {
      type: "doughnut",
      data: {
        labels: ["4.0-3.5", "3.5-3.0", "3.0-2.5", "2.5-2.0", "Below 2.0"],
        datasets: [
          {
            data: [312, 456, 298, 134, 47],
            backgroundColor: [
              colorPalette.primary[2],
              colorPalette.primary[3],
              colorPalette.primary[0],
              colorPalette.primary[1],
              colorPalette.primary[4],
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}

function initializeCourseCharts() {
  // Course Performance Chart
  const courseCtx = document.getElementById("coursePerformanceChart");
  if (courseCtx) {
    new Chart(courseCtx, {
      type: "radar",
      data: {
        labels: [
          "Mathematics",
          "English",
          "Science",
          "Social Studies",
          "Hindi",
          "Computer",
        ],
        datasets: [
          {
            label: "Average Score",
            data: [85, 78, 82, 76, 80, 88],
            borderColor: colorPalette.primary[0],
            backgroundColor: colorPalette.light[0],
            pointBackgroundColor: colorPalette.primary[0],
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: colorPalette.primary[0],
          },
          {
            label: "Pass Rate",
            data: [92, 89, 94, 87, 91, 96],
            borderColor: colorPalette.primary[2],
            backgroundColor: colorPalette.light[2],
            pointBackgroundColor: colorPalette.primary[2],
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: colorPalette.primary[2],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};

// --- Teacher Directory Data and Functions ---
let teachersData = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.mitchell@school.edu",
    phone: "1234567890",
    dob: "1980-05-10",
    gender: "Female",
    experience: 12,
    subject: "Mathematics",
    assignments: [
      { class: "9A", subject: "Mathematics" },
      { class: "9B", subject: "Mathematics" },
      { class: "10A", subject: "Mathematics" },
    ],
    classTeacher: "9A",
    doj: "2010-08-01",
    teacherType: "Teaching",
    status: "Active",
  },
  {
    id: 2,
    firstName: "John",
    lastName: "Davis",
    email: "john.davis@school.edu",
    phone: "2345678901",
    dob: "1985-09-15",
    gender: "Male",
    experience: 8,
    subject: "English",
    assignments: [
      { class: "8A", subject: "English" },
      { class: "8B", subject: "English" },
      { class: "8C", subject: "English" },
    ],
    classTeacher: "",
    doj: "2015-07-15",
    teacherType: "Teaching",
    status: "Active",
  },
];
let editTeacherId = null;

function renderTeachersTable() {
  const tbody = document.getElementById("teachersTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const search =
    document.getElementById("teacherSearch")?.value.toLowerCase() || "";
  teachersData
    .filter((t) =>
      (t.firstName + " " + t.lastName).toLowerCase().includes(search)
    )
    .forEach((teacher) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            ${teacher.firstName[0]}${teacher.lastName[0]}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">${teacher.firstName} ${
        teacher.lastName
      }</p>
            <p class="text-sm text-gray-500">${teacher.email}</p>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
        teacher.subject || "-"
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teacher.assignments
        .map((a) => a.class)
        .join(", ")}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
        teacher.experience
      } years</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">${
          teacher.status
        }</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button class="text-blue-600 hover:underline" onclick="editTeacher(${
          teacher.id
        })">Edit</button>
      </td>
    `;
      tbody.appendChild(tr);
    });
}

function filterTeachers() {
  renderTeachersTable();
}

function editTeacher(id) {
  const teacher = teachersData.find((t) => t.id === id);
  if (!teacher) return;
  editTeacherId = id;
  // Open modal and pre-fill form
  openModal("teacherModal");
  document.querySelector("#teacherModal h3").textContent = "Edit Teacher";
  document.querySelector('#teacherForm button[type="submit"]').textContent =
    "Save Changes";
  // Fill fields
  const form = document.getElementById("teacherForm");
  form.firstName.value = teacher.firstName;
  form.lastName.value = teacher.lastName;
  form.email.value = teacher.email;
  form.phone.value = teacher.phone;
  form.dob.value = teacher.dob;
  form.gender.value = teacher.gender;
  form.experience.value = teacher.experience;
  form.classTeacher.value = teacher.classTeacher || "";
  form.doj.value = teacher.doj;
  form.teacherType.value = teacher.teacherType;
  // Clear and fill assignments
  const container = document.getElementById("teacherAssignmentsContainer");
  container.innerHTML = "";
  (teacher.assignments || []).forEach((a) => {
    const div = document.createElement("div");
    div.className = "flex gap-2 mb-2 assignment-row";
    div.innerHTML = `
      <select name="assignmentClass[]" class="border rounded-lg px-3 py-2">
        <option value="">Select Class</option>
        <option value="5A">Grade 5A</option>
        <option value="5B">Grade 5B</option>
        <option value="5C">Grade 5C</option>
        <option value="6A">Grade 6A</option>
        <option value="6B">Grade 6B</option>
        <option value="6C">Grade 6C</option>
        <option value="7A">Grade 7A</option>
        <option value="7B">Grade 7B</option>
        <option value="7C">Grade 7C</option>
        <option value="8A">Grade 8A</option>
        <option value="8B">Grade 8B</option>
        <option value="8C">Grade 8C</option>
        <option value="9A">Grade 9A</option>
        <option value="9B">Grade 9B</option>
        <option value="9C">Grade 9C</option>
        <option value="10A">Grade 10A</option>
        <option value="10B">Grade 10B</option>
        <option value="10C">Grade 10C</option>
      </select>
      <select name="assignmentSubject[]" class="border rounded-lg px-3 py-2">
        <option value="">Select Subject</option>
        <option value="Mathematics">Mathematics</option>
        <option value="English">English</option>
        <option value="Science">Science</option>
        <option value="Social Studies">Social Studies</option>
        <option value="Hindi">Hindi</option>
        <option value="Computer">Computer</option>
        <option value="Other">Other</option>
      </select>
      <button type="button" class="text-red-500 hover:text-red-700" onclick="this.parentElement.remove()" title="Remove"><i class="fas fa-times"></i></button>
    `;
    div.querySelector('select[name="assignmentClass[]"]').value = a.class;
    div.querySelector('select[name="assignmentSubject[]"]').value = a.subject;
    container.appendChild(div);
  });
  if (!teacher.assignments || teacher.assignments.length === 0)
    addTeacherAssignmentRow();
}

// Update addTeacher to handle add/edit
function addTeacher(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  // Collect assignments
  const assignments = [];
  const classFields = form.querySelectorAll('select[name="assignmentClass[]"]');
  const subjectFields = form.querySelectorAll(
    'select[name="assignmentSubject[]"]'
  );
  for (let i = 0; i < classFields.length; i++) {
    const classVal = classFields[i].value;
    const subjectVal = subjectFields[i].value;
    if (classVal && subjectVal) {
      assignments.push({ class: classVal, subject: subjectVal });
    }
  }
  // Collect class teacher assignment
  const classTeacher = form.querySelector('select[name="classTeacher"]').value;
  // Gather other fields
  const teacherObj = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    phone: form.phone.value,
    dob: form.dob.value,
    gender: form.gender.value,
    experience: form.experience.value,
    classTeacher,
    assignments,
    doj: form.doj.value,
    teacherType: form.teacherType.value,
    status: "Active",
    subject: assignments.length > 0 ? assignments[0].subject : "",
  };
  if (editTeacherId) {
    // Edit mode
    const idx = teachersData.findIndex((t) => t.id === editTeacherId);
    if (idx !== -1) {
      teachersData[idx] = { ...teachersData[idx], ...teacherObj };
    }
  } else {
    // Add mode
    teacherObj.id = Date.now();
    teachersData.push(teacherObj);
  }
  closeModal("teacherModal");
  form.reset();
  // Optionally clear assignment rows except the first
  const container = document.getElementById("teacherAssignmentsContainer");
  if (container) {
    container.innerHTML = "";
    addTeacherAssignmentRow();
  }
  // Reset modal to add mode
  document.querySelector("#teacherModal h3").textContent = "Add New Teacher";
  document.querySelector('#teacherForm button[type="submit"]').textContent =
    "Add Teacher";
  editTeacherId = null;
  renderTeachersTable();
}

// Reset modal to add mode when closed
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  // Reset modal to add mode
  if (modalId === "teacherModal") {
    document.querySelector("#teacherModal h3").textContent = "Add New Teacher";
    document.querySelector('#teacherForm button[type="submit"]').textContent =
      "Add Teacher";
    editTeacherId = null;
  }
}

// --- Student Directory Data and Functions ---
let studentsData = [
  {
    id: 1,
    rollNumber: "2024001",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@student.edu",
    dob: "2012-03-15",
    gender: "Female",
    classAssignment: "5A",
    division: "A",
    gpa: 3.8,
    status: "Active",
    parentName: "Mary Johnson",
    parentPhone: "9876543210",
    address: "123 Main St, City",
  },
  {
    id: 2,
    rollNumber: "2024002",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@student.edu",
    dob: "2011-07-22",
    gender: "Male",
    classAssignment: "7B",
    division: "B",
    gpa: 3.4,
    status: "Active",
    parentName: "John Smith",
    parentPhone: "8765432109",
    address: "456 Oak Ave, City",
  },
  {
    id: 3,
    rollNumber: "2024003",
    firstName: "Carol",
    lastName: "Davis",
    email: "carol.davis@student.edu",
    dob: "2010-11-05",
    gender: "Female",
    classAssignment: "9C",
    division: "C",
    gpa: 3.6,
    status: "Active",
    parentName: "Linda Davis",
    parentPhone: "7654321098",
    address: "789 Pine Rd, City",
  },
];
let editStudentId = null;

function renderStudentsTable() {
  const tbody = document.querySelector("#studentsTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const search =
    document.getElementById("studentSearch")?.value.toLowerCase() || "";
  const classFilter = document.getElementById("classFilter")?.value || "";
  const divisionFilter = document.getElementById("divisionFilter")?.value || "";
  studentsData
    .filter((s) => {
      const fullName = (s.firstName + " " + s.lastName).toLowerCase();
      let show = true;
      if (classFilter && !s.classAssignment.startsWith(classFilter))
        show = false;
      if (divisionFilter && s.division !== divisionFilter) show = false;
      if (search && !fullName.includes(search)) show = false;
      return show;
    })
    .forEach((student) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
          student.rollNumber
        }</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="h-8 w-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              ${student.firstName[0]}${student.lastName[0]}
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">${
                student.firstName
              } ${student.lastName}</p>
              <p class="text-sm text-gray-500">${student.email || ""}</p>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Grade ${student.classAssignment.replace(
          /[^0-9]/g,
          ""
        )}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
          student.division
        }</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
          student.gpa || "-"
        }</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">${
            student.status
          }</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button class="text-blue-600 hover:underline" onclick="editStudent(${
            student.id
          })">Edit</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
}

function filterStudents() {
  renderStudentsTable();
}

function editStudent(id) {
  const student = studentsData.find((s) => s.id === id);
  if (!student) return;
  editStudentId = id;
  openModal("studentModal");
  document.querySelector("#studentModal h3").textContent = "Edit Student";
  document.querySelector('#studentForm button[type="submit"]').textContent =
    "Save Changes";
  const form = document.getElementById("studentForm");
  form.rollNumber.value = student.rollNumber;
  form.firstName.value = student.firstName;
  form.lastName.value = student.lastName;
  form.dob.value = student.dob;
  form.gender.value = student.gender;
  form.classAssignment.value = student.classAssignment;
  form.parentName.value = student.parentName;
  form.parentPhone.value = student.parentPhone;
  form.address.value = student.address;
}

function addStudent(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const studentObj = {
    rollNumber: form.rollNumber.value,
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    dob: form.dob.value,
    gender: form.gender.value,
    classAssignment: form.classAssignment.value,
    division: form.classAssignment.value.slice(-1),
    gpa: form.gpa ? parseFloat(form.gpa.value) : undefined,
    status: "Active",
    parentName: form.parentName.value,
    parentPhone: form.parentPhone.value,
    address: form.address.value,
    email: form.email ? form.email.value : undefined,
  };
  if (editStudentId) {
    // Edit mode
    const idx = studentsData.findIndex((s) => s.id === editStudentId);
    if (idx !== -1) {
      studentsData[idx] = { ...studentsData[idx], ...studentObj };
    }
  } else {
    // Add mode
    studentObj.id = Date.now();
    studentsData.push(studentObj);
  }
  closeModal("studentModal");
  form.reset();
  editStudentId = null;
  document.querySelector("#studentModal h3").textContent = "Add New Student";
  document.querySelector('#studentForm button[type="submit"]').textContent =
    "Add Student";
  renderStudentsTable();
}

// Reset modal to add mode when closed
const originalCloseModal = closeModal;
closeModal = function (modalId) {
  originalCloseModal(modalId);
  if (modalId === "studentModal") {
    document.querySelector("#studentModal h3").textContent = "Add New Student";
    document.querySelector('#studentForm button[type="submit"]').textContent =
      "Add Student";
    editStudentId = null;
  }
};

document.addEventListener("DOMContentLoaded", function () {
  renderTeachersTable();
  renderStudentsTable();
  // Set default academic year in dropdown
  const yearSelect = document.getElementById("academicYearSelect");
  if (yearSelect) {
    const now = new Date();
    let startYear =
      now.getMonth() >= 4 ? now.getFullYear() : now.getFullYear() - 1;
    let endYear = startYear + 1;
    let value = `${startYear}-${String(endYear).slice(-2)}`;
    for (let i = 0; i < yearSelect.options.length; i++) {
      if (yearSelect.options[i].value === value) {
        yearSelect.selectedIndex = i;
        break;
      }
    }
    yearSelect.addEventListener("change", function () {
      // TODO: Update dashboard data based on selected year
      // You can call a function here to reload data/charts for the selected year
      // Example: updateDashboardForYear(yearSelect.value);
    });
  }
});
