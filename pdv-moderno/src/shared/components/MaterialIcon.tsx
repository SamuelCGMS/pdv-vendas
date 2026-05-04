import type { CSSProperties, ReactElement } from "react";

/**
 * Renders a Google Material Symbols Outlined icon.
 *
 * The HTML source of truth uses:
 *   font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24
 *
 * Usage: <MaterialIcon name="point_of_sale" />
 *        <MaterialIcon name="search" size={24} />
 */
export function MaterialIcon({
  name,
  size,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}): ReactElement {
  const merged: CSSProperties = {
    ...(size !== undefined && { fontSize: size }),
    ...style,
  };

  return (
    <span className={`material-symbols-outlined${className ? ` ${className}` : ""}`} style={merged}>
      {name}
    </span>
  );
}
