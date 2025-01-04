# Uber Eats Project

A web application that allows users to browse restaurants, view menus, and place orders, with additional functionality for restaurant owners to manage orders. Built using Django for the backend and React for the frontend.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Performance Considerations](#performance-considerations)
- [Screenshots](#screenshots)
- [Git Management](#git-management)

## Project Overview

This project is a clone of the Uber Eats application, designed to allow users to explore restaurants and place orders, while restaurant owners manage menu items and orders ( with order updates ) . The project includes two primary user flows:

- **User Flow**: For User login/signup , browsing, ordering, marking favorite restaurants and viewing order history.
- **Restaurant Owner Flow**: For managing orders ( and status ) as well as  updating restaurant information.

## Features

### User Side
- Login / Signup
- Restaurant browsing and menu viewing.
- Add dishes to cart and place orders.
- Order history with detailed order tracking.
- Favorite Restaurant selection.

### Restaurant Owner Side
- Restaurant dashboard with Profile Management and Order Management.
- In Order Management :
- View and manage customer orders by status.
- Update order delivery status.
- View customer profiles for each order.
- In Profile Management :
- Update restaurant details and dishes details along with their images.
- View the list of added dishes.
- Edit Dishes after adding the dishes.

## Tech Stack
- **Backend**: Django (Python)
- **Frontend**: React (JavaScript)
- **Database**: SQLite 
- **Deployment**: AWS EC2

## Installation

### Prerequisites : 
- Python 
- Node.js 
- AWS CLI
- Check requirements.txt file for backend and package.json for frontend

### Steps

1. **Clone the repository**:
   git clone https://github.com/username/uber-eats-project.git
2. **Backend Setup (Django):**
   1. cd uber_eats_backend
   2. python3 -m venv .venv //new virtual environment
   3. source .venv/bin/activate
   4. pip install -r requirements.txt
   5. python3 manage.py makemigrations
   6. python3 manage.py migrate
   7. python3 manage.py runserver
3. **Frontend Setup (React):**
   1. cd uber-eats-frontend
   2. npm install
   3. npm start

### Configuration ( for deployment)
1. Environment Variables:
   Define environment variables for database connections, secret keys, and API configurations in a .env file in both backend and frontend folders.
2. AWS Configuration:
   Set up AWS EC2 instance and configure environment variables for remote access and deployment.

### Usage

1. Local Development: Access the frontend at http://localhost:3000 and the backend at http://localhost:8000.
2. Admin Access: Use Django Admin for direct data management, e.g., adding new restaurants or dishes.

### Screenshots
For Screenshots check out the Results Screenshots file.

### Git Management
1. Fork the repository.
2. Create your feature branch: git checkout -b feature/feature-name.
3. Commit your changes: git commit -m 'Add some feature'.
4. Push to the branch: git push origin feature/feature-name.
5. Open a pull request.

Note: The above commands and settings given is done on Mac , some may change while running on windows. Check accordingly.



