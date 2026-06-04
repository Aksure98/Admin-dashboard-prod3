import Link from "next/link";
import React from "react";

interface AuthProps {
  children: React.ReactNode;
}

const Auth = ({ children }: AuthProps) => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        {children}
      </div>

      <div className="flex justify-between items-center px-16 py-4 border-t border-grey-300 bg-grey-25">
        <div className="text-base font-bold text-grey-600">
          Copyright {currentYear}. POINT2©.
        </div>

        <div className="flex items-center gap-10 text-brand-800 font-semibold text-base">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
