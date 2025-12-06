import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/shigyoflow', // ← コメントを外してリポジトリ名を設定
  images: {
    unoptimized: true, // 静的エクスポート用
  },
};

export default nextConfig;

