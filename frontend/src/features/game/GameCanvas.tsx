import { useEffect, useRef, useState } from 'react';

// 网格式 Frogger：横向 8 格，纵向 10 行，每格 50px。
const COLS = 8;
const ROWS = 10;
const CELL = 50;
const CANVAS_W = COLS * CELL;
const CANVAS_H = ROWS * CELL;
const START_ROW = ROWS - 1; // 青蛙的出生行（最下面）
const GOAL_ROW = 0; // 到这一行算过关
const START_COL = Math.floor(COLS / 2);
const START_LIVES = 3;

interface Obstacle {
  row: number;
  x: number;
  width: number;
  speed: number; // px/ms，正负表示左右方向
}

interface FinishResult {
  outcome: 'win' | 'lose';
  score: number;
}

interface GameCanvasProps {
  difficultyModifier: number;
  onFinish: (result: FinishResult) => void;
}

export default function GameCanvas({ difficultyModifier, onFinish }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lives, setLives] = useState(START_LIVES);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 这些是"游戏内部状态"，不需要触发 React 重渲染，所以用 ref 存，只有 lives 需要显示在 UI 上才用 state。
    const frog = { row: START_ROW, col: START_COL };
    let livesLeft = START_LIVES;
    let maxRowsCrossed = 0; // 用来算分：跨过的最远行数
    let finished = false;
    let rafId = 0;
    let lastTime = performance.now();
    const obstacles = createObstacles(difficultyModifier);

    const finish = (outcome: 'win' | 'lose') => {
      if (finished) return;
      finished = true;
      const score = maxRowsCrossed * 10 + (outcome === 'win' ? 50 : 0);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(rafId);
      onFinish({ outcome, score });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (finished) return;
      switch (e.key) {
        case 'ArrowUp':
          frog.row = Math.max(GOAL_ROW, frog.row - 1);
          break;
        case 'ArrowDown':
          frog.row = Math.min(START_ROW, frog.row + 1);
          break;
        case 'ArrowLeft':
          frog.col = Math.max(0, frog.col - 1);
          break;
        case 'ArrowRight':
          frog.col = Math.min(COLS - 1, frog.col + 1);
          break;
        default:
          return;
      }
      e.preventDefault();
      maxRowsCrossed = Math.max(maxRowsCrossed, START_ROW - frog.row);
      if (frog.row === GOAL_ROW) finish('win');
    };

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      // 障碍物移动，出界了从另一侧绕回来（不用一直创建/销毁对象）。
      for (const obs of obstacles) {
        obs.x += obs.speed * dt;
        if (obs.speed > 0 && obs.x > CANVAS_W) obs.x = -obs.width;
        if (obs.speed < 0 && obs.x + obs.width < 0) obs.x = CANVAS_W;
      }

      // 碰撞检测：青蛙所在行，有没有障碍物的横向区间盖住了青蛙的格子。
      const frogX = frog.col * CELL;
      const hit = obstacles.some(
        (obs) => obs.row === frog.row && frogX < obs.x + obs.width && frogX + CELL > obs.x,
      );
      if (hit && !finished) {
        livesLeft -= 1;
        setLives(livesLeft);
        frog.row = START_ROW;
        frog.col = START_COL;
        if (livesLeft <= 0) finish('lose');
      }

      // 绘制
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#bbf7d0';
      ctx.fillRect(0, GOAL_ROW * CELL, CANVAS_W, CELL);
      ctx.fillStyle = '#f87171';
      for (const obs of obstacles) {
        ctx.fillRect(obs.x, obs.row * CELL, obs.width, CELL - 4);
      }
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(frog.col * CELL + 5, frog.row * CELL + 5, CELL - 10, CELL - 10);

      if (!finished) rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('keydown', handleKeyDown);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(rafId);
    };
    // difficultyModifier 只在开局时用来生成障碍物，onFinish 由父组件用 useCallback 保持稳定引用，
    // 两者都不会在游戏进行中变化，所以这个 effect 只在挂载时跑一次。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-gray-600">剩余生命：{lives} · 方向键移动，撞到障碍物会扣命</p>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="border border-gray-300 rounded-lg"
      />
    </div>
  );
}

// 第 1~8 行放障碍物（第 0 行是终点，第 9 行是出生点），单双行方向相反，速度乘上 difficultyModifier。
function createObstacles(difficultyModifier: number): Obstacle[] {
  const obstacles: Obstacle[] = [];
  for (let row = 1; row < ROWS - 1; row++) {
    const direction = row % 2 === 0 ? 1 : -1;
    const baseSpeed = (0.03 + row * 0.005) * difficultyModifier; // px/ms
    const width = CELL * 1.5;
    obstacles.push({ row, x: 0, width, speed: direction * baseSpeed });
    obstacles.push({ row, x: CANVAS_W / 2, width, speed: direction * baseSpeed });
  }
  return obstacles;
}
