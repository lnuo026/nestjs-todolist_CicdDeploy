import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCanvas from '../features/game/GameCanvas';
import { startGame, finishGame, type FinishGameResult } from '../api/game';

type Phase = 'loading' | 'playing' | 'result';

export default function GamePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('loading');
  const [gameRunId, setGameRunId] = useState<string | null>(null);
  const [difficultyModifier, setDifficultyModifier] = useState(1);
  const [result, setResult] = useState<FinishGameResult | null>(null);

  useEffect(() => {
    startGame().then((res) => {
      setGameRunId(res.gameRunId);
      setDifficultyModifier(res.difficultyModifier);
      setPhase('playing');
    });
  }, []);

  // 用 useCallback 锁住引用，避免 GamePage 重渲染时把新的函数传给 GameCanvas，
  // 触发它内部 useEffect 重新挂载、把正在进行的游戏重置掉。
  const handleFinish = useCallback(
    (r: { outcome: 'win' | 'lose'; score: number }) => {
      if (!gameRunId) return;
      finishGame(gameRunId, r).then((res) => {
        setResult(res);
        setPhase('result');
      });
    },
    [gameRunId],
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
      <h1 className="text-2xl font-semibold text-gray-800">拓麻青蛙过河</h1>

      {phase === 'loading' && <p className="text-gray-500">加载中...</p>}

      {phase === 'playing' && (
        <GameCanvas difficultyModifier={difficultyModifier} onFinish={handleFinish} />
      )}

      {phase === 'result' && result && (
        <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center gap-3">
          <p className="text-xl font-medium">
            {result.outcome === 'win' ? '过河成功！' : '游戏结束'}
          </p>
          <p className="text-gray-600">得分：{result.score}</p>
          <p className="text-gray-600">
            经验 +{result.expGained}（当前等级 Lv.{result.petLevel}）
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
          >
            回到宠物主页
          </button>
        </div>
      )}
    </div>
  );
}
