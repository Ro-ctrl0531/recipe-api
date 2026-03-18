import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const buttonBackground = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'tint');
  const buttonText = useThemeColor({ light: '#ffffff', dark: '#ffffff' }, 'text');
  const headerIconColor = colorScheme === 'dark' ? '#FDE68A' : '#7C2D12';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FDE68A', dark: '#7C2D12' }}
      headerImage={
        <ThemedView style={styles.headerIconWrap} lightColor="transparent" darkColor="transparent">
          <IconSymbol
            size={180}
            name="fork.knife"
            color={headerIconColor}
            style={styles.headerIcon}
          />
        </ThemedView>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Recipe Quest</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          Search meals from a public API (TheMealDB), then open a recipe to see ingredients and
          instructions. Includes search, pull-to-refresh, and error handling.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/recipes')}
          style={[styles.primaryButton, { backgroundColor: buttonBackground }]}>
          <ThemedText style={[styles.primaryButtonText, { color: buttonText }]}>
            Start searching
          </ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={styles.smallLogo}
          contentFit="contain"
        />
        <ThemedText type="defaultSemiBold">Built with React Native + Expo</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/modal')}>
          <ThemedText type="link">About this app</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'flex-start',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  headerIconWrap: {
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerIcon: {
    opacity: 0.95,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  smallLogo: {
    width: 80,
    height: 80,
    opacity: 0.9,
  },
});
