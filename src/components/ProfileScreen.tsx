import React, { useRef, useState } from 'react';
import { ArrowLeft, Camera, Check, Plus, X, Sparkles, Upload, Link as LinkIcon, Pencil, XCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { sampleBoards, sampleClasses } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface ProfileScreenProps {
  profile: UserProfile;
  onBack: () => void;
  onSave: (updatedProfile: UserProfile) => void;
  onStartOnboarding: () => void;
}

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, onBack, onSave, onStartOnboarding }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setFormData({ ...profile, interests: [...profile.interests] });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData({ ...profile, interests: [...profile.interests] });
    setShowAddTag(false);
    setNewTag('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    onSave(formData);
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleUploadPhoto = async (file?: File) => {
    if (!file) return;
    if (!ALLOWED_TYPES.has(file.type)) {
      alert('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      alert('Please choose an image smaller than 5 MB.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in again before uploading a profile photo.');

      const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const path = `${user.id}/avatar.${extension}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600',
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;
      setFormData((prev) => ({ ...prev, avatarUrl }));
    } catch (error) {
      console.error('Avatar upload failed:', error);
      alert(error instanceof Error ? error.message : 'Unable to upload profile photo.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageUrl = () => {
    const newUrl = window.prompt('Paste an image URL:', formData.avatarUrl);
    if (newUrl?.trim()) setFormData((prev) => ({ ...prev, avatarUrl: newUrl.trim() }));
  };

  const removeInterest = (interest: string) => setFormData((prev) => ({ ...prev, interests: prev.interests.filter((i) => i !== interest) }));

  const addInterest = () => {
    const value = newTag.trim();
    if (value && !formData.interests.includes(value)) {
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, value] }));
      setNewTag('');
      setShowAddTag(false);
    }
  };

  const fieldClass = `w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-950 focus:border-white/40 focus:outline-none transition-colors ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-sky-800/5 transition-colors"><ArrowLeft className="w-4 h-4 stroke-[1.5]" /></button>
          <div><span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 block font-medium">Candidate Profile</span><h1 className="text-xl sm:text-2xl font-light font-serif-luxury text-slate-950 tracking-tight uppercase">Profile Dossier & Settings</h1></div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button onClick={startEditing} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-medium bg-sky-700 text-slate-950 hover:bg-sky-800 px-4 py-2 rounded-lg transition-all shadow-sm"><Pencil className="w-3.5 h-3.5" />Edit</button>
          ) : (
            <><button onClick={cancelEditing} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-medium bg-slate-50 text-slate-950 border border-slate-200 hover:bg-sky-800/10 px-3 py-2 rounded-lg"><XCircle className="w-3.5 h-3.5" />Cancel</button><button onClick={handleSave} disabled={uploadingPhoto} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-medium bg-sky-700 text-slate-950 hover:bg-sky-800 px-4 py-2 rounded-lg disabled:opacity-50"><Check className="w-3.5 h-3.5" />Save</button></>
          )}
        </div>
      </div>

      {savedToast && <div className="p-3 bg-slate-100 border border-slate-300 text-slate-950 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm animate-fadeIn"><Check className="w-4 h-4" /><span>Profile configuration saved successfully</span></div>}

      <div className="flex flex-col items-center justify-center space-y-3 py-3">
        <div className="relative">
          <img src={formData.avatarUrl} alt={formData.fullName} className="w-24 h-24 rounded-full object-cover border-2 border-slate-300 shadow-lg" />
          {isEditing && <button type="button" disabled={uploadingPhoto} onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-sky-700 text-slate-950 rounded-full shadow-md hover:bg-sky-800 transition-transform active:scale-95 disabled:opacity-50" title="Upload photo"><Camera className="w-3.5 h-3.5" /></button>}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleUploadPhoto(e.target.files?.[0])} />
        </div>
        {isEditing && <div className="flex items-center gap-2"><button disabled={uploadingPhoto} onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-700 text-slate-950 rounded-full text-[10px] font-mono uppercase tracking-wider disabled:opacity-50">{uploadingPhoto ? <span>Uploading…</span> : <><Upload className="w-3 h-3" />Upload Photo</>}</button><button disabled={uploadingPhoto} onClick={handleImageUrl} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-950 border border-slate-200 rounded-full text-[10px] font-mono uppercase tracking-wider disabled:opacity-50"><LinkIcon className="w-3 h-3" />Image URL</button></div>}
        <div className="text-center space-y-1"><h2 className="font-serif-luxury font-medium text-slate-950 text-lg">{formData.fullName}</h2><p className="text-xs font-mono text-slate-500">{formData.currentClass} Scholar</p><button onClick={onStartOnboarding} className="text-[10px] uppercase tracking-[0.15em] font-mono text-slate-700 hover:text-slate-950 mt-1 inline-flex items-center gap-1.5 border border-slate-200 px-3 py-1 rounded bg-slate-50"><Sparkles className="w-3 h-3 text-slate-700" />Re-run Guided Wizard</button></div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"><div className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-2">Personal Identity</div><div className="space-y-3"><div><label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">Full Legal Name</label><input disabled={!isEditing} type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={fieldClass} /></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">Date of Birth</label><input disabled={!isEditing} type="text" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className={fieldClass} /></div><div><label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">Gender</label><select disabled={!isEditing} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className={fieldClass}><option value="Male">Male</option><option value="Female">Female</option><option value="Non-Binary">Non-Binary</option><option value="Other">Other</option></select></div></div><div><label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">Contact Phone</label><input disabled={!isEditing} type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={fieldClass} /></div></div></div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"><div className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-2">Jurisdiction & Location</div><div className="grid grid-cols-2 gap-3"><div><label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">State / Province</label><input disabled={!isEditing} type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={fieldClass} /></div><div><label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">City / District</label><input disabled={!isEditing} type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={fieldClass} /></div></div></div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"><div className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500 border-b border-slate-200 pb-2">Academic Standing</div><div className="space-y-3"><div><label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">Current Class Standing</label><select disabled={!isEditing} value={formData.currentClass} onChange={(e) => setFormData({ ...formData, currentClass: e.target.value })} className={fieldClass}>{sampleClasses.map((cls) => <option key={cls} value={cls}>{cls}</option>)}</select></div><div><label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">Educational Institution</label><input disabled={!isEditing} type="text" value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} className={fieldClass} /></div><div><label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">Curricular Board</label><select disabled={!isEditing} value={formData.educationalBoard} onChange={(e) => setFormData({ ...formData, educationalBoard: e.target.value })} className={fieldClass}>{sampleBoards.map((b) => <option key={b} value={b}>{b}</option>)}</select></div></div></div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"><div className="flex items-center justify-between border-b border-slate-200 pb-2"><div className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500">Aspirations & Focus Disciplines</div>{isEditing && <button onClick={() => setShowAddTag(!showAddTag)} className="text-[10px] uppercase tracking-wider font-mono text-slate-700 hover:text-slate-950 flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Add Discipline</button>}</div>{isEditing && showAddTag && <div className="flex items-center gap-2 pt-1"><input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addInterest()} placeholder="e.g. Astrophysics" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-950 focus:outline-none focus:border-white/40" /><button onClick={addInterest} className="px-3 py-2 bg-sky-700 text-slate-950 rounded-lg text-xs font-medium uppercase tracking-wider">Add</button></div>}<div className="flex flex-wrap gap-2">{formData.interests.map((interest) => <span key={interest} className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-50 text-slate-800 border border-slate-200 text-[10px] font-mono uppercase tracking-wider"><span>{interest}</span>{isEditing && <button onClick={() => removeInterest(interest)} className="hover:text-slate-950" title="Remove tag"><X className="w-3 h-3" /></button>}</span>)}</div></div>
    </div>
  );
};
