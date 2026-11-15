export interface ContactDetectionResult {
  found: boolean
  message: string
}

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/
const URL_REGEX = /\b(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/i
const TELEGRAM_REGEX = /@[A-Za-z0-9_]{5,32}/
const WHATSAPP_REGEX = /wa\.me\/[A-Za-z0-9_]+/
const INSTAGRAM_REGEX = /instagram\.com\/[A-Za-z0-9_.]+/
const X_REGEX = /(?:twitter|x)\.com\/[A-Za-z0-9_]+/
const LINKEDIN_REGEX = /linkedin\.com\/in\/[A-Za-z0-9_-]+/

export function detectContactInfo(text: string): ContactDetectionResult {
  const issues: string[] = []

  if (EMAIL_REGEX.test(text)) {
    issues.push('email addresses')
  }

  if (PHONE_REGEX.test(text)) {
    issues.push('phone numbers')
  }

  if (URL_REGEX.test(text)) {
    issues.push('links/URLs')
  }

  if (TELEGRAM_REGEX.test(text)) {
    issues.push('Telegram handles')
  }

  if (WHATSAPP_REGEX.test(text)) {
    issues.push('WhatsApp links')
  }

  if (INSTAGRAM_REGEX.test(text)) {
    issues.push('Instagram handles')
  }

  if (X_REGEX.test(text)) {
    issues.push('X/Twitter handles')
  }

  if (LINKEDIN_REGEX.test(text)) {
    issues.push('LinkedIn profiles')
  }

  if (issues.length > 0) {
    return {
      found: true,
      message: `Detected: ${issues.join(', ')}. Contact details are only shared after mutual acceptance.`
    }
  }

  return { found: false, message: '' }
}