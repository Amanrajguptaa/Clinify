"use client"
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Code */}
        <div className="mb-6">
          <span className="text-9xl font-bold text-blue-600">404</span>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Decorative Element */}
       

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Go Back
          </button>
          
          <Link href="/" passHref>
            <div className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Home size={16} strokeWidth={2} />
              Back to Home
            </div>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
}