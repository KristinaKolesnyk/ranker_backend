# Ranker Backend

This repository contains the backend for the **Ranker** project, a web application that allows users to create lists, compare items, and organize tournaments. Built with **Node.js** and **Express**, the backend provides a secure and scalable API that enables the frontend to perform CRUD operations (Create, Read, Update, Delete) on lists and items, while also facilitating the advanced tournament ranking system.

## Table of Contents

- [Uniqueness](#uniqueness)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Screenshots & Videos](#screenshots--videos)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Acknowledgements](#acknowledgements)

## Uniqueness

The **Ranker** backend stands out for its robust **tournament ranking system**, which adds an extra layer of engagement to typical item ranking. Users not only rank items based on predefined criteria but also can directly compare items in a tournament format, allowing for more engaging decision-making. Additionally, the backend architecture is designed to handle this complex comparison logic efficiently, providing real-time feedback to the frontend.

## Features

- **User Authentication:** The backend manages user registration and login, allowing users to securely access and manage their lists and rankings.
- **List and Item Management:** The backend provides APIs for creating, updating, and deleting lists of items. Each list is tied to specific criteria for ranking, and the system calculates average ratings and comparisons based on user input.
- **Tournament System:** One of the key features is the **tournament-style comparison**. The backend allows users to organize items into tournament brackets, facilitating head-to-head comparisons to determine the top item in a list.
- **Winner Calculation:** After users complete a tournament, the backend processes and stores the results, updating the winning item for that category and making it available for future reference.
- **Data Persistence:** All user data, lists, rankings, and tournament outcomes are stored securely in a **PostgreSQL** database, ensuring reliable data management and retrieval.
- **RESTful API**: Provides well-structured endpoints for CRUD operations on lists, items, and tournaments.

## Tech Stack

- **Backend:** Node.js and Express.js
- **Database:** PostgreSQL for relational data storage and management.
- **Authentication:** Bcrypt.js for secure password hashing and user authentication.
- **File Handling:** Multer for handling image uploads for items.
- **API Documentation:** RESTful APIs are designed to be easily integrated with the frontend and provide efficient data communication.
- **Real-Time Feedback:** The backend processes user inputs, updates item rankings, and returns real-time updates to the frontend without page reloads.

## Screenshots & Videos

A folder called **`/screenshots`** contains demo screenshots of the application.

- **Demo Video**: You can watch the demo video on [Google Drive](https://drive.google.com/file/d/1VphzLdFyHtjBdn0MP5WybtCAW-bC7GQY/view?usp=sharing).

## API Endpoints

The backend exposes several RESTful API endpoints for interacting with the database. Below is a summary of the most important endpoints:

- **Authentication**:
  - `POST /signin`: Authenticate a user.
  - `POST /signup`: Register a new user.
  
- **Lists**:
  - `POST /createlist`: Create a new list.
  - `DELETE /deleteitem/:itemId`: Delete an item from a list.
  - `GET /categories/:userId`: Get all categories for a user.
  
- **Tournament**:
  - `POST /resetpassword`: Initiate a password reset process.
  - `POST /updatewinner`: Update the winner of a tournament.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KristinaKolesnyk/ranker_backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ranker-backend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the PostgreSQL database. You may use the following command to create the database and the tables:

   ```bash
   createdb rankerdb
   ```

5. Start the development server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3001`.

## Available Scripts

In the project directory, you can run:

- **`npm start`**: Starts the server in development mode using **nodemon** for live reloading.
- **`npm install`**: Installs all required dependencies.
- **`npm run build`**: Prepares the backend for production.

## Acknowledgements

I hope this project helps bring clarity and enjoyment to decision-making processes. Thank you for taking the time to explore Ranker!
