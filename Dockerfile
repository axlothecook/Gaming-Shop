# Start from the official Node.js 22 image (Linux + Node 22 LTS pre-installed).
# "-slim" = a trimmed-down Linux base: smaller image, fewer unused packages.
FROM node:22-slim

# Every command after this runs inside /app in the image's filesystem.
# Docker creates /app if it doesn't exist.
WORKDIR /app

# Copy ONLY the dependency manifests first (not the whole project yet).
# Why: Docker caches each layer. If your source code changes but
# package.json / package-lock.json don't, Docker reuses the cached
# "npm ci" layer below instead of reinstalling — much faster rebuilds.
COPY package.json package-lock.json ./

# Install dependencies FRESH, inside this Linux image.
# "npm ci" = clean install strictly from package-lock.json (exact,
# reproducible versions). "--omit=dev" skips devDependencies — the
# production image shouldn't carry dev-only packages (e.g. nodemon).
RUN npm ci --omit=dev

# Now copy the rest of the project source into /app.
# .dockerignore already excludes node_modules, .env, .git, etc.
COPY . .

# Document that the app listens on port 3000. EXPOSE is metadata only —
# it does not open or publish the port; that happens at run time.
EXPOSE 3000

# The command run when a CONTAINER starts (run time, not build time).
# Plain "node app.js" — NOT npm start (that runs nodemon, a dev-only
# file-watcher unsuitable for a container).
CMD ["node", "app.js"]
