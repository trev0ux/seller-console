interface NavigationTab {
  id: string
  label: string
  count?: number
}

interface HeaderProps {
  title: string
  subtitle: string
  navigationTabs: NavigationTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function Header({
  title,
  subtitle,
  navigationTabs,
  activeTab,
  onTabChange,
}: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex-col lg:flex-row gap-6 lg:gap-0 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>

        <div className="flex bg-white rounded-lg shadow-sm border p-1">
          {navigationTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export type { NavigationTab }
