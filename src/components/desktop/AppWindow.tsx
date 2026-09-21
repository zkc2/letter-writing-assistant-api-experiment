import React, { ReactNode } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { Language } from '../../types';

interface AppWindowProps {
  id: string;
  title: string;
  icon?: ReactNode;
  badge?: string | ReactNode;
  isActive?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  className?: string;
  children: ReactNode;
  headerRight?: ReactNode;
}

export const AppWindow: React.FC<AppWindowProps> = ({
  id,
  title,
  icon,
  badge,
  isActive = true,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized = false,
  className = '',
  children,
  headerRight,
}) => {
  return (
    <div
      id={id}
      className={`flex flex-col rounded-2xl border transition-all overflow-hidden ${
        isActive
          ? 'border-[#6f6587]/40 bureau-desk-shadow'
          : 'border-[#6f6587]/20 opacity-90'
      } bg-[#FCFAF6] ${className}`}
    >
      {/* Title Bar - Twilight Desk Heading */}
      <div className="h-10 px-3.5 bg-[#262433] border-b border-[#353043] flex items-center justify-between select-none shrink-0 text-[#FCFAF6]">
        {/* Left: Window Controls (Pastel wax dots) + Title */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              disabled={!onClose}
              className={`w-3 h-3 rounded-full border border-[#1c1a26] bg-[#DCA9B8] hover:bg-[#c88d9f] transition-colors ${
                !onClose ? 'opacity-40 cursor-default' : 'cursor-pointer'
              }`}
              title="Close window"
            />
            <button
              onClick={onMinimize}
              disabled={!onMinimize}
              className={`w-3 h-3 rounded-full border border-[#1c1a26] bg-[#E6A54F] hover:bg-[#cf8e38] transition-colors ${
                !onMinimize ? 'opacity-40 cursor-default' : 'cursor-pointer'
              }`}
              title="Minimize window"
            />
            <button
              onClick={onMaximize}
              disabled={!onMaximize}
              className={`w-3 h-3 rounded-full border border-[#1c1a26] bg-[#4E8B72] hover:bg-[#3d6f5b] transition-colors ${
                !onMaximize ? 'opacity-40 cursor-default' : 'cursor-pointer'
              }`}
              title="Maximize window"
            />
          </div>

          <div className="h-4 w-px bg-[#6f6587]/30 mx-0.5" />

          {/* Window Title & Icon */}
          <div className="flex items-center gap-1.5 text-xs font-mono-system font-bold text-[#FCFAF6] truncate">
            {icon && <span className="text-sm shrink-0 text-[#E6A54F]">{icon}</span>}
            <span className="truncate">{title}</span>
          </div>

          {badge && (
            <div className="hidden sm:block">
              {typeof badge === 'string' ? (
                <span className="text-[10px] font-mono-system font-medium px-2 py-0.5 rounded-full bg-[#353043] text-[#D8CCE4] border border-[#6f6587]/40">
                  {badge}
                </span>
              ) : (
                badge
              )}
            </div>
          )}
        </div>

        {/* Right side extra actions */}
        {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto flex flex-col bg-[#FCFAF6]">{children}</div>
    </div>
  );
};

