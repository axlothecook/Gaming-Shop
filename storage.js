// storage.js — drop-in replacement for supabase.js, backed by Cloudflare R2.
//
// R2 speaks the AWS S3 API, so we use @aws-sdk/client-s3. This module exposes
// the SAME shape the controllers already used with Supabase:
//
//   storage.from(bucket).upload(name, body, opts)  -> { data: { path }, error }
//   storage.from(bucket).update(name, body, opts)  -> same (S3 PutObject overwrites)
//   storage.from(bucket).getPublicUrl(path)        -> { data: { publicUrl } }
//   storage.from(bucket).remove([keys])            -> { data, error }
//
// so the controllers only have to swap their require() line.
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} = require('@aws-sdk/client-s3');
require('dotenv').config();

const ACCOUNT_ID  = process.env.R2_ACCOUNT_ID;        // 3a6e7e0...
const BUCKET      = process.env.R2_BUCKET;            // axlothecook-images
const PUBLIC_BASE = process.env.R2_PUBLIC_BASE;       // https://images.axlothecook.com
const PROJECT     = 'gameshop';                       // path prefix for THIS project

const s3 = new S3Client({
  region: 'auto',                                     // required by the SDK, ignored by R2
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  // R2 does not support the CRC32 checksum the AWS SDK started adding by default
  // in v3.729.0. Without these flags, uploads fail with:
  //   "Header 'x-amz-checksum-algorithm' with value 'CRC32' not implemented".
  // WHEN_REQUIRED = only add/validate checksums when the server demands it.
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

// The controllers pass the OLD supabase bucket name (e.g. 'games-user-photos').
// We turn it into an R2 object key: gameshop/games-user-photos/<name>
function keyFor(bucketName, name) {
  return `${PROJECT}/${bucketName}/${name}`;
}

function from(bucketName) {
  return {
    // Create a new object. Returns supabase-shaped { data: { path }, error },
    // where path = the FULL key so getPublicUrl + the imgName stored in Mongo
    // stay consistent and a later remove() can find it.
    async upload(name, body, opts = {}) {
      try {
        const key = keyFor(bucketName, name);
        await s3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: body,
          ContentType: opts.contentType,
        }));
        return { data: { path: key }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    // S3 has no separate "update" — PutObject overwrites an existing key.
    // The controllers call .update(existingImgName, ...); that imgName is
    // already a full key post-migration, so pass it through unchanged.
    async update(name, body, opts = {}) {
      try {
        const key = name.startsWith(`${PROJECT}/`) ? name : keyFor(bucketName, name);
        await s3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: body,
          ContentType: opts.contentType,
        }));
        return { data: { path: key }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    // No network call: with a custom domain, the public URL is just the
    // base + the object key. `path` here is the full key from upload/update.
    getPublicUrl(path) {
      return { data: { publicUrl: `${PUBLIC_BASE}/${path}` } };
    },

    // Delete one or more objects. `keys` may be full keys (the imgName stored
    // in Mongo) or bare names; normalize either way.
    async remove(keys) {
      try {
        const Objects = keys.map((k) => ({
          Key: k.startsWith(`${PROJECT}/`) ? k : keyFor(bucketName, k),
        }));
        await s3.send(new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects },
        }));
        return { data: {}, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
  };
}

module.exports = { from };
