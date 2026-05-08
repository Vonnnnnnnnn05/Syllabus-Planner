export interface WeeklyPlan {
  week: number
  title: string
  learningOutcomes: string[]
  topics: string[]
  teachingActivities: string[]
  assessmentMethods: string[]
  relatedCLO: string[]
}

export interface CLO {
  id: string
  code: string
  description: string
  programOutcomes: string[]
}

export interface GradingComponent {
  name: string
  percentage: number
}

export interface RubricCriteria {
  name: string
  excellent: string
  good: string
  fair: string
  poor: string
}

export interface Reference {
  type: 'textbook' | 'online'
  title: string
  author?: string
  year?: string
  link?: string
}

export interface SyllabusData {
  courseCode: string
  courseTitle: string
  creditUnits: number
  semester: string
  academicYear: string
  prerequisites: string
  department: string
  program: string
  description: string
  totalHours: number
  lectureHours: number
  labHours: number
  faculty: string
  programChair: string
  dean: string
  courseObjectives: string[]
  clos: CLO[]
  weeklyPlans: WeeklyPlan[]
  midtermGrading: GradingComponent[]
  finalGrading: GradingComponent[]
  rubrics: RubricCriteria[]
  references: Reference[]
  requirements: string[]
  policies: string[]
}

export const ipt2Syllabus: SyllabusData = {
  courseCode: 'IPT2',
  courseTitle: 'Web Development Framework (Laravel)',
  creditUnits: 3,
  semester: '2nd Semester',
  academicYear: '2025-2026',
  prerequisites: 'IPT1 - Fundamentals of Web Development',
  department: 'Information Technology',
  program: 'Bachelor of Science in Information Technology (BSIT)',
  description:
    'This course covers the Laravel PHP framework, including MVC architecture, routing, Eloquent ORM, authentication, RESTful APIs, testing, and deployment. Students will develop a full-stack web application using industry-standard practices.',
  totalHours: 54,
  lectureHours: 36,
  labHours: 18,
  faculty: 'Mark Jovic A. Daday, DIT',
  programChair: 'Rubin B. Cerilo',
  dean: 'Elbren O. Antonio, DIT',
  courseObjectives: [
    'Understand Laravel framework architecture and MVC pattern',
    'Develop full-stack web applications using Laravel',
    'Implement authentication, authorization, and security features',
    'Utilize Eloquent ORM for database operations',
    'Create and consume RESTful APIs',
    'Apply testing practices using PHPUnit',
    'Deploy Laravel applications to production environments',
  ],
  clos: [
    {
      id: 'clo1',
      code: 'CLO1',
      description: 'Design and develop a full-stack web application using Laravel following MVC architecture.',
      programOutcomes: ['a', 'b', 'c'],
    },
    {
      id: 'clo2',
      code: 'CLO2',
      description: 'Implement authentication, authorization, and security features in a Laravel application.',
      programOutcomes: ['b', 'd', 'e'],
    },
    {
      id: 'clo3',
      code: 'CLO3',
      description: 'Utilize Eloquent ORM for database operations and relationship management.',
      programOutcomes: ['a', 'c'],
    },
    {
      id: 'clo4',
      code: 'CLO4',
      description: 'Create RESTful APIs and integrate with frontend applications.',
      programOutcomes: ['a', 'b', 'c', 'e'],
    },
    {
      id: 'clo5',
      code: 'CLO5',
      description: 'Apply testing methodologies and deploy Laravel applications to production.',
      programOutcomes: ['b', 'e', 'f'],
    },
  ],
  weeklyPlans: [
    {
      week: 1,
      title: 'Course Orientation & PHP Fundamentals Review',
      learningOutcomes: ['Recall PHP syntax and OOP principles', 'Set up the development environment'],
      topics: ['Course policies and requirements', 'PHP OOP recap', 'Composer and dependency management', 'Development environment setup (XAMPP/Laragon)'],
      teachingActivities: ['Icebreaker and course overview', 'Live coding: PHP OOP demo', 'Environment setup workshop'],
      assessmentMethods: ['Pre-assessment quiz', 'Environment setup validation'],
      relatedCLO: ['CLO1'],
    },
    {
      week: 2,
      title: 'Laravel Installation & MVC Architecture',
      learningOutcomes: ['Install Laravel via Composer', 'Explain MVC architecture and its application in Laravel'],
      topics: ['Installing Laravel', 'Directory structure overview', 'MVC pattern in Laravel', 'Artisan CLI basics'],
      teachingActivities: ['Guided installation', 'MVC diagram walkthrough', 'Mini project: First Laravel app'],
      assessmentMethods: ['Lab exercise: Install Laravel', 'Reflection journal'],
      relatedCLO: ['CLO1'],
    },
    {
      week: 3,
      title: 'Routing, Controllers & Views (Blade)',
      learningOutcomes: ['Create routes and controllers', 'Build views using Blade templating'],
      topics: ['Routing basics and named routes', 'Controllers (Resource & Single Action)', 'Blade templating engine', 'Layouts and components'],
      teachingActivities: ['Routing lab', 'Blade component workshop', 'Pair programming: Simple CRUD'],
      assessmentMethods: ['Routing quiz', 'Blade template exercise'],
      relatedCLO: ['CLO1'],
    },
    {
      week: 4,
      title: 'Database & Eloquent ORM',
      learningOutcomes: ['Design database schemas using migrations', 'Perform CRUD with Eloquent ORM'],
      topics: ['Migrations and seeders', 'Eloquent models', 'Relationships (One-to-One, One-to-Many, Many-to-Many)', 'Query builder vs Eloquent'],
      teachingActivities: ['Database design workshop', 'Eloquent relationship mapping', 'CRUD coding challenge'],
      assessmentMethods: ['Migration lab', 'Relationship diagram submission'],
      relatedCLO: ['CLO3'],
    },
    {
      week: 5,
      title: 'Forms, Validation & File Uploads',
      learningOutcomes: ['Build forms with CSRF protection', 'Implement validation rules and file uploads'],
      topics: ['Form requests', 'Validation rules', 'File uploads and storage', 'Old input and error handling'],
      teachingActivities: ['Form building workshop', 'Validation rule exploration', 'File upload demo'],
      assessmentMethods: ['Form validation exercise', 'File upload lab'],
      relatedCLO: ['CLO1', 'CLO2'],
    },
    {
      week: 6,
      title: 'Authentication & Middleware',
      learningOutcomes: ['Implement user authentication', 'Create and apply middleware'],
      topics: ['Laravel Breeze / UI scaffolding', 'Auth routes and guards', 'Middleware creation', 'Role-based access basics'],
      teachingActivities: ['Auth system walkthrough', 'Middleware lab', 'Security scenario discussion'],
      assessmentMethods: ['Auth implementation lab', 'Middleware exercise'],
      relatedCLO: ['CLO2'],
    },
    {
      week: 7,
      title: 'Midterm Examination',
      learningOutcomes: ['Demonstrate knowledge of Laravel fundamentals'],
      topics: ['Written examination covering Weeks 1-6'],
      teachingActivities: ['Exam administration'],
      assessmentMethods: ['Midterm exam (50%)'],
      relatedCLO: ['CLO1', 'CLO2', 'CLO3'],
    },
    {
      week: 8,
      title: 'RESTful APIs & API Resources',
      learningOutcomes: ['Design RESTful API endpoints', 'Use API Resources for data transformation'],
      topics: ['REST principles', 'API routes and controllers', 'API Resources', 'Eloquent API Resources'],
      teachingActivities: ['API design workshop', 'Postman testing lab', 'Frontend integration demo'],
      assessmentMethods: ['API design document', 'Working API endpoints'],
      relatedCLO: ['CLO4'],
    },
    {
      week: 9,
      title: 'Testing with PHPUnit',
      learningOutcomes: ['Write unit and feature tests', 'Interpret test coverage reports'],
      topics: ['PHPUnit setup', 'Unit tests for models', 'Feature tests for controllers', 'Factories and fake data', 'Coverage reports'],
      teachingActivities: ['TDD workshop', 'Testing challenge', 'Coverage analysis'],
      assessmentMethods: ['Test suite submission (>80% coverage)'],
      relatedCLO: ['CLO5'],
    },
    {
      week: 10,
      title: 'Deployment & DevOps Basics',
      learningOutcomes: ['Deploy Laravel to shared hosting and cloud', 'Configure environment variables'],
      topics: ['Server setup (Apache/Nginx)', 'Shared hosting deployment', 'Heroku/AWS basics', 'Queue workers and cron', 'Monitoring and logging'],
      teachingActivities: ['Heroku deployment walkthrough', 'Environment config lab', 'Cron job workshop'],
      assessmentMethods: ['Live deployment URL', 'Environment configuration doc'],
      relatedCLO: ['CLO5'],
    },
    {
      week: 11,
      title: 'Performance & Security Best Practices',
      learningOutcomes: ['Implement caching and query optimization', 'Harden application security'],
      topics: ['Caching (Redis, Memcached)', 'N+1 query optimization', 'XSS, CSRF, SQL injection protection', 'Asset optimization', 'Load testing'],
      teachingActivities: ['Security audit exercise', 'Caching demo', 'Performance profiling'],
      assessmentMethods: ['Security audit report'],
      relatedCLO: ['CLO2', 'CLO5'],
    },
    {
      week: 12,
      title: 'Project Development Sprint 1',
      learningOutcomes: ['Collaborate using Git branching', 'Implement assigned features'],
      topics: ['Agile methodology review', 'Git branching strategy', 'Code reviews', 'Daily stand-ups', 'Project board tracking'],
      teachingActivities: ['Scrum simulation', 'Pair programming', 'Code review workshop'],
      assessmentMethods: ['Sprint 1 deliverables', 'Git commit history', 'Project board update'],
      relatedCLO: ['CLO1', 'CLO4', 'CLO5'],
    },
    {
      week: 13,
      title: 'Project Development Sprint 2',
      learningOutcomes: ['Integrate all modules', 'Write documentation'],
      topics: ['Integration testing', 'Bug fixing and refactoring', 'User and technical documentation', 'Staging deployment'],
      teachingActivities: ['Integration testing workshop', 'Documentation lab', 'Staging deployment walkthrough'],
      assessmentMethods: ['Fully integrated project', 'Documentation draft', 'Staging deployment'],
      relatedCLO: ['CLO1', 'CLO2', 'CLO3', 'CLO4', 'CLO5'],
    },
    {
      week: 14,
      title: 'Project Presentation & Demo Day',
      learningOutcomes: ['Present project professionally', 'Demonstrate live features'],
      topics: ['Final presentation', 'Live demonstration', 'Q&A session', 'Peer evaluation'],
      teachingActivities: ['Presentation rehearsal', 'Demo day', 'Peer evaluation'],
      assessmentMethods: ['Final presentation (20 min)', 'Live demo', 'GitHub repository'],
      relatedCLO: ['CLO1', 'CLO2', 'CLO3', 'CLO4', 'CLO5'],
    },
    {
      week: 15,
      title: 'Course Review & Emerging Trends',
      learningOutcomes: ['Discuss Laravel ecosystem trends', 'Explore career paths'],
      topics: ['Livewire, Inertia.js, Nova', 'Microservices with Laravel', 'Career paths and certifications', 'Open-source contribution', 'Portfolio building'],
      teachingActivities: ['Guest speaker session', 'Open-source PR tutorial', 'Portfolio workshop', 'Reflection essay'],
      assessmentMethods: ['Reflection essay', 'Portfolio optimization'],
      relatedCLO: ['CLO5'],
    },
    {
      week: 16,
      title: 'Final Examination',
      learningOutcomes: ['Demonstrate comprehensive Laravel knowledge'],
      topics: ['Comprehensive written examination'],
      teachingActivities: ['Exam administration'],
      assessmentMethods: ['Final exam (50%)'],
      relatedCLO: ['CLO1', 'CLO2', 'CLO3', 'CLO4', 'CLO5'],
    },
    {
      week: 17,
      title: 'Course Wrap-up & Grade Finalization',
      learningOutcomes: ['Review overall performance', 'Receive feedback'],
      topics: ['Grade consultation', 'Feedback session', 'Course evaluation'],
      teachingActivities: ['Individual consultations', 'Course wrap-up'],
      assessmentMethods: ['Final grade computation'],
      relatedCLO: [],
    },
  ],
  midtermGrading: [
    { name: 'Midterm Examination', percentage: 50 },
    { name: 'Attendance / Class Participation', percentage: 10 },
    { name: 'Quizzes', percentage: 15 },
    { name: 'Laboratory Exercises', percentage: 15 },
    { name: 'Assignment / Problem Sets', percentage: 10 },
  ],
  finalGrading: [
    { name: 'Final Term Examination', percentage: 50 },
    { name: 'Attendance / Class Participation', percentage: 10 },
    { name: 'Quizzes', percentage: 15 },
    { name: 'Laboratory Exercises', percentage: 15 },
    { name: 'Assignment / Problem Sets', percentage: 10 },
  ],
  rubrics: [
    {
      name: 'Functionality',
      excellent: 'All features work flawlessly; error-free.',
      good: 'Most features work; minor bugs.',
      fair: 'Basic functionality with several issues.',
      poor: 'Incomplete or non-functional.',
    },
    {
      name: 'Code Quality',
      excellent: 'Clean, well-documented, follows Laravel conventions, uses Git effectively.',
      good: 'Readable, some documentation, minor issues.',
      fair: 'Messy code, poor structure, lacking docs.',
      poor: 'Unstructured, no documentation.',
    },
    {
      name: 'UI/UX',
      excellent: 'Professional, responsive, intuitive design.',
      good: 'Functional but basic design.',
      fair: 'Poor layout, not responsive.',
      poor: 'Incomplete or unusable interface.',
    },
    {
      name: 'Security',
      excellent: 'Implements authentication, validation, SQL injection protection, etc.',
      good: 'Basic security measures in place.',
      fair: 'Security flaws present.',
      poor: 'No security consideration.',
    },
    {
      name: 'Presentation',
      excellent: 'Clear, engaging, well-prepared demo and documentation.',
      good: 'Adequate presentation with minor gaps.',
      fair: 'Unclear presentation, lacking preparation.',
      poor: 'Poor or no presentation.',
    },
  ],
  references: [
    { type: 'textbook', title: 'Laravel: Up & Running', author: 'Matt Stauffer', year: '2021' },
    { type: 'textbook', title: 'Laravel Documentation (Official)', author: 'Taylor Otwell', year: '2020' },
    { type: 'textbook', title: 'PHP Web Development with Laravel', author: 'J. Richards', year: '2019' },
    { type: 'online', title: 'Laravel Official Documentation', link: 'https://laravel.com/docs' },
    { type: 'online', title: 'Laracasts', link: 'https://laracasts.com/' },
    { type: 'online', title: 'PHP The Right Way', link: 'https://phptherightway.com/' },
    { type: 'online', title: 'GitHub Laravel Community', link: 'https://github.com/laravel' },
  ],
  requirements: [
    'Complete all weekly lab exercises and assignments.',
    'Develop and submit a fully functional Laravel project.',
    'Pass midterm and final exams.',
    'Participate in class discussions, peer reviews, and project presentations.',
    'Maintain a GitHub repository with all code and commits.',
  ],
  policies: [
    'Attendance: Follows university policy. Absence beyond 20% may result in failure.',
    'Deadlines: Late submissions incur a deduction unless prior approval is given.',
    'Academic Integrity: Plagiarism or cheating results in disciplinary action.',
    'Devices: Laptops allowed for coding; phones on silent.',
  ],
}
