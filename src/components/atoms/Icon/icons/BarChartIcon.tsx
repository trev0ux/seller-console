import { Icon } from '../Icon'
import type { IconProps } from '../Icon'

export const BarChartIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </Icon>
)