# Google One Tap Authentication Setup

Bu dokümantasyon, Toga Health projesinde Google One Tap ile giriş ve kayıt sisteminin nasıl kurulacağını açıklar.

## Kurulum Adımları

### 1. Google Cloud Console Yapılandırması

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Credentials" bölümüne gidin
4. "Create Credentials" > "OAuth 2.0 Client IDs" seçin
5. Application type olarak "Web application" seçin
6. Authorized JavaScript origins'e şunları ekleyin:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
7. Authorized redirect URIs'e şunları ekleyin:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)

### 2. Environment Variables

`.env.local` dosyanızı oluşturun ve şu değişkeni ekleyin:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Kullanım

#### Login Sayfasında
```tsx
import GoogleOneTap from '@/components/others/GoogleOneTap';

<GoogleOneTap
  mode="login"
  autoPrompt={false}
  onSuccess={() => {
    console.log("Google ile giriş başarılı");
  }}
  onError={(error) => {
    console.error("Google giriş hatası:", error);
  }}
  className="w-full"
/>
```

#### Register Sayfasında
```tsx
<GoogleOneTap
  mode="register"
  autoPrompt={false}
  onSuccess={(isNewUser) => {
    console.log("Google ile kayıt başarılı", { isNewUser });
  }}
  onError={(error) => {
    console.error("Google kayıt hatası:", error);
  }}
  className="w-full"
/>
```

## Bileşen Özellikleri

### GoogleOneTap Props

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|------------|----------|
| `mode` | `'login' \| 'register'` | - | Giriş veya kayıt modu |
| `onSuccess` | `(isNewUser?: boolean) => void` | - | Başarılı işlem callback'i |
| `onError` | `(error: string) => void` | - | Hata callback'i |
| `disabled` | `boolean` | `false` | Bileşeni devre dışı bırak |
| `autoPrompt` | `boolean` | `false` | Otomatik prompt göster |
| `cancelOnTapOutside` | `boolean` | `false` | Dışarı tıklayınca iptal et |
| `style` | `React.CSSProperties` | - | Özel stil |
| `className` | `string` | - | CSS sınıfı |

## API Endpoints

### POST /api/auth/google/login
Google ile giriş yapma endpoint'i

**Request Body:**
```json
{
  "credential": "google_jwt_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Google ile giriş başarılı",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "avatar": "avatar_url",
      "provider": "google",
      "provider_id": "google_user_id"
    },
    "is_new_user": false
  }
}
```

### POST /api/auth/google/register
Google ile kayıt olma endpoint'i

**Request Body:**
```json
{
  "credential": "google_jwt_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Google ile kayıt başarılı",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "avatar": "avatar_url",
      "provider": "google",
      "provider_id": "google_user_id"
    },
    "is_new_user": true
  }
}
```

## Geliştirme Notları

1. **Güvenlik**: Google JWT token'ları her zaman backend'de doğrulanmalıdır
2. **Veritabanı**: Gerçek uygulamada kullanıcı bilgileri veritabanında saklanmalıdır
3. **Error Handling**: Tüm hata durumları uygun şekilde ele alınmalıdır
4. **Testing**: Farklı Google hesap türleri ile test edilmelidir

## Sorun Giderme

### Yaygın Hatalar

1. **"Google One Tap script yüklenemedi"**
   - İnternet bağlantınızı kontrol edin
   - Google Client ID'nin doğru olduğundan emin olun

2. **"Geçersiz Google token"**
   - Client ID'nin environment variable'da doğru tanımlandığından emin olun
   - Google Cloud Console'da domain'in authorized origins'de olduğunu kontrol edin

3. **"Google One Tap gösterilmedi"**
   - Kullanıcı daha önce "Never" seçmiş olabilir
   - `autoPrompt={true}` ile otomatik prompt'u aktif edin

## Gelecek Geliştirmeler

- [ ] Facebook Login entegrasyonu
- [ ] Apple Sign-In entegrasyonu
- [ ] Social login provider'ları için genel interface
- [ ] Kullanıcı profil fotoğrafı senkronizasyonu
- [ ] Çoklu provider desteği (aynı email ile farklı provider'lar)
