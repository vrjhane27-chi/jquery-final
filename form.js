$(document).ready(function() {

    // Select the inputs you want to check
    const inputs = ["#student-id", "#fName", "#lName", "#mName", "#age", "#birthday", "#contact-no"];

    inputs.forEach(function(id) {
        $(id)
            .keyup(function() {
                checkBorder($(this));
            })
            .blur(function() {
                checkBorder($(this));
            });
    });

    // Function to check and set border color
    function checkBorder(input) {
        // Skip email — it has special rules
        if (input.attr("id") === "email") return;

        if (input.val().trim() === "") {
            input.css("border", "2px solid red");
        } else {
            input.css("border", "2px solid green");
        }
    }

    // EMAIL VALIDATION
    $("#email")
        .keyup(function () {
            localStorage.setItem(this.id, $(this).val());
        })
        .blur(function () {
            const value = $(this).val();
            if (!value.includes("@") && !$(this).data("alerted")) {
                alert("Email must contain '@' before you can continue.");
                $(this).data("invalid", true);
                $(this).css("border", "2px solid red");
                $(this).data("alerted", true);
                $(this).focus();
            } else if (value.includes("@")) {
                $(this).data("invalid", false);
                $(this).css("border", "2px solid green");
                $(this).data("alerted", false);
            }
        });

    // CONTACT NUMBER VALIDATION 
$("#contact-no")
    .keyup(function() {
        const value = $(this).val();
        localStorage.setItem(this.id, value);

        if (/^\d{10,11}$/.test(value)) {
            $(this).css("border", "2px solid green");
            $(this).data("invalid", false);
            $(this).data("alerted", false);
        } else {
            $(this).css("border", "2px solid red");
        }
    })
    .blur(function() {
    const value = $(this).val();

    if (!/^\d{10,11}$/.test(value)) {
        $(this).css("border", "2px solid red"); // always turn red if invalid
        if (!$(this).data("alerted")) {
            alert("Contact number must be strictly 10-11 digits.");
            $(this).data("invalid", true);
            $(this).data("alerted", true);
            $(this).focus();
        }
    } else {
        $(this).css("border", "2px solid green");
        $(this).data("invalid", false);
        $(this).data("alerted", false);
    }
});



    // BIRTHDATE VALIDATION
    $("#birthday")
        .keyup(function () {
            localStorage.setItem(this.id, $(this).val());
        })
        .blur(function () {
            const value = $(this).val();
            const today = new Date();
            const birth = new Date(value);

            if (birth > today && !$(this).data("alerted")) {
                $("#birthday-error").text("Birthdate cannot be in the future.");
                $(this).css("border", "2px solid red");
                alert("Invalid Birthdate. It cannot be a future date.");
                $(this).data("invalid", true);
                $(this).data("alerted", true);
                $(this).focus();
            } else if (birth <= today) {
                $("#birthday-error").text("");
                $(this).css("border", "2px solid green");
                $(this).data("invalid", false);
                $(this).data("alerted", false);
            }
        });

});

// LINK FUNCTIONS
function linkReg() {
    $("#validate").hide();
    $("#register").css("display", "flex");
}

function linkVal() {
    $("#register").hide();
    $("#validate").css("display", "flex");
}

// BUTTON FUNCTIONS
function openReg() {
    $("#register").css("display", "flex");
    $("#buttons").hide();
}

function openVal() {
    $("#validate").css("display", "flex");
    $("#buttons").hide();
}

// SAVE AND AUTO-LOAD INPUTS (Persistent)
const inputs = $("#reg-form input");

// Load saved values on page load
inputs.each(function() {
    const savedValue = localStorage.getItem(this.id);
    if (savedValue) {
        $(this).val(savedValue);
    }

    // Save on typing
    $(this).keyup(function() {
        localStorage.setItem(this.id, $(this).val());
    });
});

// REGISTER FORM SUBMIT
$("#reg-form").on("submit", function(e) {
    e.preventDefault();

    const student = {
        studentId: $("#student-id").val(),
        lastName: $("#lName").val(),
        firstName: $("#fName").val(),
        middleName: $("#mName").val(),
        age: $("#age").val(),
        birthday: $("#birthday").val(),
        email: $("#email").val(),
        contact: $("#contact-no").val()
    };

    localStorage.setItem("student_" + student.studentId, JSON.stringify(student));

    alert("Successfully Registered!");
    document.getElementById("reg-form").reset();

    // Clear temporary input saves
    const inputs = document.querySelectorAll("#reg-form input");
    inputs.forEach(input => localStorage.removeItem(input.id));
});

// VALIDATE FORM SUBMIT
document.getElementById("val-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("stId").value;
    const data = localStorage.getItem("student_" + id);

    if (data) {
        const student = JSON.parse(data);
        alert("Student Found:\nName: " + student.firstName + " " + student.lastName);
    } else {
        alert("Student ID not found. Not enrolled.");
    }
});

// VIEW REGISTERED USERS (TOGGLE)
function openList() {
    const userList = document.getElementById("user-list");
    const buttons = document.getElementById("buttons");
    const viewBtn = document.getElementById("view");

    if (userList.style.display === "none" || userList.style.display === "") {
        userList.style.display = "flex";
        buttons.style.display = "none";
        document.getElementById("register").style.display = "none";
        document.getElementById("validate").style.display = "none";

        viewBtn.textContent = "Hide Registered Users";
        loadUsers();
    } else {
        userList.style.display = "none";
        buttons.style.display = "flex";
        viewBtn.textContent = "View Registered Users";
    }
}

// LOAD USERS INTO TABLE
function loadUsers() {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = ""; // clear previous rows

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // skip keys used for auto-save inputs
        if (["student-id","lName","fName","mName","age","birthday","email","contact-no","stId"].includes(key)) continue;

        const data = JSON.parse(localStorage.getItem(key));

        const row = `
            <tr>
                <td>${data.studentId}</td>
                <td>${data.lastName}</td>
                <td>${data.firstName}</td>
                <td>${data.middleName}</td>
                <td>${data.age}</td>
                <td>${data.birthday}</td>
                <td>${data.email}</td>
                <td>${data.contact}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    }
}
