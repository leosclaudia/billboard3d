"use client";
import { useState, useRef } from "react";

const BACKGROUNDS = [
  { id: "nyc", label: "Times Square", url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900" },
  { id: "tokyo", label: "Tokyo", url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900" },
  { id: "city", label: "Ciudad", url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900" },
  { id: "beach", label: "Playa", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900" },
  { id: "stadium", label: "Estadio", url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900" },
];

export default function Home() {
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [bg, setBg] = useState("nyc");
  const [slogan, setSlogan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);
  const selBg = BACKGROUNDS.find(b => b.id === bg);

  const handleFile = (file) => {
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
    setResult(null);
    setError(null);
  };

  const generate = async () => {
    if (!photoFile) { setError("Subí una foto primero"); return; }
    setLoading(true); setError(null); setProgress(10);
    const iv = setInterval(() => setProgress(p => Math.min(p + 3, 88)), 600);
    try {
      const fd = new FormData();
      fd.append("image_file", photoFile);
      fd.append("size", "auto");
      const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": "pBzBsLfZKHNxiiTEvbX4seU2" },
        body: fd,
      });
      if (!bgRes.ok) throw new Error("Error al quitar el fondo");
      const blob = await bgRes.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      const prompt = `Epic 3D anamorphic billboard in ${selBg?.label}, subject bursting out of frame, cinematic lighting, hyperrealistic CGI${slogan ? `, text: "${slogan}"` : ""}`;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.imageUrl);
      setProgress(100);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#07070e", color:"#fff", fontFamily:"sans-serif", padding:"0 0 60px" }}>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"0 18px" }}>
        <div style={{ textAlign:"center", paddingTop:24, marginBottom:28 }}>
          <h1 style={{ fontSize:30, fontWeight:900, color:"#ec4899" }}>Billboard 3D AI</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.4)", marginTop:6 }}>Tu foto en un billboard 3D viral con IA</p>
        </div>

        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginBottom:9 }}>01 · TU FOTO O PRODUCTO</p>
          <div onClick={() => fileRef.current?.click()} style={{ border:"2px dashed rgba(255,45,120,.35)", borderRadius:14, padding:photo?0:32, textAlign:"center", cursor:"pointer", overflow:"hidden", minHeight:90, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {photo
              ? <div style={{ position:"relative", width:"100%" }}>
                  <img src={photo} alt="" style={{ width:"100%", maxHeight:200, objectFit:"cover", display:"block" }} />
                  <div style={{ position:"absolute", bottom:10, right:10, background:"rgba(0,0,0,.75)", padding:"4px 10px", borderRadius:6, fontSize:11 }}>Cambiar</div>
                </div>
              : <div>
                  <div style={{ fontSize:36, marginBottom:8 }}>🤳</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.45)" }}>Subí tu foto o producto</div>
                </div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginBottom:9 }}>02 · SLOGAN (OPCIONAL)</p>
          <input style={{ width:"100%", background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)", borderRadius:13, padding:"14px 16px", color:"#fff", fontSize:15, fontFamily:"inherit", outline:"none" }} placeholder='"Break the frame"' value={slogan} onChange={e => setSlogan(e.target.value)} />
        </div>

        <div style={{ marginBottom:22 }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginBottom:9 }}>03 · FONDO</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {BACKGROUNDS.map(b => (
              <div key={b.id} onClick={() => setBg(b.id)} style={{ borderRadius:10, overflow:"hidden", cursor:"pointer", border: bg===b.id ? "2px solid #ec4899" : "2px solid transparent", position:"relative", aspectRatio:"16/9" }}>
                <img src={b.url} alt={b.label} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,.8))", padding:"12px 6px 5px", fontSize:9, fontWeight:700, textAlign:"center", color:"#fff" }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {error && <div style={{ marginBottom:14, padding:"12px 16px", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, fontSize:13, color:"#fca5a5" }}>⚠️ {error}</div>}

        <button onClick={generate} disabled={loading} style={{ width:"100%", padding:"17px", background:"linear-gradient(135deg,#ec4899,#f97316)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:800, cursor:loading?"not-allowed":"pointer", opacity:loading?0.65:1 }}>
          {loading ? `⚡ Generando… ${Math.round(progress)}%` : "⚡ Generar Billboard 3D con IA"}
        </button>

        {loading && (
          <div style={{ height:4, background:"rgba(255,255,255,.08)", borderRadius:2, marginTop:12, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#ec4899,#f97316)", borderRadius:2, transition:"width .4s" }} />
          </div>
        )}

        {result && (
          <div style={{ marginTop:28 }}>
            <img src={result} alt="result" style={{ width:"100%", borderRadius:16, display:"block", border:"3px solid rgba(236,72,153,.4)" }} />
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <a href={result} download={`billboard-${Date.now()}.png`} style={{ flex:2, padding:"14px", background:"linear-gradient(135deg,#ec4899,#f97316)", borderRadius:12, color:"#fff", fontSize:14, fontWeight:800, textAlign:"center", textDecoration:"none" }}>⬇️ Descargar</a>
              <button onClick={() => { setResult(null); setPhoto(null); setPhotoFile(null); setSlogan(""); }} style={{ flex:1, padding:"14px", background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)", borderRadius:12, color:"rgba(255,255,255,.7)", fontSize:13, cursor:"pointer" }}>🔄 Nuevo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
