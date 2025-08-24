import {
  BalsamiqSans_400Regular,
  BalsamiqSans_400Regular_Italic,
  BalsamiqSans_700Bold,
  BalsamiqSans_700Bold_Italic,
} from '@expo-google-fonts/balsamiq-sans';

// Export all font weights for use throughout the app
export const fonts = {
  BalsamiqSans_400Regular,
  BalsamiqSans_400Regular_Italic,
  BalsamiqSans_700Bold,
  BalsamiqSans_700Bold_Italic,
};

// Font family names for use in styles
export const fontFamily = {
  regular: 'BalsamiqSans_400Regular',
  regularItalic: 'BalsamiqSans_400Regular_Italic',
  bold: 'BalsamiqSans_700Bold',
  boldItalic: 'BalsamiqSans_700Bold_Italic',
};

// Font weights for use with fontFamily
export const fontWeight = {
  regular: '400',
  bold: '700',
};

// Helper function to get font family based on weight and style
export const getFontFamily = (weight = 'regular', italic = false) => {
  if (weight === 'bold') {
    return italic ? fontFamily.boldItalic : fontFamily.bold;
  }
  return italic ? fontFamily.regularItalic : fontFamily.regular;
};

// Provide a harmless default export so Expo's file-based router doesn't treat
// this file as a screen without a default export.
import React from 'react';
export default function FontsModule() {
  return null;
}
