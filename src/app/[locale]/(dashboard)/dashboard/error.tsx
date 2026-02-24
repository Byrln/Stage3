'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {t('error')}
      </h2>
      <p className="text-gray-500 max-w-sm mb-6">
        {error.message || 'An unexpected error occurred while loading this dashboard section.'}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        {t('retry')}
      </button>
    </div>
  );
}
