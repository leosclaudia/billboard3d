import { useEffect, useMemo, useState } from 'react'

export default function App() {
  const [files, setFiles] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [generated, setGenerated] = useState(false)
  const [activeMenu, setActiveMenu] = useState('Crear Reel')
  const [selectedStyle, setSelectedStyle] = useState('Dinámico')
  const [showAllStyles, setShowAllStyles] = useState(false)
  const [message, setMessage] = useState('')

  const styles = [
    ['🌄', 'Dinámico'],
    ['✨', 'Minimalista'],
    ['💫', 'Emocional'],
    ['🎬', 'Moderno'],
    ['📷', 'Vintage'],
    ['🔥', 'Venta'],
    ['🌿', 'Natural'],
    ['🛍️', 'Producto'],
  ]

  const visibleStyles = showAllStyles ? styles : styles.slice(0, 5)

  const previews = useMemo(() => {
    return files.map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }))
  }, [files])

  const active = previews[activeIndex]

  useEffect(() => {
    if (!generated || previews.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % previews.length)
    }, 2600)
    return () => clearInterval(timer)
  }, [generated, previews.length])

  function handleFiles(event) {
    const selected = Array.from(event.target.files || [])
    setFiles(selected)
    setActiveIndex(0)
    setGenerated(false)
    setMessage('✅ Archivos cargados correctamente')
  }

  function generateReel() {
    if (files.length === 0) {
      alert('Primero subí una foto o video')
      return
    }
    setGenerated(true)
    setMessage(`✨ Reel generado con estilo ${selectedStyle}`)
  }

  function openSection(item) {
    setActiveMenu(item)
    setMessage('')
  }

  function SectionCard({ icon, title, text }) {
    return (
      <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-4 text-4xl">{icon}</div>
        <h3 className="text-xl font-black">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{text}</p>
      </div>
    )
  }

  function SimpleSection({ title, subtitle, children }) {
    return (
      <section>
        <div className="mb-7">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-600">{subtitle}</p>
        </div>
        {children}
      </section>
    )
  }

  function renderSection() {
    if (activeMenu === 'Plantillas') {
      return (
        <SimpleSection
          title="Plantillas"
          subtitle="Elegí una base visual para crear más rápido."
        >
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <SectionCard icon="⚡" title="Venta rápida" text="Ideal para promociones, lanzamientos y ofertas." />
            <SectionCard icon="💫" title="Emocional" text="Perfecta para historias, procesos y marcas personales." />
            <SectionCard icon="🛍️" title="Producto" text="Para mostrar productos, detalles y beneficios." />
            <SectionCard icon="🌿" title="Natural" text="Estética suave, orgánica y cercana." />
            <SectionCard icon="🎬" title="Moderno" text="Visual dinámico para redes sociales." />
            <SectionCard icon="📷" title="Vintage" text="Estilo cálido con sensación artesanal." />
          </div>
        </SimpleSection>
      )
    }

    if (activeMenu === 'Mis Proyectos') {
      return (
        <SimpleSection
          title="Mis Proyectos"
          subtitle="Acá van a aparecer tus reels guardados."
        >
          <div className="rounded-[30px] border-2 border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="text-5xl">📁</div>
            <h3 className="mt-4 text-xl font-black">Todavía no hay proyectos guardados</h3>
            <p className="mt-2 text-sm text-slate-500">
              Cuando agreguemos guardado real, tus reels aparecerán acá.
            </p>
            <button
              onClick={() => setActiveMenu('Crear Reel')}
              className="mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-rose-500 px-6 py-3 text-sm font-black text-white"
            >
              Crear primer reel
            </button>
          </div>
        </SimpleSection>
      )
    }

    if (activeMenu === 'Ideas') {
      return (
        <SimpleSection
          title="Ideas"
          subtitle="Ideas rápidas para crear contenido sin pensar desde cero."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <SectionCard icon="🔥" title="Gancho fuerte" text="Mostrá el resultado final primero y después el proceso." />
            <SectionCard icon="🎁" title="Oferta simple" text="Usá texto corto: “Disponible hoy / Pedidos por WhatsApp”." />
            <SectionCard icon="🎬" title="Antes y después" text="Una imagen inicial, una transformación y cierre con CTA." />
            <SectionCard icon="💬" title="Pregunta al público" text="Cerrá el reel con una pregunta para generar comentarios." />
          </div>
        </SimpleSection>
      )
    }

    if (activeMenu === 'Música') {
      return (
        <SimpleSection
          title="Música"
          subtitle="Sección preparada para agregar audios y ritmos."
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <SectionCard icon="🎵" title="Suave" text="Para reels emocionales y naturales." />
            <SectionCard icon="🥁" title="Dinámica" text="Para ventas, ofertas y contenido rápido." />
            <SectionCard icon="✨" title="Inspiradora" text="Para historias, procesos y presentación de marca." />
          </div>
        </SimpleSection>
      )
    }

    if (activeMenu === 'Marca') {
      return (
        <SimpleSection
          title="Marca"
          subtitle="Configurá colores, estilo y datos de tu marca."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h3 className="text-xl font-black">Nombre de marca</h3>
              <input
                placeholder="Ej: Reel Maker Studio"
                className="mt-4 w-full rounded-2xl border border-slate-200 p-4 text-sm"
              />
            </div>
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h3 className="text-xl font-black">Color principal</h3>
              <input type="color" defaultValue="#8b5cf6" className="mt-4 h-12 w-full rounded-2xl" />
            </div>
          </div>
        </SimpleSection>
      )
    }

    return (
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="min-w-0">
          <div className="rounded-[28px] border-2 border-dashed border-slate-200 bg-white/80 p-7 text-center shadow-sm">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-2xl">
              ☁️
            </div>

            <h3 className="text-xl font-black">Arrastrá tus fotos o videos</h3>
            <p className="mt-2 text-sm text-slate-500">
              Elegí varias imágenes para crear un reel dinámico.
            </p>

            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFiles}
              className="mx-auto mt-6 block w-full max-w-md cursor-pointer rounded-2xl border border-slate-300 bg-white p-3 text-sm"
            />
          </div>

          <div className="mt-7">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black">Elegí un estilo</h3>
              <button
                onClick={() => setShowAllStyles(!showAllStyles)}
                className="text-sm font-bold text-violet-600"
              >
                {showAllStyles ? 'Ver menos' : 'Ver todos'}
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3">
              {visibleStyles.map(([icon, text]) => (
                <button
                  key={text}
                  onClick={() => {
                    setSelectedStyle(text)
                    setGenerated(false)
                    setMessage(`🎨 Estilo seleccionado: ${text}`)
                  }}
                  className="min-w-[105px] overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition hover:scale-[1.03]"
                >
                  <div
                    className={`grid h-24 place-items-center text-3xl ${
                      selectedStyle === text
                        ? 'bg-gradient-to-br from-sky-200 to-violet-200'
                        : 'bg-gradient-to-br from-rose-100 to-orange-100'
                    }`}
                  >
                    {icon}
                  </div>

                  <div
                    className={`py-3 text-xs font-black ${
                      selectedStyle === text
                        ? 'bg-gradient-to-r from-violet-600 to-rose-500 text-white'
                        : 'text-slate-700'
                    }`}
                  >
                    {text}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-7 rounded-[28px] bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-black">Archivos cargados</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-2xl p-3 text-left text-xs font-bold shadow-sm ${
                      activeIndex === index
                        ? 'bg-gradient-to-r from-violet-100 to-rose-100 text-violet-700'
                        : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    ✅ {file.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="min-w-0 rounded-[30px] bg-white p-5 shadow-[0_18px_55px_rgba(30,41,59,0.09)]">
          <h3 className="mb-4 text-lg font-black">Vista previa</h3>

          <div className="relative mx-auto aspect-[9/16] w-full max-w-[250px] overflow-hidden rounded-[28px] bg-black text-white shadow-2xl">
            {active ? (
              <>
                <div
                  className="absolute inset-0 scale-125 blur-3xl opacity-60"
                  style={{
                    backgroundImage: `url(${active.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {active.type.startsWith('video/') ? (
                  <video
                    key={active.url}
                    src={active.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="relative z-10 h-full w-full bg-black object-contain"
                  />
                ) : (
                  <img
                    key={active.url}
                    src={active.url}
                    alt="Preview"
                    className={`relative z-10 h-full w-full bg-black object-contain ${
                      generated
                        ? 'animate-[cinematicMove_4.8s_ease-in-out_infinite_alternate]'
                        : ''
                    }`}
                  />
                )}

                {generated && (
                  <>
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/25 to-transparent"></div>

                    <div className="absolute left-4 right-4 top-4 z-30 flex justify-between text-xs font-black">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-violet-700">
                        {selectedStyle}
                      </span>
                      <span className="rounded-full bg-black/35 px-3 py-1 text-white">
                        {activeIndex + 1}/{previews.length}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-4 right-4 z-30 animate-[textPop_650ms_ease-out]">
                      <p className="mb-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700">
                        ✨ Reel generado
                      </p>

                      <h2 className="text-2xl font-black leading-tight drop-shadow-lg">
                        Tu contenido listo
                      </h2>

                      <p className="mt-1 text-xs font-semibold drop-shadow">
                        estilo {selectedStyle}
                      </p>

                      <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-white/30">
                        <div className="h-1 rounded-full bg-white animate-[pulseLine_2.6s_linear_infinite]"></div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full flex-col justify-end bg-gradient-to-br from-blue-400 via-violet-400 to-slate-950 p-5">
                <div className="mb-auto text-right text-xs opacity-80">✨ ✨ ✨</div>
                <h2 className="text-3xl font-black uppercase">AVENTURAS</h2>
                <p className="text-xl italic opacity-90">Increíbles</p>
              </div>
            )}
          </div>

          <button
            onClick={generateReel}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-rose-500 py-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(139,92,246,0.32)] transition hover:scale-[1.02]"
          >
            ✨ Generar Reel
          </button>

          {generated && (
            <p className="mt-4 text-center text-sm font-bold text-green-600">
              ✅ Vista previa animada
            </p>
          )}

          <p className="mt-4 text-center text-xs text-slate-400">
            Próximo paso: exportar como MP4.
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_right,#ffd6c8_0,#fff7f1_35%,#f8efe9_65%,#f7dce8_100%)] p-4 text-slate-900">
      <style>
        {`
          @keyframes cinematicMove {
            0% { transform: scale(1.03) translateX(-6px); }
            50% { transform: scale(1.09) translateX(6px); }
            100% { transform: scale(1.05) translateX(-4px); }
          }

          @keyframes textPop {
            0% { opacity: 0; transform: translateY(24px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes pulseLine {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}
      </style>

      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[34px] bg-white/95 shadow-[0_30px_90px_rgba(45,35,30,0.18)]">
          <div className="grid min-h-[700px] grid-cols-1 lg:grid-cols-[190px_minmax(0,1fr)]">
            <aside className="hidden border-r border-slate-100 bg-white/80 p-5 lg:block">
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-rose-400 text-white shadow-lg">
                  ▶
                </div>
                <div>
                  <h1 className="text-sm font-black leading-tight">Reel Maker</h1>
                  <p className="text-xs text-slate-500">Studio</p>
                </div>
              </div>

              {['Crear Reel', 'Plantillas', 'Mis Proyectos', 'Ideas', 'Música', 'Marca'].map((item) => (
                <button
                  key={item}
                  onClick={() => openSection(item)}
                  className={`mb-2 w-full rounded-2xl px-3 py-3 text-left text-xs font-bold transition ${
                    activeMenu === item
                      ? 'bg-gradient-to-r from-violet-100 to-rose-100 text-violet-700'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}

              <div className="mt-12 rounded-[24px] border border-orange-100 bg-orange-50 p-4">
                <div className="text-xl">👑</div>
                <h3 className="mt-2 text-sm font-black">Versión Pro</h3>
                <p className="mt-1 text-xs text-slate-500">Más plantillas.</p>
                <button
                  onClick={() =>
                    setMessage('👑 Pro próximamente: MP4, música y más plantillas.')
                  }
                  className="mt-4 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-rose-500 py-3 text-xs font-black text-white"
                >
                  Upgrade
                </button>
              </div>
            </aside>

            <main className="min-w-0 p-5 sm:p-8">
              {activeMenu === 'Crear Reel' && (
                <div className="mb-7">
                  <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                    Crea reels increíbles{' '}
                    <span className="bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent">
                      en minutos
                    </span>
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-slate-600">
                    Subí fotos o videos y generá una vista previa lista para redes.
                  </p>
                </div>
              )}

              {message && (
                <div className="mb-5 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700">
                  {message}
                </div>
              )}

              {renderSection()}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}