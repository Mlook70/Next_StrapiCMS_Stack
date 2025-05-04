// src/store/slices/appointmentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Define the interface for form values
export interface AppointmentFormValues {
  FullName: string;
  Email: string;
  Phone: string;
  Date: string;
  Time: string;
  Information: string;
  service: string;
}

// Define the type for submission status
export type SubmitStatusType = {
  type: 'success' | 'error' | 'loading' | '';
  message: string;
};

// Define the state structure for appointment
interface AppointmentState {
  isModalOpen: boolean;
  formValues: AppointmentFormValues;
  submitStatus: SubmitStatusType;
  isSubmitting: boolean;
}

// Get today's date in YYYY-MM-DD format
const formatDate = (date: Date): string => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

// Initialize the state
const initialState: AppointmentState = {
  isModalOpen: false,
  formValues: {
    FullName: '',
    Email: '',
    Phone: '',
    Date: formatDate(new Date()),
    Time: '',
    Information: '',
    service: ''
  },
  submitStatus: { type: '', message: '' },
  isSubmitting: false
};

// Create the slice
export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      // Optionally clear status when closing
      state.submitStatus = { type: '', message: '' };
    },
    updateFormField: (state, action: PayloadAction<{ field: keyof AppointmentFormValues; value: string }>) => {
      const { field, value } = action.payload;
      state.formValues[field] = value;
    },
    resetForm: (state) => {
      state.formValues = {
        ...initialState.formValues,
        // Keep the current date when resetting
        Date: formatDate(new Date())
      };
    },
    setSubmitStatus: (state, action: PayloadAction<SubmitStatusType>) => {
      state.submitStatus = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    }
  },
});

// Export actions
export const {
  openModal,
  closeModal,
  updateFormField,
  resetForm,
  setSubmitStatus,
  setIsSubmitting
} = appointmentSlice.actions;

// Export selectors
export const selectIsModalOpen = (state: RootState) => state.appointment.isModalOpen;
export const selectFormValues = (state: RootState) => state.appointment.formValues;
export const selectSubmitStatus = (state: RootState) => state.appointment.submitStatus;
export const selectIsSubmitting = (state: RootState) => state.appointment.isSubmitting;

// Export reducer
export default appointmentSlice.reducer;