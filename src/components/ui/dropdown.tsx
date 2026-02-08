import { useState } from "react";
import { ArrowUp } from "../icons/arrow-up";
import { ArrowDown } from "../icons/arrow-down";

interface DropdownProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function Dropdown({ title, subtitle, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full border rounded-md bg-white shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left text-lg font-semibold text-heading"
      >
        <span>
          {title}
          {subtitle && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              {subtitle}
            </span>
          )}
        </span>
        {isOpen ? (
          <ArrowUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ArrowDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Body */}
      {isOpen && <div className="border-t p-4">{children}</div>}
    </div>
  );
}
