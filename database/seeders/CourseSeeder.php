<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Clo;
use App\Models\WeeklyPlan;
use App\Models\GradingSystem;
use App\Models\RequirementPolicy;
use App\Models\Reference;
use App\Models\Rubric;
use App\Models\Syllabus;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $ipt2 = Course::create([
            'user_id' => 1,
            'department_id' => 1,
            'course_code' => 'IPT2',
            'course_title' => 'Web Development Framework (Laravel)',
            'course_description' => 'This course covers the Laravel PHP framework, including MVC architecture, routing, Eloquent ORM, authentication, RESTful APIs, testing, and deployment.',
            'prerequisite' => 'IPT1 - Fundamentals of Web Development',
            'credit_units' => 3,
            'semester' => '2nd Semester',
            'academic_year' => '2025-2026',
            'total_hours' => 54,
            'lecture_hours' => 36,
            'lab_hours' => 18,
            'status' => 'Approved',
        ]);

        // CLOs
        $clos = [
            ['code' => 'CLO1', 'description' => 'Design and develop a full-stack web application using Laravel following MVC architecture.', 'program_outcomes' => ['a', 'b', 'c']],
            ['code' => 'CLO2', 'description' => 'Implement authentication, authorization, and security features in a Laravel application.', 'program_outcomes' => ['b', 'd', 'e']],
            ['code' => 'CLO3', 'description' => 'Utilize Eloquent ORM for database operations and relationship management.', 'program_outcomes' => ['a', 'c']],
            ['code' => 'CLO4', 'description' => 'Create RESTful APIs and integrate with frontend applications.', 'program_outcomes' => ['a', 'b', 'c', 'e']],
            ['code' => 'CLO5', 'description' => 'Apply testing methodologies and deploy Laravel applications to production.', 'program_outcomes' => ['b', 'e', 'f']],
        ];
        foreach ($clos as $clo) {
            $clo['course_id'] = $ipt2->id;
            Clo::create($clo);
        }

        // Weekly Plans
        $weeks = [
            ['week_number' => 1, 'title' => 'Course Orientation & PHP Fundamentals Review', 'learning_outcomes' => ['Recall PHP syntax and OOP principles', 'Set up the development environment'], 'topics' => ['Course policies and requirements', 'PHP OOP recap', 'Composer and dependency management', 'Development environment setup'], 'teaching_learning_activities' => ['Icebreaker and course overview', 'Live coding: PHP OOP demo', 'Environment setup workshop'], 'assessment_methods' => ['Pre-assessment quiz', 'Environment setup validation'], 'related_clo' => ['CLO1']],
            ['week_number' => 2, 'title' => 'Laravel Installation & MVC Architecture', 'learning_outcomes' => ['Install Laravel via Composer', 'Explain MVC architecture'], 'topics' => ['Installing Laravel', 'Directory structure overview', 'MVC pattern in Laravel', 'Artisan CLI basics'], 'teaching_learning_activities' => ['Guided installation', 'MVC diagram walkthrough', 'Mini project: First Laravel app'], 'assessment_methods' => ['Lab exercise: Install Laravel', 'Reflection journal'], 'related_clo' => ['CLO1']],
            ['week_number' => 3, 'title' => 'Routing, Controllers & Views (Blade)', 'learning_outcomes' => ['Create routes and controllers', 'Build views using Blade templating'], 'topics' => ['Routing basics and named routes', 'Controllers (Resource & Single Action)', 'Blade templating engine', 'Layouts and components'], 'teaching_learning_activities' => ['Routing lab', 'Blade component workshop', 'Pair programming: Simple CRUD'], 'assessment_methods' => ['Routing quiz', 'Blade template exercise'], 'related_clo' => ['CLO1']],
            ['week_number' => 4, 'title' => 'Database & Eloquent ORM', 'learning_outcomes' => ['Design database schemas using migrations', 'Perform CRUD with Eloquent ORM'], 'topics' => ['Migrations and seeders', 'Eloquent models', 'Relationships', 'Query builder vs Eloquent'], 'teaching_learning_activities' => ['Database design workshop', 'Eloquent relationship mapping', 'CRUD coding challenge'], 'assessment_methods' => ['Migration lab', 'Relationship diagram submission'], 'related_clo' => ['CLO3']],
            ['week_number' => 5, 'title' => 'Forms, Validation & File Uploads', 'learning_outcomes' => ['Build forms with CSRF protection', 'Implement validation rules and file uploads'], 'topics' => ['Form requests', 'Validation rules', 'File uploads and storage', 'Old input and error handling'], 'teaching_learning_activities' => ['Form building workshop', 'Validation rule exploration', 'File upload demo'], 'assessment_methods' => ['Form validation exercise', 'File upload lab'], 'related_clo' => ['CLO1', 'CLO2']],
            ['week_number' => 6, 'title' => 'Authentication & Middleware', 'learning_outcomes' => ['Implement user authentication', 'Create and apply middleware'], 'topics' => ['Laravel Breeze / UI scaffolding', 'Auth routes and guards', 'Middleware creation', 'Role-based access basics'], 'teaching_learning_activities' => ['Auth system walkthrough', 'Middleware lab', 'Security scenario discussion'], 'assessment_methods' => ['Auth implementation lab', 'Middleware exercise'], 'related_clo' => ['CLO2']],
            ['week_number' => 7, 'title' => 'Midterm Examination', 'learning_outcomes' => ['Demonstrate knowledge of Laravel fundamentals'], 'topics' => ['Written examination covering Weeks 1-6'], 'teaching_learning_activities' => ['Exam administration'], 'assessment_methods' => ['Midterm exam (50%)'], 'related_clo' => ['CLO1', 'CLO2', 'CLO3']],
            ['week_number' => 8, 'title' => 'RESTful APIs & API Resources', 'learning_outcomes' => ['Design RESTful API endpoints', 'Use API Resources for data transformation'], 'topics' => ['REST principles', 'API routes and controllers', 'API Resources', 'Eloquent API Resources'], 'teaching_learning_activities' => ['API design workshop', 'Postman testing lab', 'Frontend integration demo'], 'assessment_methods' => ['API design document', 'Working API endpoints'], 'related_clo' => ['CLO4']],
            ['week_number' => 9, 'title' => 'Testing with PHPUnit', 'learning_outcomes' => ['Write unit and feature tests', 'Interpret test coverage reports'], 'topics' => ['PHPUnit setup', 'Unit tests for models', 'Feature tests for controllers', 'Factories and fake data', 'Coverage reports'], 'teaching_learning_activities' => ['TDD workshop', 'Testing challenge', 'Coverage analysis'], 'assessment_methods' => ['Test suite submission (>80% coverage)'], 'related_clo' => ['CLO5']],
            ['week_number' => 10, 'title' => 'Deployment & DevOps Basics', 'learning_outcomes' => ['Deploy Laravel to shared hosting and cloud', 'Configure environment variables'], 'topics' => ['Server setup (Apache/Nginx)', 'Shared hosting deployment', 'Heroku/AWS basics', 'Queue workers and cron', 'Monitoring and logging'], 'teaching_learning_activities' => ['Heroku deployment walkthrough', 'Environment config lab', 'Cron job workshop'], 'assessment_methods' => ['Live deployment URL', 'Environment configuration doc'], 'related_clo' => ['CLO5']],
            ['week_number' => 11, 'title' => 'Performance & Security Best Practices', 'learning_outcomes' => ['Implement caching and query optimization', 'Harden application security'], 'topics' => ['Caching (Redis, Memcached)', 'N+1 query optimization', 'XSS, CSRF, SQL injection protection', 'Asset optimization', 'Load testing'], 'teaching_learning_activities' => ['Security audit exercise', 'Caching demo', 'Performance profiling'], 'assessment_methods' => ['Security audit report'], 'related_clo' => ['CLO2', 'CLO5']],
            ['week_number' => 12, 'title' => 'Project Development Sprint 1', 'learning_outcomes' => ['Collaborate using Git branching', 'Implement assigned features'], 'topics' => ['Agile methodology review', 'Git branching strategy', 'Code reviews', 'Daily stand-ups', 'Project board tracking'], 'teaching_learning_activities' => ['Scrum simulation', 'Pair programming', 'Code review workshop'], 'assessment_methods' => ['Sprint 1 deliverables', 'Git commit history', 'Project board update'], 'related_clo' => ['CLO1', 'CLO4', 'CLO5']],
            ['week_number' => 13, 'title' => 'Project Development Sprint 2', 'learning_outcomes' => ['Integrate all modules', 'Write documentation'], 'topics' => ['Integration testing', 'Bug fixing and refactoring', 'User and technical documentation', 'Staging deployment'], 'teaching_learning_activities' => ['Integration testing workshop', 'Documentation lab', 'Staging deployment walkthrough'], 'assessment_methods' => ['Fully integrated project', 'Documentation draft', 'Staging deployment'], 'related_clo' => ['CLO1', 'CLO2', 'CLO3', 'CLO4', 'CLO5']],
            ['week_number' => 14, 'title' => 'Project Presentation & Demo Day', 'learning_outcomes' => ['Present project professionally', 'Demonstrate live features'], 'topics' => ['Final presentation', 'Live demonstration', 'Q&A session', 'Peer evaluation'], 'teaching_learning_activities' => ['Presentation rehearsal', 'Demo day', 'Peer evaluation'], 'assessment_methods' => ['Final presentation (20 min)', 'Live demo', 'GitHub repository'], 'related_clo' => ['CLO1', 'CLO2', 'CLO3', 'CLO4', 'CLO5']],
            ['week_number' => 15, 'title' => 'Course Review & Emerging Trends', 'learning_outcomes' => ['Discuss Laravel ecosystem trends', 'Explore career paths'], 'topics' => ['Livewire, Inertia.js, Nova', 'Microservices with Laravel', 'Career paths and certifications', 'Open-source contribution', 'Portfolio building'], 'teaching_learning_activities' => ['Guest speaker session', 'Open-source PR tutorial', 'Portfolio workshop', 'Reflection essay'], 'assessment_methods' => ['Reflection essay', 'Portfolio optimization'], 'related_clo' => ['CLO5']],
            ['week_number' => 16, 'title' => 'Final Examination', 'learning_outcomes' => ['Demonstrate comprehensive Laravel knowledge'], 'topics' => ['Comprehensive written examination'], 'teaching_learning_activities' => ['Exam administration'], 'assessment_methods' => ['Final exam (50%)'], 'related_clo' => ['CLO1', 'CLO2', 'CLO3', 'CLO4', 'CLO5']],
            ['week_number' => 17, 'title' => 'Course Wrap-up & Grade Finalization', 'learning_outcomes' => ['Review overall performance', 'Receive feedback'], 'topics' => ['Grade consultation', 'Feedback session', 'Course evaluation'], 'teaching_learning_activities' => ['Individual consultations', 'Course wrap-up'], 'assessment_methods' => ['Final grade computation'], 'related_clo' => []],
        ];
        foreach ($weeks as $week) {
            $week['course_id'] = $ipt2->id;
            WeeklyPlan::create($week);
        }

        // Grading System
        $midterm = [
            ['term' => 'midterm', 'component_name' => 'Midterm Examination', 'percentage' => 50],
            ['term' => 'midterm', 'component_name' => 'Attendance / Class Participation', 'percentage' => 10],
            ['term' => 'midterm', 'component_name' => 'Quizzes', 'percentage' => 15],
            ['term' => 'midterm', 'component_name' => 'Laboratory Exercises', 'percentage' => 15],
            ['term' => 'midterm', 'component_name' => 'Assignment / Problem Sets', 'percentage' => 10],
        ];
        foreach ($midterm as $g) {
            $g['course_id'] = $ipt2->id;
            GradingSystem::create($g);
        }

        $final = [
            ['term' => 'final', 'component_name' => 'Final Term Examination', 'percentage' => 50],
            ['term' => 'final', 'component_name' => 'Attendance / Class Participation', 'percentage' => 10],
            ['term' => 'final', 'component_name' => 'Quizzes', 'percentage' => 15],
            ['term' => 'final', 'component_name' => 'Laboratory Exercises', 'percentage' => 15],
            ['term' => 'final', 'component_name' => 'Assignment / Problem Sets', 'percentage' => 10],
        ];
        foreach ($final as $g) {
            $g['course_id'] = $ipt2->id;
            GradingSystem::create($g);
        }

        // Requirement & Policies
        RequirementPolicy::create([
            'course_id' => $ipt2->id,
            'requirements' => "Complete all weekly lab exercises and assignments.\nDevelop and submit a fully functional Laravel project.\nPass midterm and final exams.\nParticipate in class discussions, peer reviews, and project presentations.\nMaintain a GitHub repository with all code and commits.",
            'policies' => "Attendance: Follows university policy. Absence beyond 20% may result in failure.\nDeadlines: Late submissions incur a deduction unless prior approval is given.\nAcademic Integrity: Plagiarism or cheating results in disciplinary action.\nDevices: Laptops allowed for coding; phones on silent.",
        ]);

        // References
        $refs = [
            ['reference_type' => 'textbook', 'reference_title' => 'Laravel: Up & Running', 'reference_author' => 'Matt Stauffer', 'reference_year' => '2021', 'reference_link' => null],
            ['reference_type' => 'textbook', 'reference_title' => 'Laravel Documentation (Official)', 'reference_author' => 'Taylor Otwell', 'reference_year' => '2020', 'reference_link' => null],
            ['reference_type' => 'textbook', 'reference_title' => 'PHP Web Development with Laravel', 'reference_author' => 'J. Richards', 'reference_year' => '2019', 'reference_link' => null],
            ['reference_type' => 'online', 'reference_title' => 'Laravel Official Documentation', 'reference_author' => null, 'reference_year' => null, 'reference_link' => 'https://laravel.com/docs'],
            ['reference_type' => 'online', 'reference_title' => 'Laracasts', 'reference_author' => null, 'reference_year' => null, 'reference_link' => 'https://laracasts.com/'],
            ['reference_type' => 'online', 'reference_title' => 'PHP The Right Way', 'reference_author' => null, 'reference_year' => null, 'reference_link' => 'https://phptherightway.com/'],
            ['reference_type' => 'online', 'reference_title' => 'GitHub Laravel Community', 'reference_author' => null, 'reference_year' => null, 'reference_link' => 'https://github.com/laravel'],
        ];
        foreach ($refs as $ref) {
            $ref['course_id'] = $ipt2->id;
            Reference::create($ref);
        }

        // Rubrics
        $rubrics = [
            ['name' => 'Functionality', 'excellent' => 'All features work flawlessly; error-free.', 'good' => 'Most features work; minor bugs.', 'fair' => 'Basic functionality with several issues.', 'poor' => 'Incomplete or non-functional.'],
            ['name' => 'Code Quality', 'excellent' => 'Clean, well-documented, follows Laravel conventions, uses Git effectively.', 'good' => 'Readable, some documentation, minor issues.', 'fair' => 'Messy code, poor structure, lacking docs.', 'poor' => 'Unstructured, no documentation.'],
            ['name' => 'UI/UX', 'excellent' => 'Professional, responsive, intuitive design.', 'good' => 'Functional but basic design.', 'fair' => 'Poor layout, not responsive.', 'poor' => 'Incomplete or unusable interface.'],
            ['name' => 'Security', 'excellent' => 'Implements authentication, validation, SQL injection protection, etc.', 'good' => 'Basic security measures in place.', 'fair' => 'Security flaws present.', 'poor' => 'No security consideration.'],
            ['name' => 'Presentation', 'excellent' => 'Clear, engaging, well-prepared demo and documentation.', 'good' => 'Adequate presentation with minor gaps.', 'fair' => 'Unclear presentation, lacking preparation.', 'poor' => 'Poor or no presentation.'],
        ];
        foreach ($rubrics as $r) {
            $r['course_id'] = $ipt2->id;
            Rubric::create($r);
        }

        // Syllabus
        Syllabus::create([
            'course_id' => $ipt2->id,
            'status' => 'Published',
            'version' => 3,
            'submitted_at' => now()->subDays(30),
            'notes' => 'Ready for class use.',
        ]);

        // Other demo courses
        Course::create([
            'user_id' => 5,
            'department_id' => 2,
            'course_code' => 'CS101',
            'course_title' => 'Introduction to Programming',
            'course_description' => 'Fundamentals of programming using Python.',
            'prerequisite' => 'None',
            'credit_units' => 3,
            'semester' => '1st Semester',
            'academic_year' => '2025-2026',
            'status' => 'Approved',
        ]);

        Course::create([
            'user_id' => 1,
            'department_id' => 1,
            'course_code' => 'IPT1',
            'course_title' => 'Fundamentals of Web Development',
            'course_description' => 'HTML, CSS, JavaScript basics.',
            'prerequisite' => 'CS101',
            'credit_units' => 3,
            'semester' => '1st Semester',
            'academic_year' => '2025-2026',
            'status' => 'Archived',
        ]);

        Course::create([
            'user_id' => 8,
            'department_id' => 2,
            'course_code' => 'CS202',
            'course_title' => 'Database Management Systems',
            'course_description' => 'Relational database design, normalization, SQL.',
            'prerequisite' => 'CS101',
            'credit_units' => 3,
            'semester' => '2nd Semester',
            'academic_year' => '2025-2026',
            'status' => 'Pending Review',
        ]);

        Course::create([
            'user_id' => 1,
            'department_id' => 1,
            'course_code' => 'IPT3',
            'course_title' => 'Advanced Web Technologies',
            'course_description' => 'React, Vue.js, Node.js, and modern full-stack development.',
            'prerequisite' => 'IPT2',
            'credit_units' => 3,
            'semester' => '1st Semester',
            'academic_year' => '2026-2027',
            'status' => 'Draft',
        ]);
    }
}
