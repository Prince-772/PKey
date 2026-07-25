import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Settings2, 
  Download, 
  Copy, 
  RefreshCw,
  CheckCircle2,
  AlertOctagon,
  Terminal
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function SecurityTab({expanded}) {
  // Simple state for UI demonstration
  const [password, setPassword] = useState('PKey$2026!xYz#99');
  const [length, setLength] = useState(16);

  return (
    <div className={`w-full transition-all duration-300 ease-in-out mx-auto space-y-8 fade-in overflow-auto scroll-bar-hide px-12 pt-16`}>
      
      {/* Header */}
      <ScrollReveal>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
          Security Center
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">
          Manage your vault's health, generate strong keys, and configure encryption settings.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: Password Generator */}
        <ScrollReveal className="p-6 md:p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Password Generator</h3>
          </div>

          {/* Password Display Box */}
          <div className="relative p-4 mb-6 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 flex items-center justify-between group">
            <span className="text-xl font-mono text-gray-900 dark:text-white truncate pr-4">
              {password}
            </span>
            <div className="flex gap-2 shrink-0">
              <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6 flex-1">
            {/* Length Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Length</span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">{length}</span>
              </div>
              <input 
                type="range" 
                min="8" max="64" 
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Toggles (Visual only for now) */}
            <div className="grid grid-cols-2 gap-4">
              {['Uppercase', 'Lowercase', 'Numbers', 'Symbols'].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* SECTION 2: Vault Audit & Actions */}
        <ScrollReveal className="space-y-6">
          
          {/* Audit Card */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vault Audit</h3>
            </div>

            <div className="space-y-3">
              <ScrollReveal direction='right' delayMs={50} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="w-5 h-5 text-rose-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compromised Passwords</span>
                </div>
                <span className="text-sm font-black text-rose-500 bg-rose-100 dark:bg-rose-900/30 px-2.5 py-0.5 rounded-full">0</span>
              </ScrollReveal>

              <ScrollReveal direction='right' delayMs={100} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weak Passwords</span>
                </div>
                <span className="text-sm font-black text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2.5 py-0.5 rounded-full">3</span>
              </ScrollReveal>
            </div>
          </div>

          {/* Advanced Actions */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <Settings2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Data Management</h3>
            </div>
            
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group cursor-pointer">
              <div className="text-left">
                <span className="block text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">Export Vault</span>
                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">Download an encrypted JSON backup</span>
              </div>
              <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>
          </div>

        </ScrollReveal>
      </div>
    </div>
  );
}