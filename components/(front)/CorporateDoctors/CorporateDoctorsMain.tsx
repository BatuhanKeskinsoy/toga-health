"use client";

import React, { useState } from "react";
import {
  CorporateDoctor,
  PendingDoctorRequest,
} from "@/lib/types/provider/requestsTypes";
import CorporateDoctorsList from "@/components/(front)/CorporateDoctors/CorporateDoctorsList";
import PendingRequestsList from "@/components/(front)/CorporateDoctors/RequestsList";
import AddDoctorModal from "@/components/(front)/CorporateDoctors/AddDoctorModal";
import CustomButton from "@/components/others/CustomButton";
import { FaUserPlus } from "react-icons/fa";
import { getCorporateDoctors, getToBeApprovedDoctors, addDoctorToCorporate } from "@/lib/services/provider/requests";
import Pagination from "@/components/others/Pagination";
import Swal from "sweetalert2";

interface CorporateDoctorsMainProps {
  initialDoctors: CorporateDoctor[];
  initialPendingRequests: PendingDoctorRequest[];
  initialDoctorsPagination: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    from: number;
    to: number;
    hasMorePages: boolean;
  };
  initialRequestsPagination: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    from: number;
    to: number;
    hasMorePages: boolean;
  };
  userId: number;
}

const CorporateDoctorsMain: React.FC<CorporateDoctorsMainProps> = ({
  initialDoctors,
  initialPendingRequests,
  initialDoctorsPagination,
  initialRequestsPagination,
  userId,
}) => {
  const [doctors, setDoctors] = useState<CorporateDoctor[]>(initialDoctors);
  const [pendingRequests, setPendingRequests] = useState<
    PendingDoctorRequest[]
  >(initialPendingRequests);
  const [rejectedRequests, setRejectedRequests] = useState<
    PendingDoctorRequest[]
  >([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"doctors" | "pending" | "rejected">("doctors");
  
  // Pagination states - initialized with server-side data
  const [doctorsPagination, setDoctorsPagination] = useState(initialDoctorsPagination);
  const [requestsPagination, setRequestsPagination] = useState(initialRequestsPagination);
  const [rejectedPagination, setRejectedPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
    from: 1,
    to: 0,
    hasMorePages: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDoctor = async (doctorData: any) => {
    try {
      await addDoctorToCorporate(doctorData);
      
      // Başarılı olursa listeyi güncelle
      const updatedDoctorsResponse = await getCorporateDoctors(userId, doctorsPagination.currentPage);
      setDoctors(updatedDoctorsResponse.data?.data || []);
      setDoctorsPagination({
        currentPage: updatedDoctorsResponse.data?.current_page || 1,
        lastPage: updatedDoctorsResponse.data?.last_page || 1,
        total: updatedDoctorsResponse.data?.total || 0,
        perPage: updatedDoctorsResponse.data?.per_page || 15,
        from: updatedDoctorsResponse.data?.from || 1,
        to: updatedDoctorsResponse.data?.to || 0,
        hasMorePages: (updatedDoctorsResponse.data?.current_page || 1) < (updatedDoctorsResponse.data?.last_page || 1),
      });
      
      const updatedRequestsResponse = await getToBeApprovedDoctors(requestsPagination.currentPage, "pending");
      setPendingRequests(updatedRequestsResponse.data || []);
      setRequestsPagination({
        currentPage: updatedRequestsResponse.pagination?.current_page || 1,
        lastPage: updatedRequestsResponse.pagination?.last_page || 1,
        total: updatedRequestsResponse.pagination?.total || 0,
        perPage: updatedRequestsResponse.pagination?.per_page || 15,
        from: updatedRequestsResponse.pagination?.from || 1,
        to: updatedRequestsResponse.pagination?.to || 0,
        hasMorePages: updatedRequestsResponse.pagination?.has_more_pages || false,
      });
      
      // Başarı mesajı göster
      await Swal.fire({
        title: "Başarılı!",
        text: "Doktor başarıyla eklendi ve onay bekliyor.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      
      setIsAddModalOpen(false);
    } catch (error: any) {
      console.error("Error adding doctor:", error);
      await Swal.fire({
        title: "Hata!",
        text: error?.response?.data?.message || "Doktor eklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleDoctorsPageChange = async (page: number) => {
    // Hemen scroll et, veri yüklenmesini bekleme
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setIsLoading(true);
    try {
      const response = await getCorporateDoctors(userId, page);
      setDoctors(response.data?.data || []);
      setDoctorsPagination({
        currentPage: response.data?.current_page || 1,
        lastPage: response.data?.last_page || 1,
        total: response.data?.total || 0,
        perPage: response.data?.per_page || 15,
        from: response.data?.from || 1,
        to: response.data?.to || 0,
        hasMorePages: (response.data?.current_page || 1) < (response.data?.last_page || 1),
      });
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestsPageChange = async (page: number) => {
    // Hemen scroll et, veri yüklenmesini bekleme
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setIsLoading(true);
    try {
      const response = await getToBeApprovedDoctors(page, "pending");
      setPendingRequests(response.data || []);
      setRequestsPagination({
        currentPage: response.pagination?.current_page || 1,
        lastPage: response.pagination?.last_page || 1,
        total: response.pagination?.total || 0,
        perPage: response.pagination?.per_page || 15,
        from: response.pagination?.from || 1,
        to: response.pagination?.to || 0,
        hasMorePages: response.pagination?.has_more_pages || false,
      });
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectedPageChange = async (page: number) => {
    // Hemen scroll et, veri yüklenmesini bekleme
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setIsLoading(true);
    try {
      const response = await getToBeApprovedDoctors(page, "rejected");
      setRejectedRequests(response.data || []);
      setRejectedPagination({
        currentPage: response.pagination?.current_page || 1,
        lastPage: response.pagination?.last_page || 1,
        total: response.pagination?.total || 0,
        perPage: response.pagination?.per_page || 15,
        from: response.pagination?.from || 1,
        to: response.pagination?.to || 0,
        hasMorePages: response.pagination?.has_more_pages || false,
      });
    } catch (error) {
      console.error("Error loading rejected requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestApproved = async () => {
    // Bekleyen istekler listesini güncelle
    const updatedRequestsResponse = await getToBeApprovedDoctors(requestsPagination.currentPage, "pending");
    setPendingRequests(updatedRequestsResponse.data || []);
    setRequestsPagination({
      currentPage: updatedRequestsResponse.pagination?.current_page || 1,
      lastPage: updatedRequestsResponse.pagination?.last_page || 1,
      total: updatedRequestsResponse.pagination?.total || 0,
      perPage: updatedRequestsResponse.pagination?.per_page || 15,
      from: updatedRequestsResponse.pagination?.from || 1,
      to: updatedRequestsResponse.pagination?.to || 0,
      hasMorePages: updatedRequestsResponse.pagination?.has_more_pages || false,
    });

    // Aktif doktorlar listesini güncelle
    const updatedDoctorsResponse = await getCorporateDoctors(userId, doctorsPagination.currentPage);
    setDoctors(updatedDoctorsResponse.data?.data || []);
    setDoctorsPagination({
      currentPage: updatedDoctorsResponse.data?.current_page || 1,
      lastPage: updatedDoctorsResponse.data?.last_page || 1,
      total: updatedDoctorsResponse.data?.total || 0,
      perPage: updatedDoctorsResponse.data?.per_page || 15,
      from: updatedDoctorsResponse.data?.from || 1,
      to: updatedDoctorsResponse.data?.to || 0,
      hasMorePages: (updatedDoctorsResponse.data?.current_page || 1) < (updatedDoctorsResponse.data?.last_page || 1),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Doktorlar</h1>

        {/* Tab Navigation */}
        <div className="flex flex-col justify-between sm:flex-row gap-2">
          <div className="flex w-full gap-2">
            <CustomButton
              handleClick={() => setActiveTab("doctors")}
              btnType="button"
              containerStyles={`flex items-center justify-center max-lg:w-full gap-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "doctors"
                  ? "bg-sitePrimary text-white hover:bg-sitePrimary/90"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              title="Aktif Doktorlar"
              leftIcon={<FaUserPlus />}
            />
            <CustomButton
              handleClick={() => setActiveTab("pending")}
              btnType="button"
              containerStyles={`flex items-center justify-center max-lg:w-full gap-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "pending"
                  ? "bg-sitePrimary text-white hover:bg-sitePrimary/90"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              title="Bekleyen İstekler"
              leftIcon={<FaUserPlus />}
            />
            <CustomButton
              handleClick={() => {
                setActiveTab("rejected");
                if (rejectedRequests.length === 0) {
                  handleRejectedPageChange(1);
                }
              }}
              btnType="button"
              containerStyles={`flex items-center justify-center max-lg:w-full gap-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === "rejected"
                  ? "bg-sitePrimary text-white hover:bg-sitePrimary/90"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              title="Reddedilen İstekler"
              leftIcon={<FaUserPlus />}
            />
          </div>
          {/* Add Doctor Button */}
          <hr className="border-gray-200 lg:hidden" />
          <div className="flex justify-end max-sm:justify-center">
            <CustomButton
              handleClick={() => setIsAddModalOpen(true)}
              btnType="button"
              containerStyles="flex items-center text-nowrap justify-center max-lg:w-full gap-2 px-4 py-2 bg-sitePrimary text-white rounded-md hover:bg-sitePrimary/90 transition-colors"
              title="Yeni Doktor Ekle"
              leftIcon={<FaUserPlus />}
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Content */}
      <div className="flex flex-col gap-4 mb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sitePrimary"></div>
          </div>
        ) : activeTab === "doctors" ? (
          <>
            <CorporateDoctorsList doctors={doctors} onDoctorUpdate={setDoctors} />
            {doctorsPagination.lastPage > 1 && (
              <Pagination
                currentPage={doctorsPagination.currentPage}
                lastPage={doctorsPagination.lastPage}
                total={doctorsPagination.total}
                from={doctorsPagination.from}
                to={doctorsPagination.to}
                onPageChange={handleDoctorsPageChange}
                className="mt-6"
              />
            )}
          </>
        ) : activeTab === "pending" ? (
          <>
            <PendingRequestsList
              requests={pendingRequests}
              onRequestUpdate={setPendingRequests}
              onRequestApproved={handleRequestApproved}
            />
            {requestsPagination.lastPage > 1 && (
              <Pagination
                currentPage={requestsPagination.currentPage}
                lastPage={requestsPagination.lastPage}
                total={requestsPagination.total}
                from={requestsPagination.from}
                to={requestsPagination.to}
                onPageChange={handleRequestsPageChange}
                className="mt-6"
              />
            )}
          </>
        ) : (
          <>
            <PendingRequestsList
              requests={rejectedRequests}
              onRequestUpdate={setRejectedRequests}
              onRequestApproved={handleRequestApproved}
            />
            {rejectedPagination.lastPage > 1 && (
              <Pagination
                currentPage={rejectedPagination.currentPage}
                lastPage={rejectedPagination.lastPage}
                total={rejectedPagination.total}
                from={rejectedPagination.from}
                to={rejectedPagination.to}
                onPageChange={handleRejectedPageChange}
                className="mt-6"
              />
            )}
          </>
        )}
      </div>

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDoctor}
      />
    </div>
  );
};

export default CorporateDoctorsMain;
