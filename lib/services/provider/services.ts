import api from "@/lib/axios";
import {
  GetProviderDiseasesResponse,
  UpdateProviderDiseasesRequest,
  GetProviderTreatmentsResponse,
  UpdateProviderTreatmentsRequest,
  GetProviderDiseasesAtAddressResponse,
  AddProviderDiseasesAtAddressRequest,
  GetProviderTreatmentsAtAddressResponse,
  AddProviderTreatmentsAtAddressRequest,
  UpdateProviderServicesAtAddressRequest,
} from "@/lib/types/provider/servicesTypes";

// Provider'ın seçtiği tüm hastalıkları listeler
export const getProviderDiseases = async (): Promise<GetProviderDiseasesResponse> => {
  const response = await api.get(`/user/provider-services/diseases`);
  return response.data;
};

// Provider'ın seçtiği tüm hastalıkları günceller
export const updateProviderDiseases = async (
  data: UpdateProviderDiseasesRequest
): Promise<void> => {
  await api.put(`/user/provider-services/diseases`, data);
};

// Provider'ın seçtiği tüm tedavilerini listeler
export const getProviderTreatments = async (): Promise<GetProviderTreatmentsResponse> => {
  const response = await api.get(`/user/provider-services/treatments`);
  return response.data;
};

// Provider'ın seçtiği tüm tedavilerini günceller
export const updateProviderTreatments = async (
  data: UpdateProviderTreatmentsRequest
): Promise<void> => {
  await api.put(`/user/provider-services/treatments`, data);
};

////////////////////////////////////////////////////////////////////////////

// Provider'ın adreslerine hastalık ekler (yeni yapı)
export const addProviderDiseasesAtAddress = async (
  data: AddProviderDiseasesAtAddressRequest
): Promise<void> => {
  await api.post(`/user/addresses/services/diseases`, data);
};

// Provider'ın adresindeki hastalıkları listeler
export const getProviderDiseasesAtAddress = async (
  address_id: number
): Promise<GetProviderDiseasesAtAddressResponse> => {
  const response = await api.get(`/user/addresses/${address_id}/services/diseases`);
  return response.data;
};

// Provider'ın adreslerine tedavi ekler (yeni yapı)
export const addProviderTreatmentsAtAddress = async (
  data: AddProviderTreatmentsAtAddressRequest
): Promise<void> => {
  await api.post(`/user/addresses/services/treatments`, data);
};

// Provider'ın adresindeki tedavileri listeler
export const getProviderTreatmentsAtAddress = async (
  address_id: number
): Promise<GetProviderTreatmentsAtAddressResponse> => {
  const response = await api.get(`/user/addresses/${address_id}/services/treatments`);
  return response.data;
};

///////////////////////////////////////////////////////////////////////////////////////

// Provider'ın adresindeki servisleri (hem tedavi ve hizmetleri hem hastalıkları) günceller
export const updateProviderServicesAtAddress = async (
  address_id: number,
  serviceId: number,
  data: UpdateProviderServicesAtAddressRequest
): Promise<void> => {
  await api.put(`/user/addresses/${address_id}/services/${serviceId}`, data);
};