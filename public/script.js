let signupBtn = document.querySelector("#signup-btn");
let signinBtn = document.querySelector("#signin-btn");
let logoutBtn = document.querySelector("#logout-btn");

signupBtn.addEventListener("click", async function signup() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    await axios.post("http://localhost:5000/signup", {
        username: username,
        password: password,
    });

    alert("User created successfully");
});

signinBtn.addEventListener("click", async function signin() {
    const username = document.getElementById("signin-username").value;
    const password = document.getElementById("signin-password").value;

    try {
        const response = await axios.post("http://localhost:5000/signup", {
            username: username,
            password: password,
        });

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);

            alert("Signed in Successfully");

            getUserInformation();
        } else alert("Signin Failed");
    } catch (error) {
        console.error("Error in Signing in", error);
    }
});

async function getUserInformation() {
    try {
        // Send a GET request to the /me endpoint with the authorization token from local storage
        const response = await axios.get("http://localhost:3000/me", {
            headers: {
                // Include the token in the request headers for authentication
                Authorization: localStorage.getItem("token"),
            },
        });

        // Get the div element where user information will be displayed
        const infoDiv = document.getElementById("information");

        // Check if the response contains the user's username
        if (response.data.username) {
            // Display the user's username and password in the information div
            infoDiv.innerText = `Username: ${response.data.username} and Password: ${response.data.password}`;
        } else {
            // Display the response message if no user data is found
            infoDiv.innerText = response.data.message;
        }
    } catch (error) {
        // Log any errors that occur during the process of fetching user information
        console.error("Error while fetching user information:", error);
    }
}

logoutBtn.addEventListener("click", function logout() {
    // Remove the authentication token from local storage
    localStorage.removeItem("token");

    // Alert the user that they have logged out
    alert("You have logged out!");

    // Clear the user information displayed on the page
    document.getElementById("information").innerText = "";
});
