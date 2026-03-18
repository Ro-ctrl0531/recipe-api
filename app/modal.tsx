import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">About Recipe Quest</ThemedText>
      <ThemedText>
        Recipe Quest is a simple API-powered recipe search app built with React Native + Expo. It
        demonstrates fetching live data, showing a list UI, and handling loading/error states.
      </ThemedText>
      <ExternalLink href="https://www.themealdb.com/api.php" style={styles.link}>
        <ThemedText type="link">View TheMealDB API</ThemedText>
      </ExternalLink>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Back to Home</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
