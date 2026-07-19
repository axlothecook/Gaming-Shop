# Gaming shop backend
The REST API of the Gaming Shop, built with Express and MongoDB. Only the frontend server talks to it, over the private Docker network; the API has no public address at all.
<br />

## What it does
<ul> 
	<li>CRUD endpoints for games, genres and developers</li> 
	<li>search, filters and pagination</li> 
	<li>request validation with express-validator</li> 
	<li>image uploads: multer receives the file in memory and the backend stores it in Cloudflare R2; MongoDB keeps only the image link</li> 
	<li>image cleanup: swapping an image removes the old file from R2, and deleting an entry deletes its image too, so no orphaned files pile up</li> 
</ul>

There is no login: the shop is a smaller-scale demo.
<br />

## Why no graph here
The backend's place in the system is already drawn twice: the [frontend README](https://github.com/axlothecook/Gaming-shop-frontend/blob/main/README.md) shows how requests travel through it, and the [umbrella README](https://github.com/axlothecook/gameshop/blob/main/README.md) shows how the repos are connected. A third graph of this repo alone would just repeat those two, so this README skips it.
<br />

## The image storage story
Images originally lived on Supabase, but its free tier pauses projects after 7 days without traffic, which kept taking the images down. I migrated to Cloudflare R2 and wrote a small wrapper (storage.js) that keeps the old Supabase-style interface, so the controllers didn't have to change; they still call storage.from().upload() and remove(), but R2 answers now.
<br />

## Deployment
CI builds the arm64 Docker image and pushes it to GHCR on every push to main, but this repo's pipeline is build-only: the new image goes live with the next stack restart on the Pi. The pipeline family is explained in [homelab-ci-cd](https://github.com/axlothecook/homelab-ci-cd).
<br />

## Tech stack
[Node.js](https://nodejs.org) / [Express 5](https://expressjs.com): runtime and web framework (routing, middleware) <br />
[MongoDB](https://www.mongodb.com): stores the games, genres and developers as documents, including each item's image link <br />
[multer](https://github.com/expressjs/multer): parses the multipart image uploads, in memory <br />
[express-validator](https://express-validator.github.io): validates and sanitizes request input <br />
[Cloudflare R2](https://developers.cloudflare.com/r2/) via the [S3 SDK](https://github.com/aws/aws-sdk-js-v3): image file storage <br />
[morgan](https://github.com/expressjs/morgan): request logging in terminal<br />
[cors](https://github.com/expressjs/cors): cross-origin access<br />
[dotenv](https://github.com/motdotla/dotenv): env config<br />
[nodemon](https://nodemon.io): dev auto-restart for Express
