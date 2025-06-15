import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useTheme } from "../context/Themecontext";

const TaskCard = ({ item, index }) => {
  const { customColor, fontColor, backgroundColor } = useTheme();
  return (
    <Draggable key={item.id} draggableId={String(item.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={`flex flex-col rounded-md p-5 my-4 max-w-xs border border-amber-500 `}
            style={{
              border: `1px solid ${customColor}`,
              backgroundColor: `${customColor}22`,
              color: fontColor,
            }}
          >
            <div className="flex justify-between my-2 w-full">
              <div>
                {item?.priority === "Low" && (
                  <div className="px-2 py-1 rounded-md bg-[#DFA87433] text-[#D58D49]">
                    {item?.priority}
                  </div>
                )}
                {item?.priority === "High" && (
                  <div className="px-2 py-1 rounded-md bg-[#D8727D1A] text-[#D8727D]">
                    {item?.priority}
                  </div>
                )}
                {item?.priority === "Medium" && (
                  <div className="px-2 py-1 rounded-md bg-[#2eb56633] text-[#14a90e]">
                    {item?.priority}
                  </div>
                )}
              </div>
              <div>
                <h6>...</h6>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <h3
                  className="font-semibold text-lg"
                  style={{ color: `${fontColor}4` }}
                >
                  {item?.name}
                </h3>
              </div>
              {item?.taskImage?.length > 0 ? (
                <div className="flex gap-2">
                  {item?.taskImage?.map((img, ind) => {
                    return (
                      <div key={ind + "img"}>
                        <img alt="task" src={img} className="rounded-md" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <p className="text-[#787486] text-sm">
                    No description available
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-between my-2 gap-3 items-center">
              <div>
                <AvatarGroup max={4}>
                  {item?.images?.map((img, index) => {
                    return (
                      <Avatar
                        key={index}
                        sx={{ width: 24, height: 24 }}
                        alt="Avatar"
                        src={img}
                      />
                    );
                  })}
                </AvatarGroup>
              </div>
              <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2 items-center">
                  <div>
                    <span className="text-sm text-[#787486] whitespace-nowrap">
                      Due: {new Date(item?.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;

// //
// import React from "react";
// import { Draggable } from "@hello-pangea/dnd";
// import Avatar from "@mui/material/Avatar";
// import AvatarGroup from "@mui/material/AvatarGroup";
// import { FaImage } from "react-icons/fa";

// const TaskCard = ({ item, index }) => {
//   return (
//     <Draggable draggableId={String(item.id)} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           className="task-card"
//         >
//           <div className="flex flex-col bg-white rounded-md p-5 my-4 max-w-xs shadow-sm">
//             <div className="flex justify-between my-2 w-full">
//               <div>
//                 {item.priority === "Low" && (
//                   <div
//                     className="px-2 py-1 rounded-md bg-[#DFA87433] text-[#D58D49] text-sm"
//                     aria-label="Low priority"
//                   >
//                     Low
//                   </div>
//                 )}
//                 {item.priority === "Medium" && (
//                   <div
//                     className="px-2 py-1 rounded-md bg-[#FFA50033] text-[#FFA500] text-sm"
//                     aria-label="Medium priority"
//                   >
//                     Medium
//                   </div>
//                 )}
//                 {item.priority === "High" && (
//                   <div
//                     className="px-2 py-1 rounded-md bg-[#D8727D1A] text-[#D8727D] text-sm"
//                     aria-label="High priority"
//                   >
//                     High
//                   </div>
//                 )}
//               </div>
//               <div className="cursor-pointer text-[#787486]">
//                 <span aria-label="More options">...</span>
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <div>
//                 <h3 className="font-semibold text-lg text-[#0D062D]">
//                   {item.name || "Untitled Task"}
//                 </h3>
//               </div>

//               {item?.taskImage?.length > 0 ? (
//                 <div className="flex gap-2">
//                   {item?.taskImage?.map((img, ind) => {
//                     return (
//                       <div key={ind + "img"}>
//                         <img alt="task" src={img} className="rounded-md" />
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-[#787486] text-sm">{item?.Task}</p>
//                 </div>
//               )}
//               <div>
//                 <p className="text-[#787486] text-sm">
//                   {item.dueDate
//                     ? `Due: ${new Date(item.dueDate).toLocaleDateString()}`
//                     : "No due date"}
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-between my-2 gap-3 items-center">
//               <div>
//                 <AvatarGroup max={3}>
//                   {item.images?.map((img, idx) => (
//                     <Avatar
//                       key={idx}
//                       sx={{ width: 24, height: 24 }}
//                       alt={`Assignee avatar ${idx + 1}`}
//                       src={img}
//                     />
//                   ))}
//                 </AvatarGroup>
//               </div>
//               <div className="flex justify-between gap-4">
//                 <div className="flex gap-2 items-center">
//                   <img
//                     height="20"
//                     width="20"
//                     alt="comments icon"
//                     src="https://res.cloudinary.com/dfegprdja/image/upload/v1687096433/kanban-clone/message_mkdi8x.png"
//                   />
//                   <span className="text-sm text-[#787486] whitespace-nowrap">
//                     {item.comments || 0} comments
//                   </span>
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   <img
//                     height="20"
//                     width="20"
//                     alt="file icon"
//                     src="https://res.cloudinary.com/dfegprdja/image/upload/v1687096442/kanban-clone/folder-2_hpqniu.png"
//                   />
//                   <span className="text-sm text-[#787486] whitespace-nowrap">
//                     {item.files || 0} files
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </Draggable>
//   );
// };

// export default TaskCard;

//

// import React from "react";
// import { Draggable } from "@hello-pangea/dnd";
// import Avatar from "@mui/material/Avatar";
// import AvatarGroup from "@mui/material/AvatarGroup";
// import { FaGripVertical, FaComment, FaFolder } from "react-icons/fa";
// import { useTheme } from "../context/Themecontext";

// const TaskCard = ({ item, index }) => {
//   const { fontColor, customColor } = useTheme();
//   const priorityStyles = {
//     Low: { bg: "#DFA87433", text: "#D58D49" },
//     Medium: { bg: "#FFA50033", text: "#FFA500" },
//     High: { bg: "#D8727D1A", text: "#D8727D" },
//   };

//   return (
//     <Draggable key={item.id} draggableId={String(item.id)} index={index}>
//       {(provided, snapshot) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           className="task-card p-4 rounded-lg shadow mb-3 flex items-start hover:scale-[1.02] transition-transform"
//           style={{
//             backgroundColor: "var(--card-bg)",
//             color: fontColor,
//             border: `1px solid ${fontColor}33`,
//             boxShadow: snapshot.isDragging
//               ? "0 4px 12px rgba(0, 0, 0, 0.2)"
//               : "none",
//             ...provided.draggableProps.style,
//           }}
//           aria-label={`Task: ${item.name || "Untitled Task"}`}
//         >
//           <div {...provided.dragHandleProps} className="drag-handle mr-2 mt-1">
//             <FaGripVertical className="w-4 h-4" style={{ color: fontColor }} />
//           </div>
//           <div className="flex-1">
//             <div className="flex justify-between items-center mb-2">
//               <div
//                 className="px-2 py-1 rounded-md text-sm"
//                 style={{
//                   backgroundColor: priorityStyles[item.priority]?.bg,
//                   color: priorityStyles[item.priority]?.text,
//                 }}
//                 aria-label={`${item.priority} priority`}
//               >
//                 {item.priority}
//               </div>
//               <div
//                 className="cursor-pointer text-[#787486] hover:text-[var(--theme-color)]"
//                 aria-label="More options"
//               >
//                 <span>...</span>
//               </div>
//             </div>
//             <h3 className="font-semibold text-lg" style={{ color: fontColor }}>
//               {item.name || "Untitled Task"}
//             </h3>
//             {item.taskImage?.length > 0 ? (
//               <div className="flex gap-2 my-2 flex-wrap">
//                 {item.taskImage.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`Task image ${idx + 1}`}
//                     className="w-16 h-16 object-cover rounded-md"
//                   />
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm my-2" style={{ color: `#${fontColor}cc` }}>
//                 {item.Task || "No description"}
//               </p>
//             )}
//             <p className="text-sm" style={{ color: `#${fontColor}cc` }}>
//               {item.dueDate
//                 ? `Due: ${new Date(item.dueDate).toLocaleDateString()}`
//                 : "No due date"}
//             </p>
//             <div className="flex justify-between items-center mt-3">
//               <AvatarGroup max={3}>
//                 {item.images?.map((img, idx) => (
//                   <Avatar
//                     key={idx}
//                     sx={{ width: 28, height: 28 }}
//                     alt={`Assignee avatar ${idx + 1}`}
//                     src={img}
//                   />
//                 ))}
//               </AvatarGroup>
//               <div className="flex gap-4 items-center">
//                 <div className="flex gap-1 items-center">
//                   <FaComment
//                     className="w-4 h-4"
//                     style={{ color: `#${fontColor}cc` }}
//                   />
//                   <span
//                     className="text-sm"
//                     style={{ color: `#${fontColor}cc` }}
//                   >
//                     {item.comments || 0}
//                   </span>
//                 </div>
//                 <div className="flex gap-1 items-center">
//                   <FaFolder
//                     className="w-4 h-4"
//                     style={{ color: `#${fontColor}cc` }}
//                   />
//                   <span
//                     className="text-sm"
//                     style={{ color: `#${fontColor}cc` }}
//                   >
//                     {item.files || 0}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </Draggable>
//   );
// };

// export default TaskCard;
