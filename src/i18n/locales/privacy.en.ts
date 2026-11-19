// The privacy policy (/privacy), English. Same shape and facts as privacy.ko.ts; the Korean statute's
// items, plus what U.S. visitors expect without claiming any particular U.S. law applies: no sale or
// sharing, rights for visitors anywhere, CalOPPA's Do Not Track disclosure, and children.
import type { Policy } from './privacy.ko.ts';

export const privacyEn: Policy = {
  title: 'Privacy Policy',
  effective: 'Effective November 21, 2026',
  intro: 'DVISION Co., Ltd. (“DVISION”, “we”) runs this solutions website (solution.dvi-ind.com, the “Site”). This policy explains what personal information we collect through the Site, why, and the choices you have. We handle it in accordance with applicable data protection laws, including the Personal Information Protection Act of the Republic of Korea.',
  sections: [
    {
      title: '1. Why we collect personal information',
      body: ['We use what you send through the demo request form only to answer your demo request or inquiry, to arrange a call or meeting, and to look up earlier conversations when you follow up or contact us again. We do not use it for any other purpose and we do not send advertising or marketing emails. If that ever changes, we will ask for your consent first.',
        'Because you asked us to get in touch, we process this information to take the steps you requested before any contract (Article 15(1)(4) of Korea’s Personal Information Protection Act), without asking for separate consent.']
    },
    {
      title: '2. What we collect and how',
      rows: [
        ['Demo request form (required)', 'Name, work email, company name'],
        ['Collected automatically', 'When you visit, our hosting provider’s server logs may record your IP address, browser information and the time of your visit.']
      ],
      body: ['There are no accounts on the Site, and we collect nothing beyond the following. We collect no sensitive personal information.']
    },
    {
      title: '3. How long we keep it',
      rows: [
        ['Inquiries', 'One year after your inquiry is closed, so we can look back at it if your evaluation runs long or you contact us again. Ask us to delete it sooner and we will do so without delay.'],
        ['Email delivery records', 'Resend: 30 days after sending'],
        ['Server and access logs', 'Vercel: 1 hour to 3 days, depending on the plan']
      ]
    },
    {
      title: '4. How we delete it',
      body: ['When the retention period ends or the purpose is fulfilled, we delete the information without delay (within five days). Electronic files are erased so they cannot be recovered; paper records are shredded or incinerated. Inquiry emails in our team’s mailbox (Google Workspace) are deleted when the retention period ends.']
    },
    {
      title: '5. Disclosure to third parties',
      body: ['We do not sell your personal information, share it for cross-context behavioral advertising, or give it to third parties, except where the law requires it.']
    },
    {
      title: '6. Service providers',
      body: ['We rely on the following providers to run the Site. They process personal information only on our behalf and under contract.'],
      rows: [
        ['Plus Five Five, Inc. (Resend)', 'Delivers the demo request form to our team by email'],
        ['Vercel Inc.', 'Hosts the Site and receives the form. It does not store the form’s contents; server and access logs are kept for a short time.'],
        ['Google LLC (Google Workspace)', 'Our company email: receives and keeps inquiry emails']
      ]
    },
    {
      title: '7. International transfer',
      body: [
        'When you submit the form, it passes through Vercel to Resend, which emails it to our company mailbox on Google Workspace, so your information is transferred outside Korea. This transfer is needed to answer the inquiry you sent; under Article 28-8(1)(3) of the Act, we disclose its details here.',
        'For each recipient: country and contact / information / purpose / retention.'
      ],
      rows: [
        ['Plus Five Five, Inc. (Resend)', 'United States, privacy@resend.com / name, work email, company name / emailing your inquiry / 30 days after sending'],
        ['Vercel Inc.', 'United States, privacy@vercel.com / name, work email, company name, IP address, browser information / hosting the Site and receiving the form / the form is passed on, not stored; logs 1 hour to 3 days'],
        ['Google LLC (Google Workspace)', 'United States and other countries with Google data centers, support.google.com/a/contact/googlecloud_dpr / name, work email, company name / receiving and keeping inquiry emails / one year after your inquiry is closed (section 3)'],
        ['When and how', 'On submission, over an encrypted connection (HTTPS)'],
        ['If you do not want it', 'Call us at +82-53-710-1022 instead of using the form. The form cannot be sent without the transfer.']
      ]
    },
    {
      title: '8. Your rights',
      body: [
        'You may at any time ask to access, correct or delete your personal information, or to stop its processing. Email the contact below and we will act on your request without delay (within ten days) and tell you the outcome.',
        'Wherever you live, you may make these requests, and we will not treat you differently for doing so. An authorized agent may make a request for you with your written permission. We will verify requests using the email address you sent the inquiry from.'
      ]
    },
    {
      title: '9. How we protect it',
      list: [
        'Every connection is encrypted (HTTPS)',
        'Access is limited to the staff who answer inquiries',
        'The email-sending key stays on the server and never reaches the browser'
      ]
    },
    {
      title: '10. Cookies, tracking and Do Not Track',
      body: [
        'The Site does not use cookies, analytics or advertising tools, and does not track you across other websites; no third party tracks you through the Site. Because we do not track, the Site works the same whether or not your browser sends a Do Not Track or Global Privacy Control signal.'
      ]
    },
    {
      title: '11. Children',
      body: ['The Site is meant for businesses and is not directed at children. We do not knowingly collect personal information from anyone under 16.']
    },
    {
      title: '12. Contact',
      body: ['For questions, requests or complaints about your personal information, contact:'],
      rows: [
        ['Team', 'DVISION Sales'],
        ['Email', 'sales@dvi-ind.com'],
        ['Phone', '+82-53-710-1022'],
        ['Address', '237, Gukgasandan-daero 33-gil, Gugi-myeon, Dalseong-gun, Daegu, Republic of Korea']
      ]
    },
    {
      title: '13. Further help (Korea)',
      body: ['You can also contact the Personal Information Dispute Mediation Committee (+82-1833-6972, www.kopico.go.kr) or the Personal Information Infringement Report Center (118, privacy.kisa.or.kr).']
    },
    {
      title: '14. Changes to this policy',
      body: ['This policy takes effect on November 21, 2026. If we change it, we will post the new version on this page at least seven days before it takes effect, with its effective date.']
    }
  ]
};
