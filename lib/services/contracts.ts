import api from "@/lib/axios";

export const getContracts = async (): Promise<ContractListResponse> => {
  try {
    const response = await api.get("/public/contracts");
    return response.data;
  } catch (error) {
    console.error("Get contracts API error:", error);
    throw error;
  }
};

export const getContractDetail = async (
  slug: string
): Promise<ContractDetailResponse> => {
  try {
    const response = await api.get(`/public/contracts/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Get contract detail API error:", error);
    throw error;
  }
};
