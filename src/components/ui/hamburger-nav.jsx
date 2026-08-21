import StaggeredMenu from './StaggeredMenu';
import { NAV_ITEMS } from '../../constants/nav';
import { triggerSectionTransition } from '../../utils/navigation';

export default function HamburgerNav({ section }) {
  const goTo = (target, label) => {
    triggerSectionTransition(target, label);
  };

  const menuItems = NAV_ITEMS.map((item, i) => ({
    label: item.label,
    ariaLabel: `Go to ${item.label} section`,
    onClick: () => goTo(item.target, item.label),
    isActive: section === i
  }));

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/AmanKumar-St' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/aman-kumar-81464417a/' }
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
