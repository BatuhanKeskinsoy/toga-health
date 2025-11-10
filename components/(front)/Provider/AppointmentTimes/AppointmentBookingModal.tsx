"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomInput from "@/components/Customs/CustomInput";
import CustomTextarea from "@/components/Customs/CustomTextarea";
import CustomButton from "@/components/Customs/CustomButton";
import { useTranslations, useLocale } from "next-intl";
import Swal from "sweetalert2";
import { loadStripe, type Stripe, type StripeElements } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Service } from "@/lib/types/appointments";
import type { SelectedSlotInfo } from "@/components/(front)/Provider/AppointmentTimes/DayCard";
import {
  createPaymentIntent,
  confirmPayment,
  getStripePublishableKey,
} from "@/lib/services/stripe/payments";
import { createAppointment } from "@/lib/services/appointment/provider";
import type { CreateAppointmentRequest } from "@/lib/types/appointments/provider";
import { useUser } from "@/lib/hooks/auth/useUser";

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId: number | null;
  providerType: "doctor" | "corporate";
  addressId: string | null;
  addressName?: string;
  service: Service | null;
  slot: SelectedSlotInfo | null;
}

const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  providerId,
  providerType,
  addressId,
  addressName,
  service,
  slot,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useUser();

  const requiresPrepayment = Boolean(
    service?.prepayment_required && service.prepayment_info?.prepayment_amount
  );

  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const appointmentDate = slot?.date || "";
  const appointmentTime = slot?.time || "";

  const formattedDate = useMemo(() => {
    if (!appointmentDate) return "";
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
        new Date(appointmentDate)
      );
    } catch (err) {
      return appointmentDate;
    }
  }, [appointmentDate, locale]);

  useEffect(() => {
    if (isOpen) {
      setPatientName(user?.name || "");
      setEmail(user?.email || "");
      const combinedPhone =
        user?.phone_code && user?.phone_number
          ? `${user.phone_code}${user.phone_number}`
          : user?.phone_number || "";
      setPhone(combinedPhone);
      setDescription("");
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen, slot?.id, requiresPrepayment, user?.name, user?.email, user?.phone_code, user?.phone_number]);

  const getPrepaymentDetails = useCallback(() => {
    if (!service) {
      return { amount: NaN, currency: "TRY" };
    }

    const amountSource =
      service.prepayment_info?.prepayment_amount || service.price || null;
    const amount = amountSource ? Number(amountSource) : NaN;
    const currency =
      service.prepayment_info?.prepayment_currency || service.currency || "TRY";

    return { amount, currency };
  }, [service]);

  const submitBooking = useCallback(
    async (
      stripeInstance?: Stripe | null,
      stripeElements?: StripeElements | null
    ) => {
      if (isSubmitting) return;
      setErrorMessage(null);

      if (!service || !slot) {
        setErrorMessage(t("Randevu oluşturmak için gerekli bilgiler eksik."));
        return;
      }

      if (!appointmentDate || !appointmentTime) {
        setErrorMessage(t("Randevu saati seçilmedi."));
        return;
      }

      if (!patientName.trim()) {
        setErrorMessage(t("Lütfen adınızı girin."));
        return;
      }

      if (!providerId || !addressId) {
        setErrorMessage(t("Randevu oluşturmak için gerekli bilgiler eksik."));
        return;
      }

      setIsSubmitting(true);

      try {
        if (requiresPrepayment) {
          const { amount, currency } = getPrepaymentDetails();

          if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error(
              t("Ön ödeme tutarı geçersiz. Lütfen hizmet ayarlarını kontrol edin.")
            );
          }

          if (!stripeInstance || !stripeElements) {
            throw new Error(t("Ödeme sistemi hazır değil. Lütfen tekrar deneyin."));
          }

          const cardElement = stripeElements.getElement(CardElement);
          if (!cardElement) {
            throw new Error(t("Ödeme bilgileri doğrulanamadı."));
          }

          const paymentIntentResponse = await createPaymentIntent({
            amount,
            currency,
            payment_method: "card",
            appointment_data: {
              bookable_id: providerId,
              address_id: addressId,
              address_service_id: service.service_id,
              appointment_date: appointmentDate,
              appointment_time: appointmentTime,
              title: patientName.trim() || undefined,
              description: description.trim() || undefined,
              phone_number: phone.trim() || undefined,
              email: email.trim() || undefined,
            },
          });

          if (!paymentIntentResponse.status || !paymentIntentResponse.data) {
            throw new Error(
              paymentIntentResponse.message ||
                t("Ödeme başlatılırken bir hata oluştu.")
            );
          }

          const {
            client_secret: clientSecret,
            payment_id: paymentId,
            payment_intent_id: paymentIntentId,
          } = paymentIntentResponse.data;

          if (!clientSecret) {
            throw new Error(t("Ödeme için gerekli bilgiler alınamadı."));
          }

          const paymentResult = await stripeInstance.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: patientName.trim(),
                email: email.trim() || undefined,
                phone: phone.trim() || undefined,
              },
            },
          });

          if (paymentResult.error) {
            throw new Error(
              paymentResult.error.message || t("Ödeme doğrulanamadı.")
            );
          }

          if (paymentResult.paymentIntent?.status !== "succeeded") {
            throw new Error(t("Ödeme tamamlanamadı. Lütfen tekrar deneyin."));
          }

          await confirmPayment({
            payment_id: paymentId,
            payment_intent_id:
              paymentIntentId || paymentResult.paymentIntent.id,
          });
        } else {
          const appointmentPayload: CreateAppointmentRequest = {
            bookable_type: providerType,
            bookable_id: providerId,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            address_id: addressId,
            ...(service.service_id && { address_service_id: service.service_id }),
            ...(description.trim() && { description: description.trim() }),
            ...(phone.trim() && { phone_number: phone.trim() }),
            ...(email.trim() && { email: email.trim() }),
            title: patientName.trim(),
          };

          const response = await createAppointment(appointmentPayload);

          if (!response.status) {
            throw new Error(response.message || t("Randevu oluşturulamadı."));
          }
        }

        Swal.fire({
          icon: "success",
          title: t("Başarılı"),
          text: t("Randevunuz başarıyla oluşturuldu."),
          confirmButtonColor: "#ed1c24",
        });
        onSuccess();
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          t("İşlem sırasında bir hata oluştu.");
        setErrorMessage(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      addressId,
      appointmentDate,
      appointmentTime,
      email,
      getPrepaymentDetails,
      isSubmitting,
      description,
      onSuccess,
      patientName,
      phone,
      providerId,
      providerType,
      requiresPrepayment,
      service,
      slot,
      t,
    ]
  );

  const summarySection = service && slot && (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">{service.name}</span>
          {service.price && (
            <span className="font-semibold text-sitePrimary">
              {service.price} {service.currency}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-600">
          {t("Tarih")}: <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="text-xs text-gray-600">
          {t("Saat")}: <span className="font-medium">{appointmentTime}</span>
        </div>
        {addressName && (
          <div className="text-xs text-gray-600">
            {t("Adres")}: <span className="font-medium">{addressName}</span>
          </div>
        )}
        {requiresPrepayment ? (
          <div className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700">
            <p className="font-semibold uppercase tracking-wide">
              {t("Ön ödeme gereklidir")}
            </p>
            {service.prepayment_info?.formatted_prepayment && (
              <p className="mt-1">
                {service.prepayment_info.formatted_prepayment}
              </p>
            )}
            {service.prepayment_info?.prepayment_description && (
              <p className="mt-1 text-[11px]">
                {service.prepayment_info.prepayment_description}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {t("Bu hizmet için ön ödeme gerekmiyor.")}
          </div>
        )}
      </div>
    </div>
  );

  const formFields = (
    <div className="grid grid-cols-1 gap-4">
      <CustomInput
        label={t("Ad Soyad")}
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        required
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CustomInput
          label={t("Email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <CustomInput
          label={t("Telefon")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <CustomTextarea
        label={t("Açıklama (Opsiyonel)")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );

  const renderForm = useCallback(
    (
      paymentSection: React.ReactNode,
      onSubmit: () => void,
      submitDisabled: boolean
    ) => (
      <div className="relative flex flex-col gap-5">
        {isSubmitting && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/80">
            <div className="h-20 w-20 animate-spin rounded-full border-4 border-sitePrimary border-t-transparent" />
          </div>
        )}
        {summarySection}
        {formFields}
        {paymentSection}
        {errorMessage && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:justify-end">
          <CustomButton
            btnType="button"
            title={t("İptal")}
            handleClick={onClose}
            containerStyles="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            isDisabled={isSubmitting}
          />
          <CustomButton
            btnType="button"
            title={isSubmitting ? t("İşleniyor") : t("Randevuyu Onayla")}
            handleClick={onSubmit}
            containerStyles="px-5 py-2.5 rounded-lg bg-sitePrimary text-white hover:bg-sitePrimary/80 transition-colors"
            isDisabled={submitDisabled}
          />
        </div>
      </div>
    ),
    [
      errorMessage,
      formFields,
      isSubmitting,
      onClose,
      summarySection,
      t,
    ]
  );

  const StandardForm = () =>
    renderForm(
      null,
      () => submitBooking(null, null),
      isSubmitting
    );

  const PrepaymentForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();

    const paymentSection = (
      <div className="rounded-lg border border-gray-200 p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2933",
                "::placeholder": {
                  color: "#9aa5b1",
                },
              },
              invalid: {
                color: "#ef4e4e",
              },
            },
          }}
        />
      </div>
    );

    const submitDisabled =
      isSubmitting || !stripe || !elements;

    return renderForm(paymentSection, () => submitBooking(stripe, elements), submitDisabled);
  };

  const [stripePromise, setStripePromise] = useState<
    ReturnType<typeof loadStripe> | null
  >(null);
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && requiresPrepayment) {
      setIsStripeLoading(true);
      getStripePublishableKey()
        .then((response) => {
          if (!isMounted) return;
          if (response.success && response.data?.publishable_key) {
            setStripePromise(loadStripe(response.data.publishable_key));
            setStripeError(null);
          } else {
            setStripeError(t("Stripe anahtarı alınamadı."));
          }
        })
        .catch((error: any) => {
          if (!isMounted) return;
          const message =
            error?.response?.data?.message ||
            error?.message ||
            t("Stripe anahtarı alınamadı.");
          setStripeError(message);
        })
        .finally(() => {
          if (isMounted) {
            setIsStripeLoading(false);
          }
        });
    } else {
      setStripePromise(null);
      setStripeError(null);
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, requiresPrepayment, t]);

  const prerequisitesMissing =
    !service ||
    !slot ||
    !slot.date ||
    !slot.time ||
    !providerId ||
    !addressId;

  let modalBody: React.ReactNode = null;

  if (prerequisitesMissing) {
    modalBody = (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        {t("Randevu oluşturmak için gerekli bilgiler eksik.")}
      </div>
    );
  } else if (!requiresPrepayment) {
    modalBody = renderForm(null, () => submitBooking(null, null), isSubmitting);
  } else if (isStripeLoading) {
    modalBody = (
      <div className="flex min-h-[160px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sitePrimary border-t-transparent" />
      </div>
    );
  } else if (stripeError) {
    modalBody = (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {stripeError}
        </div>
        <CustomButton
          btnType="button"
          title={t("Kapat")}
          handleClick={onClose}
          containerStyles="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        />
      </div>
    );
  } else if (stripePromise) {
    modalBody = (
      <Elements stripe={stripePromise}>
        <PrepaymentFormContent
          renderForm={renderForm}
          submitBooking={submitBooking}
          isSubmitting={isSubmitting}
        />
      </Elements>
    );
  } else {
    modalBody = (
      <div className="flex min-h-[160px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sitePrimary border-t-transparent" />
      </div>
    );
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("Randevu Detayları")}
    >
      {modalBody}
    </CustomModal>
  );
};

interface PrepaymentFormContentProps {
  renderForm: (
    paymentSection: React.ReactNode,
    onSubmit: () => void,
    submitDisabled: boolean
  ) => React.ReactNode;
  submitBooking: (
    stripe: Stripe | null,
    elements: StripeElements | null
  ) => Promise<void>;
  isSubmitting: boolean;
}

const PrepaymentFormContent: React.FC<PrepaymentFormContentProps> = ({
  renderForm,
  submitBooking,
  isSubmitting,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const paymentSection = (
    <div className="rounded-lg border border-gray-200 p-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#1f2933",
              "::placeholder": {
                color: "#9aa5b1",
              },
            },
            invalid: {
              color: "#ef4e4e",
            },
          },
        }}
      />
    </div>
  );

  const submitDisabled = isSubmitting || !stripe || !elements;

  return (
    <>
      {
        renderForm(
          paymentSection,
          () => submitBooking(stripe ?? null, elements ?? null),
          submitDisabled
        )
      }
    </>
  );
};

export default React.memo(AppointmentBookingModal);


