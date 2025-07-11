import React from 'react';
import TableRow from './TableRow';
import ExpandButton from './ExpandButton';

const TableBody = ({
  rows,
  expandedRows,
  onToggle,
  onValueChange,
  onPercentage,
  onValue
}) => {
  const renderRow = (row, level = 0) => {
    const isExpanded = expandedRows.includes(row.id);
    return (
      <React.Fragment key={row.id}>
        <tr>
          <td>
            <ExpandButton
              isExpanded={isExpanded}
              hasChildren={!!row.children}
              onToggle={() => onToggle(row.id)}
            />
          </td>
          <TableRow
            row={row}
            level={level}
            onValueChange={onValueChange}
            onPercentage={() => onPercentage(row.id)}
            onValue={() => onValue(row.id)}
          />
        </tr>
        {isExpanded && row.children && 
          row.children.map(child => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <tbody>
      {rows.map(row => renderRow(row))}
    </tbody>
  );
};

export default TableBody;
