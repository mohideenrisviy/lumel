import React from 'react';

const AllocationButtons = ({
  onPercentage,
  onValue
}) => {
  return (
    <>
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
    </>
  );
};

export default AllocationButtons;
