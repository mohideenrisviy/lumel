import React from 'react';

const ExpandButton = ({ isExpanded, hasChildren, onToggle }) => {
  const buttonStyle = {
    padding: '0',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    aspectRatio: '1',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    lineHeight: '1',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  const iconStyle = {
    display: 'block',
    fontSize: '12px',
    lineHeight: '1',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
  };

  const hiddenStyle = {
    visibility: 'hidden',
    display: 'block',
    width: '100%',
    height: '100%'
  };

  return (
    <button
      onClick={onToggle}
      style={buttonStyle}
    >
      {hasChildren ? (
        <span style={iconStyle}>▶</span>
      ) : (
        <span style={hiddenStyle}>▶</span>
      )}
    </button>
  );
};

export default ExpandButton;
