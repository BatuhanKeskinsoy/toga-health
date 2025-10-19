
export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const success = params.success;
  const token = params.token;
  const code = params.code;
  const state = params.state;

  // Yeni callback formatı (success, token, message parametreleri ile)
  if (success === 'true' && token && typeof token === 'string') {
    try {
      // API route ile token kaydetme
      const response = await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      
      if (result.success) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Giriş Başarılı!</h1>
              <p className="text-gray-600 mb-4">Token başarıyla kaydedildi</p>
              <div className="bg-gray-100 p-4 rounded-lg text-left max-w-2xl">
                <h3 className="font-semibold mb-4 text-lg">🔍 Debug Bilgileri:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Success:</strong> {success}</p>
                    <p><strong>Token:</strong> {token.substring(0, 30)}...</p>
                    <p><strong>Cookie Set:</strong> ✅</p>
                  </div>
                  <div>
                    <p><strong>Code:</strong> {code || 'Yok'}</p>
                    <p><strong>State:</strong> {state || 'Yok'}</p>
                    <p><strong>Format:</strong> Yeni (Direct Token)</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded">
                  <p className="text-green-800 font-medium">✅ İşlem Başarılı: Token doğrudan URL'den alındı ve cookie'ye kaydedildi</p>
                  <p className="text-green-700 text-sm mt-1">API Response: {result.message}</p>
                </div>
              </div>
              <a 
                href="/" 
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ana Sayfaya Git
              </a>
            </div>
          </div>
        );
      } else {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Token Kaydetme Hatası</h1>
              <p className="text-gray-600 mb-4">Token kaydedilemedi</p>
              <div className="bg-red-100 p-4 rounded-lg text-left max-w-2xl">
                <h3 className="font-semibold mb-4 text-lg">🔍 Debug Bilgileri:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Success:</strong> {success}</p>
                    <p><strong>Token:</strong> {token ? token.substring(0, 30) + '...' : 'Yok'}</p>
                    <p><strong>Format:</strong> Yeni (Direct Token)</p>
                  </div>
                  <div>
                    <p><strong>Code:</strong> {code || 'Yok'}</p>
                    <p><strong>State:</strong> {state || 'Yok'}</p>
                    <p><strong>Cookie Set:</strong> ❌</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-red-50 rounded">
                  <p className="text-red-800 font-medium">❌ API Hatası:</p>
                  <p className="text-red-700 text-sm mt-1">{result.error || 'Bilinmeyen hata'}</p>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-gray-800 font-medium">📡 API Response:</p>
                  <pre className="text-xs text-gray-700 mt-1 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
              <a 
                href="/" 
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ana Sayfaya Git
              </a>
            </div>
          </div>
        );
      }
    } catch (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">API Çağrısı Hatası</h1>
            <p className="text-gray-600 mb-4">API'ye ulaşılamadı</p>
            <div className="bg-red-100 p-4 rounded-lg text-left max-w-2xl">
              <h3 className="font-semibold mb-4 text-lg">🔍 Debug Bilgileri:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Success:</strong> {success}</p>
                  <p><strong>Token:</strong> {token ? token.substring(0, 30) + '...' : 'Yok'}</p>
                  <p><strong>Format:</strong> Yeni (Direct Token)</p>
                </div>
                <div>
                  <p><strong>Code:</strong> {code || 'Yok'}</p>
                  <p><strong>State:</strong> {state || 'Yok'}</p>
                  <p><strong>Cookie Set:</strong> ❌</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded">
                <p className="text-red-800 font-medium">❌ Hata Detayı:</p>
                <p className="text-red-700 text-sm mt-1">{error instanceof Error ? error.message : String(error)}</p>
              </div>
            </div>
            <a 
              href="/" 
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ana Sayfaya Git
            </a>
          </div>
        </div>
      );
    }
  }

  // Eski callback formatı (code ve state parametreleri ile)
  if (code && state && typeof code === 'string' && typeof state === 'string') {
    try {
      // Backend'e callback isteği gönder
      const response = await fetch('https://samsunev.com/api/v1/auth/social/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          state: state
        })
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        // API route ile token kaydetme
        const tokenResponse = await fetch('/api/auth/set-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: data.token }),
        });

        const tokenResult = await tokenResponse.json();
        
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Giriş Başarılı!</h1>
              <p className="text-gray-600 mb-4">Token başarıyla kaydedildi</p>
              <div className="bg-gray-100 p-4 rounded-lg text-left max-w-2xl">
                <h3 className="font-semibold mb-4 text-lg">🔍 Debug Bilgileri:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Code:</strong> {code.substring(0, 20)}...</p>
                    <p><strong>State:</strong> {state.substring(0, 20)}...</p>
                    <p><strong>Format:</strong> Eski (Backend Call)</p>
                  </div>
                  <div>
                    <p><strong>Backend Success:</strong> {data.success ? '✅' : '❌'}</p>
                    <p><strong>Token:</strong> {data.token ? `${data.token.substring(0, 30)}...` : 'Yok'}</p>
                    <p><strong>Cookie Set:</strong> ✅</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded">
                  <p className="text-green-800 font-medium">✅ İşlem Başarılı: Backend'den token alındı ve cookie'ye kaydedildi</p>
                  <p className="text-green-700 text-sm mt-1">Message: {data.message || 'Yok'}</p>
                  <p className="text-green-700 text-sm mt-1">Token API: {tokenResult.success ? '✅' : '❌'}</p>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded">
                  <p className="text-blue-800 font-medium">📡 Backend Response:</p>
                  <pre className="text-xs text-blue-700 mt-1 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
                </div>
              </div>
              <a 
                href="/" 
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ana Sayfaya Git
              </a>
            </div>
          </div>
        );
      } else {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Backend Hatası</h1>
              <p className="text-gray-600 mb-4">Backend'den başarısız yanıt</p>
              <div className="bg-red-100 p-4 rounded-lg text-left max-w-2xl">
                <h3 className="font-semibold mb-4 text-lg">🔍 Debug Bilgileri:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Code:</strong> {code.substring(0, 20)}...</p>
                    <p><strong>State:</strong> {state.substring(0, 20)}...</p>
                    <p><strong>Format:</strong> Eski (Backend Call)</p>
                  </div>
                  <div>
                    <p><strong>Backend Success:</strong> {data.success ? '✅' : '❌'}</p>
                    <p><strong>Token:</strong> {data.token ? 'Var' : 'Yok'}</p>
                    <p><strong>Cookie Set:</strong> ❌</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-red-50 rounded">
                  <p className="text-red-800 font-medium">❌ Backend Response:</p>
                  <pre className="text-xs text-red-700 mt-1 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
                </div>
              </div>
              <a 
                href="/" 
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ana Sayfaya Git
              </a>
            </div>
          </div>
        );
      }
    } catch (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Backend Çağrısı Hatası</h1>
            <p className="text-gray-600 mb-4">Backend'e ulaşılamadı</p>
            <div className="bg-red-100 p-4 rounded-lg text-left max-w-2xl">
              <h3 className="font-semibold mb-4 text-lg">🔍 Debug Bilgileri:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Code:</strong> {code.substring(0, 20)}...</p>
                  <p><strong>State:</strong> {state.substring(0, 20)}...</p>
                  <p><strong>Format:</strong> Eski (Backend Call)</p>
                </div>
                <div>
                  <p><strong>Success:</strong> {success || 'Yok'}</p>
                  <p><strong>Token:</strong> {token || 'Yok'}</p>
                  <p><strong>Cookie Set:</strong> ❌</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded">
                <p className="text-red-800 font-medium">❌ Hata Detayı:</p>
                <p className="text-red-700 text-sm mt-1">{error instanceof Error ? error.message : String(error)}</p>
              </div>
            </div>
            <a 
              href="/" 
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ana Sayfaya Git
            </a>
          </div>
        </div>
      );
    }
  }

  // Geçersiz parametreler durumu
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Geçersiz Parametreler</h1>
        <p className="text-gray-600 mb-4">Callback parametreleri geçersiz</p>
        <div className="bg-yellow-100 p-4 rounded-lg text-left max-w-2xl">
          <h3 className="font-semibold mb-4 text-lg">🔍 Debug Bilgileri:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Success:</strong> {success || 'Yok'}</p>
              <p><strong>Token:</strong> {token ? 'Var' : 'Yok'}</p>
              <p><strong>Format:</strong> Belirsiz</p>
            </div>
            <div>
              <p><strong>Code:</strong> {code ? 'Var' : 'Yok'}</p>
              <p><strong>State:</strong> {state ? 'Var' : 'Yok'}</p>
              <p><strong>Cookie Set:</strong> ❌</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded">
            <p className="text-yellow-800 font-medium">⚠️ Durum: Hiçbir geçerli parametre kombinasyonu bulunamadı</p>
            <p className="text-yellow-700 text-sm mt-1">
              Beklenen formatlar:<br/>
              • Yeni: success=true&token=...<br/>
              • Eski: code=...&state=...
            </p>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p className="text-gray-800 font-medium">📋 Tüm Parametreler:</p>
            <pre className="text-xs text-gray-700 mt-1 overflow-auto">
{JSON.stringify({
  success: success || null,
  token: token ? '***' : null,
  code: code ? '***' : null,
  state: state ? '***' : null
}, null, 2)}
            </pre>
          </div>
        </div>
        <a 
          href="/" 
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ana Sayfaya Git
        </a>
      </div>
    </div>
  );
}

