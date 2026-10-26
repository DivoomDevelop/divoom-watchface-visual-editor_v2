const test = require("node:test");
const assert = require("node:assert/strict");

test("offline template thumbnails fall back to local backgrounds and stop on missing images", async () => {
  const { setTemplateThumbnail, templateThumbnailSources } = await import("../src/editor/templateThumbnail.js");
  const sources = templateThumbnailSources(286, { previewDir: "/template/33/", backgroundDir: "/template/15/" });
  assert.ok(sources.every(source => source.startsWith("/template/")));
  const image = { src: "", onerror: null, removed: false, remove() { this.removed = true; } };
  setTemplateThumbnail(image, sources);
  for (let attempt = 0; attempt < sources.length && image.src !== "/template/15/287.jpg"; attempt++) image.onerror();
  assert.equal(image.src, "/template/15/287.jpg");
  assert.equal(image.removed, false);
  while (image.onerror) image.onerror();
  assert.equal(image.removed, true);
});
