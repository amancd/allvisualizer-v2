'use client';

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface Problem {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lc: number;
  code?: string;           // solution snippet
  explanation?: string;    // how this solution works
}

interface SubPattern {
  title: string;
  slug: string;
  recall?: string;         // how to recall / identify this pattern
  theory: string[];        // theory bullet points
  template: string;        // Python code template
  problems: Problem[];     // example problems with code
}

interface Category {
  name: string;
  slug: string;
  subPatterns: SubPattern[];
}

/* ------------------------------------------------------------------ */
/*  DIAGRAMS — visual aids for Two Pointer patterns                    */
/* ------------------------------------------------------------------ */

const patternDiagrams: Record<string, React.ReactNode> = {
  'tp-converging': (
    <svg viewBox="0 0 520 120" className="w-full max-w-lg" aria-label="Converging two pointers on a sorted array">
      {/* Array boxes */}
      {[1,2,4,5,7,9,11].map((v, i) => (
        <g key={i}>
          <rect x={60 + i * 58} y={30} width={50} height={40} rx={6} fill="#f0f4ff" stroke="#6366f1" strokeWidth={1.5} />
          <text x={85 + i * 58} y={55} textAnchor="middle" fontSize={15} fontWeight={600} fill="#4338ca">{v}</text>
        </g>
      ))}
      {/* Left pointer */}
      <polygon points="85,80 79,95 91,95" fill="#16a34a" />
      <text x={85} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a">L</text>
      {/* Right pointer */}
      <polygon points="433,80 427,95 439,95" fill="#dc2626" />
      <text x={433} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">R</text>
      {/* Arrows converging */}
      <line x1={105} y1={20} x2={230} y2={20} stroke="#16a34a" strokeWidth={1.5} markerEnd="url(#arrowG)" />
      <line x1={415} y1={20} x2={290} y2={20} stroke="#dc2626" strokeWidth={1.5} markerEnd="url(#arrowR)" />
      <defs>
        <marker id="arrowG" markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#16a34a" /></marker>
        <marker id="arrowR" markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#dc2626" /></marker>
      </defs>
      <text x={260} y={16} textAnchor="middle" fontSize={10} fill="#6b7280">converge inward</text>
    </svg>
  ),

  'tp-fast-slow': (
    <svg viewBox="0 0 440 160" className="w-full max-w-md" aria-label="Fast and slow pointers on a linked list cycle">
      {/* Linked list nodes in a cycle shape */}
      {/* Straight part */}
      {[0,1,2].map((i) => (
        <g key={i}>
          <circle cx={50 + i * 70} cy={50} r={22} fill="#f0f4ff" stroke="#6366f1" strokeWidth={1.5} />
          <text x={50 + i * 70} y={55} textAnchor="middle" fontSize={13} fontWeight={600} fill="#4338ca">{i + 1}</text>
          {i < 2 && <line x1={72 + i * 70} y1={50} x2={98 + i * 70} y2={50} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arrowN)" />}
        </g>
      ))}
      {/* Cycle part */}
      <line x1={212} y1={50} x2={248} y2={50} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arrowN)" />
      <circle cx={280} cy={50} r={22} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={280} y={55} textAnchor="middle" fontSize={13} fontWeight={600} fill="#b45309">4</text>
      <line x1={302} y1={55} x2={340} y2={90} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arrowN)" />
      <circle cx={350} cy={110} r={22} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={350} y={115} textAnchor="middle" fontSize={13} fontWeight={600} fill="#b45309">5</text>
      <line x1={328} y1={115} x2={292} y2={115} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arrowN)" />
      <circle cx={270} cy={115} r={22} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={270} y={120} textAnchor="middle" fontSize={13} fontWeight={600} fill="#b45309">6</text>
      {/* Arrow back to node 4 completing the cycle */}
      <path d="M255,100 Q220,70 260,55" fill="none" stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arrowN)" />
      {/* Slow pointer label */}
      <rect x={28} y={82} width={44} height={20} rx={4} fill="#16a34a" />
      <text x={50} y={96} textAnchor="middle" fontSize={10} fontWeight={700} fill="white">slow</text>
      <text x={50} y={110} textAnchor="middle" fontSize={9} fill="#16a34a">+1 step</text>
      {/* Fast pointer label */}
      <rect x={118} y={82} width={44} height={20} rx={4} fill="#dc2626" />
      <text x={140} y={96} textAnchor="middle" fontSize={10} fontWeight={700} fill="white">fast</text>
      <text x={140} y={110} textAnchor="middle" fontSize={9} fill="#dc2626">+2 steps</text>
      {/* Cycle label */}
      <text x={380} y={70} fontSize={10} fill="#f59e0b" fontWeight={600}>cycle</text>
      <defs>
        <marker id="arrowN" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#94a3b8" /></marker>
      </defs>
    </svg>
  ),

  'tp-fixed-separation': (
    <svg viewBox="0 0 520 110" className="w-full max-w-lg" aria-label="Fixed separation two pointers">
      {/* Linked list nodes */}
      {['1','2','3','4','5','6','∅'].map((v, i) => (
        <g key={i}>
          {v !== '∅' ? (
            <>
              <rect x={20 + i * 68} y={30} width={50} height={36} rx={6} fill={i >= 4 ? '#fef3c7' : '#f0f4ff'} stroke={i >= 4 ? '#f59e0b' : '#6366f1'} strokeWidth={1.5} />
              <text x={45 + i * 68} y={53} textAnchor="middle" fontSize={14} fontWeight={600} fill={i >= 4 ? '#b45309' : '#4338ca'}>{v}</text>
            </>
          ) : (
            <text x={45 + i * 68} y={53} textAnchor="middle" fontSize={13} fill="#94a3b8" fontWeight={600}>null</text>
          )}
          {i < 6 && <line x1={70 + i * 68} y1={48} x2={88 + i * 68} y2={48} stroke="#cbd5e1" strokeWidth={1.5} markerEnd="url(#arrowS)" />}
        </g>
      ))}
      {/* First pointer (ahead) */}
      <polygon points="317,76 311,91 323,91" fill="#dc2626" />
      <text x={317} y={106} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">first</text>
      {/* Second pointer (behind by n) */}
      <polygon points={`${317 - 2*68},76 ${311 - 2*68},91 ${323 - 2*68},91`} fill="#16a34a" />
      <text x={317 - 2*68} y={106} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">second</text>
      {/* Gap label */}
      <line x1={317 - 2*68} y1={22} x2={317} y2={22} stroke="#6b7280" strokeWidth={1} strokeDasharray="3,3" />
      <text x={(317 + 317 - 2*68)/2} y={16} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>n = 2 gap</text>
      <defs>
        <marker id="arrowS" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#cbd5e1" /></marker>
      </defs>
    </svg>
  ),

  'tp-inplace': (
    <svg viewBox="0 0 480 120" className="w-full max-w-lg" aria-label="In-place read/write two pointers">
      {/* Array with some duplicates */}
      {[1,1,2,2,3,4,4].map((v, i) => (
        <g key={i}>
          <rect x={40 + i * 58} y={35} width={48} height={38} rx={6} fill={i <= 3 ? '#dcfce7' : '#f0f4ff'} stroke={i <= 3 ? '#22c55e' : '#6366f1'} strokeWidth={1.5} />
          <text x={64 + i * 58} y={59} textAnchor="middle" fontSize={14} fontWeight={600} fill={i <= 3 ? '#166534' : '#4338ca'}>{v}</text>
        </g>
      ))}
      {/* Slow (write) pointer */}
      <polygon points="122,82 116,97 128,97" fill="#16a34a" />
      <text x={122} y={113} textAnchor="middle" fontSize={9} fontWeight={700} fill="#16a34a">slow (write)</text>
      {/* Fast (read) pointer */}
      <polygon points="296,82 290,97 302,97" fill="#2563eb" />
      <text x={296} y={113} textAnchor="middle" fontSize={9} fontWeight={700} fill="#2563eb">fast (read)</text>
      {/* Scan arrow */}
      <line x1={310} y1={27} x2={420} y2={27} stroke="#2563eb" strokeWidth={1.5} strokeDasharray="4,3" markerEnd="url(#arrowB)" />
      <text x={365} y={20} textAnchor="middle" fontSize={9} fill="#2563eb">scans all →</text>
      <defs>
        <marker id="arrowB" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#2563eb" /></marker>
      </defs>
    </svg>
  ),

  'tp-backspace': (
    <svg viewBox="0 0 440 120" className="w-full max-w-md" aria-label="Backspace string comparison processed from right">
      {/* String 1 */}
      {['a','b','#','c'].map((v, i) => (
        <g key={i}>
          <rect x={40 + i * 52} y={15} width={42} height={34} rx={5} fill={v === '#' ? '#fee2e2' : '#f0f4ff'} stroke={v === '#' ? '#ef4444' : '#6366f1'} strokeWidth={1.5} />
          <text x={61 + i * 52} y={37} textAnchor="middle" fontSize={14} fontWeight={600} fill={v === '#' ? '#dc2626' : '#4338ca'}>{v}</text>
        </g>
      ))}
      <text x={18} y={37} fontSize={11} fill="#6b7280" fontWeight={600}>S₁</text>
      {/* Pointer on string 1 */}
      <polygon points={`${61 + 3 * 52},55 ${55 + 3 * 52},67 ${67 + 3 * 52},67`} fill="#16a34a" />
      <text x={61 + 3 * 52} y={80} textAnchor="middle" fontSize={9} fontWeight={700} fill="#16a34a">i ←</text>
      {/* String 2 */}
      {['a','d','#','c'].map((v, i) => (
        <g key={i}>
          <rect x={240 + i * 52} y={15} width={42} height={34} rx={5} fill={v === '#' ? '#fee2e2' : '#f0f4ff'} stroke={v === '#' ? '#ef4444' : '#6366f1'} strokeWidth={1.5} />
          <text x={261 + i * 52} y={37} textAnchor="middle" fontSize={14} fontWeight={600} fill={v === '#' ? '#dc2626' : '#4338ca'}>{v}</text>
        </g>
      ))}
      <text x={218} y={37} fontSize={11} fill="#6b7280" fontWeight={600}>S₂</text>
      {/* Pointer on string 2 */}
      <polygon points={`${261 + 3 * 52},55 ${255 + 3 * 52},67 ${267 + 3 * 52},67`} fill="#dc2626" />
      <text x={261 + 3 * 52} y={80} textAnchor="middle" fontSize={9} fontWeight={700} fill="#dc2626">j ←</text>
      {/* Process direction */}
      <text x={220} y={108} textAnchor="middle" fontSize={10} fill="#6b7280">Process from right → left, skip chars after #</text>
    </svg>
  ),

  'tp-expand-center': (
    <svg viewBox="0 0 460 110" className="w-full max-w-md" aria-label="Expand from center for palindrome detection">
      {/* String characters */}
      {['b','a','b','a','d'].map((v, i) => (
        <g key={i}>
          <rect x={100 + i * 55} y={30} width={44} height={38} rx={6} fill={i >= 1 && i <= 3 ? '#dcfce7' : '#f1f5f9'} stroke={i >= 1 && i <= 3 ? '#22c55e' : '#cbd5e1'} strokeWidth={1.5} />
          <text x={122 + i * 55} y={54} textAnchor="middle" fontSize={15} fontWeight={600} fill={i >= 1 && i <= 3 ? '#166534' : '#64748b'}>{v}</text>
        </g>
      ))}
      {/* Center marker */}
      <circle cx={122 + 2 * 55} cy={25} r={4} fill="#f59e0b" />
      <text x={122 + 2 * 55} y={16} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>center</text>
      {/* Left expand arrow */}
      <line x1={122 + 2 * 55 - 10} y1={78} x2={122 + 0 * 55 + 5} y2={78} stroke="#16a34a" strokeWidth={1.5} markerEnd="url(#arrowE1)" />
      <text x={122 + 1 * 55 - 10} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill="#16a34a">← L</text>
      {/* Right expand arrow */}
      <line x1={122 + 2 * 55 + 10} y1={78} x2={122 + 4 * 55 - 5} y2={78} stroke="#dc2626" strokeWidth={1.5} markerEnd="url(#arrowE2)" />
      <text x={122 + 3 * 55 + 10} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill="#dc2626">R →</text>
      <defs>
        <marker id="arrowE1" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#16a34a" /></marker>
        <marker id="arrowE2" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#dc2626" /></marker>
      </defs>
    </svg>
  ),

  'tp-string-reversal': (
    <svg viewBox="0 0 440 110" className="w-full max-w-md" aria-label="String reversal with two pointers swapping from both ends">
      {/* Array: h e l l o */}
      {['h','e','l','l','o'].map((v, i) => (
        <g key={i}>
          <rect x={80 + i * 60} y={30} width={48} height={38} rx={6} fill={(i === 0 || i === 4) ? '#fef3c7' : '#f0f4ff'} stroke={(i === 0 || i === 4) ? '#f59e0b' : '#6366f1'} strokeWidth={1.5} />
          <text x={104 + i * 60} y={54} textAnchor="middle" fontSize={15} fontWeight={600} fill={(i === 0 || i === 4) ? '#b45309' : '#4338ca'}>{v}</text>
        </g>
      ))}
      {/* Left pointer */}
      <polygon points="104,78 98,93 110,93" fill="#16a34a" />
      <text x={104} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">L</text>
      {/* Right pointer */}
      <polygon points={`${104 + 4 * 60},78 ${98 + 4 * 60},93 ${110 + 4 * 60},93`} fill="#dc2626" />
      <text x={104 + 4 * 60} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">R</text>
      {/* Swap arc */}
      <path d="M110,25 Q220,0 334,25" fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,3" markerEnd="url(#arrowSw)" />
      <text x={220} y={10} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>swap</text>
      <defs>
        <marker id="arrowSw" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#f59e0b" /></marker>
      </defs>
    </svg>
  ),

  /* ── Sliding Window diagrams ─────────────────────────────── */

  'sw-fixed-size': (
    <svg viewBox="0 0 520 120" className="w-full max-w-lg" aria-label="Fixed size sliding window">
      {/* Array boxes */}
      {[3,1,4,1,5,9,2,6].map((v, i) => (
        <g key={i}>
          <rect x={20 + i * 60} y={35} width={50} height={38} rx={6}
            fill={i >= 2 && i <= 4 ? '#dbeafe' : '#f1f5f9'}
            stroke={i >= 2 && i <= 4 ? '#3b82f6' : '#cbd5e1'} strokeWidth={1.5} />
          <text x={45 + i * 60} y={59} textAnchor="middle" fontSize={14} fontWeight={600}
            fill={i >= 2 && i <= 4 ? '#1d4ed8' : '#64748b'}>{v}</text>
        </g>
      ))}
      {/* Window bracket */}
      <rect x={18 + 2 * 60} y={28} width={3 * 60 - 8} height={52} rx={8}
        fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6,3" />
      <text x={45 + 3 * 60} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">window k=3</text>
      {/* Slide arrow */}
      <line x1={20 + 2 * 60} y1={95} x2={20 + 5 * 60} y2={95} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#arrowFW)" />
      <text x={45 + 3.5 * 60} y={112} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>slide →</text>
      <defs>
        <marker id="arrowFW" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#3b82f6" /></marker>
      </defs>
    </svg>
  ),

  'sw-variable-size': (
    <svg viewBox="0 0 520 130" className="w-full max-w-lg" aria-label="Variable size sliding window">
      {/* Array boxes */}
      {[2,3,1,2,4,3].map((v, i) => (
        <g key={i}>
          <rect x={40 + i * 68} y={40} width={56} height={38} rx={6}
            fill={i >= 1 && i <= 3 ? '#dcfce7' : '#f1f5f9'}
            stroke={i >= 1 && i <= 3 ? '#22c55e' : '#cbd5e1'} strokeWidth={1.5} />
          <text x={68 + i * 68} y={64} textAnchor="middle" fontSize={14} fontWeight={600}
            fill={i >= 1 && i <= 3 ? '#166534' : '#64748b'}>{v}</text>
        </g>
      ))}
      {/* Left pointer */}
      <polygon points={`${68 + 1 * 68},86 ${62 + 1 * 68},100 ${74 + 1 * 68},100`} fill="#16a34a" />
      <text x={68 + 1 * 68} y={118} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">left</text>
      {/* Right pointer */}
      <polygon points={`${68 + 3 * 68},86 ${62 + 3 * 68},100 ${74 + 3 * 68},100`} fill="#dc2626" />
      <text x={68 + 3 * 68} y={118} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">right</text>
      {/* Expand / shrink labels */}
      <line x1={68 + 3 * 68 + 15} y1={30} x2={68 + 5 * 68 - 15} y2={30} stroke="#dc2626" strokeWidth={1.5} markerEnd="url(#arrowVR)" />
      <text x={68 + 4 * 68} y={22} textAnchor="middle" fontSize={9} fill="#dc2626" fontWeight={600}>expand →</text>
      <line x1={68 + 1 * 68 + 15} y1={30} x2={68 + 2 * 68 - 15} y2={30} stroke="#16a34a" strokeWidth={1.5} markerEnd="url(#arrowVL)" />
      <text x={68 + 1.5 * 68} y={22} textAnchor="middle" fontSize={9} fill="#16a34a" fontWeight={600}>shrink →</text>
      {/* Sum label inside window */}
      <text x={68 + 2 * 68} y={38} textAnchor="middle" fontSize={9} fill="#6b7280">sum = 6 ≤ target</text>
      <defs>
        <marker id="arrowVR" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#dc2626" /></marker>
        <marker id="arrowVL" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#16a34a" /></marker>
      </defs>
    </svg>
  ),

  'sw-monotonic-queue': (
    <svg viewBox="0 0 520 150" className="w-full max-w-lg" aria-label="Monotonic deque for sliding window max">
      {/* Array row */}
      {[1,3,-1,-3,5,3].map((v, i) => (
        <g key={i}>
          <rect x={30 + i * 68} y={10} width={56} height={36} rx={6}
            fill={i >= 1 && i <= 3 ? '#dbeafe' : '#f1f5f9'}
            stroke={i >= 1 && i <= 3 ? '#3b82f6' : '#cbd5e1'} strokeWidth={1.5} />
          <text x={58 + i * 68} y={33} textAnchor="middle" fontSize={13} fontWeight={600}
            fill={i >= 1 && i <= 3 ? '#1d4ed8' : '#64748b'}>{v}</text>
        </g>
      ))}
      <text x={58 + 3 * 68 + 10} y={4} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>window k=3</text>
      {/* Deque visualization */}
      <rect x={80} y={70} width={300} height={40} rx={8} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={230} y={62} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">Monotonic Deque (decreasing)</text>
      {/* Deque contents: indices of [3, -1, -3] → values shown */}
      {[3, -1, -3].map((v, i) => (
        <g key={i}>
          <rect x={105 + i * 90} y={76} width={60} height={28} rx={5} fill="white" stroke="#f59e0b" strokeWidth={1} />
          <text x={135 + i * 90} y={95} textAnchor="middle" fontSize={13} fontWeight={600} fill="#b45309">{v}</text>
        </g>
      ))}
      {/* Front = max */}
      <text x={68} y={95} textAnchor="middle" fontSize={9} fontWeight={700} fill="#16a34a">front→</text>
      <text x={395} y={95} textAnchor="middle" fontSize={9} fontWeight={700} fill="#dc2626">←back</text>
      {/* Arrow from front to answer */}
      <line x1={135} y1={112} x2={135} y2={135} stroke="#16a34a" strokeWidth={1.5} />
      <text x={135} y={147} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">max = 3</text>
    </svg>
  ),

  'sw-char-freq': (
    <svg viewBox="0 0 520 150" className="w-full max-w-lg" aria-label="Character frequency matching sliding window">
      {/* String characters */}
      {['c','b','a','e','b','a','b','a','c','d'].map((v, i) => (
        <g key={i}>
          <rect x={10 + i * 50} y={10} width={42} height={34} rx={5}
            fill={i >= 4 && i <= 6 ? '#dcfce7' : '#f1f5f9'}
            stroke={i >= 4 && i <= 6 ? '#22c55e' : '#cbd5e1'} strokeWidth={1.5} />
          <text x={31 + i * 50} y={32} textAnchor="middle" fontSize={13} fontWeight={600}
            fill={i >= 4 && i <= 6 ? '#166534' : '#64748b'}>{v}</text>
        </g>
      ))}
      {/* Window bracket */}
      <rect x={8 + 4 * 50} y={4} width={3 * 50 - 4} height={46} rx={7}
        fill="none" stroke="#22c55e" strokeWidth={2} strokeDasharray="5,3" />
      {/* Pattern to match */}
      <rect x={30} y={65} width={160} height={34} rx={6} fill="#ede9fe" stroke="#8b5cf6" strokeWidth={1.5} />
      <text x={110} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill="#7c3aed">pattern = &quot;abc&quot;</text>
      <text x={110} y={92} textAnchor="middle" fontSize={9} fill="#7c3aed">{'{a:1, b:1, c:1}'}</text>
      {/* Window freq map */}
      <rect x={230} y={65} width={190} height={34} rx={6} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
      <text x={325} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1d4ed8">window freq</text>
      <text x={325} y={92} textAnchor="middle" fontSize={9} fill="#1d4ed8">{'{b:2, a:1}'}</text>
      {/* Compare arrow */}
      <line x1={192} y1={82} x2={228} y2={82} stroke="#6b7280" strokeWidth={1.5} markerEnd="url(#arrowCF)" />
      <text x={210} y={74} textAnchor="middle" fontSize={8} fill="#6b7280">compare</text>
      {/* Matched counter */}
      <rect x={150} y={115} width={220} height={28} rx={6} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={260} y={134} textAnchor="middle" fontSize={11} fontWeight={600} fill="#b45309">matched: 1 / required: 3</text>
      <defs>
        <marker id="arrowCF" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#6b7280" /></marker>
      </defs>
    </svg>
  ),

  /* ── Binary Search diagrams ──────────────────────────────── */

  'bs-sorted': (
    <svg viewBox="0 0 520 130" className="w-full max-w-lg" aria-label="Binary search on sorted array">
      {/* Sorted array */}
      {[2,5,8,12,16,23,38,56,72,91].map((v, i) => (
        <g key={i}>
          <rect x={10 + i * 50} y={35} width={44} height={36} rx={5}
            fill={i === 4 ? '#dbeafe' : i >= 0 && i <= 3 ? '#f1f5f9' : '#f1f5f9'}
            stroke={i === 4 ? '#3b82f6' : '#cbd5e1'} strokeWidth={i === 4 ? 2 : 1.2} />
          <text x={32 + i * 50} y={58} textAnchor="middle" fontSize={11} fontWeight={i === 4 ? 700 : 500}
            fill={i === 4 ? '#1d4ed8' : '#64748b'}>{v}</text>
        </g>
      ))}
      {/* lo pointer */}
      <polygon points="32,80 26,93 38,93" fill="#16a34a" />
      <text x={32} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#16a34a">lo</text>
      {/* hi pointer */}
      <polygon points={`${32 + 9 * 50},80 ${26 + 9 * 50},93 ${38 + 9 * 50},93`} fill="#dc2626" />
      <text x={32 + 9 * 50} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#dc2626">hi</text>
      {/* mid pointer */}
      <polygon points={`${32 + 4 * 50},80 ${26 + 4 * 50},93 ${38 + 4 * 50},93`} fill="#3b82f6" />
      <text x={32 + 4 * 50} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">mid</text>
      {/* Halving arrows */}
      <path d={`M${32 + 4 * 50 - 15},25 Q${32 + 2 * 50},10 ${32},25`} fill="none" stroke="#16a34a" strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#arrowBS1)" />
      <text x={32 + 2 * 50} y={12} textAnchor="middle" fontSize={8} fill="#16a34a">target &lt; mid → go left</text>
      <path d={`M${32 + 4 * 50 + 15},25 Q${32 + 7 * 50},10 ${32 + 9 * 50},25`} fill="none" stroke="#dc2626" strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#arrowBS2)" />
      <text x={32 + 7 * 50} y={12} textAnchor="middle" fontSize={8} fill="#dc2626">target &gt; mid → go right</text>
      <defs>
        <marker id="arrowBS1" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#16a34a" /></marker>
        <marker id="arrowBS2" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#dc2626" /></marker>
      </defs>
    </svg>
  ),

  'bs-rotated': (
    <svg viewBox="0 0 520 160" className="w-full max-w-lg" aria-label="Binary search in rotated sorted array">
      {/* Rotated array visual — two ascending segments */}
      {/* Left sorted segment (higher values) */}
      {[12,16,23,38].map((v, i) => {
        const h = 20 + i * 12;
        return (
          <g key={i}>
            <rect x={20 + i * 60} y={90 - h} width={50} height={h} rx={4} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.2} />
            <text x={45 + i * 60} y={82} textAnchor="middle" fontSize={10} fontWeight={600} fill="#1d4ed8">{v}</text>
          </g>
        );
      })}
      {/* Pivot drop */}
      <path d="M260,30 L280,70" stroke="#ef4444" strokeWidth={2} strokeDasharray="4,3" />
      <text x={285} y={48} fontSize={9} fontWeight={700} fill="#ef4444">pivot</text>
      {/* Right sorted segment (lower values) */}
      {[2,5,8].map((v, i) => {
        const h = 12 + i * 10;
        return (
          <g key={i}>
            <rect x={280 + i * 60} y={90 - h} width={50} height={h} rx={4} fill="#dcfce7" stroke="#22c55e" strokeWidth={1.2} />
            <text x={305 + i * 60} y={82} textAnchor="middle" fontSize={10} fontWeight={600} fill="#166534">{v}</text>
          </g>
        );
      })}
      {/* Labels */}
      <text x={130} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">left sorted half</text>
      <text x={370} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill="#22c55e">right sorted half</text>
      {/* Mid arrow */}
      <polygon points="225,118 219,130 231,130" fill="#f59e0b" />
      <text x={225} y={145} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">mid — which half is sorted?</text>
    </svg>
  ),

  'bs-on-answer': (
    <svg viewBox="0 0 520 130" className="w-full max-w-lg" aria-label="Binary search on answer space">
      {/* Answer space bar */}
      <rect x={30} y={40} width={460} height={30} rx={6} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.5} />
      {/* Gradient from red (infeasible) to green (feasible) */}
      <rect x={30} y={40} width={230} height={30} rx={6} fill="#fee2e2" stroke="none" />
      <rect x={260} y={40} width={230} height={30} rx={6} fill="#dcfce7" stroke="none" />
      <rect x={30} y={40} width={460} height={30} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
      {/* Labels */}
      <text x={145} y={60} textAnchor="middle" fontSize={11} fontWeight={600} fill="#dc2626">infeasible</text>
      <text x={375} y={60} textAnchor="middle" fontSize={11} fontWeight={600} fill="#16a34a">feasible ✓</text>
      {/* boundary line */}
      <line x1={260} y1={35} x2={260} y2={80} stroke="#f59e0b" strokeWidth={2.5} />
      <text x={260} y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">boundary (answer)</text>
      {/* lo pointer */}
      <polygon points="50,80 44,93 56,93" fill="#16a34a" />
      <text x={50} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#16a34a">lo</text>
      {/* hi pointer */}
      <polygon points="470,80 464,93 476,93" fill="#dc2626" />
      <text x={470} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#dc2626">hi</text>
      {/* mid pointer */}
      <polygon points="300,80 294,93 306,93" fill="#3b82f6" />
      <text x={300} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">mid ✓ → hi=mid</text>
      {/* Arrow showing convergence */}
      <line x1={50} y1={120} x2={260} y2={120} stroke="#6b7280" strokeWidth={1} strokeDasharray="3,3" markerEnd="url(#arrowOA)" />
      <text x={155} y={130} textAnchor="middle" fontSize={8} fill="#6b7280">converge to boundary</text>
      <defs>
        <marker id="arrowOA" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#6b7280" /></marker>
      </defs>
    </svg>
  ),

  'bs-first-last': (
    <svg viewBox="0 0 520 130" className="w-full max-w-lg" aria-label="Binary search for first and last occurrence">
      {/* Sorted array with duplicates */}
      {[1,2,3,5,5,5,5,8,9].map((v, i) => (
        <g key={i}>
          <rect x={15 + i * 55} y={35} width={46} height={36} rx={5}
            fill={v === 5 ? '#fef3c7' : '#f1f5f9'}
            stroke={v === 5 ? '#f59e0b' : '#cbd5e1'} strokeWidth={v === 5 ? 2 : 1.2} />
          <text x={38 + i * 55} y={58} textAnchor="middle" fontSize={12} fontWeight={v === 5 ? 700 : 500}
            fill={v === 5 ? '#b45309' : '#64748b'}>{v}</text>
        </g>
      ))}
      {/* First occurrence arrow */}
      <polygon points={`${38 + 3 * 55},80 ${32 + 3 * 55},93 ${44 + 3 * 55},93`} fill="#16a34a" />
      <text x={38 + 3 * 55} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#16a34a">first</text>
      {/* Last occurrence arrow */}
      <polygon points={`${38 + 6 * 55},80 ${32 + 6 * 55},93 ${44 + 6 * 55},93`} fill="#dc2626" />
      <text x={38 + 6 * 55} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#dc2626">last</text>
      {/* bisect_left label */}
      <line x1={38 + 3 * 55} y1={25} x2={38 + 3 * 55} y2={33} stroke="#16a34a" strokeWidth={1.5} />
      <text x={38 + 3 * 55} y={18} textAnchor="middle" fontSize={8} fontWeight={600} fill="#16a34a">bisect_left</text>
      {/* bisect_right label */}
      <line x1={38 + 7 * 55} y1={25} x2={38 + 7 * 55} y2={33} stroke="#dc2626" strokeWidth={1.5} />
      <text x={38 + 7 * 55} y={18} textAnchor="middle" fontSize={8} fontWeight={600} fill="#dc2626">bisect_right</text>
      {/* Bracket showing target range */}
      <rect x={13 + 3 * 55} y={29} width={4 * 55 - 2} height={48} rx={7}
        fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={38 + 4.5 * 55} y={126} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>target = 5 (count = 4)</text>
    </svg>
  ),

  'bs-median-kth': (
    <svg viewBox="0 0 520 150" className="w-full max-w-lg" aria-label="Binary search partition for median of two sorted arrays">
      {/* Array 1 */}
      <text x={10} y={35} fontSize={10} fontWeight={700} fill="#3b82f6">A:</text>
      {[1,3,8,9,15].map((v, i) => (
        <g key={i}>
          <rect x={30 + i * 55} y={20} width={46} height={32} rx={5}
            fill={i < 2 ? '#dbeafe' : '#f1f5f9'}
            stroke={i < 2 ? '#3b82f6' : '#cbd5e1'} strokeWidth={1.2} />
          <text x={53 + i * 55} y={41} textAnchor="middle" fontSize={11} fontWeight={600}
            fill={i < 2 ? '#1d4ed8' : '#64748b'}>{v}</text>
        </g>
      ))}
      {/* Partition line in A */}
      <line x1={30 + 2 * 55 - 4} y1={15} x2={30 + 2 * 55 - 4} y2={57} stroke="#f59e0b" strokeWidth={2.5} />

      {/* Array 2 */}
      <text x={10} y={95} fontSize={10} fontWeight={700} fill="#22c55e">B:</text>
      {[2,5,6,12,14,17].map((v, i) => (
        <g key={i}>
          <rect x={30 + i * 55} y={78} width={46} height={32} rx={5}
            fill={i < 3 ? '#dcfce7' : '#f1f5f9'}
            stroke={i < 3 ? '#22c55e' : '#cbd5e1'} strokeWidth={1.2} />
          <text x={53 + i * 55} y={99} textAnchor="middle" fontSize={11} fontWeight={600}
            fill={i < 3 ? '#166534' : '#64748b'}>{v}</text>
        </g>
      ))}
      {/* Partition line in B */}
      <line x1={30 + 3 * 55 - 4} y1={73} x2={30 + 3 * 55 - 4} y2={115} stroke="#f59e0b" strokeWidth={2.5} />

      {/* Partition labels */}
      <text x={260} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">partition cut</text>

      {/* Left halves label */}
      <rect x={30} y={122} width={130} height={22} rx={5} fill="#ede9fe" stroke="#8b5cf6" strokeWidth={1.2} />
      <text x={95} y={137} textAnchor="middle" fontSize={9} fontWeight={600} fill="#7c3aed">left halves: 1,3,2,5,6</text>

      {/* Right halves label */}
      <rect x={180} y={122} width={160} height={22} rx={5} fill="#fce7f3" stroke="#ec4899" strokeWidth={1.2} />
      <text x={260} y={137} textAnchor="middle" fontSize={9} fontWeight={600} fill="#be185d">right halves: 8,9,15,12,14,17</text>

      {/* Condition */}
      <text x={430} y={137} textAnchor="middle" fontSize={8} fill="#6b7280" fontWeight={600}>max(left) ≤ min(right)</text>
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  DATA — sub-patterns grouped into categories                        */
/* ------------------------------------------------------------------ */


const categories: Category[] = [
  /* ── Two Pointer Patterns ────────────────────────────────── */
  {
    name: 'Two Pointer Patterns',
    slug: 'two-pointer',
    subPatterns: [
      {
        title: 'Two Pointers - Converging (Sorted Array Target Sum)',
        slug: 'tp-converging',
        recall: 'If the input is sorted and you need a pair/sum — think left+right pointers converging inward. Move the smaller side up or the larger side down.',
        theory: [
          'Place one pointer at the start and one at the end of a sorted array.',
          'If the sum is too small, move the left pointer right. If too large, move the right pointer left.',
          'Works because sorting gives a monotonic relationship between pointer movement and sum.',
          'Time: O(n), Space: O(1). Requires sorted input or sort first in O(n log n).',
        ],
        template: `def two_sum_sorted(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        curr = nums[left] + nums[right]\n        if curr == target:\n            return [left, right]\n        elif curr < target:\n            left += 1\n        else:\n            right -= 1\n    return [-1, -1]`,
        problems: [
          {
            name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', lc: 167,
            code: `def twoSum(numbers, target):\n    l, r = 0, len(numbers) - 1\n    while l < r:\n        s = numbers[l] + numbers[r]\n        if s == target:\n            return [l + 1, r + 1]\n        elif s < target:\n            l += 1\n        else:\n            r -= 1`,
            explanation: 'Array is sorted. Start pointers at both ends. If sum < target, move left pointer right to increase sum. If sum > target, move right pointer left to decrease it. Return 1-indexed positions.',
          },
          {
            name: '3Sum', difficulty: 'Medium', lc: 15,
            code: `def threeSum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i-1]:\n            continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]: l += 1\n                while l < r and nums[r] == nums[r-1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res`,
            explanation: 'Sort the array. Fix one number, then use converging two pointers on the rest to find pairs that sum to negative of the fixed number. Skip duplicates at every level to avoid duplicate triplets.',
          },
          {
            name: '3Sum Closest', difficulty: 'Medium', lc: 16,
            code: `def threeSumClosest(nums, target):\n    nums.sort()\n    closest = float('inf')\n    for i in range(len(nums) - 2):\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if abs(s - target) < abs(closest - target):\n                closest = s\n            if s < target: l += 1\n            elif s > target: r -= 1\n            else: return s\n    return closest`,
            explanation: 'Same two-pointer approach as 3Sum but instead of looking for exactly 0 we track whichever sum is closest to target. If we hit target exactly, return immediately.',
          },
          {
            name: '4Sum', difficulty: 'Medium', lc: 18,
            code: `def fourSum(nums, target):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 3):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        for j in range(i+1, len(nums) - 2):\n            if j > i+1 and nums[j] == nums[j-1]: continue\n            l, r = j + 1, len(nums) - 1\n            while l < r:\n                s = nums[i]+nums[j]+nums[l]+nums[r]\n                if s == target:\n                    res.append([nums[i],nums[j],nums[l],nums[r]])\n                    while l<r and nums[l]==nums[l+1]: l+=1\n                    while l<r and nums[r]==nums[r-1]: r-=1\n                    l+=1; r-=1\n                elif s < target: l+=1\n                else: r-=1\n    return res`,
            explanation: 'Extend 3Sum by adding one more outer loop. Fix two numbers with nested loops, then converge two pointers for the remaining pair. Skip duplicates at each level.',
          },
          {
            name: 'Two Sum IV - Input is a BST', difficulty: 'Easy', lc: 653,
            code: `def findTarget(root, k):\n    seen = set()\n    stack = [root]\n    while stack:\n        node = stack.pop()\n        if not node: continue\n        if k - node.val in seen:\n            return True\n        seen.add(node.val)\n        stack.append(node.left)\n        stack.append(node.right)\n    return False`,
            explanation: 'Traverse the BST (DFS or BFS). For each node, check if complement (k - node.val) exists in a set. If yes, found the pair. Otherwise add current value to set and continue.',
          },
        ],
      },
      {
        title: 'Two Pointers - Fast & Slow (Cycle Detection)',
        slug: 'tp-fast-slow',
        recall: 'Linked list + "cycle" or "middle" → use slow (1 step) and fast (2 steps). They meet inside a cycle. Reset one to head and walk both at 1 step to find the cycle start.',
        theory: [
          'Use two pointers moving at different speeds (slow = 1 step, fast = 2 steps).',
          'If there is a cycle, they will eventually meet inside the cycle.',
          'To find the cycle start: reset one pointer to head, then both move 1 step until they meet.',
          'Also used to find the middle of a linked list (when fast reaches the end, slow is at the middle).',
        ],
        template: `def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False\n\ndef find_cycle_start(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            slow = head\n            while slow != fast:\n                slow = slow.next\n                fast = fast.next\n            return slow\n    return None`,
        problems: [
          {
            name: 'Linked List Cycle', difficulty: 'Easy', lc: 141,
            code: `def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False`,
            explanation: 'Slow moves 1 step, fast moves 2 steps. If there is a cycle, fast will eventually lap slow and they will meet. If fast reaches null, no cycle exists.',
          },
          {
            name: 'Linked List Cycle II', difficulty: 'Medium', lc: 142,
            code: `def detectCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            slow = head\n            while slow != fast:\n                slow = slow.next\n                fast = fast.next\n            return slow\n    return None`,
            explanation: 'First detect cycle with fast/slow. Once they meet, reset slow to head. Now move both 1 step at a time — they meet at the cycle entry. This works because the distance from head to cycle start equals the distance from meeting point to cycle start.',
          },
          {
            name: 'Happy Number', difficulty: 'Easy', lc: 202,
            code: `def isHappy(n):\n    def next_num(x):\n        total = 0\n        while x:\n            x, d = divmod(x, 10)\n            total += d * d\n        return total\n    slow = n\n    fast = next_num(n)\n    while fast != 1 and slow != fast:\n        slow = next_num(slow)\n        fast = next_num(next_num(fast))\n    return fast == 1`,
            explanation: 'Treat the sequence of digit-square sums as a linked list. Use Floyd\'s cycle detection. If fast reaches 1 it is happy. If slow meets fast before that, there is a cycle and it is not happy.',
          },
          {
            name: 'Middle of the Linked List', difficulty: 'Easy', lc: 876,
            code: `def middleNode(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`,
            explanation: 'Fast moves 2x the speed of slow. When fast reaches the end, slow is exactly at the middle. For even-length lists, this returns the second middle node.',
          },
        ],
      },
      {
        title: 'Two Pointers - Fixed Separation (Nth Node from End)',
        slug: 'tp-fixed-separation',
        recall: '"Nth from the end" → advance one pointer N steps ahead first, then walk both together. When the leader hits null, the follower is at the target.',
        theory: [
          'Advance the first pointer by N steps, then move both pointers together.',
          'When the first pointer hits the end, the second pointer is N nodes from the end.',
          'Use a dummy node before head to handle edge cases (e.g., removing the head node).',
          'Time: O(n) single pass, Space: O(1).',
        ],
        template: `def remove_nth_from_end(head, n):\n    dummy = ListNode(0, head)\n    first = second = dummy\n    for _ in range(n + 1):\n        first = first.next\n    while first:\n        first = first.next\n        second = second.next\n    second.next = second.next.next\n    return dummy.next`,
        problems: [
          {
            name: 'Remove Nth Node From End of List', difficulty: 'Medium', lc: 19,
            code: `def removeNthFromEnd(head, n):\n    dummy = ListNode(0, head)\n    first = second = dummy\n    for _ in range(n + 1):\n        first = first.next\n    while first:\n        first = first.next\n        second = second.next\n    second.next = second.next.next\n    return dummy.next`,
            explanation: 'Use a dummy node. Advance first pointer n+1 steps. Then move both until first is null. Now second.next is the node to remove. Skip it by relinking.',
          },
          {
            name: 'Rotate List', difficulty: 'Medium', lc: 61,
            code: `def rotateRight(head, k):\n    if not head or not head.next: return head\n    length = 1\n    tail = head\n    while tail.next:\n        tail = tail.next\n        length += 1\n    k %= length\n    if k == 0: return head\n    tail.next = head  # make circular\n    curr = head\n    for _ in range(length - k - 1):\n        curr = curr.next\n    new_head = curr.next\n    curr.next = None\n    return new_head`,
            explanation: 'Find the length and make the list circular. The new head is at position (length - k). Walk to the node before the new head, break the circle there.',
          },
          {
            name: 'Reorder List', difficulty: 'Medium', lc: 143,
            code: `def reorderList(head):\n    # Find middle\n    slow = fast = head\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n    # Reverse second half\n    prev, curr = None, slow.next\n    slow.next = None\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    # Merge two halves\n    first, second = head, prev\n    while second:\n        tmp1, tmp2 = first.next, second.next\n        first.next = second\n        second.next = tmp1\n        first, second = tmp1, tmp2`,
            explanation: 'Three steps: (1) find the middle with slow/fast, (2) reverse the second half, (3) interleave the two halves by alternating links.',
          },
        ],
      },
      {
        title: 'Two Pointers - In-place Array Modification',
        slug: 'tp-inplace',
        recall: '"Remove/modify in-place with O(1) space" → use a slow (write) pointer and a fast (read) pointer. Fast scans everything; slow only advances when we keep an element.',
        theory: [
          'Use a slow pointer (write position) and a fast pointer (read position).',
          'Fast pointer scans every element; slow pointer only advances when we keep an element.',
          'Overwrites in-place without extra space. Common for removing duplicates or specific values.',
          'Time: O(n), Space: O(1). Order of remaining elements is preserved.',
        ],
        template: `def remove_duplicates(nums):\n    if not nums: return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1`,
        problems: [
          {
            name: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', lc: 26,
            code: `def removeDuplicates(nums):\n    if not nums: return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1`,
            explanation: 'slow marks the last unique position. fast scans the array. When fast finds a new value, increment slow and copy it there. Array is sorted so duplicates are adjacent.',
          },
          {
            name: 'Remove Element', difficulty: 'Easy', lc: 27,
            code: `def removeElement(nums, val):\n    slow = 0\n    for fast in range(len(nums)):\n        if nums[fast] != val:\n            nums[slow] = nums[fast]\n            slow += 1\n    return slow`,
            explanation: 'slow is the write pointer. fast reads every element. If fast finds a non-val element, write it at slow and advance slow. Final slow value is the new length.',
          },
          {
            name: 'Move Zeroes', difficulty: 'Easy', lc: 283,
            code: `def moveZeroes(nums):\n    slow = 0\n    for fast in range(len(nums)):\n        if nums[fast] != 0:\n            nums[slow], nums[fast] = nums[fast], nums[slow]\n            slow += 1`,
            explanation: 'Same as remove element but swap instead of overwrite. slow tracks the position for the next non-zero. Swap fast\'s non-zero with slow\'s zero, advance slow.',
          },
          {
            name: 'Remove Duplicates from Sorted Array II', difficulty: 'Medium', lc: 80,
            code: `def removeDuplicates(nums):\n    slow = 0\n    for fast in range(len(nums)):\n        if slow < 2 or nums[fast] != nums[slow - 2]:\n            nums[slow] = nums[fast]\n            slow += 1\n    return slow`,
            explanation: 'Allow at most 2 of each value. Write at slow only if slow < 2 (first two elements always valid) or the current value differs from nums[slow-2]. This generalizes to allow K duplicates.',
          },
          {
            name: 'Sort Colors', difficulty: 'Medium', lc: 75,
            code: `def sortColors(nums):\n    lo, mid, hi = 0, 0, len(nums) - 1\n    while mid <= hi:\n        if nums[mid] == 0:\n            nums[lo], nums[mid] = nums[mid], nums[lo]\n            lo += 1; mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[hi] = nums[hi], nums[mid]\n            hi -= 1`,
            explanation: 'Dutch National Flag algorithm. Three pointers: lo (boundary for 0s), mid (scanner), hi (boundary for 2s). Swap 0s to the front and 2s to the back. mid only advances when it sees 0 or 1.',
          },
        ],
      },
      {
        title: 'Two Pointers - String Comparison with Backspaces',
        slug: 'tp-backspace',
        recall: '"Compare strings with backspaces (#) without building them" → process from the end, count backspaces, skip characters accordingly, then compare.',
        theory: [
          'Process strings from the end. When you hit a "#", count backspaces and skip characters.',
          'Compare characters only when both pointers are on non-skipped characters.',
          'Simulating from the end avoids building the final string, giving O(1) space.',
          'Time: O(n + m), Space: O(1).',
        ],
        template: `def backspace_compare(s, t):\n    i, j = len(s) - 1, len(t) - 1\n    skip_s = skip_t = 0\n    while i >= 0 or j >= 0:\n        while i >= 0:\n            if s[i] == '#': skip_s += 1; i -= 1\n            elif skip_s > 0: skip_s -= 1; i -= 1\n            else: break\n        while j >= 0:\n            if t[j] == '#': skip_t += 1; j -= 1\n            elif skip_t > 0: skip_t -= 1; j -= 1\n            else: break\n        if i >= 0 and j >= 0 and s[i] != t[j]: return False\n        if (i >= 0) != (j >= 0): return False\n        i -= 1; j -= 1\n    return True`,
        problems: [
          {
            name: 'Backspace String Compare', difficulty: 'Easy', lc: 844,
            code: `def backspaceCompare(s, t):\n    def process(string):\n        i = len(string) - 1\n        skip = 0\n        while i >= 0:\n            if string[i] == '#': skip += 1; i -= 1\n            elif skip > 0: skip -= 1; i -= 1\n            else: yield string[i]; i -= 1\n    return list(process(s)) == list(process(t))`,
            explanation: 'Use a generator that walks the string from the end. On "#" increment skip counter. On a normal char with skip > 0, skip it. Otherwise yield it. Compare the two generated sequences.',
          },
          {
            name: 'Remove All Adjacent Duplicates In String', difficulty: 'Easy', lc: 1047,
            code: `def removeDuplicates(s):\n    stack = []\n    for ch in s:\n        if stack and stack[-1] == ch:\n            stack.pop()\n        else:\n            stack.append(ch)\n    return ''.join(stack)`,
            explanation: 'Use a stack as the result. Push each character. If the top of the stack equals the current character, pop instead — this removes the adjacent pair. Final stack is the answer.',
          },
        ],
      },
      {
        title: 'Two Pointers - Expanding From Center (Palindromes)',
        slug: 'tp-expand-center',
        recall: '"Find palindromic substrings" → for every index, expand outward with two pointers (left--, right++) while characters match. Check both odd-length (center = i) and even-length (center = i, i+1).',
        theory: [
          'For each index (and each pair of adjacent indices), expand outward while characters match.',
          'Handles both odd-length and even-length palindromes.',
          'Track the longest palindrome found so far by comparing lengths.',
          'Time: O(n²) worst case, Space: O(1). Can be improved to O(n) with Manacher\'s algorithm.',
        ],
        template: `def longest_palindrome(s):\n    res = ""\n    for i in range(len(s)):\n        # Odd length\n        l, r = i, i\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if r - l + 1 > len(res): res = s[l:r+1]\n            l -= 1; r += 1\n        # Even length\n        l, r = i, i + 1\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if r - l + 1 > len(res): res = s[l:r+1]\n            l -= 1; r += 1\n    return res`,
        problems: [
          {
            name: 'Longest Palindromic Substring', difficulty: 'Medium', lc: 5,
            code: `def longestPalindrome(s):\n    res = ""\n    for i in range(len(s)):\n        for l, r in [(i, i), (i, i+1)]:\n            while l >= 0 and r < len(s) and s[l] == s[r]:\n                if r - l + 1 > len(res):\n                    res = s[l:r+1]\n                l -= 1; r += 1\n    return res`,
            explanation: 'For each index, try expanding two palindromes: one centered at i (odd length) and one centered between i and i+1 (even length). Expand while characters match and track the longest found.',
          },
          {
            name: 'Palindromic Substrings', difficulty: 'Medium', lc: 647,
            code: `def countSubstrings(s):\n    count = 0\n    for i in range(len(s)):\n        for l, r in [(i, i), (i, i+1)]:\n            while l >= 0 and r < len(s) and s[l] == s[r]:\n                count += 1\n                l -= 1; r += 1\n    return count`,
            explanation: 'Same expand-from-center approach, but instead of tracking the longest, increment a counter for every valid palindrome you encounter during expansion.',
          },
        ],
      },
      {
        title: 'Two Pointers - String Reversal',
        slug: 'tp-string-reversal',
        recall: '"Reverse something in-place" → left pointer at start, right pointer at end, swap and move inward until they meet.',
        theory: [
          'Place pointers at start and end of the string (or segment). Swap and move inward.',
          'For reversing words: reverse the whole string, then reverse each word individually.',
          'Works in-place with O(1) extra space on mutable arrays.',
          'Time: O(n), Space: O(1) if array is mutable.',
        ],
        template: `def reverse_string(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1`,
        problems: [
          {
            name: 'Reverse String', difficulty: 'Easy', lc: 344,
            code: `def reverseString(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1`,
            explanation: 'Classic swap from both ends. left and right converge toward the middle, swapping characters at each step. Mutates the list in-place.',
          },
          {
            name: 'Reverse Vowels of a String', difficulty: 'Easy', lc: 345,
            code: `def reverseVowels(s):\n    s = list(s)\n    vowels = set('aeiouAEIOU')\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and s[l] not in vowels: l += 1\n        while l < r and s[r] not in vowels: r -= 1\n        s[l], s[r] = s[r], s[l]\n        l += 1; r -= 1\n    return ''.join(s)`,
            explanation: 'Two pointers from both ends. Skip non-vowels. When both land on vowels, swap them and move inward. Only vowels get reversed; all other characters stay in place.',
          },
          {
            name: 'Reverse Words in a String', difficulty: 'Medium', lc: 151,
            code: `def reverseWords(s):\n    return ' '.join(s.split()[::-1])`,
            explanation: 'split() handles multiple spaces and leading/trailing spaces by default. Reverse the resulting list of words and join with a single space.',
          },
          {
            name: 'Reverse String II', difficulty: 'Easy', lc: 541,
            code: `def reverseStr(s, k):\n    s = list(s)\n    for i in range(0, len(s), 2 * k):\n        s[i:i+k] = s[i:i+k][::-1]\n    return ''.join(s)`,
            explanation: 'Every 2k characters, reverse the first k. Python slice assignment makes this concise. Step through the string in chunks of 2k.',
          },
          {
            name: 'Valid Palindrome', difficulty: 'Easy', lc: 125,
            code: `def isPalindrome(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower():\n            return False\n        l += 1; r -= 1\n    return True`,
            explanation: 'Two pointers from both ends. Skip non-alphanumeric characters. Compare lowercase versions. If any mismatch, return False. If pointers meet, it is a palindrome.',
          },
        ],
      },
    ],
  },

  /* ── Sliding Window Patterns ────────────────────────────── */
  {
    name: 'Sliding Window Patterns',
    slug: 'sliding-window',
    subPatterns: [
      {
        title: 'Sliding Window - Fixed Size (Subarray Calculation)',
        slug: 'sw-fixed-size',
        recall: 'If the problem gives you a fixed window size k and asks for max/min/average of a subarray — use a fixed sliding window. Slide both ends together, add the new element, remove the old one.',
        theory: [
          'The window size k is given. Initialize by computing the result for the first k elements.',
          'Slide one step at a time: add nums[i], remove nums[i - k]. Update the answer each step.',
          'Works for rolling sums, rolling averages, max sum of size-k subarray, and count-based checks.',
          'Time: O(n), Space: O(1) — each element is visited exactly once.',
        ],
        template: `def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
        problems: [
          {
            name: 'Maximum Average Subarray I', difficulty: 'Easy', lc: 643,
            code: `def findMaxAverage(nums, k):\n    window = sum(nums[:k])\n    best = window\n    for i in range(k, len(nums)):\n        window += nums[i] - nums[i - k]\n        best = max(best, window)\n    return best / k`,
            explanation: 'Compute the sum of the first k elements. Slide the window: add the new right element, subtract the element leaving on the left. Track the max sum and divide by k at the end for the average.',
          },
          {
            name: 'Grumpy Bookstore Owner', difficulty: 'Medium', lc: 1052,
            code: `def maxSatisfied(customers, grumpy, minutes):\n    base = sum(c for c, g in zip(customers, grumpy) if g == 0)\n    extra = sum(customers[i] for i in range(minutes) if grumpy[i])\n    best = extra\n    for i in range(minutes, len(customers)):\n        if grumpy[i]: extra += customers[i]\n        if grumpy[i - minutes]: extra -= customers[i - minutes]\n        best = max(best, extra)\n    return base + best`,
            explanation: 'Base satisfaction = sum when not grumpy. Then slide a window of size "minutes" to find the window that recovers the most grumpy-lost customers. Add the best extra to base.',
          },
          {
            name: 'Number of Sub-arrays of Size K and Average >= Threshold', difficulty: 'Medium', lc: 1343,
            code: `def numOfSubarrays(arr, k, threshold):\n    target = k * threshold\n    window = sum(arr[:k])\n    count = 1 if window >= target else 0\n    for i in range(k, len(arr)):\n        window += arr[i] - arr[i - k]\n        if window >= target:\n            count += 1\n    return count`,
            explanation: 'Instead of dividing by k every step, compare the window sum directly against k * threshold. Slide the fixed window and count how many positions meet the condition.',
          },
          {
            name: 'Contains Duplicate II', difficulty: 'Easy', lc: 219,
            code: `def containsNearbyDuplicate(nums, k):\n    window = set()\n    for i, n in enumerate(nums):\n        if n in window:\n            return True\n        window.add(n)\n        if len(window) > k:\n            window.remove(nums[i - k])\n    return False`,
            explanation: 'Maintain a set of at most k elements (the current window). If the new element is already in the set, we found a duplicate within distance k. Otherwise add it and evict the oldest if the set exceeds size k.',
          },
          {
            name: 'Maximum Number of Vowels in a Substring of Given Length', difficulty: 'Medium', lc: 1456,
            code: `def maxVowels(s, k):\n    vowels = set('aeiou')\n    count = sum(1 for c in s[:k] if c in vowels)\n    best = count\n    for i in range(k, len(s)):\n        count += (s[i] in vowels) - (s[i - k] in vowels)\n        best = max(best, count)\n    return best`,
            explanation: 'Count vowels in the first k characters. Slide the window: add 1 if the new char is a vowel, subtract 1 if the leaving char was a vowel. Track the max count.',
          },
        ],
      },
      {
        title: 'Sliding Window - Variable Size (Condition-Based)',
        slug: 'sw-variable-size',
        recall: 'If the problem says "longest/shortest subarray/substring satisfying some condition" — use a variable-size sliding window. Expand right to include, shrink left when the condition breaks.',
        theory: [
          'Expand the window by advancing the right pointer and updating window state.',
          'When the constraint is violated, shrink from the left until valid again.',
          'For "longest" problems: update the answer before or while the window is valid. For "shortest": update after shrinking to a valid state.',
          'Each element enters and leaves the window at most once — O(n) total even with the inner while loop.',
        ],
        template: `def longest_subarray(nums, k):
    left = 0
    total = 0
    result = 0
    for right in range(len(nums)):
        total += nums[right]
        while total > k:
            total -= nums[left]
            left += 1
        result = max(result, right - left + 1)
    return result`,
        problems: [
          {
            name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', lc: 3,
            code: `def lengthOfLongestSubstring(s):\n    seen = {}\n    left = 0\n    best = 0\n    for right, ch in enumerate(s):\n        if ch in seen and seen[ch] >= left:\n            left = seen[ch] + 1\n        seen[ch] = right\n        best = max(best, right - left + 1)\n    return best`,
            explanation: 'Use a dict to track the last index of each character. When a repeat is found within the current window, jump left past the previous occurrence. This keeps the window always free of duplicates.',
          },
          {
            name: 'Minimum Size Subarray Sum', difficulty: 'Medium', lc: 209,
            code: `def minSubArrayLen(target, nums):\n    left = 0\n    total = 0\n    best = float('inf')\n    for right in range(len(nums)):\n        total += nums[right]\n        while total >= target:\n            best = min(best, right - left + 1)\n            total -= nums[left]\n            left += 1\n    return best if best != float('inf') else 0`,
            explanation: 'Expand right to grow the sum. Once sum >= target, record the window length, then shrink left to find the shortest valid window. The while loop ensures we try all valid shrinks before expanding again.',
          },
          {
            name: 'Longest Repeating Character Replacement', difficulty: 'Medium', lc: 424,
            code: `def characterReplacement(s, k):\n    counts = {}\n    left = 0\n    max_freq = 0\n    best = 0\n    for right in range(len(s)):\n        counts[s[right]] = counts.get(s[right], 0) + 1\n        max_freq = max(max_freq, counts[s[right]])\n        while (right - left + 1) - max_freq > k:\n            counts[s[left]] -= 1\n            left += 1\n        best = max(best, right - left + 1)\n    return best`,
            explanation: 'The key insight: window_size - max_freq_in_window = number of characters to replace. If that exceeds k, shrink from left. max_freq never needs to decrease — we only care about finding a larger window.',
          },
          {
            name: 'Fruit Into Baskets', difficulty: 'Medium', lc: 904,
            code: `def totalFruit(fruits):\n    basket = {}\n    left = 0\n    best = 0\n    for right, f in enumerate(fruits):\n        basket[f] = basket.get(f, 0) + 1\n        while len(basket) > 2:\n            basket[fruits[left]] -= 1\n            if basket[fruits[left]] == 0:\n                del basket[fruits[left]]\n            left += 1\n        best = max(best, right - left + 1)\n    return best`,
            explanation: 'This is "longest subarray with at most 2 distinct elements." Use a frequency map as the basket. When more than 2 types exist, shrink from left, removing fruits from the map when their count hits 0.',
          },
          {
            name: 'Max Consecutive Ones III', difficulty: 'Medium', lc: 1004,
            code: `def longestOnes(nums, k):\n    left = 0\n    zeros = 0\n    best = 0\n    for right in range(len(nums)):\n        if nums[right] == 0:\n            zeros += 1\n        while zeros > k:\n            if nums[left] == 0:\n                zeros -= 1\n            left += 1\n        best = max(best, right - left + 1)\n    return best`,
            explanation: 'Count zeros in the window. When zeros exceed k (the number of flips allowed), shrink from the left. The answer is the longest window that contains at most k zeros.',
          },
        ],
      },
      {
        title: 'Sliding Window - Monotonic Queue for Max/Min',
        slug: 'sw-monotonic-queue',
        recall: 'If you need the max or min inside a sliding window efficiently — use a monotonic deque. The deque stores indices and maintains decreasing order (for max) or increasing order (for min).',
        theory: [
          'A monotonic deque keeps candidate indices in sorted order of their values, so the front is always the current max (or min).',
          'When adding a new element, pop from the back while the new element is >= (for max-deque) or <= (for min-deque) the back element.',
          'Before using the front, check if its index is still within the window — if not, pop it from the front.',
          'This gives O(1) amortized max/min queries per step, O(n) total time.',
        ],
        template: `from collections import deque

def sliding_window_max(nums, k):
    dq = deque()  # stores indices, decreasing order of values
    result = []
    for i in range(len(nums)):
        # remove indices outside the window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # maintain decreasing order
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,
        problems: [
          {
            name: 'Sliding Window Maximum', difficulty: 'Hard', lc: 239,
            code: `from collections import deque\n\ndef maxSlidingWindow(nums, k):\n    dq = deque()  # indices in decreasing value order\n    result = []\n    for i, n in enumerate(nums):\n        while dq and dq[0] < i - k + 1:\n            dq.popleft()\n        while dq and nums[dq[-1]] <= n:\n            dq.pop()\n        dq.append(i)\n        if i >= k - 1:\n            result.append(nums[dq[0]])\n    return result`,
            explanation: 'Monotonic decreasing deque of indices. Before adding index i: (1) pop front if outside window, (2) pop from back while value <= nums[i]. The front always holds the index of the current window max.',
          },
          {
            name: 'Shortest Subarray with Sum at Least K', difficulty: 'Hard', lc: 862,
            code: `from collections import deque\n\ndef shortestSubarray(nums, k):\n    n = len(nums)\n    prefix = [0] * (n + 1)\n    for i in range(n):\n        prefix[i + 1] = prefix[i] + nums[i]\n    dq = deque()  # monotonic increasing on prefix values\n    best = float('inf')\n    for i in range(n + 1):\n        while dq and prefix[i] - prefix[dq[0]] >= k:\n            best = min(best, i - dq.popleft())\n        while dq and prefix[dq[-1]] >= prefix[i]:\n            dq.pop()\n        dq.append(i)\n    return best if best != float('inf') else -1`,
            explanation: 'Build prefix sums. Use a monotonic increasing deque on prefix values. For each i, pop from front while prefix[i] - prefix[front] >= k (valid subarray found, record length). Pop from back while prefix[back] >= prefix[i] (they can never be better starting points).',
          },
          {
            name: 'Jump Game VI', difficulty: 'Medium', lc: 1696,
            code: `from collections import deque\n\ndef maxResult(nums, k):\n    n = len(nums)\n    dp = [0] * n\n    dp[0] = nums[0]\n    dq = deque([0])  # max deque on dp values\n    for i in range(1, n):\n        while dq and dq[0] < i - k:\n            dq.popleft()\n        dp[i] = dp[dq[0]] + nums[i]\n        while dq and dp[dq[-1]] <= dp[i]:\n            dq.pop()\n        dq.append(i)\n    return dp[-1]`,
            explanation: 'DP where dp[i] = nums[i] + max(dp[i-k..i-1]). Use a monotonic decreasing deque to get the max of the last k dp values in O(1). Pop front if out of range, use front as the max, then maintain deque order when inserting.',
          },
          {
            name: 'Longest Continuous Subarray With Absolute Diff <= Limit', difficulty: 'Medium', lc: 1438,
            code: `from collections import deque\n\ndef longestSubarray(nums, limit):\n    max_dq = deque()  # decreasing\n    min_dq = deque()  # increasing\n    left = 0\n    best = 0\n    for right, n in enumerate(nums):\n        while max_dq and nums[max_dq[-1]] <= n:\n            max_dq.pop()\n        while min_dq and nums[min_dq[-1]] >= n:\n            min_dq.pop()\n        max_dq.append(right)\n        min_dq.append(right)\n        while nums[max_dq[0]] - nums[min_dq[0]] > limit:\n            left += 1\n            if max_dq[0] < left: max_dq.popleft()\n            if min_dq[0] < left: min_dq.popleft()\n        best = max(best, right - left + 1)\n    return best`,
            explanation: 'Two deques: one for max (decreasing), one for min (increasing). If max - min > limit, shrink from left and pop deque fronts that fell out of window. The answer is the longest window where the difference stays within limit.',
          },
        ],
      },
      {
        title: 'Sliding Window - Character Frequency Matching',
        slug: 'sw-char-freq',
        recall: 'If the problem involves anagrams, permutations in a string, or matching character frequencies between a window and a target — use a frequency-counting sliding window with a "matched" counter.',
        theory: [
          'Build a frequency map of the target/pattern. Maintain a frequency map of the current window.',
          'Use a "matched" or "formed" counter: increment when a character reaches its required count, decrement when it drops below.',
          'When matched == required, the window contains a valid match. Record it and try shrinking.',
          'For fixed-length pattern matching (anagrams), the window size equals the pattern length. For minimum window substring, the window is variable.',
        ],
        template: `from collections import Counter

def find_anagrams(s, p):
    need = Counter(p)
    window = {}
    required = len(need)
    matched = 0
    result = []
    for i in range(len(s)):
        ch = s[i]
        window[ch] = window.get(ch, 0) + 1
        if ch in need and window[ch] == need[ch]:
            matched += 1
        # remove left element when window exceeds pattern length
        if i >= len(p):
            left_ch = s[i - len(p)]
            if left_ch in need and window[left_ch] == need[left_ch]:
                matched -= 1
            window[left_ch] -= 1
        if matched == required:
            result.append(i - len(p) + 1)
    return result`,
        problems: [
          {
            name: 'Find All Anagrams in a String', difficulty: 'Medium', lc: 438,
            code: `from collections import Counter\n\ndef findAnagrams(s, p):\n    if len(p) > len(s): return []\n    need = Counter(p)\n    window = Counter(s[:len(p)])\n    result = []\n    if window == need: result.append(0)\n    for i in range(len(p), len(s)):\n        window[s[i]] += 1\n        left = s[i - len(p)]\n        window[left] -= 1\n        if window[left] == 0: del window[left]\n        if window == need: result.append(i - len(p) + 1)\n    return result`,
            explanation: 'Initialize a Counter for both the pattern and the first window. Slide one character at a time: add the new right char, remove the leftmost char. When the two Counters are equal, record the start index. Comparing Counters is O(26) for lowercase letters.',
          },
          {
            name: 'Permutation in String', difficulty: 'Medium', lc: 567,
            code: `from collections import Counter\n\ndef checkInclusion(s1, s2):\n    n1, n2 = len(s1), len(s2)\n    if n1 > n2: return False\n    need = Counter(s1)\n    window = Counter(s2[:n1])\n    if window == need: return True\n    for i in range(n1, n2):\n        window[s2[i]] += 1\n        left = s2[i - n1]\n        window[left] -= 1\n        if window[left] == 0: del window[left]\n        if window == need: return True\n    return False`,
            explanation: 'Same approach as Find All Anagrams but return True as soon as a single match is found. Fixed window of size len(s1) slides across s2 comparing frequency counts.',
          },
          {
            name: 'Minimum Window Substring', difficulty: 'Hard', lc: 76,
            code: `from collections import Counter\n\ndef minWindow(s, t):\n    need = Counter(t)\n    window = {}\n    required = len(need)\n    formed = 0\n    left = 0\n    best = (float('inf'), 0, 0)\n    for right in range(len(s)):\n        ch = s[right]\n        window[ch] = window.get(ch, 0) + 1\n        if ch in need and window[ch] == need[ch]:\n            formed += 1\n        while formed == required:\n            if right - left + 1 < best[0]:\n                best = (right - left + 1, left, right)\n            window[s[left]] -= 1\n            if s[left] in need and window[s[left]] < need[s[left]]:\n                formed -= 1\n            left += 1\n    return '' if best[0] == float('inf') else s[best[1]:best[2]+1]`,
            explanation: 'Variable window with frequency matching. Expand right, incrementing "formed" when a char reaches its needed count. When formed == required, try shrinking from left to minimize. Record the shortest valid window.',
          },
          {
            name: 'Longest Substring with At Most K Distinct Characters', difficulty: 'Medium', lc: 340,
            code: `def lengthOfLongestSubstringKDistinct(s, k):\n    freq = {}\n    left = 0\n    best = 0\n    for right, ch in enumerate(s):\n        freq[ch] = freq.get(ch, 0) + 1\n        while len(freq) > k:\n            freq[s[left]] -= 1\n            if freq[s[left]] == 0:\n                del freq[s[left]]\n            left += 1\n        best = max(best, right - left + 1)\n    return best`,
            explanation: 'Maintain a frequency map of window characters. When distinct count exceeds k, shrink from left, deleting entries that reach 0. The longest valid window is the answer.',
          },
          {
            name: 'Subarrays with K Different Integers', difficulty: 'Hard', lc: 992,
            code: `def subarraysWithKDistinct(nums, k):\n    def atMost(k):\n        freq = {}\n        left = 0\n        count = 0\n        for right, n in enumerate(nums):\n            freq[n] = freq.get(n, 0) + 1\n            while len(freq) > k:\n                freq[nums[left]] -= 1\n                if freq[nums[left]] == 0:\n                    del freq[nums[left]]\n                left += 1\n            count += right - left + 1\n        return count\n    return atMost(k) - atMost(k - 1)`,
            explanation: 'Exactly k distinct = atMost(k) - atMost(k-1). The atMost helper counts subarrays with at most k distinct using a variable sliding window. For each right, the number of valid subarrays ending there is (right - left + 1).',
          },
        ],
      },
    ],
  },

  /* ── Binary Search Patterns ─────────────────────────────── */
  {
    name: 'Binary Search Patterns',
    slug: 'binary-search',
    subPatterns: [
      {
        title: 'Binary Search - On Sorted Array/List',
        slug: 'bs-sorted',
        recall: 'Sorted input + find target/position → classic binary search. Use lo <= hi when you need to check every element; use lo < hi when you converge to a single answer.',
        theory: [
          'Standard binary search on a sorted array. Initialize lo = 0, hi = n - 1.',
          'Compute mid = lo + (hi - lo) // 2 to avoid integer overflow.',
          'Compare nums[mid] to target: equal → found; less → search right half; greater → search left half.',
          'Halves the search space each iteration → O(log n) time, O(1) space.',
          'Extend to 2D matrices: treat the matrix as a flat sorted array, convert index → row/col.',
          'For "search insert position", when the loop exits, lo is the correct insertion index.',
        ],
        template: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1  # or lo for insertion point`,
        problems: [
          {
            name: 'Binary Search', difficulty: 'Easy', lc: 704,
            code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
            explanation: 'Textbook binary search. Compare mid to target, halve the range. Returns index or -1.',
          },
          {
            name: 'Search Insert Position', difficulty: 'Easy', lc: 35,
            code: `def searchInsert(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo`,
            explanation: 'Same as binary search but when not found, lo points to where target would be inserted to keep the array sorted.',
          },
          {
            name: 'Search a 2D Matrix', difficulty: 'Medium', lc: 74,
            code: `def searchMatrix(matrix, target):
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        val = matrix[mid // n][mid % n]
        if val == target:
            return True
        elif val < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False`,
            explanation: 'Treat the m×n matrix as a flat sorted array of length m*n. Convert flat index to row = mid // n, col = mid % n. Then standard binary search.',
          },
          {
            name: 'Guess Number Higher or Lower', difficulty: 'Easy', lc: 374,
            code: `def guessNumber(n):
    lo, hi = 1, n
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        result = guess(mid)
        if result == 0:
            return mid
        elif result == -1:
            hi = mid - 1
        else:
            lo = mid + 1`,
            explanation: 'Binary search on [1, n]. The API guess() returns 0 (correct), -1 (lower), or 1 (higher). Halve the range based on the hint.',
          },
          {
            name: 'Search a 2D Matrix II', difficulty: 'Medium', lc: 240,
            code: `def searchMatrix(matrix, target):
    row, col = 0, len(matrix[0]) - 1
    while row < len(matrix) and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] < target:
            row += 1
        else:
            col -= 1
    return False`,
            explanation: 'Start from top-right corner. If value > target, move left. If value < target, move down. Eliminates one row or column each step → O(m + n).',
          },
          {
            name: 'Kth Missing Positive Number', difficulty: 'Easy', lc: 1539,
            code: `def findKthPositive(arr, k):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        missing = arr[mid] - (mid + 1)
        if missing < k:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo + k`,
            explanation: 'At index mid, the count of missing numbers before arr[mid] is arr[mid] - (mid + 1). Binary search for the first index where missing >= k. Answer is lo + k.',
          },
          {
            name: 'Valid Perfect Square', difficulty: 'Easy', lc: 367,
            code: `def isPerfectSquare(num):
    lo, hi = 1, num
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        sq = mid * mid
        if sq == num:
            return True
        elif sq < num:
            lo = mid + 1
        else:
            hi = mid - 1
    return False`,
            explanation: 'Binary search on [1, num]. Check if mid*mid == num. If mid² < num search right, if mid² > num search left.',
          },
          {
            name: 'Arranging Coins', difficulty: 'Easy', lc: 441,
            code: `def arrangeCoins(n):
    lo, hi = 1, n
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        total = mid * (mid + 1) // 2
        if total == n:
            return mid
        elif total < n:
            lo = mid + 1
        else:
            hi = mid - 1
    return hi`,
            explanation: 'k complete rows need k*(k+1)/2 coins. Binary search for the largest k where k*(k+1)/2 <= n. When loop ends, hi is that value.',
          },
        ],
      },
      {
        title: 'Binary Search - Find Min/Max in Rotated Sorted Array',
        slug: 'bs-rotated',
        recall: 'Rotated sorted array → one side of mid is always sorted. Check which side is sorted, then decide if target (or minimum) is in that sorted half or the other.',
        theory: [
          'A rotated sorted array has a pivot where the order breaks. Two sorted halves exist.',
          'To find the minimum: compare nums[mid] to nums[hi]. If nums[mid] > nums[hi], min is in the right half; otherwise it is in the left half (including mid).',
          'To search for a target: determine which half is sorted (nums[lo] <= nums[mid] means left is sorted), then check if target falls in the sorted range.',
          'With duplicates (LC 81, 154), when nums[lo] == nums[mid] == nums[hi], shrink both ends — worst case O(n).',
          'Time: O(log n) without duplicates. Space: O(1).',
          'Finding the pivot index lets you reduce any rotated array problem to a standard binary search on the correct half.',
        ],
        template: `# Find minimum in rotated sorted array
def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1      # min is in right half
        else:
            hi = mid           # mid could be the min
    return nums[lo]

# Search in rotated sorted array
def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:          # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                              # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
        problems: [
          {
            name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', lc: 153,
            code: `def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]`,
            explanation: 'Compare mid to hi. If nums[mid] > nums[hi], the rotation point (minimum) must be to the right of mid. Otherwise, mid itself could be the minimum, so set hi = mid. Converges to a single element.',
          },
          {
            name: 'Find Minimum in Rotated Sorted Array II', difficulty: 'Hard', lc: 154,
            code: `def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        elif nums[mid] < nums[hi]:
            hi = mid
        else:
            hi -= 1  # duplicate: shrink
    return nums[lo]`,
            explanation: 'Same as LC 153 but with duplicates. When nums[mid] == nums[hi], we cannot determine which side — safely shrink hi by 1. Worst case O(n).',
          },
          {
            name: 'Search in Rotated Sorted Array', difficulty: 'Medium', lc: 33,
            code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
            explanation: 'Determine which half is sorted. If left half is sorted (nums[lo] <= nums[mid]), check if target is in [lo, mid). If yes, search left; otherwise search right. Mirror logic for right half sorted.',
          },
          {
            name: 'Search in Rotated Sorted Array II', difficulty: 'Medium', lc: 81,
            code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return True
        if nums[lo] == nums[mid] == nums[hi]:
            lo += 1
            hi -= 1
        elif nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return False`,
            explanation: 'Handles duplicates. When lo, mid, hi all equal, shrink both ends. Otherwise same sorted-half logic as LC 33.',
          },
          {
            name: 'Find Peak Element', difficulty: 'Medium', lc: 162,
            code: `def findPeakElement(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
            explanation: 'If nums[mid] < nums[mid+1], a peak must exist to the right (since the sequence is still climbing). Otherwise a peak is at mid or to its left. Converges to a peak in O(log n).',
          },
          {
            name: 'Find the Rotation Count', difficulty: 'Medium', lc: 153,
            code: `def findRotationCount(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return lo  # index of minimum = rotation count`,
            explanation: 'The number of rotations equals the index of the minimum element. Finding the minimum index is identical to LC 153. The index itself is the answer.',
          },
        ],
      },
      {
        title: 'Binary Search - On Answer / Condition Function',
        slug: 'bs-on-answer',
        recall: 'If the problem asks "what is the minimum X such that condition is feasible?" — binary search on X. Write a feasibility checker, then find the boundary where it flips from False to True.',
        theory: [
          'Instead of searching a sorted array, binary search the answer space [minAnswer, maxAnswer].',
          'Define a monotonic feasibility function: can_do(x) that returns True/False.',
          'If minimizing: find the smallest x where can_do(x) is True → use hi = mid when feasible.',
          'If maximizing: find the largest x where can_do(x) is True → use lo = mid when feasible.',
          'Time: O(check(n) × log(range)). Space depends on the feasibility check.',
          'Common cue words: "minimum maximum", "maximum minimum", "at most K", "within D days".',
          'Always verify the monotonicity assumption: if can_do(x) is True, then can_do(x+1) is also True (for minimization problems).',
          'Typical answer ranges: [1, max(array)] for speed/capacity, [min, sum] for partitioning.',
        ],
        template: `def binary_search_on_answer(lo, hi, can_do):
    """Find minimum feasible answer."""
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_do(mid):
            hi = mid          # mid works, try smaller
        else:
            lo = mid + 1      # mid doesn't work, need bigger
    return lo

# Example: Koko Eating Bananas
def minEatingSpeed(piles, h):
    def can_finish(speed):
        return sum((p + speed - 1) // speed for p in piles) <= h
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_finish(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
        problems: [
          {
            name: 'Koko Eating Bananas', difficulty: 'Medium', lc: 875,
            code: `def minEatingSpeed(piles, h):
    def can_finish(speed):
        return sum((p + speed - 1) // speed for p in piles) <= h
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_finish(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
            explanation: 'Answer space is [1, max(piles)]. At speed mid, hours needed = sum of ceil(pile/speed). If total hours <= h, mid is feasible — try smaller. Otherwise need faster speed.',
          },
          {
            name: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', lc: 1011,
            code: `def shipWithinDays(weights, days):
    def can_ship(cap):
        d, cur = 1, 0
        for w in weights:
            if cur + w > cap:
                d += 1
                cur = 0
            cur += w
        return d <= days
    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_ship(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
            explanation: 'Min capacity is max(weights) (must fit largest package), max is sum(weights) (ship all in one day). Greedily count days needed at capacity mid. If days <= D, try smaller capacity.',
          },
          {
            name: 'Split Array Largest Sum', difficulty: 'Hard', lc: 410,
            code: `def splitArray(nums, k):
    def can_split(maxSum):
        count, cur = 1, 0
        for n in nums:
            if cur + n > maxSum:
                count += 1
                cur = 0
            cur += n
        return count <= k
    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_split(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
            explanation: 'Minimize the largest subarray sum when splitting into k parts. Binary search on the answer (max subarray sum). Greedily assign elements to partitions — if adding next element exceeds mid, start a new partition. Feasible if partitions <= k.',
          },
          {
            name: 'Minimum Number of Days to Make m Bouquets', difficulty: 'Medium', lc: 1482,
            code: `def minDays(bloomDay, m, k):
    if m * k > len(bloomDay):
        return -1
    def can_make(days):
        bouquets = flowers = 0
        for b in bloomDay:
            if b <= days:
                flowers += 1
                if flowers == k:
                    bouquets += 1
                    flowers = 0
            else:
                flowers = 0
        return bouquets >= m
    lo, hi = min(bloomDay), max(bloomDay)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_make(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
            explanation: 'Binary search on days [min, max]. At day mid, count consecutive bloomed flowers → bouquets. If we can make >= m bouquets of k flowers, try fewer days.',
          },
          {
            name: 'Magnetic Force Between Two Balls', difficulty: 'Medium', lc: 1552,
            code: `def maxDistance(position, m):
    position.sort()
    def can_place(minDist):
        count, last = 1, position[0]
        for p in position[1:]:
            if p - last >= minDist:
                count += 1
                last = p
        return count >= m
    lo, hi = 1, position[-1] - position[0]
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2   # upper-mid for maximize
        if can_place(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo`,
            explanation: 'Maximize minimum distance. Sort positions. Binary search on distance. Greedily place balls — if gap from last placed >= mid, place here. Use upper-mid (lo + (hi - lo + 1) // 2) because we maximize.',
          },
          {
            name: 'Minimum Limit of Balls in a Bag', difficulty: 'Medium', lc: 1760,
            code: `def minimumSize(nums, maxOps):
    def can_do(maxBalls):
        ops = 0
        for n in nums:
            ops += (n - 1) // maxBalls
        return ops <= maxOps
    lo, hi = 1, max(nums)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_do(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
            explanation: 'Minimize the maximum bag size. To get all bags <= mid, each bag of size n needs ceil(n/mid) - 1 = (n-1)//mid splits. If total splits <= maxOps, mid is feasible.',
          },
          {
            name: 'Nth Magical Number', difficulty: 'Hard', lc: 878,
            code: `def nthMagicalNumber(n, a, b):
    from math import gcd
    lcm = a * b // gcd(a, b)
    def count(x):
        return x // a + x // b - x // lcm
    lo, hi = 1, n * min(a, b)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if count(mid) >= n:
            hi = mid
        else:
            lo = mid + 1
    return lo % (10**9 + 7)`,
            explanation: 'A number is magical if divisible by a or b. Count of magical numbers up to x = x//a + x//b - x//lcm (inclusion-exclusion). Binary search for smallest x with count >= n.',
          },
          {
            name: 'Find the Smallest Divisor Given a Threshold', difficulty: 'Medium', lc: 1283,
            code: `def smallestDivisor(nums, threshold):
    def can_do(d):
        return sum((n + d - 1) // d for n in nums) <= threshold
    lo, hi = 1, max(nums)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_do(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
            explanation: 'At divisor mid, the sum of ceil(n/mid) for all n. If sum <= threshold, mid is feasible — try smaller. Same template as Koko Eating Bananas.',
          },
        ],
      },
      {
        title: 'Binary Search - Find First/Last Occurrence',
        slug: 'bs-first-last',
        recall: 'Need leftmost or rightmost position of a value → use bisect_left / bisect_right logic. For first: when nums[mid] >= target, go left (hi = mid). For last: when nums[mid] <= target, go right (lo = mid + 1), then subtract 1.',
        theory: [
          'bisect_left(target): find the first index where nums[i] >= target. Use hi = mid when nums[mid] >= target.',
          'bisect_right(target): find the first index where nums[i] > target. Use hi = mid when nums[mid] > target.',
          'First occurrence of target = bisect_left(target), then verify nums[result] == target.',
          'Last occurrence of target = bisect_right(target) - 1, then verify nums[result] == target.',
          'Count of target = bisect_right(target) - bisect_left(target).',
          'Time: O(log n). Two binary searches for first + last is still O(log n).',
        ],
        template: `def find_first_last(nums, target):
    def bisect_left(target):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo

    def bisect_right(target):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if nums[mid] <= target:
                lo = mid + 1
            else:
                hi = mid
        return lo

    first = bisect_left(target)
    last = bisect_right(target) - 1
    if first <= last and first < len(nums) and nums[first] == target:
        return [first, last]
    return [-1, -1]`,
        problems: [
          {
            name: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium', lc: 34,
            code: `def searchRange(nums, target):
    def bisect_left(t):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < t:
                lo = mid + 1
            else:
                hi = mid
        return lo
    def bisect_right(t):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] <= t:
                lo = mid + 1
            else:
                hi = mid
        return lo
    first = bisect_left(target)
    last = bisect_right(target) - 1
    if first <= last and first < len(nums) and nums[first] == target:
        return [first, last]
    return [-1, -1]`,
            explanation: 'Two binary searches: bisect_left finds the first index >= target, bisect_right finds the first index > target. First occurrence is bisect_left, last is bisect_right - 1. Verify the element actually equals target.',
          },
          {
            name: 'Count of Smaller Numbers After Self', difficulty: 'Hard', lc: 315,
            code: `from sortedcontainers import SortedList
def countSmaller(nums):
    sl = SortedList()
    res = []
    for n in reversed(nums):
        res.append(sl.bisect_left(n))
        sl.add(n)
    return res[::-1]`,
            explanation: 'Process from right to left. Maintain a sorted list of elements seen so far. For each number, bisect_left gives the count of elements smaller than it. SortedList gives O(log n) insert and search.',
          },
        ],
      },
      {
        title: 'Binary Search - Median and Kth of Two Sorted Arrays',
        slug: 'bs-median-kth',
        recall: 'Median of two sorted arrays → binary search on the smaller array\'s partition. Find a cut where left halves of both arrays contain exactly half the total elements, and max(left) <= min(right).',
        theory: [
          'To find the median of two sorted arrays of sizes m and n, binary search on the shorter array.',
          'Choose a partition i in nums1 (0 to m). Then j = (m + n + 1) // 2 - i ensures left halves have the right count.',
          'Valid partition: max(left1, left2) <= min(right1, right2).',
          'If left1 > right2, we took too many from nums1 → move left. If left2 > right1, too few from nums1 → move right.',
          'Edge cases: use -∞ and +∞ for out-of-bounds left and right values.',
          'Time: O(log min(m, n)). Space: O(1). This is the optimal solution.',
          'The same binary-search-on-partition idea extends to finding the Kth smallest element across two sorted arrays.',
        ],
        template: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = (m + n + 1) // 2 - i
        left1  = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i]   if i < m else float('inf')
        left2  = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j]   if j < n else float('inf')

        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 1:
                return max(left1, left2)
            return (max(left1, left2) + min(right1, right2)) / 2
        elif left1 > right2:
            hi = i - 1
        else:
            lo = i + 1`,
        problems: [
          {
            name: 'Median of Two Sorted Arrays', difficulty: 'Hard', lc: 4,
            code: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = (m + n + 1) // 2 - i
        l1 = nums1[i-1] if i > 0 else float('-inf')
        r1 = nums1[i]   if i < m else float('inf')
        l2 = nums2[j-1] if j > 0 else float('-inf')
        r2 = nums2[j]   if j < n else float('inf')
        if l1 <= r2 and l2 <= r1:
            if (m + n) % 2:
                return max(l1, l2)
            return (max(l1, l2) + min(r1, r2)) / 2
        elif l1 > r2:
            hi = i - 1
        else:
            lo = i + 1`,
            explanation: 'Binary search on the partition of the smaller array. Choose cut i in nums1, then j = half - i ensures left sides have half the elements. Valid when max(lefts) <= min(rights). For odd total, median is max(left); for even, average of max(left) and min(right).',
          },
          {
            name: 'Kth Smallest Element in a Sorted Matrix', difficulty: 'Medium', lc: 378,
            code: `def kthSmallest(matrix, k):
    n = len(matrix)
    lo, hi = matrix[0][0], matrix[-1][-1]
    while lo < hi:
        mid = lo + (hi - lo) // 2
        count = 0
        j = n - 1
        for i in range(n):
            while j >= 0 and matrix[i][j] > mid:
                j -= 1
            count += j + 1
        if count >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
            explanation: 'Binary search on value [min, max]. For each mid, count elements <= mid by walking the staircase from bottom-left of each row. If count >= k, answer is <= mid. Converge to the exact kth value.',
          },
          {
            name: 'Find K-th Smallest Pair Distance', difficulty: 'Hard', lc: 719,
            code: `def smallestDistancePair(nums, k):
    nums.sort()
    lo, hi = 0, nums[-1] - nums[0]
    while lo < hi:
        mid = lo + (hi - lo) // 2
        count = left = 0
        for right in range(len(nums)):
            while nums[right] - nums[left] > mid:
                left += 1
            count += right - left
        if count >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
            explanation: 'Binary search on distance [0, max-min]. For each mid, count pairs with distance <= mid using a sliding window on the sorted array. If count >= k, try smaller distance.',
          },
          {
            name: 'Find K Closest Elements', difficulty: 'Medium', lc: 658,
            code: `def findClosestElements(arr, k, x):
    lo, hi = 0, len(arr) - k
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if x - arr[mid] > arr[mid + k] - x:
            lo = mid + 1
        else:
            hi = mid
    return arr[lo:lo + k]`,
            explanation: 'Binary search for the starting index of the k-length window. Compare distances from x to the left edge (arr[mid]) and right edge (arr[mid+k]). If left is farther, shift window right.',
          },
        ],
      },
    ],
  },

  /* ── Stack Patterns ─────────────────────────────────────── */
  {
    name: 'Stack Patterns',
    slug: 'stack',
    subPatterns: [
      {
        title: 'Stack - Matching Brackets / Parentheses',
        slug: 'st-brackets',
        theory: [
          'Push opening brackets onto the stack. On closing bracket, pop and check if it matches.',
          'If the stack is empty when popping, or non-empty at the end — invalid.',
          'Extend to multi-character tokens (e.g., HTML tags) by storing full tokens on the stack.',
          'Time: O(n), Space: O(n) worst case.',
        ],
        template: `def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
        else:
            stack.append(ch)
    return len(stack) == 0`,
        problems: [
          { name: 'Valid Parentheses', difficulty: 'Easy', lc: 20 },
          { name: 'Generate Parentheses', difficulty: 'Medium', lc: 22 },
          { name: 'Minimum Remove to Make Valid Parentheses', difficulty: 'Medium', lc: 1249 },
          { name: 'Longest Valid Parentheses', difficulty: 'Hard', lc: 32 },
          { name: 'Remove Outermost Parentheses', difficulty: 'Easy', lc: 1021 },
        ],
      },
      {
        title: 'Stack - Monotonic Stack (Next Greater / Smaller)',
        slug: 'st-monotonic',
        theory: [
          'Maintain a stack in increasing (or decreasing) order.',
          'For "next greater element": pop elements smaller than current, they found their answer.',
          'For "next smaller element": pop elements greater than current.',
          'Time: O(n) — each element is pushed and popped at most once.',
        ],
        template: `def next_greater_element(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices
    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    return result`,
        problems: [
          { name: 'Daily Temperatures', difficulty: 'Medium', lc: 739 },
          { name: 'Next Greater Element I', difficulty: 'Easy', lc: 496 },
          { name: 'Largest Rectangle in Histogram', difficulty: 'Hard', lc: 84 },
          { name: 'Trapping Rain Water', difficulty: 'Hard', lc: 42 },
          { name: 'Online Stock Span', difficulty: 'Medium', lc: 901 },
        ],
      },
      {
        title: 'Stack - Expression Evaluation',
        slug: 'st-expression',
        theory: [
          'Use a stack of numbers. When you see an operator, pop operands, compute, push result.',
          'For infix: convert to postfix first, or handle precedence with two stacks.',
          'Reverse Polish Notation (postfix) is naturally stack-friendly.',
          'Handle unary minus and multi-digit numbers carefully during parsing.',
        ],
        template: `def eval_rpn(tokens):
    stack = []
    ops = {'+': lambda a, b: a + b,
           '-': lambda a, b: a - b,
           '*': lambda a, b: a * b,
           '/': lambda a, b: int(a / b)}
    for token in tokens:
        if token in ops:
            b, a = stack.pop(), stack.pop()
            stack.append(ops[token](a, b))
        else:
            stack.append(int(token))
    return stack[0]`,
        problems: [
          { name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', lc: 150 },
          { name: 'Basic Calculator', difficulty: 'Hard', lc: 224 },
          { name: 'Basic Calculator II', difficulty: 'Medium', lc: 227 },
          { name: 'Min Stack', difficulty: 'Medium', lc: 155 },
          { name: 'Decode String', difficulty: 'Medium', lc: 394 },
        ],
      },
    ],
  },

  /* ── Linked List Patterns ───────────────────────────────── */
  {
    name: 'Linked List Patterns',
    slug: 'linked-list',
    subPatterns: [
      {
        title: 'Linked List - In-place Reversal',
        slug: 'll-reversal',
        theory: [
          'Use three pointers: prev, curr, next. Redirect curr.next to prev each step.',
          'To reverse a sub-list: note the node before and after the sub-list, reverse the middle, reconnect.',
          'Dummy node simplifies edge cases where head changes.',
          'Time: O(n), Space: O(1).',
        ],
        template: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

def reverse_between(head, left, right):
    dummy = ListNode(0, head)
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    curr = prev.next
    for _ in range(right - left):
        nxt = curr.next
        curr.next = nxt.next
        nxt.next = prev.next
        prev.next = nxt
    return dummy.next`,
        problems: [
          { name: 'Reverse Linked List', difficulty: 'Easy', lc: 206 },
          { name: 'Reverse Linked List II', difficulty: 'Medium', lc: 92 },
          { name: 'Palindrome Linked List', difficulty: 'Easy', lc: 234 },
          { name: 'Swap Nodes in Pairs', difficulty: 'Medium', lc: 24 },
          { name: 'Reverse Nodes in k-Group', difficulty: 'Hard', lc: 25 },
        ],
      },
      {
        title: 'Linked List - Merge / Sorted Operations',
        slug: 'll-merge',
        theory: [
          'Use a dummy node and a tail pointer. Compare heads of two lists, link the smaller one.',
          'For K sorted lists: use a min-heap of (value, list_index) to pick the next node.',
          'Merge sort on a linked list: find middle (fast/slow), split, recurse, merge.',
          'Time: O(n) for two lists, O(n log k) for k lists.',
        ],
        template: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next`,
        problems: [
          { name: 'Merge Two Sorted Lists', difficulty: 'Easy', lc: 21 },
          { name: 'Merge K Sorted Lists', difficulty: 'Hard', lc: 23 },
          { name: 'Sort List', difficulty: 'Medium', lc: 148 },
          { name: 'Insertion Sort List', difficulty: 'Medium', lc: 147 },
          { name: 'Add Two Numbers', difficulty: 'Medium', lc: 2 },
        ],
      },
    ],
  },

  /* ── Tree Patterns ──────────────────────────────────────── */
  {
    name: 'Tree Patterns',
    slug: 'trees',
    subPatterns: [
      {
        title: 'Tree - DFS (Pre/In/Post Order)',
        slug: 'tree-dfs',
        theory: [
          'Preorder: process node, then left, then right. Good for serialization.',
          'Inorder: left, node, right. Gives sorted order for BSTs.',
          'Postorder: left, right, node. Good for computing sizes / heights (bottom-up).',
          'Recursive implementation is simplest. Iterative uses an explicit stack.',
        ],
        template: `def dfs(node):
    if not node:
        return base_case
    left = dfs(node.left)
    right = dfs(node.right)
    # combine results (postorder logic)
    return combine(left, right, node.val)

# Iterative preorder
def preorder(root):
    if not root: return []
    stack, result = [root], []
    while stack:
        node = stack.pop()
        result.append(node.val)
        if node.right: stack.append(node.right)
        if node.left: stack.append(node.left)
    return result`,
        problems: [
          { name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', lc: 104 },
          { name: 'Invert Binary Tree', difficulty: 'Easy', lc: 226 },
          { name: 'Path Sum', difficulty: 'Easy', lc: 112 },
          { name: 'Diameter of Binary Tree', difficulty: 'Easy', lc: 543 },
          { name: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', lc: 124 },
        ],
      },
      {
        title: 'Tree - BFS (Level Order)',
        slug: 'tree-bfs',
        theory: [
          'Use a queue. Process all nodes at the current level before moving to the next.',
          'Track level size at the start of each iteration: level_size = len(queue).',
          'Useful for level order output, zigzag, right side view, minimum depth.',
          'Time: O(n), Space: O(w) where w is the max width of the tree.',
        ],
        template: `from collections import deque

def level_order(root):
    if not root: return []
    queue = deque([root])
    result = []
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`,
        problems: [
          { name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', lc: 102 },
          { name: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', lc: 103 },
          { name: 'Binary Tree Right Side View', difficulty: 'Medium', lc: 199 },
          { name: 'Minimum Depth of Binary Tree', difficulty: 'Easy', lc: 111 },
          { name: 'Average of Levels in Binary Tree', difficulty: 'Easy', lc: 637 },
        ],
      },
      {
        title: 'Tree - BST Properties',
        slug: 'tree-bst',
        theory: [
          'Left subtree values < node < right subtree values.',
          'Inorder traversal of a BST gives sorted order — use this to validate or find kth element.',
          'Search / insert / delete: O(h) where h = log n for balanced, n for skewed.',
          'Pass min/max bounds down during validation to check BST property.',
        ],
        template: `def is_valid_bst(node, lo=float('-inf'), hi=float('inf')):
    if not node:
        return True
    if node.val <= lo or node.val >= hi:
        return False
    return (is_valid_bst(node.left, lo, node.val) and
            is_valid_bst(node.right, node.val, hi))

def kth_smallest(root, k):
    stack = []
    curr = root
    while stack or curr:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val
        curr = curr.right`,
        problems: [
          { name: 'Validate Binary Search Tree', difficulty: 'Medium', lc: 98 },
          { name: 'Kth Smallest Element in a BST', difficulty: 'Medium', lc: 230 },
          { name: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', lc: 235 },
          { name: 'Convert Sorted Array to BST', difficulty: 'Easy', lc: 108 },
          { name: 'Delete Node in a BST', difficulty: 'Medium', lc: 450 },
        ],
      },
    ],
  },

  /* ── Graph Patterns ─────────────────────────────────────── */
  {
    name: 'Graph Patterns',
    slug: 'graphs',
    subPatterns: [
      {
        title: 'Graph - BFS (Shortest Path Unweighted)',
        slug: 'graph-bfs',
        theory: [
          'BFS explores nodes level by level — first time you reach a node is the shortest path.',
          'Use a queue and a visited set. Process all neighbors before going deeper.',
          'Multi-source BFS: add all sources to the queue initially for "distance from nearest source".',
          'Time: O(V + E), Space: O(V).',
        ],
        template: `from collections import deque

def bfs_shortest_path(graph, start, end):
    queue = deque([(start, 0)])
    visited = {start}
    while queue:
        node, dist = queue.popleft()
        if node == end:
            return dist
        for nei in graph[node]:
            if nei not in visited:
                visited.add(nei)
                queue.append((nei, dist + 1))
    return -1`,
        problems: [
          { name: 'Number of Islands', difficulty: 'Medium', lc: 200 },
          { name: 'Word Ladder', difficulty: 'Hard', lc: 127 },
          { name: 'Rotting Oranges', difficulty: 'Medium', lc: 994 },
          { name: 'Shortest Path in Binary Matrix', difficulty: 'Medium', lc: 1091 },
          { name: 'Open the Lock', difficulty: 'Medium', lc: 752 },
        ],
      },
      {
        title: 'Graph - DFS (Connected Components / Cycle Detection)',
        slug: 'graph-dfs',
        theory: [
          'DFS explores as deep as possible before backtracking.',
          'For connected components: run DFS from every unvisited node, count starts.',
          'Cycle detection (directed): track recursion stack. If you revisit a node in the current path — cycle.',
          'Cycle detection (undirected): if you visit an already-visited node that is not the parent — cycle.',
        ],
        template: `def count_components(n, edges):
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    visited = set()
    count = 0
    def dfs(node):
        visited.add(node)
        for nei in graph[node]:
            if nei not in visited:
                dfs(nei)
    for i in range(n):
        if i not in visited:
            dfs(i)
            count += 1
    return count`,
        problems: [
          { name: 'Number of Connected Components in an Undirected Graph', difficulty: 'Medium', lc: 323 },
          { name: 'Course Schedule', difficulty: 'Medium', lc: 207 },
          { name: 'Clone Graph', difficulty: 'Medium', lc: 133 },
          { name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', lc: 417 },
          { name: 'Surrounded Regions', difficulty: 'Medium', lc: 130 },
        ],
      },
      {
        title: 'Graph - Topological Sort',
        slug: 'graph-topo',
        theory: [
          'Only works on DAGs (Directed Acyclic Graphs).',
          'Kahn\'s algorithm (BFS): process nodes with in-degree 0, reduce neighbors\' in-degree.',
          'DFS variant: add node to result in postorder (after all descendants), then reverse.',
          'If result length < number of nodes — cycle exists.',
        ],
        template: `from collections import deque

def topo_sort(num_nodes, edges):
    graph = {i: [] for i in range(num_nodes)}
    in_degree = {i: 0 for i in range(num_nodes)}
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    queue = deque([n for n in in_degree if in_degree[n] == 0])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nei in graph[node]:
            in_degree[nei] -= 1
            if in_degree[nei] == 0:
                queue.append(nei)
    return order if len(order) == num_nodes else []`,
        problems: [
          { name: 'Course Schedule', difficulty: 'Medium', lc: 207 },
          { name: 'Course Schedule II', difficulty: 'Medium', lc: 210 },
          { name: 'Alien Dictionary', difficulty: 'Hard', lc: 269 },
          { name: 'Minimum Height Trees', difficulty: 'Medium', lc: 310 },
          { name: 'Sequence Reconstruction', difficulty: 'Medium', lc: 444 },
        ],
      },
      {
        title: 'Graph - Union Find (Disjoint Set)',
        slug: 'graph-union-find',
        theory: [
          'Track connected components with parent[] and rank[] arrays.',
          'find(x): follow parent pointers to root, with path compression.',
          'union(x, y): merge two sets by connecting roots. Use union by rank to keep trees flat.',
          'Near O(1) amortized per operation with both optimizations.',
        ],
        template: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        self.components -= 1
        return True`,
        problems: [
          { name: 'Number of Provinces', difficulty: 'Medium', lc: 547 },
          { name: 'Redundant Connection', difficulty: 'Medium', lc: 684 },
          { name: 'Accounts Merge', difficulty: 'Medium', lc: 721 },
          { name: 'Longest Consecutive Sequence', difficulty: 'Medium', lc: 128 },
          { name: 'Graph Valid Tree', difficulty: 'Medium', lc: 261 },
        ],
      },
    ],
  },

  /* ── Dynamic Programming Patterns ───────────────────────── */
  {
    name: 'Dynamic Programming Patterns',
    slug: 'dynamic-programming',
    subPatterns: [
      {
        title: 'DP - Fibonacci Pattern (Linear Recurrence)',
        slug: 'dp-fib',
        theory: [
          'dp[i] depends on dp[i-1] and dp[i-2] (or a small fixed window of previous states).',
          'Can often optimize space from O(n) to O(1) by tracking only the last 2-3 values.',
          'Climb stairs, house robber, min cost climbing stairs all follow this pattern.',
          'Always start by defining what dp[i] represents clearly.',
        ],
        template: `def climb_stairs(n):
    if n <= 2: return n
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1

def house_robber(nums):
    prev2, prev1 = 0, 0
    for num in nums:
        curr = max(prev1, prev2 + num)
        prev2 = prev1
        prev1 = curr
    return prev1`,
        problems: [
          { name: 'Climbing Stairs', difficulty: 'Easy', lc: 70 },
          { name: 'House Robber', difficulty: 'Medium', lc: 198 },
          { name: 'House Robber II', difficulty: 'Medium', lc: 213 },
          { name: 'Min Cost Climbing Stairs', difficulty: 'Easy', lc: 746 },
          { name: 'Decode Ways', difficulty: 'Medium', lc: 91 },
        ],
      },
      {
        title: 'DP - Knapsack / Subset Sum',
        slug: 'dp-knapsack',
        theory: [
          'Classic 0/1 knapsack: for each item, decide to include or exclude.',
          'dp[i][w] = max value using first i items with capacity w.',
          'Subset sum variant: dp[i] = True if sum i is achievable.',
          'Space optimization: iterate capacity in reverse for 1D DP.',
        ],
        template: `def can_partition(nums):
    total = sum(nums)
    if total % 2: return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]

def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
        problems: [
          { name: 'Partition Equal Subset Sum', difficulty: 'Medium', lc: 416 },
          { name: 'Coin Change', difficulty: 'Medium', lc: 322 },
          { name: 'Coin Change II', difficulty: 'Medium', lc: 518 },
          { name: 'Target Sum', difficulty: 'Medium', lc: 494 },
          { name: 'Last Stone Weight II', difficulty: 'Medium', lc: 1049 },
        ],
      },
      {
        title: 'DP - Longest Common Subsequence / String DP',
        slug: 'dp-lcs',
        theory: [
          'Compare two sequences with a 2D table. dp[i][j] = answer for s1[:i] and s2[:j].',
          'If characters match: dp[i][j] = dp[i-1][j-1] + 1.',
          'If not: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) for LCS.',
          'Edit distance adds insert/delete/replace transitions.',
        ],
        template: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
        problems: [
          { name: 'Longest Common Subsequence', difficulty: 'Medium', lc: 1143 },
          { name: 'Edit Distance', difficulty: 'Medium', lc: 72 },
          { name: 'Distinct Subsequences', difficulty: 'Hard', lc: 115 },
          { name: 'Shortest Common Supersequence', difficulty: 'Hard', lc: 1092 },
          { name: 'Interleaving String', difficulty: 'Medium', lc: 97 },
        ],
      },
      {
        title: 'DP - Longest Increasing Subsequence (LIS)',
        slug: 'dp-lis',
        theory: [
          'dp[i] = length of LIS ending at index i. For each j < i, if nums[j] < nums[i]: dp[i] = max(dp[i], dp[j]+1).',
          'O(n²) basic DP. O(n log n) with patience sorting (maintain tails array + binary search).',
          'Variations: longest non-decreasing, longest chain, Russian doll envelopes.',
          'Can reconstruct the sequence by tracking parent pointers.',
        ],
        template: `import bisect

def length_of_lis(nums):
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)`,
        problems: [
          { name: 'Longest Increasing Subsequence', difficulty: 'Medium', lc: 300 },
          { name: 'Number of Longest Increasing Subsequence', difficulty: 'Medium', lc: 673 },
          { name: 'Russian Doll Envelopes', difficulty: 'Hard', lc: 354 },
          { name: 'Maximum Length of Pair Chain', difficulty: 'Medium', lc: 646 },
          { name: 'Longest String Chain', difficulty: 'Medium', lc: 1048 },
        ],
      },
      {
        title: 'DP - Grid Paths',
        slug: 'dp-grid',
        theory: [
          'dp[i][j] = ways/cost to reach cell (i,j). Transition from dp[i-1][j] and dp[i][j-1].',
          'Initialize first row and first column as base cases.',
          'For obstacles: set dp[i][j] = 0 if cell is blocked.',
          'Space optimization: use a single row and overwrite in place.',
        ],
        template: `def unique_paths(m, n):
    dp = [1] * n
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[-1]

def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0: continue
            elif i == 0: grid[i][j] += grid[i][j-1]
            elif j == 0: grid[i][j] += grid[i-1][j]
            else: grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    return grid[-1][-1]`,
        problems: [
          { name: 'Unique Paths', difficulty: 'Medium', lc: 62 },
          { name: 'Unique Paths II', difficulty: 'Medium', lc: 63 },
          { name: 'Minimum Path Sum', difficulty: 'Medium', lc: 64 },
          { name: 'Triangle', difficulty: 'Medium', lc: 120 },
          { name: 'Maximal Square', difficulty: 'Medium', lc: 221 },
        ],
      },
    ],
  },

  /* ── Backtracking Patterns ──────────────────────────────── */
  {
    name: 'Backtracking Patterns',
    slug: 'backtracking',
    subPatterns: [
      {
        title: 'Backtracking - Subsets / Combinations',
        slug: 'bt-subsets',
        theory: [
          'For each element, decide to include it or not — generates all subsets.',
          'For combinations of size k: only recurse until path has k elements.',
          'To avoid duplicates with duplicate input: sort first, skip equal adjacent element at same level.',
          'Time: O(2^n) for subsets, O(C(n,k)) for combinations.',
        ],
        template: `def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result

def combine(n, k):
    result = []
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
    backtrack(1, [])
    return result`,
        problems: [
          { name: 'Subsets', difficulty: 'Medium', lc: 78 },
          { name: 'Subsets II', difficulty: 'Medium', lc: 90 },
          { name: 'Combinations', difficulty: 'Medium', lc: 77 },
          { name: 'Combination Sum', difficulty: 'Medium', lc: 39 },
          { name: 'Combination Sum II', difficulty: 'Medium', lc: 40 },
        ],
      },
      {
        title: 'Backtracking - Permutations',
        slug: 'bt-permutations',
        theory: [
          'Every element must appear exactly once. Use a visited set or swap-based approach.',
          'For duplicates: sort first, only pick an element if the previous duplicate was used in this path.',
          'Number of permutations: n! — grows fast, prune whenever possible.',
          'Swap-based: swap element into current position, recurse, swap back.',
        ],
        template: `def permutations(nums):
    result = []
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack(path, used)
            path.pop()
            used[i] = False
    backtrack([], [False] * len(nums))
    return result`,
        problems: [
          { name: 'Permutations', difficulty: 'Medium', lc: 46 },
          { name: 'Permutations II', difficulty: 'Medium', lc: 47 },
          { name: 'Next Permutation', difficulty: 'Medium', lc: 31 },
          { name: 'Permutation Sequence', difficulty: 'Hard', lc: 60 },
          { name: 'Letter Combinations of a Phone Number', difficulty: 'Medium', lc: 17 },
        ],
      },
      {
        title: 'Backtracking - Grid / Board Search',
        slug: 'bt-grid',
        theory: [
          'DFS from each cell. Mark visited to avoid revisiting in the current path.',
          'Unmark (backtrack) when returning so other paths can use the cell.',
          'Prune by checking bounds, visited status, and character match before recursing.',
          'Time: O(m * n * 4^L) for word search of length L on an m × n board.',
        ],
        template: `def word_search(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if (r < 0 or r >= rows or c < 0 or c >= cols
                or board[r][c] != word[idx]):
            return False
        temp = board[r][c]
        board[r][c] = '#'  # mark visited
        found = (dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1)
                 or dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1))
        board[r][c] = temp  # backtrack
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False`,
        problems: [
          { name: 'Word Search', difficulty: 'Medium', lc: 79 },
          { name: 'Word Search II', difficulty: 'Hard', lc: 212 },
          { name: 'N-Queens', difficulty: 'Hard', lc: 51 },
          { name: 'Sudoku Solver', difficulty: 'Hard', lc: 37 },
          { name: 'Palindrome Partitioning', difficulty: 'Medium', lc: 131 },
        ],
      },
    ],
  },

  /* ── Heap Patterns ──────────────────────────────────────── */
  {
    name: 'Heap / Priority Queue Patterns',
    slug: 'heap',
    subPatterns: [
      {
        title: 'Heap - Top K Elements',
        slug: 'heap-topk',
        theory: [
          'To find the K largest: use a min-heap of size K. Push every element, pop when size > K.',
          'To find the K smallest: use a max-heap (negate values in Python) of size K.',
          'Alternative: quickselect for O(n) average but O(n²) worst case.',
          'Heap of size K: O(n log K) total, better than sorting O(n log n) when K << n.',
        ],
        template: `import heapq

def top_k_frequent(nums, k):
    freq = {}
    for n in nums:
        freq[n] = freq.get(n, 0) + 1
    # min-heap by frequency, pop smallest when size > k
    heap = []
    for num, count in freq.items():
        heapq.heappush(heap, (count, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [x[1] for x in heap]`,
        problems: [
          { name: 'Kth Largest Element in an Array', difficulty: 'Medium', lc: 215 },
          { name: 'Top K Frequent Elements', difficulty: 'Medium', lc: 347 },
          { name: 'K Closest Points to Origin', difficulty: 'Medium', lc: 973 },
          { name: 'Kth Largest Element in a Stream', difficulty: 'Easy', lc: 703 },
          { name: 'Sort Characters By Frequency', difficulty: 'Medium', lc: 451 },
        ],
      },
      {
        title: 'Heap - Two Heaps (Median Tracking)',
        slug: 'heap-two',
        theory: [
          'Maintain a max-heap for the lower half and a min-heap for the upper half.',
          'After each insertion, rebalance so sizes differ by at most 1.',
          'Median is the top of the larger heap (or average of both tops if equal size).',
          'Insert: O(log n). Get median: O(1).',
        ],
        template: `import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negate values)
        self.hi = []  # min-heap

    def addNum(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
        problems: [
          { name: 'Find Median from Data Stream', difficulty: 'Hard', lc: 295 },
          { name: 'Sliding Window Median', difficulty: 'Hard', lc: 480 },
          { name: 'IPO', difficulty: 'Hard', lc: 502 },
          { name: 'Merge K Sorted Lists', difficulty: 'Hard', lc: 23 },
          { name: 'Task Scheduler', difficulty: 'Medium', lc: 621 },
        ],
      },
    ],
  },

  /* ── Trie Patterns ──────────────────────────────────────── */
  {
    name: 'Trie Patterns',
    slug: 'trie',
    subPatterns: [
      {
        title: 'Trie - Prefix Matching',
        slug: 'trie-prefix',
        theory: [
          'Each node has a dictionary of children and an is_end flag.',
          'Insert: walk the tree, create nodes as needed, mark end.',
          'Search: walk the tree, return is_end at the final node.',
          'Prefix search: like search but return True if final node exists (don\'t check is_end).',
        ],
        template: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find(prefix) is not None

    def _find(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node`,
        problems: [
          { name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', lc: 208 },
          { name: 'Design Add and Search Words Data Structure', difficulty: 'Medium', lc: 211 },
          { name: 'Word Search II', difficulty: 'Hard', lc: 212 },
          { name: 'Replace Words', difficulty: 'Medium', lc: 648 },
          { name: 'Longest Word in Dictionary', difficulty: 'Medium', lc: 720 },
        ],
      },
    ],
  },

  /* ── Greedy Patterns ────────────────────────────────────── */
  {
    name: 'Greedy Patterns',
    slug: 'greedy',
    subPatterns: [
      {
        title: 'Greedy - Interval Scheduling',
        slug: 'greedy-interval',
        theory: [
          'Sort intervals by end time. Greedily pick the earliest-finishing non-overlapping interval.',
          'For "minimum rooms / resources": sort by start, use a min-heap of end times.',
          'For "merge intervals": sort by start, extend or create new merged interval.',
          'Exchange argument proves greedy is optimal here.',
        ],
        template: `def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[1])
    count = 0
    end = float('-inf')
    for s, e in intervals:
        if s >= end:
            end = e
        else:
            count += 1  # remove this interval
    return count

def merge_intervals(intervals):
    intervals.sort()
    merged = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    return merged`,
        problems: [
          { name: 'Merge Intervals', difficulty: 'Medium', lc: 56 },
          { name: 'Non-overlapping Intervals', difficulty: 'Medium', lc: 435 },
          { name: 'Insert Interval', difficulty: 'Medium', lc: 57 },
          { name: 'Meeting Rooms II', difficulty: 'Medium', lc: 253 },
          { name: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'Medium', lc: 452 },
        ],
      },
      {
        title: 'Greedy - Kadane\'s / Jump Game',
        slug: 'greedy-kadane',
        theory: [
          'Kadane\'s algorithm: track a running sum. Reset to 0 (or current element) when it goes negative.',
          'Jump game: track the farthest reachable index. If current index > farthest — can\'t reach.',
          'Jump game II: BFS levels — track the farthest you can reach from the current "level" of jumps.',
          'These are greedy because the locally optimal choice (take the best option now) is globally optimal.',
        ],
        template: `def max_subarray(nums):
    max_sum = curr_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum

def can_jump(nums):
    farthest = 0
    for i in range(len(nums)):
        if i > farthest:
            return False
        farthest = max(farthest, i + nums[i])
    return True`,
        problems: [
          { name: 'Maximum Subarray', difficulty: 'Medium', lc: 53 },
          { name: 'Jump Game', difficulty: 'Medium', lc: 55 },
          { name: 'Jump Game II', difficulty: 'Medium', lc: 45 },
          { name: 'Gas Station', difficulty: 'Medium', lc: 134 },
          { name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', lc: 121 },
        ],
      },
    ],
  },

  /* ── Bit Manipulation Patterns ──────────────────────────── */
  {
    name: 'Bit Manipulation Patterns',
    slug: 'bit-manipulation',
    subPatterns: [
      {
        title: 'Bit Manipulation - XOR Tricks',
        slug: 'bit-xor',
        theory: [
          'a ^ a = 0, a ^ 0 = a. XOR of all elements cancels pairs — the unpaired element remains.',
          'To find two unique numbers: XOR all, get a diff bit, partition into two groups by that bit.',
          'XOR is its own inverse: if c = a ^ b, then a = c ^ b.',
          'Useful for finding missing/duplicate numbers without extra space.',
        ],
        template: `def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

def missing_number(nums):
    n = len(nums)
    result = n
    for i in range(n):
        result ^= i ^ nums[i]
    return result`,
        problems: [
          { name: 'Single Number', difficulty: 'Easy', lc: 136 },
          { name: 'Single Number II', difficulty: 'Medium', lc: 137 },
          { name: 'Missing Number', difficulty: 'Easy', lc: 268 },
          { name: 'Complement of Base 10 Integer', difficulty: 'Easy', lc: 1009 },
          { name: 'Sum of Two Integers', difficulty: 'Medium', lc: 371 },
        ],
      },
    ],
  },

  /* ── Hashing Patterns ───────────────────────────────────── */
  {
    name: 'Hashing Patterns',
    slug: 'hashing',
    subPatterns: [
      {
        title: 'Hashing - Frequency Count / Grouping',
        slug: 'hash-freq',
        theory: [
          'Count occurrences with a hash map (Counter in Python). O(1) lookup per element.',
          'Group elements by a computed key (e.g., sorted string for anagrams).',
          'Two Sum pattern: for each element, check if complement exists in the map.',
          'Prefix sum + hash map: count subarrays with a given sum in O(n).',
        ],
        template: `from collections import Counter, defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())

def subarray_sum(nums, k):
    prefix = {0: 1}
    total = count = 0
    for num in nums:
        total += num
        count += prefix.get(total - k, 0)
        prefix[total] = prefix.get(total, 0) + 1
    return count`,
        problems: [
          { name: 'Two Sum', difficulty: 'Easy', lc: 1 },
          { name: 'Group Anagrams', difficulty: 'Medium', lc: 49 },
          { name: 'Subarray Sum Equals K', difficulty: 'Medium', lc: 560 },
          { name: 'Top K Frequent Elements', difficulty: 'Medium', lc: 347 },
          { name: 'Longest Consecutive Sequence', difficulty: 'Medium', lc: 128 },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const diffColor: Record<string, string> = {
  Easy: 'text-green-600',
  Medium: 'text-yellow-600',
  Hard: 'text-red-600',
};

function lcSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function DSAPatterns() {
  const [activeCategory, setActiveCategory] = useState(categories[0].slug);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeData = categories.find((c) => c.slug === activeCategory) || categories[0];

  // Scroll to top of main content when category changes
  useEffect(() => {
    document.getElementById('main-content')?.scrollTo(0, 0);
  }, [activeCategory]);

  return (
    <div className="bg-white min-h-screen pt-14">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside
          className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/20 -z-10"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="p-4">
            <h2 className="text-sm font-bold text-gray-900 mb-3">DSA Patterns</h2>

            <nav className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeCategory === cat.slug
                      ? 'bg-gray-900 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{cat.name}</span>
                    <span className={`text-xs flex-shrink-0 ml-2 ${
                      activeCategory === cat.slug ? 'text-gray-300' : 'text-gray-400'
                    }`}>
                      {cat.subPatterns.length}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main Content ────────────────────────────────── */}
        <main id="main-content" className="flex-1 min-w-0 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            {/* Category header */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{activeData.name}</h1>
              <p className="text-base text-gray-500">
                {activeData.subPatterns.length} patterns
              </p>
            </div>

            {/* Sub-patterns */}
            <div className="space-y-10">
              {activeData.subPatterns.map((sp) => (
                  <section
                    key={sp.slug}
                    id={sp.slug}
                    className="border border-gray-200 rounded-xl scroll-mt-20"
                  >
                    {/* Header */}
                    <div className="px-5 sm:px-6 py-5">
                      <h2 className="text-xl font-bold text-gray-900">{sp.title}</h2>
                      <p className="text-sm text-gray-400 mt-1">{sp.problems.length} problems</p>
                    </div>

                      <div className="px-5 sm:px-6 pb-6 border-t border-gray-100">
                        {/* How to Recall */}
                        {sp.recall && (
                          <div className="mt-5 mb-5 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h3 className="text-sm font-semibold text-blue-900 mb-1">How to Recall This Pattern</h3>
                            <p className="text-sm text-blue-800 leading-relaxed">{sp.recall}</p>
                          </div>
                        )}

                        {/* Visual Diagram */}
                        {patternDiagrams[sp.slug] && (
                          <div className="mt-5 mb-5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Visual Diagram</h3>
                            <div className="flex justify-center">
                              {patternDiagrams[sp.slug]}
                            </div>
                          </div>
                        )}

                        {/* Theory */}
                        <div className="mt-5 mb-5">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">Theory</h3>
                          <ul className="space-y-2">
                            {sp.theory.map((point, i) => (
                              <li key={i} className="text-base text-gray-700 flex gap-2.5 leading-relaxed">
                                <span className="text-gray-300 select-none mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Code Template */}
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">Code Template</h3>
                          <div className="rounded-lg overflow-hidden">
                            <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between">
                              <span className="text-xs text-gray-400 font-mono">Python</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(sp.template)}
                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                            <SyntaxHighlighter
                              language="python"
                              style={vscDarkPlus}
                              customStyle={{ margin: 0, padding: '0.5rem 1rem 1rem', fontSize: '0.875rem', lineHeight: '1.625', background: '#1e1e1e' }}
                              wrapLongLines
                            >
                              {sp.template}
                            </SyntaxHighlighter>
                          </div>
                        </div>

                        {/* Problems */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Practice Problems ({sp.problems.length})
                          </h3>
                          <div className="space-y-5">
                            {sp.problems.map((prob, i) => (
                              <div key={i} className="border border-gray-100 rounded-lg">
                                {/* Problem title row */}
                                <div className="flex items-center justify-between px-4 py-3">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="text-sm text-gray-400 font-mono w-5 flex-shrink-0">{i + 1}.</span>
                                    <a
                                      href={`https://leetcode.com/problems/${lcSlug(prob.name)}/`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-base font-medium text-gray-900 hover:text-blue-700 transition-colors truncate"
                                    >
                                      {prob.name}
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`text-xs font-semibold ${diffColor[prob.difficulty]}`}>
                                      {prob.difficulty}
                                    </span>
                                    <span className="text-xs text-gray-400">#{prob.lc}</span>
                                  </div>
                                </div>

                                {/* Explanation + Code */}
                                {(prob.explanation || prob.code) && (
                                  <div className="px-4 pb-4 space-y-3">
                                    {prob.explanation && (
                                      <p className="text-sm text-gray-600 leading-relaxed">{prob.explanation}</p>
                                    )}
                                    {prob.code && (
                                      <div className="rounded-lg overflow-hidden">
                                        <div className="bg-[#1e1e1e] px-4 py-1.5 flex items-center justify-between">
                                          <span className="text-xs text-gray-400 font-mono">Python</span>
                                          <button
                                            onClick={() => navigator.clipboard.writeText(prob.code!)}
                                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                          >
                                            Copy
                                          </button>
                                        </div>
                                        <SyntaxHighlighter
                                          language="python"
                                          style={vscDarkPlus}
                                          customStyle={{ margin: 0, padding: '0.5rem 1rem 0.75rem', fontSize: '0.875rem', lineHeight: '1.625', background: '#1e1e1e' }}
                                          wrapLongLines
                                        >
                                          {prob.code!}
                                        </SyntaxHighlighter>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                  </section>
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
