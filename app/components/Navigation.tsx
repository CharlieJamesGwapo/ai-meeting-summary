'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DarkModeToggle } from './DarkModeToggle';

export const Navigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            📋 Meeting Summary
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className={`transition-colors ${
                isActive('/')
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Home
            </Link>
            <Link
              href="/history"
              className={`transition-colors ${
                isActive('/history')
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              History
            </Link>
            <Link
              href="/settings"
              className={`transition-colors ${
                isActive('/settings')
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Settings
            </Link>
          </div>
        </div>
        <DarkModeToggle />
      </div>
    </nav>
  );
};
