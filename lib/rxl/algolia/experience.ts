export const ALGOLIA_EXPERIENCE = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "QVGC9APPPY",
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? "427a32ddad83118fb89661b17f724ff7",
  experienceId: process.env.NEXT_PUBLIC_ALGOLIA_EXPERIENCE_ID ?? "QVGC9APPPY",
  env: process.env.NEXT_PUBLIC_ALGOLIA_ENV ?? "prod",
} as const;

export function getAlgoliaExperienceScriptUrl() {
  const params = new URLSearchParams({
    appId: ALGOLIA_EXPERIENCE.appId,
    apiKey: ALGOLIA_EXPERIENCE.apiKey,
    experienceId: ALGOLIA_EXPERIENCE.experienceId,
    env: ALGOLIA_EXPERIENCE.env,
  });
  return `https://cdn.jsdelivr.net/npm/@algolia/experiences/dist/experiences.js?${params.toString()}`;
}
