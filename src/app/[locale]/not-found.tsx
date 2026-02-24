import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {Map, Compass} from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('pages.notFound');
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-8">
        <Map className="w-32 h-32 text-gray-200" />
        <Compass className="w-16 h-16 text-primary-500 absolute -bottom-2 -right-2 animate-pulse" />
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">
        {t('title')}
      </h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        {t('description')}
      </p>
      
      <div className="w-full max-w-md mx-auto mb-12">
        <form action="/tours" method="GET" className="relative">
          <input
            type="search"
            name="q"
            placeholder={t('searchPlaceholder')}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </form>
      </div>
      
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
