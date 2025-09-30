"use client";
import React, { useState } from "react";
import { useUser } from "@/lib/hooks/auth/useUser";
import { showProfessionalAccountTypeSelection } from "@/lib/functions/professionalAccountAlert";
import { testProfessionalAccountApplication, testCorporateApplication } from "@/lib/services/user/testProfessionalAccount";

export default function TestProfessionalPage() {
  const { user } = useUser();
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profesyonel Hesap Test Sayfası</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Kullanıcı Bilgileri</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Ad:</strong> {user.name}</p>
              <p><strong>E-posta:</strong> {user.email}</p>
              <p><strong>Kullanıcı Tipi:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  user.user_type === 'individual' ? 'bg-blue-100 text-blue-800' :
                  user.user_type === 'doctor' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {user.user_type}
                </span>
              </p>
            </div>
          ) : (
            <p>Kullanıcı bilgileri yükleniyor...</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Test Butonları</h2>
          <div className="space-y-4">
            <button
              onClick={showProfessionalAccountTypeSelection}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Profesyonel Hesap SweetAlert'ini Aç
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={async () => {
                  setIsTesting(true);
                  const result = await testProfessionalAccountApplication();
                  setTestResults(result);
                  setIsTesting(false);
                }}
                disabled={isTesting}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {isTesting ? "Test Ediliyor..." : "Doktor API Test"}
              </button>
              
              <button
                onClick={async () => {
                  setIsTesting(true);
                  const result = await testCorporateApplication();
                  setTestResults(result);
                  setIsTesting(false);
                }}
                disabled={isTesting}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {isTesting ? "Test Ediliyor..." : "Kurum API Test"}
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>Not:</strong> Bu buton sadece user_type="individual" olan kullanıcılar için ProfileSidebar'da görünecektir.</p>
              <p>Mevcut kullanıcı tipi: <strong>{user?.user_type}</strong></p>
              <p><strong>Yeni:</strong> Artık SweetAlert modalları kullanılıyor!</p>
            </div>
          </div>
        </div>

        {testResults && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Test Sonuçları</h2>
            <div className={`p-4 rounded-lg ${
              testResults.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p><strong>Durum:</strong> {testResults.message}</p>
              {testResults.success ? (
                <div className="mt-2">
                  <p><strong>Yanıt:</strong></p>
                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(testResults.response, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="mt-2">
                  <p><strong>Hata:</strong></p>
                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(testResults.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
