
import { useEffect, useState } from 'react'
import { apiFetch } from './services/api'
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  FileText,
  CalendarDays,
  School,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Clock3,
  CheckCircle2,
  Menu,
  X,
  Wallet,
  ClipboardList,
} from 'lucide-react'

type Section =
  | 'dashboard'
  | 'solicitudes'
  | 'estudiantes'
  | 'vacantes'
  | 'cronograma'

const navigation = [
  { id: 'dashboard', label: 'Panel principal', icon: LayoutDashboard },
  { id: 'solicitudes', label: 'Solicitudes', icon: FileText },
  { id: 'estudiantes', label: 'Estudiantes', icon: Users },
  { id: 'vacantes', label: 'Vacantes', icon: School },
  { id: 'cronograma', label: 'Cronograma', icon: CalendarDays },
] as const

type AcademicCatalog = {
  academicPeriods: { id: string; academicYear: number }[]
  educationLevels: {
    id: string
    code: string
    displayName: string
    sortOrder: number
    grades: {
      id: string
      displayName: string
      sortOrder: number
      sections: { id: string; displayName: string }[]
    }[]
  }[]
}

type Vacancy = {
  id: string
  academicYear: number
  educationLevelName: string
  gradeName: string
  sectionName: string
  capacity: number
  occupiedCount: number
  availableCount: number
  hasAvailability: boolean
}

const levelColors = ['bg-orange-50 text-orange-600', 'bg-blue-50 text-blue-600', 'bg-violet-50 text-violet-600']

const activities = [
  { phase: 'Fase regular', activity: 'Difusión de vacantes', dates: '14 dic – 31 dic', status: 'Programado' },
  { phase: 'Fase regular', activity: 'Presentación de solicitudes', dates: '04 ene – 15 ene', status: 'Programado' },
  { phase: 'Fase regular', activity: 'Revisión de solicitudes', dates: '04 ene – 15 ene', status: 'Programado' },
  { phase: 'Fase regular', activity: 'Asignación de vacantes', dates: '20 ene – 29 ene', status: 'Programado' },
  { phase: 'Fase complementaria', activity: 'Difusión de vacantes', dates: '10 feb – 12 feb', status: 'Programado' },
  { phase: 'Fase complementaria', activity: 'Presentación de solicitudes', dates: '15 feb – 19 feb', status: 'Programado' },
]

function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [academicCatalog, setAcademicCatalog] = useState<AcademicCatalog | null>(null)
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [catalogError, setCatalogError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      apiFetch<AcademicCatalog>('/academic-catalog'),
      apiFetch<Vacancy[]>('/vacancies'),
    ])
      .then(([catalog, vacancyList]) => {
        if (!cancelled) {
          setAcademicCatalog(catalog)
          setVacancies(vacancyList)
        }
      })
      .catch(() => {
        if (!cancelled) setCatalogError('No se pudo cargar el catálogo académico. Comprueba la conexión con el backend.')
      })
    return () => { cancelled = true }
  }, [])

  const activeTitle =
    navigation.find((item) => item.id === activeSection)?.label ?? 'Panel principal'

  const handleNavigation = (section: Section) => {
    setActiveSection(section)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {sidebarOpen && (
        <button
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-900 text-white">
            <GraduationCap size={27} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-blue-950">
              I.E.P. Javier Pérez
            </p>
            <p className="mt-1 text-xs text-slate-500">de Cuéllar</p>
          </div>
          <button
            aria-label="Cerrar menú"
            className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-5 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Menú principal
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const selected = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    selected
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                  {selected && <span className="ml-auto h-2 w-2 rounded-full bg-blue-700" />}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl bg-blue-950 p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <GraduationCap size={20} />
            </div>
            <p className="text-sm font-semibold">Educación con valores</p>
            <p className="mt-2 text-xs leading-relaxed text-blue-100/75">
              Formando ciudadanos con disciplina y honestidad.
            </p>
          </div>
          <p className="mt-4 text-center text-[10px] text-slate-400">
            Sistema de gestión de matrícula
          </p>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Abrir menú"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div>
              <p className="text-xs text-slate-400">Sistema de matrícula</p>
              <h1 className="text-lg font-bold text-slate-800">{activeTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              aria-label="Buscar"
              className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 sm:block"
            >
              <Search size={19} />
            </button>
            <button
              aria-label="Notificaciones"
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-900">
                AD
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold text-slate-700">Administrador</p>
                <p className="text-[10px] text-slate-400">Vista de demostración</p>
              </div>
              <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          {activeSection === 'dashboard' ? (
            <>
              <section className="relative overflow-hidden rounded-3xl bg-blue-950 px-6 py-8 text-white sm:px-9 sm:py-10">
                <div className="relative z-10 max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-blue-100">
                    <GraduationCap size={14} />
                    Gestión académica y de matrícula
                  </div>
                  <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                    Bienvenido al sistema de matrícula
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100/80">
                    Administra las solicitudes de matrícula y consulta la información
                    de los niveles educativos de nuestra institución.
                  </p>
                  <button
                    onClick={() => handleNavigation('solicitudes')}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
                  >
                    <ClipboardList size={17} />
                    Ver solicitudes
                  </button>
                </div>
                <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full border-[35px] border-white/[0.04]" />
                <div className="pointer-events-none absolute -bottom-40 right-24 h-80 w-80 rounded-full border-[45px] border-white/[0.04]" />
                <div className="pointer-events-none absolute right-12 top-10 hidden opacity-10 md:block">
                  <School size={190} strokeWidth={0.8} />
                </div>
              </section>

              <section className="mt-8">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Resumen general</h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Indicadores que se cargarán desde el sistema
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-700">
                    Datos pendientes de conexión
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: 'Solicitudes recibidas', icon: FileText, color: 'bg-blue-50 text-blue-700' },
                    { label: 'En revisión', icon: Clock3, color: 'bg-amber-50 text-amber-700' },
                    { label: 'Vacantes disponibles', icon: School, color: 'bg-violet-50 text-violet-700' },
                    { label: 'Matrículas confirmadas', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700' },
                  ].map((stat) => {
                    const Icon = stat.icon
                    return (
                      <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/70">
                        <div className="flex items-center justify-between">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                            <Icon size={20} />
                          </div>
                          <span className="text-xs text-slate-300">—</span>
                        </div>
                        <p className="mt-5 text-2xl font-bold text-slate-800">—</p>
                        <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
                      </div>
                    )
                  })}
                </div>
              </section>

              <section className="mt-8 grid gap-6 xl:grid-cols-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100/70 xl:col-span-3">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-slate-800">Niveles educativos</h2>
                      <p className="mt-1 text-xs text-slate-400">Niveles y grados registrados</p>
                    </div>
                    <School className="text-blue-800" size={21} />
                  </div>
                  <div className="space-y-3">
                    {(academicCatalog?.educationLevels ?? []).map((level, index) => (
                      <div key={level.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${levelColors[index % levelColors.length]}`}>
                            <GraduationCap size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{level.displayName}</p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              {level.grades.map((grade) =>
                                grade.sections.length > 0
                                  ? `${grade.displayName} (${grade.sections.map((section) => section.displayName).join(', ')})`
                                  : grade.displayName,
                              ).join(' · ')}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">{level.grades.length} grados</span>
                      </div>
                    ))}
                    {academicCatalog?.educationLevels.length === 0 && <p className="text-sm text-slate-500">No hay niveles académicos registrados.</p>}
                    {!academicCatalog && !catalogError && <p className="text-sm text-slate-500">Cargando catálogo académico…</p>}
                    {catalogError && <p role="alert" className="text-sm text-rose-600">{catalogError}</p>}
                  </div>
                  <p className="mt-4 text-[11px] leading-relaxed text-slate-400">Los nombres y grados se consultan desde el catálogo del backend.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100/70 xl:col-span-2">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-slate-800">Accesos rápidos</h2>
                      <p className="mt-1 text-xs text-slate-400">Navegación del sistema</p>
                    </div>
                    <Wallet className="text-blue-800" size={21} />
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleNavigation('solicitudes')}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Plus size={20} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-700">Solicitudes</span>
                        <span className="mt-1 block text-[11px] text-slate-400">Consultar solicitudes de matrícula</span>
                      </span>
                    </button>
                    <button
                      onClick={() => handleNavigation('vacantes')}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                        <School size={20} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-700">Consultar vacantes</span>
                        <span className="mt-1 block text-[11px] text-slate-400">Revisar disponibilidad por nivel</span>
                      </span>
                    </button>
                    <button
                      onClick={() => handleNavigation('cronograma')}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                        <CalendarDays size={20} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-700">Cronograma</span>
                        <span className="mt-1 block text-[11px] text-slate-400">Ver etapas del proceso de matrícula</span>
                      </span>
                    </button>
                  </div>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-800">Próximas actividades</h2>
                    <p className="mt-1 text-xs text-slate-400">Cronograma de matrícula proporcionado por la institución</p>
                  </div>
                  <button
                    onClick={() => handleNavigation('cronograma')}
                    className="text-xs font-semibold text-blue-800 hover:underline"
                  >
                    Ver cronograma completo
                  </button>
                </div>
                <div className="mt-5 divide-y divide-slate-100">
                  {activities.slice(0, 3).map((activity) => (
                    <div key={activity.activity} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <CalendarDays size={17} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{activity.activity}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">{activity.phase}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600">
                        {activity.dates}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                {activeSection === 'solicitudes' && <FileText size={23} />}
                {activeSection === 'estudiantes' && <Users size={23} />}
                {activeSection === 'vacantes' && <School size={23} />}
                {activeSection === 'cronograma' && <CalendarDays size={23} />}
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-800">{activeTitle}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                {activeSection === 'cronograma'
                  ? 'Consulta las etapas y fechas del proceso de matrícula de la institución.'
                  : `Esta sección permitirá gestionar ${activeTitle.toLowerCase()} mediante la conexión con el backend del sistema.`}
              </p>

              {activeSection === 'vacantes' ? (
                <div className="mt-6 space-y-3">
                  {catalogError && <p role="alert" className="text-sm text-rose-600">{catalogError}</p>}
                  {vacancies.map((vacancy) => (
                    <article key={vacancy.id} className="rounded-xl border border-slate-100 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-700">{vacancy.educationLevelName} · {vacancy.gradeName} · Sección {vacancy.sectionName}</p>
                        <span className="text-xs text-slate-500">Año académico {vacancy.academicYear}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">Disponibles: {vacancy.availableCount} de {vacancy.capacity} (ocupadas: {vacancy.occupiedCount})</p>
                    </article>
                  ))}
                  {!catalogError && vacancies.length === 0 && <p className="text-sm text-slate-500">No hay vacantes registradas.</p>}
                </div>
              ) : activeSection === 'cronograma' ? (
                <div className="mt-6 space-y-3">
                  {activities.map((activity) => (
                    <div key={`${activity.phase}-${activity.activity}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">{activity.phase}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{activity.activity}</p>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{activity.dates}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-[11px] text-slate-400">
                    Las fechas se muestran sin año porque el cronograma compartido no especifica el año.
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-600">Integración pendiente</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Esta vista se conectará con los endpoints disponibles. No se muestran registros ficticios.
                  </p>
                </div>
              )}
            </section>
          )}

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 py-5 text-[11px] text-slate-400">
            <p>© Sistema de matrícula — I.E.P. Javier Pérez de Cuéllar</p>
            <p>Versión de demostración · Sprint 2</p>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App

