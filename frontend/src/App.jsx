import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/homepage/Home";
import Booking from "./pages/booking/Booking";
import MyBookings from "./pages/mybookings/MyBookings";
import Rooms from "./components/homepage/rooms/Rooms";
import RoomDetails from "./pages/roomdetails/RoomDetails";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import PrivateRoute from "./pages/PrivateRoute";
import CreateReview from "./pages/createReview/CreateReview";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/room/:id" element={<RoomDetails />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      <Route
        path="/booking/:id"
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/write-review" element={<CreateReview />} />
    </Routes>
  );
}

export default App;
