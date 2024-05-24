import { Paper, TypographyStylesProvider } from '@mantine/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  children: string;
  bordered?: boolean;
};

const Markdown = React.memo(({ children, bordered }: Props) => {
  return (
    <TypographyStylesProvider>
      <Paper bg="transparent" p={bordered ? 'sm' : 0} withBorder={bordered} fz="sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
      </Paper>
    </TypographyStylesProvider>
  );
});

Markdown.displayName = 'Markdown';

export default Markdown;
