import { useState } from 'react';
import { Phone, PhoneOff, Delete, Wallet } from 'lucide-react';
import { useTwilioVoice } from '../hooks/useTwilioVoice';
import { RedirectModal } from './RedirectModal';

const dialPadButtons = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
];

export function PhoneDialer() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const { callStatus, error, makeCall, hangUp } = useTwilioVoice();

  const handleDigitPress = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
    playTouchTone();
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (callStatus === 'in-call' || callStatus === 'connecting' || callStatus === 'ringing') {
      hangUp();
    } else {
      makeCall(phoneNumber);
    }
  };

  const handleWalletClick = () => {
    setShowRedirectModal(true);
  };

  const handleRedirectConfirm = () => {
    window.open('https://ethereum-vaults.com', '_blank');
    setShowRedirectModal(false);
  };

  const playTouchTone = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case 'connecting':
      case 'ringing':
        return 'text-yellow-600';
      case 'in-call':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'disconnected':
        return 'text-gray-600';
      default:
        return 'text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'ringing':
        return 'Ringing...';
      case 'in-call':
        return 'Call in progress';
      case 'error':
        return error || 'Error occurred';
      case 'disconnected':
        return 'Call ended';
      default:
        return 'Ready to call';
    }
  };

  const isCallActive = callStatus === 'in-call' || callStatus === 'connecting' || callStatus === 'ringing';

  return (
    <>
      <div className="w-full max-w-sm mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 sm:p-8 text-white">
            <div className="text-center mb-2">
              <p className={`text-sm font-medium ${getStatusColor()} bg-white px-4 py-1 rounded-full inline-block`}>
                {getStatusText()}
              </p>
            </div>
            <div className="text-center">
              <input
                type="tel"
                value={phoneNumber}
                readOnly
                placeholder="Enter number"
                className="bg-transparent text-white text-2xl sm:text-3xl font-light text-center w-full placeholder-blue-200 focus:outline-none min-h-[2rem]"
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-gray-50">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              {dialPadButtons.map((button) => (
                <button
                  key={button.digit}
                  onClick={() => handleDigitPress(button.digit)}
                  disabled={isCallActive}
                  className="dial-button aspect-square rounded-xl sm:rounded-2xl bg-white shadow-md hover:shadow-lg active:scale-95 transform transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center text-gray-800 hover:bg-blue-50"
                >
                  <span className="text-xl sm:text-3xl font-semibold">{button.digit}</span>
                  {button.letters && (
                    <span className="text-[0.6rem] sm:text-xs text-gray-500 mt-0.5">{button.letters}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 sm:gap-4 justify-center items-center">
              <button
                onClick={handleBackspace}
                disabled={phoneNumber.length === 0 || isCallActive}
                className="p-2.5 sm:p-4 rounded-full bg-gray-200 hover:bg-gray-300 active:scale-95 transform transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Delete className="w-5 sm:w-6 h-5 sm:h-6 text-gray-700" />
              </button>

              <button
                onClick={handleCall}
                disabled={callStatus === 'connecting' || (phoneNumber.length === 0 && !isCallActive)}
                className={`p-4 sm:p-6 rounded-full shadow-xl active:scale-95 transform transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCallActive
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isCallActive ? (
                  <PhoneOff className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
                ) : (
                  <Phone className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
                )}
              </button>

              <button
                onClick={handleWalletClick}
                className="p-2.5 sm:p-4 rounded-full bg-gray-200 hover:bg-gray-300 active:scale-95 transform transition-all duration-150"
              >
                <Wallet className="w-5 sm:w-6 h-5 sm:h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
          <p>Enter a phone number with country code</p>
          <p className="text-[0.7rem] sm:text-xs mt-1">(e.g., +1234567890)</p>
        </div>
      </div>

      <RedirectModal
        isOpen={showRedirectModal}
        onConfirm={handleRedirectConfirm}
        onCancel={() => setShowRedirectModal(false)}
      />
    </>
  );
}
