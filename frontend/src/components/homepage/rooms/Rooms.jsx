import React, { useEffect, useState } from "react";
import "./rooms.css";
import API from "../../../services/api.js";
import { useLocation, useNavigate } from "react-router-dom";
import RoomCard from "./RoomCard";
import RoomDetails from "../../../pages/roomdetails/RoomDetails";

const Rooms = ({ searchData }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const endpoint =
          searchData?.checkIn && searchData?.checkOut
            ? `/rooms/available?checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`
            : "/rooms";

        const res = await API.get(endpoint);
        setRooms(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRooms();
  }, [searchData]);

  return (
    <>
      <div id="rooms-section" className="rooms-section">
        <div className="rooms-header">
          <span className="rooms-tag">Our Collection</span>
          <h2 className="rooms-title">Curated Rooms & Suites</h2>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onView={() => setSelectedRoom(room)}
            />
          ))}
        </div>

        {selectedRoom && (
          <RoomDetails
            room={selectedRoom}
            searchData={searchData}
            onClose={() => setSelectedRoom(null)}
          />
        )}
      </div>
    </>
  );
};

export default Rooms;
