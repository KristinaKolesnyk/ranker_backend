# Ranker Backend

This repository contains the backend for the **Ranker** project, a web application that allows users to create lists, compare items, and organize tournaments. The backend is built using **Node.js** with **Express** for handling API requests and **PostgreSQL** as the database.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Technologies](#technologies)
- [API Endpoints](#api-endpoints)
- [Screenshots & Videos](#screenshots--videos)

## Features

- **User authentication**: Handles sign-in, sign-up, and password management.
- **List management**: Allows users to create, update, and delete lists of items.
- **Tournament management**: Facilitates the creation of item-based tournaments with a dynamic bracket system.
- **RESTful API**: Provides well-structured endpoints for CRUD operations on lists, items, and tournaments.

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

## Technologies

- **Node.js**: Runtime environment for building server-side applications.
- **Express**: Web framework for handling API requests.
- **PostgreSQL**: Relational database for storing user data, lists, and tournament information.
- **Knex.js**: SQL query builder for interacting with PostgreSQL.
- **bcryptjs**: Used for hashing user passwords for secure authentication.
- **Multer**: Middleware for handling file uploads.

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

## Screenshots & Videos

A folder called **`/screenshots`** contains demo screenshots of the application.

- **Demo Video**: You can watch the demo video on [Google Drive](https://drive.google.com/file/d/1VphzLdFyHtjBdn0MP5WybtCAW-bC7GQY/view?usp=sharing).
