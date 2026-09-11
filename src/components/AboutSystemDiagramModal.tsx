import React, { useEffect } from 'react';
import {
  X,
  Info,
  User,
  MessageSquare,
  ListChecks,
  FileCode2,
  Sparkles,
  Server,
  FileText,
  RefreshCw,
  Download,
  KeyRound,
  HardDrive,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { Language } from '../types';

interface AboutSystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AboutSystemDiagramModal: React.FC<AboutSystemDiagramModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isZh = language === 'zh';

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-about-diagram-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        id="modal-about-diagram-content"
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] font-sans-clean animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 px-5 sm:px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 id="about-modal-title" className="text-base sm:text-lg font-semibold tracking-tight text-white">
                {isZh ? '关于与系统架构图' : 'About & System Architecture Diagram'}
              </h2>
              <p className="text-xs text-stone-400">
                {isZh
                  ? '端到端组件数据流、Gemini 智能体执行循环与运行时安全边界'
                  : 'End-to-end component flow, Gemini agent execution loop, and runtime boundaries'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-about-modal"
            onClick={onClose}
            aria-label={isZh ? '关闭架构图模态框' : 'Close About & System Diagram modal'}
            className="text-stone-400 hover:text-stone-200 p-2 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Legend */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              {isZh ? '组件类型图例' : 'Component Type Legend'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-100/70 border border-amber-300/80 text-amber-950 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">{isZh ? '用户交互' : 'User Interaction'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-200/70 border border-stone-300 text-stone-800 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-500 shrink-0" />
                <span className="truncate">{isZh ? '应用界面' : 'Application Interface'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-100/70 border border-purple-300 text-purple-950 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                <span className="truncate">{isZh ? '智能体行为' : 'Agent Behavior'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-950 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="truncate">{isZh ? '服务端基础设施' : 'Server-side Infrastructure'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-100/70 border border-sky-300 text-sky-950 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shrink-0" />
                <span className="truncate">{isZh ? '外部 Gemini API' : 'External Gemini API'}</span>
              </div>
            </div>
          </div>

          {/* Linear Primary Flow Pipeline Diagram */}
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-900 text-stone-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-stone-200">
                  {isZh ? '主要流向管线' : 'Primary Flow'}
                </h3>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                {isZh ? '用户引导的线性闭环' : 'User-Guided Linear Cycle'}
              </span>
            </div>

            <div className="text-xs text-stone-400 mb-2">
              {isZh
                ? '用户 → 信息收集与对话 → 输入校验 → 辞职信智能体 → 信件草稿 → 用户审核 → 修改或最终确认'
                : 'User → Intake and Conversation → Input Validation → Resignation Ghostwriter Agent → Letter Draft → User Review → Revision or Final Confirmation'}
            </div>

            {/* Visual Flow Blocks */}
            <div className="flex flex-wrap items-center gap-2 py-1">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs shrink-0">
                <User className="w-3.5 h-3.5" />
                <span>{isZh ? '1. 用户' : '1. User'}</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 hidden sm:inline" />
              <ArrowDown className="w-3.5 h-3.5 text-stone-500 shrink-0 sm:hidden" />

              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 font-medium text-xs shrink-0">
                <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                <span>{isZh ? '2. 信息收集与对话' : '2. Intake & Conversation'}</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 hidden sm:inline" />
              <ArrowDown className="w-3.5 h-3.5 text-stone-500 shrink-0 sm:hidden" />

              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-950/60 border border-purple-700/60 text-purple-300 font-medium text-xs shrink-0">
                <ListChecks className="w-3.5 h-3.5 text-purple-400" />
                <span>{isZh ? '3. 输入校验' : '3. Input Validation'}</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 hidden sm:inline" />
              <ArrowDown className="w-3.5 h-3.5 text-stone-500 shrink-0 sm:hidden" />

              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-950/60 border border-sky-700/60 text-sky-300 font-medium text-xs shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>{isZh ? '4. Ghostwriter 智能体' : '4. Ghostwriter Agent'}</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 hidden sm:inline" />
              <ArrowDown className="w-3.5 h-3.5 text-stone-500 shrink-0 sm:hidden" />

              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 font-medium text-xs shrink-0">
                <FileText className="w-3.5 h-3.5 text-stone-400" />
                <span>{isZh ? '5. 辞职信草稿' : '5. Letter Draft'}</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 hidden sm:inline" />
              <ArrowDown className="w-3.5 h-3.5 text-stone-500 shrink-0 sm:hidden" />

              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-medium text-xs shrink-0">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>{isZh ? '6. 用户审阅' : '6. User Review'}</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 hidden sm:inline" />
              <ArrowDown className="w-3.5 h-3.5 text-stone-500 shrink-0 sm:hidden" />

              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs shrink-0">
                <Download className="w-3.5 h-3.5" />
                <span>{isZh ? '7. 修改或确认定稿' : '7. Revision or Final Confirmation'}</span>
              </div>
            </div>
          </div>

          {/* Component Flow Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center justify-between">
              <span>{isZh ? '系统全部 9 个连接组件' : 'Connected System Components (All 9 Modules)'}</span>
              <span className="text-[11px] text-stone-500 font-normal">
                {isZh ? '交互式架构视图' : 'Interactive architecture view'}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. User */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border-2 border-amber-300/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                        1
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">{isZh ? '用户' : 'User'}</span>
                    </div>
                    <User className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isZh
                      ? '倾诉真实感受、职场实际遭遇、预期离职时间及边界偏好。'
                      : 'Provides raw feelings, unfiltered workplace experiences, intended end dates, and boundary preferences.'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-amber-900 font-semibold bg-amber-100/90 px-2 py-1 rounded">
                  {isZh ? '用户交互' : 'User Interaction'}
                </div>
              </div>

              {/* 2. Intake form and conversation interface */}
              <div className="p-3.5 rounded-xl bg-stone-100/80 border-2 border-stone-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-700 text-white font-bold text-xs flex items-center justify-center">
                        2
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">
                        {isZh ? '信息采集与对话界面' : 'Intake & Conversation'}
                      </span>
                    </div>
                    <MessageSquare className="w-4 h-4 text-stone-600" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isZh
                      ? '实时对话流（GhostwriterChat）、快捷回复建议与结构化起草弹窗（ComposerModal）。'
                      : 'Interactive chat feed (GhostwriterChat), quick suggestions, and structured intake form (ComposerModal).'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-stone-800 font-semibold bg-stone-200/90 px-2 py-1 rounded">
                  {isZh ? '应用界面' : 'Application Interface'}
                </div>
              </div>

              {/* 3. Required-information tracker and input validation */}
              <div className="p-3.5 rounded-xl bg-purple-50/70 border-2 border-purple-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        3
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">
                        {isZh ? '信息跟踪与校验' : 'Info Tracker & Validation'}
                      </span>
                    </div>
                    <ListChecks className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isZh
                      ? '严格的 4 项必要要素跟踪（核心原因、离职日期、边界设定、交接安排），杜绝默认臆想。'
                      : 'Strict 4-point tracker (Core Reason, Notice Timeline/Date, Boundaries, Handover). Starts 0/4; no assumed 2-week default.'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-purple-900 font-semibold bg-purple-100/90 px-2 py-1 rounded">
                  {isZh ? '智能体行为与校验' : 'Agent Behavior & Validation'}
                </div>
              </div>

              {/* 4. Role Card used as the agent's System Instructions */}
              <div className="p-3.5 rounded-xl bg-purple-50/70 border-2 border-purple-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        4
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">
                        {isZh ? '角色卡系统指令' : 'Role Card Instructions'}
                      </span>
                    </div>
                    <FileCode2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isZh
                      ? '嵌入式系统指令执行五步循环：共情倾听、单点追问、复述核心诉求、仅在确认后起草。'
                      : 'Embedded system prompt enforcing the 5-step loop: empathize, ask single clarifying question, reflect core message, draft only on "Yes".'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-purple-900 font-semibold bg-purple-100/90 px-2 py-1 rounded">
                  {isZh ? '智能体行为' : 'Agent Behavior'}
                </div>
              </div>

              {/* 5. Resignation Ghostwriter agent powered by Gemini */}
              <div className="p-3.5 rounded-xl bg-sky-50/70 border-2 border-sky-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                        5
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">
                        {isZh ? 'Ghostwriter 智能体' : 'Ghostwriter Agent'}
                      </span>
                    </div>
                    <Sparkles className="w-4 h-4 text-sky-600" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isZh
                      ? 'Gemini 2.5 Flash 驱动的辞职信撰写助手：把控语气、杜绝捏造事实、进行精准澄清。'
                      : 'Gemini 2.5 Flash model acting as the Ghostwriter: safeguards tone, prevents invented facts, and asks clarifying questions.'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-sky-900 font-semibold bg-sky-100/90 px-2 py-1 rounded">
                  {isZh ? '外部 Gemini API' : 'External Gemini API'}
                </div>
              </div>

              {/* 6. Server-side API endpoint */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border-2 border-emerald-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                        6
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">
                        {isZh ? '服务端 API 端点' : 'Server-side API'}
                      </span>
                    </div>
                    <Server className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isZh
                      ? '后端代理服务（/api/ghostwriter/chat, /api/letter/*），安全读取 process.env.GEMINI_API_KEY。'
                      : 'Backend proxy (/api/ghostwriter/chat, /api/letter/*). Accesses process.env.GEMINI_API_KEY.'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-emerald-900 font-semibold bg-emerald-100/90 px-2 py-1 rounded">
                  {isZh ? '服务端基础设施' : 'Server-side Infrastructure'}
                </div>
              </div>

              {/* 7. Letter draft */}
              <div className="p-3.5 rounded-xl bg-stone-100/80 border-2 border-stone-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-700 text-white font-bold text-xs flex items-center justify-center">
                        7
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">
                        {isZh ? '信件草稿纸张' : 'Letter Draft'}
                      </span>
                    </div>
                    <FileText className="w-4 h-4 text-stone-600" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isZh
                      ? '实时物理信纸预览（LetterSheet、StationeryBar），支持即时修改称呼、正文与署名。'
                      : 'Real-time document preview (LetterSheet, StationeryBar) with editable salutation, recipient, body, and signoff.'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-stone-800 font-semibold bg-stone-200/90 px-2 py-1 rounded">
                  {isZh ? '应用界面' : 'Application Interface'}
                </div>
              </div>

              {/* 8. User review and revision loop */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border-2 border-amber-300/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                        8
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">
                        {isZh ? '审核与修改闭环' : 'Review & Revision Loop'}
                      </span>
                    </div>
                    <RefreshCw className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isZh
                      ? '审阅核心要旨与草稿，通过侧边修改抽屉（AIAssistantDrawer）快速进行语气微调与润色。'
                      : 'User reviews core message reflection and draft; requests revisions or tone adjustments via AIAssistantDrawer.'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-amber-900 font-semibold bg-amber-100/90 px-2 py-1 rounded">
                  {isZh ? '用户交互' : 'User Interaction'}
                </div>
              </div>

              {/* 9. Final confirmation and export tools */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border-2 border-amber-300/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                        9
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">
                        {isZh ? '定稿锁定与导出' : 'Confirmation & Export'}
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isZh
                      ? '确认定稿印章、一键复制剪贴板、打印/另存为 PDF 以及 .txt 文本文档导出。'
                      : 'Approval lock button, 1-click clipboard copy, print preview/Save as PDF, and .txt download tools.'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-amber-900 font-semibold bg-amber-100/90 px-2 py-1 rounded">
                  {isZh ? '用户交互与界面' : 'User Interaction & Interface'}
                </div>
              </div>
            </div>
          </div>

          {/* Browser Request Pipeline & Server-Side API Key Isolation */}
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {isZh
                  ? '浏览器至服务端请求链路与 API 密钥安全隔离'
                  : 'Browser-to-Server Request Pipeline & API Key Security'}
              </span>
            </div>

            {/* Architecture Dataflow Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  {isZh ? '1. 浏览器客户端' : '1. Browser Client'}
                </span>
                <p className="text-xs text-stone-700 mb-2">
                  {isZh ? 'React 前端通过相对路径发起请求：' : 'Browser React app initiates HTTP requests via relative path:'}
                </p>
                <code className="text-[11px] font-mono bg-stone-100 text-stone-900 px-2 py-1 rounded block truncate">
                  POST /api/ghostwriter/chat
                </code>
                <p className="text-[11px] text-stone-500 mt-2">
                  {isZh ? '前端发送用户提示、聊天历史及已知要素。' : 'Client sends user prompt, chat history, and known inputs.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-emerald-300">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  {isZh ? '2. Express 服务端' : '2. Express / Serverless Backend'}
                </span>
                <p className="text-xs text-stone-700 mb-2">
                  {isZh ? '服务端从环境变量中安全读取密钥：' : 'Server accesses key from environment:'}
                </p>
                <div className="p-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-[11px] font-semibold mb-2">
                  process.env.GEMINI_API_KEY
                </div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
                  {isZh ? '仅限服务端 • 绝不发送至浏览器' : 'Server-Side Only • Never Sent to Browser'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-sky-300">
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block mb-1">
                  {isZh ? '3. 外部 Gemini API' : '3. External Gemini API'}
                </span>
                <p className="text-xs text-stone-700 mb-2">
                  {isZh ? '服务端调用 GoogleGenAI SDK 连接模型：' : 'Server instantiates GoogleGenAI SDK to contact Gemini:'}
                </p>
                <code className="text-[11px] font-mono bg-sky-50 text-sky-900 px-2 py-1 rounded block truncate">
                  new GoogleGenAI({'{ apiKey }'})
                </code>
                <p className="text-[11px] text-stone-500 mt-2">
                  {isZh ? '执行结构化 JSON Schema 提示并返回给后端。' : 'Executes structured JSON schema prompt and returns clean reply to backend.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>{isZh ? '严格的密钥隔离机制：' : 'Strict Key Isolation:'}</strong>{' '}
                {isZh
                  ? 'Gemini API 密钥仅在服务端安全环境变量中配置。绝无 VITE_ 前缀，绝不打包进客户端脚本中，且绝不在网络传输响应中泄露。'
                  : 'The Gemini API key is configured only in server environment variables. It is never prefixed with VITE_, never bundled into client JavaScript, and never exposed in network responses.'}
              </div>
            </div>
          </div>

          {/* Actual Storage & Data-Retention Behavior */}
          <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <HardDrive className="w-4 h-4 text-stone-600" />
              <span>{isZh ? '数据存储、传输规范与隐私保护' : 'Implemented Data Storage, Transmission & Privacy'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600 pt-1">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-900 block">
                  {isZh ? '浏览器本地持久化' : 'Browser Local Storage'}
                </span>
                <p>
                  {isZh
                    ? '信件草稿、对话历史与表单输入完全保存在您的本地浏览器 localStorage 中，不依赖远程账号。'
                    : 'Letters, drafts, conversation messages, and tracked inputs are persisted strictly in your local browser using window.localStorage.'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-900 block">
                  {isZh ? '无状态服务端中转' : 'Stateless Server Requests'}
                </span>
                <p>
                  {isZh
                    ? '服务端 API 不在数据库中持久化用户输入，不留存聊天日志。清除浏览器存储或点击“新建”即可重置全部状态。'
                    : 'The server-side API does not store user inputs in a database, maintain user accounts, or write chat records to server logs. Clearing browser storage or clicking "Fresh" wipes all active state.'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2 mt-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>{isZh ? '数据传输安全提示：' : 'Data Transmission Advisory:'}</strong>{' '}
                {isZh
                  ? '对话或起草表单中输入的文本会经由服务端接口发送至 Google Gemini API 以生成回复与辞职信草稿。请勿在文本中输入包含雇主专有密码、核心商业机密或个人敏感情报的信息。'
                  : "Text entered into the conversation or case form is sent across the server-side API to Google's Gemini API to generate responses and drafts. Users should not enter confidential employer credentials, proprietary trade secrets, or sensitive personal identification numbers."}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-5 sm:px-6 py-3.5 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>{isZh ? '辞职信 Ghostwriter 架构参考' : 'Resignation Ghostwriter Architecture Reference'}</span>
          <button
            id="btn-close-about-modal-footer"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-medium transition-colors cursor-pointer"
          >
            {isZh ? '关闭图表' : 'Close Diagram'}
          </button>
        </div>
      </div>
    </div>
  );
};

