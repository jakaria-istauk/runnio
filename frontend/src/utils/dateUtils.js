import { format, parseISO, isAfter, isBefore } from 'date-fns'

export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM dd, yyyy')
  } catch (error) {
    return dateString
  }
}

export const formatDateTime = (dateString) => {
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM dd, yyyy h:mm a')
  } catch (error) {
    return dateString
  }
}

export const formatTime = (timeString) => {
  // Format time strings like "1:45:30" to "1h 45m 30s"
  if (!timeString) return ''
  
  const parts = timeString.split(':')
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    let result = ''
    
    if (parseInt(hours) > 0) {
      result += `${parseInt(hours)}h `
    }
    if (parseInt(minutes) > 0) {
      result += `${parseInt(minutes)}m `
    }
    if (parseInt(seconds) > 0) {
      result += `${parseInt(seconds)}s`
    }
    
    return result.trim()
  }
  
  return timeString
}

export const isEventUpcoming = (eventDate) => {
  try {
    const date = parseISO(eventDate)
    return isAfter(date, new Date())
  } catch (error) {
    return false
  }
}

export const isRegistrationOpen = (registrationDeadline) => {
  if (!registrationDeadline) return true
  
  try {
    const deadline = parseISO(registrationDeadline)
    return isBefore(new Date(), deadline)
  } catch (error) {
    return true
  }
}
