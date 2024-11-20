import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Sidebar from "./components/Sidebar";
import { Button, Box, Typography, IconButton } from "@mui/material";
import { ReactComponent as RotateIcon } from "./assets/Number.svg";
import { ReactComponent as DuplicateIcon } from "./assets/Number (1).svg";
import { ReactComponent as DeleteIcon } from "./assets/trash.svg";

const initialTables = [

];

const App = () => {
  const [tables, setTables] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    setTables(initialTables);
    setLayout(initialTables);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedLayout = Array.from(layout);
    const [moved] = updatedLayout.splice(result.source.index, 1);
    updatedLayout.splice(result.destination.index, 0, moved);

    setLayout(updatedLayout);
  };

  const addTable = (newTable) => {
    setTables([...tables, newTable]);
    setLayout([...layout, newTable]);
  };

  const rotateTable = (id) => {
    console.log(`Rotate table ${id}`);
    // Add logic to visually rotate the table
  };

  const duplicateTable = (table) => {
    const newTable = {
      ...table,
      id: `T-${layout.length + 1}`,
      name: `${table.name} Copy`,
    };
    setLayout([...layout, newTable]);
  };

  const deleteTable = (id) => {
    const updatedLayout = layout.filter((table) => table.id !== id);
    setLayout(updatedLayout);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box sx={{ width: 300, background: "#f9f9f9", padding: "20px" }}>
        <Sidebar tables={tables} addTable={addTable} />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, padding: "20px" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Floor Management
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Main Room</Typography>
          <Box>
            <Button variant="outlined" sx={{ mr: 1 }}>
              + Add Room
            </Button>
            <Button variant="contained">Save Room</Button>
          </Box>
        </Box>

        {/* Drag and Drop Context */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="mainRoom">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  border: "1px solid #ddd",
                  minHeight: 500,
                  background: "#fff",
                  padding: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {layout.map((table, index) => (
                  <Draggable key={table.id} draggableId={table.id} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          width: 80,
                          height: 80,
                          background: table.type === "square" ? "#f8d7da" : "#fff3cd",
                          color: table.type === "square" ? "#721c24" : "#856404",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: table.type === "square" ? 1 : "50%",
                          border: "1px solid #ccc",
                          cursor: "grab",
                          position: "relative",
                        }}
                      >
                        {table.name}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            display: "flex",
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            onClick={() => rotateTable(table.id)}
                            size="small"
                          >
                            <RotateIcon width={16} height={16} />
                          </IconButton>
                          <IconButton
                            onClick={() => duplicateTable(table)}
                            size="small"
                          >
                            <DuplicateIcon width={16} height={16} />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteTable(table.id)}
                            size="small"
                          >
                            <DeleteIcon width={16} height={16} />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            borderTop: "1px solid #ddd",
            pt: 2,
          }}
        >
          <Typography>🪑 {layout.length} Tables</Typography>
          <Typography>
            👥 Min Covers: {layout.reduce((sum, table) => sum + table.minCovers, 0)}
          </Typography>
          <Typography>
            👥 Max Covers: {layout.reduce((sum, table) => sum + table.maxCovers, 0)}
          </Typography>
          <Typography>
            🖥 Online Capacity: {layout.filter((table) => table.active).length}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default App;