import React from 'react';
import PropTypes from 'prop-types';
import { toString } from 'react-base-table/lib/utils';

/**
 * Cell component for BaseTable
 */
const TableCellCustom = ({ className, cellData, column, columnIndex, rowData, rowIndex, onClick }) => {
    const value = React.isValidElement(cellData) ? cellData : toString(cellData);

    return (
        <div className={className} onClick={() => onClick(value)}>{value}</div>   
    )
};

TableCellCustom.propTypes = {
  className: PropTypes.string,
  cellData: PropTypes.any,
  column: PropTypes.object,
  columnIndex: PropTypes.number,
  rowData: PropTypes.object,
  rowIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default TableCellCustom;