import { supabase } from './supabase';
import { UserProfile } from '../types';

export async function saveUserProfile(profile: UserProfile) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be logged in to save your profile.');
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: profile.fullName,
    dob: profile.dob || null,
    gender: profile.gender || null,
    phone: profile.phone || null,
    father_name: profile.fatherName || null,
    mother_name: profile.motherName || null,
    guardian_phone: profile.guardianPhone || null,
    school_name: profile.schoolName || null,
    current_class: profile.currentClass || null,
    educational_board: profile.educationalBoard || null,
    state: profile.state || null,
    city: profile.city || null,
    interests: profile.interests || [],
    target_path: profile.targetPath || null,
    avatar_url: profile.avatarUrl || null,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    fullName: data.full_name ?? '',
    dob: data.dob ?? '',
    gender: data.gender ?? '',
    phone: data.phone ?? '',
    fatherName: data.father_name ?? '',
    motherName: data.mother_name ?? '',
    guardianPhone: data.guardian_phone ?? '',
    schoolName: data.school_name ?? '',
    currentClass: data.current_class ?? '',
    educationalBoard: data.educational_board ?? '',
    state: data.state ?? '',
    city: data.city ?? '',
    interests: data.interests ?? [],
    targetPath: data.target_path ?? '',
    avatarUrl: data.avatar_url ?? '',
  };
}
