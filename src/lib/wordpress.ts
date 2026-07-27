import { GraphQLClient, gql } from "graphql-request";

const endpoint = process.env.WORDPRESS_API_URL || "http://localhost:8080/graphql";

export const graphQLClient = new GraphQLClient(endpoint);

// -----------------------------------------------------------------------------
// Blog Posts Interfaces & Queries
// -----------------------------------------------------------------------------

export interface FeaturedImageNode {
  sourceUrl: string;
  altText?: string;
}

export interface FeaturedImage {
  node: FeaturedImageNode;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage?: FeaturedImage | null;
}

export interface PostDetail extends Post {
  content: string;
}

interface GetAllPostsResponse {
  posts: {
    nodes: Post[];
  };
}

interface GetPostBySlugResponse {
  post: PostDetail | null;
}

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      id
      title
      slug
      content
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export async function getAllPosts(): Promise<Post[]> {
  try {
    const data = await graphQLClient.request<GetAllPostsResponse>(GET_ALL_POSTS);
    return data.posts?.nodes || [];
  } catch (error) {
    console.error("Error fetching posts from WordPress:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  try {
    const data = await graphQLClient.request<GetPostBySlugResponse>(GET_POST_BY_SLUG, {
      id: slug,
    });
    return data.post || null;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Job Listings Interfaces & Queries
// -----------------------------------------------------------------------------

export interface JobDetails {
  location?: string | null;
  jobType?: string | null;
  salaryRange?: string | null;
  apply?: string | null;
}

export interface JobListing {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  date?: string | null;
  jobDetails?: JobDetails | null;
}

export type JobDetail = JobListing;

interface GetAllJobsResponse {
  jobListings: {
    nodes: JobListing[];
  };
}

interface GetJobBySlugResponse {
  jobListing: JobDetail | null;
}

const GET_ALL_JOBS = gql`
  query GetAllJobs {
    jobListings(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        content
        date
        jobDetails {
          location
          jobType
          salaryRange
          apply
        }
      }
    }
  }
`;

const GET_JOB_BY_SLUG = gql`
  query GetJobBySlug($id: ID!) {
    jobListing(id: $id, idType: SLUG) {
      id
      title
      slug
      content
      date
      jobDetails {
        location
        jobType
        salaryRange
        apply
      }
    }
  }
`;

export async function getAllJobs(): Promise<JobListing[]> {
  try {
    const data = await graphQLClient.request<GetAllJobsResponse>(GET_ALL_JOBS);
    return data.jobListings?.nodes || [];
  } catch (error) {
    console.error("Error fetching job listings from WordPress:", error);
    return [];
  }
}

export async function getJobBySlug(slug: string): Promise<JobDetail | null> {
  try {
    const data = await graphQLClient.request<GetJobBySlugResponse>(GET_JOB_BY_SLUG, {
      id: slug,
    });
    return data.jobListing || null;
  } catch (error) {
    console.error(`Error fetching job listing with slug "${slug}":`, error);
    return null;
  }
}
