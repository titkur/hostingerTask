import React, {PureComponent} from 'react';
import BaseTable, {SortOrder} from 'react-base-table';
import {getTradingData} from './ApiClient/ApiClient';
import {mapRequestToTableData} from './Mappers/Mappers';
import TableCellCustom from './TableDataCustomComponents/TableCellCustom';
import Pagination from 'rc-pagination';

const defaultSort = { key: 'years', order: SortOrder.ASC }

class App extends PureComponent {
  state = {
    tableData: null,
    selected: null,
    clickedValue: null,
    lastClickedRowIndex: null,
    showAllItems: false,
    sortBy: defaultSort,
    valuesPerPage: 15,
    currentPage: 1
  };

  handleCheckBoxValueChange = () => {
    const {showAllItems, tableData} = this.state;

    this.setState(() => ({
      showAllItems: !showAllItems    
    }));
  }

  componentDidMount() {
    getTradingData((result) => {
      this.setState(() => ({
        tableData: mapRequestToTableData(result)
      }))
    });
  };

  onColumnSort = sortBy => {
    this.setState({
      sortBy,
      tableData: this.state.tableData.reverse(),
    });
  };

  onEventHandle = {
      onClick: ({ rowData }) => {
        this.setState({
          lastClickedRowIndex: rowData.id
        });
      }
    }
  
  onClickCell = (value) => {
    this.setState({
      clickedValue: value
    });
  }

  renderTableCustom = ({className, cellData, column, columnIndex, rowData, rowIndex}) => 
      <TableCellCustom onClick={this.onClickCell}
                       className={className}
                       cellData={cellData}
                       column={column}
                       columnIndex={columnIndex}
                       rowData={rowData}
                       rowIndex={rowIndex}>                      
      </TableCellCustom>

  rowClassNameHandler = ({ columns, rowData }) => {
    return this.state.lastClickedRowIndex === rowData.id ? "selected" : "";
  }

  // handlePagination = (page) => {
  //   this.setState({
  //     currentPage: page
  //   });
  // }

  render() {
    const columns = [{
      title: 'Id',
      dataKey: 'id',
      key: 'id',
      hidden: true,
      width: 0
    },{
      title: 'Years',
      dataKey: 'years',
      key: 'years',
      sortable: true,
      width: 384
    },{
      title: 'Open',
      dataKey: 'open',
      key: 'open',
      sortable: true,
      width: 384
    }, {
      title: 'Close',
      dataKey: 'close',
      key: 'close',
      sortable: true,
      width: 384
    }, {
      title: 'High',
      dataKey: 'high',
      key: 'high',
      sortable: true,
      width: 384
    }, {
      title: 'Low',
      dataKey: 'low',
      key: 'low',
      sortable: true,
      width: 384
    }, {
      title: 'Volume',
      dataKey: 'volume',
      key: 'volume',
      sortable: true,
      width: 340
    }]

    const {tableData, clickedValue, showAllItems, sortBy, currentPage} = this.state;

    return (
      <div className="app">
        <div className="app__headers">
          <span><h1>Apple stocks trading history</h1></span>
          <span>
            <h2>Clicked value: {clickedValue}</h2>
          </span>
          {/* <span>
              <input type="checkbox" checked={showAllItems} onChange={this.handleCheckBoxValueChange}/>
              Show all items (disable paging)
          </span> */}
        </div>     
        <div className="app__content">
          {
            tableData && <BaseTable
              width={2100}
              height={800}
              rowClassName={this.rowClassNameHandler}
              columns={columns}
              data={tableData}
              sortBy={sortBy}
              onColumnSort={this.onColumnSort}
              onScroll={this.onScroll}
              rowEventHandlers={this.onEventHandle}
              components={{
                TableCell: this.renderTableCustom
              }}
            />
          }
        </div>
        {/* <div className="app__footer">
          { tableData && <Pagination onChange={this.handlePagination} current={currentPage} total={tableData.length} /> }
        </div> */}
      </div>
    );
  }
};

export default App;