"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();// 現在のパスを取得

  // 現在のページかどうかを判定
  const isActive = (path: string) => {
    // basePath を除いたパスで比較
    const currentPath = pathname.replace('/shigyoflow', '');
    return currentPath === path || pathname === path;
  };

  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen bg-slate-100">
          {/* 🎯 サイドバー（左側固定） */}
          <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col">
            {/* ロゴエリア */}
            <div className="bg-emerald-700 px-6 py-5">
              <h1 className="text-xl font-bold text-white tracking-wide">
                ShigyoFlow
              </h1>
            </div>

            {/* ナビゲーションメニュー */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {/* 顧客一覧 */}
                <li>
                  <Link
                    href="clients"
                    className={`
                      flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all
                      ${
                        isActive("/clients")
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    顧客一覧
                  </Link>
                </li>

                {/* 案件ボード */}
                <li>
                  <Link
                    href="cases"
                    className={`
                      flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all
                      ${
                        isActive("/cases")
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    案件ボード
                  </Link>
                </li>
              </ul>
            </nav>

            {/* ユーザー情報（下部固定） */}
            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                  田
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">田中太郎</p>
                  <p className="text-xs text-slate-500">弁理士</p>
                </div>
              </div>
            </div>
          </aside>

          {/* 🎯 メインコンテンツエリア（サイドバーの右側） */}
          <div className="ml-64 flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}