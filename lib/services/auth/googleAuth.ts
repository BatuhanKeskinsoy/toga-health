import api from "@/lib/axios";

export interface GoogleAuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: any;
    is_new_user?: boolean;
  };
}

export interface GoogleAuthRequest {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  phone?: string;
  user_type?: "individual" | "doctor" | "corporate";
  corporate_type?: "hospital" | "clinic" | "pharmacy";
  license_number?: string;
  google_credential?: string;
}

export async function googleAuthService(userData: GoogleAuthRequest): Promise<GoogleAuthResponse> {
  // Backend'de POST method'u desteklenmediği için GET ile query parameter olarak gönder
  const queryParams = new URLSearchParams();
  if (userData.google_credential) {
    queryParams.append('credential', userData.google_credential);
  }
  if (userData.user_type) {
    queryParams.append('user_type', userData.user_type);
  }
  
  const res = await api.get(`/auth/social/google?${queryParams.toString()}`);
  return res.data;
}
