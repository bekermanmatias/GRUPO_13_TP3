/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F8FFFA',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    inputBackground: '#fff',
    cardBackground: '#fff',
    searchBackground: '#eef5ef',
    buttonPrimary: '#4CAF50',
    buttonSecondary: '#f0f0f0',
    avatarBackground: '#9E9E9E',
    border: '#ddd',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    inputBackground: '#2A2A2A',
    cardBackground: '#2C2C2E',
    searchBackground: '#3A3A3C',
    buttonPrimary: '#4CAF50',
    buttonSecondary: '#3A3A3C',
    avatarBackground: '#6C6C6E',
    border: '#48484A',
  },
};
