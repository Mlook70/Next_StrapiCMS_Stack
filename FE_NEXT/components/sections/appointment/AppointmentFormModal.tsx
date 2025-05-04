'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  selectIsModalOpen, 
  selectFormValues, 
  selectSubmitStatus, 
  selectIsSubmitting,
  closeModal,
  resetForm
} from '@/store/slices/appointmentSlice';
import { submitAppointment } from '@/store/thunks/appointmentThunks';
import Lottie from 'lottie-react';
import successAnimation from '@/public/animations/animation.json';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { ServicesResponse } from '@/types';
import { cn } from '@/lib/utils';

// Validation schema using Yup
const AppointmentSchema = Yup.object().shape({
  FullName: Yup.string()
    .min(3, 'Name too short')
    .max(50, 'Name too long')
    .required('Full name is required'),
  Email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  Phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  Date: Yup.date()
    .min(new Date(), 'Date cannot be in the past')
    .required('Date is required'),
  Time: Yup.string()
    .required('Time is required'),
  Information: Yup.string()
    .min(10, 'Please provide more details')
    .max(500, 'Maximum 500 characters')
    .required('Information is required'),
  service: Yup.string()
    .required('Please select a service'),
});

const AppointmentFormModal: React.FC = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('appointment');
  const dispatch = useAppDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Get state from Redux
  const isOpen = useAppSelector(selectIsModalOpen);
  const formValues = useAppSelector(selectFormValues);
  const submitStatus = useAppSelector(selectSubmitStatus);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  
  // Fetch services for dropdown
  const { data: servicesData, error: servicesError } = useSWR<ServicesResponse>(
    isOpen ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services?populate=*&locale=${locale}` : null,
    fetcher
  );

  // Format date for input field (YYYY-MM-DD)
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const today = formatDate(new Date());

  // Handle form submission
  const handleSubmit = async (values: typeof formValues) => {
    const result = await dispatch(submitAppointment(values));
    
    if (submitAppointment.fulfilled.match(result)) {
      dispatch(closeModal());
      setShowSuccess(true);
      
      // Hide animation after 3 seconds and reset form
      setTimeout(() => {
        setShowSuccess(false);
        dispatch(resetForm());
      }, 3000);
    }
  };

  // Available time slots
  const timeSlots = [
    { value: "09:00:00.000", label: "09:00 AM" },
    { value: "10:00:00.000", label: "10:00 AM" },
    { value: "11:00:00.000", label: "11:00 AM" },
    { value: "12:00:00.000", label: "12:00 PM" },
    { value: "13:00:00.000", label: "01:00 PM" },
    { value: "14:00:00.000", label: "02:00 PM" },
    { value: "15:00:00.000", label: "03:00 PM" },
    { value: "16:00:00.000", label: "04:00 PM" },
    { value: "17:00:00.000", label: "05:00 PM" },
  ];

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
          <Lottie
            animationData={successAnimation}
            loop={false}
            className="h-48 w-48 mx-auto"
          />
          <h3 className="text-xl font-semibold text-center mt-4 text-[#4B2615]">
            {t('successTitle')}
          </h3>
          <p className="text-gray-600 text-center mt-2">
            {t('successMessage')}
          </p>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => dispatch(closeModal())}></div>
      
      {/* Modal */}
      <div className={cn(
        "relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4 transform transition-all duration-300",
        isRTL ? "text-right" : "text-left"
      )}>
        {/* Close button */}
        <button 
          className={cn(
            "absolute top-4 hover:bg-gray-100 p-1 rounded-full transition-colors",
            isRTL ? "left-4" : "right-4"
          )}
          onClick={() => dispatch(closeModal())}
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        
        <h2 className="text-2xl font-bold text-[#4B2615] mb-6">{t('title')}</h2>
        
        {/* Status messages - Only show error messages here */}
        {submitStatus.type === 'error' && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800">
            {submitStatus.message}
          </div>
        )}
        
        <Formik
          initialValues={formValues}
          validationSchema={AppointmentSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="FullName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('fullName')} *
                </label>
                <Field
                  type="text"
                  name="FullName"
                  id="FullName"
                  className={cn(
                    "w-full px-4 py-2 bg-white text-[#4B2615] border rounded-md focus:ring-2 focus:ring-[#4B2615] focus:border-[#4B2615]",
                    errors.FullName && touched.FullName ? 'border-red-500' : 'border-gray-300'
                  )}
                  placeholder={t('fullNamePlaceholder')}
                />
                <ErrorMessage name="FullName" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')} *
                </label>
                <Field
                  type="email"
                  name="Email"
                  id="Email"
                  className={cn(
                    "w-full px-4 py-2 bg-white text-[#4B2615] border rounded-md focus:ring-2 focus:ring-[#4B2615] focus:border-[#4B2615]",
                    errors.Email && touched.Email ? 'border-red-500' : 'border-gray-300'
                  )}
                  placeholder={t('emailPlaceholder')}
                />
                <ErrorMessage name="Email" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone')} *
                </label>
                <Field
                  type="tel"
                  name="Phone"
                  id="Phone"
                  className={cn(
                    "w-full px-4 py-2 bg-white text-[#4B2615] border rounded-md focus:ring-2 focus:ring-[#4B2615] focus:border-[#4B2615]",
                    errors.Phone && touched.Phone ? 'border-red-500' : 'border-gray-300'
                  )}
                  placeholder="+966XXXXXXXXX"
                />
                <ErrorMessage name="Phone" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Date and Time - Side by side on all screens to minimize height */}
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label htmlFor="Date" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('date')} *
                  </label>
                  <Field
                    type="date"
                    name="Date"
                    id="Date"
                    min={today}
                    className={cn(
                      "w-full px-4 py-2 bg-white text-[#4B2615] border rounded-md focus:ring-2 focus:ring-[#4B2615] focus:border-[#4B2615]",
                      errors.Date && touched.Date ? 'border-red-500' : 'border-gray-300'
                    )}
                  />
                  <ErrorMessage name="Date" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                {/* Time */}
                <div>
                  <label htmlFor="Time" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('time')} *
                  </label>
                  <Field
                    as="select"
                    name="Time"
                    id="Time"
                    className={cn(
                      "w-full px-4 py-2 bg-white text-[#4B2615] border rounded-md focus:ring-2 focus:ring-[#4B2615] focus:border-[#4B2615]",
                      errors.Time && touched.Time ? 'border-red-500' : 'border-gray-300'
                    )}
                  >
                    <option value="">{t('selectTime')}</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="Time" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
              
              {/* Service - Dynamically populated from API */}
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('service')} *
                </label>
                {servicesError ? (
                  <div className="text-red-500 text-sm mb-2">{t('servicesFetchError')}</div>
                ) : servicesData?.data === undefined ? (
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('loadingServices')}
                  </div>
                ) : (
                  <Field
                    as="select"
                    name="service"
                    id="service"
                    className={cn(
                      "w-full px-4 py-2 bg-white text-[#4B2615] border rounded-md focus:ring-2 focus:ring-[#4B2615] focus:border-[#4B2615]",
                      errors.service && touched.service ? 'border-red-500' : 'border-gray-300'
                    )}
                  >
                    <option value="">{t('selectService')}</option>
                    {servicesData.data.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.Title}
                      </option>
                    ))}
                    <option value="other">{t('other')}</option>
                  </Field>
                )}
                <ErrorMessage name="service" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Information / Details */}
              <div>
                <label htmlFor="Information" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('information')} *
                </label>
                <Field
                  as="textarea"
                  name="Information"
                  id="Information"
                  rows="3"
                  className={cn(
                    "w-full px-4 py-2 bg-white text-[#4B2615] border rounded-md focus:ring-2 focus:ring-[#4B2615] focus:border-[#4B2615] resize-none",
                    errors.Information && touched.Information ? 'border-red-500' : 'border-gray-300'
                  )}
                  placeholder={t('informationPlaceholder')}
                />
                <ErrorMessage name="Information" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#4B2615] text-white rounded-md hover:bg-[#5e3120] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B2615] disabled:opacity-70 flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      {t('submitting')}
                    </>
                  ) : t('submit')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AppointmentFormModal;