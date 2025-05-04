'use client';

import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openModal, closeModal } from '@/store/slices/appointmentSlice';
import AppointmentFormModal from './AppointmentFormModal';

export const useAppointmentForm = () => {
  const dispatch = useAppDispatch();

  const openAppointmentModal = useCallback(() => {
    dispatch(openModal());
  }, [dispatch]);

  const closeAppointmentModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const AppointmentModal = useCallback(() => {
    return <AppointmentFormModal />;
  }, []);

  return {
    openAppointmentModal,
    closeAppointmentModal,
    AppointmentModal
  };
};

export default useAppointmentForm;