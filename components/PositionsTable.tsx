import React from 'react';
import type { OpenPosition, ContractType } from '../types';

interface PositionsTableProps {
  positions: OpenPosition[];
}

const getContractTypeClass = (contractType: ContractType): string => {
  const positiveTypes: ContractType[] = ['CALL', 'RESETCALL', 'DIGITMATCH'];
  if (positiveTypes.includes(contractType)) {
    return 'text-deriv-green';
  }
  return 'text-deriv-red';
};

const PositionsTable: React.FC<PositionsTableProps> = ({ positions }) => {
    if (positions.length === 0) {
        return <div className="text-center text-gray-500 py-4">No open positions.</div>
    }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-deriv-dark-300">
          <tr>
            <th scope="col" className="px-4 py-2">Symbol</th>
            <th scope="col" className="px-4 py-2">Type</th>
            <th scope="col" className="px-4 py-2">Stake</th>
            <th scope="col" className="px-4 py-2">Profit/Loss</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(pos => (
            <tr key={pos.contract_id} className="bg-deriv-dark-200 border-b border-deriv-dark-300 hover:bg-deriv-dark">
              <td className="px-4 py-2 font-medium">{pos.longcode}</td>
              <td className={`px-4 py-2 font-semibold ${getContractTypeClass(pos.contract_type)}`}>
                {pos.contract_type}
              </td>
              <td className="px-4 py-2">{pos.buy_price}</td>
              <td className={`px-4 py-2 font-semibold ${pos.profit != null && pos.profit >= 0 ? 'text-deriv-green' : 'text-deriv-red'}`}>
                {pos.profit != null ? pos.profit.toFixed(2) : '...'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsTable;