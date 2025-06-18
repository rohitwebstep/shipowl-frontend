
export default function Connecting() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <div className="w-20 h-20 border-8 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
      <h1 className="text-xl font-semibold text-gray-800">Connecting your Shopify store...</h1>
      <p className="text-gray-500 mt-2">Please wait while we establish a secure connection.</p>
    </div>
  );
}
