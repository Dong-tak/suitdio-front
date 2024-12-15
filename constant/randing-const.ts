import {
  CarouselSpacingProps,
  H1andH2Props,
  LandingTabsProps,
} from '@/app/(randing)/page';

export const MAINPAGE_TABS_DATA: LandingTabsProps['data'] = [
  {
    title: '정보수집',
    src: '/images/main/정보수집.png',
  },
  {
    title: '코멘트',
    src: '/images/main/코멘트.png',
  },
  {
    title: '익스텐션',
    src: '/images/main/익스텐션.png',
  },
  {
    title: '자동스크랩',
    src: '/images/main/자동스크랩.png',
  },
  {
    title: '인공지능',
    src: '/images/main/인공지능.png',
  },
];

export const MAINPAGE_TABS_TITLE: H1andH2Props['head'] = {
  h1: '현명한 선택을 만드는 개인지식 관리 인터페이스',
  h2: '정보를 가장 잘 활용할 수 있는 지식 관리 시스템, 지금 시작하세요.',
};

export const MAINPAGE_TWOIMAGE_DATA: CarouselSpacingProps['data'] = [
  {
    title: '도입의 어려움',
    src: '/images/main/도입의어려움.png',
    description: '새로운 방식을 배우는 데 시간을 투자해야 합니다.',
    description2: '기존 정보 체계를 변환하는 작업도 필요합니다.',
  },
  {
    title: '유지의 어려움',
    src: '/images/main/유지의어려움.png',
    description: '정보를 꾸준히 정리하고 연결하는 습관을 만들어야 합니다.',
    description2:
      '바쁜 일상 속에서도 시스템 활용을 지속하려는 노력이 필요합니다.',
  },
];

export const MAINPAGE_TWOIMAGE_TITLE: H1andH2Props['head'] = {
  h1: '혹시 지식 관리 시스템 도입에 실패하셨나요?',
  h2: '새로운 방식을 배우는 데 시간을 투자해야 합니다.',
};

export const MAINPAGE_CAROUSEL_DATA: CarouselSpacingProps['data'] = [
  {
    title: 'Zettelkasten',
    src: '/images/main/Zettel.png',
    description: '메모를 연결해 아이디어를 체계적으로 확장하는 방식입니다.',
  },
  {
    title: 'GTD(Getting Things Done)',
    src: '/images/main/GTD.png',
    description: '작업을 정리하고 적시에 실행할 수 있도록 돕는 시스템입니다.',
  },
  {
    title: 'BASB(Building a Second Brain)',
    src: '/images/main/BASB.png',
    description: '업무를 정리하고 적시에 실행할 수 있도록 돕는 시스템입니다.',
  },
  {
    title: 'ACE(Add, Context, Express)',
    src: '/images/main/ACE.png',
    description: '메모를 추가하고 컨텍스트를 확장하고 표현하는 방식입니다.',
  },
  {
    title: 'PPV (Personal Productivity Vision)',
    src: '/images/main/PPV.png',
    description: '개인의 생산성을 향상시키는 방식입니다.',
  },
  {
    title: 'Moscow Method',
    src: '/images/main/MoscowMethod.png',
    description: '메모를 조직하고 아이디어를 확장하는 방식입니다.',
  },
];

export const MAINPAGE_CAROUSEL_TITLE: H1andH2Props['head'] = {
  h1: '이제 다양한 PKM을 바로 적용하세요.',
  h2: '메모를 연결해 아이디어를 체계적으로 확장하는 방식입니다.',
};
