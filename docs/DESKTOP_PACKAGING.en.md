# TimeFrame desktop packaging

The desktop runtime and packaging follow the AstroToo editor. Product identity, the `timeframe://app` origin, 800×1280 canvas, 128 template element slots, firmware protocol, and all bundled data belong to TimeFrame. The two apps have separate installation identities and user-data directories and can coexist.

## Local builds

Install Node.js 24 and run `npm ci`. Users of the finished installer do not need development tools.

| Command | Result |
| --- | --- |
| `npm run desktop:start` | Build and launch the desktop editor |
| `npm run desktop:make:win` | Windows x64 NSIS installer, built on Windows |
| `npm run desktop:make:mac -- --arm64` | Apple silicon DMG, built on macOS |
| `npm run desktop:make:mac -- --x64` | Intel DMG, built on macOS |
| `npm run desktop:make:mac:test -- --arm64` | Ad-hoc signed test DMG without notarization |

Outputs are in `out-desktop/`. File names are `TimeFrame-Watchface-Editor-<version>-win-x64-setup.exe` and `TimeFrame-Watchface-Editor-<version>-mac-<arch>.dmg`. On a Mac, open the DMG and drag **TimeFrame Watchface Editor** to **Applications**. Choose the DMG that matches your processor. The Windows wizard supports choosing the destination and installing desktop and Start menu shortcuts.

## Bundled resources and storage

Every public font, template configuration, image, and example is copied into the application. `npm run build` creates `dist/desktop-assets.json`, including byte counts and SHA-256 hashes of the product's own resources. Missing or changed build resources fail the build. Run `npm run desktop:verify -- out-desktop/win-unpacked/resources/app.asar` to verify the actual archive. The Templates page displays all shipped templates directly from this snapshot, with no category selection, template update button, or separate download step. Click to preview; double-click or use Apply to save an editable copy in My designs.

The built-in library contains only the **17 templates returned by `Device/GetDemoClockList` for the TimeFrame device** (DeviceId `300344410`). The previous 365-template library and its resource folders have been removed. The captured response, exact template IDs, original resource addresses, and hashes are recorded in `public/template/demo-catalog.json`. The starter design also comes from that response. Build validation rejects extra configurations or legacy template resources.

To refresh the maintainer snapshot, use `npm run templates:download` to stage the API response and all assets under `artifacts/timeframe-demo-staging`, inspect it, then run `node scripts/bundle-demo-templates.mjs --install`. Installation first creates a recovery copy under `artifacts/`, checks for concurrent edits, and replaces the template library. Recovery files are excluded from installers and Git source. For a changed snapshot, set `DIVOOM_TEMPLATE_STAGING` to a fresh directory name under `artifacts/` for both commands. `npm run templates:check` validates the installed snapshot without accessing the network. Application users never run the download or installation scripts.

Bundled assets are read from the application archive. Downloads go to `downloaded-assets` in the Electron user-data directory; they override shipped files without modifying the installation. Designs use the desktop origin's local storage. AstroToo data and browser data are separate. Reinstalling or uninstalling does not intentionally remove saved application data. Device and online store operations require a network connection.

The UI supports all existing interface languages. The initial language follows system settings; a manual selection persists. `version.json` records the build number; the pre-commit hook increments it. Hook installation preserves an existing custom hook; in that case use `npm run version:bump` in your own commit process.

## Validation

Run `npm run test:desktop`, `npm run build`, `npm run desktop:smoke`, and `npx electron scripts/smoke-workspace-ui.cjs`. After packaging, verify the ASAR and run `node scripts/smoke-packaged.cjs`. The packaged smoke test launches an isolated, hidden application and checks its actual renderer, fonts, templates, canvas, and storage. It does not contact a physical device. It also accepts a macOS app executable path.

## Signing and distribution

Local Windows builds are unsigned unless signing credentials are configured. Public Windows builds require `WIN_CERT_P12_BASE64` and `WIN_CERT_PASSWORD` repository secrets. Signed macOS releases require `APPLE_CERT_P12_BASE64`, `APPLE_CERT_PASSWORD`, `APPLE_API_KEY_BASE64`, `APPLE_API_KEY_ID`, `APPLE_API_ISSUER`, and `APPLE_TEAM_ID`. The Apple API key secret is the base64-encoded `.p8` content. The release workflow decodes it to a temporary file for notarization.

The `Desktop test installers` workflow builds Windows x64 and macOS arm64/x64 test installers, verifies their bundled resources, and uploads Actions artifacts. Test macOS builds use ad-hoc signatures and are not notarized. Such builds may be blocked by macOS security checks; normal user distribution should use a Developer ID signature and notarization.

The `Desktop release` workflow builds signed installers on a `v*` tag and publishes all three, plus SHA-256 checksums, to GitHub Releases. The `Publish verified desktop test installers` workflow can publish an already completed test build as a prerelease: provide that run ID, its full commit SHA, and a new release tag. It verifies the run and commit before downloading artifacts. No AstroToo build IDs, assets, credentials, or release tags are reused.

Share the repository's Releases link with users and place a direct versioned installer link in the README after publication. A private repository's releases require repository access. Do not add installers to Git source history.
