import { applyProfessionalAccount } from "./professionalAccount";

// Test fonksiyonu - gerçek API'yi test etmek için
export async function testProfessionalAccountApplication() {
  try {
    // Test verisi oluştur
    const testFormData = new FormData();
    
    // Doktor başvuru test verisi
    testFormData.append("user_type", "doctor");
    testFormData.append("specialty_id", "1");
    testFormData.append("license_number", "TEST123456");
    
    // Test belgesi (gerçek bir dosya yerine text)
    const testDocumentContent = "Test belge içeriği";
    const testDocumentBlob = new Blob([testDocumentContent], { type: "text/plain" });
    const testDocumentFile = new File([testDocumentBlob], "test-document.txt", {
      type: "text/plain"
    });
    
    testFormData.append("documents[0][document_type]", "license");
    testFormData.append("documents[0][title]", "Test Lisans Belgesi");
    testFormData.append("documents[0][description]", "Test doktor lisans belgesi");
    testFormData.append("documents[0][document]", testDocumentFile);
    
    console.log("Test başvuru verisi gönderiliyor...");
    
    const response = await applyProfessionalAccount(testFormData);
    
    console.log("API Yanıtı:", response);
    
    return {
      success: true,
      response,
      message: "Test başarılı"
    };
    
  } catch (error: any) {
    console.error("Test hatası:", error);
    
    return {
      success: false,
      error: error?.response?.data || error.message,
      message: "Test başarısız"
    };
  }
}

// Kurum başvuru test fonksiyonu
export async function testCorporateApplication() {
  try {
    const testFormData = new FormData();
    
    testFormData.append("user_type", "corporate");
    testFormData.append("company_name", "Test Hastanesi");
    testFormData.append("tax_number", "1234567890");
    testFormData.append("license_number", "CORP123456");
    testFormData.append("address", "Test Adres");
    testFormData.append("phone", "+905551234567");
    testFormData.append("email", "test@hastane.com");
    
    // Test belgesi
    const testDocumentContent = "Test kurum belgesi";
    const testDocumentBlob = new Blob([testDocumentContent], { type: "text/plain" });
    const testDocumentFile = new File([testDocumentBlob], "test-corporate-document.txt", {
      type: "text/plain"
    });
    
    testFormData.append("documents[0][document_type]", "license");
    testFormData.append("documents[0][title]", "Test Ruhsat Belgesi");
    testFormData.append("documents[0][description]", "Test kurum ruhsat belgesi");
    testFormData.append("documents[0][document]", testDocumentFile);
    
    console.log("Test kurum başvuru verisi gönderiliyor...");
    
    const response = await applyProfessionalAccount(testFormData);
    
    console.log("API Yanıtı:", response);
    
    return {
      success: true,
      response,
      message: "Kurum testi başarılı"
    };
    
  } catch (error: any) {
    console.error("Kurum test hatası:", error);
    
    return {
      success: false,
      error: error?.response?.data || error.message,
      message: "Kurum testi başarısız"
    };
  }
}

