import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data';

export default function CategoryNav() {
  return (
    <div className="bg-white shadow-[0_1px_1px_0_rgba(0,0,0,.16)] hidden lg:block overflow-x-auto scrollbar-hide border-b border-fk-border">
      <div className="max-w-[1248px] mx-auto px-4 lg:px-6">
        <ul className="flex items-center justify-center py-3 min-w-max gap-12 px-8">
          {CATEGORIES.map((cat) => (
            <li key={cat.id} className="group">
              <Link to={`/shop?category=${cat.name}`} className="flex flex-col items-center gap-1.5 min-w-[64px]">
                <div className="w-[64px] h-[64px] flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 rounded-full transition-colors overflow-hidden">
                   <span className="text-3xl filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all">{cat.icon}</span>
                </div>
                <span className="text-[14px] font-medium text-[#212121] group-hover:text-fk-blue transition-colors">
                  {cat.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
