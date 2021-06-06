import { createElement, FC, memo, SVGProps } from 'react';
import cn from 'classnames';

import ArrowDownAZ from '../Svgs/Icons/ArrowDownAZ';
import ArrowDownZA from '../Svgs/Icons/ArrowDownZA';
import ArrowUp from '../Svgs/Icons/ArrowUp';
import Ban from '../Svgs/Icons/Ban';
import Bars from '../Svgs/Icons/Bars';
import Ellipsis from '../Svgs/Icons/Ellipsis';
import EllipsisVertical from '../Svgs/Icons/EllipsisVertical';
import Filter from '../Svgs/Icons/Filter';
import Ghost from '../Svgs/Icons/Ghost';
import Message from '../Svgs/Icons/Message';
import MagnifyingGlass from '../Svgs/Icons/MagnifyingGlass';
import MessageCheck from '../Svgs/Icons/MessageCheck';
import MessageExclamation from '../Svgs/Icons/MessageExclamation';
import MessagePen from '../Svgs/Icons/MessagePen';
import OctagonExclamation from '../Svgs/Icons/OctagonExclamation';
import PaperPlane from '../Svgs/Icons/PaperPlane';
import RightFromBracket from '../Svgs/Icons/RightFromBracket';
import Thumbtack from '../Svgs/Icons/Thumbtack';
import TrashCan from '../Svgs/Icons/TrashCan';
import User from '../Svgs/Icons/User';
import XMark from '../Svgs/Icons/XMark';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type IconName =
  | 'arrow-down-a-z'
  | 'arrow-down-z-a'
  | 'arrow-up'
  | 'ban'
  | 'bars'
  | 'ellipsis'
  | 'ellipsis-vertical'
  | 'filter'
  | 'ghost'
  | 'magnifying-glass'
  | 'message'
  | 'message-check'
  | 'message-exclamation'
  | 'message-pen'
  | 'octagon-exclamation'
  | 'paper-plane'
  | 'right-from-bracket'
  | 'thumbtack'
  | 'trash-can'
  | 'user'
  | 'x-mark';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: IconSize;
  title?: string;
}

const getSvg = (name: IconName) => {
  switch (name) {
    case 'arrow-down-a-z':
      return ArrowDownAZ;
    case 'arrow-down-z-a':
      return ArrowDownZA;
    case 'arrow-up':
      return ArrowUp;
    case 'ban':
      return Ban;
    case 'bars':
      return Bars;
    case 'ellipsis':
      return Ellipsis;
    case 'ellipsis-vertical':
      return EllipsisVertical;
    case 'filter':
      return Filter;
    case 'ghost':
      return Ghost;
    case 'magnifying-glass':
      return MagnifyingGlass;
    case 'message':
      return Message;
    case 'message-check':
      return MessageCheck;
    case 'message-exclamation':
      return MessageExclamation;
    case 'message-pen':
      return MessagePen;
    case 'trash-can':
      return TrashCan;
    case 'paper-plane':
      return PaperPlane;
    case 'right-from-bracket':
      return RightFromBracket;
    case 'thumbtack':
      return Thumbtack;
    case 'octagon-exclamation':
      return OctagonExclamation;
    case 'user':
      return User;
    case 'x-mark':
      return XMark;
  }
};

const sizes = {
  xs: 'h-3',
  sm: 'h-4',
  md: 'h-6',
  lg: 'h-8',
  xl: 'h-10',
};

const Icon: FC<IconProps> = memo(({ name, size = 'md', className = '', ...rest }) =>
  createElement(getSvg(name), { className: cn(sizes[size], className), ...rest })
);

export default Icon;
