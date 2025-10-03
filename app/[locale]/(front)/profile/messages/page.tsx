export default function MessagesPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-gray-400 text-6xl">💬</div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-gray-700">
              Bir konuşma seçin
            </h3>
            <p className="text-gray-500">
              Sol taraftan bir kişi seçerek konuşmaya başlayın
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}