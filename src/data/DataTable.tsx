import {
  Box,
  Checkbox,
  Group,
  Paper,
  Skeleton,
  Stack,
  Table,
  VisuallyHidden,
  type MantineBreakpoint,
} from '@mantine/core';
import type { MouseEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { t } from '../texts/t.js';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  visibleFrom?: MantineBreakpoint;
}

export interface RowLink {
  to: string;
  state?: unknown;
}

export interface RowSelection<T> {
  selected: ReadonlySet<string>;
  onChange: (selected: ReadonlySet<string>) => void;
  rowLabel: (row: T) => string;
}

interface DataTableProps<T> {
  label: string;
  columns: readonly Column<T>[];
  rows: readonly T[] | undefined;
  rowKey: (row: T) => string;
  card: (row: T) => ReactNode;
  actions?: (row: T) => ReactNode;
  rowLink?: (row: T) => RowLink;
  selection?: RowSelection<T>;
  stale: boolean;
  error: ReactNode | null;
  empty: ReactNode;
}

const PLACEHOLDER_ROWS = 5;

const PLACEHOLDER_CARDS = 3;

const placeholderWidths = ['70%', '45%', '60%', '35%', '50%'];

const placeholderWidth = (index: number): string =>
  placeholderWidths[index % placeholderWidths.length] ?? '50%';

const INTERACTIVE = 'a, button, input, select, textarea, [role="menuitem"]';

const clickedControl = (event: MouseEvent): boolean =>
  event.target instanceof Element && event.target.closest(INTERACTIVE) !== null;

const selectingText = (): boolean =>
  (window.getSelection()?.toString() ?? '') !== '';

const Frame = ({ children }: { children: ReactNode }) => (
  <Paper radius="lg" shadow="xs" bg="white">
    {children}
  </Paper>
);

const LoadingRows = <T,>({ columns }: { columns: readonly Column<T>[] }) => (
  <Box aria-busy="true">
    <VisuallyHidden role="status">{t('common.loading')}</VisuallyHidden>

    <Frame>
      <Box visibleFrom="sm" p="md">
        <Stack gap={22} py={6}>
          {Array.from(
            {
              length: PLACEHOLDER_ROWS,
            },
            (_, row) => (
              <Group key={row} gap="xl" wrap="nowrap">
                {columns.map((column, index) => (
                  <Skeleton
                    key={column.key}
                    h={12}
                    flex={1}
                    maw={placeholderWidth(row + index)}
                  />
                ))}
              </Group>
            ),
          )}
        </Stack>
      </Box>
    </Frame>

    <Stack hiddenFrom="sm" gap="sm">
      {Array.from(
        {
          length: PLACEHOLDER_CARDS,
        },
        (_, card) => (
          <Frame key={card}>
            <Stack gap={10} p="md">
              <Skeleton h={14} w="55%" />
              <Skeleton h={12} w="35%" />
              <Skeleton h={12} w="45%" />
            </Stack>
          </Frame>
        ),
      )}
    </Stack>
  </Box>
);

export const DataTable = <T,>({
  label,
  columns,
  rows,
  rowKey,
  card,
  actions,
  rowLink,
  selection,
  stale,
  error,
  empty,
}: DataTableProps<T>) => {
  const navigate = useNavigate();

  const openRow = (row: T) =>
    rowLink === undefined
      ? undefined
      : (event: MouseEvent) => {
          if (clickedControl(event) || selectingText()) {
            return;
          }

          const link = rowLink(row);

          if (event.ctrlKey || event.metaKey) {
            window.open(link.to, '_blank', 'noopener');

            return;
          }

          void navigate(link.to, {
            state: link.state,
          });
        };

  const linkCursor =
    rowLink === undefined
      ? undefined
      : {
          cursor: 'pointer',
        };

  if (error !== null) {
    return <Frame>{error}</Frame>;
  }

  if (rows === undefined) {
    return <LoadingRows columns={columns} />;
  }

  if (rows.length === 0) {
    return <Frame>{empty}</Frame>;
  }

  const keys = rows.map(rowKey);
  const selected = selection?.selected ?? new Set<string>();
  const chosenCount = keys.filter((key) => selected.has(key)).length;

  const toggleAll = () => {
    if (selection === undefined) {
      return;
    }

    const next = new Set(selection.selected);

    keys.forEach((key) => {
      if (chosenCount === keys.length) {
        next.delete(key);
      } else {
        next.add(key);
      }
    });

    selection.onChange(next);
  };

  const toggleRow = (key: string) => {
    if (selection === undefined) {
      return;
    }

    const next = new Set(selection.selected);

    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }

    selection.onChange(next);
  };

  return (
    <Box
      aria-busy={stale}
      opacity={stale ? 0.6 : 1}
      style={{
        transition: 'opacity 150ms',
      }}
    >
      <Box visibleFrom="sm">
        <Frame>
          <Table.ScrollContainer minWidth={720} type="native">
            <Table
              aria-label={label}
              verticalSpacing={8}
              horizontalSpacing="md"
              borderColor="gray.1"
              highlightOnHover
              highlightOnHoverColor="gray.0"
              fz="sm"
            >
              <Table.Thead>
                <Table.Tr>
                  {selection === undefined ? null : (
                    <Table.Th w={48} pr={0}>
                      <Checkbox
                        aria-label={t('list.selectAll')}
                        checked={chosenCount === keys.length}
                        indeterminate={
                          chosenCount > 0 && chosenCount < keys.length
                        }
                        onChange={toggleAll}
                      />
                    </Table.Th>
                  )}
                  {columns.map((column) => (
                    <Table.Th
                      key={column.key}
                      visibleFrom={column.visibleFrom ?? 'sm'}
                      fz="xs"
                      fw={600}
                      c="gray.6"
                    >
                      {column.header}
                    </Table.Th>
                  ))}
                  {actions === undefined ? null : (
                    <Table.Th w={56}>
                      <VisuallyHidden>{t('common.actions')}</VisuallyHidden>
                    </Table.Th>
                  )}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((row) => (
                  <Table.Tr
                    key={rowKey(row)}
                    {...(selected.has(rowKey(row))
                      ? {
                          bg: 'emerald.0',
                        }
                      : {})}
                    onClick={openRow(row)}
                    style={linkCursor}
                  >
                    {selection === undefined ? null : (
                      <Table.Td
                        pr={0}
                        onClick={(event) => {
                          event.stopPropagation();

                          if (event.target === event.currentTarget) {
                            toggleRow(rowKey(row));
                          }
                        }}
                      >
                        <Checkbox
                          aria-label={selection.rowLabel(row)}
                          checked={selected.has(rowKey(row))}
                          onChange={() => {
                            toggleRow(rowKey(row));
                          }}
                        />
                      </Table.Td>
                    )}
                    {columns.map((column) => (
                      <Table.Td
                        key={column.key}
                        visibleFrom={column.visibleFrom ?? 'sm'}
                      >
                        {column.cell(row)}
                      </Table.Td>
                    ))}
                    {actions === undefined ? null : (
                      <Table.Td py={0}>{actions(row)}</Table.Td>
                    )}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Frame>
      </Box>

      <Stack
        component="ul"
        hiddenFrom="sm"
        gap="sm"
        m={0}
        p={0}
        aria-label={label}
      >
        {rows.map((row) => (
          <Box component="li" key={rowKey(row)} display="block">
            <Frame>
              <Group
                align="flex-start"
                justify="space-between"
                gap="xs"
                wrap="nowrap"
                p="md"
                pr="xs"
                onClick={openRow(row)}
                style={linkCursor}
              >
                <Box flex={1} miw={0}>
                  {card(row)}
                </Box>
                {actions?.(row)}
              </Group>
            </Frame>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
