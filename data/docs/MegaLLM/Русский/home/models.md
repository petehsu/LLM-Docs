# Каталог моделей

> Получите доступ к передовым AI моделям от ведущих провайдеров через единый унифицированный API. Все модели доступны по их ID в ваших API вызовах.

export const ModelsCatalog = ({apiKey = 'sk-mega-25f8b5b41a531921b24bf59daa8ccc0d38da68364662fb8956d972333b8d86b9', baseUrl = 'https://ai.megallm.io', useSampleOnError = true}) => {
  const resolvedEnvKey = typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_MEGA_API_KEY ? process.env.NEXT_PUBLIC_MEGA_API_KEY : typeof window !== 'undefined' && window.__MEGA_API_KEY__ || '';
  const API_KEY = apiKey || resolvedEnvKey;
  const API_ENDPOINT = `${baseUrl.replace(/\/$/, '')}/v1/models`;
  const tabs = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Other', 'Embedding'];
  const formatContextWindow = context => {
    if (!context) return 'N/A';
    if (context >= 1000000) return `${Math.round(context / 1000000)}M`;
    if (context >= 1000) return `${Math.round(context / 1000)}K`;
    return context.toString();
  };
  const formatMaxOutput = tokens => {
    if (!tokens) return 'N/A';
    if (tokens >= 1000) return `${Math.round(tokens / 1000)}K`;
    return tokens.toString();
  };
  const formatPriceValue = price => {
    if (price === undefined || price === null) return '—';
    return `$${Number(price).toFixed(2)}`;
  };
  const filterModelsByProvider = (models, provider) => {
    if (provider === 'Embedding') return models.filter(m => m.id.includes('embedding'));
    return models.filter(model => {
      const owner = model.owned_by.toLowerCase();
      if (model.id.includes('embedding')) return false;
      switch (provider) {
        case 'OpenAI':
          return owner.includes('openai') || owner.includes('azure');
        case 'Anthropic':
          return owner.includes('anthropic');
        case 'Google':
          return owner.includes('google');
        case 'Meta':
          return owner.includes('meta');
        case 'Other':
          return !owner.includes('openai') && !owner.includes('azure') && !owner.includes('anthropic') && !owner.includes('google') && !owner.includes('meta');
        default:
          return false;
      }
    });
  };
  const SAMPLE_MODELS = [{
    id: 'gpt-4o-mini',
    owned_by: 'openai',
    context_length: 128000,
    max_output_tokens: 4000,
    pricing: {
      input_tokens_cost_per_million: 0.15,
      output_tokens_cost_per_million: 0.60
    }
  }, {
    id: 'claude-3-5-sonnet',
    owned_by: 'anthropic',
    context_length: 200000,
    max_output_tokens: 8000,
    pricing: {
      input_tokens_cost_per_million: 3,
      output_tokens_cost_per_million: 15
    }
  }];
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    key: 'id',
    dir: 'asc'
  });
  const [currentTab, setCurrentTab] = useState('OpenAI');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = API_KEY ? {
        'Authorization': `Bearer ${API_KEY}`
      } : {};
      const response = await fetch(API_ENDPOINT, {
        headers
      });
      if (!response.ok) {
        const bodyText = await response.text().catch(() => '');
        const trimmed = bodyText.slice(0, 300);
        throw new Error(`HTTP ${response.status} ${response.statusText}${trimmed ? ` – ${trimmed}` : ''}`);
      }
      const data = await response.json();
      setModels(data.data || []);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch models';
      if (useSampleOnError && models.length === 0) {
        setModels(SAMPLE_MODELS);
      }
      setError(msg);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchModels();
  }, []);
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchModels, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);
  const filteredModels = filterModelsByProvider(models, currentTab);
  const handleSort = key => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };
  const sortIndicator = key => sort.key === key ? sort.dir === 'asc' ? '↑' : '↓' : '⋯';
  const copyId = async id => {
    try {
      await navigator.clipboard.writeText(id);
    } catch (_) {}
  };
  const postSearch = filteredModels.filter(m => !search.trim() || (m.id || '').toLowerCase().includes(search.toLowerCase()));
  const sortedModels = [...postSearch].sort((a, b) => {
    const mult = sort.dir === 'asc' ? 1 : -1;
    const get = m => {
      switch (sort.key) {
        case 'context':
          return m.context_length || 0;
        case 'output':
          return m.max_output_tokens || 0;
        case 'inputPrice':
          return m.pricing?.input_tokens_cost_per_million ?? Infinity;
        case 'outputPrice':
          return m.pricing?.output_tokens_cost_per_million ?? Infinity;
        default:
          return m.id || '';
      }
    };
    const av = get(a), bv = get(b);
    if (av < bv) return -1 * mult;
    if (av > bv) return 1 * mult;
    return 0;
  });
  const isEmbedding = currentTab === 'Embedding';
  if (loading && models.length === 0) {
    return <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading models from MegaLLM API...</p>
      </div>;
  }
  if (error && models.length === 0) {
    return <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200"><strong>Failed to load models:</strong> {error}</p>
        <button onClick={fetchModels} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Retry
        </button>
      </div>;
  }
  return <div>
      {}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Live Data - {models.length} models available
          </span>
          {lastUpdated && <span className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>}
          {!API_KEY && <span className="text-xs text-red-600 dark:text-red-400 font-medium">
              No API key detected (set NEXT_PUBLIC_MEGA_API_KEY or pass apiKey prop)
            </span>}
          {error && models.length > 0 && <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
              Live sample data (error: {error.split(' – ')[0]})
            </span>}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="rounded" />
            <span className="text-sm">Auto-refresh (30s)</span>
          </label>
          <button onClick={() => {
    setLoading(true);
    fetchModels();
  }} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Refresh Now
          </button>
        </div>
      </div>

      {}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm">
          <strong>Important</strong>: Always use the Model ID (not display name) when making API calls. For example, use <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">gpt-4o-mini</code> not "GPT-4o mini".
        </p>
        {!API_KEY && <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">
            Showing sample data because no API key was provided. Add <code className="font-mono">NEXT_PUBLIC_MEGA_API_KEY</code> or pass <code className="font-mono">apiKey</code> to fetch live data.
          </p>}
      </div>

      {}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-wrap -mb-px">
          {tabs.map(tab => <button key={tab} onClick={() => setCurrentTab(tab)} className={`mr-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === currentTab ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'}`}>
              {tab}
            </button>)}
        </div>
      </div>

      {}
      <h3 className="text-xl font-semibold mb-4 mt-4">
        {currentTab === 'OpenAI' && 'OpenAI Models'}
        {currentTab === 'Anthropic' && 'Anthropic Claude Models'}
        {currentTab === 'Google' && 'Google Gemini Models'}
        {currentTab === 'Meta' && 'Meta Llama Models'}
        {currentTab === 'Other' && 'Other Models (Mistral, Alibaba, etc.)'}
        {currentTab === 'Embedding' && 'Embedding Models'}
      </h3>

      {}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search model id..." className="w-48 sm:w-64 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{sortedModels.length} shown</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{currentTab}</span>
            {!isEmbedding && <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">Text / Chat</span>}
            {isEmbedding && <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">Embedding</span>}
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[480px] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <table className="min-w-full text-[11px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-100/90 backdrop-blur-sm dark:bg-gray-800/90 border-b border-gray-300 dark:border-gray-600">
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide w-[220px]">
                    <button onClick={() => handleSort('id')} className="flex items-center gap-1">
                      <span>Model ID</span><span className="text-[9px] opacity-60">{sortIndicator('id')}</span>
                    </button>
                  </th>
                  <th className="px-1 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide w-[70px]">
                    <button onClick={() => handleSort('context')} className="inline-flex items-center gap-1">Context<span className="text-[9px] opacity-60">{sortIndicator('context')}</span></button>
                  </th>
                  {!isEmbedding && <th className="px-1 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide w-[70px]">
                      <button onClick={() => handleSort('output')} className="inline-flex items-center gap-1">Out<span className="text-[9px] opacity-60">{sortIndicator('output')}</span></button>
                    </th>}
                  <th className="px-1 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide w-[75px]">
                    <button onClick={() => handleSort('inputPrice')} className="inline-flex items-center gap-1">In $/M<span className="text-[9px] opacity-60">{sortIndicator('inputPrice')}</span></button>
                  </th>
                  {!isEmbedding && <th className="px-1 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide w-[75px]">
                      <button onClick={() => handleSort('outputPrice')} className="inline-flex items-center gap-1">Out $/M<span className="text-[9px] opacity-60">{sortIndicator('outputPrice')}</span></button>
                    </th>}
                </tr>
              </thead>
              <tbody>
                {sortedModels.length === 0 && <tr>
                    <td colSpan={isEmbedding ? 3 : 5} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">No models match your search.</td>
                  </tr>}
                {sortedModels.map((model, idx) => {
    return <tr key={model.id || idx} className={`group border-b border-gray-100 dark:border-gray-700/60 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/40'} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}>
                      <td className="px-2 py-2 font-mono text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[140px]" title={model.id}>{model.id}</span>
                          <button onClick={() => model.id && copyId(model.id)} title="Copy model id" className="opacity-0 group-hover:opacity-100 transition-opacity px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">⧉</button>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center font-medium text-gray-800 dark:text-gray-100">{formatContextWindow(model.context_length)}</td>
                      {!isEmbedding && <td className="px-2 py-2 text-center font-medium text-gray-800 dark:text-gray-100">{formatMaxOutput(model.max_output_tokens)}</td>}
                      <td className="px-2 py-2 text-center font-semibold text-green-700 dark:text-green-400">{formatPriceValue(model.pricing?.input_tokens_cost_per_million)}</td>
                      {!isEmbedding && <td className="px-2 py-2 text-center font-semibold text-orange-700 dark:text-orange-400">{formatPriceValue(model.pricing?.output_tokens_cost_per_million)}</td>}
                    </tr>;
  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
};

## Актуальные данные о моделях

<Note>
  Каталог моделей динамически обновляется. Посетите наш [дашборд](https://megallm.io/dashboard/models) для получения актуальных цен и доступности в реальном времени.
</Note>

<ModelsCatalog />

## Руководство по выбору модели

### По сценарию использования

<CardGroup cols={2}>
  <Card title="Быстрые ответы" icon="bolt-lightning">
    gpt-5-mini, gpt-4o-mini, gemini-2.0-flash-001, gpt-3.5-turbo
  </Card>

  <Card title="Сложные рассуждения" icon="brain-circuit">
    gpt-5, claude-opus-4-1-20250805, gemini-2.5-pro
  </Card>

  <Card title="Экономичность" icon="coins">
    gpt-4o-mini, gemini-2.0-flash-001
  </Card>

  <Card title="Большой контекст" icon="file-contract">
    gpt-4.1 (1M+), gemini-2.5-pro (1M+)
  </Card>

  <Card title="Задачи со зрением" icon="images">
    gpt-5, gpt-4o, claude-sonnet-4, модели gemini
  </Card>

  <Card title="Генерация кода" icon="brackets-curly">
    gpt-5, claude-3.7-sonnet, gpt-4o
  </Card>
</CardGroup>

### По бюджету

<CardGroup cols={2}>
  <Card title="Эконом" icon="wallet">
    **Модели**: `gpt-4o-mini`, `gemini-2.0-flash-001`

    **Сценарии использования**: Прототипирование, простые задачи, тестирование

    **Стоимость**: Самый доступный вариант для больших объемов
  </Card>

  <Card title="Стандарт" icon="gauge-high">
    **Модели**: `gpt-5-mini`, `claude-3.5-sonnet`

    **Сценарии использования**: Производственные приложения, чат-боты, клиентский сервис

    **Стоимость**: Сбалансированная производительность и цена
  </Card>

  <Card title="Премиум" icon="crown">
    **Модели**: `gpt-5`, `claude-sonnet-4`

    **Сценарии использования**: Продвинутые рассуждения, сложный анализ, исследования

    **Стоимость**: Высокий уровень для требовательных приложений
  </Card>

  <Card title="Корпоративный" icon="building-columns">
    **Модели**: `claude-opus-4-1-20250805`, `gpt-4.1`

    **Сценарии использования**: Критически важные приложения, продвинутые исследования, максимальные возможности

    **Стоимость**: Премиальная цена за лучшую в классе производительность
  </Card>
</CardGroup>

## Использование моделей в коде

Всегда используйте ID модели при выполнении API вызовов:

<CodeGroup>
  ```python Python theme={null}
  from openai import OpenAI

  client = OpenAI(
      base_url="https://ai.megallm.io/v1",
      api_key="your-api-key"
  )

  # Используйте ID модели, а не отображаемое имя
  response = client.chat.completions.create(
      model="gpt-5",  # ID модели
      messages=[{"role": "user", "content": "Hello!"}]
  )

  # Переключитесь на Claude используя ID модели
  response = client.chat.completions.create(
      model="claude-opus-4-1-20250805",  # ID модели
      messages=[{"role": "user", "content": "Hello!"}]
  )

  # Попробуйте Gemini используя ID модели
  response = client.chat.completions.create(
      model="gemini-2.5-pro",  # ID модели
      messages=[{"role": "user", "content": "Hello!"}]
  )
  ```

  ```javascript JavaScript theme={null}
  // Всегда используйте ID моделей
  const models = ['gpt-5', 'claude-opus-4-1-20250805', 'gemini-2.5-pro'];

  for (const modelId of models) {
    const response = await fetch("https://ai.megallm.io/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelId,  // Используем ID модели
        messages: [{ role: "user", content: "Hello!" }]
      })
    });

    console.log(`${modelId} response:`, await response.json());
  }
  ```

  ```bash cURL theme={null}
  # Тестируйте несколько моделей используя их ID
  for model in "gpt-5" "claude-opus-4-1-20250805" "gemini-2.5-pro"; do
    echo "Testing $model..."
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"model\": \"$model\",
        \"messages\": [{\"role\": \"user\", \"content\": \"Hello!\"}]
      }"
  done
  ```
</CodeGroup>

## Автоматический резерв

Настройте автоматический резерв используя ID моделей:

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-5",
    messages=messages,
    fallback_models=["claude-opus-4-1-20250805", "gemini-2.5-pro"],
    fallback_on_rate_limit=True,
    fallback_on_error=True
)
```

## Калькулятор цен

Оцените ваши затраты на разные модели:

| Уровень использования | Токенов/месяц | gpt-5-mini | claude-3.5-sonnet | gemini-2.0-flash-001 |
| --------------------- | ------------- | ---------- | ----------------- | -------------------- |
| **Хобби**             | 1M            | \$2.25     | \$18              | \$0.75               |
| **Стартап**           | 10M           | \$22.50    | \$180             | \$7.50               |
| **Бизнес**            | 100M          | \$225      | \$1,800           | \$75                 |
| **Корпоративный**     | 1B+           | По запросу | По запросу        | По запросу           |

<Warning>
  **Важно**: ID моделей чувствительны к регистру. Всегда используйте точный ID модели, как показано в таблицах выше.
</Warning>

## Следующие шаги

* Прочитайте [FAQ](/ru/home/faq) для распространенных вопросов о выборе моделей
* Ознакомьтесь с [Справочником API](/ru/api-reference/introduction) для подробной документации по эндпоинтам
* Просмотрите [Документацию для разработчиков](/ru/dev-docs/overview) для руководств по интеграции


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt