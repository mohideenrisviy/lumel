export const calculateVariance = (newValue, oldValue) => {
  if (!oldValue) return '0.00';
  return ((newValue - oldValue) / oldValue * 100).toFixed(2);
};

export const updateRowValue = (row, newValue) => ({
  ...row,
  value: newValue.toFixed(0),
  input: newValue.toFixed(0),
  variancePercent: calculateVariance(newValue, row.value)
});

export const updateRowPercentage = (row, newValue) => ({
    ...row,
    value: newValue.toFixed(0),
    variancePercent: calculateVariance(newValue, row.value)
  });

export const updateParentByPercentage = (parent, updatedChild) => {
    const updatedChildren = parent.children.map(child => 
      child.id === updatedChild.id ? updatedChild : child
    );
    
    const newValue = updatedChildren.reduce(
      (sum, child) => sum + parseFloat(child.value),
      0
    );
    
    return {
      ...parent,
      children: updatedChildren,
      value: newValue.toFixed(0),
      variancePercent: calculateVariance(newValue, parent.value),
      input: calculateVariance(newValue, parent.value)
    };
  };
export const updateParent = (parent, updatedChild) => {
  const updatedChildren = parent.children.map(child => 
    child.id === updatedChild.id ? updatedChild : child
  );
  
  const newValue = updatedChildren.reduce(
    (sum, child) => sum + parseFloat(child.value),
    0
  );
  
  return {
    ...parent,
    children: updatedChildren,
    value: newValue.toFixed(0),
    variancePercent: calculateVariance(newValue, parent.value),
    input: newValue-parent.value
  };
};

export const findParent = (id, rows) => {
  return rows.find(row => row.children?.some(child => child.id === id));
};
