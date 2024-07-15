# Game Dashboard

Game Dashboard is a game management system built with Node.js, MongoDB, and TypeScript. It allows users to register, create their own databases, manage players, view leaderboards, and send/receive friend requests. The application uses JWT for authentication, Socket.IO for real-time notifications, Nodemailer for sending email requests, ZOD for schema validation, and node-cache for efficient stats calculation.

## Features

- **User Registration**: Users can register and manage their own game databases.
- **Player Management**: Users can create and manage player profiles.
- **Authentication**: JWT-based authentication for secure access.
- **Leaderboards**: View and compare player stats on leaderboards.
- **Friend Requests**: Send and receive friend requests with real-time notifications.
- **Email Notifications**: Nodemailer integration for sending friend request emails.
- **Real-Time Updates**: Socket.IO for real-time notifications of friend requests.
- **Schema Validation**: ZOD is used for robust schema validation.
- **Caching**: Node-cache is used to store and efficiently manage player stats.

## Installation

To get started with the Game Dashboard project, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/game-dashboard.git
    cd game-dashboard
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the application:**

    ```bash
    npm start
    ```

## Usage

- **Register**: Sign up to create your own game database.
- **Login**: Authenticate yourself using JWT.
- **Manage Players**: Add, update, and delete player profiles.
- **View Leaderboards**: See the top players and their stats.
- **Friend Requests**: Send and receive friend requests. Receive real-time notifications for friend requests.
- **Email Requests**: Send friend request links via email using Nodemailer.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **TypeScript**: Typed superset of JavaScript.
- **MongoDB**: NoSQL database for storing user and game data.
- **JWT**: JSON Web Tokens for authentication.
- **Socket.IO**: Real-time communication for notifications.
- **Nodemailer**: Send emails for friend requests.
- **ZOD**: Schema validation for request and response validation.
- **node-cache**: In-memory caching for storing and retrieving player stats efficiently.

## Project Structure

    ├── src
    │   ├── controllers
    │   ├── models
    │   ├── routes
    │   ├── services
    │   ├── utils
    │   └── app.ts
    ├── tests
    ├── .env
    ├── package.json
    ├── tsconfig.json
    └── README.md
