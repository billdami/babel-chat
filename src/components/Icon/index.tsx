import { createElement, FC, memo, SVGProps } from 'react';
import cn from 'classnames';

import User from '../Svgs/Icons/User';
import MessageCheck from '../Svgs/Icons/MessageCheck';
import TrashCan from '../Svgs/Icons/TrashCan';
import Ban from '../Svgs/Icons/Ban';
import OctagonExclamation from '../Svgs/Icons/OctagonExclamation';
import Ellipsis from '../Svgs/Icons/Ellipsis';
import EllipsisVertical from '../Svgs/Icons/EllipsisVertical';
import PaperPlane from '../Svgs/Icons/PaperPlane';
import XMark from '../Svgs/Icons/XMark';
import ArrowUp from '../Svgs/Icons/ArrowUp';
import Bars from '../Svgs/Icons/Bars';
import Ghost from '../Svgs/Icons/Ghost';
import Message from '../Svgs/Icons/Message';
import MessageExclamation from '../Svgs/Icons/MessageExclamation';
import Thumbtack from '../Svgs/Icons/Thumbtack';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type IconName =
  | 'user'
  | 'message'
  | 'message-exclamation'
  | 'message-check'
  | 'trash-can'
  | 'ban'
  | 'octagon-exclamation'
  | 'ellipsis'
  | 'ellipsis-vertical'
  | 'paper-plane'
  | 'x-mark'
  | 'arrow-up'
  | 'bars'
  | 'ghost'
  | 'thumbtack';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: IconSize;
  title?: string;
}

const getSvg = (name: IconName) => {
  switch (name) {
    case 'user':
      return User;
    case 'message':
      return Message;
    case 'message-exclamation':
      return MessageExclamation;
    case 'message-check':
      return MessageCheck;
    case 'trash-can':
      return TrashCan;
    case 'ban':
      return Ban;
    case 'octagon-exclamation':
      return OctagonExclamation;
    case 'ellipsis':
      return Ellipsis;
    case 'ellipsis-vertical':
      return EllipsisVertical;
    case 'paper-plane':
      return PaperPlane;
    case 'x-mark':
      return XMark;
    case 'arrow-up':
      return ArrowUp;
    case 'bars':
      return Bars;
    case 'ghost':
      return Ghost;
    case 'thumbtack':
      return Thumbtack;
  }
};

const sizes = {
  xs: 'h-2',
  sm: 'h-4',
  md: 'h-6',
  lg: 'h-8',
  xl: 'h-10',
};

const Icon: FC<IconProps> = memo(({ name, size = 'md', className = '', ...rest }) =>
  createElement(getSvg(name), { className: cn(sizes[size], className), ...rest })
);

export default Icon;
