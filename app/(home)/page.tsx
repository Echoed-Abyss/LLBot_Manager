'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import {
  Server,
  ShieldCheck,
  Layers,
  Code2,
  Download,
  Zap,
} from 'lucide-react';
import './home.css';

const features = [
  {
    title: '多实例管理',
    description:
      '支持同时管理多个 LLBot 实例，每个实例独立端口、独立配置、独立 PMHQ 进程，互不干扰',
    icon: Layers,
  },
  {
    title: 'PMHQ 自动化',
    description:
      '原生 PMHQ 进程管理，自动从 GitHub 下载 PMHQ 二进制文件，自动启动/停止/端口检测，全程无需手动干预',
    icon: Zap,
  },
  {
    title: '代码保护',
    description:
      '核心逻辑通过 Cython 编译为原生扩展模块（.pyd），配合 PyInstaller 打包为单一可执行文件，有效防止代码泄露',
    icon: ShieldCheck,
  },
  {
    title: 'RESTful API',
    description:
      '提供完整的 HTTP API，支持实例创建、启动、停止、重启、删除等全生命周期管理，便于集成到任意系统',
    icon: Code2,
  },
  {
    title: '跨平台部署',
    description:
      '支持 Windows、Linux、macOS 三大平台，PMHQ 自动适配对应架构（x64 / ARM64），一次部署到处运行',
    icon: Server,
  },
  {
    title: '开箱即用',
    description:
      '下载解压即可运行，PMHQ 首次启动自动下载，QQ 路径自动检测，端口自动分配，零配置上手',
    icon: Download,
  },
] as const;

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const runCountRef = useRef(0);

  const runAway = useCallback(() => {
    const btn = ctaRef.current;
    if (!btn || runCountRef.current >= 3) return;
    runCountRef.current += 1;
    const maxX = window.innerWidth - btn.offsetWidth - 20;
    const maxY = window.innerHeight - btn.offsetHeight - 20;
    const randX = Math.floor(Math.random() * maxX);
    const randY = Math.floor(Math.random() * maxY);
    btn.style.position = 'fixed';
    btn.style.left = `${randX}px`;
    btn.style.top = `${randY}px`;
    btn.style.zIndex = '9999';
    btn.style.transition = 'left 0.3s ease, top 0.3s ease';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 },
    );

    const els = containerRef.current?.querySelectorAll('.fade-in');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main ref={containerRef} className="home-container">
      <div className="gradient-bg" />
      <div className="gradient-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="content-wrapper">
        <section className="hero-section">
          <div className="fade-in">
            <div className="hero-logo-wrapper">
              <svg
                className="hero-logo"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="60" cy="60" r="56" stroke="url(#grad)" strokeWidth="4" />
                <rect x="36" y="38" width="48" height="44" rx="8" fill="url(#grad)" opacity="0.15" />
                <rect x="36" y="38" width="48" height="44" rx="8" stroke="url(#grad)" strokeWidth="2.5" />
                <path d="M48 54H72M48 62H66M48 70H60" stroke="url(#grad)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="72" cy="70" r="3" fill="url(#grad)" />
                <defs>
                  <linearGradient id="grad" x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="hero-title">LLBot Manager</h1>
            <p className="hero-subtitle">LLBot 多实例管理器</p>
            <p className="hero-subtitle">
              一键管理多个 LLBot 实例，自动处理 PMHQ 进程、端口分配与配置隔离
            </p>
            <div className="cta-buttons">
              <Link
                href="/guide/install"
                className="cta-button"
                ref={ctaRef}
                onMouseEnter={runAway}
              >
                <Download size={20} />
                立即安装!
              </Link>
              <Link
                href="/guide/introduction"
                className="cta-button cta-secondary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                了解什么是 LLBot Manager
              </Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="features-title fade-in">为什么选择 LLBot Manager？</h2>
          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="feature-card fade-in">
                  <div className="feature-icon">
                    <Icon size={32} color="white" />
                  </div>
                  <h3 className="feature-card-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
