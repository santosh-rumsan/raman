import { Ellipsis } from 'lucide-react';

export const AppIconCollection = (
  _iconList: Record<string, typeof Ellipsis>,
) => {
  const _iconMap: Record<string, typeof Ellipsis> = { Ellipsis };
  const iconMap = { ..._iconMap, ..._iconList };

  type IconProps = {
    name: keyof typeof _iconList;
    defaultIcon?: keyof typeof _iconList;
    size?: number;
    color?: string;
    className?: string;
    strokeWidth?: number; // Optional stroke width for the icon
  };

  const _IconByName: React.FC<IconProps> = ({
    name,
    defaultIcon = 'Ellipsis',
    size = 24,
    color = 'currentColor',
    className = '',
    strokeWidth = 2,
  }) => {
    let IconComponent = iconMap[name];

    if (!IconComponent) {
      console.warn(
        `Icon "${name}" not found in AppIconCollection. Using default icon "${defaultIcon}"`,
      );
      IconComponent = iconMap[defaultIcon];
    }

    return (
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
      />
    );
  };

  return _IconByName;
};
