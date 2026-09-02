import { Opportunity } from '../types';

export interface StudentEligibilityProfile {
  currentClass?: string | null;
  dob?: string | null;
  educationalBoard?: string | null;
  state?: string | null;
  interests?: string[] | null;
}

export interface OpportunityMatch {
  opportunity: Opportunity;
  score: number;
  eligible: boolean;
  reasons: string[];
  warnings: string[];
}

function classNumber(value?: string | null): number | null {
  if (!value) return null;
  const match = value.match(/\b(?:class|grade)\s*(\d{1,2})\b/i);
  if (match) return Number(match[1]);
  if (/undergraduate|college|technical\s+degree/i.test(value)) return 13;
  if (/postgraduate/i.test(value)) return 14;
  if (/phd|doctoral/i.test(value)) return 15;
  if (/technical\s+diploma|diploma/i.test(value)) return 12.5;
  return null;
}

function ageFromDob(dob?: string | null): number | null {
  if (!dob) return null;
  const date = new Date(dob);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const beforeBirthday = today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 && age < 100 ? age : null;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function overlaps(profileValue: string | null | undefined, allowed: string[] | undefined | null) {
  if (!profileValue || !allowed?.length) return false;
  const value = normalize(profileValue);
  return allowed.some(item => {
    const normalized = normalize(item);
    return value === normalized || value.includes(normalized) || normalized.includes(value);
  });
}

export function matchOpportunity(
  opportunity: Opportunity & {
    minimumClass?: string | null;
    maximumClass?: string | null;
    minimumAge?: number | null;
    maximumAge?: number | null;
    states?: string[] | null;
    boards?: string[] | null;
    interests?: string[] | null;
  },
  profile: StudentEligibilityProfile
): OpportunityMatch {
  let score = 0;
  let hardFailures = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  const studentClass = classNumber(profile.currentClass);
  const minClass = classNumber(opportunity.minimumClass);
  const maxClass = classNumber(opportunity.maximumClass);

  if (studentClass !== null && (minClass !== null || maxClass !== null)) {
    const classOkay = (minClass === null || studentClass >= minClass) &&
      (maxClass === null || studentClass <= maxClass);
    if (classOkay) {
      score += 35;
      reasons.push('Your class matches the stated eligibility.');
    } else {
      hardFailures += 1;
      warnings.push('Your current class is outside the stated class range.');
    }
  } else {
    score += 5;
    warnings.push('Class eligibility needs manual verification.');
  }

  const age = ageFromDob(profile.dob);
  const minAge = opportunity.minimumAge ?? null;
  const maxAge = opportunity.maximumAge ?? null;
  if (age !== null && (minAge !== null || maxAge !== null)) {
    const ageOkay = (minAge === null || age >= minAge) &&
      (maxAge === null || age <= maxAge);
    if (ageOkay) {
      score += 25;
      reasons.push('Your age matches the stated eligibility.');
    } else {
      hardFailures += 1;
      warnings.push('Your age is outside the stated age range.');
    }
  }

  if (profile.state && opportunity.states?.length) {
    if (overlaps(profile.state, opportunity.states)) {
      score += 15;
      reasons.push('Available in your state.');
    } else {
      hardFailures += 1;
      warnings.push('This opportunity is restricted to other states.');
    }
  }

  if (profile.educationalBoard && opportunity.boards?.length) {
    if (overlaps(profile.educationalBoard, opportunity.boards)) {
      score += 10;
      reasons.push('Your education board matches.');
    } else {
      warnings.push('Check whether your board is accepted.');
    }
  }

  const interests = (profile.interests ?? []).map(normalize);
  const opportunityInterests = (opportunity.interests ?? []).map(normalize);
  const interestAliases: Record<string, string[]> = {
    'computer science': ['coding','software','technology','web development','app development'],
    'coding': ['computer science','software','technology','web development'],
    'artificial intelligence': ['ai','machine learning','data science','coding'],
    'machine learning': ['artificial intelligence','ai','data science'],
    'medicine': ['medical','biology','life sciences','public health'],
    'design & ui/ux': ['design','ui','ux','graphic design','product'],
    'entrepreneurship': ['startup','business','innovation','management'],
    'research': ['science','engineering','phd','innovation'],
    'sports': ['athletics','fitness','chess','esports'],
  };
  if (interests.length && opportunityInterests.length) {
    const matched = interests.filter(interest =>
      opportunityInterests.some(target =>
        interest === target || interest.includes(target) || target.includes(interest) ||
        (interestAliases[interest] ?? []).some(alias => target.includes(alias) || alias.includes(target))
      )
    );
    if (matched.length) {
      score += Math.min(20, matched.length * 5);
      reasons.push(`Matches your interest in ${matched.slice(0, 2).join(' and ')}.`);
    }
  }

  if (opportunity.isVerified) score += 5;

  return {
    opportunity,
    score: Math.max(0, Math.min(100, score)),
    eligible: hardFailures === 0,
    reasons,
    warnings,
  };
}

export function rankOpportunities(
  opportunities: Array<Opportunity & {
    minimumClass?: string | null;
    maximumClass?: string | null;
    minimumAge?: number | null;
    maximumAge?: number | null;
    states?: string[] | null;
    boards?: string[] | null;
    interests?: string[] | null;
  }>,
  profile: StudentEligibilityProfile
): OpportunityMatch[] {
  return opportunities
    .map(opportunity => matchOpportunity(opportunity, profile))
    .filter(match => match.eligible)
    .sort((a, b) => b.score - a.score);
}
