import { random } from 'lodash'
import { GenderType } from '../../src/domain/common'
import dayjs from 'dayjs'

const firstNameCharacters = [
  '明',
  '華',
  '美',
  '剛',
  '強',
  '勇',
  '國',
  '志',
  '麗',
  '玲',
  '芳',
  '彬',
  '珍',
  '豪',
  '梅',
  '傑',
  '軍',
  '君',
  '娟',
  '樑',
  '華',
  '豪',
  '華',
  '珍',
  '偉',
  '傑',
  '華',
  '麗',
  '雄',
  '光',
  '靜',
  '英',
  '玉',
  '萍',
  '雪',
  '婷',
  '鳳',
  '霞',
  '娜',
  '婷',
  '雅',
  '楊',
  '杰',
  '軒',
  '俊',
  '瑋',
  '宏',
  '榮',
  '哲',
  '澤',
  '建',
  '民',
  '婷',
  '穎',
  '雪',
  '琳',
  '龍',
  '飛',
  '鵬',
  '婷',
  '瑞',
  '琪',
  '暢',
  '樂',
  '東',
  '南',
  '西',
  '北',
  '秋',
  '冬',
  '瑞',
  '新',
  '嘉',
  '宇',
  '君',
  '凱',
  '涵',
  '琪',
  '航',
  '璇',
  '軒',
  '峰',
  '瑞',
  '翔',
  '茜',
  '碩',
  '穎',
  '雅',
  '靈',
  '琳',
  '麗',
  '琦',
  '峰',
  '豪',
  '霖',
  '波',
  '東',
  '飛',
  '磊',
  '曉',
]

const lastNames = [
  '王',
  '李',
  '張',
  '劉',
  '陳',
  '楊',
  '黃',
  '吳',
  '趙',
  '周',
  '徐',
  '孫',
  '馬',
  '胡',
  '朱',
  '高',
  '林',
  '何',
  '郭',
  '羅',
  '梁',
  '宋',
  '鄭',
  '謝',
  '韓',
  '唐',
  '馮',
  '於',
  '董',
  '蕭',
]

export function generateRandomChineseName() {
  const firstName = `${
    firstNameCharacters[random(0, firstNameCharacters.length - 1)]
  }${firstNameCharacters[random(0, firstNameCharacters.length - 1)]}`
  const lastName = lastNames[random(0, lastNames.length - 1)]
  const fullName = `${lastName}${firstName}`
  const gender = random(0, 1) === 0 ? GenderType.MALE : GenderType.FEMALE

  return {
    firstName,
    lastName,
    fullName,
    gender,
  }
}

export function getRandomBirthDate() {
  const currentYear = dayjs().year()
  const age = random(5, 95)
  const birthYear = currentYear - age
  const birthMonth = random(1, 12)
  let birthDay

  switch (birthMonth) {
    case 2:
      const isLeapYear =
        (birthYear % 4 === 0 && birthYear % 100 !== 0) || birthYear % 400 === 0
      birthDay = random(1, isLeapYear ? 29 : 28)
      break
    case 4:
    case 6:
    case 9:
    case 11:
      birthDay = random(1, 30)
      break
    default:
      birthDay = random(1, 31)
      break
  }

  return new Date(birthYear, birthMonth - 1, birthDay)
}
