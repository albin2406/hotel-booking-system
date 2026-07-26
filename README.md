# Hotel Room Booking System

A full-stack Hotel Room Booking System built using the MERN Stack. The application allows users to search available rooms, make bookings, complete secure payments, and manage their reservations. An admin dashboard is provided to manage rooms, bookings, users, and customer reviews.

---

## Tech Stack

### Frontend (User)
- React.js
- React Router
- Axios
- Bootstrap
- CSS

### Admin Dashboard
- React.js
- React Router
- Axios
- Bootstrap
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Stripe Payment Gateway

---

## Features

### User Features

- User registration and login
- Search available rooms by check-in, check-out and guest count
- Browse available rooms
- View room details with multiple images
- Book available rooms
- Secure online payment using Stripe
- View booking history
- Submit hotel reviews
- Read customer reviews

### Admin Features

- Secure admin authentication
- Add new rooms
- Edit room details
- Delete rooms
- Upload multiple room images
- View all registered users
- View all bookings
- Approve or reject booking requests
- Delete customer reviews

---

## Booking Workflow

1. User logs into the application.
2. Searches rooms using check-in, check-out and guest count.
3. Available rooms are displayed based on booking availability.
4. User selects a room and submits a booking request.
5. Admin reviews the booking request.
6. If approved, the user completes payment through Stripe.
7. User can view booking history and submit a review after their stay.

---

## Project Structure

```
hotel-booking-system
│
├── frontend/        # User Application
├── admin/           # Admin Dashboard
├── backend/         # REST API & Database
└── README.md
```

---

## Database Collections

- Users
- Rooms
- Bookings
- Reviews

---

## Installation

Clone the repository

```bash
git clone https://github.com/your-username/hotel-room-booking-system.git
```

Install dependencies for each project.

### Backend

```bash
cd backend
npm install
```

### User Frontend

```bash
cd frontend
npm install
```

### Admin Dashboard

```bash
cd admin
npm install
```

---

## Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

### Start User Frontend

```bash
cd frontend
npm run dev
```

Runs on:

```
http://localhost:5173
```

### Start Admin Dashboard

```bash
cd admin
npm run dev
```

Runs on:

```
http://localhost:5174
```

---

## Main Functionalities

- JWT-based user authentication
- Room availability checking based on booking dates
- Booking approval system
- Stripe payment integration
- Image upload using Multer
- Customer review management
- Responsive user and admin interfaces

---

## Future Improvements

- Email confirmation after booking
- Booking cancellation
- Room-specific reviews
- Dashboard analytics
- Booking completion status
- Wishlist / Favorite rooms

---