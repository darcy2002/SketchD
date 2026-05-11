export const TOOLTIP_MAP: Record<string, string> = {
  // spacing
  'p-0': 'padding: 0', 'p-1': 'padding: 4px', 'p-2': 'padding: 8px',
  'p-3': 'padding: 12px', 'p-4': 'padding: 16px', 'p-5': 'padding: 20px',
  'p-6': 'padding: 24px', 'p-8': 'padding: 32px', 'p-10': 'padding: 40px',
  'p-12': 'padding: 48px',
  'px-2': 'padding left+right: 8px', 'px-4': 'padding left+right: 16px',
  'px-6': 'padding left+right: 24px', 'px-8': 'padding left+right: 32px',
  'py-2': 'padding top+bottom: 8px', 'py-4': 'padding top+bottom: 16px',
  'py-6': 'padding top+bottom: 24px',
  'm-0': 'margin: 0', 'm-2': 'margin: 8px', 'm-4': 'margin: 16px',
  'm-6': 'margin: 24px', 'm-8': 'margin: 32px',
  'mx-auto': 'center horizontally', 'mx-4': 'margin left+right: 16px',
  'my-4': 'margin top+bottom: 16px',
  'gap-1': 'gap: 4px', 'gap-2': 'gap: 8px', 'gap-3': 'gap: 12px',
  'gap-4': 'gap: 16px', 'gap-6': 'gap: 24px', 'gap-8': 'gap: 32px',
  // radius
  'rounded': 'border radius: 4px', 'rounded-sm': 'border radius: 2px',
  'rounded-md': 'border radius: 6px', 'rounded-lg': 'border radius: 8px',
  'rounded-xl': 'border radius: 12px', 'rounded-2xl': 'border radius: 16px',
  'rounded-full': 'fully rounded / pill shape', 'rounded-none': 'no border radius',
  // shadow
  'shadow-sm': 'subtle shadow', 'shadow': 'small shadow',
  'shadow-md': 'medium shadow', 'shadow-lg': 'large shadow',
  'shadow-xl': 'extra large shadow', 'shadow-none': 'no shadow',
  // flex
  'flex': 'display: flex (row layout)',
  'flex-col': 'flex column (vertical layout)',
  'flex-row': 'flex row (horizontal layout)',
  'flex-wrap': 'wrap items to next line',
  'items-center': 'align items to center vertically',
  'items-start': 'align items to top',
  'items-end': 'align items to bottom',
  'justify-center': 'center items horizontally',
  'justify-between': 'space items apart',
  'justify-end': 'push items to right',
  'justify-start': 'push items to left',
}

export const DROPDOWN_MAP: Record<string, string[]> = {
  p: ['p-0','p-1','p-2','p-3','p-4','p-5','p-6','p-8','p-10','p-12'],
  px: ['px-0','px-2','px-4','px-6','px-8','px-10','px-12'],
  py: ['py-0','py-2','py-4','py-6','py-8','py-10','py-12'],
  m: ['m-0','m-1','m-2','m-3','m-4','m-6','m-8','m-auto'],
  mx: ['mx-0','mx-2','mx-4','mx-6','mx-8','mx-auto'],
  my: ['my-0','my-2','my-4','my-6','my-8'],
  gap: ['gap-0','gap-1','gap-2','gap-3','gap-4','gap-6','gap-8','gap-10'],
  rounded: ['rounded-none','rounded-sm','rounded','rounded-md','rounded-lg','rounded-xl','rounded-2xl','rounded-full'],
  shadow: ['shadow-none','shadow-sm','shadow','shadow-md','shadow-lg','shadow-xl'],
}

export function getDropdownOptions(value: string): string[] | undefined {
  if (value.startsWith('rounded')) return DROPDOWN_MAP['rounded']
  if (value.startsWith('shadow')) return DROPDOWN_MAP['shadow']
  const prefix = value.split('-')[0]
  return DROPDOWN_MAP[prefix]
}
