// Icon component that provides a consistent icon system
// This component can work with or without react-icons library
// If react-icons is available, it uses SVG icons, otherwise falls back to Unicode symbols

import React from 'react'

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
    
    // Sports specific
    FiTarget: require('react-icons/fi').FiTarget,
    FiAward: require('react-icons/fi').FiAward,
    FiFlag: require('react-icons/fi').FiFlag,
  }
} catch (error) {
  // react-icons not available, will use fallback
  ReactIcons = null
}

// Fallback icon mapping using Unicode symbols
const fallbackIcons = {
  // Dashboard and Navigation
  home: '🏠',
  user: '👤',
  users: '👥',
  settings: '⚙️',
  menu: '☰',
  close: '✕',
  'chevron-down': '▼',
  'chevron-right': '▶',
  logout: '🚪',
  
  // Events and Activities
  calendar: '📅',
  'map-pin': '📍',
  clock: '🕐',
  activity: '📊',
  'trending-up': '📈',
  
  // Actions
  plus: '➕',
  edit: '✏️',
  trash: '🗑️',
  eye: '👁️',
  download: '⬇️',
  upload: '⬆️',
  save: '💾',
  
  // Status and Feedback
  check: '✓',
  'check-circle': '✅',
  'alert-circle': '⚠️',
  info: 'ℹ️',
  'x-circle': '❌',
  
  // Communication
  mail: '📧',
  phone: '📞',
  bell: '🔔',
  'message-square': '💬',
  
  // Data and Analytics
  'bar-chart': '📊',
  'pie-chart': '📈',
  database: '🗄️',
  'file-text': '📄',
  
  // Utility
  search: '🔍',
  filter: '🔽',
  refresh: '🔄',
  'more-horizontal': '⋯',
  'external-link': '🔗',
  
  // Sports specific
  target: '🎯',
  award: '🏆',
  flag: '🏁',
  runner: '🏃‍♂️',
  medal: '🥇',
  stopwatch: '⏱️',
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
  
  // Sports specific
  target: 'FiTarget',
  award: 'FiAward',
  flag: 'FiFlag',
  runner: 'FiActivity', // Using activity icon for runner
  medal: 'FiAward', // Using award icon for medal
  stopwatch: 'FiClock', // Using clock icon for stopwatch
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
  
  // Fallback to Unicode symbols
  const fallbackIcon = fallbackIcons[name] || '?'
  
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
      {fallbackIcon}
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
