import React from 'react';
import './HierarchicalTable.css';

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Expand</th>
        <th>Label</th>
        <th>Value</th>
        <th>Input</th>
        <th>Variance</th>
        <th>Allocation %</th>
        <th>Allocation Value</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
