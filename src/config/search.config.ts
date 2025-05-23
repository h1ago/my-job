import { LinkedInSearchConfig } from "./types/LinkedInSearchConfig";

export const POST_FRONTEND: LinkedInSearchConfig = {
  query: '"vaga" and "vue.js"',
  criterias: [
    { keyword: "vue", weight: 10 },
    { keyword: "nuxt", weight: 8 },
    { keyword: "pinia", weight: 5 },
    { keyword: "vuex", weight: 5 },
  ],
  minScoreToNotify: 15,
  searchType: "post",
  filters: {
    dateRange: "past-24h",
    sortBy: "date_posted",
  },
};

const POST_BACKEND: LinkedInSearchConfig = {
  query: '"vaga" and "java"',
  criterias: [
    { keyword: "java", weight: 10 },
    { keyword: "spring", weight: 9 },
    { keyword: "hibernate", weight: 7 },
    { keyword: "jpa", weight: 6 },
    { keyword: "microservices", weight: 8 },
  ],
  minScoreToNotify: 20,
  searchType: "post",
  filters: {
    dateRange: "past-24h",
    sortBy: "date_posted",
  },
};

export const JOB_FRONTEND: LinkedInSearchConfig = {
  query: "Vue.js",
  criterias: [
    { keyword: "vue", weight: 10 },
    { keyword: "nuxt", weight: 8 },
    { keyword: "frontend", weight: 6 },
  ],
  minScoreToNotify: 20,
  searchType: "job",
  filters: {
    workTypes: ["remote"],
    timePosted: "past_24_hours",
  },
};

export const JOB_BACKEND: LinkedInSearchConfig = {
  query: "Java",
  criterias: [
    { keyword: "java", weight: 10 },
    { keyword: "spring", weight: 9 },
    { keyword: "backend", weight: 7 },
    { keyword: "api", weight: 6 },
    { keyword: "microservices", weight: 8 },
    { keyword: "sql", weight: 6 },
    { keyword: "postgresql", weight: 5 },
    { keyword: "mysql", weight: 5 },
  ],
  minScoreToNotify: 25,
  searchType: "job",
  filters: {
    workTypes: ["remote"],
    timePosted: "past_24_hours",
  },
};

export default [
  POST_FRONTEND,
  POST_BACKEND,
  JOB_FRONTEND,
  JOB_BACKEND,
] as LinkedInSearchConfig[];
