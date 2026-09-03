import Link from "next/link";
import type { Job } from "@/lib/rxl/types/jobs";
export function JobList({ jobs }: { jobs: Job[] }) { return <div className="rxl-jobs-list">{jobs.map((job) => <Link className="rxl-job-row" href={`/careers/${job.slug}`} key={job.id}><div><span>{job.id}</span><h2>{job.title}</h2></div><div><span>{job.department}</span><strong>{job.location}</strong></div><div><span>{job.employmentType}</span><b aria-hidden="true">→</b></div></Link>)}</div>; }
