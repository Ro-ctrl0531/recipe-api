# Recipe Quest

A cross-platform React Native + Expo app that integrates a public API (TheMealDB) to help users search recipes and view ingredients/instructions.

## Features

- Home screen with app title + description
- Recipes screen: API fetch + searchable list (FlatList)
- Loading state, error handling, pull-to-refresh
- Recipe detail screen with ingredients, instructions, and optional links (YouTube/source)

## Public API used

- TheMealDB: https://www.themealdb.com/api.php

## Run locally

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```
"# recipe-api" 
#

What API did you use?

What problem does your app solve?

What was the most difficult part of the integration?

What would you improve with more time?


For this project, I used the TheMealDB Public API. Specifically, the app calls endpoints that let users search meals by name and view full recipe details (including ingredients, measurements, and instructions). I chose TheMealDB because it is free, easy to access without complex authentication, and provides structured recipe data that can be transformed into a useful mobile experience.

The problem my app solves is helping users quickly find cooking ideas and step-by-step recipes using only a simple search. Instead of browsing random websites with ads and long pages, the app lets the user type a keyword (for example: “chicken”, “pasta”, or “beef”), then shows a clean list of matching meals with images. When the user taps a result, the app opens a detail view that presents the recipe in a meaningful way: ingredients with measurements, cooking instructions, and optional links (like a YouTube video or source page when available). This turns raw API data into something practical for everyday meal planning.

The most difficult part of the integration was handling the API’s data structure and app states smoothly. TheMealDB returns ingredient and measurement fields as separate numbered keys (e.g., strIngredient1…strIngredient20 and strMeasure1…strMeasure20), so I had to process and combine them into a clean ingredients list that avoids empty values. Another challenge was implementing a good user experience around asynchronous fetching: managing loading indicators, handling errors gracefully when a request fails, and making sure the list updates correctly when searching or refreshing.

With more time, I would improve the app by adding advanced filtering and better UX features. Examples include filtering by category/area, saving favorite recipes locally, caching recent searches for faster loading, and adding offline support for previously viewed recipes. I would also enhance the UI with small animations, more consistent spacing/typography, and a clearer empty state design to make the app feel more polished.


