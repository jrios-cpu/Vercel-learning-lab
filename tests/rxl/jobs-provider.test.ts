import { describe, expect, it } from "vitest";
import { jobsProvider } from "@/lib/rxl/providers/jobs";

describe("jobsProvider", () => {
  it("keeps representative openings explicitly non-live", async () => {
    const jobs = await jobsProvider.listJobs();
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs.every((job) => job.status === "representative")).toBe(true);
    expect(jobs.every((job) => job.applyUrl === null)).toBe(true);
  });

  it("resolves jobs by stable slug", async () => {
    const jobs = await jobsProvider.listJobs();
    expect(await jobsProvider.getJob(jobs[0].slug)).toEqual(jobs[0]);
  });
});
