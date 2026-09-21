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
      className={`flex flex-col rounded-2xl border-2 transition-all overflow-hidden ${
        isActive ? 'border-[#403A45] retro-window-shadow' : 'border-[#403A45]/40 opacity-90'
      } bg-[#FFFDFC] ${className}`}
    >
      {/* Title Bar */}
      <div className="h-10 px-3.5 bg-[#F6F0E7] border-b-2 border-[#403A45] flex items-center justify-between select-none shrink-0">
        {/* Left: Window Controls (Retro pastel dots) + Title */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              disabled={!onClose}
              className={`w-3 h-3 rounded-full border border-[#403A45]/40 bg-[#E8B8C9] hover:bg-[#d698ac] transition-colors ${
                !onClose ? 'opacity-40 cursor-default' : 'cursor-pointer'
              }`}
              title="Close window"
            />
            <button
              onClick={onMinimize}
              disabled={!onMinimize}
              className={`w-3 h-3 rounded-full border border-[#403A45]/40 bg-[#F2B35D] hover:bg-[#d9973f] transition-colors ${
                !onMinimize ? 'opacity-40 cursor-default' : 'cursor-pointer'
              }`}
              title="Minimize window"
            />
            <button
              onClick={onMaximize}
              disabled={!onMaximize}
              className={`w-3 h-3 rounded-full border border-[#403A45]/40 bg-[#BFE2D3] hover:bg-[#9ccab6] transition-colors ${
                !onMaximize ? 'opacity-40 cursor-default' : 'cursor-pointer'
              }`}
              title="Maximize window"
            />
          </div>

          <div className="h-4 w-px bg-[#403A45]/20 mx-0.5" />

          {/* Window Title & Icon */}
          <div className="flex items-center gap-1.5 text-xs font-mono-system font-bold text-[#29252D] truncate">
            {icon && <span className="text-sm shrink-0">{icon}</span>}
            <span className="truncate">{title}</span>
          </div>

          {badge && (
            <div className="hidden sm:block">
              {typeof badge === 'string' ? (
                <span className="text-[10px] font-mono-system font-medium px-2 py-0.5 rounded-full bg-[#DCD4EA] text-[#403A45] border border-[#403A45]/20">
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
      <div className="flex-1 overflow-auto flex flex-col">{children}</div>
    </div>
  );
};
