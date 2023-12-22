import React, { useState } from "react";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import { Table, Pagination, Input, Dropdown } from "semantic-ui-react";
import "../../assets/scss/data-table.scss";
import "../../assets/scss/dropdown.scss";
import { BsSearch, BsCaretDownSquareFill, BsCaretUpSquareFill } from "react-icons/bs";
function DataTable({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    state,
    gotoPage,
    setGlobalFilter,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const { pageIndex, pageSize, globalFilter } = state;
  const handlePageSizeChange = (newPageSize) => {
    // Sayfa boyutunu değiştirdiğinizde sayfa numarasını da sıfırla
    gotoPage(0);
    setPageSize(newPageSize);
  };
  const pageSizeOptions = [10, 20, 50];
  return (
    <div className="data-table-body">
      <Table className="ui table" {...getTableProps()} striped celled sortable>
        <thead className="data-table-thead">
          <Input
            className="data-table-body-search-input"
            icon={<BsSearch />}
            placeholder="Ara..."
            value={globalFilter || ""}
            onChange={(e, { value }) => {
              setGlobalFilter(value || undefined);
            }}
          />
          {headerGroups.map((headerGroup) => (
            <tr
              width={3}
              className="data-table-thead-tr"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="data-table-thead-tr-th "
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <BsCaretDownSquareFill />
                      ) : (
                        <BsCaretUpSquareFill />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr width={3} className="tbody-tr" {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className="tbody-tr-td " {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="data-table-footer">
        <div className="page-size-container">
          <span>Göster:</span>
          <select
            className="page-size-select"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option className="data-table-options" key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <Pagination
          activePage={pageIndex + 1}
          totalPages={pageOptions.length}
          siblingRange={1}
          onPageChange={(event, data) => {
            const { activePage } = data;
            gotoPage(activePage - 1);
          }}
        />
      </div>
    </div>
  );
}
export default DataTable;