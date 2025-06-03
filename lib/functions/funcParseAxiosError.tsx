const funcParseAxiosError = (error: any): string => {
  const errors = error?.response?.data?.errors;
  if (errors) {
    return Object.values(errors).flat().join("\n");
  }
  return error.response.data.message || "Bilinmeyen bir hata oluştu.";
};

export default funcParseAxiosError;
