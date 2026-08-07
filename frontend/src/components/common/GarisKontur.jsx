// Elemen khas identitas visual: garis kontur topografi Pegunungan Arfak.
// Dipakai sebagai latar hero & pemisah antarbagian.
export default function GarisKontur({ className = '', warna = 'currentColor' }) {
  return (
    <svg viewBox="0 0 1440 220" fill="none" preserveAspectRatio="none" className={className} aria-hidden="true">
      {[0, 26, 52, 78, 104].map((y, i) => (
        <path
          key={i}
          d={`M0 ${150 - y} C 180 ${90 - y}, 300 ${190 - y}, 480 ${130 - y} S 800 ${40 - y * 0.6}, 990 ${120 - y} S 1300 ${180 - y}, 1440 ${100 - y}`}
          stroke={warna}
          strokeWidth="1.2"
          opacity={0.5 - i * 0.08}
        />
      ))}
    </svg>
  );
}
