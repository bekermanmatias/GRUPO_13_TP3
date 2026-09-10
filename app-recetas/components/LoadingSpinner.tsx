import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  style?: any;
}

export default function LoadingSpinner({ size = 'large', style }: LoadingSpinnerProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const buttonPrimary = useThemeColor({}, 'buttonPrimary');

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <ActivityIndicator size={size} color={buttonPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 