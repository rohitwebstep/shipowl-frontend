
"use client"
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Success() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-xl font-semibold text-green-600">Shopify Store Connected!</h1>
      <p className="text-gray-500 mt-2">Your store has been successfully connected.</p>
      <button className='bg-orange-500 rounded-md p-3 text-white mt-3' onClick={() => router.push('/dropshipping')}>Go to Dashboard</button>
    </div>
  );
}
