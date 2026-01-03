import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { useAppStore } from '../store';

export const WalletButton = () => {
  const { user, connectWallet, disconnectWallet } = useAppStore();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-700">{user.address}</span>
            <span className="text-xs text-slate-400 border-l border-slate-200 pl-2 ml-2 font-mono">{user.balance} SOL</span>
        </div>
        <button 
            onClick={disconnectWallet}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Disconnect"
        >
            <LogOut size={20} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full flex items-center gap-2 font-medium transition-all shadow-lg shadow-purple-600/20"
    >
      <Wallet size={18} />
      Connect Wallet
    </button>
  );
};