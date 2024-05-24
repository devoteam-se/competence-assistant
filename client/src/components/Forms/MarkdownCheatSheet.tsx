import { IconSize } from '@/utils/icons';
import { Accordion, Anchor, List, Table, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type Element = { element: string; mdSyntax: string | string[] };

const MarkdownCheatSheet = () => {
  const { t } = useTranslation('session', { keyPrefix: 'markdown' });
  const elements: Element[] = [
    { element: 'Heading', mdSyntax: ['# H1', '## H2', '### H3'] },
    { element: 'Bold', mdSyntax: '**bold text**' },
    { element: 'Italic', mdSyntax: '*italicized text*' },
    { element: 'Blockquote', mdSyntax: `${'>'} blockquote` },
    { element: 'Ordered List', mdSyntax: ['1. First item', '2. Second item', '3. Third item'] },
    { element: 'Unordered List', mdSyntax: ['- First item', '- Second item', '- Third item'] },
    { element: 'Inline Code', mdSyntax: '`inline code`' },
    { element: 'Code Block', mdSyntax: ['```', 'code block', '```'] },
    { element: 'Horizontal Rule', mdSyntax: '---' },
    { element: 'Link', mdSyntax: '[title](https://www.example.com)' },
    { element: 'Image', mdSyntax: '![alt text](image.jpg)' },
  ];

  const renderArrayAsList = (arr: string[]): React.ReactNode => {
    const list = arr.map((item, index) => (
      <List.Item key={'md-listitem' + index} ff="Courier New, monospace" style={{ listStyle: 'none' }}>
        {item}
      </List.Item>
    ));
    return <List size="sm">{list}</List>;
  };

  return (
    <Accordion variant="separated">
      <Accordion.Item value="cheat-sheet">
        <Accordion.Control icon={<IconInfoCircle size={IconSize.md} />}>
          <Text size="xs">{t('hint')}</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Table mb={24}>
            <thead>
              <tr>
                <th>{t('element')}</th>
                <th>{t('syntax')}</th>
              </tr>
            </thead>
            <tbody>
              {elements.map((el, index) => (
                <tr key={'md-elements' + index}>
                  <td>{el.element}</td>
                  <td>
                    <Text ff="Courier New, monospace">
                      {Array.isArray(el.mdSyntax) ? renderArrayAsList(el.mdSyntax) : el.mdSyntax}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Text size="xs">
            {t('link')}
            <Anchor href="https://www.markdownguide.org/cheat-sheet/" target="_blank">
              markdownguide.org
            </Anchor>
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default MarkdownCheatSheet;
