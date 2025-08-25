import React, { useState } from 'react';

const DataTable = ({ data, columns }) => {
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  const filteredData = data.filter(item =>
    columns.some(column =>
      item[column.accessor].toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto">
      <input
        type="text"
        placeholder="Filter..."
        className="border border-gray-300 rounded p-2 mb-4"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map(column => (
              <th
                key={column.accessor}
                className="border-b py-2 px-4 cursor-pointer"
                onClick={() => requestSort(column.accessor)}
              >
                {column.label}
                {sortConfig && sortConfig.key === column.accessor ? (
                  sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index} className="border-b">
              {columns.map(column => (
                <td key={column.accessor} className="py-2 px-4">
                  {item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;