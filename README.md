# 🚀 Task Management System

A modern, responsive Task Management application built with **Angular**. This system allows users to efficiently create, track, and manage daily tasks with a focus on clean UI/UX and reactive state management.

---

## 🎥 Project Demo

[▶️ Watch Task Management System Demo](https://github.com/adheeb123/task-management-system/blob/task-managment/TaskManagementSystem.mp4)

---

## 🛠 Tech Stack

* **Frontend:** Angular (16)  
* **Styling:** NG Bootstrap (15)
* **State Management:** RxJS (Observables & Subjects)  
* **Forms:** Reactive Forms / ngx-formly  

---

## ✨ Key Features

* **Task Dashboard:** A bird's-eye view of all pending and completed tasks.  
* **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop views using Bootstrap.  
* **Toast Notifications:** Real-time feedback for actions like deleting or updating tasks.  
* **Status Tracking:** Dynamic badges to track progress.  

---

# 🚀 Getting Started

## Prerequisites

Before running this project, make sure you are using **Node.js v20**.

### Install NVM (Node Version Manager)
Download and install NVM from:  
https://github.com/coreybutler/nvm-windows

### Install and Use Node.js v20
```bash
nvm install 20
nvm use 20
node -v


To run the application successfully, you must start both the Angular Frontend and the Mock Server Backend at the same time.

1️⃣ Start the Angular Frontend

Run the Angular development server:

ng s

Frontend URL:
http://localhost:4200/

2️⃣ Start the Mock Server (JSON Server)

Open a new terminal in the project folder and run:

npx json-server --watch db.json --port 3000

This command will:

Run the mock backend server
Watch your db.json file for changes
Start the API on Port 3000

Mock Server URL:
http://localhost:3000/