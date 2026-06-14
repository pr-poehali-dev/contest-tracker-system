import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "student" | "teacher" | "admin" | "sysadmin";
type Section =
  | "home"
  | "calendar"
  | "portfolio"
  | "rating"
  | "applications"
  | "reports"
  | "notifications";

const ROLES: { id: Role; label: string; icon: string; color: string }[] = [
  { id: "student", label: "Учащийся", icon: "GraduationCap", color: "hsl(158,64%,52%)" },
  { id: "teacher", label: "Педагог", icon: "BookOpen", color: "hsl(217,91%,60%)" },
  { id: "admin", label: "Администратор", icon: "Shield", color: "hsl(280,70%,60%)" },
  { id: "sysadmin", label: "Сис. администратор", icon: "Settings", color: "hsl(43,96%,56%)" },
];

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "LayoutDashboard" },
  { id: "calendar", label: "Календарь", icon: "CalendarDays" },
  { id: "portfolio", label: "Портфолио", icon: "Award" },
  { id: "rating", label: "Рейтинг", icon: "TrendingUp" },
  { id: "applications", label: "Заявки", icon: "ClipboardList" },
  { id: "reports", label: "Отчёты", icon: "BarChart3" },
  { id: "notifications", label: "Уведомления", icon: "Bell" },
];

const CONTESTS = [
  { id: 1, title: "Всероссийская олимпиада по математике", level: "Всероссийский", date: "20 июн 2026", status: "open", participants: 342 },
  { id: 2, title: "Конкурс научных проектов «Шаг в науку»", level: "Муниципальный", date: "15 июл 2026", status: "open", participants: 87 },
  { id: 3, title: "Фестиваль творчества «Звёздный час»", level: "Школьный", date: "5 июн 2026", status: "registration", participants: 156 },
  { id: 4, title: "Чемпионат по программированию", level: "Региональный", date: "28 июн 2026", status: "open", participants: 210 },
  { id: 5, title: "Конкурс сочинений «Моя Россия»", level: "Всероссийский", date: "10 июл 2026", status: "registration", participants: 521 },
];

const ACHIEVEMENTS = [
  { id: 1, title: "Золото — Олимпиада по физике 2025", level: "gold", date: "12 мар 2025", verified: true },
  { id: 2, title: "Серебро — Конкурс проектов «Горизонт»", level: "silver", date: "5 окт 2024", verified: true },
  { id: 3, title: "Участие — Всероссийский диктант", level: "bronze", date: "16 апр 2024", verified: false },
];

const RATING = [
  { rank: 1, name: "Алина Смирнова", points: 1840, wins: 7, grade: "11А" },
  { rank: 2, name: "Максим Воронов", points: 1620, wins: 5, grade: "10Б" },
  { rank: 3, name: "Диана Козлова", points: 1510, wins: 6, grade: "11В" },
  { rank: 4, name: "Артём Петров", points: 1380, wins: 4, grade: "9А" },
  { rank: 5, name: "Кира Новикова", points: 1240, wins: 3, grade: "10А" },
  { rank: 6, name: "Иван Соколов", points: 1100, wins: 4, grade: "11Б" },
  { rank: 7, name: "Полина Зайцева", points: 960, wins: 2, grade: "9В" },
];

const NOTIFICATIONS = [
  { id: 1, title: "Старт регистрации: Олимпиада по химии", time: "2 часа назад", type: "info", read: false },
  { id: 2, title: "Ваша заявка подтверждена: Фестиваль «Звёздный час»", time: "вчера", type: "success", read: false },
  { id: 3, title: "Новый документ добавлен: Грамота 9А класса", time: "2 дня назад", type: "doc", read: true },
  { id: 4, title: "Дедлайн через 3 дня: Конкурс сочинений", time: "3 дня назад", type: "warning", read: true },
];

const APPLICATIONS = [
  { id: 1, contest: "Олимпиада по математике", cls: "10А", count: 12, status: "pending", date: "10 июн 2026" },
  { id: 2, contest: "Фестиваль «Звёздный час»", cls: "9Б", count: 28, status: "approved", date: "3 июн 2026" },
  { id: 3, contest: "Конкурс «Шаг в науку»", cls: "11А", count: 5, status: "pending", date: "8 июн 2026" },
  { id: 4, contest: "Всероссийский диктант", cls: "10А, 10Б, 11А", count: 67, status: "approved", date: "1 июн 2026" },
];

const levelColor = (level: string) => {
  if (level === "Всероссийский") return "text-amber-400 bg-amber-400/10 border-amber-400/30";
  if (level === "Региональный") return "text-violet-400 bg-violet-400/10 border-violet-400/30";
  if (level === "Муниципальный") return "text-blue-400 bg-blue-400/10 border-blue-400/30";
  return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
};

const statusColor = (status: string) => {
  if (status === "approved") return "text-emerald-400 bg-emerald-400/10";
  if (status === "pending") return "text-amber-400 bg-amber-400/10";
  return "text-red-400 bg-red-400/10";
};

const rankMedal = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

export default function Index() {
  const [role, setRole] = useState<Role>("student");
  const [section, setSection] = useState<Section>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedClass, setSelectedClass] = useState("10А");

  const currentRole = ROLES.find((r) => r.id === role)!;

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <div className="orb orb-gold" />
      <div className="orb orb-purple" />

      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 flex-shrink-0 bg-sidebar border-r border-border flex flex-col z-10 relative`}
      >
        <div className="h-16 flex items-center px-4 border-b border-border gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-oswald font-bold text-sm">КТ</span>
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in overflow-hidden">
              <div className="font-oswald font-semibold text-sm text-foreground leading-tight whitespace-nowrap">Конкурс-Трекер</div>
              <div className="text-[10px] text-muted-foreground tracking-wider uppercase whitespace-nowrap">Портфолио достижений</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={18} fallback="Menu" />
          </button>
        </div>

        {sidebarOpen && (
          <div className="px-3 py-3 border-b border-border">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">Роль</div>
            <div className="space-y-1">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-all ${
                    role === r.id
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                  {r.label}
                  {role === r.id && (
                    <Icon name="Check" size={12} className="ml-auto" style={{ color: r.color }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                section === item.id
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon name={item.icon} size={18} fallback="Circle" />
              {sidebarOpen && <span className="font-plex">{item.label}</span>}
              {item.id === "notifications" && sidebarOpen && (
                <span className="ml-auto text-[10px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center font-mono font-bold">
                  2
                </span>
              )}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-secondary/30">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-oswald font-bold text-primary-foreground flex-shrink-0"
                style={{ background: currentRole.color }}
              >
                АС
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-medium text-foreground truncate">Алина Смирнова</div>
                <div className="text-[11px] text-muted-foreground truncate">{currentRole.label}</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-6 gap-4 z-10">
          <div>
            <h1 className="font-oswald text-lg font-semibold text-foreground">
              {NAV_ITEMS.find((n) => n.id === section)?.label}
            </h1>
            <p className="text-xs text-muted-foreground">
              {section === "home" && "Обзор системы и ключевые метрики"}
              {section === "calendar" && "Конкурсы и рекомендации по датам"}
              {section === "portfolio" && "Цифровые достижения и дипломы"}
              {section === "rating" && "Рейтинг участников и статистика"}
              {section === "applications" && "Регистрация и управление заявками"}
              {section === "reports" && "Аналитика и отчёты для администрации"}
              {section === "notifications" && "Push-уведомления о конкурсах"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden md:block">
              <input
                placeholder="Поиск конкурсов..."
                className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground w-52 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <Icon name="Search" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <button
              onClick={() => setSection("notifications")}
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <Icon name="Bell" size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">

          {/* HOME */}
          {section === "home" && (
            <div className="space-y-6 stagger">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Активных конкурсов", value: "24", icon: "Trophy", color: "hsl(43,96%,56%)", delta: "+3 за неделю" },
                  { label: "Участников", value: "1 284", icon: "Users", color: "hsl(158,64%,52%)", delta: "+48 за месяц" },
                  { label: "Загружено дипломов", value: "387", icon: "Award", color: "hsl(217,91%,60%)", delta: "+12 за неделю" },
                  { label: "Побед в этом году", value: "93", icon: "Star", color: "hsl(280,70%,60%)", delta: "↑15% к 2024" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-xl p-5 card-lift achievement-glow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                        <Icon name={stat.icon} size={20} fallback="Star" style={{ color: stat.color }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{stat.delta}</span>
                    </div>
                    <div className="font-oswald text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-oswald text-base font-semibold">Ближайшие конкурсы</h3>
                    <button onClick={() => setSection("calendar")} className="text-xs text-primary hover:underline">Все →</button>
                  </div>
                  <div className="space-y-3">
                    {CONTESTS.slice(0, 4).map((c) => (
                      <div key={c.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <Icon name="Trophy" size={14} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{c.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${levelColor(c.level)}`}>{c.level}</span>
                            <span className="text-[10px] text-muted-foreground">{c.date}</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{c.participants}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-oswald text-base font-semibold">Активность по месяцам</h3>
                    <span className="text-xs text-muted-foreground">2025–2026</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { month: "Сентябрь", val: 65 },
                      { month: "Октябрь", val: 82 },
                      { month: "Ноябрь", val: 74 },
                      { month: "Декабрь", val: 91 },
                      { month: "Январь", val: 48 },
                      { month: "Февраль", val: 77 },
                      { month: "Март", val: 88 },
                      { month: "Апрель", val: 95 },
                      { month: "Май", val: 72 },
                    ].map((m) => (
                      <div key={m.month} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{m.month}</span>
                        <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full progress-shimmer" style={{ width: `${m.val}%` }} />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-6 text-right">{m.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl border p-4 flex items-center gap-4"
                style={{ borderColor: `${currentRole.color}30`, background: `${currentRole.color}08` }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${currentRole.color}20` }}>
                  <Icon name={currentRole.icon} size={20} fallback="User" style={{ color: currentRole.color }} />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">Вы вошли как: {currentRole.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {role === "student" && "Вы можете подавать заявки на конкурсы, загружать дипломы и следить за своим прогрессом."}
                    {role === "teacher" && "Вы можете массово регистрировать учащихся, подтверждать участие и смотреть рейтинг своих учеников."}
                    {role === "admin" && "Вы управляете каталогом конкурсов, верифицируете документы и формируете отчёты для Департамента."}
                    {role === "sysadmin" && "Вы управляете интеграциями с АСУ, правами доступа и шаблонами отчётов."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALENDAR */}
          {section === "calendar" && (
            <div className="space-y-6 stagger">
              <div className="flex items-center gap-3 flex-wrap">
                {["Все уровни", "Школьный", "Муниципальный", "Региональный", "Всероссийский"].map((f) => (
                  <button
                    key={f}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      f === "Все уровни"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <div className="ml-auto">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm text-foreground border border-border">
                    <Icon name="CalendarDays" size={14} />
                    Июнь 2026
                    <Icon name="ChevronDown" size={14} />
                  </button>
                </div>
              </div>
              <div className="grid gap-4">
                {CONTESTS.map((c) => (
                  <div key={c.id} className="bg-card border border-border rounded-xl p-5 card-lift flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex flex-col items-center justify-center flex-shrink-0 border border-border">
                      <span className="font-oswald text-xl font-bold text-primary leading-none">{c.date.split(" ")[0]}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{c.date.split(" ")[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-oswald text-base font-semibold text-foreground">{c.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${levelColor(c.level)}`}>{c.level}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon name="Users" size={12} />
                          {c.participants} участников
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === "open" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                          {c.status === "open" ? "Идёт регистрация" : "Скоро открытие"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                        Подать заявку
                      </button>
                      <button className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors">
                        Подробнее
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PORTFOLIO */}
          {section === "portfolio" && (
            <div className="space-y-6 stagger">
              <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl font-oswald font-bold text-primary-foreground flex-shrink-0">
                  АС
                </div>
                <div className="flex-1">
                  <h2 className="font-oswald text-2xl font-bold text-foreground">Алина Смирнова</h2>
                  <p className="text-muted-foreground text-sm mt-0.5">11А класс • МБОУ «Лицей №47»</p>
                  <div className="flex gap-6 mt-3">
                    {[{ label: "Побед", value: "7" }, { label: "Участий", value: "18" }, { label: "Очков", value: "1 840" }].map((s) => (
                      <div key={s.label}>
                        <div className="font-oswald text-xl font-bold text-primary">{s.value}</div>
                        <div className="text-[11px] text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  <Icon name="Upload" size={14} />
                  Загрузить диплом
                </button>
              </div>

              <div>
                <h3 className="font-oswald text-lg font-semibold mb-4">Достижения и дипломы</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ACHIEVEMENTS.map((a) => (
                    <div
                      key={a.id}
                      className={`bg-card border rounded-xl p-5 card-lift relative overflow-hidden ${
                        a.level === "gold" ? "border-amber-400/30" : a.level === "silver" ? "border-slate-400/30" : "border-orange-500/30"
                      }`}
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full ${
                        a.level === "gold" ? "bg-gradient-to-b from-amber-400 to-amber-600" :
                        a.level === "silver" ? "bg-gradient-to-b from-slate-300 to-slate-500" :
                        "bg-gradient-to-b from-orange-500 to-red-600"
                      }`} />
                      <div className="pl-2">
                        <div className="text-2xl mb-2">{a.level === "gold" ? "🥇" : a.level === "silver" ? "🥈" : "🎖️"}</div>
                        <h4 className="font-medium text-sm text-foreground leading-snug">{a.title}</h4>
                        <p className="text-[11px] text-muted-foreground mt-1.5">{a.date}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${a.verified ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                            <Icon name={a.verified ? "CheckCircle" : "Clock"} size={10} fallback="Circle" />
                            {a.verified ? "Верифицировано" : "Ожидает проверки"}
                          </span>
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Icon name="Eye" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-secondary/30 border border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground hover:border-primary/30 transition-all card-lift">
                    <Icon name="Plus" size={24} />
                    <span className="text-sm">Добавить достижение</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-oswald text-base font-semibold">Прогресс до следующего уровня</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Уровень «Мастер конкурсов» — 2 000 очков</p>
                  </div>
                  <span className="font-oswald text-2xl font-bold text-primary">1 840 / 2 000</span>
                </div>
                <div className="bg-secondary rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full progress-shimmer" style={{ width: "92%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Ещё 160 очков до уровня «Мастер конкурсов» 🏆</p>
              </div>
            </div>
          )}

          {/* RATING */}
          {section === "rating" && (
            <div className="space-y-6 stagger">
              <div className="grid grid-cols-3 gap-4">
                {RATING.slice(0, 3).map((r, i) => (
                  <div
                    key={r.rank}
                    className={`bg-card border rounded-xl p-5 text-center card-lift relative overflow-hidden ${
                      i === 0 ? "border-amber-400/40" : i === 1 ? "border-slate-400/30" : "border-orange-500/30"
                    }`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 ${
                      i === 0 ? "bg-gradient-to-r from-amber-400 to-amber-600" :
                      i === 1 ? "bg-gradient-to-r from-slate-300 to-slate-500" :
                      "bg-gradient-to-r from-orange-500 to-red-600"
                    }`} />
                    <div className="text-3xl mt-2 mb-3">{rankMedal(r.rank)}</div>
                    <div className="font-oswald text-base font-semibold text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.grade}</div>
                    <div className="font-oswald text-2xl font-bold text-primary mt-3">{r.points}</div>
                    <div className="text-[11px] text-muted-foreground">очков</div>
                    <div className="mt-2 text-xs text-muted-foreground">{r.wins} побед</div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-oswald font-semibold">Общий рейтинг участников</h3>
                  <div className="flex gap-2">
                    {["Год", "Месяц", "Неделя"].map((t) => (
                      <button key={t} className={`text-xs px-3 py-1 rounded-full transition-all ${t === "Год" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  {RATING.map((r, i) => (
                    <div
                      key={r.rank}
                      className={`flex items-center gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors ${r.name === "Алина Смирнова" ? "bg-primary/5" : ""}`}
                    >
                      <span className="w-8 text-center font-oswald font-bold text-lg text-muted-foreground">{rankMedal(r.rank)}</span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#ea580c" : "hsl(220,15%,30%)" }}
                      >
                        {r.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{r.name}</div>
                        <div className="text-[11px] text-muted-foreground">{r.grade}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-oswald font-bold text-primary">{r.points}</div>
                        <div className="text-[11px] text-muted-foreground">{r.wins} побед</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* APPLICATIONS */}
          {section === "applications" && (
            <div className="space-y-6 stagger">
              {(role === "teacher" || role === "admin") && (
                <div className="bg-card border border-primary/30 rounded-xl p-5 achievement-glow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                      <Icon name="Zap" size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-oswald font-semibold text-foreground">Массовая подача заявки</h3>
                      <p className="text-xs text-muted-foreground">Зарегистрируйте весь класс одним действием</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Конкурс</label>
                      <select className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                        {CONTESTS.map((c) => <option key={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Класс / группа</label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                      >
                        {["9А", "9Б", "10А", "10Б", "11А", "11Б", "11В"].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Учащихся в классе</label>
                      <div className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground flex items-center justify-between">
                        <span>28 учащихся</span>
                        <span className="text-xs text-muted-foreground">автозаполнение</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                      <Icon name="Send" size={14} />
                      Подать заявку за класс {selectedClass}
                    </button>
                    <span className="text-xs text-muted-foreground">Данные учащихся заполнятся автоматически из базы</span>
                  </div>
                </div>
              )}

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-oswald font-semibold">Поданные заявки</h3>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
                    <Icon name="Plus" size={12} />
                    Новая заявка
                  </button>
                </div>
                <div>
                  {APPLICATIONS.map((a) => (
                    <div key={a.id} className="flex items-center gap-4 px-5 py-4 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <Icon name="ClipboardList" size={16} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">{a.contest}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Класс: {a.cls} • {a.count} участников</div>
                      </div>
                      <span className="text-xs text-muted-foreground hidden md:block">{a.date}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(a.status)}`}>
                        {a.status === "approved" ? "✓ Одобрено" : "⏳ Ожидание"}
                      </span>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Icon name="MoreHorizontal" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* REPORTS */}
          {section === "reports" && (
            <div className="space-y-6 stagger">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Сводный отчёт для Департамента", desc: "Участие учащихся во всех конкурсах за учебный год", icon: "FileText", color: "hsl(43,96%,56%)" },
                  { title: "Рейтинг по классам", desc: "Сравнительная таблица активности классов", icon: "BarChart3", color: "hsl(158,64%,52%)" },
                  { title: "Статистика побед", desc: "Разбивка по уровням и предметным областям", icon: "TrendingUp", color: "hsl(217,91%,60%)" },
                  { title: "Незагруженные дипломы", desc: "Список участий без подтверждающих документов", icon: "AlertCircle", color: "hsl(280,70%,60%)" },
                ].map((r) => (
                  <div key={r.title} className="bg-card border border-border rounded-xl p-5 card-lift flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${r.color}15` }}>
                      <Icon name={r.icon} size={22} fallback="File" style={{ color: r.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-oswald font-semibold text-foreground">{r.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                          <Icon name="Download" size={12} />
                          Скачать XLSX
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs hover:bg-secondary/80 transition-colors border border-border">
                          <Icon name="Eye" size={12} />
                          Просмотр
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-oswald font-semibold mb-4">Быстрая статистика 2025–2026</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Конкурсов проведено", value: "47" },
                    { label: "Всего участий", value: "2 341" },
                    { label: "Призовых мест", value: "186" },
                    { label: "Верифицировано документов", value: "312" },
                  ].map((s) => (
                    <div key={s.label} className="bg-secondary/40 rounded-xl p-4 text-center">
                      <div className="font-oswald text-2xl font-bold text-primary">{s.value}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {section === "notifications" && (
            <div className="space-y-4 stagger">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2 flex-wrap">
                  {["Все", "Непрочитанные", "Конкурсы", "Документы"].map((f) => (
                    <button key={f} className={`px-3 py-1.5 rounded-full text-xs border transition-all ${f === "Все" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                      {f}
                    </button>
                  ))}
                </div>
                <button className="text-xs text-primary hover:underline">Отметить все прочитанными</button>
              </div>

              <div className="space-y-3">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={`bg-card border rounded-xl p-4 flex items-start gap-4 transition-all card-lift ${!n.read ? "border-primary/30" : "border-border"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === "success" ? "bg-emerald-400/10" : n.type === "warning" ? "bg-amber-400/10" : n.type === "doc" ? "bg-blue-400/10" : "bg-violet-400/10"}`}>
                      <Icon
                        name={n.type === "success" ? "CheckCircle" : n.type === "warning" ? "AlertTriangle" : n.type === "doc" ? "FileText" : "Info"}
                        size={18}
                        fallback="Bell"
                        className={n.type === "success" ? "text-emerald-400" : n.type === "warning" ? "text-amber-400" : n.type === "doc" ? "text-blue-400" : "text-violet-400"}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                        {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-oswald font-semibold mb-3">Настройки уведомлений</h3>
                <div className="space-y-3">
                  {[
                    { label: "Старт новых конкурсов", on: true },
                    { label: "Дедлайн подачи заявок (за 3 дня)", on: true },
                    { label: "Подтверждение заявки", on: true },
                    { label: "Новые дипломы от педагога", on: false },
                    { label: "Изменения в рейтинге", on: false },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-foreground">{s.label}</span>
                      <button className={`w-10 h-5 rounded-full transition-all relative ${s.on ? "bg-primary" : "bg-secondary border border-border"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${s.on ? "right-0.5" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
