export const legalPages = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'August 2026',
    sections: [
      ['Information we collect', 'NextMarga may collect account information, profile information you choose to provide, saved opportunities, applications, preferences, and product usage events needed to operate the service.'],
      ['How we use information', 'We use information to provide and improve NextMarga, personalize opportunity discovery, maintain application workflows, send requested reminders, protect the service, and troubleshoot reliability.'],
      ['Opportunity information', 'Opportunity listings may come from official or other public sources. We may store source URLs, deadlines, eligibility information, and verification timestamps. Users should confirm important details with the official provider before applying.'],
      ['Analytics', 'Product analytics are designed to be privacy-conscious. We record product events such as screens viewed and opportunity interactions and avoid collecting unnecessary sensitive profile or application content in analytics metadata.'],
      ['Storage and security', 'Account data is protected using authentication and database access controls. We use reasonable technical and organizational safeguards, but no internet service can guarantee absolute security.'],
      ['Your choices', 'You can edit your profile and preferences, sign out, request deletion of your account where available, and contact support about privacy questions.'],
      ['Children and eligibility', 'Some opportunities listed on NextMarga may have age or eligibility restrictions. Users must follow the eligibility rules of the relevant opportunity provider.'],
      ['Changes', 'We may update this policy as the product changes. Material changes will be reflected on this page.']
    ]
  },
  terms: {
    title: 'Terms of Service',
    updated: 'August 2026',
    sections: [
      ['Using NextMarga', 'NextMarga is an opportunity-discovery and application-organization service. You are responsible for information you submit and for complying with the rules of each opportunity provider.'],
      ['Opportunity listings', 'Listings are provided for discovery and organization. Deadlines, eligibility, availability, requirements, and application procedures can change. Always verify critical information on the official provider website.'],
      ['No guarantee', 'NextMarga does not guarantee admission, selection, funding, employment, interview results, or availability of any opportunity.'],
      ['Acceptable use', 'Do not misuse the service, attempt unauthorized access, interfere with the platform, submit fraudulent information, or use the service to violate applicable laws or third-party rules.'],
      ['Third-party services', 'NextMarga may link to third-party websites and services. Their terms and privacy policies apply when you leave NextMarga.'],
      ['Account', 'Keep your account credentials secure and provide accurate information. We may suspend access where necessary to protect the service or users.'],
      ['Changes and termination', 'Features may change over time. You may stop using the service at any time, and account deletion may be available through Settings.'],
      ['Important notice', 'These terms are general product terms and are not a substitute for advice from a qualified lawyer regarding your particular circumstances.']
    ]
  },
  verification: {
    title: 'Opportunity Verification Policy',
    updated: 'August 2026',
    sections: [
      ['Source-first approach', 'NextMarga prioritizes official organization, institution, government, university, or program sources when verifying opportunity information.'],
      ['What we verify', 'Where possible, we check the official source URL, deadline, availability/status, and key eligibility information. Verification timestamps help identify information that may need another review.'],
      ['Freshness', 'The platform periodically checks opportunity freshness and identifies expired or stale records. A verification timestamp is not a guarantee that a third-party provider has not changed information moments later.'],
      ['User responsibility', 'Before submitting an application, confirm the current deadline, eligibility, documents, fees, and instructions on the official provider website.'],
      ['Report an issue', 'If you find an incorrect, expired, misleading, or broken listing, report it through the support/report flow so it can be reviewed.']
    ]
  }
} as const;
