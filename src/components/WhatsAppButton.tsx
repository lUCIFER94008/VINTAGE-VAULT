'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  onClick?: () => void;
  text?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
}

export default function WhatsAppButton({
  onClick,
  text = 'BOOK ON WHATSAPP',
  loading = false,
  disabled = false,
  fullWidth = true,
  href,
}: WhatsAppButtonProps) {
  const content = (
    <>
      <MessageCircle className="w-5 h-5 fill-current text-white" />
      <span>{loading ? 'GENERATING WHATSAPP ORDER...' : text}</span>
    </>
  );

  const className = `${
    fullWidth ? 'w-full' : 'inline-flex'
  } bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white font-black text-sm tracking-wider uppercase py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
    >
      {content}
    </button>
  );
}
