export interface LinkedInJobDetailResponse {
  data: {
    jobsDashJobPostingDetailSectionsByCardSectionTypes: {
      elements: JobPostingDetailElement[];
    };
  };
}

export interface JobPostingDetailElement {
  jobPostingDetailSection: JobPostingDetailSection[];
}

export interface JobPostingDetailSection {
  jobDescription?: {
    postedOnText: string | null;
    descriptionText: TextViewModel;
    jobPosting: {
      entityUrn: string;
      description: TextViewModel;
    };
  };
}

export interface TextViewModel {
  text: string;
}
