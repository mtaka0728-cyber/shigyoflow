'use client';

import { useState } from 'react';

type Case = {
  id: string;
  title: string;
  client: string;
  status: 'pending' | 'in_progress' | 'awaiting_client' | 'completed';
};

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([
    { id: '1', title: '特許出願A', client: '株式会社テック', status: 'pending' },
    { id: '2', title: '商標登録B', client: '山田商事', status: 'in_progress' },
    { id: '3', title: '意匠出願C', client: '株式会社テック', status: 'awaiting_client' },
    { id: '4', title: '特許調査D', client: '鈴木工業', status: 'completed' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Case>({
    id: '',
    title: '',
    client: '',
    status: 'pending',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCase, setNewCase] = useState<Omit<Case, 'id'>>({
    title: '',
    client: '',
    status: 'pending',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // ドラッグ&ドロップ用の状態
  const [draggedCase, setDraggedCase] = useState<Case | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);

  const statusLabels = {
    pending: '未着手',
    in_progress: '対応中',
    awaiting_client: '顧客確認待ち',
    completed: '完了',
  };

  const statusColors = {
    pending: 'bg-gray-100 border-gray-300',
    in_progress: 'bg-blue-50 border-blue-300',
    awaiting_client: 'bg-yellow-50 border-yellow-300',
    completed: 'bg-green-50 border-green-300',
  };

  // ドラッグ開始
  const handleDragStart = (e: React.DragEvent, caseItem: Case) => {
    setDraggedCase(caseItem);
    e.dataTransfer.effectAllowed = 'move';
  };

  // ドラッグ終了
  const handleDragEnd = () => {
    setDraggedCase(null);
    setDragOverStatus(null);
  };

  // ドラッグオーバー（列の上を通過中）
  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(status);
  };

  // ドラッグリーブ（列から離れた）
  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  // ドロップ（案件を列に配置）
  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (draggedCase && draggedCase.status !== newStatus) {
      // ステータスを更新
      setCases(cases.map(c => 
        c.id === draggedCase.id 
          ? { ...c, status: newStatus as Case['status'] }
          : c
      ));
      
      // 成功メッセージを表示
      setSaveMessage(`「${draggedCase.title}」を${statusLabels[newStatus as keyof typeof statusLabels]}に移動しました`);
      setTimeout(() => setSaveMessage(''), 3000);
    }
    
    setDraggedCase(null);
    setDragOverStatus(null);
  };

  // 案件カードクリック → 詳細表示
  const handleCaseClick = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setEditForm(caseItem);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // 編集モード切り替え
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // 編集内容の保存
  const handleSave = () => {
    setCases(cases.map(c => c.id === editForm.id ? editForm : c));
    setSelectedCase(editForm);
    setIsEditing(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // 削除確認ダイアログ表示
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // 削除実行
  const handleDeleteConfirm = () => {
    setCases(cases.filter(c => c.id !== selectedCase?.id));
    setShowDeleteConfirm(false);
    setIsModalOpen(false);
    setSelectedCase(null);
    setSaveMessage('案件を削除しました');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setShowSuccessMessage(false);
  };

  // 新規案件追加
  const handleAddCase = () => {
    const newId = String(Math.max(...cases.map(c => Number(c.id)), 0) + 1);
    setCases([...cases, { ...newCase, id: newId }]);
    setIsAddModalOpen(false);
    setNewCase({ title: '', client: '', status: 'pending' });
    setSaveMessage('新規案件を追加しました');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">案件ボード</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ＋ 新規案件
          </button>
        </div>

        {saveMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-4 gap-6">
          {Object.entries(statusLabels).map(([status, label]) => {
            const statusCases = cases.filter(c => c.status === status);
            const isDropTarget = dragOverStatus === status;
            
            return (
              <div
                key={status}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
                className={`bg-white rounded-lg shadow p-4 transition-all ${
                  isDropTarget ? 'ring-4 ring-blue-400 bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">{label}</h2>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                    {statusCases.length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {statusCases.map(caseItem => (
                    <div
                      key={caseItem.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, caseItem)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleCaseClick(caseItem)}
                      className={`p-4 rounded-lg border-2 cursor-move hover:shadow-md transition-all ${
                        statusColors[caseItem.status as keyof typeof statusColors]
                      } ${draggedCase?.id === caseItem.id ? 'opacity-50' : ''}`}
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">{caseItem.title}</h3>
                      <p className="text-sm text-gray-600">{caseItem.client}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 詳細モーダル */}
      {isModalOpen && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">案件詳細</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">案件名</label>
                  <p className="text-lg text-gray-800">{selectedCase.title}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">顧客名</label>
                  <p className="text-lg text-gray-800">{selectedCase.client}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">ステータス</label>
                  <p className="text-lg text-gray-800">{statusLabels[selectedCase.status]}</p>
                </div>

                {showSuccessMessage && (
                  <div className="mt-8 text-center text-green-600">
                    ✅保存しました！
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleEditToggle}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    編集
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    削除
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">案件名</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">顧客名</label>
                  <input
                    type="text"
                    value={editForm.client}
                    onChange={(e) => setEditForm({ ...editForm, client: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">ステータス</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Case['status'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">案件を削除しますか？</h3>
            <p className="text-gray-600 mb-6">
              「{selectedCase?.title}」を削除します。この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                削除
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新規案件追加モーダル */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">新規案件追加</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">案件名</label>
                <input
                  type="text"
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="例：特許出願E"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">顧客名</label>
                <input
                  type="text"
                  value={newCase.client}
                  onChange={(e) => setNewCase({ ...newCase, client: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="例：株式会社サンプル"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">初期ステータス</label>
                <select
                  value={newCase.status}
                  onChange={(e) => setNewCase({ ...newCase, status: e.target.value as Case['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddCase}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!newCase.title || !newCase.client}
                >
                  追加
                </button>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}