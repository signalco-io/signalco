import Color from 'color';

export function colorToRgb(hex: string) {
    return Color(hex).rgb().object();
}
