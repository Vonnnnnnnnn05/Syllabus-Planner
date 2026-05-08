import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  User,
  Bot,
  Lightbulb,
  BookOpen,
  Target,
  FileText,
  Scale,
  Loader2,
  Copy,
  Check,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  suggestions?: string[]
}

const quickPrompts = [
  { label: 'Generate CLOs', icon: Target, prompt: 'Generate 5 course learning outcomes for a Laravel web development course' },
  { label: 'Weekly Topics', icon: BookOpen, prompt: 'Suggest weekly topics for a 16-week Laravel course' },
  { label: 'Assessment Ideas', icon: FileText, prompt: 'Suggest assessment methods for a Laravel web development course' },
  { label: 'Grading Rubric', icon: Scale, prompt: 'Create a grading rubric for a Laravel project' },
]

function generateResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase()
  if (msg.includes('clo') || msg.includes('learning outcome') || msg.includes('outcomes')) {
    return `Based on the IPT2 syllabus, here are the recommended CLOs:\n\n1. **CLO1**: Design and develop a full-stack web application using Laravel following MVC architecture.\n2. **CLO2**: Implement authentication, authorization, and security features.\n3. **CLO3**: Utilize Eloquent ORM for database operations.\n4. **CLO4**: Create RESTful APIs and integrate with frontend.\n5. **CLO5**: Apply testing methodologies and deploy to production.\n\nWould you like me to suggest program outcome mappings for these CLOs?`
  }
  if (msg.includes('topic') || msg.includes('weekly') || msg.includes('lesson')) {
    return `Here are suggested weekly topics for a 16-week Laravel course:\n\n**Week 1-2**: Course Orientation & Laravel Installation\n**Week 3-4**: Routing, Controllers & Views (Blade)\n**Week 5-6**: Database & Eloquent ORM\n**Week 7**: Authentication & Middleware\n**Week 8**: Midterm Examination\n**Week 9-10**: RESTful APIs & API Resources\n**Week 11**: Testing with PHPUnit\n**Week 12-13**: Deployment & DevOps\n**Week 14-15**: Performance & Security\n**Week 16**: Project Presentation\n\nShall I elaborate on any specific week?`
  }
  if (msg.includes('assessment') || msg.includes('quiz') || msg.includes('exam')) {
    return `Recommended assessment methods for IPT2:\n\n• **Written Exams** (50%): Midterm and Final examinations covering theory and code analysis.\n• **Laboratory Exercises** (15%): Weekly coding assignments with progressive difficulty.\n• **Quizzes** (15%): Short assessments on framework syntax and concepts.\n• **Problem Sets** (10%): Take-home assignments on database design and API creation.\n• **Class Participation** (10%): Active engagement in code reviews and discussions.\n\nWould you like a detailed rubric for the laboratory exercises?`
  }
  if (msg.includes('rubric') || msg.includes('grading')) {
    return `Here's a comprehensive project rubric:\n\n| Criteria | Excellent (4) | Good (3) | Fair (2) | Poor (1) |\n|----------|---------------|----------|----------|----------|\n| **Functionality** | All features work flawlessly | Most features work; minor bugs | Basic functionality with issues | Incomplete or non-functional |\n| **Code Quality** | Clean, documented, follows conventions | Readable, some documentation | Messy code, poor structure | Unstructured, no docs |\n| **UI/UX** | Professional, responsive, intuitive | Functional but basic | Poor layout, not responsive | Incomplete or unusable |\n| **Security** | Auth, validation, SQL injection protected | Basic security in place | Security flaws present | No security consideration |\n| **Presentation** | Clear, engaging, well-prepared | Adequate with minor gaps | Unclear, lacking preparation | Poor or no presentation |\n\nEach criterion is weighted equally at 20%.`
  }
  if (msg.includes('reference') || msg.includes('book') || msg.includes('resource')) {
    return `Recommended references for IPT2:\n\n**Textbooks:**\n• Stauffer, M. (2021). *Laravel: Up & Running*. O'Reilly Media.\n• Otwell, T. (2020). *Laravel Documentation* (Official).\n• Richards, J. (2019). *PHP Web Development with Laravel*.\n\n**Online Resources:**\n• [Laravel Official Docs](https://laravel.com/docs)\n• [Laracasts](https://laracasts.com/)\n• [PHP The Right Way](https://phptherightway.com/)\n• [GitHub Laravel Community](https://github.com/laravel)`
  }
  return `I'm your AI Academic Companion. I can help you with:\n\n• Generating Course Learning Outcomes (CLOs)\n• Suggesting weekly lesson topics\n• Creating assessment methods and rubrics\n• Recommending academic references\n• Improving syllabus structure and wording\n\nTry asking me about any of these topics, or use the quick prompts below!`
}

export default function AICompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI Academic Companion. I can help you craft learning outcomes, suggest weekly topics, design assessments, and improve your syllabus.\n\nTry one of the quick prompts below or ask me anything about your syllabus!`,
      suggestions: ['Generate CLOs', 'Suggest weekly topics', 'Create a grading rubric', 'Recommend references'],
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return
    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const response = generateResponse(text)
      const assistantMsg: Message = {
        id: `a${Date.now()}`,
        role: 'assistant',
        content: response,
        suggestions: ['Tell me more', 'Apply to my syllabus', 'Generate alternatives'],
      }
      setMessages((prev) => [...prev, assistantMsg])
      setLoading(false)
    }, 1200)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">AI Academic Companion</h1>
        <p className="page-subtitle">
          Get intelligent suggestions for learning outcomes, topics, assessments, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-3">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-academic-accent" />
              <h3 className="text-sm font-semibold text-academic-primary">Quick Prompts</h3>
            </div>
            <div className="space-y-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => handleSend(prompt.prompt)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm text-academic-text hover:bg-academic-bg transition-colors border border-transparent hover:border-academic-border"
                >
                  <prompt.icon className="w-4 h-4 text-academic-accent shrink-0" />
                  <span>{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-semibold text-academic-primary mb-2">About</h3>
            <p className="text-xs text-academic-text-muted leading-relaxed">
              The AI Companion analyzes your syllabus content to generate academic suggestions.
              Responses are based on best practices in curriculum design.
            </p>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-3 card flex flex-col p-0 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-academic-primary text-white'
                      : 'bg-academic-accent/10 text-academic-accent'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block text-left text-sm leading-relaxed whitespace-pre-wrap rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-academic-primary text-white'
                        : 'bg-academic-bg text-academic-text border border-academic-border'
                    }`}
                  >
                    {msg.content.split('**').map((part, i) =>
                      i % 2 === 1 ? (
                        <span key={i} className="font-semibold text-academic-primary">
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="flex items-center gap-1 text-[10px] text-academic-text-muted hover:text-academic-primary transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedId === msg.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSend(suggestion)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-academic-border text-academic-text-muted hover:border-academic-accent hover:text-academic-accent transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-academic-accent/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-academic-accent animate-pulse" />
                </div>
                <div className="bg-academic-bg border border-academic-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-academic-text-muted">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-academic-border bg-white">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about CLOs, weekly topics, assessments, rubrics..."
                className="input-field flex-1"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="btn-primary px-4 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
