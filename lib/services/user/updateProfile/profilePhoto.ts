import api from "@/lib/axios"

export async function updateProfilePhoto(file: File) {
  const formData = new FormData()
  formData.append("photo", file)
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
  const res = await api.post(`/user/upload-photo`, formData, config)
  return res.data
}

export async function deleteProfilePhoto() {
  const res = await api.delete(`/user/delete-photo`);
  return res.data;
}
