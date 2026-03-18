export type TheMealDbMeal = Record<string, string | null> & {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strYoutube: string | null;
  strSource: string | null;
};

type TheMealDbResponse = {
  meals: TheMealDbMeal[] | null;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function searchMealsByName(query: string): Promise<TheMealDbMeal[]> {
  const q = query.trim();
  if (!q) return [];

  const data = await fetchJson<TheMealDbResponse>(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`
  );

  return data.meals ?? [];
}

export async function lookupMealById(id: string): Promise<TheMealDbMeal | null> {
  const mealId = id.trim();
  if (!mealId) return null;

  const data = await fetchJson<TheMealDbResponse>(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(mealId)}`
  );

  return data.meals?.[0] ?? null;
}

export function getMealIngredients(meal: TheMealDbMeal) {
  const items: Array<{ ingredient: string; measure: string }> = [];

  for (let index = 1; index <= 20; index++) {
    const ingredient = meal[`strIngredient${index}`]?.trim();
    const measure = meal[`strMeasure${index}`]?.trim();
    if (!ingredient) continue;

    items.push({
      ingredient,
      measure: measure ?? '',
    });
  }

  return items;
}

