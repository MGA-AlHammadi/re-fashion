"use client";

import { useState } from 'react';

interface FilterState {
  search: string;
  priceMin: string;
  priceMax: string;
  size: string;
  condition: string;
  sortBy: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  productCount?: number;
}

export default function ProductFilters({ onFilterChange, productCount }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceMin: '',
    priceMax: '',
    size: '',
    condition: '',
    sortBy: 'newest'
  });

  const handleChange = (field: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      search: '',
      priceMin: '',
      priceMax: '',
      size: '',
      condition: '',
      sortBy: 'newest'
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = [
    filters.search,
    filters.priceMin,
    filters.priceMax,
    filters.size,
    filters.condition,
    filters.sortBy !== 'newest' ? 'sort' : ''
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-100/50 p-3 mb-4">
      {/* Search Bar & Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Suche..."
            className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-1 focus:ring-green-100 focus:outline-none transition-all text-sm bg-white/50 backdrop-blur-sm placeholder:text-gray-400"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {filters.search && (
            <button
              onClick={() => handleChange('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
              aria-label="Clear search"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs ${
              isOpen 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="w-4 h-4 bg-white text-green-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-2.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all flex items-center gap-1 text-xs border border-red-100"
              title="Zurücksetzen"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Result Count */}
      {productCount !== undefined && (
        <div className="flex items-center gap-1.5 text-[11px] mt-2">
          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
          <span className="font-semibold text-gray-700">{productCount}</span>
          <span className="text-gray-500">{productCount === 1 ? 'Produkt' : 'Produkte'}</span>
        </div>
      )}

      {/* Active Filter Pills */}
      {hasActiveFilters && !isOpen && (
        <div className="flex flex-wrap gap-1 mt-2">
          {filters.search && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-md text-[10px] font-medium border border-green-100">
              &quot;{filters.search}&quot;
            </span>
          )}
          {filters.priceMin && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-medium border border-blue-100">
              {filters.priceMin}€+
            </span>
          )}
          {filters.priceMax && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-medium border border-blue-100">
              ≤{filters.priceMax}€
            </span>
          )}
          {filters.size && (
            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[10px] font-medium border border-purple-100">
              {filters.size}
            </span>
          )}
          {filters.condition && (
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-medium border border-amber-100">
              {filters.condition}
            </span>
          )}
        </div>
      )}

      {/* Expandable Filters */}
      {isOpen && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100">
          {/* Price */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 mb-1">
              <span className="text-green-500">€</span>
              Preis
            </label>
            <div className="flex gap-1.5">
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => handleChange('priceMin', e.target.value)}
                placeholder="Min"
                className="w-1/2 px-2 py-1.5 border border-gray-200 rounded-md focus:border-green-400 focus:ring-1 focus:ring-green-50 focus:outline-none text-xs bg-white"
              />
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => handleChange('priceMax', e.target.value)}
                placeholder="Max"
                className="w-1/2 px-2 py-1.5 border border-gray-200 rounded-md focus:border-green-400 focus:ring-1 focus:ring-green-50 focus:outline-none text-xs bg-white"
              />
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 mb-1">
              <span className="text-purple-500">◻</span>
              Größe
            </label>
            <select
              value={filters.size}
              onChange={(e) => handleChange('size', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-200 rounded-md focus:border-purple-400 focus:ring-1 focus:ring-purple-50 focus:outline-none text-xs bg-white appearance-none cursor-pointer"
            >
              <option value="">Alle</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 mb-1">
              <span className="text-amber-500">★</span>
              Zustand
            </label>
            <select
              value={filters.condition}
              onChange={(e) => handleChange('condition', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-200 rounded-md focus:border-amber-400 focus:ring-1 focus:ring-amber-50 focus:outline-none text-xs bg-white appearance-none cursor-pointer"
            >
              <option value="">Alle</option>
              <option value="Neu">Neu</option>
              <option value="Wie neu">Wie neu</option>
              <option value="Sehr gut">Sehr gut</option>
              <option value="Gut">Gut</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 mb-1">
              <span className="text-blue-500">↕</span>
              Sort
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-200 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-50 focus:outline-none text-xs bg-white appearance-none cursor-pointer"
            >
              <option value="newest">Neueste</option>
              <option value="price-asc">Preis ↑</option>
              <option value="price-desc">Preis ↓</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>
      )}

      <style jsx>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
