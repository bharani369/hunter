import { Link } from 'react-router-dom';

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function About() {
  useDocumentTitle('About Us');
  return (
    <div className="bg-fk-light min-h-screen py-4 w-full">
      <div className="max-w-[1248px] mx-auto px-4">
        <div className="bg-white shadow-sm rounded-sm">
          
          {/* Header */}
          <div className="p-4 lg:p-8 border-b border-gray-100 object-cover relative overflow-hidden bg-fk-blue">
            <div className="relative z-10 text-white py-10 text-center">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">About Hunter Mens & Juniors</h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">Tamil Nadu's premier destination for premium menswear and kids' fashion.</p>
            </div>
          </div>

          <div className="p-4 lg:p-8 flex flex-col md:flex-row gap-8 items-center border-b border-gray-100">
             <div className="w-full md:w-1/2">
               <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcSMYEwkeaD-VBL4AVJwCLm-NCBDkslRaAu_PDpq4uougJJENcwSGVcrkfIokdRiSMWQB3xqr6tKrNy071rNpzjzq6AaxBCaXRPdwbRY1XJgD7uiCaaBiCKp-V53Ny7UK6HRm2kJatWV-TBxCJg1EF8CalkL4Q12m-IJDSTjuIcjUhV8ns3MDsxmKevvpl/s1600/452052041_529242162776191_3750077501653396213_n.jpg" alt="Store Front" className="w-full rounded-sm shadow-sm" />
             </div>
             <div className="w-full md:w-1/2 text-[15px] text-[#212121] leading-relaxed">
               <h2 className="text-2xl font-bold mb-4">Our Brand Story</h2>
               <p className="mb-4">From a modest beginning in Namakkal to becoming one of the most trusted fashion hubs in Tamil Nadu, Hunter Mens & Juniors stands as a testament to quality and style.</p>
               <p className="mb-4">We believe that fashion is an extension of your personality. Whether you're dressing up for a boardroom meeting, a casual weekend getaway, or styling your little ones, our curated collections ensure you look exceptional without compromising on comfort.</p>
               <p className="text-fk-gray font-medium">Established in 2018 | 2 Premium Retail Outlets | Shipping Pan-India</p>
             </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-gray-50 flex flex-wrap justify-around py-8 border-b border-gray-100">
             <div className="text-center px-4 mb-4 md:mb-0">
               <div className="text-3xl font-bold text-fk-blue mb-1">8771+</div>
               <div className="text-[13px] font-medium text-fk-gray uppercase">Verified Reviews</div>
             </div>
             <div className="text-center px-4 mb-4 md:mb-0">
               <div className="text-3xl font-bold text-fk-blue mb-1">4.8★</div>
               <div className="text-[13px] font-medium text-fk-gray uppercase">Overall Rating</div>
             </div>
             <div className="text-center px-4 mb-4 md:mb-0">
               <div className="text-3xl font-bold text-fk-blue mb-1">2</div>
               <div className="text-[13px] font-medium text-fk-gray uppercase">Retail Branches</div>
             </div>
             <div className="text-center px-4 mb-4 md:mb-0">
               <div className="text-3xl font-bold text-fk-blue mb-1">19K+</div>
               <div className="text-[13px] font-medium text-fk-gray uppercase">Instagram Fam</div>
             </div>
          </div>

          {/* Why Hunter */}
          <div className="p-4 lg:p-8">
             <h2 className="text-2xl font-bold text-center mb-8">Why Shop From Hunter?</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: '💎', title: "Premium Quality", desc: "Handpicked fabrics and rigorous quality checks." },
                  { icon: '🏷️', title: "Nominal Pricing", desc: "Best prices guaranteed across Tamil Nadu." },
                  { icon: '🚚', title: "Pan-India Delivery", desc: "Easy ordering via WhatsApp for anywhere in India." },
                  { icon: '🤝', title: "Customer First", desc: "Hassle-free 7-day exchange policy." }
                ].map(feature => (
                   <div key={feature.title} className="bg-gray-50 p-6 rounded-sm text-center border border-gray-100">
                      <div className="text-4xl mb-3">{feature.icon}</div>
                      <h3 className="font-bold text-[16px] mb-2">{feature.title}</h3>
                      <p className="text-[13px] text-fk-gray">{feature.desc}</p>
                   </div>
                ))}
             </div>
          </div>

          <div className="p-4 lg:p-8 text-center pb-12">
             <h2 className="text-2xl font-bold mb-4">Experience Our Collection</h2>
             <Link to="/shop" className="bg-fk-blue text-white px-8 py-3 rounded-sm font-semibold shadow hover:bg-fk-blue/90 transition inline-block">
               Browse Products
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
