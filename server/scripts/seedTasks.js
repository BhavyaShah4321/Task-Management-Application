import 'dotenv/config';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const users = {
  userB: '6a68f451327c260687363bba',
  testUser: '6a690b0956b8ee36578833e4',
  normalUser: '6a690b2156b8ee36578833e5',
  fakeAdmin: '6a690c69ec23c05174de4100',
};

const tasks = [
  {
    user: users.userB,
    title: 'Complete Authentication API Testing',
    description: 'Write comprehensive test cases for the authentication API including registration endpoint validation, login credential verification, JWT token generation and validation, protected route access control, invalid credential handling, expired token rejection, invalid token format detection, duplicate email prevention during registration, password length and complexity validation, and expected HTTP status codes for all success and error scenarios. Additionally test session management, token refresh mechanisms if implemented, concurrent login attempts, account lockout after failed attempts, and ensure all edge cases are properly covered with both positive and negative test cases.',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date('2026-08-02'),
    createdAt: new Date('2026-07-25'),
  },
  {
    user: users.userB,
    title: 'Design Monthly Performance Dashboard',
    description: 'Create a responsive dashboard layout displaying key performance metrics including task completion rates, pending task counts, user activity summaries, and trend indicators. Use Ant Design cards with clear visual hierarchy, ensure proper spacing and alignment, implement responsive grid behavior for different screen sizes, and maintain readability across all display modes.',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date('2026-08-08'),
    createdAt: new Date('2026-07-26'),
  },
  {
    user: users.userB,
    title: 'Fix Mobile Navigation Layout',
    description: 'Review and fix navigation layout issues on mobile devices including header button wrapping, menu spacing inconsistencies, touch target sizing, and overall responsive behavior. Test on various screen sizes to ensure navigation remains accessible and usable on smaller displays.',
    priority: 'High',
    status: 'Pending',
    dueDate: new Date('2026-07-31'),
    createdAt: new Date('2026-07-27'),
  },
  {
    user: users.userB,
    title: 'Review User Registration Flow',
    description: 'Conduct thorough review of the user registration process including form validation logic, duplicate account detection, invalid email format handling, password length requirements, loading state indicators during submission, backend validation responses, successful registration confirmation, automatic redirect behavior, and error message clarity for various failure scenarios. Also verify email verification flow if implemented, password strength indicators, terms of service acceptance, and ensure the overall user experience is smooth and intuitive.',
    priority: 'Low',
    status: 'Completed',
    dueDate: new Date('2026-08-05'),
    createdAt: new Date('2026-07-22'),
  },
  {
    user: users.userB,
    title: 'Prepare API Error Handling Guide',
    description: 'Document common API error scenarios including validation errors, authentication failures, authorization issues, not found responses, and server errors. Specify expected HTTP status codes, error message formats, and recommended frontend handling strategies for each error type.',
    priority: 'Medium',
    status: 'Completed',
    dueDate: new Date('2026-08-12'),
    createdAt: new Date('2026-07-23'),
  },
  {
    user: users.testUser,
    title: 'Implement Customer Search Feature',
    description: 'Implement a search feature that allows users to filter tasks by title with clean request parameters, debounced input handling, and predictable search results. Ensure the search is case-insensitive, handles partial matches, and integrates seamlessly with existing filter and pagination logic.',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date('2026-08-04'),
    createdAt: new Date('2026-07-28'),
  },
  {
    user: users.testUser,
    title: 'Optimize Database Task Queries',
    description: 'Review and optimize MongoDB task queries including user ownership filtering, search text indexing, status and priority filter combinations, sorting operations, and pagination implementation. Identify and eliminate unnecessary database reads, ensure proper index usage, and maintain query behavior that remains understandable and maintainable for future developers. Also analyze query execution plans, add compound indexes where beneficial, review N+1 query problems, optimize aggregation pipelines, and ensure database performance scales appropriately as the dataset grows.',
    priority: 'High',
    status: 'Pending',
    dueDate: new Date('2026-08-15'),
    createdAt: new Date('2026-07-29'),
  },
  {
    user: users.testUser,
    title: 'Validate Task Pagination',
    description: 'Test pagination functionality including page navigation, total task count accuracy, page size options (10, 20, 50), filter persistence across page changes, and proper page reset behavior when filters are modified or cleared.',
    priority: 'Medium',
    status: 'Completed',
    dueDate: new Date('2026-08-03'),
    createdAt: new Date('2026-07-24'),
  },
  {
    user: users.testUser,
    title: 'Create Weekly Activity Report',
    description: 'Prepare a weekly summary report showing completed tasks, pending work, and in-progress items for management review. Include task counts by priority, status distribution, and any notable blockers or delays from the current week.',
    priority: 'Low',
    status: 'Pending',
    dueDate: new Date('2026-08-20'),
    createdAt: new Date('2026-07-28'),
  },
  {
    user: users.testUser,
    title: 'Test Role-Based Access Control',
    description: 'Comprehensive testing of role-based access control including normal user access restrictions, admin endpoint protection, proper 401 vs 403 error responses, admin task assignment capabilities, user ownership enforcement, direct URL access attempts by unauthorized users, and registration role security to prevent admin account creation. Also test token-based authorization, middleware execution order, role verification at both route and controller levels, session invalidation after role changes, and ensure security boundaries cannot be bypassed through API manipulation.',
    priority: 'High',
    status: 'Completed',
    dueDate: new Date('2026-08-06'),
    createdAt: new Date('2026-07-25'),
  },
  {
    user: users.normalUser,
    title: 'Improve Task Dashboard Responsiveness',
    description: 'Enhance dashboard responsiveness across desktop, tablet, and mobile viewports. Review Ant Design Table behavior on small screens, ensure filter controls wrap properly, verify header navigation adapts correctly, check action button visibility, prevent horizontal overflow issues, adjust spacing for touch targets, and maintain overall usability across all device sizes. Test on actual mobile devices, verify touch interactions work smoothly, check landscape vs portrait orientations, ensure modal dialogs are properly sized, and confirm that all critical functionality remains accessible on the smallest supported screen size.',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: new Date('2026-08-10'),
    createdAt: new Date('2026-07-26'),
  },
  {
    user: users.normalUser,
    title: 'Review Task Form Validation',
    description: 'Verify all form validation rules including required title field, priority selection, status options, description character limits, due date requirements, and past-date restriction logic for due dates.',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date('2026-08-01'),
    createdAt: new Date('2026-07-27'),
  },
  {
    user: users.normalUser,
    title: 'Complete Production Readiness Checklist',
    description: 'Execute comprehensive production readiness checklist including environment variable verification, production build validation, API error handling review, security configuration checks, Git history cleanup, documentation updates, CI pipeline verification, cross-browser testing, removal of development artifacts and console logs, and final demonstration preparation. Also verify database connection strings are secure, review CORS configuration, test production deployment process, verify backup and recovery procedures, check monitoring and logging setup, validate performance under load, ensure SSL/TLS certificates are properly configured, and conduct final security audit before going live.',
    priority: 'High',
    status: 'Pending',
    dueDate: new Date('2026-08-25'),
    createdAt: new Date('2026-07-29'),
  },
  {
    user: users.normalUser,
    title: 'Update Project Documentation',
    description: 'Review and update project documentation including setup instructions, environment variable requirements, project structure overview, and local development workflow steps to ensure new developers can quickly understand and contribute to the project.',
    priority: 'Low',
    status: 'Completed',
    dueDate: new Date('2026-08-18'),
    createdAt: new Date('2026-07-23'),
  },
  {
    user: users.normalUser,
    title: 'Verify Search and Filter Combinations',
    description: 'Test various combinations of search text with status filters, priority filters, sorting options, and pagination to verify that backend returns consistent and expected results across all filter combinations.',
    priority: 'Medium',
    status: 'Completed',
    dueDate: new Date('2026-08-07'),
    createdAt: new Date('2026-07-24'),
  },
  {
    user: users.fakeAdmin,
    title: 'Perform Application Security Review',
    description: 'Conduct thorough security review covering JWT token protection and validation, authorization middleware implementation, password hashing strength, environment variable and secret management, task ownership enforcement, admin endpoint security, request input validation, unauthorized access attempt handling, sensitive data exclusion from API responses, and registration endpoint role security. Additionally review CORS configuration, implement rate limiting where appropriate, check for SQL injection vulnerabilities, validate file upload security if present, review session management, test for XSS vulnerabilities, ensure HTTPS enforcement, implement proper logging for security events, review dependency vulnerabilities, and conduct penetration testing on all public endpoints.',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date('2026-08-14'),
    createdAt: new Date('2026-07-28'),
  },
  {
    user: users.fakeAdmin,
    title: 'Test Dark Mode Across Application',
    description: 'Verify dark mode implementation across all pages including login, registration, user dashboard, admin dashboard, task tables, forms, tooltips, modals, and ensure text readability and component visibility remain clear in dark mode.',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: new Date('2026-08-09'),
    createdAt: new Date('2026-07-27'),
  },
  {
    user: users.fakeAdmin,
    title: 'Prepare Final Demonstration Dataset',
    description: 'Prepare realistic user accounts and task data to demonstrate key features including search functionality, filtering by status and priority, sorting by various fields, pagination behavior, and admin task assignment capabilities.',
    priority: 'Low',
    status: 'Completed',
    dueDate: new Date('2026-07-30'),
    createdAt: new Date('2026-07-22'),
  },
  {
    user: users.fakeAdmin,
    title: 'Verify Complete Task Management Workflow',
    description: 'End-to-end verification of the complete task management workflow including task creation with validation, task editing and updates, task completion marking, task deletion with confirmation, form validation behavior, ownership enforcement, search functionality, filter combinations, sorting operations, pagination navigation, admin task assignment to users, and verification that assigned tasks appear correctly for the designated user. Also test concurrent task modifications, handle optimistic updates correctly, verify conflict resolution, test offline behavior if applicable, ensure data consistency across operations, validate undo/redo functionality if present, and confirm that all user actions provide appropriate feedback and error handling.',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date('2026-08-16'),
    createdAt: new Date('2026-07-29'),
  },
  {
    user: users.fakeAdmin,
    title: 'Review Final User Interface',
    description: 'Comprehensive UI review covering visual consistency across pages, proper spacing and alignment, typography hierarchy, button states and hover effects, form input styling, table readability, tag colors and meanings, empty state presentations, loading state indicators, dark mode appearance, responsive layout behavior, and ensuring the overall application presents a professional appearance suitable for the final demonstration. Additionally verify accessibility compliance including keyboard navigation, screen reader compatibility, color contrast ratios, focus indicators, ARIA labels where needed, and ensure the application is usable by users with disabilities. Test all interactive elements for proper feedback, verify error messages are clear and actionable, confirm success states are obvious, and ensure the overall user experience is polished and professional.',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date('2026-08-22'),
    createdAt: new Date('2026-07-26'),
  },
];

async function seedTasks() {
  try {
    await connectDB();
    console.log('Database connected');

    const existingUsers = await User.find({
      _id: { $in: Object.values(users) },
    });

    if (existingUsers.length !== 4) {
      console.error('Expected 4 users, found:', existingUsers.length);
      console.error('Please ensure all required users exist in the database');
      process.exit(1);
    }

    const deleteResult = await Task.deleteMany({});
    console.log(`Existing tasks removed: ${deleteResult.deletedCount}`);

    const insertedTasks = await Task.insertMany(tasks);
    console.log(`Demo tasks created: ${insertedTasks.length}`);

    const totalCount = await Task.countDocuments();
    console.log(`Total tasks in database: ${totalCount}`);

    const counts = await Task.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
    ]);

    console.log('\nTask counts by user:');
    for (const count of counts) {
      const user = await User.findById(count._id);
      console.log(`${user.name}: ${count.count}`);
    }

    const priorityCounts = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    console.log('\nPriority distribution:');
    for (const pc of priorityCounts) {
      console.log(`${pc._id}: ${pc.count}`);
    }

    const statusCounts = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    console.log('\nStatus distribution:');
    for (const sc of statusCounts) {
      console.log(`${sc._id}: ${sc.count}`);
    }

    const longDescCount = insertedTasks.filter(
      (task) => task.description && task.description.length >= 500
    ).length;
    console.log(`\nLong descriptions (500+ chars): ${longDescCount}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding tasks:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedTasks();
