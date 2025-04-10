// pages/dropshipper/payments.tsx

const payments = [
  {
    id: 'PAY12345',
    date: '2025-04-01',
    amount: 2999,
    method: 'Razorpay',
    status: 'Success',
  },
  {
    id: 'PAY12346',
    date: '2025-03-24',
    amount: 1499,
    method: 'Stripe',
    status: 'Success',
  },
  {
    id: 'PAY12347',
    date: '2025-03-10',
    amount: 2999,
    method: 'Razorpay',
    status: 'Failed',
  },
];

export default function Payment() {
  const totalPaid = payments
    .filter(p => p.status === 'Success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white max-w-6xl rounded-xl shadow-sm p-6">
      <div className="">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Payments</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Paid</p>
            <h2 className="text-xl font-semibold text-green-600">₹{totalPaid}</h2>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Last Payment</p>
            <h2 className="text-lg text-gray-800">{payments[0].date}</h2>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Payment Method</p>
            <h2 className="text-lg text-gray-800">{payments[0].method}</h2>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto ">
          <table className="w-full text-sm text-left border">
            <thead className="bg-orange-500 text-white ">
              <tr>
                <th className="px-4 py-3 ">Payment ID</th>
                <th className="px-4 py-3 border-l border-black">Date</th>
                <th className="px-4 py-3 border-l border-black">Amount</th>
                <th className="px-4 py-3 border-l border-black">Method</th>
                <th className="px-4 py-3 border-l border-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3 border-l border-black font-medium">{payment.id}</td>
                  <td className="px-4 py-3 border-l border-black">{payment.date}</td>
                  <td className="px-4 py-3 border-l border-black">₹{payment.amount}</td>
                  <td className="px-4 py-3 border-l border-black">{payment.method}</td>
                  <td className={`px-4 py-3 border-l border-black font-medium ${payment.status === 'Success' ? 'text-green-600' : 'text-red-500'}`}>
                    {payment.status}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
