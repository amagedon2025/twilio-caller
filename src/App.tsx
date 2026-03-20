import { PhoneDialer } from './components/PhoneDialer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Ethereum Events</h1>
          <p className="text-gray-600">Ready to dail AI Task Assistant</p>
        </div>
        <PhoneDialer />
      </div>
    </div>
  );
}

export default App;
