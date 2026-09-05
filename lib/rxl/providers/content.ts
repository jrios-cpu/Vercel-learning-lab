import { articles, homeContent, industries, resources } from "@/lib/rxl/data/content";

export const contentProvider = {
  async getHome() {
    return homeContent;
  },
  async listIndustries() {
    return industries;
  },
  async getIndustry(slug: string) {
    return industries.find((industry) => industry.slug === slug) ?? null;
  },
  async listArticles() {
    return articles;
  },
  async getArticle(slug: string) {
    return articles.find((article) => article.slug === slug) ?? null;
  },
  async listResources() {
    return resources;
  },
};
