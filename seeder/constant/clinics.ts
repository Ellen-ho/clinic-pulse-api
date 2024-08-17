import { RoomNumberType } from '../../src/domain/consultationRoom/ConsultationRoom'

export const CLINICS = [
  {
    id: '16458ab0-4bb6-4141-9bf0-6d7398942d9b',
    name: '台中院區',
    address: {
      city: 'Anytown',
      line1: '1234 Maple Street',
      line2: 'Unit 101',
      country: 'ROC',
      postalCode: '12345',
      countryCode: 'TW',
      stateProvince: 'Anystate',
    },
  },
  {
    id: '690d0ea3-9f8d-4143-b160-0661a003bf08',
    name: '台北院區',
    address: {
      city: 'Taipei',
      line1: 'No. 100, Section 2, Zhongxiao East Road',
      line2: 'Floor 6',
      country: 'ROC',
      postalCode: '100',
      countryCode: 'TW',
      stateProvince: 'Taipei City',
    },
  },
  {
    id: 'bf51c88e-9587-479e-994a-d15ec484c333',
    name: '高雄院區',
    address: {
      city: 'Kaohsiung',
      line1: 'No. 789, Yancheng District',
      line2: 'Apartment 5',
      country: 'ROC',
      postalCode: '803',
      countryCode: 'TW',
      stateProvince: 'Kaohsiung City',
    },
  },
]

export const ROOMS = [
  {
    id: '15cb95f8-d56d-4721-b32c-74d166ae4a20',
    clinicId: CLINICS[1].id,
    roomNumber: RoomNumberType.ROOM_TWO,
  },
  {
    id: '58602950-b172-45b7-b37c-c8461d73ecf6',
    clinicId: CLINICS[1].id,
    roomNumber: RoomNumberType.ROOM_ONE,
  },
  {
    id: '9e18e1c5-1b63-4ca6-b818-927ae62ae39a',
    clinicId: CLINICS[2].id,
    roomNumber: RoomNumberType.ROOM_ONE,
  },
  {
    id: 'a662ecb1-6f06-4b07-9967-95171da4b61f',
    clinicId: CLINICS[2].id,
    roomNumber: RoomNumberType.ROOM_TWO,
  },
  {
    id: 'ed770eec-1c86-4503-84bd-0ac7ea419273',
    clinicId: CLINICS[0].id,
    roomNumber: RoomNumberType.ROOM_TWO,
  },
  {
    id: 'ffeaea79-b30f-4f62-87b4-acee6c747d18',
    clinicId: CLINICS[0].id,
    roomNumber: RoomNumberType.ROOM_ONE,
  },
]
