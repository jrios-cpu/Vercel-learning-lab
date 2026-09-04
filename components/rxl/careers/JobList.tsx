"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Job } from "@/lib/rxl/types/jobs";

export function JobList({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const departments = useMemo(() => [...new Set(jobs.map((job) => job.department))].sort(), [jobs]);
  const locations = useMemo(() => [...new Set(jobs.map((job) => job.location))].sort(), [jobs]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const searchable = `${job.title} ${job.id} ${job.department} ${job.location} ${job.summary}`.toLowerCase();
      return (!normalized || searchable.includes(normalized)) && (!department || job.department === department) && (!location || job.location === location);
    });
  }, [department, jobs, location, query]);
  const clear = () => { setQuery(""); setDepartment(""); setLocation(""); };

  return (
    <div>
      <div className="rxl-job-filters" aria-label="Career filters">
        <label className="rxl-job-filter"><span>Search roles</span><input type="search" value={query} placeholder="Title, team, location, or role ID" onChange={(event) => setQuery(event.target.value)} /></label>
        <label className="rxl-job-filter"><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option value="">All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="rxl-job-filter"><span>Location</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">All locations</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="rxl-job-filter-summary" aria-live="polite"><span>{filtered.length} representative {filtered.length === 1 ? "role" : "roles"}</span>{(query || department || location) && <button type="button" onClick={clear}>Clear filters</button>}</div>
      {filtered.length ? (
        <div className="rxl-jobs-list">{filtered.map((job) => <Link className="rxl-job-row" href={`/careers/${job.slug}`} key={job.id}><div><span>{job.id}</span><h2>{job.title}</h2></div><div><span>{job.department}</span><strong>{job.location}</strong></div><div><span>{job.employmentType}</span><b aria-hidden="true">→</b></div></Link>)}</div>
      ) : (
        <div className="rxl-job-empty"><h2>No representative roles match those filters.</h2><p>Clear a filter to view the full Preview career inventory.</p><button type="button" className="rxl-btn rxl-btn-primary" onClick={clear}>Reset filters</button></div>
      )}
    </div>
  );
}
