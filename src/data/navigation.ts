export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '#hero', id: 'hero' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Arsenal', href: '#arsenal', id: 'arsenal' },
  { label: 'Workstation', href: '#workstation', id: 'workstation' },
  { label: 'Notes', href: '#notes', id: 'notes' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];
