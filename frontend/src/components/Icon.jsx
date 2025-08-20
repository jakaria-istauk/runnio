// Icon component that provides a consistent icon system
// This component can work with or without react-icons library
// If react-icons is available, it uses SVG icons, otherwise falls back to our custom SVG icons

import React from 'react'
import * as CustomIcons from './icons'

// Try to import react-icons, fall back to null if not available
let ReactIcons = null
try {
  ReactIcons = {
    // Dashboard and Navigation
    FiHome: require('react-icons/fi').FiHome,
    FiUser: require('react-icons/fi').FiUser,
    FiUsers: require('react-icons/fi').FiUsers,
    FiSettings: require('react-icons/fi').FiSettings,
    FiMenu: require('react-icons/fi').FiMenu,
    FiX: require('react-icons/fi').FiX,
    FiChevronDown: require('react-icons/fi').FiChevronDown,
    FiChevronRight: require('react-icons/fi').FiChevronRight,
    FiLogOut: require('react-icons/fi').FiLogOut,
    
    // Events and Activities
    FiCalendar: require('react-icons/fi').FiCalendar,
    FiMapPin: require('react-icons/fi').FiMapPin,
    FiClock: require('react-icons/fi').FiClock,
    FiActivity: require('react-icons/fi').FiActivity,
    FiTrendingUp: require('react-icons/fi').FiTrendingUp,
    
    // Actions
    FiPlus: require('react-icons/fi').FiPlus,
    FiEdit: require('react-icons/fi').FiEdit,
    FiTrash2: require('react-icons/fi').FiTrash2,
    FiEye: require('react-icons/fi').FiEye,
    FiDownload: require('react-icons/fi').FiDownload,
    FiUpload: require('react-icons/fi').FiUpload,
    FiSave: require('react-icons/fi').FiSave,
    
    // Status and Feedback
    FiCheck: require('react-icons/fi').FiCheck,
    FiCheckCircle: require('react-icons/fi').FiCheckCircle,
    FiAlertCircle: require('react-icons/fi').FiAlertCircle,
    FiInfo: require('react-icons/fi').FiInfo,
    FiXCircle: require('react-icons/fi').FiXCircle,
    
    // Communication
    FiMail: require('react-icons/fi').FiMail,
    FiPhone: require('react-icons/fi').FiPhone,
    FiBell: require('react-icons/fi').FiBell,
    FiMessageSquare: require('react-icons/fi').FiMessageSquare,
    
    // Data and Analytics
    FiBarChart: require('react-icons/fi').FiBarChart,
    FiPieChart: require('react-icons/fi').FiPieChart,
    FiDatabase: require('react-icons/fi').FiDatabase,
    FiFileText: require('react-icons/fi').FiFileText,
    
    // Utility
    FiSearch: require('react-icons/fi').FiSearch,
    FiFilter: require('react-icons/fi').FiFilter,
    FiRefreshCw: require('react-icons/fi').FiRefreshCw,
    FiMoreHorizontal: require('react-icons/fi').FiMoreHorizontal,
    FiExternalLink: require('react-icons/fi').FiExternalLink,
    FiShield: require('react-icons/fi').FiShield,
    FiGrid: require('react-icons/fi').FiGrid,
    FiList: require('react-icons/fi').FiList,
    
    // Sports specific
    FiTarget: require('react-icons/fi').FiTarget,
    FiAward: require('react-icons/fi').FiAward,
    FiFlag: require('react-icons/fi').FiFlag,

    // Financial
    FiDollarSign: require('react-icons/fi').FiDollarSign,
  }
} catch (error) {
  // react-icons not available, will use fallback
  ReactIcons = null
}

// Fallback icon mapping using our custom SVG icons
const fallbackIconMapping = {
  // Dashboard and Navigation
  home: 'Home',
  user: 'User',
  users: 'Users',
  settings: 'Settings',
  menu: 'Menu',
  close: 'X',
  'chevron-down': 'ChevronDown',
  'chevron-right': 'ChevronRight',
  'chevron-left': 'ChevronLeft',
  logout: 'LogOut',

  // Events and Activities
  calendar: 'Calendar',
  'map-pin': 'MapPin',
  clock: 'Clock',
  activity: 'Activity',
  'trending-up': 'TrendingUp',
  'trending-down': 'TrendingDown',

  // Actions
  plus: 'Plus',
  edit: 'Edit',
  trash: 'Trash',
  eye: 'Eye',
  download: 'Download',
  upload: 'Upload',
  save: 'Save',

  // Status and Feedback
  check: 'Check',
  'check-circle': 'CheckCircle',
  'alert-circle': 'AlertTriangle',
  info: 'AlertTriangle',
  'x-circle': 'XCircle',

  // Communication
  mail: 'MessageCircle',
  phone: 'MessageCircle',
  bell: 'Bell',
  'message-square': 'MessageCircle',

  // Data and Analytics
  'bar-chart': 'BarChart',
  'pie-chart': 'TrendingUp',
  database: 'Folder',
  'file-text': 'FileText',

  // Utility
  search: 'Search',
  filter: 'ArrowUpDown',
  refresh: 'ArrowUpDown',
  'more-horizontal': 'Menu',
  'external-link': 'Paperclip',
  shield: 'AlertTriangle',
  grid: 'Grid',
  list: 'List',

  // Sports specific
  target: 'Activity',
  award: 'Activity',
  flag: 'Activity',
  runner: '🏃‍♂️', // Keep the running emoji as specified
  medal: 'Activity',
  stopwatch: 'Clock',

  // Financial
  'dollar-sign': 'Activity', // Using Activity as fallback for dollar sign
}

// Icon name to react-icons component mapping
const reactIconMapping = {
  // Dashboard and Navigation
  home: 'FiHome',
  user: 'FiUser',
  users: 'FiUsers',
  settings: 'FiSettings',
  menu: 'FiMenu',
  close: 'FiX',
  'chevron-down': 'FiChevronDown',
  'chevron-right': 'FiChevronRight',
  logout: 'FiLogOut',
  
  // Events and Activities
  calendar: 'FiCalendar',
  'map-pin': 'FiMapPin',
  clock: 'FiClock',
  activity: 'FiActivity',
  'trending-up': 'FiTrendingUp',
  
  // Actions
  plus: 'FiPlus',
  edit: 'FiEdit',
  trash: 'FiTrash2',
  eye: 'FiEye',
  download: 'FiDownload',
  upload: 'FiUpload',
  save: 'FiSave',
  
  // Status and Feedback
  check: 'FiCheck',
  'check-circle': 'FiCheckCircle',
  'alert-circle': 'FiAlertCircle',
  info: 'FiInfo',
  'x-circle': 'FiXCircle',
  
  // Communication
  mail: 'FiMail',
  phone: 'FiPhone',
  bell: 'FiBell',
  'message-square': 'FiMessageSquare',
  
  // Data and Analytics
  'bar-chart': 'FiBarChart',
  'pie-chart': 'FiPieChart',
  database: 'FiDatabase',
  'file-text': 'FiFileText',
  
  // Utility
  search: 'FiSearch',
  filter: 'FiFilter',
  refresh: 'FiRefreshCw',
  'more-horizontal': 'FiMoreHorizontal',
  'external-link': 'FiExternalLink',
  shield: 'FiShield',
  grid: 'FiGrid',
  list: 'FiList',
  
  // Sports specific
  target: 'FiTarget',
  award: 'FiAward',
  flag: 'FiFlag',
  runner: 'FiActivity', // Using activity icon for runner
  medal: 'FiAward', // Using award icon for medal
  stopwatch: 'FiClock', // Using clock icon for stopwatch

  // Financial
  'dollar-sign': 'FiDollarSign',
}

const Icon = ({
  name,
  size = 16,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}) => {
  // If react-icons is available, use SVG icons
  if (ReactIcons && reactIconMapping[name]) {
    const IconComponent = ReactIcons[reactIconMapping[name]]
    if (IconComponent) {
      return (
        <IconComponent
          size={size}
          color={color}
          className={className}
          style={style}
          {...props}
        />
      )
    }
  }

  // Fallback to our custom SVG icons
  const fallbackIconName = fallbackIconMapping[name]
  if (fallbackIconName) {
    // Special case for runner emoji - keep as is
    if (fallbackIconName === '🏃‍♂️') {
      return (
        <span
          className={`icon ${className}`}
          style={{
            fontSize: `${size}px`,
            color,
            lineHeight: 1,
            display: 'inline-block',
            ...style
          }}
          {...props}
        >
          🏃‍♂️
        </span>
      )
    }

    // Use custom SVG icon
    const CustomIconComponent = CustomIcons[fallbackIconName]
    if (CustomIconComponent) {
      return (
        <CustomIconComponent
          className={`${className} w-${Math.ceil(size/4)} h-${Math.ceil(size/4)}`}
          style={{ color, ...style }}
          {...props}
        />
      )
    }
  }

  // Final fallback to question mark
  return (
    <span
      className={`icon ${className}`}
      style={{
        fontSize: `${size}px`,
        color,
        lineHeight: 1,
        display: 'inline-block',
        ...style
      }}
      {...props}
    >
      ?
    </span>
  )
}

export default Icon

// Export individual icon components for convenience
export const HomeIcon = (props) => <Icon name="home" {...props} />
export const UserIcon = (props) => <Icon name="user" {...props} />
export const UsersIcon = (props) => <Icon name="users" {...props} />
export const SettingsIcon = (props) => <Icon name="settings" {...props} />
export const MenuIcon = (props) => <Icon name="menu" {...props} />
export const CloseIcon = (props) => <Icon name="close" {...props} />
export const CalendarIcon = (props) => <Icon name="calendar" {...props} />
export const MapPinIcon = (props) => <Icon name="map-pin" {...props} />
export const ClockIcon = (props) => <Icon name="clock" {...props} />
export const ActivityIcon = (props) => <Icon name="activity" {...props} />
export const PlusIcon = (props) => <Icon name="plus" {...props} />
export const EditIcon = (props) => <Icon name="edit" {...props} />
export const TrashIcon = (props) => <Icon name="trash" {...props} />
export const CheckIcon = (props) => <Icon name="check" {...props} />
export const CheckCircleIcon = (props) => <Icon name="check-circle" {...props} />
export const AlertCircleIcon = (props) => <Icon name="alert-circle" {...props} />
export const MailIcon = (props) => <Icon name="mail" {...props} />
export const BellIcon = (props) => <Icon name="bell" {...props} />
export const BarChartIcon = (props) => <Icon name="bar-chart" {...props} />
export const SearchIcon = (props) => <Icon name="search" {...props} />
export const RunnerIcon = (props) => <Icon name="runner" {...props} />
export const MedalIcon = (props) => <Icon name="medal" {...props} />
export const StopwatchIcon = (props) => <Icon name="stopwatch" {...props} />
export const AwardIcon = (props) => <Icon name="award" {...props} />
export const FlagIcon = (props) => <Icon name="flag" {...props} />
