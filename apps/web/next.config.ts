import type { NextConfig } from "next";

import { loadMonorepoEnv } from "./lib/monorepo-env";

loadMonorepoEnv(__dirname);

const nextConfig: NextConfig = {
  // 将来の拡張用。現時点では最小限の設定のみ。
};

export default nextConfig;
