import {
  CarouselSpacingProps,
  H1andH2Props,
  LandingTabsProps,
} from '@/app/(randing)/page';

export const AI_COPILOT_TABS_TITLE: H1andH2Props['head'] = {
  h1: '인공지능을 활용하여 지식 관리를 촉진하세요.',
  h2: '여러 플랫폼에서 한 번의 클릭으로 필요한 정보를 저장할 수 있습니다.',
};

export const AI_COPILOT_TABS_DATA: LandingTabsProps['data'] = [
  {
    title: '자동 요약',
    src: '/images/AI/자동요약.png',
  },
  {
    title: '유사 검색',
    src: '/images/AI/유사검색.png',
  },
  {
    title: 'AI 자동 스크랩',
    src: '/images/AI/자동스크랩.png',
  },
  {
    title: '웹서핑 에이전트',
    src: '/images/AI/웹서핑에이전트.png',
  },
  {
    title: '가짜 정보 판별',
    src: '/images/AI/가짜정보.png',
  },
];

export const AI_COPILOT_TWOIMAGE_TITLE: H1andH2Props['head'] = {
  h1: '인공지능을 제대로 활용하세요.',
  h2: '워크스페이스, 익스텐션, 메신저앱 연동을 통해 정보를 수집하고 정리할 수 있습니다.',
};

export const AI_COPILOT_TWOIMAGE_DATA: CarouselSpacingProps['data'] = [
  {
    title: '정보 수집',
    src: '/images/AI/정보수집.png',
    description: 'AI가 당신을 대신해 ',
    description2: '필요한 정보를 빠르고 정확하게 수집합니다.',
  },
  {
    title: '정보 정리',
    src: '/images/AI/정보정리.png',
    description: 'AI의 강력한 요약과 분류 기능으로  ',
    description2: '복잡한 데이터를 간단히 정리하세요.',
  },
];

export const AI_COPILOT_CAROUSEL_TITLE: H1andH2Props['head'] = {
  h1: '앞으로 개발 될 기능을 제일 먼저 만나보세요.',
  h2: '혹시 아래와 같은 유저들인가요? 누구보다 먼저 기능을 만나보세요.',
};

export const AI_COPILOT_CAROUSEL_DATA: CarouselSpacingProps['data'] = [
  {
    title: '스타트업 창업자',
    src: '/images/AI/스타트업창업자.png',
    description:
      '신속한 의사결정과 효율적인 정보 관리가 중요한 스타트업 창업자.',
  },
  {
    title: '프리랜서 마케터',
    src: '/images/AI/프리랜서마케터.png',
    description:
      '다수의 클라이언트를 관리하며 마케팅 캠페인, 콘텐츠 전략 등을 계획하고 실행하는 마케터.',
  },
  {
    title: '대학생 또는 연구자',
    src: '/images/AI/대학생.png',
    description:
      '논문 작성, 프로젝트, 학습 자료 정리에 시간을 많이 소비하는 대학생과 연구자.',
  },
  {
    title: '콘텐츠 크리에이터',
    src: '/images/AI/크리에이터.png',
    description:
      '유튜브, 블로그, 인스타그램 등 다양한 플랫폼 콘텐츠를 기획하고 제작하는 사용자.',
  },
  {
    title: '디지털 노마드',
    src: '/images/AI/디지털노마드.png',
    description:
      '여행하면서 일하는 원격 근무자로, 다양한 장소에서 작업하며 정보와 아이디어를 관리해야 하는 사용자.',
  },
];
