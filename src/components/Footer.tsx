import { Link } from 'react-router-dom';
import { WA_PHONE, WA_PHONE_ALT, INSTAGRAM_URL, YOUTUBE_URL } from '../data';
import { Youtube, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-fk-footer text-[#B0BEC5] text-xs">
      <div className="max-w-[1248px] mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1 */}
          <div>
            <h4 className="text-[#878787] text-[12px] font-normal mb-3 uppercase">About</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Press</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-[#878787] text-[12px] font-normal mb-3 uppercase">Help</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/track" className="hover:text-white transition">Track Order</Link></li>
              <li><a href="#" className="hover:text-white transition">Payments</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition">WhatsApp Order Guide</a></li>
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-[#878787] text-[12px] font-normal mb-3 uppercase">Consumer Policy</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-white transition">Exchange Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition">Sitemap</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-[#878787] text-[12px] font-normal mb-3 uppercase">Connect With Us</h4>
            <ul className="space-y-3 font-medium">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition">
                  <Instagram className="w-4 h-4" /> Instagram 
                </a>
              </li>
              <li>
                <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition">
                  <Youtube className="w-4 h-4" /> YouTube 
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-white transition">
                  <Facebook className="w-4 h-4" /> Facebook 
                </a>
              </li>
              <li className="pt-2">
                <span className="block text-white mb-1">WhatsApp Orders:</span>
                <a href={`https://wa.me/${WA_PHONE}`} className="block hover:text-[#25D366] transition">+91 {WA_PHONE.slice(2, 7)} {WA_PHONE.slice(7)}</a>
                <a href={`https://wa.me/${WA_PHONE_ALT}`} className="block hover:text-[#25D366] transition">+91 {WA_PHONE_ALT.slice(2, 7)} {WA_PHONE_ALT.slice(7)}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Address Row */}
        <div className="border-t border-gray-700 py-6 grid md:grid-cols-2 gap-6">
           <div className="flex gap-4">
              <div className="w-[1px] bg-gray-700"></div>
              <div>
                <h4 className="text-[#878787] text-[12px] font-normal mb-2 uppercase">Mail Us:</h4>
                <p className="leading-5">Hunter Mens & Juniors,<br/>KRS Building, Main Road,<br/>Namakkal Bazaar - 637001,<br/>Tamil Nadu, India</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="w-[1px] bg-gray-700"></div>
              <div>
                <h4 className="text-[#878787] text-[12px] font-normal mb-2 uppercase">Registered Office Address:</h4>
                <p className="leading-5">Hunter Mens & Juniors,<br/>East Car Street,<br/>Tiruchengode,<br/>Tamil Nadu, India</p>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-[#172337] py-6">
         <div className="max-w-[1248px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white text-[13px]">
            <div className="flex items-center gap-2">
               <span className="text-fk-yellow font-bold shrink-0">HUNTER</span>
               <span>Registered in Tamil Nadu, India</span>
            </div>
            <div>
               © 2018-{new Date().getFullYear()} HunterMens.com
            </div>
            <div className="flex gap-2">
               <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payments" className="h-5 object-contain" />
            </div>
         </div>
      </div>
    </footer>
  );
}
