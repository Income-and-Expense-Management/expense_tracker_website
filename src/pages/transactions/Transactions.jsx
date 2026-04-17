const Transactions = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sổ tay Giao dịch</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500 italic">Bảng chứa lịch sử các luồng thu/chi sẽ được đưa vào đây. Cần fetch GET `/api/v1/transactions`.</p>
      </div>
    </div>
  );
};

export default Transactions;
