import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const ItemTypes = {
  TABLE: 'table',
};

const Table = ({ id, type, position, onDrop }) => {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.TABLE,
    item: { id, type },
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TABLE,
    drop: (item) => onDrop(item, id),
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`table ${type}`}
      style={{ top: position.top, left: position.left }}
    >
      {id}
    </div>
  );
};

const FloorManagement = () => {
  const [tables, setTables] = useState([
    { id: 'T-01', type: 'round', position: { top: 50, left: 50 } },
    { id: 'T-02', type: 'square', position: { top: 150, left: 150 } },
  ]);

  const onDrop = (draggedItem, targetId) => {
    // Update position or other logic when items are dropped
    const updatedTables = tables.map((table) =>
      table.id === targetId
        ? { ...table, position: { top: table.position.top + 50, left: table.position.left + 50 } }
        : table
    );
    setTables(updatedTables);
  };

  return (
    <div className="floor-management">
      <DndProvider backend={HTML5Backend}>
        <div className="sidebar">
          <h3>Table Options</h3>
          {/* Drag options */}
        </div>
        <div className="main-room">
          {tables.map((table) => (
            <Table
              key={table.id}
              id={table.id}
              type={table.type}
              position={table.position}
              onDrop={onDrop}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default FloorManagement;
