import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Checkbox,
  IconButton,
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as SquareTableIcon } from './../assets/Table.svg';
import { ReactComponent as RoundTableIcon } from './../assets/Mid.svg';
import { createTable } from '../services/apiService'; // Import createTable from API service

const Sidebar = ({ tables, addTable}) => {
  const [error, setError] = useState('');

  const handleSubmit = async (values, { resetForm }) => {
    const newTable = {
      id: `T-${tables.length + 1}`,
      name: values.name,
      type: values.type,
      minCovers: values.minCovers,
      maxCovers: values.maxCovers,
      active: values.active,
    };
    addTable(newTable);
    resetForm();
    try {
      const newTable = await createTable(values); // Create a new table using the backend API
      addTable(newTable); // Add the new table to the state in the parent component
      resetForm(); // Reset the form fields
    } catch (err) {
      console.error(err);
      setError('Failed to create the table. Please try again.');
    }
  };


  const initialIcons = [
    { id: 'square-icon', type: 'square', component: <SquareTableIcon style={{ width: 80, height: 80 }} /> },
    { id: 'round-icon', type: 'round', component: <RoundTableIcon style={{ width: 80, height: 80 }} /> },
  ];

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const draggedItem = initialIcons.find((icon) => icon.id === result.draggableId);
    if (draggedItem) {
      handleSubmit({
        name: `${draggedItem.type} Table`,
        type: draggedItem.type,
        minCovers: 1,
        maxCovers: 4,
        active: true,
      });
    }
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f9f9f9', height: '100%' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Tables
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Table Options
      </Typography>
      <Typography align="center" color="textSecondary" gutterBottom>
        Drag and drop your tables
      </Typography>

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sidebar" isDropDisabled>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}
            >
              {initialIcons.map((icon, index) => (
                <Draggable key={icon.id} draggableId={icon.id} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        width: 100,
                        height: 100,
                        border: '2px dashed #e91e63',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'grab',
                        transition: '0.3s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          borderColor: '#d81b60',
                        },
                      }}
                    >
                      {icon.component}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Typography variant="h6" align="center" gutterBottom>
        Table Details
      </Typography>
      <Formik
        initialValues={{
          name: '',
          type: 'round',
          minCovers: 1,
          maxCovers: 4,
          active: true,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Table Name"
                name="name"
                placeholder="Enter Table Name"
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <FormControl>
                <FormLabel>Table Type</FormLabel>
                <RadioGroup
                  row
                  name="type"
                  value={values.type}
                  onChange={(e) => setFieldValue('type', e.target.value)}
                >
                  <FormControlLabel value="square" control={<Radio />} label="Square" />
                  <FormControlLabel value="round" control={<Radio />} label="Round" />
                </RadioGroup>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Min Covers</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => setFieldValue('minCovers', Math.max(1, values.minCovers - 1))}
                  >
                    -
                  </IconButton>
                  <Typography>{values.minCovers}</Typography>
                  <IconButton
                    onClick={() => setFieldValue('minCovers', values.minCovers + 1)}
                  >
                    +
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Max Covers</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => setFieldValue('maxCovers', Math.max(1, values.maxCovers - 1))}
                  >
                    -
                  </IconButton>
                  <Typography>{values.maxCovers}</Typography>
                  <IconButton
                    onClick={() => setFieldValue('maxCovers', values.maxCovers + 1)}
                  >
                    +
                  </IconButton>
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.active}
                    onChange={(e) => setFieldValue('active', e.target.checked)}
                  />
                }
                label={`Online (${values.active ? 'Active' : 'Inactive'})`}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Advanced Settings"
              />
              <Button variant="contained" type="submit" color="primary" fullWidth sx={{ mt: 2 }}>
                Add Table
              </Button>
              {error && <Typography color="error">{error}</Typography>}
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Sidebar;
