import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange, placeholder = "Select option", label, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`space-y-2 ${className}`} ref={dropdownRef}>
            {label && <label className="text-xs font-bold text-slate-600 ml-1">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-indigo-600/50 rounded-2xl py-4 px-6 text-slate-900 flex items-center justify-between transition-all outline-none focus:ring-4 focus:ring-indigo-600/5"
                >
                    <span className={selectedOption ? "text-slate-900 font-medium" : "text-slate-400 font-medium"}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 animate-in fade-in zoom-in duration-200">
                        <div className="max-h-60 overflow-y-auto scrollbar-hide">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-6 py-3.5 text-left text-sm font-medium flex items-center justify-between transition-colors ${value === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {option.label}
                                    {value === option.value && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomDropdown;
