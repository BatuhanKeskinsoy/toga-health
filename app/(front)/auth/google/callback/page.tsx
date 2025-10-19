export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const success = params.success;
  const token = params.token;
  const message = params.message;
  const baseURL = "https://togahealth.vercel.app";

  // Token parametresi varsa cookie'ye kaydet
  if (token && typeof token === "string") {
    try {
      // API route ile token kaydetme
      const response = await fetch(`${baseURL}/api/auth/set-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (result.success) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Giriş Başarılı!
              </h1>
              <p className="text-gray-600 mb-4">Token başarıyla kaydedildi</p>
              <div className="bg-gray-100 p-4 rounded-lg text-left max-w-2xl">
                <h3 className="font-semibold mb-4 text-lg">
                  🔍 Debug Bilgileri:
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Success:</strong> {success || "Yok"}
                    </p>
                    <p>
                      <strong>Token:</strong> {token.substring(0, 30)}...
                    </p>
                    <p>
                      <strong>Cookie Set:</strong> ✅
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Message:</strong> {message || "Yok"}
                    </p>
                    <p>
                      <strong>Format:</strong> Google OAuth
                    </p>
                    <p>
                      <strong>Status:</strong> Başarılı
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded">
                  <p className="text-green-800 font-medium">
                    ✅ İşlem Başarılı: Token URL'den alındı ve cookie'ye
                    kaydedildi
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    API Response: {result.message}
                  </p>
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
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Token Kaydetme Hatası
              </h1>
              <p className="text-gray-600 mb-4">Token kaydedilemedi</p>
              <div className="bg-red-100 p-4 rounded-lg text-left max-w-2xl">
                <h3 className="font-semibold mb-4 text-lg">
                  🔍 Debug Bilgileri:
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Success:</strong> {success || "Yok"}
                    </p>
                    <p>
                      <strong>Token:</strong> {token.substring(0, 30)}...
                    </p>
                    <p>
                      <strong>Cookie Set:</strong> ❌
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Message:</strong> {message || "Yok"}
                    </p>
                    <p>
                      <strong>Format:</strong> Google OAuth
                    </p>
                    <p>
                      <strong>Status:</strong> Hata
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-red-50 rounded">
                  <p className="text-red-800 font-medium">❌ API Hatası:</p>
                  <p className="text-red-700 text-sm mt-1">
                    {result.data.error || "Bilinmeyen hata"}
                  </p>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-gray-800 font-medium">📡 API Response:</p>
                  <pre className="text-xs text-gray-700 mt-1 overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
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
    } catch (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              API Çağrısı Hatası
            </h1>
            <p className="text-gray-600 mb-4">API'ye ulaşılamadı</p>
            <div className="bg-red-100 p-4 rounded-lg text-left max-w-2xl">
              <h3 className="font-semibold mb-4 text-lg">
                🔍 Debug Bilgileri:
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Success:</strong> {success || "Yok"}
                  </p>
                  <p>
                    <strong>Token:</strong> {token.substring(0, 30)}...
                  </p>
                  <p>
                    <strong>Cookie Set:</strong> ❌
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Message:</strong> {message || "Yok"}
                  </p>
                  <p>
                    <strong>Format:</strong> Google OAuth
                  </p>
                  <p>
                    <strong>Status:</strong> API Hatası
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded">
                <p className="text-red-800 font-medium">❌ Hata Detayı:</p>
                <p className="text-red-700 text-sm mt-1">
                  {error instanceof Error ? error.message : String(error)}
                </p>
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

  // Token yoksa hata
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Token Bulunamadı
        </h1>
        <p className="text-gray-600 mb-4">
          URL'de token parametresi bulunamadı
        </p>
        <div className="bg-yellow-100 p-4 rounded-lg text-left max-w-2xl">
          <h3 className="font-semibold mb-4 text-lg">🔍 Debug Bilgileri:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Success:</strong> {success || "Yok"}
              </p>
              <p>
                <strong>Token:</strong> {token ? "Var" : "Yok"}
              </p>
              <p>
                <strong>Message:</strong> {message || "Yok"}
              </p>
            </div>
            <div>
              <p>
                <strong>Format:</strong> Google OAuth
              </p>
              <p>
                <strong>Status:</strong> Token Yok
              </p>
              <p>
                <strong>Cookie Set:</strong> ❌
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded">
            <p className="text-yellow-800 font-medium">
              ⚠️ Durum: Token parametresi bulunamadı
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              Beklenen format: ?token=...&success=true&message=...
            </p>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p className="text-gray-800 font-medium">📋 Tüm Parametreler:</p>
            <pre className="text-xs text-gray-700 mt-1 overflow-auto">
              {JSON.stringify(
                {
                  success: success || null,
                  token: token ? "***" : null,
                  message: message || null,
                },
                null,
                2
              )}
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
