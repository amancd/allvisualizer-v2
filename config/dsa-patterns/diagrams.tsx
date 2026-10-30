/**
 * SVG diagrams shown in the "Visual diagram" box of a pattern.
 * Keys are SubPattern slugs; patterns without an entry simply show no diagram.
 */
export const patternDiagrams: Record<string, React.ReactNode> = {
  'tp-converging': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 120" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Converging two pointers on a sorted array">
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
    </div>
  ),

  'tp-fast-slow': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 440 160" className="mx-auto block w-full min-w-[420px] max-w-md" aria-label="Fast and slow pointers on a linked list cycle">
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
        <text x={50} y={110} textAnchor="middle" fontSize={10} fill="#16a34a">+1 step</text>
        {/* Fast pointer label */}
        <rect x={118} y={82} width={44} height={20} rx={4} fill="#dc2626" />
        <text x={140} y={96} textAnchor="middle" fontSize={10} fontWeight={700} fill="white">fast</text>
        <text x={140} y={110} textAnchor="middle" fontSize={10} fill="#dc2626">+2 steps</text>
        {/* Cycle label */}
        <text x={380} y={70} fontSize={10} fill="#f59e0b" fontWeight={600}>cycle</text>
        <defs>
          <marker id="arrowN" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#94a3b8" /></marker>
        </defs>
      </svg>
    </div>
  ),

  'tp-fixed-separation': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 110" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Fixed separation two pointers">
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
    </div>
  ),

  'tp-inplace': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 480 120" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="In-place read/write two pointers">
        {/* Array with some duplicates */}
        {[1,1,2,2,3,4,4].map((v, i) => (
          <g key={i}>
            <rect x={40 + i * 58} y={35} width={48} height={38} rx={6} fill={i <= 3 ? '#dcfce7' : '#f0f4ff'} stroke={i <= 3 ? '#22c55e' : '#6366f1'} strokeWidth={1.5} />
            <text x={64 + i * 58} y={59} textAnchor="middle" fontSize={14} fontWeight={600} fill={i <= 3 ? '#166534' : '#4338ca'}>{v}</text>
          </g>
        ))}
        {/* Slow (write) pointer */}
        <polygon points="122,82 116,97 128,97" fill="#16a34a" />
        <text x={122} y={113} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">slow (write)</text>
        {/* Fast (read) pointer */}
        <polygon points="296,82 290,97 302,97" fill="#2563eb" />
        <text x={296} y={113} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">fast (read)</text>
        {/* Scan arrow */}
        <line x1={310} y1={27} x2={420} y2={27} stroke="#2563eb" strokeWidth={1.5} strokeDasharray="4,3" markerEnd="url(#arrowB)" />
        <text x={365} y={20} textAnchor="middle" fontSize={10} fill="#2563eb">scans all →</text>
        <defs>
          <marker id="arrowB" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#2563eb" /></marker>
        </defs>
      </svg>
    </div>
  ),

  'tp-backspace': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 440 120" className="mx-auto block w-full min-w-[420px] max-w-md" aria-label="Backspace string comparison processed from right">
        {/* String 1 */}
        {['a','b','#','c'].map((v, i) => (
          <g key={i}>
            <rect x={34 + i * 46} y={15} width={40} height={34} rx={5} fill={v === '#' ? '#fee2e2' : '#f0f4ff'} stroke={v === '#' ? '#ef4444' : '#6366f1'} strokeWidth={1.5} />
            <text x={54 + i * 46} y={37} textAnchor="middle" fontSize={14} fontWeight={600} fill={v === '#' ? '#dc2626' : '#4338ca'}>{v}</text>
          </g>
        ))}
        <text x={12} y={37} fontSize={11} fill="#6b7280" fontWeight={600}>S₁</text>
        {/* Pointer on string 1 */}
        <polygon points={`${54 + 3 * 46},55 ${48 + 3 * 46},67 ${60 + 3 * 46},67`} fill="#16a34a" />
        <text x={54 + 3 * 46} y={80} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">i ←</text>
        {/* String 2 */}
        {['a','d','#','c'].map((v, i) => (
          <g key={i}>
            <rect x={246 + i * 46} y={15} width={40} height={34} rx={5} fill={v === '#' ? '#fee2e2' : '#f0f4ff'} stroke={v === '#' ? '#ef4444' : '#6366f1'} strokeWidth={1.5} />
            <text x={266 + i * 46} y={37} textAnchor="middle" fontSize={14} fontWeight={600} fill={v === '#' ? '#dc2626' : '#4338ca'}>{v}</text>
          </g>
        ))}
        <text x={224} y={37} fontSize={11} fill="#6b7280" fontWeight={600}>S₂</text>
        {/* Pointer on string 2 */}
        <polygon points={`${266 + 3 * 46},55 ${260 + 3 * 46},67 ${272 + 3 * 46},67`} fill="#dc2626" />
        <text x={266 + 3 * 46} y={80} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">j ←</text>
        {/* Process direction */}
        <text x={220} y={108} textAnchor="middle" fontSize={10} fill="#6b7280">Process from right → left, skip chars after #</text>
      </svg>
    </div>
  ),

  'tp-expand-center': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 460 110" className="mx-auto block w-full min-w-[420px] max-w-md" aria-label="Expand from center for palindrome detection">
        {/* String characters */}
        {['b','a','b','a','d'].map((v, i) => (
          <g key={i}>
            <rect x={100 + i * 55} y={30} width={44} height={38} rx={6} fill={i >= 1 && i <= 3 ? '#dcfce7' : '#f1f5f9'} stroke={i >= 1 && i <= 3 ? '#22c55e' : '#cbd5e1'} strokeWidth={1.5} />
            <text x={122 + i * 55} y={54} textAnchor="middle" fontSize={15} fontWeight={600} fill={i >= 1 && i <= 3 ? '#166534' : '#64748b'}>{v}</text>
          </g>
        ))}
        {/* Center marker */}
        <circle cx={122 + 2 * 55} cy={25} r={4} fill="#f59e0b" />
        <text x={122 + 2 * 55} y={16} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>center</text>
        {/* Left expand arrow */}
        <line x1={122 + 2 * 55 - 10} y1={78} x2={122 + 0 * 55 + 5} y2={78} stroke="#16a34a" strokeWidth={1.5} markerEnd="url(#arrowE1)" />
        <text x={122 + 1 * 55 - 10} y={96} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">← L</text>
        {/* Right expand arrow */}
        <line x1={122 + 2 * 55 + 10} y1={78} x2={122 + 4 * 55 - 5} y2={78} stroke="#dc2626" strokeWidth={1.5} markerEnd="url(#arrowE2)" />
        <text x={122 + 3 * 55 + 10} y={96} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">R →</text>
        <defs>
          <marker id="arrowE1" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#16a34a" /></marker>
          <marker id="arrowE2" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#dc2626" /></marker>
        </defs>
      </svg>
    </div>
  ),

  'tp-string-reversal': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 440 110" className="mx-auto block w-full min-w-[420px] max-w-md" aria-label="String reversal with two pointers swapping from both ends">
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
    </div>
  ),

  /* ── Sliding Window diagrams ─────────────────────────────── */

  'sw-fixed-size': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 120" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Fixed size sliding window">
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
        <text x={45 + 3.5 * 60} y={112} textAnchor="middle" fontSize={10} fill="#3b82f6" fontWeight={600}>slide →</text>
        <defs>
          <marker id="arrowFW" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#3b82f6" /></marker>
        </defs>
      </svg>
    </div>
  ),

  'sw-variable-size': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 130" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Variable size sliding window">
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
        <line x1={68 + 3 * 68 + 15} y1={20} x2={68 + 5 * 68 - 15} y2={20} stroke="#dc2626" strokeWidth={1.5} markerEnd="url(#arrowVR)" />
        <text x={68 + 4 * 68} y={13} textAnchor="middle" fontSize={10} fill="#dc2626" fontWeight={600}>expand →</text>
        <line x1={68 + 1 * 68 + 15} y1={20} x2={68 + 2 * 68 - 15} y2={20} stroke="#16a34a" strokeWidth={1.5} markerEnd="url(#arrowVL)" />
        <text x={68 + 1.5 * 68} y={13} textAnchor="middle" fontSize={10} fill="#16a34a" fontWeight={600}>shrink →</text>
        {/* Sum label inside window */}
        <text x={68 + 2 * 68} y={34} textAnchor="middle" fontSize={10} fill="#6b7280">sum = 6 ≤ target</text>
        <defs>
          <marker id="arrowVR" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#dc2626" /></marker>
          <marker id="arrowVL" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#16a34a" /></marker>
        </defs>
      </svg>
    </div>
  ),

  'sw-monotonic-queue': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 -12 520 162" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Monotonic deque for sliding window max">
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
        <text x={58 + 3 * 68 + 10} y={4} textAnchor="middle" fontSize={10} fill="#3b82f6" fontWeight={600}>window k=3</text>
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
        <text x={68} y={95} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">front→</text>
        <text x={395} y={95} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">←back</text>
        {/* Arrow from front to answer */}
        <line x1={135} y1={112} x2={135} y2={135} stroke="#16a34a" strokeWidth={1.5} />
        <text x={135} y={147} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">max = 3</text>
      </svg>
    </div>
  ),

  'sw-char-freq': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 150" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Character frequency matching sliding window">
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
        <text x={110} y={92} textAnchor="middle" fontSize={10} fill="#7c3aed">{'{a:1, b:1, c:1}'}</text>
        {/* Window freq map */}
        <rect x={230} y={65} width={190} height={34} rx={6} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
        <text x={325} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1d4ed8">window freq</text>
        <text x={325} y={92} textAnchor="middle" fontSize={10} fill="#1d4ed8">{'{b:2, a:1}'}</text>
        {/* Compare arrow */}
        <line x1={192} y1={82} x2={228} y2={82} stroke="#6b7280" strokeWidth={1.5} markerEnd="url(#arrowCF)" />
        <text x={210} y={74} textAnchor="middle" fontSize={10} fill="#6b7280">compare</text>
        {/* Matched counter */}
        <rect x={150} y={115} width={220} height={28} rx={6} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} />
        <text x={260} y={134} textAnchor="middle" fontSize={11} fontWeight={600} fill="#b45309">matched: 1 / required: 3</text>
        <defs>
          <marker id="arrowCF" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#6b7280" /></marker>
        </defs>
      </svg>
    </div>
  ),

  /* ── Binary Search diagrams ──────────────────────────────── */

  'bs-sorted': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 130" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Binary search on sorted array">
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
        <text x={32} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">lo</text>
        {/* hi pointer */}
        <polygon points={`${32 + 9 * 50},80 ${26 + 9 * 50},93 ${38 + 9 * 50},93`} fill="#dc2626" />
        <text x={32 + 9 * 50} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">hi</text>
        {/* mid pointer */}
        <polygon points={`${32 + 4 * 50},80 ${26 + 4 * 50},93 ${38 + 4 * 50},93`} fill="#3b82f6" />
        <text x={32 + 4 * 50} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">mid</text>
        {/* Halving arrows */}
        <path d={`M${32 + 4 * 50 - 15},25 Q${32 + 2 * 50},10 ${32},25`} fill="none" stroke="#16a34a" strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#arrowBS1)" />
        <text x={32 + 2 * 50} y={12} textAnchor="middle" fontSize={10} fill="#16a34a">target &lt; mid → go left</text>
        <path d={`M${32 + 4 * 50 + 15},25 Q${32 + 7 * 50},10 ${32 + 9 * 50},25`} fill="none" stroke="#dc2626" strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#arrowBS2)" />
        <text x={32 + 7 * 50} y={12} textAnchor="middle" fontSize={10} fill="#dc2626">target &gt; mid → go right</text>
        <defs>
          <marker id="arrowBS1" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#16a34a" /></marker>
          <marker id="arrowBS2" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#dc2626" /></marker>
        </defs>
      </svg>
    </div>
  ),

  'bs-rotated': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 160" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Binary search in rotated sorted array">
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
        <text x={285} y={48} fontSize={10} fontWeight={700} fill="#ef4444">pivot</text>
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
        <text x={130} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">left sorted half</text>
        <text x={370} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill="#22c55e">right sorted half</text>
        {/* Mid arrow */}
        <polygon points="225,118 219,130 231,130" fill="#f59e0b" />
        <text x={225} y={145} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">mid — which half is sorted?</text>
      </svg>
    </div>
  ),

  'bs-on-answer': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 138" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Binary search on answer space">
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
        <text x={260} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">boundary (answer)</text>
        {/* lo pointer */}
        <polygon points="50,80 44,93 56,93" fill="#16a34a" />
        <text x={50} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">lo</text>
        {/* hi pointer */}
        <polygon points="470,80 464,93 476,93" fill="#dc2626" />
        <text x={470} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">hi</text>
        {/* mid pointer */}
        <polygon points="300,80 294,93 306,93" fill="#3b82f6" />
        <text x={300} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">mid ✓ → hi=mid</text>
        {/* Arrow showing convergence */}
        <line x1={50} y1={120} x2={260} y2={120} stroke="#6b7280" strokeWidth={1} strokeDasharray="3,3" markerEnd="url(#arrowOA)" />
        <text x={155} y={130} textAnchor="middle" fontSize={10} fill="#6b7280">converge to boundary</text>
        <defs>
          <marker id="arrowOA" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#6b7280" /></marker>
        </defs>
      </svg>
    </div>
  ),

  'bs-first-last': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 130" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Binary search for first and last occurrence">
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
        <text x={38 + 3 * 55} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">first</text>
        {/* Last occurrence arrow */}
        <polygon points={`${38 + 6 * 55},80 ${32 + 6 * 55},93 ${44 + 6 * 55},93`} fill="#dc2626" />
        <text x={38 + 6 * 55} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">last</text>
        {/* bisect_left label */}
        <line x1={38 + 3 * 55} y1={25} x2={38 + 3 * 55} y2={33} stroke="#16a34a" strokeWidth={1.5} />
        <text x={38 + 3 * 55} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="#16a34a">bisect_left</text>
        {/* bisect_right label */}
        <line x1={38 + 7 * 55} y1={25} x2={38 + 7 * 55} y2={33} stroke="#dc2626" strokeWidth={1.5} />
        <text x={38 + 7 * 55} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="#dc2626">bisect_right</text>
        {/* Bracket showing target range */}
        <rect x={13 + 3 * 55} y={29} width={4 * 55 - 2} height={48} rx={7}
          fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={38 + 4.5 * 55} y={126} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>target = 5 (count = 4)</text>
      </svg>
    </div>
  ),

  'bs-median-kth': (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 520 150" className="mx-auto block w-full min-w-[420px] max-w-lg" aria-label="Binary search partition for median of two sorted arrays">
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
        <text x={260} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">partition cut</text>

        {/* Left halves label */}
        <rect x={30} y={122} width={130} height={22} rx={5} fill="#ede9fe" stroke="#8b5cf6" strokeWidth={1.2} />
        <text x={95} y={137} textAnchor="middle" fontSize={10} fontWeight={600} fill="#7c3aed">left halves: 1,3,2,5,6</text>

        {/* Right halves label */}
        <rect x={180} y={122} width={160} height={22} rx={5} fill="#fce7f3" stroke="#ec4899" strokeWidth={1.2} />
        <text x={260} y={137} textAnchor="middle" fontSize={10} fontWeight={600} fill="#be185d">right halves: 8,9,15,12,14,17</text>

        {/* Condition */}
        <text x={430} y={137} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>max(left) ≤ min(right)</text>
      </svg>
    </div>
  ),
};
