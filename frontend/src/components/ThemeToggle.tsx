'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme,setTheme]=useState('light');
  useEffect(()=>{setTheme(document.documentElement.dataset.theme||'light');},[]);
  function toggle(){const next=theme==='light'?'dark':'light';setTheme(next);document.documentElement.dataset.theme=next;try{localStorage.setItem('sofa-theme',next);}catch{}}
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme==='light'?'dark':'light'} theme`} title={`Switch to ${theme==='light'?'dark':'light'} theme`}>
    {theme==='light'?<Moon size={18}/>:<Sun size={18}/>}<span>{theme==='light'?'Dark':'Light'}</span>
  </button>;
}
