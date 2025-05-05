'use client';

import React, { useState } from 'react';
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
  resetForm,
} from '@/store/slices/appointmentSlice';
import { submitAppointment } from '@/store/thunks/appointmentThunks';
import Lottie from 'lottie-react';
import successAnimation from '@/public/animations/animation.json';
import useServices from '@/lib/APIs/hooks/useServices';
import { cn } from '@/lib/utils';

const AppointmentSchema = Yup.object().shape({
  FullName: Yup.string().min(3).max(50).required(),
  Email: Yup.string().email().required(),
  Phone: Yup.string().matches(/^\+?[0-9]{10,15}$/).required(),
  Date: Yup.date().min(new Date()).required(),
  Time: Yup.string().required(),
  Information: Yup.string().min(10).max(500).required(),
  service: Yup.string().required(),
});

const timeSlots = [
  { value: '09:00:00.000', label: '09:00 AM' },
  { value: '10:00:00.000', label: '10:00 AM' },
  { value: '11:00:00.000', label: '11:00 AM' },
  { value: '12:00:00.000', label: '12:00 PM' },
  { value: '13:00:00.000', label: '01:00 PM' },
  { value: '14:00:00.000', label: '02:00 PM' },
  { value: '15:00:00.000', label: '03:00 PM' },
  { value: '16:00:00.000', label: '04:00 PM' },
  { value: '17:00:00.000', label: '05:00 PM' },
];

const formatDate = (date: Date): string => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const AppointmentFormModal: React.FC = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('appointment');
  const dispatch = useAppDispatch();
  const [showSuccess, setShowSuccess] = useState(false);

  const isOpen = useAppSelector(selectIsModalOpen);
  const formValues = useAppSelector(selectFormValues);
  const submitStatus = useAppSelector(selectSubmitStatus);
  const isSubmitting = useAppSelector(selectIsSubmitting);

  // Updated to use the enhanced useServices hook with isPaused option
  const { services, error: servicesError, isLoading } = useServices({
    isPaused: !isOpen,
    pageSize: 100 // Load more services for the dropdown
  });
  
  const today = formatDate(new Date());

  const handleSubmit = async (values: typeof formValues) => {
    const result = await dispatch(submitAppointment(values));
    if (submitAppointment.fulfilled.match(result)) {
      dispatch(closeModal());
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        dispatch(resetForm());
      }, 3000);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
          <Lottie animationData={successAnimation} loop={false} className="h-48 w-48 mx-auto" />
          <h3 className="text-xl font-semibold text-center mt-4 text-[#4B2615]">{t('successTitle')}</h3>
          <p className="text-gray-600 text-center mt-2">{t('successMessage')}</p>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => dispatch(closeModal())}></div>
      <div className={cn(
        'relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4 transition-all duration-300',
        isRTL ? 'text-right' : 'text-left'
      )}>
        <button
          className={cn(
            'absolute top-4 hover:bg-gray-100 p-1 rounded-full',
            isRTL ? 'left-4' : 'right-4'
          )}
          onClick={() => dispatch(closeModal())}
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold text-[#4B2615] mb-6">{t('title')}</h2>

        {submitStatus.type === 'error' && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800">{submitStatus.message}</div>
        )}

        <Formik
          initialValues={formValues}
          validationSchema={AppointmentSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <FieldGroup name="FullName" type="text" placeholder={t('fullNamePlaceholder')} label={t('fullName')} errors={errors} touched={touched} />
              <FieldGroup name="Email" type="email" placeholder={t('emailPlaceholder')} label={t('email')} errors={errors} touched={touched} />
              <FieldGroup name="Phone" type="tel" placeholder="+966XXXXXXXXX" label={t('phone')} errors={errors} touched={touched} />

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup name="Date" type="date" label={t('date')} min={today} errors={errors} touched={touched} />
                <SelectField name="Time" label={t('time')} options={timeSlots} errors={errors} touched={touched} placeholder={t('selectTime')} />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('service')} *
                </label>
                {servicesError ? (
                  <div className="text-red-500 text-sm mb-2">{t('servicesFetchError')}</div>
                ) : isLoading ? (
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('loadingServices')}
                  </div>
                ) : (
                  <Field
                    as="select"
                    name="service"
                    className={cn(
                      'w-full px-4 py-2 border rounded-md bg-white text-[#4B2615] focus:ring-2 focus:ring-[#4B2615]',
                      errors.service && touched.service ? 'border-red-500' : 'border-gray-300'
                    )}
                  >
                    <option value="">{t('selectService')}</option>
                    {services.data.map((service) => (
                      <option key={service.id} value={service.id}>{service.Title}</option>
                    ))}
                    <option value="other">{t('other')}</option>
                  </Field>
                )}
                <ErrorMessage name="service" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <FieldGroup name="Information" type="textarea" rows={3} placeholder={t('informationPlaceholder')} label={t('information')} errors={errors} touched={touched} />

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

interface FieldGroupProps {
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  min?: string;
  rows?: number;
  errors: any;
  touched: any;
}

const FieldGroup: React.FC<FieldGroupProps> = ({ name, type = 'text', label, placeholder, min, rows, errors, touched }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} *
    </label>
    <Field
      as={type === 'textarea' ? 'textarea' : 'input'}
      type={type !== 'textarea' ? type : undefined}
      name={name}
      id={name}
      min={min}
      rows={rows}
      className={cn(
        'w-full px-4 py-2 border rounded-md bg-white text-[#4B2615] focus:ring-2 focus:ring-[#4B2615]',
        errors[name] && touched[name] ? 'border-red-500' : 'border-gray-300',
        type === 'textarea' ? 'resize-none' : ''
      )}
      placeholder={placeholder}
    />
    <ErrorMessage name={name} component="div" className="mt-1 text-sm text-red-600" />
  </div>
);

interface SelectFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  errors: any;
  touched: any;
  placeholder: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ name, label, options, errors, touched, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} *
    </label>
    <Field
      as="select"
      name={name}
      id={name}
      className={cn(
        'w-full px-4 py-2 border rounded-md bg-white text-[#4B2615] focus:ring-2 focus:ring-[#4B2615]',
        errors[name] && touched[name] ? 'border-red-500' : 'border-gray-300'
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" className="mt-1 text-sm text-red-600" />
  </div>
);

export default AppointmentFormModal;