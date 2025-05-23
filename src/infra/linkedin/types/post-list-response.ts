export interface LinkedInPostListResponse {
  data: {
    searchDashClustersByAll: {
      paging: {
        total: number;
        count: number;
        start: number;
      };
      elements: PostClusterElement[];
    };
  };
}

export interface PostClusterElement {
  items: PostItemWrapper[];
}

export interface PostItemWrapper {
  item: {
    entityResult: PostEntityResult | null;
  };
}

export interface PostEntityResult {
  trackingUrn: string; // Ex: "urn:li:activity:7331152903023325184"
  title: {
    text: string; // Nome do autor (empresa ou pessoa)
  };
  summary: {
    text: string; // Texto da publicação
  };
  navigationUrl: string; // Link para a publicação
  secondarySubtitle?: {
    text: string; // Ex: "30m •", "1d •", etc.
  };
}
