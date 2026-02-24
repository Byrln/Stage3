'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('pages.error');
  const params = useParams();
  const locale = params?.locale || 'en';

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            500 - {t('title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('description')}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-red-50 rounded-md text-left overflow-auto max-h-48 text-xs text-red-800 border border-red-200">
              <p className="font-bold">{error.name}: {error.message}</p>
              {error.digest && <p className="mt-1 text-gray-500">Digest: {error.digest}</p>}
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('tryAgain')}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
