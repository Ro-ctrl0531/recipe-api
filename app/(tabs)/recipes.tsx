import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { searchMealsByName, type TheMealDbMeal } from '@/lib/themealdb';
import { useThemeColor } from '@/hooks/use-theme-color';

function formatSubtitle(meal: TheMealDbMeal) {
  const category = meal.strCategory?.trim();
  const area = meal.strArea?.trim();
  return [category, area].filter(Boolean).join(' • ');
}

function getPreview(text: string | null) {
  const clean = text?.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  return clean.length > 110 ? `${clean.slice(0, 110)}…` : clean;
}

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [meals, setMeals] = useState<TheMealDbMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputBackground = useThemeColor({ light: '#ffffff', dark: '#1D232C' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#2A2E35' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderTextColor = useThemeColor({ light: '#6B7280', dark: '#9BA1A6' }, 'text');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#1D232C' }, 'background');
  const mutedText = useThemeColor({ light: '#4B5563', dark: '#9BA1A6' }, 'text');
  const actionBackground = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'tint');
  const actionText = useThemeColor({ light: '#ffffff', dark: '#ffffff' }, 'text');

  const runSearch = useCallback(
    async (searchTerm: string, options?: { refresh?: boolean }) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) {
        setMeals([]);
        setActiveQuery('');
        setIsLoading(false);
        setRefreshing(false);
        setError('Type a meal name to search.');
        return;
      }

      if (options?.refresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const results = await searchMealsByName(trimmed);
        setMeals(results);
        setActiveQuery(trimmed);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        setError(`Could not load recipes. ${message}`);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    const defaultQuery = 'chicken';
    setQuery(defaultQuery);
    void runSearch(defaultQuery);
  }, [runSearch]);

  const emptyStateText = useMemo(() => {
    if (isLoading) return 'Loading recipes…';
    if (error) return error;
    if (!activeQuery) return 'Search for a meal to get started.';
    return `No results for “${activeQuery}”. Try another keyword.`;
  }, [activeQuery, error, isLoading]);

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        refreshing={refreshing}
        onRefresh={() => void runSearch(activeQuery || query, { refresh: true })}
        contentContainerStyle={[styles.listContent, { paddingTop: insets.top + 16 }]}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="title">Find a recipe</ThemedText>
            <ThemedText style={{ color: mutedText }}>
              Powered by TheMealDB (public API). Search by meal name (e.g., adobo, pasta, beef).
            </ThemedText>

            <View style={[styles.searchRow, { borderColor, backgroundColor: inputBackground }]}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search meals…"
                placeholderTextColor={placeholderTextColor}
                returnKeyType="search"
                onSubmitEditing={() => void runSearch(query)}
                style={[styles.searchInput, { color: textColor }]}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => void runSearch(query)}
                style={[styles.searchButton, { backgroundColor: actionBackground }]}>
                <IconSymbol size={20} name="magnifyingglass" color={actionText} />
              </Pressable>
            </View>

            {!!activeQuery && (
              <ThemedText style={{ color: mutedText }}>{`Results for “${activeQuery}”`}</ThemedText>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? <ActivityIndicator /> : null}
            <ThemedText style={{ color: mutedText, textAlign: 'center' }}>
              {emptyStateText}
            </ThemedText>
            {error ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => void runSearch(activeQuery || query)}
                style={[styles.retryButton, { borderColor }]}>
                <ThemedText type="defaultSemiBold">Retry</ThemedText>
              </Pressable>
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          const subtitle = formatSubtitle(item);
          const preview = getPreview(item.strInstructions);

          return (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: '/meal/[id]',
                  params: { id: item.idMeal },
                })
              }
              style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
              <Image source={item.strMealThumb} style={styles.thumbnail} contentFit="cover" />
              <View style={styles.cardBody}>
                <ThemedText type="defaultSemiBold" numberOfLines={2}>
                  {item.strMeal}
                </ThemedText>
                {subtitle ? (
                  <ThemedText style={{ color: mutedText }} numberOfLines={1}>
                    {subtitle}
                  </ThemedText>
                ) : null}
                {preview ? (
                  <ThemedText style={{ color: mutedText }} numberOfLines={2}>
                    {preview}
                  </ThemedText>
                ) : null}
                <ThemedText type="link">Open recipe →</ThemedText>
              </View>
            </Pressable>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  header: {
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    paddingTop: 36,
    paddingHorizontal: 8,
    gap: 12,
    alignItems: 'center',
  },
  retryButton: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 96,
    height: 96,
  },
  cardBody: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
});
