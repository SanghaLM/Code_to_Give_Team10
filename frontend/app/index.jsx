import { Redirect } from 'expo-router';

export default function AppIndex() {
  // This will be handled by the _layout.js MainRouter logic
  // But we need this file for Expo Router to work properly
  return <Redirect href="/tabs" />;
}
