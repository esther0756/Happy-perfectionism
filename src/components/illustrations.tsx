export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 4c6 0 5 8 5 8s7-4 10 1-4 9-4 9 8 2 6 8-10 3-10 3-1 7-7 7-6-7-6-7-8 3-10-3 6-8 6-8-7-4-4-9 10-1 10-1-2-8 4-8Z"
        fill="currentColor"
      />
      <circle cx="20" cy="23" r="6" fill="#FAF8F0" />
    </svg>
  );
}

export function GrowingIllustration() {
  return (
    <svg
      className="growing-illustration"
      viewBox="0 0 480 340"
      fill="none"
      role="img"
      aria-label="책 위에서 자라는 식물과 따뜻한 햇살의 그림"
    >
      <path
        d="M83 268C20 211 52 76 158 54c94-20 202 2 240 78 47 97-37 180-155 179-71 0-113-9-160-43Z"
        fill="#E9E9D9"
      />
      <circle cx="348" cy="80" r="38" fill="#E6B272" />
      <g stroke="#D4A66E" strokeWidth="2" strokeLinecap="round">
        <path d="m350 24 1-12m39 27 8-8m8 48 13 1m-30 39 9 9m-86-90-8-9" />
      </g>
      <path d="m96 226 236-23 58 33-234 28-60-38Z" fill="#C98362" />
      <path d="m98 227 2 25 55 37 1-25-58-37Z" fill="#B96D50" />
      <path d="m156 264 234-28v23l-235 30 1-25Z" fill="#F5E9D7" />
      <path
        d="m167 273 207-25m-207 31 208-25"
        stroke="#D8C7AB"
        strokeWidth="1.4"
      />
      <path
        d="m96 253 59 40 238-30"
        stroke="#B66D51"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="m129 203 192-14 38 29-190 18-40-33Z" fill="#64856D" />
      <path d="m130 203 1 17 38 31v-15l-39-33Z" fill="#45674F" />
      <path d="m169 236 190-18v14l-190 19v-15Z" fill="#F5E9D7" />
      <path d="m181 243 168-16" stroke="#D8C7AB" strokeWidth="1.4" />
      <path
        d="m130 220 38 34 194-20"
        stroke="#45674F"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="m287 232 18-2v29l-10-6-9 8 1-29Z" fill="#D69854" />
      <path d="M198 143h88l-11 61c-1 11-61 11-63 0l-14-61Z" fill="#D78A63" />
      <path d="M198 143c0 13 88 13 88 0s-88-14-88 0Z" fill="#E3A07C" />
      <ellipse cx="242" cy="143" rx="35" ry="7" fill="#95654D" />
      <path
        d="M243 145c-2-37-4-59 2-87"
        stroke="#45674F"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M242 113c-30 0-48-17-48-37 26-2 49 16 48 37Z" fill="#63866B" />
      <path d="M243 93c30-1 45-19 46-40-24 0-46 18-46 40Z" fill="#789577" />
      <path d="M244 67c-18-8-23-25-17-40 17 7 23 24 17 40Z" fill="#3F624C" />
      <path
        d="m206 88 34 24m36-47-31 25"
        stroke="#A8B99A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M218 163c4 8 4 26 8 31"
        stroke="#E5AA86"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M358 254h38l-5 30c-1 10-27 10-28 0l-5-30Z" fill="#E9D7B6" />
      <path d="M394 260c20-4 18 21-1 18" stroke="#D6BE96" strokeWidth="5" />
      <ellipse cx="377" cy="254" rx="19" ry="5" fill="#D6BE96" />
      <ellipse cx="377" cy="254" rx="14" ry="3" fill="#8C7055" />
      <path
        d="M373 239c-7-10 7-12 1-22m10 22c-7-10 7-12 1-22"
        stroke="#C5BBA6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m93 133 4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10Zm314 36 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"
        fill="#BE8A57"
      />
      <path
        d="M73 278c9-7 11-19 8-29-13 6-16 20-8 29Zm0 0c-15 0-25-9-26-19 15-1 26 7 26 19Z"
        fill="#8D9D79"
      />
      <path d="m74 278 2 14" stroke="#6C825F" strokeWidth="2" />
      <path
        d="M124 302c63 16 156 16 205 3"
        stroke="#D1D4BC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 6"
      />
    </svg>
  );
}

export function TypeSymbol({
  symbol,
  className = "",
}: {
  symbol: string;
  className?: string;
}) {
  return (
    <svg
      className={`type-symbol ${className}`}
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
    >
      {symbol === "seed" && (
        <>
          <path d="M36 61V33" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M35 48C11 49 9 29 12 24c22-1 28 14 23 24Z"
            fill="currentColor"
            opacity=".8"
          />
          <path
            d="M36 36c-4-18 9-30 23-28 4 19-8 31-23 28Z"
            fill="currentColor"
          />
          <path
            d="M22 61h28"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      )}
      {symbol === "sun" && (
        <>
          <circle cx="36" cy="36" r="17" fill="currentColor" opacity=".85" />
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M36 5v7m0 48v7M5 36h7m48 0h7M14 14l5 5m34 34 5 5M14 58l5-5m34-34 5-5" />
          </g>
          <path
            d="M29 39c5 5 10 5 14 0"
            stroke="#fff9ed"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
      {symbol === "moon" && (
        <>
          <path
            d="M49 12c-7 19-1 35 14 39C46 73 13 61 13 37c0-18 17-32 36-25Z"
            fill="currentColor"
            opacity=".8"
          />
          <path
            d="m55 13 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"
            fill="currentColor"
          />
        </>
      )}
      {symbol === "bloom" && (
        <>
          <path
            d="M36 49v16m0-5c-18 0-21-11-21-11 13-3 21 11 21 11"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M36 7c9 0 9 12 9 12s11-5 16 3-6 14-6 14 8 10 1 16-17-1-17-1-8 9-16 3-2-17-2-17-12-2-11-12 16-8 16-8S27 7 36 7Z"
            fill="currentColor"
            opacity=".8"
          />
          <circle cx="36" cy="32" r="9" fill="#FFF6D8" />
        </>
      )}
    </svg>
  );
}
