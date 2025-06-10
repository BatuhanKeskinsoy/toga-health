import { baseURL } from "@/constants"
import { axios } from "@/lib/axios"

export async function updateProfilePhoto(file: File) {
  // Create FormData to properly send the file
  const formData = new FormData()
  formData.append("file", file)

  // Set the correct headers for multipart/form-data
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }

  const res = await axios.post(`${baseURL}/user/upload-photo`, formData, config)
  return res.data
}
