import { normalizeThemeKey } from '../../lib/theme';
import Plant            from './Plant';
import MapProgress      from './MapProgress';
import CafeMenuProgress from './CafeMenuProgress';

export default function ThemeProgressVisual({ theme, seeds = 0, size = 120 }) {
  const key = normalizeThemeKey(theme);
  if (key === 'exploration') return <MapProgress      seeds={seeds} size={size} />;
  if (key === 'cafe')        return <CafeMenuProgress seeds={seeds} size={size} />;
  return <Plant seeds={seeds} size={size} />;
}
