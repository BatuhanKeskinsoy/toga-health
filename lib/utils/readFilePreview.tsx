export const getBase64Preview = (file: File, callback: (result: string | null) => void) => {
  const reader = new FileReader();
  reader.onloadend = () => callback(reader.result as string);
  reader.readAsDataURL(file);
};
