import {
  CarouselSpacingProps,
  H1andH2Props,
  LandingTabsProps,
} from '@/app/(landing)/page';

export const INFO_COLLECTION_TABS_TITLE: H1andH2Props['head'] = {
  h1: '간편하고 빠르게 정보를 수집하세요.',
  h2: '여러 플랫폼에서 한 번의 클릭으로 필요한 정보를 저장할 수 있습니다.',
};

export const INFO_COLLECTION_TABS_DATA: LandingTabsProps['data'] = [
  {
    title: '워크스페이스',
    src: '/images/infoCollection/워크스페이스.png',
  },
  {
    title: '익스텐션 연동',
    src: '/images/infoCollection/익스텐션연동.png',
  },
  {
    title: '메신저앱 연동',
    src: '/images/infoCollection/메신저앱연동.png',
  },
];

export const INFO_COLLECTION_TWOIMAGE_TITLE: H1andH2Props['head'] = {
  h1: '지식관리를 위한 다양한 편의기능을 제공합니다.',
  h2: '워크스페이스, 익스텐션, 메신저앱 연동을 통해 정보를 수집하고 정리할 수 있습니다.',
};

export const INFO_COLLECTION_TWOIMAGE_DATA: CarouselSpacingProps['data'] = [
  {
    title: '간편한 공유',
    src: '/images/infoCollection/간편한공유.png',
    description: '중요도를 기준으로 작업을 ‘Must, Should, Could',
    description2: ', Won’t’로 나눕니다',
  },
  {
    title: '강력한 알림',
    src: '/images/infoCollection/강력한알림.png',
    description: '메모를 연결해 ',
    description2: '아이디어를 체계적으로 확장하는 방식입니다.',
  },
];

export const INFO_COLLECTION_CAROUSEL_TITLE: H1andH2Props['head'] = {
  h1: '다양한 유형의 정보를 한 곳에서 관리하세요.',
  h2: '메모를 연결해 아이디어를 체계적으로 확장하는 방식입니다.',
};

export const INFO_COLLECTION_CAROUSEL_DATA: CarouselSpacingProps['data'] = [
  {
    title: 'Web Page',
    src: '/images/infoCollection/네이버.png',
    description:
      '웹 페이지에서 유용한 정보를 클릭 한 번으로 저장하고, 필요할 때 바로 찾아보세요.',
  },
  {
    title: 'Blogs',
    src: '/images/infoCollection/벨로그.png',
    description:
      '관심 있는 블로그 글을 저장하고, 중요한 통찰과 아이디어를 놓치지 마세요.',
  },
  {
    title: 'Youtube',
    src: '/images/infoCollection/유튜브.png',
    description:
      '유튜브 동영상과 중요한 타임스탬프를 기록해, 콘텐츠를 효율적으로 관리하세요.',
  },
  {
    title: 'Instagram',
    src: '/images/infoCollection/인스타그램.png',
    description:
      '인스타그램의 인사이트와 시각적 자료를 저장하여 아이디어에 영감을 더하세요.',
  },
  {
    title: 'Tiktok',
    src: '/images/infoCollection/틱톡.png',
    description:
      '틱톡에서 발견한 트렌디한 정보를 스크랩하고, 빠르게 액세스하세요.',
  },
  {
    title: 'Image',
    src: '/images/infoCollection/이미지.png',
    description:
      '이미지와 시각적 자료를 정리해, 프로젝트나 프레젠테이션에서 활용하세요.',
  },
  {
    title: 'PDF',
    src: '/images/infoCollection/pdf.png',
    description: 'PDF 문서를 저장하고, 필요한 정보를 쉽게 검색하고 활용하세요.',
  },
];
