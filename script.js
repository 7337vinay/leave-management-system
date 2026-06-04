let totalLeaves = 4;

let leaveRequests =
    JSON.parse(localStorage.getItem("leaveRequests")) || [];

let employee =
    JSON.parse(localStorage.getItem("employee")) || {};

// Buttons
document.getElementById("saveEmployeeBtn")
.addEventListener("click", saveEmployee);

document.getElementById("applyLeaveBtn")
.addEventListener("click", applyLeave);

// Save Employee
function saveEmployee() {

    employee.name = document.getElementById("employeeName").value;
    employee.id = document.getElementById("employeeId").value;
    employee.department = document.getElementById("department").value;

    localStorage.setItem("employee", JSON.stringify(employee));

    alert("Employee Saved");
}

// Apply Leave
function applyLeave() {

    let type = document.getElementById("leaveType").value;
    let start = document.getElementById("startDate").value;
    let end = document.getElementById("endDate").value;
    let reason = document.getElementById("reason").value;

    if (!type || !start || !end || !reason) {
        alert("Fill all fields");
        return;
    }

    let days =
        Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;

    let used = calculateUsedLeaves();
    let remaining = totalLeaves - used;

    if (days > remaining) {
        alert("Insufficient Leave Balance");
        return;
    }

    let leave = {
        type,
        days,
        status: "Pending"
    };

    leaveRequests.push(leave);

    localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));

    displayLeaves();
    updateBalance();
}

// Calculate used leaves
function calculateUsedLeaves() {
    let sum = 0;
    leaveRequests.forEach(l => sum += l.days);
    return sum;
}

// Update balance
function updateBalance() {
    document.getElementById("totalLeaves").innerText = totalLeaves;
    document.getElementById("usedLeaves").innerText = calculateUsedLeaves();
    document.getElementById("remainingLeaves").innerText =
        totalLeaves - calculateUsedLeaves();
}

// Display table
function displayLeaves() {

    let table = document.getElementById("leaveTableBody");
    table.innerHTML = "";

    leaveRequests.forEach((l, index) => {

        table.innerHTML += `
        <tr>
            <td>${l.type}</td>
            <td>${l.days}</td>
            <td>${l.status}</td>
            <td><button onclick="deleteLeave(${index})">Delete</button></td>
        </tr>
        `;
    });
}

// Delete leave
function deleteLeave(index) {
    leaveRequests.splice(index, 1);

    localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));

    displayLeaves();
    updateBalance();
}

// Clear all data
function clearAllData() {
    localStorage.clear();
    location.reload();
}

// Load on start
displayLeaves();
updateBalance();