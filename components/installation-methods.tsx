'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { cn } from '@/lib/cn';

type Step = {
  title: string;
  detail: ReactNode;
  code?: string;
  note?: ReactNode;
};

type Method = {
  value: string;
  label: string;
  desc: ReactNode;
  features: string[];
  requirements: ReactNode[];
  steps: Step[];
};

type OSKey = 'windows' | 'linux' | 'macos';

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-fd-primary underline underline-offset-4 hover:text-fd-primary/80"
    >
      {children}
    </a>
  );
}

const methodsByOS: Record<OSKey, Method[]> = {
  windows: [
    {
      value: 'exe',
      label: '可执行文件版本（推荐）',
      desc: '下载即用，无需 Python 环境，核心代码已编译保护。',
      features: ['零依赖运行', 'Cython 代码保护', 'PyInstaller 打包', '开箱即用'],
      requirements: [
        'Windows 10 / Windows Server 2012 及以上',
        '64 位 NTQQ（官方原版）',
        <>LLBot Core（<ExternalLink href="https://github.com/LLOneBot/LuckyLilliaBot">GitHub 仓库</ExternalLink>）</>,
      ],
      steps: [
        {
          title: '下载发布包',
          detail: (
            <>
              前往{' '}
              <ExternalLink href="https://github.com/Echoed-Abyss/LLBot_Manager/releases">
                LLBot Manager Releases
              </ExternalLink>{' '}
              下载 <code>LLBot_Manager_Windows.zip</code>。
            </>
          ),
        },
        {
          title: '解压文件',
          detail: (
            <>
              将压缩包解压到固定目录，例如 <code>D:\LLBot_Manager</code>。
              解压后目录结构：
              <pre className="mt-2 text-xs overflow-x-auto rounded-lg border bg-fd-secondary p-3">
{`LLBot_Manager/
  dist/
    llbot_manager/
      llbot_manager.exe
      _internal/
  Core/  (LLBot 源码, git submodule)`}
              </pre>
            </>
          ),
        },
        {
          title: '启动管理器',
          detail: '双击运行 exe 或通过命令行启动（可指定端口）。',
          code: 'cd dist\\llbot_manager\nllbot_manager.exe --port 9090',
        },
        {
          title: '创建并启动实例',
          detail: '通过 API 创建第一个实例并启动，PMHQ 会自动下载。',
          code: 'curl -X POST http://127.0.0.1:9090/api/accounts ^\n  -H "Content-Type: application/json" ^\n  -d "{\\"name\\":\\"bot1\\"}"',
          note: '首次启动实例时会自动从 GitHub 下载 PMHQ 二进制文件，请耐心等待。',
        },
      ],
    },
  ],
  linux: [
    {
      value: 'python',
      label: 'Python 环境运行',
      desc: '适合 Linux 服务器部署，使用 Python + pip 安装依赖后运行。',
      features: ['轻量部署', '支持 x64 / ARM64', '适合服务器环境'],
      requirements: [
        'Python 3.10+',
        'Node.js 22+（Core 依赖）',
        <>LLBot Core（<ExternalLink href="https://github.com/LLOneBot/LuckyLilliaBot">GitHub 仓库</ExternalLink>）</>,
      ],
      steps: [
        {
          title: '克隆仓库',
          detail: '克隆 LLBot Manager 仓库（含 Core 子模块）。',
          code: 'git clone --recursive https://github.com/Echoed-Abyss/LLBot_Manager.git\ncd LLBot_Manager',
        },
        {
          title: '安装依赖',
          detail: '安装 Manager 运行所需的 Python 依赖。',
          code: 'pip install fastapi uvicorn[standard] pydantic psutil',
        },
        {
          title: '安装 Core 依赖',
          detail: '进入 Core 目录安装 LLBot 的 Node.js 依赖。',
          code: 'cd Core\nnpm install\ncd ..',
        },
        {
          title: '启动管理器',
          detail: '运行 Manager 并指定端口。',
          code: 'python run_manager.py --host 0.0.0.0 --port 9090',
          note: '建议使用 screen 或 systemd 保持后台运行。',
        },
      ],
    },
  ],
  macos: [
    {
      value: 'python',
      label: 'Python 环境运行',
      desc: '适合 macOS 本地开发或部署。',
      features: ['支持 Apple Silicon', '本地开发友好'],
      requirements: [
        'Python 3.10+',
        'Node.js 22+（Core 依赖）',
        <>LLBot Core（<ExternalLink href="https://github.com/LLOneBot/LuckyLilliaBot">GitHub 仓库</ExternalLink>）</>,
      ],
      steps: [
        {
          title: '克隆仓库',
          detail: '克隆 LLBot Manager 仓库。',
          code: 'git clone --recursive https://github.com/Echoed-Abyss/LLBot_Manager.git\ncd LLBot_Manager',
        },
        {
          title: '安装依赖',
          detail: '安装 Python 和 Node.js 依赖。',
          code: 'pip install fastapi uvicorn[standard] pydantic psutil\ncd Core && npm install && cd ..',
        },
        {
          title: '启动管理器',
          detail: '运行 Manager。',
          code: 'python run_manager.py --port 9090',
        },
      ],
    },
  ],
};

const osOptions: { value: OSKey; label: string }[] = [
  { value: 'windows', label: 'Windows' },
  { value: 'linux', label: 'Linux' },
  { value: 'macos', label: 'macOS' },
];

function CopyCodeButton({ code }: { code: string }) {
  const [checked, onClick] = useCopyButton(() =>
    navigator.clipboard.writeText(code),
  );

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({
          color: 'ghost',
          size: 'icon-sm',
          className: 'absolute right-2 top-2',
        }),
      )}
      aria-label="复制命令"
      title="复制命令"
      type="button"
    >
      {checked ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function StepCode({ code }: { code: string }) {
  return (
    <div className="relative mt-3">
      <pre className="overflow-x-auto rounded-lg border bg-fd-secondary p-3 text-xs leading-5 sm:text-sm">
        <code>{code}</code>
      </pre>
      <CopyCodeButton code={code} />
    </div>
  );
}

export function InstallationMethods() {
  const [os, setOS] = useState<OSKey>('windows');

  const currentMethod = methodsByOS[os][0];

  return (
    <div className="not-prose my-6 space-y-5">
      <Card title="" description="">
        <div className="mt-6 grid gap-3 sm:grid-cols-1">
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-fd-foreground">选择操作系统</span>
            <select
              className="w-full rounded-lg border bg-fd-background px-3 py-2 text-sm outline-none transition-colors focus:border-fd-primary"
              value={os}
              onChange={(event) => setOS(event.target.value as OSKey)}
            >
              {osOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <Card title="" description="">
        <div className="mt-6 space-y-5">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-fd-foreground">
              {currentMethod.label}
            </h4>
            <p className="text-sm text-fd-muted-foreground">
              {currentMethod.desc}
            </p>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-fd-foreground">
              特性
            </h4>
            <ul className="grid gap-1 text-sm text-fd-muted-foreground">
              {currentMethod.features.map((feature) => (
                <li key={feature}>- {feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-fd-foreground">
              系统要求
            </h4>
            <ul className="grid gap-1 text-sm text-fd-muted-foreground">
              {currentMethod.requirements.map((requirement, i) => (
                <li key={i}>- {requirement}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-fd-foreground">
              安装步骤
            </h4>
            <Cards className="grid-cols-1">
              {currentMethod.steps.map((step, index) => (
                <Card
                  key={`${currentMethod.value}-${step.title}`}
                  title={`${index + 1}. ${step.title}`}
                  description={step.detail}
                >
                  {step.code ? <StepCode code={step.code} /> : null}
                  {step.note ? (
                    <p className="mt-3 rounded-lg border-l-2 border-fd-primary bg-fd-secondary/60 p-2 text-xs text-fd-muted-foreground sm:text-sm">
                      提示：{step.note}
                    </p>
                  ) : null}
                </Card>
              ))}
            </Cards>
          </div>
        </div>
      </Card>
    </div>
  );
}
