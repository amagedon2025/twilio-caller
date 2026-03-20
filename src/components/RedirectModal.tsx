interface RedirectModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RedirectModal({ isOpen, onConfirm, onCancel }: RedirectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Leave Call Interface?</h2>
        <p className="text-gray-600 mb-6">
          You will be redirected to Ethereum Vaults. This will open in a new tab so you can return to your call.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 active:scale-95 transition-all duration-150"
          >
            Stay Here
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 active:scale-95 transition-all duration-150"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
