import versionData from "../../version.json";

/** 构建号：每次 git commit 前由 pre-commit 钩子自动 +1。 */
export const APP_BUILD_NUMBER = Number(versionData?.build) > 0 ? Number(versionData.build) : 1;
