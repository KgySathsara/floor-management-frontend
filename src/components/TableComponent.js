import React from "react";
import { useDrag } from "react-dnd";
import { Box, IconButton } from "@mui/material";
import { ReactComponent as RotateIcon } from "./../assets/Number.svg";
import { ReactComponent as DeleteIcon } from "./../assets/trash.svg";
import { ReactComponent as DuplicateIcon } from "./../assets/Number (1).svg";
import { ReactComponent as SquareTableIcon } from "./../assets/Table.svg";
import { ReactComponent as RoundTableIcon } from "./../assets/Mid.svg";

    const TableComponent = ({ table, moveTable, deleteTable }) => {
    const [, drag] = useDrag({
        type: "table",
        item: { id: table.id },
        end: (item, monitor) => {
    const offset = monitor.getClientOffset();
    const parentBounds = document
        .getElementById("mainRoom")
        .getBoundingClientRect();

    if (offset && parentBounds) {
        let x = offset.x - parentBounds.left;
        let y = offset.y - parentBounds.top;

        // Constrain the position to within the parent bounds
        x = Math.max(0, Math.min(parentBounds.width - 50, x)); // 100 is the width of the icon
        y = Math.max(0, Math.min(parentBounds.height - 50, y)); // 100 is the height of the icon

        moveTable(item.id, x, y); // Update table position
    }
    },
});

    return (
        <Box
        ref={drag}
        sx={{
            width: 100,
            height: 100,
            position: "absolute",
            top: table.position.y,
            left: table.position.x,
            background: table.type === "square" ? "#f8d7da" : "#fff3cd",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: table.type === "square" ? "0%" : "50%",
            border: "1px solid #ccc",
            cursor: "grab",
        }}
        >
        {table.type === "square" ? (
        <SquareTableIcon width={40} height={40} />
        ) : (
        <RoundTableIcon width={40} height={40} />
        )}
        <Box
            sx={{
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex",
            gap: 0.5,
            }}
        >
        <IconButton size="small" onClick={() => console.log("Rotate table")}>
        <RotateIcon width={16} height={16} />
        </IconButton>
        <IconButton
            size="small"
            onClick={() => console.log("Duplicate table")}
        >
        <DuplicateIcon width={16} height={16} />
        </IconButton>
        <IconButton size="small" onClick={() => deleteTable(table.id)}>
        <DeleteIcon width={16} height={16} />
        </IconButton>
    </Box>
    </Box>
    );
};

export default TableComponent;
