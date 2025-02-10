export async function getGreetingBasedOnTime(): Promise<string> {
  const currentTime = new Date().getHours()

  if (currentTime < 12) {
    return 'Good morning'
  } else if (currentTime >= 12 && currentTime < 18) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

export function padMobile(number: string) {
  if (number.length === 10) {
    return `${number.substring(0, 4)} ${number.substring(4, 7)} ${number.substring(7, 10)}`
  }
  return number
}

export function padLandline(number: string) {
  if (number.length === 8) {
    return `${number.substring(0, 4)} ${number.substring(4, 8)}`
  } else if (number.length === 10) {
    return `${number.substring(0, 2)} ${number.substring(2, 6)} ${number.substring(6, 10)}`
  }
  return number
}

function removeIfExists<T>(array: T[], value: T) {
  if (value && array.includes(value)) {
    array.splice(array.indexOf(value), 1)
  }
}

function getRandomElement<T>(array: T[], value: T) {
  removeIfExists(array, value)
  return array[Math.floor(Math.random() * array.length)]
}

export function getRandomTitle(currentValue: string) {
  const titles = ['Mr', 'Mrs', 'Miss', 'Ms', 'Mx', 'Dr']
  return getRandomElement(titles, currentValue)
}

export function getRandomFirstName(currentValue: string) {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily']
  return getRandomElement(firstNames, currentValue)
}

export function getRandomMiddleName(currentValue: string) {
  const middleNames = ['Lee', 'Marie', 'James', 'Ann', 'Ray', 'Lynn']
  return getRandomElement(middleNames, currentValue)
}

export function getRandomLastName(currentValue: string) {
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia']
  return getRandomElement(lastNames, currentValue)
}

export function getRandomMobile(currentValue: string) {
  const mobileNumbers = [
    '0400123456',
    '0412345678',
    '0423456789',
    '0434567890',
    '0445678901',
    '0456789012'
  ]
  return getRandomElement(mobileNumbers, currentValue)
}

export function getRandomHomePhone(currentValue: string) {
  const homePhoneNumbers = [
    '0812345678',
    '0823456789',
    '0834567890',
    '0845678901',
    '0856789012',
    '0867890123'
  ]
  return getRandomElement(homePhoneNumbers, currentValue)
}

export function getRandomWorkPhone(currentValue: string) {
  const workPhoneNumbers = [
    '0897100000',
    '0897200000',
    '0897300000',
    '0400123456',
    '0412345678',
    '0423456789'
  ]
  return getRandomElement(workPhoneNumbers, currentValue)
}

export function getRandomEmail(currentValue: string) {
  const emailAddresses = [
    'volume-am@xxofceaa.mailosaur.net',
    'tear-duct@xxofceaa.mailosaur.net',
    'supper-time@xxofceaa.mailosaur.net',
    'batman-robbin@xxofceaa.mailosaur.net',
    'swimming-lane@xxofceaa.mailosaur.net',
    'brave-soul@xxofceaa.mailosaur.net'
  ]
  return getRandomElement(emailAddresses, currentValue)
}
