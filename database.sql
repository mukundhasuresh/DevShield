-- Organizations (GitHub orgs/users who install the app)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  github_installation_id bigint unique not null,
  github_login text not null,
  github_type text not null, -- 'org' or 'user'
  plan text default 'free', -- 'free' | 'pro' | 'enterprise'
  created_at timestamptz default now()
);

-- Repositories
create table repositories (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id),
  github_repo_id bigint unique not null,
  full_name text not null, -- 'owner/repo'
  scanning_enabled boolean default true,
  created_at timestamptz default now()
);

-- Scans
create table scans (
  id uuid primary key default gen_random_uuid(),
  repo_id uuid references repositories(id),
  pr_number integer not null,
  pr_title text,
  pr_author text,
  status text default 'pending', -- 'pending' | 'scanning' | 'complete' | 'failed'
  risk_score integer,
  vuln_count integer default 0,
  critical_count integer default 0,
  high_count integer default 0,
  medium_count integer default 0,
  low_count integer default 0,
  scan_hash text, -- keccak256 hash
  ipfs_cid text,
  tx_hash text, -- Polygon transaction hash
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Vulnerabilities
create table vulnerabilities (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid references scans(id),
  vuln_type text not null, -- 'SECRET' | 'OWASP' | 'SUPPLY_CHAIN' | 'IAC_MISCONFIG'
  severity text not null,
  title text not null,
  description text,
  file_path text,
  line_number integer,
  cwe_id text,
  cvss_score numeric(3,1),
  ai_explanation text,
  fix_suggestion text,
  fixed_code text,
  created_at timestamptz default now()
);
