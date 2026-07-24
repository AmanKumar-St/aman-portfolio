import StaggeredMenu from './StaggeredMenu';

const NAV_ITEMS = [
  { label: 'Home', target: 'hero' },
  { label: 'About', target: 'about' },
  { label: 'Skills', target: 'skills' },
  { label: 'Projects', target: 'projects' },
  { label: 'Experience', target: 'experience' },
];

export default function HamburgerNav({ section }) {
  const goTo = (target) => {
    const el = document.querySelector(`[data-section="${target}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const menuItems = NAV_ITEMS.map((item, i) => ({
    label: item.label,
    ariaLabel: `Go to ${item.label} section`,
    onClick: () => goTo(item.target),
    isActive: section === i
  }));

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' },
    { label: 'Twitter', link: 'https://twitter.com' }
  ];

  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials={true}
      displayItemNumbering={true}
      colors={['#1e293b', '#0f172a']}
      accentColor="#d97706"
    />
  );
}
