document.addEventListener("DOMContentLoaded", function () {
    const signupButton = document.getElementById("signup-button");
    const successModal = document.getElementById("success-modal");
    const loginModal = document.getElementById("login-modal");
    const validationModal = document.getElementById("validation-modal");
    const validationMessage = document.getElementById("validation-message");
    const verificationModal = document.getElementById("verification-modal");
    const verifyButton = document.getElementById("verify-button");
    const closeModalButtons = document.querySelectorAll(".close");
    const confirmButton = document.getElementById("confirm-button");
    const loginButton = document.getElementById("login-button");
    const togglePasswordIcons = document.querySelectorAll(".toggle-password");
    const passwordError = document.getElementById("password-error");
    const passwordInput = document.getElementById("password");
    const sendVerificationButton = document.getElementById("send-verification-button");
    const loginForm = document.getElementById("login-form");

    if (passwordInput && passwordError) {
        passwordInput.addEventListener("input", function () {
            if (passwordInput.value.length < 8) {
                passwordError.textContent = "Password must be at least 8 characters long!";
            } else {
                passwordError.textContent = "";
            }
        });
    }

    if (signupButton) {
        signupButton.addEventListener("click", async function () {
            const fullname = document.getElementById("fullname").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const email = document.getElementById("email").value;
            const role = document.getElementById("role").value;
            const verificationCode = document.getElementById("verification-code").value;

            if (!fullname || !username || !password || !email || !confirmPassword || !role) {
                validationModal.style.display = "block";
                validationMessage.textContent = "Please fill in all fields!";
                validationMessage.style.color = 'red';
                return;
            }

            if (password.length < 8) {
                passwordError.textContent = "Password must be at least 8 characters long!";
                return;
            }

            if (password !== confirmPassword) {
                passwordError.textContent = "Passwords do not match!";
                return;
            }

            if (!verificationCode) {
                validationMessage.textContent = "Please enter the verification code!";
                validationModal.style.display = "block";
                return;
            }

            // 🔄 Verify the code before proceeding
            fetch("http://localhost:3000/verify-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code: verificationCode }),
            })
                .then(res => res.json())
                .then(async data => {
                    if (data.success) {
                        // ✅ Code is valid – continue with signup
                        alert("Signup successful!");

                        document.getElementById("success-modal").style.display = "none"; // Hide success modal if visible
                        document.getElementById("login-modal").style.display = "block"; // Show login modal

                    } else {
                        validationMessage.textContent = "Invalid or expired verification code.";
                        validationModal.style.display = "block";
                    }

                    const response = await fetch("http://localhost:3000/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ FULLNAME: fullname, USERNAME: username, PASSWORD: password, EMAIL: email, ROLE: role })
                    });
                })
                .catch(error => {
                    console.error("Verification error:", error);
                    validationMessage.textContent = "Error verifying code. Try again.";
                    validationModal.style.display = "block";
                });


        });
    }

    if (sendVerificationButton) {
        sendVerificationButton.addEventListener("click", async () => {
            const email = document.getElementById("email").value;

            if (!email) {
                alert("Please enter your email address.");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/send-verification-code", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (data.success) {
                    alert("Verification code sent to your email.");
                } else {
                    alert("Failed to send verification code.");
                }
            } catch (err) {
                console.error(err);
                alert("An error occurred while sending the verification code.");
            }
        });
    }

    closeModalButtons.forEach(button => {
        button.addEventListener("click", function () {
            successModal.style.display = "none";
            loginModal.style.display = "none";
            validationModal.style.display = "none";
            verificationModal.style.display = "none";
        });
    });

    if (confirmButton && loginModal && successModal) {
        confirmButton.addEventListener("click", function () {
            successModal.style.display = "none";
            loginModal.style.display = "block";
        });
    }

    window.addEventListener("click", function (event) {
        if ([successModal, loginModal, validationModal, verificationModal].includes(event.target)) {
            successModal.style.display = "none";
            loginModal.style.display = "none";
            validationModal.style.display = "none";
            verificationModal.style.display = "none";
        }
    });

    if (loginButton && loginModal) {
        loginButton.addEventListener("click", function () {
            loginModal.style.display = "block";
        });
    }

    togglePasswordIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            const target = document.getElementById(this.getAttribute("data-target"));
            if (target) {
                if (target.type === "password") {
                    target.type = "text";
                    this.classList.remove("fa-eye-slash");
                    this.classList.add("fa-eye");
                } else {
                    target.type = "password";
                    this.classList.remove("fa-eye");
                    this.classList.add("fa-eye-slash");
                }
            }
        });
    });

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;

            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ USERNAME: username, PASSWORD: password })
            })
                .then(response => {
                    if (response.ok) return response.json(); // ✅ this parses it as JSON
                    else throw new Error('Invalid username or password.');
                })
                .then(data => {
                    console.log('Login successful:', data);

                    if (data.role === 'Student') {
                        window.location.href = 'student.html';
                    } else {
                        window.location.href = 'Professor.html';
                    }

                    console.log(data.role);
                })
                .catch(error => {
                    alert(error.message);
                });
        });
    }
});
localhost