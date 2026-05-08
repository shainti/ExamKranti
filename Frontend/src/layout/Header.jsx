import { useState } from "react";

const NAV_LINKS = [
  { label: "Mock Tests", icon: "ti-clipboard-list", href: "#" },
  { label: "Results", icon: "ti-chart-bar", href: "#" },
  { label: "Subjects", icon: "ti-book", href: "#" },
  { label: "Leaderboard", icon: "ti-trophy", href: "#", badge: "Live" },
];

const STATS = [
  { value: "2.4L+", label: "Students" },
  { value: "1,800+", label: "Mock tests" },
  { value: "50+", label: "Exams covered" },
];

const ClipboardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
      stroke="white" strokeWidth="1.8" strokeLinecap="round"
    />
    <path
      d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5V5Z"
      stroke="white" strokeWidth="1.8"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

export default function ExamKrantiHeader() {
  const [activeNav, setActiveNav] = useState("Mock Tests");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-sans">
      {/* Google Fonts + Tabler Icons */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@600;700&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        .font-sora { font-family: 'Sora', sans-serif; }
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* ── Main Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 no-underline">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <ClipboardIcon />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-sora text-lg font-bold text-gray-900 tracking-tight">
                Exam<span className="text-blue-600">Kranti</span>
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
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium font-grotesk text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
              <i className="ti ti-login text-base" />
              Log in
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold font-grotesk text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-150 cursor-pointer">
              <i className="ti ti-user-plus text-base" />
              Sign up free
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
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
              <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium font-grotesk text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <i className="ti ti-login text-base" />
                Log in
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold font-grotesk text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">
                <i className="ti ti-user-plus text-base" />
                Sign up free
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}