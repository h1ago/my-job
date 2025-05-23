interface JobPostingCard {
  jobPostingUrn: string;
  jobPostingTitle: string;
  title: {
    text: string;
  };
  primaryDescription: {
    text: string;
  };
  secondaryDescription?: {
    text: string;
  };
  logo?: {
    attributes?: Array<{
      detailData?: {
        companyLogo?: {
          logo?: {
            vectorImage?: {
              rootUrl: string;
              artifacts: Array<{
                width: number;
                height: number;
                fileIdentifyingUrlPathSegment: string;
              }>;
            };
          };
        };
      };
    }>;
  };
  trackingId: string;
  footerItems?: Array<{
    type: "PROMOTED" | "LISTED_DATE" | "EASY_APPLY_TEXT";
    text?: {
      text: string;
    };
    timeAt?: number;
  }>;
}

interface JobCardUnion {
  jobPostingCard: JobPostingCard;
}

interface JobListElement {
  jobCardUnion: JobCardUnion;
}

export interface LinkedInJobListResponse {
  elements: JobListElement[];
  metadata?: {
    keywords?: string;
    geo?: {
      fullLocalizedName: string;
    };
  };
  paging: {
    total: number;
    count: number;
    start: number;
  };
}
