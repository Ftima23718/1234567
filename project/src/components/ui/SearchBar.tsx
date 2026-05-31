import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Rechercher...' }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative flex items-center transition-all duration-200 ${focused ? 'w-80' : 'w-64'}`}>
      <Search className="absolute left-3 w-4 h-4 text-gray-400" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all"
        placeholder={placeholder}
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-2 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
