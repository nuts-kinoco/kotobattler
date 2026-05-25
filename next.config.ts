import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 開発環境で外部IP/プロキシ経由のHMR接続を許可するための設定
  allowedDevOrigins: ['43.30.136.195']
};

export default nextConfig;
