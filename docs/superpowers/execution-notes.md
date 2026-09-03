# RXL rebuild execution notes

Inline execution uses the `feature/rxl-site-rebuild` branch. The local sandbox cannot access npm/GitHub registries directly, so Vercel Preview is the authoritative dependency-install, test, lint, typecheck, and Next.js build environment for this branch.
