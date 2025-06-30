export const Utils = {
  CHART_COLORS: {
    azul_principal: 'rgba(50, 109, 231, 1)',     // #326DE7
    azul_claro: 'rgba(102, 153, 255, 1)',         // #6699FF
    azul_noche: 'rgba(28, 56, 108, 1)',           // #1C386C
    celeste: 'rgba(173, 209, 255, 1)',            // #ADD1FF
    violeta: 'rgba(114, 103, 227, 1)',            // #7267E3
    verde: 'rgba(72, 201, 176, 1)',               // #48C9B0
    gris: 'rgba(149, 165, 166, 1)'                // #95A5A6
  },

  transparentize(color: string, opacity: number) {
    const alpha = opacity ?? 0.5;
    return color.replace('1)', `${alpha})`);
  },

  getColorForSpecies(index: number): string {
    const colors = Object.values(Utils.CHART_COLORS);
    return colors[index % colors.length];
  }
};
