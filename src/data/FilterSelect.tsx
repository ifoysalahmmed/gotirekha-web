import {
  CheckIcon,
  Combobox,
  Group,
  InputBase,
  ScrollArea,
  useCombobox,
  type ComboboxItem,
} from '@mantine/core';

import { t } from '../texts/t.js';

interface FilterSelectProps {
  label: string;
  value: string;
  options: readonly ComboboxItem[];
  onChange: (value: string) => void;
}

const LIST_HEIGHT = 280;

export const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
    },
  });

  const chosen = options.find((option) => option.value === value)?.label ?? '';

  return (
    <Combobox
      store={combobox}
      position="bottom-start"
      width="max-content"
      onOptionSubmit={(next) => {
        onChange(next);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target targetType="button">
        <InputBase
          component="button"
          type="button"
          pointer
          w={{
            base: '100%',
            xs: 'auto',
          }}
          fw={500}
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => {
            combobox.toggleDropdown();
          }}
        >
          {t('list.filter', {
            label,
            value: chosen,
          })}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown miw={180}>
        <Combobox.Options aria-label={label}>
          <ScrollArea.Autosize mah={LIST_HEIGHT} type="scroll">
            {options.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option.value}
                active={option.value === value}
                aria-selected={option.value === value}
              >
                <Group gap="sm" justify="space-between" wrap="nowrap">
                  {option.label}
                  {option.value === value ? (
                    <CheckIcon size={12} aria-hidden />
                  ) : null}
                </Group>
              </Combobox.Option>
            ))}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
