import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  helpText?: string;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  minDate,
  maxDate,
  helpText,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onChange(date);
  };

  // Format date to YYYY-MM-DD for the input[type="date"]
  const formatDateForInput = (date: Date | null): string => {
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  // Format date for display
  const formatDisplayDate = (date: Date | null): string => {
    return date ? format(date, 'yyyy年MM月dd日', { locale: zhCN }) : '';
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="date"
          value={formatDateForInput(value)}
          onChange={handleChange}
          min={minDate ? formatDateForInput(minDate) : undefined}
          max={maxDate ? formatDateForInput(maxDate) : undefined}
          disabled={disabled}
          className={`block w-full px-3 py-2 border ${
            disabled ? 'bg-gray-100' : 'bg-white'
          } border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
      </div>
      {value && (
        <p className="mt-1 text-sm text-gray-500">
          已选择: {formatDisplayDate(value)}
        </p>
      )}
      {helpText && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default DatePicker;
