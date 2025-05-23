export interface LinkedinJobFilters {
  workTypes?: WorkType[];
  jobTypes?: JobType[];
  experienceLevels?: ExperienceLevel[];
  timePosted?: TimePosted;
}

export type TimePosted =
  | "any_time"
  | "past_24_hours"
  | "past_week"
  | "past_month";
export const TimePostedMap: Record<Exclude<TimePosted, "any_time">, string> = {
  past_24_hours: "r86400",
  past_week: "r604800",
  past_month: "r2592000",
};

export type WorkType = "on_site" | "hybrid" | "remote";
export const WorkTypeMap: Record<WorkType, number> = {
  on_site: 1,
  remote: 2,
  hybrid: 3,
};

export type JobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "temporary"
  | "volunteer"
  | "other";
export const JobTypeMap: Record<JobType, string> = {
  full_time: "F",
  part_time: "P",
  contract: "C",
  internship: "I",
  temporary: "T",
  volunteer: "V",
  other: "O",
};

export type ExperienceLevel =
  | "internship"
  | "entry"
  | "associate"
  | "mid_senior"
  | "director"
  | "executive";
export const ExperienceLevelMap: Record<ExperienceLevel, number> = {
  internship: 1,
  entry: 2,
  associate: 3,
  mid_senior: 4,
  director: 5,
  executive: 6,
};
