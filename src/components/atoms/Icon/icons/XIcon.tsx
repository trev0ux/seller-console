import { Icon } from '../Icon'
import type { IconProps } from '../Icon'

export const XIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
)