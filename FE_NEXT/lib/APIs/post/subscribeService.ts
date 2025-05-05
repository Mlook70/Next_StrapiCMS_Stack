export interface SubscribeData {
    Email: string;
  }
  
  export const submitSubscription = async (data: SubscribeData): Promise<void> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  };
  