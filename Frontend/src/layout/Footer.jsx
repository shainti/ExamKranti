const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 font-grotesk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
          
          {/* Brand & Tagline */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-md shadow-blue-100">
                <i className="ti ti-bolt text-white text-xl" />
              </div>
              <span className="font-sora font-bold text-xl text-gray-900">
                Exam<span className="text-blue-600">Kranti</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              India's leading platform for smart exam preparation and real-time performance analytics.
            </p>
          </div>

          {/* Developer Badge */}
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200/60">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Developed By</span>
              <span className="text-sm font-bold text-gray-800">Shainti</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200" />
            <div className="flex gap-2">
              <a href="https://github.com/shainti" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all">
                <i className="ti ti-brand-github text-lg" />
              </a>
              <a href="https://linkedin.com/in/shainti" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-700 hover:border-blue-200 transition-all">
                <i className="ti ti-brand-linkedin text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-[11px] text-gray-400 font-medium">
            © {new Date().getFullYear()} ExamKranti. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;