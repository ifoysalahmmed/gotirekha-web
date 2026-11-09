import { CloseButton, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

import { t } from '../texts/t.js';

interface SearchFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onSearch: (value: string) => void;
}

const SEARCH_DELAY_MS = 300;

export const SearchField = ({
  label,
  placeholder,
  value,
  onSearch,
}: SearchFieldProps) => {
  const [text, setText] = useState(value);
  const [shown, setShown] = useState(value);

  if (value !== shown) {
    setShown(value);

    if (value !== text.trim()) {
      setText(value);
    }
  }

  const search = useDebouncedCallback((next: string) => {
    onSearch(next.trim());
  }, SEARCH_DELAY_MS);

  const clearText = () => {
    search.cancel();
    setText('');
    onSearch('');
  };

  return (
    <TextInput
      role="searchbox"
      aria-label={label}
      placeholder={placeholder}
      value={text}
      maxLength={100}
      autoComplete="off"
      spellCheck={false}
      enterKeyHint="search"
      flex="1 1 280px"
      maw={{
        sm: 380,
      }}
      leftSection={<IconSearch size={16} stroke={2.2} aria-hidden />}
      rightSection={
        text === '' ? null : (
          <CloseButton
            size="sm"
            aria-label={t('list.clearSearch')}
            onClick={clearText}
          />
        )
      }
      onChange={(event) => {
        setText(event.currentTarget.value);
        search(event.currentTarget.value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          search.flush();
        }

        if (event.key === 'Escape' && text !== '') {
          clearText();
        }
      }}
    />
  );
};
