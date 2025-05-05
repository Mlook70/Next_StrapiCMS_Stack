export interface AppointmentData {
  FullName: string;
  Email: string;
  Phone: string;
  Date: string;
  Time: string;
  Information?: string;
  service?: string;
}

/**
 * Submit appointment data to Strapi API
 * @param appointmentData The appointment data to submit
 * @returns Promise with the API response
 */
export const submitAppointment = async (appointmentData: AppointmentData): Promise<any> => {
  
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: appointmentData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to submit appointment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting appointment:', error);
    throw error;
  }
};