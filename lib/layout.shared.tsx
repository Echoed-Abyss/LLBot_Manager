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
    },
    githubUrl: 'https://github.com/Echoed-Abyss/LLBot_Manager',
  };
}
