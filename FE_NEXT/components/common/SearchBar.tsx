'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuery, clearQuery, selectQuery } from '@/store/slices/searchSlice';

interface SearchBarProps {
  onClose?: () => void;
  placeholder?: string;
  minimal?: boolean;
}

export default function SearchBar({
  onClose,
  placeholder,
  minimal = false
}: SearchBarProps) {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const storedQuery = useAppSelector(selectQuery);
  const [localQuery, setLocalQuery] = useState(storedQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = localQuery.trim();

    dispatch(setQuery(trimmed));

    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/search');
    }

    // Don't close search bar if we're already on /search
    if (onClose && pathname !== '/search') onClose();
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    dispatch(clearQuery());
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className={cn("relative w-full", minimal && "max-w-md mx-auto")}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center border border-white rounded-full px-4 py-2 w-full max-w-md mx-auto"
      >
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          className={cn(
            "bg-transparent text-white placeholder-gray-300 outline-none border-none flex-grow px-2",
            isRTL ? "text-right" : "text-left"
          )}
          placeholder={placeholder || t('search.placeholder')}
        />
        {localQuery ? (
          <button type="button" onClick={handleClearSearch} className="text-white ml-2">
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button type="submit" className="text-white ml-2">
            <Search className="h-5 w-5" />
          </button>
        )}
      </form>
    </div>
  );
}
