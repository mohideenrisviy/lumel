import React, { useState } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import './HierarchicalTable.css';
import data from '../assets/data.json';

const HierarchicalTable = () => {
  const [rows, setRows] = useState(data.rows);
  const [expandedRows, setExpandedRows] = useState([]);

  const updateRow = (rows, id, newValue, variance,percentage) => {
    if (!rows) return [];
    return rows.map(row => {
      
      if (row.id === id) {
        const updatedChildren = percentage != null 
        ?updateChildrenByPercentage(row.children,percentage)
        :updateChildrenByValue(row.children,newValue, row.value);
        return {
          ...row,
          children:updatedChildren,
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
    if (parentIndex !== -1) {
      rows[parentIndex] = { ...rows[parentIndex], value: parentValue };
    }

    const parentParent = rows.find(r => r.children?.some(c => c.id === parentId));
    if (parentParent) {
      return updateParentValues(rows, parentParent.id);
    }

    return rows;
  };

  const updateChildrenByPercentage = (children, percentage) => {
    if (!children) return [];
    const variance = (percentage*100).toFixed(2);
    return children.map(child=>({...child,value:child.value + child.value * percentage,input:percentage*100,variancePercent:variance}));
  };

  const updateChildrenByValue = (children, newValue, oldValue)=>{
    if (!children) return [];
    return children.map(child=>{
        const newChildValue =(child.value/oldValue)*newValue;
        const newVariance = ((newChildValue - child.value)/child.value)*100;

        return ({
            ...child,
            value:newChildValue.toFixed(0),
            input:newChildValue.toFixed(0),
            variancePercent:newVariance.toFixed(2)      })
    })
  }

  const findParent = (id) =>{
    let parent
    rows.map(row=>{
        if (row.children.some(child=>child.id===id)) {
        parent= row}
    })
    return parent
  }
  const updateChildRowByPercentage = (id) => {
    const parent = findParent(id);
    const child = parent.children.find(child=>child.id===id);
    const childInput = parseFloat(child.input) || 0

    const childPercentage = childInput /100;
    const childValue = child.value + child.value * childPercentage;
    const childVariance = (childValue - child.value)/child.value *100;

    const updatedChild ={
        ...child,
        value:childValue.toFixed(0),
        input:childValue.toFixed(0),
        variancePercent:childVariance.toFixed(2)
    }
    console.log(child);
    parent.children = parent.children.map(child=>child.id===id?updatedChild:child);
    const oldParentValue = parent.value;   
      
    parent.value = parent.children.reduce((sum,child)=>sum+parseFloat(child.value),0).toFixed(0);
    parent.variancePercent =(((parent.value - oldParentValue)/oldParentValue)*100).toFixed(2);
    parent.input =parent.variancePercent

    const finalRows = rows.map(row=>row.id===parent.id?parent:row);

    setRows(finalRows);

  }

  const calculateAllocationByPercentage = (id) => {
    
    const row = rows.find(r => r.id === id);
    if (!row) {
        updateChildRowByPercentage(id);
        return
    };

    const currentValue = parseFloat(row.value) || 0;
    const input = parseFloat(row.input) || 0;
    const percentage = input / 100;
    const newValue = currentValue + (currentValue * percentage);
    const variance = (input).toFixed(2);

    const updatedRows = updateRow(rows, id, newValue, variance,percentage);
    
    console.log(updatedRows)
    const finalRows = updateParentValues(updatedRows, row.parent);
    setRows(finalRows);
  };

  const updateChildRowByValue = (id) =>{
    const parent = findParent(id);
    const child = parent.children.find(child=>child.id===id);
    const childInput = parseFloat(child.input) ||0;
    const childValue = childInput;
    const childVariance = (childValue - child.value)/child.value * 100;
    const updatedChild = {
        ...child,
        value:childValue.toFixed(0),
        input:childValue.toFixed(0),
        variancePercent:childVariance.toFixed(2)
    }
    parent.children = parent.children.map(child=>child.id===id?updatedChild:child);
    const oldParentValue = parent.value;
    parent.value = parent.children.reduce((sum,child)=>sum+parseFloat(child.value),0);
    parent.variancePercent =(((parent.value -oldParentValue)/oldParentValue)*100).toFixed(2);
    parent.input =parent.variancePercent;
    const finalRows = rows.map(row=>row.id===parent.id?parent:row);
    setRows(finalRows)
  }
  const calculateAllocationByValue = (id) => {
    const row = rows.find(r => r.id === id);
    if (!row) {
        updateChildRowByValue(id);
        return
    };

    const currentValue = parseFloat(row.value) || 0;
    const input = parseFloat(row.input) || 0;
    const newValue = input;
    const variance = currentValue > 0 ? ((input - currentValue) / currentValue * 100).toFixed(2) : '0.00';

    const updatedRows = updateRow(rows, id, newValue, variance,null);
    const finalRows = updateParentValues(updatedRows, row.parent);
    setRows(finalRows);
  };

  const handleValueChange = (id, value,level) => {
    console.log(level)
    const row = rows.find(r => r.id === id);
    if (!row) {
        const parent =findParent(id);
        const child = parent.children.find(child=>child.id===id);
        const updatedChild = {...child,input:value};
        parent.children = parent.children.map(child=>child.id===id?updatedChild:child);
        setRows(rows.map(row=>row.id===parent.id?parent:row))
    };

    setRows(rows.map(r => {
      if (r.id === id) {
        return {
          ...r,
          input: value
        };
      }
      return r;
    }));
  };

  const handleExpand = (id) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="table-container">
      <table className="hierarchical-table">
        {/* <TableHeader /> */}
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