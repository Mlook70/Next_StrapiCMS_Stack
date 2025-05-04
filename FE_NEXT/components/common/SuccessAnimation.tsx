// components/SuccessAnimation.tsx
'use client';

import React from 'react';
import Lottie from 'lottie-react';
import animationData from '@/public/animations/animation.json';

interface SuccessAnimationProps {
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <Lottie
          animationData={animationData}
          loop={false}
          onComplete={onComplete}
          className="h-64 w-64 mx-auto"
        />
        <h3 className="text-xl font-semibold mt-4">Appointment Booked Successfully!</h3>
        <p className="text-gray-600 mt-2">
          We'll contact you shortly to confirm your appointment.
        </p>
      </div>
    </div>
  );
};

export default SuccessAnimation;