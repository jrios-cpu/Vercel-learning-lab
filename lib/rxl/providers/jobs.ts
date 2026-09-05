import { JOBS } from "@/lib/rxl/data/jobs";
import type { Job } from "@/lib/rxl/types/jobs";
export interface JobsProvider { listJobs(): Promise<Job[]>; getJob(slug: string): Promise<Job | null>; }
const localJobsProvider: JobsProvider = { async listJobs() { return JOBS; }, async getJob(slug) { return JOBS.find((job) => job.slug === slug) ?? null; } };
export const jobsProvider: JobsProvider = localJobsProvider;
