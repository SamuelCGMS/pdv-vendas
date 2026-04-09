export interface SalesLayoutViewport {
  width: number;
  height: number;
}

export interface SalesLayoutProfile {
  workspaceMode: 'split' | 'stacked';
  density: 'compact' | 'comfortable';
  searchActionsMode: 'inline' | 'wrapped';
  cartDensity: 'compact' | 'regular';
  modalDensity: 'compact' | 'regular';
  contentWidth: number;
  workspacePadding: number;
  workspaceGap: number;
  mainPanelPadding: number;
  mainPanelGap: number;
  summaryWidth: number;
  cartColumns: string;
  cartColumnGap: number;
  cartRowPaddingX: number;
}

const SIDEBAR_WIDTH = 100;
const STACKED_CONTENT_WIDTH = 900;
const COMPACT_CONTENT_WIDTH = 1260;
const COMPACT_HEIGHT = 760;

export function getSalesLayoutProfile({
  width,
  height,
}: SalesLayoutViewport): SalesLayoutProfile {
  const contentWidth = Math.max(0, width - SIDEBAR_WIDTH);
  const workspaceMode = contentWidth < STACKED_CONTENT_WIDTH ? 'stacked' : 'split';
  const isCompactHeight = height < COMPACT_HEIGHT;
  const isCompactWidth = contentWidth < COMPACT_CONTENT_WIDTH;
  const density = isCompactHeight || isCompactWidth ? 'compact' : 'comfortable';
  const searchActionsMode = workspaceMode === 'stacked' || contentWidth < 840 ? 'wrapped' : 'inline';
  const cartDensity = density === 'compact' ? 'compact' : 'regular';
  const modalDensity = density === 'compact' ? 'compact' : 'regular';
  const workspacePadding = workspaceMode === 'stacked' ? 12 : density === 'compact' ? 12 : 16;
  const summaryWidth = workspaceMode === 'stacked'
    ? Math.max(0, contentWidth - (workspacePadding * 2))
    : contentWidth < 980
      ? 360
      : contentWidth < 1240
        ? 420
        : 480;

  return {
    workspaceMode,
    density,
    searchActionsMode,
    cartDensity,
    modalDensity,
    contentWidth,
    workspacePadding,
    workspaceGap: density === 'compact' ? 12 : 16,
    mainPanelPadding: density === 'compact' ? 24 : 32,
    mainPanelGap: density === 'compact' ? 16 : 24,
    summaryWidth,
    cartColumns: cartDensity === 'compact'
      ? '32px minmax(0, 1fr) 76px 84px 96px 64px'
      : '40px minmax(0, 1fr) 120px 120px 140px 88px',
    cartColumnGap: cartDensity === 'compact' ? 10 : 16,
    cartRowPaddingX: cartDensity === 'compact' ? 16 : 24,
  };
}
