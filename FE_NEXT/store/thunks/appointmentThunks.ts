// src/store/thunks/appointmentThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  setSubmitStatus, 
  setIsSubmitting, 
  closeModal, 
  resetForm,
  AppointmentFormValues 
} from '../slices/appointmentSlice';

// Create an async thunk for submitting the appointment
export const submitAppointment = createAsyncThunk(
  'appointment/submit',
  async (formValues: AppointmentFormValues, { dispatch }) => {
    try {
      // Set loading state
      dispatch(setIsSubmitting(true));
      dispatch(setSubmitStatus({ 
        type: 'loading', 
        message: 'Submitting your appointment...' 
      }));
      
      // Make API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formValues }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success case
        dispatch(setSubmitStatus({ 
          type: 'success', 
          message: 'Your appointment has been successfully scheduled. We will contact you shortly.' 
        }));
        
        // Reset form
        dispatch(resetForm());
        
        // Close modal after delay
        setTimeout(() => {
          dispatch(closeModal());
          dispatch(setSubmitStatus({ type: '', message: '' }));
        }, 3000);
        
        return data;
      } else {
        // Handle API error
        throw new Error(data.error?.message || 'Failed to schedule appointment');
      }
    } catch (error) {
      // Handle any errors
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(setSubmitStatus({ type: 'error', message: errorMessage }));
      throw error;
    } finally {
      // Reset submitting state
      dispatch(setIsSubmitting(false));
    }
  }
);