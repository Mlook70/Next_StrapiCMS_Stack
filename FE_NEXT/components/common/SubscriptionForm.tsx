'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SubscriptionForm() {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    // Mock form submission
    setSubmitted(true);
    setErrorMessage('');
    setEmail('');
    
    // Reset submission state after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        'max-w-md mx-auto',
        isRTL ? 'text-right' : 'text-left'
      )}
    >
      <h3 className="text-lg font-semibold mb-4">{t('footer.subscribe')}</h3>
      <div className="space-y-2">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('footer.email.placeholder')}
            className={cn(
              'w-full px-4 py-2 rounded bg-white text-gray-800 placeholder-gray-500 border focus:outline-none focus:ring-2',
              errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#643F2E]'
            )}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-[#643F2E]"
            aria-label="Subscribe"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
        {submitted && <p className="text-green-600 text-sm">Thank you for subscribing!</p>}
      </div>
    </form>
  );
}