// The privacy policy (/privacy), Korean: the items 개인정보 보호법 제30조 and 시행령 제31조 require, with
// the overseas transfer (제28조의8) the contact form makes. The processors, their entities, contacts and
// retention are as their own documents state (checked 2026-11-19): Resend's DPA (Plus Five Five, Inc.,
// 30 days on Free/Pro/Scale), Vercel's runtime log limits (1 h Hobby, 1 day Pro, 3 days Enterprise), and the
// company mailbox on Google Workspace (dvi-ind.com's MX). The form asks for no consent: a demo request is
// processed as a step the visitor asked for before a contract (제15조 ① 4호), and the transfer rests on
// disclosing it here (제28조의8 ① 3호); the form says so in one line and links here. privacy.en.ts has the same shape and adds the
// notice U.S. visitors (CES) expect: CalOPPA's Do Not Track disclosure. It claims no particular U.S. law.
// Keep both in step with what the site really does: the form (api/inquiry.ts), the host, the fonts.

/** a section is a heading over paragraphs, a bulleted list and/or label → value rows, in that order */
export type Policy = {
  title: string;
  effective: string;
  intro: string;
  sections: { title: string; body?: string[]; list?: string[]; rows?: [string, string][] }[];
};

export const privacyKo: Policy = {
  title: '개인정보처리방침',
  effective: '시행일 2026. 11. 21.',
  intro: '(주)디비전(이하 “회사”)은 솔루션 홈페이지(solution.dvi-ind.com, 이하 “사이트”)를 운영하며 「개인정보 보호법」에 따라 정보주체의 개인정보를 보호하고 관련 고충을 신속하게 처리하기 위해 다음과 같이 개인정보처리방침을 둡니다.',
  sections: [
    {
      title: '1. 개인정보의 처리 목적',
      body: [
        '회사는 사이트의 데모 신청·문의 폼으로 받은 개인정보를 데모 신청과 도입 문의에 답변하고, 상담 일정을 안내하며, 후속 상담이나 재문의 때 이전 상담 내용을 확인하는 데에만 사용합니다. 이 목적 외의 용도로 이용하지 않으며, 광고·마케팅 메일을 보내지 않습니다. 목적이 바뀌는 경우에는 미리 별도의 동의를 받습니다.',
        '이 처리는 정보주체가 직접 요청한 데모 신청·문의에 답하기 위한 것으로, 「개인정보 보호법」 제15조 제1항 제4호(계약 체결 과정에서 정보주체의 요청에 따른 조치)에 따라 별도의 동의 없이 이루어집니다.'
      ]
    },
    {
      title: '2. 처리하는 개인정보의 항목과 수집 방법',
      rows: [
        ['도입 문의 폼 (필수)', '회사명, 담당자 이름, 회사 이메일, 연락처'],
        ['도입 문의 폼 (선택)', '문의 유형, 검사 대상 설비 수, 도입 희망 시기, 문의 내용'],
        ['자동 생성 정보', '사이트 이용 과정에서 접속 IP 주소, 브라우저 정보, 접속 일시가 호스팅 서버의 접속 기록에 남을 수 있습니다.']
      ],
      body: ['회원가입이 없으며, 아래 항목 외의 정보는 수집하지 않습니다.']
    },
    {
      title: '3. 처리 및 보유 기간',
      rows: [
        ['문의 정보', '상담 종료 후 1년. 도입 검토가 길어지거나 다시 문의하실 때 이전 상담 내용을 확인하기 위해 보관하며, 기간 내라도 삭제를 요청하시면 지체 없이 파기합니다.'],
        ['메일 발송 기록', 'Resend: 발송 후 30일'],
        ['접속·실행 기록', 'Vercel: 요금제에 따라 1시간~3일']
      ]
    },
    {
      title: '4. 개인정보의 파기 절차 및 방법',
      body: ['보유 기간이 지나거나 처리 목적을 달성한 개인정보는 지체 없이(5일 이내) 파기합니다. 전자적 파일은 복구할 수 없는 방법으로 삭제하고, 출력물은 분쇄하거나 소각합니다. 담당자 메일함(Google Workspace)에 받은 문의 메일도 보유 기간이 지나면 삭제합니다.']
    },
    {
      title: '5. 개인정보의 제3자 제공',
      body: ['회사는 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 특별한 규정이 있거나 수사기관이 법령에 따른 절차로 요구하는 경우는 예외로 합니다.']
    },
    {
      title: '6. 개인정보 처리의 위탁',
      body: ['회사는 사이트 운영을 위해 다음과 같이 개인정보 처리 업무를 위탁하며, 위탁 계약에서 개인정보가 안전하게 관리되도록 정하고 있습니다.'],
      rows: [
        ['Plus Five Five, Inc. (Resend)', '문의 내용을 회사 담당자에게 이메일로 발송'],
        ['Vercel Inc.', '사이트 호스팅과 문의 폼 접수 처리. 문의 내용을 따로 저장하지 않으며, 접속·실행 기록은 짧은 기간 보관합니다.'],
        ['Google LLC (Google Workspace)', '회사 이메일: 문의 메일의 수신과 보관']
      ]
    },
    {
      title: '7. 개인정보의 국외 이전',
      body: [
        '문의 폼을 보내면 내용이 Vercel을 거쳐 Resend로 전달되고 회사 이메일(Google Workspace)로 발송되므로, 개인정보가 국외로 이전됩니다. 정보주체가 요청한 문의에 답하는 데 필요한 처리 위탁·보관으로, 「개인정보 보호법」 제28조의8 제1항 제3호에 따라 아래 사항을 이 방침에 공개하고 이전합니다.',
        '이전받는 자마다 이전 국가와 연락처 / 이전 항목 / 이용 목적 / 보유 기간 순으로 적었습니다.'
      ],
      rows: [
        ['Plus Five Five, Inc. (Resend)', '미국, privacy@resend.com / 문의 폼에 적은 항목 / 문의 내용의 이메일 발송 / 발송 후 30일'],
        ['Vercel Inc.', '미국, privacy@vercel.com / 문의 폼에 적은 항목, 접속 IP 주소, 브라우저 정보 / 사이트 호스팅과 문의 접수 처리 / 문의 내용은 저장하지 않고 전달, 접속·실행 기록은 1시간~3일'],
        ['Google LLC (Google Workspace)', '미국 등 Google 데이터센터 소재 국가, support.google.com/a/contact/googlecloud_dpr / 문의 폼에 적은 항목 / 문의 메일의 수신과 보관 / 상담 종료 후 1년 (3항)'],
        ['이전 일시와 방법', '문의 폼 제출 시 암호화된 네트워크(HTTPS)로 전송'],
        ['거부 방법과 효과', '국외 이전을 원하지 않으시면 문의 폼 대신 전화(053-710-1022)로 문의하실 수 있습니다. 문의 폼은 이전 없이 보낼 수 없습니다.']
      ]
    },
    {
      title: '8. 정보주체의 권리와 행사 방법',
      body: [
        '정보주체는 언제든지 자신의 개인정보에 대해 열람, 정정·삭제, 처리정지를 요구할 수 있습니다. 아래 개인정보 보호 담당 이메일로 요청하시면 지체 없이(10일 이내) 조치하고 결과를 알려 드립니다.',
        '법정대리인이나 위임을 받은 사람 등 대리인을 통해서도 요구할 수 있으며, 이 경우 위임장을 제출하셔야 합니다.'
      ]
    },
    {
      title: '9. 개인정보의 안전성 확보 조치',
      list: [
        '모든 전송 구간 암호화(HTTPS)',
        '문의 메일을 받는 담당자로 접근 권한 최소화',
        '메일 발송 키는 서버에만 두고 브라우저에 노출하지 않음'
      ]
    },
    {
      title: '10. 자동 수집 장치의 설치·운영과 거부',
      body: ['사이트는 쿠키와 방문 분석·광고 도구를 사용하지 않습니다.']
    },
    {
      title: '11. 개인정보 보호 담당',
      body: ['개인정보 처리에 관한 문의, 불만 처리, 피해 구제는 아래로 연락해 주십시오.'],
      rows: [
        ['담당 부서', '(주)디비전 영업팀'],
        ['이메일', 'sales@dvi-ind.com'],
        ['전화', '053-710-1022']
      ]
    },
    {
      title: '12. 권익침해 구제 방법',
      body: ['개인정보 침해에 대한 신고나 상담이 필요하시면 아래 기관에 문의하실 수 있습니다.'],
      rows: [
        ['개인정보분쟁조정위원회', '1833-6972 (www.kopico.go.kr)'],
        ['개인정보침해신고센터', '118 (privacy.kisa.or.kr)'],
        ['대검찰청', '1301 (www.spo.go.kr)'],
        ['경찰청', '182 (ecrm.police.go.kr)']
      ]
    },
    {
      title: '13. 해외 방문자 안내',
      body: ['회사는 개인정보를 판매하거나 맞춤형 광고를 위해 공유하지 않습니다. 해외에 거주하시는 분도 8항의 방법으로 열람·정정·삭제를 요청할 수 있으며, 권리 행사를 이유로 불이익을 주지 않습니다.']
    },
    {
      title: '14. 개인정보처리방침의 변경',
      body: ['이 방침은 2026년 11월 21일부터 적용됩니다. 내용이 바뀌는 경우 시행 7일 전부터 이 페이지에 알립니다.']
    }
  ]
};
