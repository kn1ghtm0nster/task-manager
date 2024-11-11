# Task Manager

This repository contains a full-stack Task Manager application with a client-side UI (using `React` / `Next.js`) and a server-side API (`Node.js` / `Express`). Both parts work together to enable task management functionality, including adding, editing, and deleting tasks. This guide will walk you through installing, running, and understanding each part of the project.

---

## Table of Contents

- [Project Overview](#project-overview)

- [Installation](#installation)

- [Running the Project](#running-the-project)

- [File Structure](#file-structure)

- [Technologies Used](#technologies-used)

- [Contributing](#contributing)

---

## Project Overview

This application is split into **TWO** main sections:

- **Client :** The front-end user interface, built with `React` / `Next.js` and styled with `Tailwind CSS`.

- **Server :** The backend API, built with `Node.js` and `Express` providing `RESTful` endpoints for managing tasks.

---

## Installation

Before you begin, ensure you have the following installed:

- `Node.js` (version `14.x` or higher)

- `npm` (comes with `Node.js`)

**Step 1: Clone the Repo\***

```bash
git clone https://github.com/kn1ghtm0nster/task-manager.git
cd task-manager
```

**Step 2: Install Dependencies for Client and Server**

Navigate to the root project directory (AKA `task-manager`), and install dependencies for both the `client` and `server` folders.

**Installing Server Dependencies**

1. Navigate to the `server` folder:

   ```bash
   cd server
   ```

2. Install `server` dependencies:

   ```bash
   npm install
   ```

**Installing Client Dependencies**

1. Return to the `root` project folder:

   ```bash
   cd ..
   ```

2. Navigate to the `client` folder

   ```bash
   cd client
   ```

3. Install `client` dependencies

   ```bash
   npm install
   ```

---

## Running the Project

This project **REQUIRES** both the client and server to be running. Below are the instructions for each.

**Running the Server**

1. Navigate to the `server` directory (if not already there):

   ```bash
   cd server
   ```

2. Start the server:

   ```bash
   npm start
   ```

   **NOTE :** The server will start on a predefined port (e.g. `http://localhost:5000`).

**Running the Client**

1. Open a new terminal and navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Start the client:

   ```bash
   npm run dev
   ```

   **NOTE :** The client will start on a different port (e.g. `http://localhost:3000`)

---

## File Structure

```plaintext
Task-Manager/
├── client/                  # Frontend files (React/Next.js)
│   ├── src/
│   ├── public/
│   ├── .eslintrc.json
│   ├── next.config.mjs
│   ├── package.json
│   └── README.md (to be removed)
├── server/                  # Backend files (Node.js/Express)
│   ├── src/
│   ├── tests/
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── .github/                 # GitHub Actions configuration
└── README.md                # Main README file (this file)
```

---

## Technologies Used

- **Frontend :** `React`, `Next.js`, `Tailwind CSS`

  - [React Website](https://react.dev/)

  - [Next.js Docs](https://nextjs.org/docs)

  - [Tailwind CSS Docs](https://tailwindcss.com/docs/installation)

- **Backend :** `Node.js`, `Express`

  - [Node.js Docs](https://nodejs.org/docs/latest-v20.x/api/index.html)

  - [Express.js Docs](https://expressjs.com/)

- **Testing :** `Jest`, `React Testing Library`

  - [Jest Docs](https://jestjs.io/docs/getting-started)

  - [React Testing Lib Docs](https://testing-library.com/docs/react-testing-library/intro/)

- **Version Control :** `Git`, `GitHub`

## Contributing

If you wish to contribute and update this project, please:

1. Fork this Repo

2. Clone your fork and create a new branch for your feature

3. Make your changes and **test thoroughly**

4. Open a Pull Request for review

   - **NOTE :** Please ensure the target branch is `develop` and **NOT** the `main` branch.
