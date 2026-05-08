# 🎓 AI-Powered Academic Syllabus Management System

## 📌 Project Overview

The **AI-Powered Academic Syllabus Management System** is a web-based academic planning and documentation platform designed to help educational institutions streamline the process of syllabus creation, management, approval, and generation.

The system provides an intelligent and centralized environment where educators can efficiently organize course information, weekly lesson plans, learning outcomes, grading systems, and instructional materials. It also integrates an **AI Academic Companion** capable of assisting educators in generating syllabus content, suggesting learning outcomes, assessments, references, and improving academic documentation quality.

The platform follows a **Role-Based Access Control (RBAC)** architecture, allowing administrators, department heads, deans, coordinators, and faculty members to collaborate within a secure and scalable academic environment.

---

# 🚀 Introduction

A syllabus serves as a foundational academic document that outlines course objectives, weekly topics, learning activities, assessments, grading systems, and institutional policies. Traditional syllabus preparation is commonly done manually using word processors or spreadsheets, resulting in repetitive work, formatting inconsistencies, and inefficient document management.

The AI-Powered Academic Syllabus Management System addresses these challenges by automating syllabus planning and providing intelligent academic assistance through modern web technologies and AI integration.

This system aims to improve:

* Academic planning efficiency
* Standardization of syllabus formatting
* Collaboration between academic personnel
* Documentation management
* Institutional workflow automation

---

# 🎯 General Objective

To design and develop an **AI-Powered Academic Syllabus Management System** that automates the creation, organization, management, review, and generation of academic syllabi while enhancing instructional planning through intelligent academic assistance and role-based collaboration.

---

# 🎯 Specific Objectives

1. To develop a secure authentication and authorization system using role-based access control.

2. To create a centralized academic management platform for managing courses, departments, and academic records.

3. To implement syllabus planning tools for organizing weekly lessons, intended learning outcomes, activities, and assessments.

4. To integrate an AI Academic Companion capable of suggesting:

   * Learning outcomes
   * Weekly topics
   * Assessment methods
   * References
   * Rubrics
   * Academic content improvements

5. To automate syllabus generation in standardized and printable formats such as PDF and DOCX.

6. To provide reusable syllabus templates for future academic terms.

7. To establish a review and approval workflow involving department heads and academic administrators.

8. To improve consistency, efficiency, and accuracy in syllabus preparation across academic departments.

9. To create a scalable and maintainable academic platform for long-term institutional use.

10. To provide a responsive and user-friendly interface for educators and administrators.

---

# ✨ Core Features

* 🔐 Role-Based Authentication and Authorization
* 👤 User and Department Management
* 📚 Course and Curriculum Management
* 🧠 AI Academic Companion
* 📝 Weekly Syllabus Planning
* 🎯 Course Learning Outcomes (CLOs) Management
* 📊 Grading System Configuration
* 📄 Automated PDF/DOCX Syllabus Generation
* 📁 Reusable Syllabus Templates
* 🏫 Academic Department Management
* 📅 Semester and Academic Year Management
* ✅ Syllabus Review and Approval Workflow
* 📈 Dashboard and Analytics
* 📱 Responsive User Interface

---

# 🧠 AI Academic Companion Features

The system integrates an intelligent AI companion designed to assist educators during syllabus preparation.

## AI Capabilities

* Generate Intended Learning Outcomes (ILOs)
* Suggest Course Learning Outcomes (CLOs)
* Recommend weekly lesson topics
* Generate assessment methods
* Suggest academic references
* Create grading rubrics
* Improve academic wording and structure
* Detect syllabus alignment issues
* Recommend teaching and learning activities

---

# 🏗️ System Architecture

The system follows a modular architecture using Laravel Framework and Role-Based Access Control (RBAC).

---

# 🧩 System Modules

## 1. Authentication and Authorization Module

Handles login, registration, password management, and role-based access permissions.

---

## 2. User and Role Management Module

Manages users, roles, departments, and access privileges.

---

## 3. Department Management Module

Handles department creation and academic organizational structure.

---

## 4. Course Management Module

Allows educators to manage course information and academic details.

---

## 5. Syllabus Planning Module

Manages weekly course planning, activities, assessments, and instructional content.

---

## 6. CLO and Outcomes Management Module

Handles Course Learning Outcomes and academic alignment.

---

## 7. AI Academic Companion Module

Provides AI-generated suggestions and academic assistance.

---

## 8. Assessment and Grading Module

Configures grading systems, assessment criteria, and grade distributions.

---

## 9. Approval Workflow Module

Supports review and approval processes involving academic administrators.

---

## 10. Export and Document Generation Module

Generates printable syllabus documents in PDF and DOCX formats.

---

## 11. Reports and Analytics Module

Provides academic insights, statistics, and reporting dashboards.

---

# 🔄 Proposed System Workflow

```text
User Login
      ↓
Dashboard Access
      ↓
Create Course Information
      ↓
Add Course Learning Outcomes
      ↓
Plan Weekly Lessons
      ↓
Configure Activities and Assessments
      ↓
AI Academic Companion Assistance
      ↓
Configure Grading System
      ↓
Submit for Review and Approval
      ↓
Generate Syllabus
      ↓
Export PDF/DOCX
```

---

# 🧱 Role-Based Access Control (RBAC)

The system uses a role-based architecture for scalability and security.

## User Roles

| Role            | Responsibilities                 |
| --------------- | -------------------------------- |
| Admin           | Full system management           |
| Teacher         | Create and manage syllabi        |
| Department Head | Review and approve syllabi       |
| Program Chair   | Monitor academic compliance      |
| Dean            | Final approval and oversight     |
| Coordinator     | Academic scheduling and tracking |

---

# 🎨 Academic UI Palette

Background: #F7F9FC
Primary:    #1E3A5F
Accent:     #D4A017

---

# 💻 Technologies Used

## Frontend

* HTML5
* CSS3
* Tailwind CSS
* JavaScript
* Alpine.js

---

## Backend

* PHP 8.x
* Laravel Framework

---

## Database

* MySQL

---

## Authentication & Roles

* Laravel Breeze
* Spatie Laravel Permission

---

## AI Integration

* OpenAI API

---

## Document Generation

* DomPDF
* Laravel Excel

---

## Development Tools

* Visual Studio Code / Windsurf
* Composer
* Git & GitHub
* XAMPP / Laragon
* Postman

---

# 🗄️ Proposed Database Structure

---

# 1. Users Table

## Purpose

Stores system user accounts and profile information.

## Fields

```text
id
full_name
email
password
department_id
role_id
avatar
status
created_at
updated_at
```

---

# 2. Roles Table

## Purpose

Stores user roles and permissions.

## Fields

```text
id
name
description
created_at
updated_at
```

---

# 3. Departments Table

## Purpose

Stores academic departments.

## Fields

```text
id
department_name
department_code
created_at
updated_at
```

---

# 4. Courses Table

## Purpose

Stores course and subject information.

## Fields

```text
id
user_id
department_id
course_code
course_title
course_description
prerequisite
credit_units
semester
academic_year
created_at
updated_at
```

---

# 5. Course Learning Outcomes Table

## Purpose

Stores course learning outcomes.

## Fields

```text
id
course_id
clo_description
created_at
updated_at
```

---

# 6. Weekly Plans Table

## Purpose

Stores weekly lesson planning data.

## Fields

```text
id
course_id
week_number
topic
intended_learning_outcomes
teaching_learning_activities
assessment_methods
related_clo
created_at
updated_at
```

---

# 7. Grading Systems Table

## Purpose

Stores grading criteria and percentages.

## Fields

```text
id
course_id
component_name
percentage
created_at
updated_at
```

---

# 8. Requirements and Policies Table

## Purpose

Stores classroom policies and requirements.

## Fields

```text
id
course_id
requirements
policies
created_at
updated_at
```

---

# 9. References Table

## Purpose

Stores academic references and resources.

## Fields

```text
id
course_id
reference_type
reference_title
reference_link
created_at
updated_at
```

---

# ⚙️ Installation Guide

## Prerequisites

Ensure the following are installed:

* PHP 8.x
* Composer
* Node.js and NPM
* MySQL
* XAMPP or Laragon
* Git

---

# 🔧 Installation Steps



## 3. Install Dependencies

```bash
composer install
npm install
```

---

## 4. Configure Environment File

```bash
cp .env.example .env
```

Update database credentials in `.env`.

---

## 5. Generate Application Key

```bash
php artisan key:generate
```

---

## 6. Run Database Migrations

```bash
php artisan migrate
```

---

## 7. Seed Default Roles and Permissions

```bash
php artisan db:seed
```

---

## 8. Start Development Server

```bash
php artisan serve
```

---

# 📈 Future Enhancements

* AI-generated syllabus analytics
* Voice-assisted academic planning
* Drag-and-drop syllabus builder
* Cloud-based collaboration
* Mobile application support
* Real-time collaboration tools
* Learning Management System (LMS) integration
* Curriculum mapping analytics
* AI-powered academic insights
* Multi-institution support

---

# ✅ Advantages of the System

* Reduces manual academic documentation
* Improves syllabus consistency
* Saves preparation time
* Enhances academic collaboration
* Centralizes institutional records
* Provides intelligent academic assistance
* Simplifies approval workflows
* Improves instructional planning quality

---

# 🎯 Target Users

* Teachers
* College Instructors
* Department Heads
* Program Chairs
* Deans
* Academic Coordinators
* Educational Institutions

---

# 👨‍💻 Developers

## Developed By

**Von Esson Vergara**

---

## Institution

Sultan Kudarat State University

---

## Program

Bachelor of Science in Information Technology (BSIT)

---

# 📄 License

This project is intended for academic and educational purposes only.

---

# 📌 Conclusion

The AI-Powered Academic Syllabus Management System aims to modernize academic planning through automation, intelligent assistance, and centralized syllabus management. By integrating role-based collaboration and AI-driven academic support, the platform enhances efficiency, consistency, and quality in syllabus preparation and institutional academic workflows.
#   S y l l a b u s - P l a n n e r  
 