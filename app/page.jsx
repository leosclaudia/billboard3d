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
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [bg, setBg] = useState("nyc");
  const [slogan, setSlogan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);
  const selBg = BACKGROUNDS.find(b => b.id === bg);

  const handleFile = (file: File) => {
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
      const prompt = `Epic 3D anamorphic billboard advertisement in ${selBg?.label}, giant photorealistic subject bursting out of the billboard frame into the real world, dramatic cinematic lighting, hyperrealistic CGI render, viral advertisement style${slogan ? `, slogan text: "${slogan}"` : ""}`;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.imageUrl);
      setProgress(100);
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#07070e", color:"#fff", fontFamily:"'Inter',system-ui,sans-serif", padding:"0 0 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes hg{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
        .inp{width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);border-radius:13px;padding:14px 16px;color:#fff;font-size:15px;font-family:inherit;outline:none;}
        .inp::placeholder{color:rgba(255,255,255,.3);}
        .btn{width:100%;padding:17px;background:linear-gradient(135deg,#ec4899,#f97316);border:none;border-radius:14px;color:#fff;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;}
        .btn:disabled{opacity:.65;cursor:not-allowed;}
        .pb{height:4px;background:rgba(255,255,255,.08);border-radius:2px;margin-top:12px;overflow:hidden;}
        .pbf{height:100%;background:linear-gradient(90deg,#ec4899,#f97316,#facc15);border-radius:2px;transition:width .4s;}
        .bgt{border-radius:10px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .15s;position:relative;aspect-ratio:16/9;}
        .bgt.on{border-color:#ec4899;box-shadow:0 0 12px rgba(236,72,153,.4);}
      `}</style>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"0 18px" }}>
        <div style={{ textAlign:"center", paddingTop:24, marginBottom:28 }}>
          <p style={{ fontSize:9, letterSpacing:5, color:"rgba(255,255,255,.25)", marginBottom:8 }}>NEONBOARD</p>
          <h1 style={{ fontSize:30, fontWeight:900, background:"linear-gradient(90deg,#ec4899,#f97316,#facc15,#22d3ee,#ec4899)", backgroundSize:"250%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"hg 5s ease infinite" }}>
            Billboard 3D AI
          </h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.3)", marginTop:6 }}>
            Tu foto convertida en un billboard 3D viral con IA
          </p>
        </div>

        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:10, letterSpacing:2, color:"rgba(255,255,255,.35)", marginBottom:9, fontWeight:700 }}>01 · TU FOTO O PRODUCTO</p>
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
          <p style={{ fontSize:10, letterSpacing:2, color:"rgba(255,255,255,.35)", marginBottom:9, fontWeight:700 }}>02 · SLOGAN (OPCIONAL)</p>
          <input className="inp" placeholder='"Break the frame · Feel the scent"' value={slogan} onChange={e => setSlogan(e.target.value)} />
        </div>

        <div style={{ marginBottom:22 }}>
          <p style={{ fontSize:10, letterSpacing:2, color:"rgba(255,255,255,.35)", marginBottom:9, fontWeight:700 }}>03 · FONDO</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {BACKGROUNDS.map(b => (
              <div key={b.id} className={`bgt ${bg===b.id?"on":""}`} onClick={() => setBg(b.id)}>
                <img src={b.url} alt={b.label} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,.8))", padding:"12px 6px 5px", fontSize:9, fontWeight:700, textAlign:"center" }}>{b.label}</div>
                {bg===b.id && <div style={{ position:"absolute", top:4, right:4, width:14, height:14, background:"#ec4899", borderRadius:"50%", fontSize:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900 }}>✓</div>}
              </div>
            ))}
          </div>
        </div>

        {error && <div style={{ marginBottom:14, padding:"12px 16px", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, fontSize:13, color:"#fca5a5" }}>⚠️ {error}</div>}

        <button className="btn" onClick={generate} disabled={loading}>
          {loading ? `⚡ Generando… ${Math.round(progress)}%` : "⚡ Generar Billboard 3D con IA"}
        </button>
        {loading && <div className="pb"><div className="pbf" style={{ width:`${progress}%` }} /></div>}

        {result && (
          <div style={{ marginTop:28 }}>
            <p style={{ fontSize:10, letterSpacing:2, color:"rgba(255,255,255,.35)", marginBottom:12, fontWeight:700, textAlign:"center" }}>✨ TU BILLBOARD 3D</p>
            <img src={result} alt="result" style={{ width:"100%", borderRadius:16, display:"block", border:"3px solid rgba(236,72,153,.4)" }} />
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <a href={result} download={`billboard-${Date.now()}.png`} style={{ flex:2, padding:"14px", background:"linear-gradient(135deg,#ec4899,#f97316)", border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", textAlign:"center", textDecoration:"none" }}>
                ⬇️ Descargar
              </a>
              <button onClick={() => { setResult(null); setPhoto(null); setPhotoFile(null); setSlogan(""); }} style={{ flex:1, padding:"14px", background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)", borderRadius:12, color:"rgba(255,255,255,.7)", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                🔄 Nuevo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
