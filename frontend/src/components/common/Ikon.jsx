// Ikon garis yang konsisten (lucide-react) + ikon WhatsApp.
// Dipakai lewat nama agar kamus teks (i18n/kamus.js) bisa menentukan ikonnya.
import {
  Bird, Compass, Home, Leaf, Sprout, Trees, Plane, Sun, Backpack, Wallet, MessageCircle,
  ShieldCheck, MousePointerClick, Layers, ZoomIn, Car, Tent, Footprints, UtensilsCrossed,
  HeartPulse, Droplets, Camera, Ban, VolumeX, Trash2, Mountain,
} from 'lucide-react';

export function IkonWA({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.13c-.24.69-1.42 1.32-1.96 1.37-.5.05-.98.24-3.31-.69-2.8-1.1-4.58-3.97-4.72-4.15-.14-.18-1.13-1.5-1.13-2.86 0-1.36.71-2.03.97-2.31.25-.28.55-.35.74-.35l.53.01c.17.01.4-.06.62.48.24.56.8 1.94.86 2.08.07.14.12.3.02.48-.09.18-.14.3-.28.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.92 1.07.95 1.97 1.25 2.25 1.39.28.14.44.12.6-.07.16-.18.69-.8.88-1.08.18-.28.37-.23.62-.14.25.09 1.6.76 1.88.9.28.14.46.21.53.32.07.12.07.67-.17 1.35Z" />
    </svg>
  );
}

const PETA = {
  bird: Bird, compass: Compass, home: Home, leaf: Leaf, sprout: Sprout, trees: Trees,
  plane: Plane, sun: Sun, backpack: Backpack, wallet: Wallet, message: MessageCircle,
  shield: ShieldCheck, pointer: MousePointerClick, layers: Layers, zoom: ZoomIn,
  car: Car, tent: Tent, footprints: Footprints, food: UtensilsCrossed, health: HeartPulse,
  water: Droplets, camera: Camera, ban: Ban, quiet: VolumeX, trash: Trash2, mountain: Mountain,
  wa: IkonWA,
};

export default function Ikon({ nama, size = 20, className = '', strokeWidth = 1.7 }) {
  const Komponen = PETA[nama] || Leaf;
  if (Komponen === IkonWA) return <IkonWA size={size} className={className} />;
  return <Komponen size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}

// Ikon bergiliran untuk daftar poin (fasilitas, aturan) yang ditulis admin per baris
export const IKON_FASILITAS = ['car', 'home', 'footprints', 'food', 'backpack', 'health', 'water', 'camera'];
export const IKON_ATURAN = ['ban', 'quiet', 'trash', 'camera', 'footprints', 'sprout'];
