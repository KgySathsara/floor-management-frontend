export const saveLayout = (data) => {
    localStorage.setItem('floorLayout', JSON.stringify(data));
  };
  
  export const loadLayout = () => {
    const data = localStorage.getItem('floorLayout');
    return data ? JSON.parse(data) : null;
  };
  