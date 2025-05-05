'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#643F2E] mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-[#643F2E] mb-6">Send us a message</h2>
              
              {isSubmitted ? (
                <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
                  <p className="font-medium">Thank you for contacting us!</p>
                  <p>We have received your message and will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={cn(
                        'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2',
                        errors.name 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#643F2E]'
                      )}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={cn(
                        'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2',
                        errors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#643F2E]'
                      )}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#643F2E]"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 mb-2">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={cn(
                        'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2',
                        errors.message 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#643F2E]'
                      )}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'bg-[#643F2E] text-white px-6 py-3 rounded font-medium flex items-center justify-center',
                      isSubmitting 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:bg-[#4d2416] transition-colors'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <div className="bg-[#643F2E] text-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-8">Get in touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mt-1 mr-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Our Address</h3>
                    <p className="text-gray-300">
                      123 Business Avenue<br />
                      Dubai, United Arab Emirates
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-gray-300">
                      <a href="tel:+97141234567" className="hover:text-white transition-colors">
                        +971 4 123 4567
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-gray-300">
                      <a href="mailto:info@alsaifpartners.com" className="hover:text-white transition-colors">
                        info@alsaifpartners.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="font-medium mb-4">Business Hours</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex justify-between">
                    <span>Monday - Thursday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Friday:</span>
                    <span>9:00 AM - 12:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday - Sunday:</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Map (placeholder) */}
            <div className="mt-8 bg-gray-200 h-64 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">Map will be embedded here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}