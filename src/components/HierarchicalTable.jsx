import React, { useCallback, useState } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import './HierarchicalTable.css';
import data from '../assets/data.json';
import { calculateVariance, updateRowValue, updateParent, findParent, updateRowPercentage, updateParentByPercentage } from './utils/tableHelpers';

const HierarchicalTable = () => {
  const [rows, setRows] = useState(data.rows);
  const [expandedRows, setExpandedRows] = useState([]);

  const updateRow = (rows, id, newValue, variance, percentage) => {
    if (!rows) return [];
    return rows.map(row => {
      if (row.id === id) {
        const updatedChildren = percentage 
          ? updateChildrenByPercentage(row.children, percentage)
          : updateChildrenByValue(row.children, newValue, row.value);
        return {
          ...row,
          children: updatedChildren,
          value: newValue,
          variancePercent: variance
        };
      }
      return row;
    });
  };

  const updateParentValues = (rows, parentId) => {
    if (!rows || !parentId) return rows;

    const parent = rows.find(r => r.id === parentId);
    if (!parent || !parent.children) return rows;

    const parentValue = parent.children.reduce((sum, child) => {
      const childRow = rows.find(r => r.id === child.id);
      return sum + (parseFloat(childRow?.value) || 0);
    }, 0);

    const parentIndex = rows.findIndex(r => r.id === parentId);
    if (parentIndex === -1) return rows;

    const updatedRows = [...rows];
    updatedRows[parentIndex] = { ...parent, value: parentValue };

    const parentParent = rows.find(r => r.children?.some(c => c.id === parentId));
    if (parentParent) {
      return updateParentValues(updatedRows, parentParent.id);
    }

    return updatedRows;
  };

  const updateChildrenByPercentage = (children, percentage) => {
    if (!children) return [];
    const variance = (percentage * 100).toFixed(2);
    const inputValue = percentage * 100;
    
    return children.map(child => ({
      ...child,
      value: (child.value + child.value * percentage).toFixed(0),
      input: inputValue,
      variancePercent: variance
    }));
  };

  const updateChildrenByValue = (children, newValue, oldValue) => {
    if (!children) return [];
    
    return children.map(child => {
      const newChildValue = (child.value / oldValue) * newValue;
      return updateRowValue(child, newChildValue);
    });
  };

  const updateChildRow = (id, valueFn) => {
    const parent = findParent(id, rows);
    const child = parent.children.find(child => child.id === id);
    const newValue = valueFn(child);
    
    const updatedChild = updateRowValue(child, newValue);
    const updatedParent = updateParent(parent, updatedChild);
    
    setRows(prevRows => 
      prevRows.map(row => row.id === parent.id ? updatedParent : row)
    );
  };

  const updateChildRowByPercentage = (id) => {
    const parent = findParent(id, rows);
    const child = parent.children.find(child => child.id === id);
    const childInput = parseFloat(child.input) || 0;
    const percentage = childInput / 100;
    const newValue = child.value + (child.value * percentage);
    const updatedChild = updateRowPercentage(child, newValue);
    const updatedParent = updateParentByPercentage(parent, updatedChild);
    
    setRows(prevRows => 
      prevRows.map(row => row.id === parent.id ? updatedParent : row)
    );
  };

  const UpdateParentRowByPercentage = (row,id)=>{
    console.log(row)
    const currentValue = parseFloat(row.value) || 0;
    const input = parseFloat(row.input) || 0;
    const percentage = input / 100;
    const newValue = currentValue + (currentValue * percentage);
    const variance = input.toFixed(2);
    const updatedRows = updateRow(rows, id, newValue, variance, percentage);
    const finalRows = updateParentValues(updatedRows, row.parent);
    setRows(finalRows);
  }

  const calculateAllocationByPercentage = useCallback((id) => {
    const row = rows.find(r => r.id === id);
    if (!row) {
      updateChildRowByPercentage(id);
      return;
    }
    UpdateParentRowByPercentage(row,id);
  },[rows]);

  const updateChildRowByValue = (id) => {
    const parent = findParent(id, rows);
    const child = parent.children.find(child => child.id === id);
    const childInput = parseFloat(child.input) || 0;
    
    const updatedChild = updateRowValue(child, childInput);
    const updatedParent = updateParent(parent, updatedChild);
    
    setRows(prevRows => 
      prevRows.map(row => row.id === parent.id ? updatedParent : row)
    );
  };

  const updateParentRowByValue = (row,id)=>{
    console.log(row)
    const currentValue = parseFloat(row.value) || 0;
    const input = parseFloat(row.input) || 0;
    const newValue = input;
    const variance = currentValue > 0 ? calculateVariance(newValue, currentValue) : '0.00';
    const updatedRows = updateRow(rows, id, newValue, variance, null);
    const finalRows = updateParentValues(updatedRows, row.parent);
    setRows(finalRows);
  }
  const calculateAllocationByValue = useCallback((id) => {
    const row = rows.find(r => r.id === id);
    if (!row) {
      updateChildRowByValue(id);
      return;
    }
    updateParentRowByValue(row,id);
  },[rows]);

  const handleValueChange = useCallback((id, value, level) => {
    const row = rows.find(r => r.id === id);
    if (!row) {
      const parent = findParent(id, rows);
      const child = parent.children.find(child => child.id === id);
      const updatedChild = { ...child, input: value };
      const updatedParent = updateParent(parent, updatedChild);
      setRows(prevRows => 
        prevRows.map(row => row.id === parent.id ? updatedParent : row)
      );
      return;
    }

    setRows(prevRows => 
      prevRows.map(r => {
        if (r.id === id) {
          return { ...r, input: value };
        }
        return r;
      })
    );
  },[rows]);

  const handleExpand = useCallback((id) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  },[rows]);

  return (
    <div className="table-container">
      <table className="hierarchical-table">
        <TableBody
          rows={rows}
          expandedRows={expandedRows}
          onToggle={handleExpand}
          onValueChange={handleValueChange}
          onPercentage={calculateAllocationByPercentage}
          onValue={calculateAllocationByValue}
        />
      </table>
    </div>
  );
};

export default HierarchicalTable;