"use client";

import { useState, useEffect } from "react";
import { getTodayQuestion, Question } from "@/data/questions";
import Link from "next/link";

// 像素风 Logo 组件
function PixelLogo() {
  return (
    <div className="text-center mb-8">
      <h1 className="pixel-title text-3xl md:text-4xl text-[#e94560] pixel-glitch mb-2">
        此 岸
      </h1>
      <p className="font-mono text-[#8b8b8b] text-sm tracking-widest">
        CIAN
      </p>
      <p className="text-[#f39c12] text-sm mt-2 font-kuaile">
        此岸已渡，彼岸未知
      </p>
    </div>
  );
}

// 参与人数计数器
function ParticipantCount() {
  const [count, setCount] = useState(12847);

  useEffect(() => {
    // 模拟实时增长
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3 + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#16213e] border border-[#4a4a6a]">
        <span className="text-[#2ecc71] pixel-loading">●</span>
        <span className="text-[#8b8b8b] text-sm font-mono">
          <span className="text-[#eaeaea] font-bold">{count.toLocaleString()}</span>
          {" "}人已做出选择
        </span>
      </div>
    </div>
  );
}

// 题目卡片
function QuestionCard({ question }: { question: Question }) {
  return (
    <div className="pixel-card p-6 md:p-8 mb-8">
      {/* 题号标签 */}
      <div className="flex items-center gap-3 mb-4">
        <span className="pixel-tag">第 {question.id} 题</span>
        <span className="text-[#f39c12] text-xs font-mono">今日选择</span>
      </div>

      {/* 题目内容 */}
      <div className="text-lg md:text-xl leading-relaxed whitespace-pre-line text-[#eaeaea]">
        {question.title}
      </div>
    </div>
  );
}

// 选项按钮
function OptionButton({
  option,
  type,
  onClick,
}: {
  option: string;
  type: "A" | "B";
  onClick: () => void;
}) {
  const colors = type === "A" 
    ? "bg-gradient-to-b from-[#e94560] to-[#c73e54] border-[#ff6b81] border-t-[#a3354d] border-l-[#a3354d]"
    : "bg-gradient-to-b from-[#0f3460] to-[#0a2540] border-[#1e5a9e] border-t-[#083050] border-l-[#083050]";

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 md:p-6 text-left border-4 transition-all duration-150
        hover:scale-[1.02] active:scale-[0.98] cursor-pointer
        ${colors}
      `}
    >
      <div className="flex items-start gap-4">
        <span className={`
          font-mono text-2xl md:text-3xl font-bold
          ${type === "A" ? "text-[#ff6b81]" : "text-[#3498db]"}
        `}>
          {type}
        </span>
        <span className="text-[#eaeaea] text-base md:text-lg leading-relaxed flex-1">
          {option}
        </span>
      </div>
    </button>
  );
}

// 底部提示
function BottomHint() {
  return (
    <div className="text-center mt-8">
      <p className="text-[#8b8b8b] text-sm font-mono">
        选择后，你可以看到自己这条路的结局
      </p>
      <p className="text-[#f39c12] text-xs mt-2">
        想看另一条路？看完广告解锁
      </p>
    </div>
  );
}

export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);

  useEffect(() => {
    // 根据日期获取今日题目
    const todayQ = getTodayQuestion();
    setQuestion(todayQ);
  }, []);

  const handleSelect = (option: "A" | "B") => {
    setSelectedOption(option);
  };

  // 如果已选择，跳转到结果页
  if (selectedOption && question) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <ResultPage 
          question={question} 
          selectedOption={selectedOption} 
          onBack={() => setSelectedOption(null)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <PixelLogo />
        <ParticipantCount />

        {question && (
          <>
            <QuestionCard question={question} />

            <div className="space-y-4">
              <OptionButton
                option={question.optionA}
                type="A"
                onClick={() => handleSelect("A")}
              />
              <OptionButton
                option={question.optionB}
                type="B"
                onClick={() => handleSelect("B")}
              />
            </div>

            <BottomHint />
          </>
        )}
      </div>
    </main>
  );
}

// 结果页面组件
function ResultPage({
  question,
  selectedOption,
  onBack,
}: {
  question: Question;
  selectedOption: "A" | "B";
  onBack: () => void;
}) {
  const [showAdResult, setShowAdResult] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adProgress, setAdProgress] = useState(0);

  const ending = selectedOption === "A" ? question.endingA : question.endingB;
  const otherEnding = selectedOption === "A" ? question.endingB : question.endingA;
  const selectedText = selectedOption === "A" ? question.optionA : question.optionB;

  // 模拟广告
  const playAd = () => {
    setIsAdPlaying(true);
    setAdProgress(0);
    
    const interval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAdPlaying(false);
          setShowAdResult(true);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  // 生成分享文本
  const shareText = `我在「此岸」做了这个选择：${selectedText.slice(0, 20)}...\n\n想知道你会怎么选吗？`;

  return (
    <div className="w-full max-w-2xl">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="mb-6 text-[#8b8b8b] hover:text-[#e94560] transition-colors flex items-center gap-2"
      >
        <span>←</span>
        <span>重新选择</span>
      </button>

      {/* 标题 */}
      <div className="text-center mb-6">
        <h2 className="pixel-title text-xl text-[#2ecc71] mb-2">
          此岸之路
        </h2>
        <p className="text-[#8b8b8b] text-sm">
          你的选择
        </p>
      </div>

      {/* 你选择的选项 */}
      <div className="pixel-card p-4 mb-6 bg-[#1a1a2e]">
        <div className="flex items-center gap-3">
          <span className={`
            font-mono text-xl font-bold
            ${selectedOption === "A" ? "text-[#e94560]" : "text-[#3498db]"}
          `}>
            {selectedOption}
          </span>
          <span className="text-[#eaeaea]">{selectedText}</span>
        </div>
      </div>

      {/* 结局时间线 */}
      <div className="space-y-6 mb-8">
        <TimelineItem year="1" content={ending.year1} active={true} />
        <TimelineItem year="3" content={ending.year3} />
        <TimelineItem year="5" content={ending.year5} />
        <TimelineItem year="10" content={ending.year10} />
      </div>

      {/* 广告区域 */}
      {!showAdResult ? (
        <div className="pixel-card p-6 text-center">
          <p className="text-[#f39c12] mb-4 font-mono text-sm">
            想知道另一条路？
          </p>
          
          {isAdPlaying ? (
            <div className="space-y-3">
              <div className="pixel-progress">
                <div 
                  className="pixel-progress-bar"
                  style={{ width: `${adProgress}%` }}
                />
              </div>
              <p className="text-[#8b8b8b] text-xs">
                正在解锁彼岸... {Math.round(adProgress)}%
              </p>
            </div>
          ) : (
            <button
              onClick={playAd}
              className="pixel-btn pixel-btn-success pixel-btn-large"
            >
              <span className="flex items-center gap-2">
                <span>▶</span>
                看广告解锁彼岸
              </span>
            </button>
          )}
        </div>
      ) : (
        /* 彼岸结局 */
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-4">
            <h3 className="pixel-title text-lg text-[#f39c12]">
              彼岸之路
            </h3>
            <p className="text-[#8b8b8b] text-xs mt-1">
              另一条你没走的路
            </p>
          </div>

          <div className="space-y-6">
            <TimelineItem year="1" content={otherEnding.year1} color="accent" />
            <TimelineItem year="3" content={otherEnding.year3} color="accent" />
            <TimelineItem year="5" content={otherEnding.year5} color="accent" />
            <TimelineItem year="10" content={otherEnding.year10} color="accent" />
          </div>
        </div>
      )}

      {/* 分享按钮 */}
      <div className="mt-8 text-center">
        <button className="pixel-btn pixel-btn-secondary">
          <span className="flex items-center gap-2">
            <span>↗</span>
            分享给朋友
          </span>
        </button>
      </div>

      {/* 明日再来提示 */}
      <div className="mt-8 text-center text-[#4a4a6a] text-sm">
        <p>明天还有新的选择等着你</p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// 时间线组件
function TimelineItem({
  year,
  content,
  active = false,
  color = "primary",
}: {
  year: string;
  content: string;
  active?: boolean;
  color?: "primary" | "accent";
}) {
  const dotColor = color === "primary" 
    ? "bg-[#e94560]" 
    : "bg-[#f39c12]";
  const lineColor = color === "primary"
    ? "border-[#4a4a6a]"
    : "border-[#6a5a3a]";

  return (
    <div className="timeline-item">
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-[#0a0a0f] bg-[#e94560]" 
           style={{ backgroundColor: color === "primary" ? "#e94560" : "#f39c12" }} />
      <div className={`pl-4 border-l-2 ${lineColor}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="pixel-tag" style={{ backgroundColor: color === "primary" ? "#e94560" : "#f39c12", color: "#0a0a0f" }}>
            第{year}年
          </span>
        </div>
        <p className="text-[#eaeaea] leading-relaxed text-base">
          {content}
        </p>
      </div>
    </div>
  );
}
