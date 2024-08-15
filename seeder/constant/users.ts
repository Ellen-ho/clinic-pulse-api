import { GenderType } from '../../src/domain/common'
import { UserRoleType } from '../../src/domain/user/User'
export const DOCTORS = [
  {
    id: '0b8ac825-2c25-45e9-a874-7f8362816fab',
    doctorId: '8545ef60-a94d-4160-829f-f4fd7ed77551',
    email: 'doctor_zhang@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '俊杰',
    lastName: '張',
    gender: GenderType.MALE,
    birthDate: new Date('1985-04-12'),
    onboardDate: new Date('2020-01-15'),
  },
  {
    id: '925ca96c-e9cb-436f-a15f-073827fa2d0a',
    doctorId: '96bb6dee-8236-4293-b3ab-29180fb9b8bb',
    email: 'doctor_li@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '美玲',
    lastName: '李',
    gender: GenderType.FEMALE,
    birthDate: new Date('1990-05-08'),
    onboardDate: new Date('2021-03-20'),
  },
  {
    id: '8c1da39c-d420-4559-87fe-49cd4611f574',
    doctorId: '3fd009a5-5129-4cca-b65b-9e10a2557461',
    email: 'doctor_wang@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '建中',
    lastName: '王',
    gender: GenderType.MALE,
    birthDate: new Date('1979-07-22'),
    onboardDate: new Date('2018-11-11'),
  },
  {
    id: '2b5324d8-0f1a-4fff-a5e0-a0de46e56173',
    doctorId: 'c977a3b5-20af-40aa-a26a-e563e44a18a8',
    email: 'doctor_chen@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '志明',
    lastName: '陳',
    gender: GenderType.MALE,
    birthDate: new Date('1982-12-14'),
    onboardDate: new Date('2019-05-23'),
  },
  {
    id: '2b27a2e8-16e3-42e5-b1d6-dcbce2435442',
    doctorId: 'f13b0580-2adb-4da4-a0f4-ef3dc67f3357',
    email: 'doctor_lin@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '怡君',
    lastName: '林',
    gender: GenderType.FEMALE,
    birthDate: new Date('1986-03-18'),
    onboardDate: new Date('2020-07-15'),
  },
  {
    id: '55d08f0d-f176-42ca-a86f-fe7d26876384',
    doctorId: 'd6851101-04a1-4063-8c83-14999b9758b4',
    email: 'doctor_cheng@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '雅婷',
    lastName: '鄭',
    gender: GenderType.FEMALE,
    birthDate: new Date('1991-01-19'),
    onboardDate: new Date('2022-02-01'),
  },
  {
    id: '6e8bc2c1-ff1e-44fc-bd9a-36f3a5cad1c0',
    doctorId: 'afcccc59-0d93-4d69-93a7-883dbd334d2d',
    email: 'doctor_liao@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '國華',
    lastName: '廖',
    gender: GenderType.MALE,
    birthDate: new Date('1975-09-30'),
    onboardDate: new Date('2017-08-20'),
  },
  {
    id: 'c4208b02-164c-419e-b42c-6fa8b14b729e',
    doctorId: 'f5d374d2-f3c1-431f-8615-b6bbdd3b5b53',
    email: 'doctor_hsiao@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '志豪',
    lastName: '蕭',
    gender: GenderType.MALE,
    birthDate: new Date('1983-11-23'),
    onboardDate: new Date('2020-04-18'),
  },
  {
    id: 'ce0f02b8-db82-4ce6-af4b-5c744d535b61',
    doctorId: '88fdc8e4-29fa-4664-91a7-bc88f3f2c997',
    email: 'doctor_kuo@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '思維',
    lastName: '郭',
    gender: GenderType.MALE,
    birthDate: new Date('1988-06-05'),
    onboardDate: new Date('2021-09-10'),
  },
  {
    id: 'e85a7622-79b2-4ca7-9c9a-b7fe2a22d6d1',
    doctorId: '9659d814-71ad-4e8a-91ba-d233b340c5c8',
    email: 'doctor_huang@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '婷婷',
    lastName: '黃',
    gender: GenderType.FEMALE,
    birthDate: new Date('1993-02-27'),
    onboardDate: new Date('2022-01-07'),
  },
  {
    id: '6cb84690-8e1a-4cda-8c61-fbf4136c50a3',
    doctorId: '566be38a-4cb9-449a-b652-0b9bcee85eff',
    email: 'doctor_lu@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '志遠',
    lastName: '盧',
    gender: GenderType.MALE,
    birthDate: new Date('1981-04-17'),
    onboardDate: new Date('2019-10-25'),
  },
  {
    id: '7fe6d848-234e-485c-921c-4dd5250a1514',
    doctorId: '67e4f2c6-3ce2-4c49-bc87-2dba00997ca4',
    email: 'doctor_hsieh@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '建宏',
    lastName: '謝',
    gender: GenderType.MALE,
    birthDate: new Date('1980-03-11'),
    onboardDate: new Date('2018-06-29'),
  },
  {
    id: '95fb36d3-6771-4434-b50a-dbc60f019118',
    doctorId: 'c4009084-cee5-41d1-ad18-b1664783591c',
    email: 'doctor_tang@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '雅芳',
    lastName: '唐',
    gender: GenderType.FEMALE,
    birthDate: new Date('1992-07-09'),
    onboardDate: new Date('2022-04-15'),
  },
  {
    id: '8f779aa8-436b-4d77-b148-1052fd45c79d',
    doctorId: 'bb37f423-542c-4d04-8168-3764770b1138',
    email: 'doctor_chou@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '志遠',
    lastName: '周',
    gender: GenderType.MALE,
    birthDate: new Date('1984-08-19'),
    onboardDate: new Date('2021-08-08'),
  },
  {
    id: '115ddc74-21bd-4a73-8453-2a5260eb6d96',
    doctorId: '8f99ad8f-1d4b-4937-a011-d6605eeac78a',
    email: 'doctor_tsai@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '思明',
    lastName: '蔡',
    gender: GenderType.MALE,
    birthDate: new Date('1990-02-15'),
    onboardDate: new Date('2022-03-12'),
  },
  {
    id: '795df81f-d2d5-434f-8bf4-f6836ea2294d',
    doctorId: '1b115170-4990-46d3-8691-bdf55189ca6a',
    email: 'doctor_wu@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '嘉慧',
    lastName: '吳',
    gender: GenderType.FEMALE,
    birthDate: new Date('1987-01-23'),
    onboardDate: new Date('2020-09-01'),
  },
  {
    id: '66ab92f0-f766-4f42-a5ff-ce20f4d032c3',
    doctorId: '05f41d04-691f-4ed7-a2a7-16f65efb4054',
    email: 'doctor_yu@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '建國',
    lastName: '余',
    gender: GenderType.MALE,
    birthDate: new Date('1983-05-20'),
    onboardDate: new Date('2019-07-03'),
  },
  {
    id: '2146d8b8-ca33-4192-8960-d64e2a0dc531',
    doctorId: '4bfdf86a-7c71-40c3-8db6-c4293c31213f',
    email: 'doctor_sun@example.com',
    password: 'hashed_password_here',
    role: UserRoleType.DOCTOR,
    firstName: '明哲',
    lastName: '孫',
    gender: GenderType.MALE,
    birthDate: new Date('1989-03-11'),
    onboardDate: new Date('2021-11-20'),
  },
]