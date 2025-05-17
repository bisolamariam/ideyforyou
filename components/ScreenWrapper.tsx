import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  style?: object;
};

const ScreenWrapper = ({ children, style }: Props) => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'web') {
    return <View style={[styles.webContainer, style]}>{children}</View>;
  }

  return (
    <SafeAreaView
      style={[
        styles.mobileContainer,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: 24,
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    padding: 24,
  },
  mobileContainer: {
    flex: 1,
  },
});

export default ScreenWrapper;
