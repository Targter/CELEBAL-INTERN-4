// import React, { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import { toast } from "react-toastify";
// import { CSVLink } from "react-csv";
// import { FaPlus, FaSearch } from "react-icons/fa";
// import { useAppContext } from "../context/AppContext";
// import { useTheme } from "../context/TC";
// import { format, isBefore, isAfter } from "date-fns";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// // Setup moment localizer for react-big-calendar
// const localizer = momentLocalizer(moment);

// const CalendarComponent = () => {
//   const { calendarEvents, currentUser } = useAppContext();
//   const { backgroundColor, fontColor, customColor } = useTheme();
//   // Fallback local state since addEvent, updateEvent, deleteEvent are missing
//   const [localEvents, setLocalEvents] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("add");
//   const [selectedEventId, setSelectedEventId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     startDate: "",
//     startTime: "",
//     endDate: "",
//     endTime: "",
//     type: "project",
//   });
//   const [errors, setErrors] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [view, setView] = useState("month");
//   const today = new Date();

//   // Merge calendarEvents and localEvents (prioritize calendarEvents)
//   const allEvents = useMemo(() => {
//     const localEventIds = new Set(localEvents.map((e) => e.id));
//     return [
//       ...calendarEvents.filter((e) => !localEventIds.has(e.id)),
//       ...localEvents,
//     ];
//   }, [calendarEvents, localEvents]);

//   // Transform events for react-big-calendar and filter by search
//   const events = useMemo(() => {
//     return allEvents
//       .filter((event) =>
//         event.title.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//       .map((event) => ({
//         id: event.id,
//         title: event.title,
//         start: new Date(event.start),
//         end: new Date(event.end),
//         type: event.type,
//         color:
//           event.type === "project"
//             ? "#3b82f6"
//             : event.type === "milestone"
//             ? "#10b981"
//             : "#ef4444",
//       }));
//   }, [allEvents, searchQuery]);

//   // Calculate metrics
//   const metrics = useMemo(() => {
//     const totalEvents = allEvents.length;
//     const upcomingEvents = allEvents.filter((e) =>
//       isAfter(new Date(e.start), today)
//     ).length;
//     const lastUpdated = format(today, "MMM dd, yyyy");
//     return { totalEvents, upcomingEvents, lastUpdated };
//   }, [allEvents]);

//   // Prepare CSV data
//   const csvData = useMemo(() => {
//     return [
//       ...allEvents.map((event) => ({
//         Title: event.title,
//         Start: format(new Date(event.start), "yyyy-MM-dd HH:mm"),
//         End: format(new Date(event.end), "yyyy-MM-dd HH:mm"),
//         Type: event.type,
//       })),
//       {},
//       {
//         Title: "Metrics",
//         Start: "",
//         End: "",
//         Type: "",
//       },
//       {
//         Title: "Total Events",
//         Start: metrics.totalEvents,
//         End: "",
//         Type: "",
//       },
//       {
//         Title: "Upcoming Events",
//         Start: metrics.upcomingEvents,
//         End: "",
//         Type: "",
//       },
//       {
//         Title: "Last Updated",
//         Start: metrics.lastUpdated,
//         End: "",
//         Type: "",
//       },
//     ];
//   }, [allEvents, metrics]);

//   // Handle event selection (click to edit/delete)
//   const handleSelectEvent = (event) => {
//     if (currentUser.role !== "Admin") {
//       toast.warning("Only admins can edit events!");
//       return;
//     }
//     setModalMode("edit");
//     setSelectedEventId(event.id);
//     setFormData({
//       title: event.title,
//       startDate: format(event.start, "yyyy-MM-dd"),
//       startTime: format(event.start, "HH:mm:ss"),
//       endDate: format(event.end, "yyyy-MM-dd"),
//       endTime: format(event.end, "HH:mm:ss"),
//       type: event.type,
//     });
//     setIsModalOpen(true);
//   };

//   // Handle slot selection (click to add event)
//   const handleSelectSlot = ({ start, end }) => {
//     if (currentUser.role !== "Admin") {
//       toast.warning("Only admins can add events!");
//       return;
//     }
//     setModalMode("add");
//     setSelectedEventId(null);
//     setFormData({
//       title: "",
//       startDate: format(start, "yyyy-MM-dd"),
//       startTime: format(start, "HH:mm:ss"),
//       endDate: format(end, "yyyy-MM-dd"),
//       endTime: format(end, "HH:mm:ss"),
//       type: "project",
//     });
//     setIsModalOpen(true);
//   };

//   // Handle drag-and-drop or resize
//   const handleEventDrop = ({ event, start, end }) => {
//     if (currentUser.role !== "Admin") {
//       toast.error("Only admins can modify events!");
//       return;
//     }
//     setLocalEvents((prev) =>
//       prev.map((e) =>
//         e.id === event.id
//           ? { ...e, start: start.toISOString(), end: end.toISOString() }
//           : e
//       )
//     );
//     toast.success("Event updated successfully!");
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title) newErrors.title = "Title is required";
//     if (!formData.startDate) newErrors.startDate = "Start date is required";
//     if (!formData.startTime) newErrors.startTime = "Start time is required";
//     if (!formData.endDate) newErrors.endDate = "End date is required";
//     if (!formData.endTime) newErrors.endTime = "End time is required";
//     if (!formData.type) newErrors.type = "Event type is required";
//     if (
//       formData.startDate &&
//       formData.startTime &&
//       formData.endDate &&
//       formData.endTime
//     ) {
//       const start = new Date(`${formData.startDate}T${formData.startTime}`);
//       const end = new Date(`${formData.endDate}T${formData.endTime}`);
//       if (end < start) {
//         newErrors.endDate = "End date/time must be after start date/time";
//       }
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (currentUser.role !== "Admin") {
//       toast.error("Only admins can modify events!");
//       return;
//     }
//     if (validateForm()) {
//       const eventData = {
//         title: formData.title,
//         start: new Date(
//           `${formData.startDate}T${formData.startTime}`
//         ).toISOString(),
//         end: new Date(`${formData.endDate}T${formData.endTime}`).toISOString(),
//         type: formData.type,
//       };
//       if (modalMode === "add") {
//         setLocalEvents((prev) => [
//           ...prev,
//           { ...eventData, id: Date.now().toString() },
//         ]);
//         toast.success("Event added successfully!");
//       } else {
//         setLocalEvents((prev) =>
//           prev.map((e) =>
//             e.id === selectedEventId ? { ...eventData, id: e.id } : e
//           )
//         );
//         toast.success("Event updated successfully!");
//       }
//       setIsModalOpen(false);
//       setFormData({
//         title: "",
//         startDate: "",
//         startTime: "",
//         endDate: "",
//         endTime: "",
//         type: "project",
//       });
//       setErrors({});
//       setModalMode("add");
//       setSelectedEventId(null);
//     }
//   };

//   // Handle event deletion
//   const handleDelete = () => {
//     if (currentUser.role !== "Admin") {
//       toast.error("Only admins can delete events!");
//       return;
//     }
//     if (window.confirm("Are you sure you want to delete this event?")) {
//       setLocalEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
//       toast.success("Event deleted successfully!");
//       setIsModalOpen(false);
//       setFormData({
//         title: "",
//         startDate: "",
//         startTime: "",
//         endDate: "",
//         endTime: "",
//         type: "project",
//       });
//       setErrors({});
//       setModalMode("add");
//       setSelectedEventId(null);
//     }
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setFormData({
//       title: "",
//       startDate: "",
//       startTime: "",
//       endDate: "",
//       endTime: "",
//       type: "project",
//     });
//     setErrors({});
//     setModalMode("add");
//     setSelectedEventId(null);
//   };

//   // Custom event styling
//   const eventPropGetter = (event) => ({
//     style: {
//       backgroundColor: event.color,
//       borderColor: event.color,
//       color: "#ffffff",
//       fontSize: "0.875rem",
//     },
//   });

//   // Custom toolbar for date navigation
//   const CustomToolbar = ({
//     onNavigate,
//     label,
//     onView,
//     views,
//     view: currentView,
//   }) => (
//     <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => onNavigate("PREV")}
//           className="px-3 py-1 rounded-lg text-sm"
//           style={{ backgroundColor: customColor, color: "#ffffff" }}
//         >
//           Prev
//         </button>
//         <span className="text-sm font-semibold" style={{ color: fontColor }}>
//           {label}
//         </span>
//         <button
//           onClick={() => onNavigate("NEXT")}
//           className="px-3 py-1 rounded-lg text-sm"
//           style={{ backgroundColor: customColor, color: "#ffffff" }}
//         >
//           Next
//         </button>
//       </div>
//       <div className="flex items-center gap-2">
//         {views.map((viewOption) => (
//           <button
//             key={viewOption}
//             onClick={() => onView(viewOption)}
//             className={`px-3 py-1 rounded-lg text-sm capitalize ${
//               currentView === viewOption ? "font-semibold" : ""
//             }`}
//             style={{
//               backgroundColor:
//                 currentView === viewOption
//                   ? customColor
//                   : `${backgroundColor}cc`,
//               color: currentView === viewOption ? "#ffffff" : fontColor,
//             }}
//           >
//             {viewOption}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="p-4 sm:p-6 rounded-xl shadow-lg"
//       style={{ backgroundColor, color: fontColor }}
//     >
//       {/* Header and Description */}
//       <motion.div
//         initial={{ y: -10, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl sm:text-2xl font-semibold">Calendar</h2>
//           {currentUser.role === "Admin" && (
//             <button
//               onClick={() => {
//                 setModalMode("add");
//                 setIsModalOpen(true);
//               }}
//               className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors flex items-center text-sm"
//               style={{ backgroundColor: customColor }}
//             >
//               <FaPlus className="w-4 h-4 mr-2" /> Add Event
//             </button>
//           )}
//         </div>
//         <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
//           View and manage your project events, milestones, and tasks. Admins can
//           add, edit, or drag events to reschedule.
//         </p>
//       </motion.div>

//       {/* Search and Export */}
//       <motion.div
//         initial={{ y: 10, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4"
//       >
//         <div className="relative w-full sm:w-1/3">
//           <input
//             type="text"
//             placeholder="Search events by title..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full p-2 pl-8 rounded-lg text-sm"
//             style={{
//               backgroundColor: `${backgroundColor}cc`,
//               color: fontColor,
//               borderColor: `${fontColor}33`,
//             }}
//           />
//           <FaSearch
//             className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
//             style={{ color: `${fontColor}aa` }}
//           />
//         </div>
//         <CSVLink
//           data={csvData}
//           filename="calendar-events.csv"
//           className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-sm flex items-center"
//           style={{ backgroundColor: customColor }}
//         >
//           Export CSV
//         </CSVLink>
//       </motion.div>

//       {/* Calendar */}
//       <motion.div
//         initial={{ y: 10, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.4 }}
//         className="bg-white dark:bg-gray-800 rounded-lg p-4"
//       >
//         {events.length === 0 && searchQuery && (
//           <p
//             className="text-center text-sm p-4"
//             style={{ color: `${fontColor}aa` }}
//           >
//             No events found matching your search.
//           </p>
//         )}
//         {events.length === 0 && !searchQuery && (
//           <p
//             className="text-center text-sm p-4"
//             style={{ color: `${fontColor}aa` }}
//           >
//             No events scheduled. Add an event to get started.
//           </p>
//         )}
//         <Calendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: 650 }}
//           selectable={currentUser.role === "Admin"}
//           onSelectEvent={handleSelectEvent}
//           onSelectSlot={handleSelectSlot}
//           onEventDrop={handleEventDrop}
//           onEventResize={handleEventDrop}
//           draggableAccessor={
//             currentUser.role === "Admin" ? () => true : () => false
//           }
//           resizableAccessor={
//             currentUser.role === "Admin" ? () => true : () => false
//           }
//           date={selectedDate}
//           onNavigate={(date) => setSelectedDate(date)}
//           eventPropGetter={eventPropGetter}
//           components={{
//             toolbar: (props) => <CustomToolbar {...props} view={view} />,
//           }}
//           views={["day", "week", "work_week", "month", "agenda"]}
//           view={view}
//           onView={setView}
//           className="rbc-custom"
//         />
//       </motion.div>

//       {/* Metrics */}
//       <motion.div
//         initial={{ y: 10, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.6 }}
//         className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
//       >
//         <div
//           className="p-4 rounded-lg"
//           style={{
//             backgroundColor: `${backgroundColor}cc`,
//             borderColor: `${fontColor}33`,
//             borderWidth: 1,
//           }}
//         >
//           <p className="text-sm font-semibold" style={{ color: fontColor }}>
//             Total Events
//           </p>
//           <p className="text-lg" style={{ color: fontColor }}>
//             {metrics.totalEvents}
//           </p>
//         </div>
//         <div
//           className="p-4 rounded-lg"
//           style={{
//             backgroundColor: `${backgroundColor}cc`,
//             borderColor: `${fontColor}33`,
//             borderWidth: 1,
//           }}
//         >
//           <p className="text-sm font-semibold" style={{ color: fontColor }}>
//             Upcoming Events
//           </p>
//           <p className="text-lg" style={{ color: fontColor }}>
//             {metrics.upcomingEvents}
//           </p>
//         </div>
//         <div
//           className="p-4 rounded-lg"
//           style={{
//             backgroundColor: `${backgroundColor}cc`,
//             borderColor: `${fontColor}33`,
//             borderWidth: 1,
//           }}
//         >
//           <p className="text-sm font-semibold" style={{ color: fontColor }}>
//             Last Updated
//           </p>
//           <p className="text-lg" style={{ color: fontColor }}>
//             {metrics.lastUpdated}
//           </p>
//         </div>
//       </motion.div>

//       {/* Footer */}
//       <motion.div
//         initial={{ y: 10, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.8 }}
//         className="mt-6 text-center"
//       >
//         <p className="text-sm" style={{ color: `${fontColor}aa` }}>
//           Export events as CSV or use the search to find specific events. Admins
//           can drag to reschedule.
//         </p>
//       </motion.div>

//       {/* Modal for Add/Edit Event */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             className="p-6 rounded-xl shadow-lg w-full max-w-md"
//             style={{ backgroundColor, color: fontColor }}
//           >
//             <h3 className="text-lg font-semibold mb-4">
//               {modalMode === "add" ? "Add Event" : "Edit Event"}
//             </h3>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block mb-1 text-sm">Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full p-2 rounded-lg text-sm"
//                   style={{
//                     backgroundColor: `${backgroundColor}cc`,
//                     color: fontColor,
//                     borderColor: `${fontColor}33`,
//                   }}
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-xs mt-1">{errors.title}</p>
//                 )}
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block mb-1 text-sm">Start Date</label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleInputChange}
//                     className="w-full p-2 rounded-lg text-sm"
//                     style={{
//                       backgroundColor: `${backgroundColor}cc`,
//                       color: fontColor,
//                       borderColor: `${fontColor}33`,
//                     }}
//                   />
//                   {errors.startDate && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.startDate}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block mb-1 text-sm">Start Time</label>
//                   <input
//                     type="time"
//                     name="startTime"
//                     value={formData.startTime}
//                     onChange={handleInputChange}
//                     className="w-full p-2 rounded-lg text-sm"
//                     style={{
//                       backgroundColor: `${backgroundColor}cc`,
//                       color: fontColor,
//                       borderColor: `${fontColor}33`,
//                     }}
//                   />
//                   {errors.startTime && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.startTime}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block mb-1 text-sm">End Date</label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={formData.endDate}
//                     onChange={handleInputChange}
//                     className="w-full p-2 rounded-lg text-sm"
//                     style={{
//                       backgroundColor: `${backgroundColor}cc`,
//                       color: fontColor,
//                       borderColor: `${fontColor}33`,
//                     }}
//                   />
//                   {errors.endDate && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.endDate}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block mb-1 text-sm">End Time</label>
//                   <input
//                     type="time"
//                     name="endTime"
//                     value={formData.endTime}
//                     onChange={handleInputChange}
//                     className="w-full p-2 rounded-lg text-sm"
//                     style={{
//                       backgroundColor: `${backgroundColor}cc`,
//                       color: fontColor,
//                       borderColor: `${fontColor}33`,
//                     }}
//                   />
//                   {errors.endTime && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.endTime}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block mb-1 text-sm">Event Type</label>
//                 <select
//                   name="type"
//                   value={formData.type}
//                   onChange={handleInputChange}
//                   className="w-full p-2 rounded-lg text-sm"
//                   style={{
//                     backgroundColor: `${backgroundColor}cc`,
//                     color: fontColor,
//                     borderColor: `${fontColor}33`,
//                   }}
//                 >
//                   <option value="project">Project</option>
//                   <option value="milestone">Milestone</option>
//                   <option value="task">Task</option>
//                 </select>
//                 {errors.type && (
//                   <p className="text-red-500 text-xs mt-1">{errors.type}</p>
//                 )}
//               </div>
//               <div className="flex justify-end space-x-2">
//                 {modalMode === "edit" && (
//                   <button
//                     type="button"
//                     onClick={handleDelete}
//                     className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-sm"
//                     style={{ backgroundColor: "#ef4444" }}
//                   >
//                     Delete
//                   </button>
//                 )}
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors text-sm"
//                   style={{
//                     backgroundColor: `${fontColor}33`,
//                     color: fontColor,
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-sm"
//                   style={{ backgroundColor: customColor }}
//                 >
//                   {modalMode === "add" ? "Add Event" : "Update Event"}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}

//       {/* Custom CSS for react-big-calendar */}
//       <style>
//         {`
//         .rbc-custom .rbc-event {
//           border-radius: 4px;
//           padding: 2px 4px;
//         }
//         .rbc-custom .rbc-today {
//           background-color: ${customColor}10;
//         }
//         .rbc-custom .rbc-toolbar {
//           display: none; /* Using custom toolbar */
//         }
//         .rbc-custom .rbc-month-view, .rbc-custom .rbc-time-view {
//           border-color: ${fontColor}33;
//         }
//         .rbc-custom .rbc-header, .rbc-custom .rbc-time-header {
//           border-color: ${fontColor}33;
//           background-color: ${backgroundColor};
//           color: ${fontColor};
//         }
//         .rbc-custom .rbc-agenda-view table {
//           color: ${fontColor};
//         }
//         .rbc-custom .rbc-agenda-date-cell, .rbc-custom .rbc-agenda-time-cell {
//           color: ${fontColor}aa;
//         }
//         `}
//       </style>
//     </motion.div>
//   );
// };

// export default React.memo(CalendarComponent);

// //

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/TC";
import { format, isBefore, isAfter } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const { calendarEvents, currentUser } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [localEvents, setLocalEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    type: "project",
  });
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month");
  const today = new Date();

  // Responsive view state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set default view based on screen size
  useEffect(() => {
    if (windowWidth < 640) {
      setView("day");
    } else if (windowWidth < 1024) {
      setView("week");
    } else {
      setView("month");
    }
  }, [windowWidth]);

  // Merge calendarEvents and localEvents
  const allEvents = useMemo(() => {
    const localEventIds = new Set(localEvents.map((e) => e.id));
    return [
      ...calendarEvents.filter((e) => !localEventIds.has(e.id)),
      ...localEvents,
    ];
  }, [calendarEvents, localEvents]);

  // Transform events for calendar and filter by search
  const events = useMemo(() => {
    return allEvents
      .filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        type: event.type,
        color:
          event.type === "project"
            ? "#3b82f6"
            : event.type === "milestone"
            ? "#10b981"
            : "#ef4444",
      }));
  }, [allEvents, searchQuery]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalEvents = allEvents.length;
    const upcomingEvents = allEvents.filter((e) =>
      isAfter(new Date(e.start), today)
    ).length;
    const lastUpdated = format(today, "MMM dd, yyyy");
    return { totalEvents, upcomingEvents, lastUpdated };
  }, [allEvents]);

  // Prepare CSV data
  const csvData = useMemo(() => {
    return [
      ...allEvents.map((event) => ({
        Title: event.title,
        Start: format(new Date(event.start), "yyyy-MM-dd HH:mm"),
        End: format(new Date(event.end), "yyyy-MM-dd HH:mm"),
        Type: event.type,
      })),
      {},
      {
        Title: "Metrics",
        Start: "",
        End: "",
        Type: "",
      },
      {
        Title: "Total Events",
        Start: metrics.totalEvents,
        End: "",
        Type: "",
      },
      {
        Title: "Upcoming Events",
        Start: metrics.upcomingEvents,
        End: "",
        Type: "",
      },
      {
        Title: "Last Updated",
        Start: metrics.lastUpdated,
        End: "",
        Type: "",
      },
    ];
  }, [allEvents, metrics]);

  // Event handlers remain the same...

  const handleSelectEvent = (event) => {
    if (currentUser.role !== "Admin") {
      toast.warning("Only admins can edit events!");
      return;
    }
    setModalMode("edit");
    setSelectedEventId(event.id);
    setFormData({
      title: event.title,
      startDate: format(event.start, "yyyy-MM-dd"),
      startTime: format(event.start, "HH:mm:ss"),
      endDate: format(event.end, "yyyy-MM-dd"),
      endTime: format(event.end, "HH:mm:ss"),
      type: event.type,
    });
    setIsModalOpen(true);
  };

  // Handle slot selection (click to add event)
  const handleSelectSlot = ({ start, end }) => {
    if (currentUser.role !== "Admin") {
      toast.warning("Only admins can add events!");
      return;
    }
    setModalMode("add");
    setSelectedEventId(null);
    setFormData({
      title: "",
      startDate: format(start, "yyyy-MM-dd"),
      startTime: format(start, "HH:mm:ss"),
      endDate: format(end, "yyyy-MM-dd"),
      endTime: format(end, "HH:mm:ss"),
      type: "project",
    });
    setIsModalOpen(true);
  };

  // Handle drag-and-drop or resize
  const handleEventDrop = ({ event, start, end }) => {
    if (currentUser.role !== "Admin") {
      toast.error("Only admins can modify events!");
      return;
    }
    setLocalEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, start: start.toISOString(), end: end.toISOString() }
          : e
      )
    );
    toast.success("Event updated successfully!");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //   // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.type) newErrors.type = "Event type is required";
    if (
      formData.startDate &&
      formData.startTime &&
      formData.endDate &&
      formData.endTime
    ) {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);
      if (end < start) {
        newErrors.endDate = "End date/time must be after start date/time";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser.role !== "Admin") {
      toast.error("Only admins can modify events!");
      return;
    }
    if (validateForm()) {
      const eventData = {
        title: formData.title,
        start: new Date(
          `${formData.startDate}T${formData.startTime}`
        ).toISOString(),
        end: new Date(`${formData.endDate}T${formData.endTime}`).toISOString(),
        type: formData.type,
      };
      if (modalMode === "add") {
        setLocalEvents((prev) => [
          ...prev,
          { ...eventData, id: Date.now().toString() },
        ]);
        toast.success("Event added successfully!");
      } else {
        setLocalEvents((prev) =>
          prev.map((e) =>
            e.id === selectedEventId ? { ...eventData, id: e.id } : e
          )
        );
        toast.success("Event updated successfully!");
      }
      setIsModalOpen(false);
      setFormData({
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        type: "project",
      });
      setErrors({});
      setModalMode("add");
      setSelectedEventId(null);
    }
  };

  // Handle event deletion
  const handleDelete = () => {
    if (currentUser.role !== "Admin") {
      toast.error("Only admins can delete events!");
      return;
    }
    if (window.confirm("Are you sure you want to delete this event?")) {
      setLocalEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
      toast.success("Event deleted successfully!");
      setIsModalOpen(false);
      setFormData({
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        type: "project",
      });
      setErrors({});
      setModalMode("add");
      setSelectedEventId(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      type: "project",
    });
    setErrors({});
    setModalMode("add");
    setSelectedEventId(null);
  };

  // Custom event styling
  // const eventPropGetter = (event) => ({
  //   style: {
  //     backgroundColor: event.color,
  //     borderColor: event.color,
  //     color: "#ffffff",
  //     fontSize: "0.875rem",
  //   },
  // });

  // Custom toolbar for date navigation
  // const CustomToolbar = ({
  //   onNavigate,
  //   label,
  //   onView,
  //   views,
  //   view: currentView,
  // }) => (
  //   <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
  //     <div className="flex items-center gap-2">
  //       <button
  //         onClick={() => onNavigate("PREV")}
  //         className="px-3 py-1 rounded-lg text-sm"
  //         style={{ backgroundColor: customColor, color: "#ffffff" }}
  //       >
  //         Prev
  //       </button>
  //       <span className="text-sm font-semibold" style={{ color: fontColor }}>
  //         {label}
  //       </span>
  //       <button
  //         onClick={() => onNavigate("NEXT")}
  //         className="px-3 py-1 rounded-lg text-sm"
  //         style={{ backgroundColor: customColor, color: "#ffffff" }}
  //       >
  //         Next
  //       </button>
  //     </div>
  //     <div className="flex items-center gap-2">
  //       {views.map((viewOption) => (
  //         <button
  //           key={viewOption}
  //           onClick={() => onView(viewOption)}
  //           className={`px-3 py-1 rounded-lg text-sm capitalize ${
  //             currentView === viewOption ? "font-semibold" : ""
  //           }`}
  //           style={{
  //             backgroundColor:
  //               currentView === viewOption
  //                 ? customColor
  //                 : `${backgroundColor}cc`,
  //             color: currentView === viewOption ? "#ffffff" : fontColor,
  //           }}
  //         >
  //           {viewOption}
  //         </button>
  //       ))}
  //     </div>
  //   </div>
  // );
  // Custom event styling
  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      borderColor: event.color,
      color: "#ffffff",
      fontSize: "0.875rem",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  });

  // Responsive toolbar
  const CustomToolbar = ({
    onNavigate,
    label,
    onView,
    views,
    view: currentView,
  }) => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-4 gap-2 sm:gap-4">
      <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
        <button
          onClick={() => onNavigate("PREV")}
          className="px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm"
          style={{ backgroundColor: customColor, color: "#ffffff" }}
        >
          Prev
        </button>
        <span
          className="text-xs sm:text-sm font-semibold text-center flex-1 sm:flex-none"
          style={{ color: fontColor }}
        >
          {label}
        </span>
        <button
          onClick={() => onNavigate("NEXT")}
          className="px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm"
          style={{ backgroundColor: customColor, color: "#ffffff" }}
        >
          Next
        </button>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
        {views
          .filter(
            (view) => windowWidth > 640 || view === "day" || view === "agenda"
          )
          .map((viewOption) => (
            <button
              key={viewOption}
              onClick={() => onView(viewOption)}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm capitalize ${
                currentView === viewOption ? "font-semibold" : ""
              }`}
              style={{
                backgroundColor:
                  currentView === viewOption
                    ? customColor
                    : `${backgroundColor}cc`,
                color: currentView === viewOption ? "#ffffff" : fontColor,
              }}
            >
              {viewOption === "work_week" ? "Work Week" : viewOption}
            </button>
          ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-2 sm:p-4 md:p-6 rounded-xl shadow-lg"
      style={{ backgroundColor, color: fontColor }}
    >
      {/* Header and Description */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
            Calendar
          </h2>
          {currentUser.role === "Admin" && (
            <button
              onClick={() => {
                setModalMode("add");
                setIsModalOpen(true);
              }}
              className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors flex items-center text-xs sm:text-sm"
              style={{ backgroundColor: customColor }}
            >
              <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span>Add Event</span>
            </button>
          )}
        </div>
        <p
          className="text-xs sm:text-sm mb-3 sm:mb-4"
          style={{ color: `${fontColor}aa` }}
        >
          View and manage your project events, milestones, and tasks.{" "}
          {currentUser.role === "Admin" &&
            "Admins can add, edit, or drag events to reschedule."}
        </p>
      </motion.div>

      {/* Search and Export */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 gap-2 sm:gap-4"
      >
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-8 rounded-lg text-xs sm:text-sm"
            style={{
              backgroundColor: `${backgroundColor}cc`,
              color: fontColor,
              borderColor: `${fontColor}33`,
            }}
          />
          <FaSearch
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4"
            style={{ color: `${fontColor}aa` }}
          />
        </div>
        <CSVLink
          data={csvData}
          filename="calendar-events.csv"
          className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-xs sm:text-sm flex items-center whitespace-nowrap"
          style={{ backgroundColor: customColor }}
        >
          Export CSV
        </CSVLink>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className=" rounded-lg p-3 sm:p-4"
        style={{
          backgroundColor: `${customColor}44`,
          // color: fontColor,
          // borderColor: `${fontColor}33`,
        }}
      >
        {events.length === 0 && searchQuery && (
          <p
            className="text-center text-xs sm:text-sm p-3 sm:p-4"
            style={{ color: `${fontColor}aa` }}
          >
            No events found matching your search.
          </p>
        )}
        {events.length === 0 && !searchQuery && (
          <p
            className="text-center text-xs sm:text-sm p-3 sm:p-4"
            style={{ color: `${fontColor}aa` }}
          >
            No events scheduled.{" "}
            {currentUser.role === "Admin" && "Add an event to get started."}
          </p>
        )}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: windowWidth < 640 ? 400 : 500 }}
          selectable={currentUser.role === "Admin"}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventDrop}
          draggableAccessor={
            currentUser.role === "Admin" ? () => true : () => false
          }
          resizableAccessor={
            currentUser.role === "Admin" ? () => true : () => false
          }
          date={selectedDate}
          onNavigate={(date) => setSelectedDate(date)}
          eventPropGetter={eventPropGetter}
          components={{
            toolbar: (props) => <CustomToolbar {...props} view={view} />,
            event: ({ event }) => (
              <div className="rbc-event-content" title={event.title}>
                {event.title}
              </div>
            ),
          }}
          views={["day", "week", "work_week", "month", "agenda"]}
          view={view}
          onView={setView}
          className="rbc-custom"
        />
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6"
      >
        {[
          { label: "Total Events", value: metrics.totalEvents },
          { label: "Upcoming Events", value: metrics.upcomingEvents },
          { label: "Last Updated", value: metrics.lastUpdated },
        ].map((metric, index) => (
          <div
            key={index}
            className="p-2 sm:p-3 md:p-4 rounded-lg"
            style={{
              backgroundColor: `${backgroundColor}cc`,
              borderColor: `${fontColor}33`,
              borderWidth: 1,
            }}
          >
            <p
              className="text-xs sm:text-sm font-semibold"
              style={{ color: fontColor }}
            >
              {metric.label}
            </p>
            <p
              className="text-sm sm:text-base md:text-lg"
              style={{ color: fontColor }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-4 sm:mt-6 text-center"
      >
        <p className="text-xs sm:text-sm" style={{ color: `${fontColor}aa` }}>
          Export events as CSV or use the search to find specific events.{" "}
          {currentUser.role === "Admin" && "Admins can drag to reschedule."}
        </p>
      </motion.div>

      {/* Modal for Add/Edit Event */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor, color: fontColor }}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {modalMode === "add" ? "Add Event" : "Edit Event"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block mb-1 text-xs sm:text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg text-xs sm:text-sm"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: errors.title ? "#ef4444" : `${fontColor}33`,
                  }}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block mb-1 text-xs sm:text-sm">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg text-xs sm:text-sm"
                    style={{
                      backgroundColor: `${backgroundColor}cc`,
                      color: fontColor,
                      borderColor: errors.startDate
                        ? "#ef4444"
                        : `${fontColor}33`,
                    }}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-xs sm:text-sm">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg text-xs sm:text-sm"
                    style={{
                      backgroundColor: `${backgroundColor}cc`,
                      color: fontColor,
                      borderColor: errors.startTime
                        ? "#ef4444"
                        : `${fontColor}33`,
                    }}
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block mb-1 text-xs sm:text-sm">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg text-xs sm:text-sm"
                    style={{
                      backgroundColor: `${backgroundColor}cc`,
                      color: fontColor,
                      borderColor: errors.endDate
                        ? "#ef4444"
                        : `${fontColor}33`,
                    }}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-xs sm:text-sm">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg text-xs sm:text-sm"
                    style={{
                      backgroundColor: `${backgroundColor}cc`,
                      color: fontColor,
                      borderColor: errors.endTime
                        ? "#ef4444"
                        : `${fontColor}33`,
                    }}
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs sm:text-sm">
                  Event Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg text-xs sm:text-sm"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: errors.type ? "#ef4444" : `${fontColor}33`,
                  }}
                >
                  <option value="project">Project</option>
                  <option value="milestone">Milestone</option>
                  <option value="task">Task</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 pt-2">
                {modalMode === "edit" && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-xs sm:text-sm"
                    style={{ backgroundColor: "#ef4444" }}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-opacity-80 transition-colors text-xs sm:text-sm"
                  style={{
                    backgroundColor: `${fontColor}33`,
                    color: fontColor,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-xs sm:text-sm"
                  style={{ backgroundColor: customColor }}
                >
                  {modalMode === "add" ? "Add Event" : "Update Event"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Custom CSS for react-big-calendar */}
      <style>
        {`
          .rbc-custom .rbc-event {
            border-radius: 4px;
            padding: 2px 4px;
            margin: 1px;
          }
          .rbc-custom .rbc-today {
            background-color: ${customColor}10;
          }
          .rbc-custom .rbc-toolbar {
            display: none;
          }
          .rbc-custom .rbc-month-view, 
          .rbc-custom .rbc-time-view {
            border-color: ${fontColor}33;
          }
          .rbc-custom .rbc-header, 
          .rbc-custom .rbc-time-header {
            border-color: ${fontColor}33;
            background-color: ${backgroundColor};
            color: ${fontColor};
            font-size: 0.75rem;
            padding: 4px;
          }
          .rbc-custom .rbc-agenda-view table {
            color: ${fontColor};
            font-size: 0.75rem;
          }
          .rbc-custom .rbc-agenda-date-cell, 
          .rbc-custom .rbc-agenda-time-cell {
            color: ${fontColor}aa;
          }
          .rbc-custom .rbc-day-slot .rbc-time-slot {
            font-size: 0.75rem;
          }
          .rbc-custom .rbc-event-content {
            font-size: 0.75rem;
          }
          @media (min-width: 640px) {
            .rbc-custom .rbc-header, 
            .rbc-custom .rbc-time-header {
              font-size: 0.875rem;
              padding: 8px;
            }
            .rbc-custom .rbc-agenda-view table {
              font-size: 0.875rem;
            }
            .rbc-custom .rbc-day-slot .rbc-time-slot {
              font-size: 0.875rem;
            }
            .rbc-custom .rbc-event-content {
              font-size: 0.875rem;
            }
          }
          `}
      </style>
    </motion.div>
  );
};

export default React.memo(CalendarComponent);
