import { WA_PHONE, WA_PHONE_ALT } from '../data';

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Contact() {
  useDocumentTitle('Contact Us');
  return (
    <div className="bg-fk-light min-h-screen py-4 w-full">
      <div className="max-w-[1248px] mx-auto px-4">
        
        <div className="bg-white shadow-sm rounded-sm mb-4 p-4 lg:p-8">
           <h1 className="text-[22px] font-medium text-[#212121] mb-6">Contact Us</h1>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Form Config */}
              <div>
                 <h2 className="text-[16px] font-medium mb-4">Send us a message</h2>
                 <form className="space-y-4 text-[14px]">
                    <div>
                       <label className="block text-fk-gray mb-1">Full Name</label>
                       <input type="text" className="w-full border border-gray-300 rounded-sm p-3 outline-none focus:border-fk-blue transition" placeholder="Enter your name" />
                    </div>
                    <div>
                       <label className="block text-fk-gray mb-1">Phone Number</label>
                       <input type="text" className="w-full border border-gray-300 rounded-sm p-3 outline-none focus:border-fk-blue transition" placeholder="Enter your phone number" />
                    </div>
                    <div>
                       <label className="block text-fk-gray mb-1">Message</label>
                       <textarea rows={4} className="w-full border border-gray-300 rounded-sm p-3 outline-none focus:border-fk-blue transition" placeholder="How can we help?"></textarea>
                    </div>
                    <button type="button" className="bg-[#fb641b] text-white px-8 py-3 rounded-sm font-semibold uppercase shadow-sm">
                       Submit Message
                    </button>
                 </form>
              </div>

              {/* Side Info */}
              <div>
                 <div className="mb-8">
                     <h2 className="text-[16px] font-medium mb-4 text-[#388E3C] flex items-center gap-2"><span>💬</span> WhatsApp Support</h2>
                     <p className="text-[14px] text-fk-gray mb-4">For immediate orders and queries, message us directly.</p>
                     <div className="space-y-3">
                        <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#25D366]/10 text-[#25D366] p-3 rounded-sm font-bold border border-[#25D366]">
                           Ordering & Sales: +91 72002 55999
                        </a>
                        <a href={`https://wa.me/${WA_PHONE_ALT}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#25D366]/10 text-[#25D366] p-3 rounded-sm font-bold border border-[#25D366]">
                           Support Helpdesk: +91 99944 66031
                        </a>
                     </div>
                 </div>

                 <div className="p-4 border border-gray-200 rounded-sm bg-gray-50 text-[14px]">
                    <h3 className="font-bold flex items-center gap-2 mb-2"><span>🕒</span> Business Hours</h3>
                    <p>Monday - Sunday</p>
                    <p className="text-[#212121] font-medium text-[16px]">10:00 AM – 9:00 PM</p>
                    <p className="text-fk-gray mt-2 text-[12px]">WhatsApp Ordering is available 24/7. We will process your order during business hours.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Map Branches */}
        <div className="bg-white shadow-sm rounded-sm p-4 lg:p-8">
           <h2 className="text-[22px] font-medium text-[#212121] mb-6 border-b border-gray-100 pb-2">Our Branches</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Branch 1 */}
              <div className="border border-gray-200 rounded-sm overflow-hidden flex flex-col">
                 <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-bold text-[16px] text-fk-blue mb-1">Namakkal (Main Branch)</h3>
                    <p className="text-[14px] text-fk-gray">KRS Building, Main Road, Namakkal Bazaar<br/>Near Palapattarai Mariyamman Temple</p>
                 </div>
                 <div className="h-[250px] w-full bg-gray-200">
                    <iframe 
                      title="Namakkal Branch Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15654.54589998822!2d78.15557729853926!3d11.214434691456578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babce5dfafc00ff%3A0xe54eb0c025d57b54!2sNamakkal%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1716301382431!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%" 
                      style={{border:0}} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                 </div>
              </div>

              {/* Branch 2 */}
              <div className="border border-gray-200 rounded-sm overflow-hidden flex flex-col">
                 <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-bold text-[16px] text-fk-blue mb-1">Tiruchengode Branch</h3>
                    <p className="text-[14px] text-fk-gray">East Car Street, Tiruchengode<br/>Tamil Nadu, India</p>
                 </div>
                 <div className="h-[250px] w-full flex items-center justify-center bg-gray-100 text-fk-gray">
                    Google Maps Link available on request
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
