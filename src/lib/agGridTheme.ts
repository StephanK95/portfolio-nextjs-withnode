import { themeQuartz, colorSchemeDark } from 'ag-grid-community';

export const portfolioTheme = themeQuartz.withPart(colorSchemeDark).withParams({
    backgroundColor: '#0d0b1e',
    foregroundColor: '#e2e8f0',
    borderColor: 'rgba(148, 163, 184, 0.12)',
    headerBackgroundColor: '#0a091a',
    headerTextColor: '#b398ff',
    headerFontWeight: 600,
    rowHoverColor: 'rgba(179, 152, 255, 0.07)',
    selectedRowBackgroundColor: 'rgba(179, 152, 255, 0.15)',
    oddRowBackgroundColor: 'rgba(20, 15, 45, 0.5)',
    cellTextColor: '#e2e8f0',
    fontFamily: 'DM Sans, ui-sans-serif, system-ui, sans-serif',
    fontSize: 14,
});
