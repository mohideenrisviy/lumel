import React from 'react';

const TableRow = ({
  row,
  level,
  onValueChange,
  onPercentage,
  onValue
}) => {
  const rowData = {
    value: row.value,
    variancePercent: row.variancePercent || '0.00'
  };

  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {Array(level).fill(' ').join('')}
          <span style={{ width: '200px', display: 'inline-block' }}>
            {row.label}
          </span>
        </div>
      </td>
      <td>{rowData.value}</td>
      <td>
        <input
          type="number"
          value={row.input}
          onChange={(e) => onValueChange(row.id, e.target.value,level)}
          style={{ width: '100px' }}
        />
      </td>   
      <td>
        <button 
          onClick={onPercentage}
          style={{
            padding: '4px 8px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          %
        </button>
      </td>
      <td>
        <button 
          onClick={onValue}
          style={{
            padding: '4px 8px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Value
        </button>
      </td>
      <td>{rowData.variancePercent}%</td>
    </tr>
  );
};

export default TableRow;
