import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getMealIngredients, lookupMealById, type TheMealDbMeal } from '@/lib/themealdb';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function MealDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [meal, setMeal] = useState<TheMealDbMeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#1D232C' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#2A2E35' }, 'background');
  const mutedText = useThemeColor({ light: '#4B5563', dark: '#9BA1A6' }, 'text');
  const actionBackground = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'tint');
  const actionText = useThemeColor({ light: '#ffffff', dark: '#ffffff' }, 'text');

  const ingredients = useMemo(() => (meal ? getMealIngredients(meal) : []), [meal]);

  const load = useCallback(async () => {
    if (!id) {
      setError('Missing recipe id.');
      setMeal(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await lookupMealById(id);
      if (!result) {
        setError('Recipe not found.');
        setMeal(null);
      } else {
        setMeal(result);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(`Could not load recipe. ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen options={{ title: meal?.strMeal ?? 'Recipe' }} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <ThemedText style={{ color: mutedText }}>Loading recipe…</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
            Something went wrong
          </ThemedText>
          <ThemedText style={{ color: mutedText, textAlign: 'center' }}>{error}</ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => void load()}
            style={[styles.primaryButton, { backgroundColor: actionBackground }]}>
            <ThemedText style={{ color: actionText, fontWeight: '700' }}>Retry</ThemedText>
          </Pressable>
        </View>
      ) : meal ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Image source={meal.strMealThumb} style={styles.heroImage} contentFit="cover" />

          <ThemedText type="title" style={styles.title}>
            {meal.strMeal}
          </ThemedText>

          <View style={styles.metaRow}>
            {meal.strCategory ? (
              <View style={[styles.chip, { backgroundColor: cardBackground, borderColor }]}>
                <ThemedText style={{ color: mutedText }}>{meal.strCategory}</ThemedText>
              </View>
            ) : null}
            {meal.strArea ? (
              <View style={[styles.chip, { backgroundColor: cardBackground, borderColor }]}>
                <ThemedText style={{ color: mutedText }}>{meal.strArea}</ThemedText>
              </View>
            ) : null}
          </View>

          <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText type="subtitle">Ingredients</ThemedText>
            {ingredients.length ? (
              <View style={styles.ingredientsList}>
                {ingredients.map((item) => {
                  const measure = item.measure?.trim();
                  return (
                    <ThemedText key={`${item.ingredient}-${measure}`} style={{ color: mutedText }}>
                      {`• ${item.ingredient}${measure ? ` — ${measure}` : ''}`}
                    </ThemedText>
                  );
                })}
              </View>
            ) : (
              <ThemedText style={{ color: mutedText }}>No ingredients listed.</ThemedText>
            )}
          </View>

          <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText type="subtitle">Instructions</ThemedText>
            <ThemedText style={{ color: mutedText, lineHeight: 22 }}>
              {meal.strInstructions?.trim() || 'No instructions available.'}
            </ThemedText>
          </View>

          <View style={styles.actionsRow}>
            {meal.strYoutube ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => void WebBrowser.openBrowserAsync(meal.strYoutube!)}
                style={[styles.secondaryButton, { borderColor }]}>
                <ThemedText type="defaultSemiBold">Watch video</ThemedText>
              </Pressable>
            ) : null}

            {meal.strSource ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => void WebBrowser.openBrowserAsync(meal.strSource!)}
                style={[styles.secondaryButton, { borderColor }]}>
                <ThemedText type="defaultSemiBold">Open source</ThemedText>
              </Pressable>
            ) : null}
          </View>

          <ThemedText style={{ color: mutedText, textAlign: 'center' }}>
            Data from TheMealDB public API.
          </ThemedText>
        </ScrollView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 14,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
  },
  title: {
    marginTop: 6,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  section: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  ingredientsList: {
    gap: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
});

