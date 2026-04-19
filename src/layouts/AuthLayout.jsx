import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Curve Shape */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H1440V250C1440 250 1100 650 720 450C340 250 0 600 0 600V0Z" fill="#d3f5dd" opacity="0.8"/>
        </svg>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
        {/* Left section: Authentication Form */}
        <div className="flex flex-col justify-center items-center md:items-end w-full relative">
          <div className="w-full max-w-[400px]">
            <div className="flex justify-start mb-6">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            </div>
            <Outlet />
          </div>
        </div>

        {/* Right section: Illustration */}
        <div className="hidden md:flex flex-col justify-center items-start w-full relative">
           <img src="/freeswap.svg" alt="Illustration" className="w-full max-w-[500px] object-contain" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
