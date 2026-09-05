export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  applyUrl: string | null;
  status: "representative" | "verified";
};
