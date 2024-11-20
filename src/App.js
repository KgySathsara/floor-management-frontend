import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TableComponent from "./components/TableComponent";
import { Box, Typography, Button } from "@mui/material";
import { getTables, createTable, deleteTable } from "./services/apiService";
import { useDrop } from "react-dnd";

const App = () => {
  const [tables, setTables] = useState([]);

  // Fetch tables from the backend on component mount
  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await getTables();
        setTables(
          data.map((table, index) => ({
            ...table,
            position: table.position || { x: index * 50, y: index * 50 }, // Default position
          }))
        );
      } catch (error) {
        console.error("Failed to fetch tables:", error);
      }
    };

    loadTables();
  }, []);

  const addTable = async (newTable) => {
    try {
      const addedTable = await createTable(newTable);
      setTables([
        ...tables,
        {
          ...addedTable,
          position: { x: 100, y: 100 }, // Default position for new table
        },
      ]);
    } catch (error) {
      console.error("Failed to add table:", error);
    }
  };

  const moveTable = (id, x, y) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === id ? { ...table, position: { x, y } } : table
      )
    );
  };

  const deleteTableById = async (id) => {
    try {
      await deleteTable(id);
      setTables((prevTables) => prevTables.filter((table) => table.id !== id));
    } catch (error) {
      console.error("Failed to delete table:", error);
    }
  };

  const duplicateTable = async (table) => {
    const newTable = {
      ...table,
      id: null,
      name: `${table.name} Copy`,
      position: { x: table.position.x + 20, y: table.position.y + 20 }, // Offset position
    };
    await addTable(newTable);
  };

  const rotateTable = (id) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === id
          ? { ...table, rotation: (table.rotation || 0) + 90 } // Increment rotation
          : table
      )
    );
  };

  const [{ isOver }, drop] = useDrop({
    accept: "table",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const roomBounds = document.getElementById("mainRoom").getBoundingClientRect();

      if (offset && roomBounds) {
        const x = offset.x - roomBounds.left;
        const y = offset.y - roomBounds.top;
        moveTable(item.id, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <Box sx={{ display: "flex", height: "120vh", padding: "20px", background: "#f5f5f5" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 300,
          background: "#f9f9f9",
          padding: "10px",
          borderRadius: "8px",
          //boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Sidebar tables={tables} addTable={addTable} />
      </Box>

      <Box sx={{  flex: 1,  marginLeft: "10px", padding: "40px",  position: "relative",  
            background: isOver ? "#f0f8ff" : "#fff",  border: "1px solid #ddd",  borderRadius: "8px",  
            minHeight: "calc(50vh - 50px)"  
          }}>
          <Typography variant="h4" align="center" gutterBottom>
            Floor Management
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Typography variant="h6">Main Room</Typography>
            <Box>
              <Button variant="outlined" sx={{ mr: 1 }}>
                + Add Room
              </Button>
              <Button variant="contained">Save Room</Button>
            </Box>
          </Box>
        {/* Main Content */}
        <Box  
            id="mainRoom"
            ref={drop} 
            sx={{  flex: 1,  marginLeft: "10px", padding: "40px",  position: "relative",  
            background: isOver ? "#f0f8ff" : "#fff",  border: "1px solid #ddd",  borderRadius: "8px",  
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  minHeight: "calc(50vh - 50px)"  
          }}>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 ,height: "500px",}}>
            <Box>
              {/* Render Tables */}
              {tables.map((table) => (
                <TableComponent
                  key={table.id}
                  table={table}
                  moveTable={moveTable}
                  deleteTable={deleteTableById}
                  duplicateTable={duplicateTable}
                  rotateTable={rotateTable}
                />
              ))}
            </Box>
          </Box>
        </Box>
          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: "60px",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "8px",
              mt: 4,
              px: 4,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Total Tables */}
            <Typography variant="body2" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
              🪑 {tables.length} Tables
            </Typography>

            {/* Minimum Covers */}
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
              👥 {tables.reduce((sum, table) => sum + (table.minCovers || 0), 0)} Min Covers
            </Typography>

            {/* Maximum Covers */}
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
              👥 {tables.reduce((sum, table) => sum + (table.maxCovers || 0), 0)} Max Covers
            </Typography>

            {/* Online Capacity */}
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
              🖥 {tables.filter((table) => table.active).length}-{tables.length} Online Capacity
            </Typography>
          </Box>
      </Box>
    </Box>
  );
};

export default App;
