import React from 'react';
import { WA_PHONE } from '../data';

export default function WhatsAppChat() {
  return (
    <a 
      href={`https://wa.me/${WA_PHONE}?text=Hi%20Hunter!%20I%20want%20to%20order.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[74px] lg:bottom-8 right-4 lg:right-6 z-[175] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:scale-110 active:scale-95 transition-transform duration-300 group"
      aria-label="Order on WhatsApp"
    >
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.2-.5-.5-.8-1.1-1.1-1.7-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.4 0-.5C10.5 9 9.9 7 9.8 6.4c-.1-.5-.2-.5-.4-.5h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2m2.5-9.1C16.8 2.6 13.5 1.3 10 1.5 6.3 1.7 3 3.8 1.4 7c-1.6 3.2-1.5 6.9.2 10l-1.3 4.8 5-1.3c2.9 1.6 6.3 1.8 9.5.4 3.2-1.4 5.5-4.4 6-7.8.5-3.5-.8-6.9-3.2-9.3v.1h.1z"/>
       </svg>
       {/* Tooltip */}
       <span className="absolute right-16 bg-[#212121] text-white text-[12px] px-3 py-1.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium shadow-sm">
         Order on WhatsApp
       </span>
       {/* Pulse ring */}
       <span className="absolute w-full h-full rounded-full border-2 border-[#25D366] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></span>
    </a>
  );
}
