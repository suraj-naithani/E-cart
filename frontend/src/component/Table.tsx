import React from "react";

interface TableProps {
    headings: string[];
    data: Record<string, any>[];
}

const Table: React.FC<TableProps> = ({ headings, data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-500">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {headings.map((header, index) => (
                            <th key={index} className="px-6 py-4 font-semibold tracking-wide">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                                {headings.map((heading, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4">
                                        {row[heading.toLowerCase()] || "-"}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={headings.length}
                                className="text-center px-6 py-4 font-medium text-gray-900"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
