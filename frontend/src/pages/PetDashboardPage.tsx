import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPet, feedPet } from '../api/pet';
import { usePetStore } from '../store/petStore';

export default function PetDashboardPage() {
  const { pet, setPet } = usePetStore();
  const [feeding, setFeeding] = useState(false);

  // 进页面就拉一次宠物状态——后端会顺带算好"这段时间该衰减多少"，拿到的就是最新数值。
  useEffect(() => {
    getMyPet().then(setPet);
  }, [setPet]);

  const handleFeed = () => {
    setFeeding(true);
    feedPet()
      .then(setPet)
      .finally(() => setFeeding(false));
  };

  if (!pet) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-md flex flex-col items-center gap-6 w-80">
        <h1 className="text-2xl font-semibold text-gray-800">{pet.name}</h1>
        <p className="text-gray-500">
          {pet.stage} · Lv.{pet.level}
          {pet.isSick && <span className="text-red-500 ml-2">生病了</span>}
        </p>

        <StatusBar label="饥饿" value={pet.hunger} />
        <StatusBar label="心情" value={pet.mood} />
        <StatusBar label="体力" value={pet.stamina} />

        <button
          onClick={handleFeed}
          disabled={feeding}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium disabled:opacity-50"
        >
          {feeding ? '喂食中...' : '喂食'}
        </button>

        <Link
          to="/game"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
        >
          去玩 Frogger
        </Link>
      </div>
    </div>
  );
}

function StatusBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-400" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
