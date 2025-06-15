import React, { useState } from "react";
import styled from "@emotion/styled";
// import { columnsFromBackend } from "./KanbanData";
import { columnsFromBackend } from "../data/KanbanData";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
// import TaskCard from "./TaskCard";
import TaskCard from "./TaskCard";

const TaskList = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  min-width: 329px;
  border-radius: 5px;
  padding: 15px 15px;
  margin-right: 10px;
`;

const Board = () => {
  const [columns, setColumns] = useState(columnsFromBackend);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };
  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
    >
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row m-2 min-h-[80px]">
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => (
                  <TaskList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex justify-between items-center">
                        <div>
                          <ul className="list-disc">
                            <li
                              style={{ color: column.color }}
                              className="ml-5 px-3 py-1"
                            >
                              <span className=" text-[#0D062D] transition-colors duration-300 hover:text-[#0D062D] cursor-pointer">
                                {column?.title}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-[#E0E0E0] rounded-full h-5 w-5 flex justify-center items-center p-3">
                          <div>{column?.items?.length}</div>
                        </div>
                      </div>
                      <div>...</div>
                    </div>
                    <div
                      style={{
                        borderTop: "2px solid ",
                        borderColor: column.color,
                      }}
                      className=" mt-5"
                    ></div>
                    {column.items.map((item, index) => (
                      <TaskCard key={item.id} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                  </TaskList>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;
