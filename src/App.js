import React, { PureComponent, createRef } from 'react';
import BaseTable, { SortOrder } from 'react-base-table';
import { getTradingData } from './ApiClient/ApiClient';
import { mapRequestToTableData } from './Mappers/Mappers';
import TableCellCustom from './TableDataCustomComponents/TableCellCustom';
import Pagination from 'rc-pagination';
import { orderBy } from 'lodash';

const defaultSort = { key: 'years', order: SortOrder.DESC }

class App extends PureComponent {
  constructor() {
    super();

    this.tableRef = createRef();
  }

  state = {
    tableData: null,
    selected: null,
    clickedValue: null,
    lastClickedRowIndex: null,
    disablePaging: false,
    sortBy: defaultSort,
    rowHeight: 0,
    valuesPerPage: 1,
    currentPage: 1
  }

  handleCheckBoxValueChange = () => {
    const { disablePaging } = this.state;

    this.setState(() => ({
      disablePaging: !disablePaging
    }));
  }

  componentDidMount() {
    getTradingData((result) => {
      this.setState(() => ({
        tableData: mapRequestToTableData(result)
      }))
    }).finally(() => {
      if (this.tableRef.current !== null) {
        const tableRefProps = this.tableRef.current.props;

        this.setState({
          rowHeight: tableRefProps.rowHeight,
          valuesPerPage: (tableRefProps.height - tableRefProps.headerHeight) / tableRefProps.rowHeight
        });
      }
    });
  };

  onColumnSort = ({ key, order }) => {
    const { tableData } = this.state;

    this.setState({
      sortBy: { key, order },
      tableData: orderBy(tableData, key, order)
    });
  };

  onClickCell = (value) => {
    this.setState({
      clickedValue: value
    });
  }

  renderTableCellCustom = ({ className, cellData, column, columnIndex, rowData, rowIndex }) =>
    <TableCellCustom onClick={this.onClickCell}
      className={className}
      cellData={cellData}
      column={column}
      columnIndex={columnIndex}
      rowData={rowData}
      rowIndex={rowIndex}>
    </TableCellCustom>

  rowClassNameHandler = ({ rowData }) => {
    const { lastClickedRowIndex } = this.state;

    return lastClickedRowIndex === rowData.id ? "selected" : "";
  }

  handleScroll = ({ scrollTop }) => {
    //skip on initial load
    if (!this.tableRef.current) {
      return;
    }

    const { currentPage, valuesPerPage, tableData, rowHeight } = this.state;

    const pageHeight = rowHeight * valuesPerPage;
    let nextPage = Math.floor(scrollTop / pageHeight) + 1;

    //check if last page reached
    const lastPageNumber = Math.ceil(tableData.length / valuesPerPage);
    const allItemsHeight = rowHeight * tableData.length;

    if (scrollTop >= (allItemsHeight - pageHeight)) {
      nextPage = lastPageNumber;
    }

    currentPage !== nextPage && this.setState({
      currentPage: nextPage
    });
  };

  handlePagination = (page) => {
    const { valuesPerPage } = this.state;

    this.setState({
      currentPage: page
    });

    this.tableRef.current.scrollToRow((page - 1) * valuesPerPage, "start");
  }

  rowEventHandlers = {
    onClick: ({ rowData }) => {
      this.setState({
        lastClickedRowIndex: rowData.id
      });
    }
  }

  render() {
    const columns = [{
      title: 'Id',
      dataKey: 'id',
      key: 'id',
      hidden: true,
      width: 0
    }, {
      title: 'Years',
      dataKey: 'years',
      key: 'years',
      sortable: true,
      width: 300
    }, {
      title: 'Open',
      dataKey: 'open',
      key: 'open',
      sortable: true,
      width: 300
    }, {
      title: 'Close',
      dataKey: 'close',
      key: 'close',
      sortable: true,
      width: 300
    }, {
      title: 'High',
      dataKey: 'high',
      key: 'high',
      sortable: true,
      width: 300
    }, {
      title: 'Low',
      dataKey: 'low',
      key: 'low',
      sortable: true,
      width: 300
    }, {
      title: 'Volume',
      dataKey: 'volume',
      key: 'volume',
      sortable: true,
      width: 300
    }]

    const { currentPage, tableData, clickedValue, showAllItems, sortBy, valuesPerPage, disablePaging } = this.state;

    return (
      <div className="app">
        <div className="app__headers">
          <h1>Apple stocks trading history</h1>
          <h2>Clicked value: {clickedValue || "-"}</h2>
          <input type="checkbox" checked={showAllItems} onChange={this.handleCheckBoxValueChange} /><span>Disable paging</span>
        </div>
        <div className="app__content">
          {tableData && <BaseTable
            ref={this.tableRef}
            width={1800}
            height={600}
            rowClassName={this.rowClassNameHandler}
            columns={columns}
            data={tableData}
            sortBy={sortBy}
            onColumnSort={this.onColumnSort}
            onScroll={this.handleScroll}
            rowEventHandlers={this.rowEventHandlers}
            components={{
              TableCell: this.renderTableCellCustom
            }}
          />
          }
        </div>
        <div className="app__footer">
          {tableData && !disablePaging && <Pagination
            onChange={this.handlePagination}
            pageSize={valuesPerPage}
            current={currentPage}
            total={tableData.length}
            style={{
              margin: '0 auto',
              width: 'fit-content',
              textAlign: 'center'
            }} />}
        </div>
      </div>
    );
  }
};

export default App;