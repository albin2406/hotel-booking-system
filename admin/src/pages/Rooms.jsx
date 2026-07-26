import { useEffect, useState } from "react";
import api from "../api/axios";
import { SERVER_URL } from "../api/config.js"

const EMPTY = {
  roomNumber: "",
  type: "",
  price: "",
  description: "",
  maxGuest: "",
  amenities: "",
  status: "available",
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewRoom, setViewRoom] = useState(null);

  const fetchRooms = async () => {
    const { data } = await api.get("/rooms");
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const [existingImages, setExistingImages] = useState([]);

  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setImages([]);
    setExistingImages([]);
    setModal(true);
  };

  const openEdit = (r) => {
    setForm({
      roomNumber: r.roomNumber || "",
      type: r.type || "",
      price: r.price || "",
      description: r.description || "",
      maxGuest: r.maxGuest || "",
      amenities: r.amenities?.join(", ") || "",
      status: r.status || "available",
    });

    setExistingImages(r.images || []);
    setEditId(r._id);
    setImages([]);
    setModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      fd.append(k, v);
    });

    for (const img of images) {
      fd.append("images", img);
    }

    try {
      if (editId) {
        await api.put(`/rooms/${editId}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/rooms/add", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setModal(false);
      setForm(EMPTY);
      setImages([]);
      setExistingImages([]);
      setEditId(null);
      fetchRooms();
    } catch (e) {
      alert(e.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this room?")) return;
    await api.delete(`/rooms/${id}`);
    fetchRooms();
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Add Room
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                {[
                  "Image",
                  "Room No",
                  "Type",
                  "Price",
                  "Max Guests",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rooms.map((r) => (
                <tr
                  key={r._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setViewRoom(r)}
                >
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {r.images?.length > 0 ? (
                        r.images
                          .slice(0, 3)
                          .map((img, index) => (
                            <img
                              key={index}
                              src={`${SERVER_URL}${img}`}
                              alt=""
                              className="w-12 h-12 object-cover rounded"
                            />
                          ))
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded" />
                      )}
                      {r.images?.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{r.images.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{r.roomNumber}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap">₹{r.price}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.maxGuest}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        r.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(r);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(r._id);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Room {viewRoom.roomNumber}</h2>

              <button
                onClick={() => setViewRoom(null)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <strong>Type:</strong> {viewRoom.type}
              </div>

              <div>
                <strong>Price:</strong> ₹{viewRoom.price}
              </div>

              <div>
                <strong>Max Guests:</strong> {viewRoom.maxGuest}
              </div>

              <div>
                <strong>Status:</strong> {viewRoom.status}
              </div>
            </div>

            <div className="mb-4">
              <strong>Amenities:</strong>
              <p>{viewRoom.amenities?.join(", ")}</p>
            </div>

            <div className="mb-6">
              <strong>Description:</strong>
              <p>{viewRoom.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Room Images</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {viewRoom.images?.map((img, index) => (
                  <img
                    key={index}
                    src={`${SERVER_URL}${img}`}
                    alt=""
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit Room" : "Add Room"}
            </h2>
            <div className="space-y-3">
              {[
                {
                  key: "roomNumber",
                  placeholder: "Room Number (101)",
                },

                {
                  key: "price",
                  placeholder: "Price Per Night",
                  type: "number",
                },

                {
                  key: "maxGuest",
                  placeholder: "Max Guests",
                  type: "number",
                },

                {
                  key: "amenities",
                  placeholder: "Amenities (comma separated)",
                },
              ].map(({ key, placeholder, type }) => (
                <input
                  key={key}
                  type={type || "text"}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Room Type</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Family">Family</option>
              </select>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={(e) => {
                  setImages((prev) => [...prev, ...Array.from(e.target.files)]);
                }}
                className="text-sm"
              />
              {existingImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Current Images</p>

                  <div className="flex gap-2 flex-wrap">
                    {existingImages.map((img, index) => (
                      <img
                        key={index}
                        src={`${SERVER_URL}${img}`}
                        alt=""
                        className="w-20 h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
              {images.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">New Images</p>

                  <div className="flex gap-2 flex-wrap">
                    {images.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="w-20 h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setModal(false)}
                className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}