// types/index.ts

// Common pagination interface that can be reused across responses
export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// Services types
export interface Service {
  id: number;
  documentId: string;
  Title: string;
  Slug: string;
  Description: string;
  Icon: string;
  Featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ServicesResponse {
  data: Service[];
  meta: {
    pagination: Pagination;
  }
}

// Clients/Testimonials types
export interface ImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface ProfileImage {
  id: number;
  url: string;
  formats: {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    large: ImageFormat;
  };
  alternativeText: string;
}

export interface Client {
  id: number;
  documentId: string;
  Position: string;
  Company: string;
  Feedback: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  FirstName: string;
  LastName: string;
  Profile?: ProfileImage;
}

export interface ClientsResponse {
  data: Client[];
  meta: {
    pagination: Pagination;
  }
}

// Define types for team member data based on actual API response
export interface TeamMember {
  id: number;
  Email: string;
  FirstName: string;
  LastName: string;
  Position: string;
  WhatsappURL: string;
  PhoneNumber: string;
  Profile?: {
    id: number;
    url: string;
    formats: {
      thumbnail: {
        url: string;
        width: number;
        height: number;
      };
      small: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      large: {
        url: string;
        width: number;
        height: number;
      };
    };
    alternativeText: string;
  };
}

export interface TeamMembersResponse {
  data: TeamMember[];
  meta: {
    pagination: Pagination;
  }
}