import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const gitConfig = {
  user: 'Echoed-Abyss',
  repo: 'LLBot_Manager',
  branch: 'main',
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'LLBot Manager',
      url: '/LLBot_Manager',
    },
    links: [
      { text: '文档', url: '/LLBot_Manager/guide/introduction' },
      { text: 'GitHub', url: 'https://github.com/Echoed-Abyss/LLBot_Manager' },
    ],
    githubUrl: 'https://github.com/Echoed-Abyss/LLBot_Manager',
  };
}
