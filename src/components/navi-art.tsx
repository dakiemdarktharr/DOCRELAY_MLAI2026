// Replaceable, hand-drawn placeholder; not an approved VNG brand asset.
// The body tip and transform origin (0, 0) are the click hotspot.
export function NaviArt({ id }: { id: string }) {
  const orange = `url(#${id}-orange)`;
  return (
    <svg
      viewBox="0 0 34 28"
      className="navi-shape"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-orange`} x1="0" y1="0" x2=".7" y2="1">
          <stop stopColor="#ffcf4c" />
          <stop offset=".45" stopColor="#ff9426" />
          <stop offset="1" stopColor="#f05a22" />
        </linearGradient>
        <linearGradient id={`${id}-yellow`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffe77f" />
          <stop offset="1" stopColor="#ffcc04" />
        </linearGradient>
      </defs>
      <g className="navi-sway">
        <path
          className="navi-arm navi-arm-left"
          d="M6 11.5 Q1.1 13 .3 19 Q-.2 22.2 2.3 22.7 Q4.6 23 5.4 19.8 L8.5 15 Z"
          fill={orange}
          stroke="#e96822"
          strokeWidth=".45"
        />
        <path
          className="navi-arm navi-arm-right"
          d="M24.4 11.8 Q30.1 13.5 33.3 20.1 Q34.9 23.4 32.3 24 Q30.6 24.5 28.9 21.4 L24 16.8 Z"
          fill={orange}
          stroke="#e96822"
          strokeWidth=".45"
        />
        <ellipse cx="11" cy="25.5" rx="4" ry="2" fill="#ffc51c" />
        <ellipse cx="23" cy="24.5" rx="3.8" ry="1.9" fill="#ffc51c" />
        <path
          d="M0 0 Q12 4 27.8 15.1 Q31.6 18.3 28.5 22.2 Q27.7 23.5 24.9 24 L7.1 26 Q3.9 26.5 3.8 23 Z"
          fill={orange}
        />
        <path
          d="M1.3 1.2 Q13 5.2 26 15.4 Q28 17 27.7 18.4"
          fill="none"
          stroke="#fff3b8"
          strokeOpacity=".65"
          strokeWidth=".8"
          strokeLinecap="round"
        />
        <g className="navi-face">
          <rect
            x="9.2"
            y="10.3"
            width="16"
            height="12.6"
            rx="3"
            fill={`url(#${id}-yellow)`}
            transform="rotate(-7 17.2 16.6)"
          />
          <path
            d="M12 12.8 L14.2 13.6 M20 12.3 L22.2 11.6"
            stroke="#68411f"
            strokeWidth=".8"
            strokeLinecap="round"
          />
          <ellipse cx="13.7" cy="15.7" rx="1.1" ry="1.4" fill="#382218" />
          <ellipse
            className="navi-eye-right"
            cx="21"
            cy="15"
            rx="1.1"
            ry="1.4"
            fill="#382218"
          />
          <path
            d="M13.7 18.5 Q17.7 17.4 21.7 17.6 Q21.2 21.9 17.5 22 Q14.5 22.1 13.7 18.5"
            fill="#55291c"
          />
          <path
            d="M15.3 21.4 Q17.7 19.7 20.2 20.9 Q17.8 22.6 15.3 21.4"
            fill="#f67b43"
          />
        </g>
      </g>
    </svg>
  );
}
