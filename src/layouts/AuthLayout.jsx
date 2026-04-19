import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
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
