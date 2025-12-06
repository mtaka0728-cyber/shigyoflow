"use client";
import { useState } from "react";

type Client = {
  company: string;
  contact: string;
  address: string;
  email: string;
  phone: string;
};

const clients: Client[] = [
  {
    company: "A株式会社",
    contact: "田中 太郎",
    address: "東京都千代田区丸の内1-1-1",
    email: "tanaka@example.com",
    phone: "03-1234-5678",
  },
  {
    company: "B商事",
    contact: "佐藤 花子",
    address: "東京都千代田区丸の内1-1-1",
    email: "sato@example.com",
    phone: "03-2345-6789",
  },
  {
    company: "C工業",
    contact: "鈴木 一郎",
    address: "東京都千代田区丸の内1-1-1",
    email: "suzuki@example.com",
    phone: "03-3456-7890",
  },
];

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [clientList, setClientList] = useState<Client[]>(clients);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleAddClick = () => {
    const emptyClient: Client = {
      company: "",
      contact: "",
      address: "",
      email: "",
      phone: "",
    };
    
    setEditedClient(emptyClient);
    setSelectedClient(null);
    setIsAddMode(true);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDetailClick = (client: Client) => {
    setSelectedClient(client);
    setEditedClient(client);
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setIsEditMode(false);
    setEditedClient(null);
    setIsAddMode(false);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {
    if (selectedClient) {
      const confirmed = window.confirm(
        `${selectedClient.company} を削除してもよろしいですか？`
      );
      
      if (confirmed) {
        setClientList(clientList.filter(
          client => client.email !== selectedClient.email
        ));
        handleCloseModal();
      }
    }
  };

  const handleSave = () => {
    if (!editedClient) {
      return;
    }
    
    if (!editedClient.company || !editedClient.contact || !editedClient.email || !editedClient.phone) {
      alert("すべての項目を入力してください");
      return;
    }
    
    if (isAddMode) {
      setClientList([...clientList, editedClient]);
    } else {
      if (selectedClient) {
        setClientList(clientList.map(client => 
          client.email === selectedClient.email ? editedClient : client
        ));
        setSelectedClient(editedClient);
      }
    }
    
    setIsEditMode(false);
    setIsAddMode(false);
    setShowSuccessMessage(true);
    
    setTimeout(() => { 
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleInputChange = (field: keyof Client, value: string) => {
    if (editedClient) {
      setEditedClient({ ...editedClient, [field]: value });
    }
  };

  return (
    <div>
      {/* 🎯 ヘッダーは削除（共通レイアウトに移動） */}
      
      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            CLIENTS
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">顧客一覧</h1>
          <p className="mt-4 text-base text-slate-500">
            フォロー中の主要顧客カードを確認できます。ホバーして詳細をチェックしましょう。
          </p>
        </section>

        <button
          type="button"
          onClick={handleAddClick}
          className="mt-6 rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-green-700"
        >
          ＋ 新規追加
        </button>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clientList.map((client) => (
            <article
              key={client.email}
              className="group flex flex-col rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-slate-900">
                {client.company}
              </h2>
              <dl className="mt-5 space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    担当者
                  </dt>
                  <dd className="text-base text-slate-900">{client.contact}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    メール
                  </dt>
                  <dd className="font-mono text-sm text-slate-700">
                    {client.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    電話番号
                  </dt>
                  <dd className="text-base text-slate-900">{client.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    住所
                  </dt>
                  <dd className="text-base text-slate-900">{client.address}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => handleDetailClick(client)}
                className="mt-auto w-full rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow transition-colors duration-200 hover:bg-green-700"
              >
                詳細
              </button>
            </article>
          ))}
        </section>
      </main>

      {/* モーダル */}
      {isModalOpen && (selectedClient || isAddMode) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-3xl font-bold text-slate-900">
              {isAddMode ? "新規追加" : selectedClient?.company}
            </h2>

            <div className="mt-6 space-y-4">
              {!isEditMode ? (
                <>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      担当者
                    </dt>
                    <dd className="mt-1 text-lg text-slate-900">
                      {selectedClient?.contact}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      メール
                    </dt>
                    <dd className="mt-1 font-mono text-base text-slate-700">
                      {selectedClient?.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      電話番号
                    </dt>
                    <dd className="mt-1 text-lg text-slate-900">
                      {selectedClient?.phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      住所
                    </dt>
                    <dd className="mt-1 text-lg text-slate-900">
                      {selectedClient?.address}
                    </dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      会社名
                    </label>
                    <input
                      type="text"
                      value={editedClient?.company || ""}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      担当者
                    </label>
                    <input
                      type="text"
                      value={editedClient?.contact || ""}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      メール
                    </label>
                    <input
                      type="email"
                      value={editedClient?.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      value={editedClient?.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      住所
                    </label>
                    <input
                      type="text"
                      value={editedClient?.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                </>
              )}
            </div>

            {showSuccessMessage && (
              <div className="mt-8 text-center text-green-600">
                ✅保存しました！
              </div>
            )}

            <div className="mt-8 flex gap-3">
              {!isEditMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="flex-1 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-green-700"
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-red-700"
                  >
                    削除
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-300"
                  >
                    閉じる
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-green-700"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditMode(false);
                      setEditedClient(selectedClient);
                    }}
                    className="flex-1 rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-300"
                  >
                    キャンセル
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
