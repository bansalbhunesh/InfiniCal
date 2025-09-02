import React, { useEffect, useState } from 'react'

export default function AddEntryModal({ isOpen, initial, onCancel, onSave }) {
  const [description, setDescription] = useState(initial?.description || '')
  const [rating, setRating] = useState(String(initial?.rating ?? 4.0))
  const [categories, setCategories] = useState(Array.isArray(initial?.categories) ? initial.categories.join(', ') : '')
  const [imgUrl, setImgUrl] = useState(initial?.imgUrl || '')

  useEffect(() => {
    if (!isOpen) return
    setDescription(initial?.description || '')
    setRating(String(initial?.rating ?? 4.0))
    setCategories(Array.isArray(initial?.categories) ? initial.categories.join(', ') : '')
    setImgUrl(initial?.imgUrl || '')
  }, [isOpen, initial])

  if (!isOpen) return null

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={(e)=>{if(e.target===e.currentTarget) onCancel?.()}}>
      <div style={{width:560,maxWidth:'90vw',maxHeight:'90vh',background:'#fff',borderRadius:12,overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <div style={{padding:16,borderBottom:'1px solid #e2e8f0',fontWeight:700}}>{initial ? 'Edit Entry' : 'Add Entry'}</div>
        <div style={{padding:16,display:'flex',flexDirection:'column',gap:12,overflowY:'auto'}}>
          <div>
            <label style={{fontSize:14,fontWeight:600,display:'block',marginBottom:6}}>Description *</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} style={{width:'100%',minHeight:90,padding:10,border:'1px solid #e2e8f0',borderRadius:8}} />
          </div>
          <div>
            <label style={{fontSize:14,fontWeight:600,display:'block',marginBottom:6}}>Rating</label>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <input type="range" min="1" max="5" step="0.1" value={rating} onChange={e=>setRating(e.target.value)} style={{flex:1}} />
              <span style={{minWidth:40,fontWeight:700,color:'#2563eb'}}>{Number(rating).toFixed(1)}</span>
            </div>
          </div>
          <div>
            <label style={{fontSize:14,fontWeight:600,display:'block',marginBottom:6}}>Categories</label>
            <input value={categories} onChange={e=>setCategories(e.target.value)} placeholder="e.g., Hair Care, Workout" style={{width:'100%',padding:10,border:'1px solid #e2e8f0',borderRadius:8}} />
            <div style={{fontSize:12,color:'#6b7280',marginTop:4}}>Separate multiple categories with commas</div>
          </div>
          <div>
            <label style={{fontSize:14,fontWeight:600,display:'block',marginBottom:6}}>Image URL</label>
            <input value={imgUrl} onChange={e=>setImgUrl(e.target.value)} placeholder="https://..." style={{width:'100%',padding:10,border:'1px solid #e2e8f0',borderRadius:8}} />
          </div>
        </div>
        <div style={{display:'flex',gap:8,padding:12,borderTop:'1px solid #e2e8f0',justifyContent:'flex-end'}}>
          <button onClick={onCancel} style={{background:'#f1f5f9',border:'1px solid #e2e8f0',padding:'8px 14px',borderRadius:8}}>Cancel</button>
          <button onClick={()=>onSave({ description: description.trim(), rating: Number(rating), categories: categories.split(',').map(s=>s.trim()).filter(Boolean), imgUrl: imgUrl.trim() })} style={{background:'#2563eb',color:'#fff',border:'none',padding:'8px 14px',borderRadius:8,fontWeight:700}}>Save</button>
        </div>
      </div>
    </div>
  )
}


