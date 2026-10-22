import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, updateProfile } from "@/lib/db";

export default function Profile() {
  const { user } = useAuth(); const [name,setName]=useState(""); const [grade,setGrade]=useState("10"); const [board,setBoard]=useState("SSC"); const [language,setLanguage]=useState("en"); const [busy,setBusy]=useState(false);
  useEffect(()=>{ if(user) getProfile(user.id).then(p=>{if(p){setName(p.full_name||"");setGrade(p.grade||"10");setBoard(p.board||"SSC");setLanguage(p.preferred_language||"en");}}).catch(e=>toast.error(e.message)); },[user]);
  const save=async()=>{if(!user)return;setBusy(true);try{await updateProfile(user.id,{full_name:name.trim(),grade,board,preferred_language:language});toast.success("Profile updated.");}catch(e){toast.error(e instanceof Error?e.message:"Update failed");}finally{setBusy(false)}};
  return <div className="min-h-screen bg-background"><Navbar/><div className="container mx-auto max-w-xl px-4 py-8"><div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]"><h1 className="font-heading text-2xl font-bold">My Profile</h1><p className="mt-1 mb-6 text-sm text-muted-foreground">Keep your learning preferences up to date.</p><div className="space-y-4"><div><Label>Full name</Label><Input className="mt-2" value={name} onChange={e=>setName(e.target.value)}/></div><div><Label>Email</Label><Input className="mt-2" value={user?.email||""} disabled/></div><div><Label>Board</Label><select className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm" value={board} onChange={e=>setBoard(e.target.value)}><option>SSC</option><option>HSC</option></select></div><div><Label>Grade</Label><select className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm" value={grade} onChange={e=>setGrade(e.target.value)}><option value="10">10</option><option value="12">12</option></select></div><div><Label>Preferred language</Label><select className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm" value={language} onChange={e=>setLanguage(e.target.value)}><option value="en">English</option><option value="hi">Hindi</option><option value="mr">Marathi</option></select></div><Button onClick={save} disabled={busy}>{busy?"Saving...":"Save changes"}</Button></div></div></div></div>;
}
