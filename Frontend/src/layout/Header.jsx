import { useState } from "react";

export default function ExamKrantiHeader() {
  const [activeNav, setActiveNav] = useState("Mock Tests");
  const [menuOpen, setMenuOpen] = useState(false);

  // Define your navigation links here
  const NAV_LINKS = [
  ];

  return (
    <div className="font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@600;700&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        .font-sora { font-family: 'Sora', sans-serif; }
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Updated Logo Section */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 no-underline">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              {/* Added the provided image logo here */}
              <img 
                src="https://img.upanh.tv/2025/01/29/Gemini_Generated_Image_drqdykdrqdykdrqd-removebg-preview.png" 
                alt="ExamKranti Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-sora text-xl font-bold tracking-tight">
                <span className="text-black">Exam</span>
                <span className="text-blue-600">Kranti</span>
              </span>
              <span className="font-grotesk text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                Mock Test Platform
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, icon, href, badge }) => (
              <a
                key={label}
                href={href}
                onClick={() => setActiveNav(label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium font-grotesk transition-all duration-150 no-underline cursor-pointer
                  ${activeNav === label
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                <i className={`ti ${icon} text-base`} />
                {label}
                {badge && (
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-grotesk">
                    {badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 shrink-0 opacity-50 pointer-events-none">
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium font-grotesk text-gray-700 bg-white border border-gray-200 rounded-lg">
              <i className="ti ti-login text-base" />
              Coming Soon
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold font-grotesk text-white bg-blue-600 rounded-lg">
              <i className="ti ti-user-plus text-base" />
              Coming Soon
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`ti ${menuOpen ? "ti-x" : "ti-menu-2"} text-lg`} />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, icon, href, badge }) => (
              <a
                key={label}
                href={href}
                onClick={() => { setActiveNav(label); setMenuOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium font-grotesk no-underline transition-all cursor-pointer
                  ${activeNav === label
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <i className={`ti ${icon} text-base`} />
                {label}
                {badge && (
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                    {badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}