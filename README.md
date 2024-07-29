# Real-time Notifications System

This project is a real-time notification system built using Node.js, Express, Socket.IO, and Mongoose. It includes functionality for user registration, login, product management, and discount notifications. The real-time notifications are sent to connected clients whenever a new product is added or a discount is applied.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Real-time Notifications](#real-time-notifications)
- [License](#license)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Fatmaamr61/real-time-notifications.git
    cd real-time-notifications
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=5005
    MONGO_URI=your_mongo_connection_string
    SALT=your_salt_value
    TOKEN_KEY=your_jwt_secret_key
    ```

4. **Run the server:**

    ```bash
    npm start
    ```

## Usage

### Setting up the Client

1. **Create an `index.html` file:**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Real-time Notifications Test</title>
    </head>
    <body>
        <h1>Real-time Notifications</h1>
        <div id="notifications"></div>

        <!-- Include Socket.IO client library from CDN -->
        <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>
        <script>
            // Establish a connection with the server
            const socket = io("http://localhost:5005");

            // Register the user (use an actual userId from your database)
            socket.emit("register", "userId");

            // Listen for notifications and display them
            socket.on("new-product", (data) => {
                const notification = document.createElement("div");
                notification.textContent = `New product added: ${data.message}`;
                document.getElementById("notifications").appendChild(notification);
            });

            socket.on("new-discount", (data) => {
                const notification = document.createElement("div");
                notification.textContent = `New discount available: ${data.message}`;
                document.getElementById("notifications").appendChild(notification);
            });

            socket.on("inactive-user", (data) => {
                const notification = document.createElement("div");
                notification.textContent = `Inactive user notification: ${data.message}`;
                document.getElementById("notifications").appendChild(notification);
            });
        </script>
    </body>
    </html>
    ```

2. **Open the `index.html` file in a browser to test the real-time notifications.**

### API Endpoints

#### User Authentication

- **Register**: POST `/auth/register`
- **Activate Account**: GET `/auth/confirmEmail/:activationCode`
- **Login**: POST `/auth/login`
- **Logout**: GET `/auth/logout`
- **Delete Account**: DELETE `/auth/account/delete`

#### Product Management

- **Create Product**: POST `/products/new`
- **Add Discount**: PATCH `/products/discount/:productId`
- **Get All Products**: GET `/products`

### Real-time Notifications

The server sends real-time notifications to connected clients for the following events:

- **New Product Added**: Event `new-product`
- **New Discount Applied**: Event `new-discount`
- **Inactive User Notification**: Event `inactive-user`

### License

This project is licensed under the MIT License. 
