import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { toast } from "react-toastify";

const chartData = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Revamp company website",
      startDate: "2025-02-01",
      endDate: "2025-12-31",
      milestones: [
        { id: 1, name: "Phase 1", date: "2025-03-01" },
        { id: 2, name: "Phase 2", date: "2025-06-01" },
      ],
    },
    {
      id: 2,
      name: "Mobile App",
      description: "Develop new mobile app",
      startDate: "2025-01-01",
      endDate: "2026-12-31",
      milestones: [{ id: 1, name: "Kickoff", date: "2025-04-01" }],
    },

    {
      id: 3,
      name: "CRM Migration",
      description: "Transition from old CRM to Salesforce",
      startDate: "2025-03-15",
      endDate: "2025-09-30",
      milestones: [
        { id: 1, name: "Data cleanup", date: "2025-04-10" },
        { id: 2, name: "Training sessions", date: "2025-06-20" },
        { id: 3, name: "Go-live", date: "2025-09-15" },
      ],
    },
    {
      id: 4,
      name: "Product Analytics Dashboard",
      description: "Build internal tool for tracking KPIs",
      startDate: "2025-01-10",
      endDate: "2025-07-01",
      milestones: [
        { id: 1, name: "Prototype ready", date: "2025-02-28" },
        { id: 2, name: "Beta release", date: "2025-05-15" },
      ],
    },
    {
      id: 5,
      name: "Office Relocation",
      description: "Move HQ to new downtown building",
      startDate: "2025-08-01",
      endDate: "2025-11-30",
      milestones: [
        { id: 1, name: "Furniture ordered", date: "2025-08-15" },
        { id: 2, name: "IT setup complete", date: "2025-10-01" },
      ],
    },
    {
      id: 6,
      name: "Customer Portal Upgrade",
      description: "Add payment + support features",
      startDate: "2025-04-05",
      endDate: "2026-02-28",
      milestones: [
        { id: 1, name: "UI/UX approved", date: "2025-05-01" },
        { id: 2, name: "Dev complete", date: "2025-11-30" },
        { id: 3, name: "User testing", date: "2026-01-15" },
      ],
    },
    {
      id: 7,
      name: "AI Chatbot Integration",
      description: "Implement GPT-5 support for customer service",
      startDate: "2025-09-01",
      endDate: "2026-05-31",
      milestones: [
        { id: 1, name: "Pilot launch", date: "2025-12-01" },
        { id: 2, name: "Full deployment", date: "2026-04-15" },
      ],
    },
  ]);
  const [currentUser, setCurrentUser] = useState({ id: 1, role: "Admin" });
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Abhay Bansal",
      email: "bansalabhay00@gmail.com",
      role: "FULL-STACK DEVELOPER",
    },
    { id: 2, name: "Gaurav", email: "gaurav@mail.com", role: "Designer" },
    {
      id: 3,
      name: "Abhay Bansal",
      email: "bansalabhay00@gmail.com",
      role: "Developer",
    },
    {
      id: 4,
      name: "gautam",
      email: "g@mail.com",
      role: "Backend Dev",
    },
    {
      id: 5,
      name: "Ananya Singh",
      email: "ananyasingh@gmail.com",
      role: "UI/UX Designer",
    },
    {
      id: 6,
      name: "Abhay Bansal ",
      email: "bansalabhay@gmail.com",
      role: "Designer",
    },
    {
      id: 7,
      name: "Vikram Joshi",
      email: "vikram.joshi@company.com",
      role: "Senior Developer",
      joinDate: "2024-01-15",
    },
    {
      id: 8,
      name: "Neha",
      email: "neha@company.com",
      role: "QA ENGINEER",
    },
  ]);

  const [batches, setBatches] = useState([
    { id: 1, name: "Frontend Team", projectId: 1, members: [1, 2] },
    { id: 2, name: "Backend Team", projectId: 1, members: [2, 3] },
    { id: 3, name: "Mobile Devs", projectId: 2, members: [1, 3] },
    {
      id: 4,
      name: "Designing",
      projectId: 2,
      members: [4, 5],
    },
    {
      id: 5,
      name: "DevOps",
      projectId: 3,
      members: [2, 4, 5],
    },
    {
      id: 6,
      name: "UX Design Team",
      projectId: 1,
      members: [3, 2, 1],
    },
    {
      id: 7,
      name: "data Science",
      projectId: 4,
      members: [2],
    },
    {
      id: 8,
      name: "Digital Marketing",
      projectId: 5,
      members: [8, 3],
    },
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Design UI",
      status: "In Progress",
      dueDate: "2025-01-15",
      priority: "High",
      batchId: 1,
      projectId: 1,
      assignedTo: [1, 2],
    },
    {
      id: 2,
      name: "API Integration",
      status: "In Progress",
      dueDate: "2025-02-20",
      priority: "Medium",
      batchId: 2,
      projectId: 1,
      assignedTo: [2, 3],
    },
    {
      id: 3,
      name: "Test App",
      status: "Done",
      dueDate: "2025-03-10",
      priority: "Low",
      batchId: 1,
      projectId: 2,
      assignedTo: [1, 3],
    },
    {
      id: 4,
      name: "Database Setup",
      status: "To Do",
      dueDate: "2025-04-05",
      priority: "Medium",
      batchId: 2,
      projectId: 1,
      assignedTo: [3],
    },
    {
      id: 5,
      name: "Wireframe Design",
      status: "Done",
      dueDate: "2025-01-20",
      priority: "High",
      batchId: 1,
      projectId: 1,
      assignedTo: [2],
    },
    {
      id: 6,
      name: "Authentication Module",
      status: "In Progress",
      dueDate: "2025-02-25",
      priority: "High",
      batchId: 1,
      projectId: 1,
      assignedTo: [2, 3],
    },
    {
      id: 7,
      name: "Unit Testing",
      status: "To Do",
      dueDate: "2025-03-15",
      priority: "Medium",
      batchId: 1,
      projectId: 2,
      assignedTo: [1],
    },
    {
      id: 8,
      name: "Performance Optimization",
      status: "In Progress",
      dueDate: "2025-04-10",
      priority: "Medium",
      batchId: 1,
      projectId: 1,
      assignedTo: [3],
    },
    {
      id: 9,
      name: "Push Notification Setup",
      status: "Done",
      dueDate: "2025-03-05",
      priority: "Medium",
      batchId: 3,
      projectId: 2,
      assignedTo: [1, 3],
      description: "Implement Firebase notifications",
    },

    // Design Team Tasks (Batch 4)
    {
      id: 10,
      name: "Wireframe Design",
      status: "Done",
      dueDate: "2025-01-20",
      priority: "High",
      batchId: 4,
      projectId: 2,
      assignedTo: [4],
      description: "Create Figma prototypes",
    },
    {
      id: 11,
      name: "Design System Update",
      status: "In Progress",
      dueDate: "2025-04-01",
      priority: "Medium",
      batchId: 4,
      projectId: 2,
      assignedTo: [5],
      description: "Refresh component library",
    },
    {
      id: 12,
      name: "User Flow Diagrams",
      status: "To Do",
      dueDate: "2025-04-10",
      priority: "Low",
      batchId: 4,
      projectId: 2,
      assignedTo: [4, 5],
      description: "Map all application screens",
    },

    // DevOps Tasks (Batch 5)
    {
      id: 13,
      name: "CI/CD Pipeline Setup",
      status: "In Progress",
      dueDate: "2025-04-10",
      priority: "High",
      batchId: 5,
      projectId: 3,
      assignedTo: [4],
      description: "Configure GitHub Actions",
    },
    {
      id: 14,
      name: "Server Monitoring",
      status: "To Do",
      dueDate: "2025-04-15",
      priority: "Medium",
      batchId: 5,
      projectId: 3,
      assignedTo: [2],
      description: "Set up New Relic alerts",
    },
    {
      id: 15,
      name: "Dockerize Applications",
      status: "Done",
      dueDate: "2025-04-05",
      priority: "Medium",
      batchId: 5,
      projectId: 3,
      assignedTo: [5],
      description: "Containerize all services",
    },

    // UX Research Tasks (Batch 6)
    {
      id: 16,
      name: "User Testing Session",
      status: "Done",
      dueDate: "2025-01-30",
      priority: "Medium",
      batchId: 6,
      projectId: 1,
      assignedTo: [3],
      description: "Conduct usability studies",
    },
    {
      id: 17,
      name: "Survey Analysis",
      status: "In Progress",
      dueDate: "2025-02-15",
      priority: "Low",
      batchId: 6,
      projectId: 1,
      assignedTo: [2],
      description: "Process customer feedback",
    },
    {
      id: 18,
      name: "Competitor Analysis",
      status: "To Do",
      dueDate: "2025-03-01",
      priority: "Medium",
      batchId: 6,
      projectId: 1,
      assignedTo: [1, 3],
      description: "Compare with similar products",
    },

    // Data Science Tasks (Batch 7)
    {
      id: 19,
      name: "Analytics Dashboard",
      status: "In Progress",
      dueDate: "2025-05-01",
      priority: "High",
      batchId: 7,
      projectId: 4,
      assignedTo: [2],
      description: "Build data visualization tools",
    },
    {
      id: 20,
      name: "Data Cleaning",
      status: "Done",
      dueDate: "2025-04-20",
      priority: "Medium",
      batchId: 7,
      projectId: 4,
      assignedTo: [2],
      description: "Prepare datasets for analysis",
    },

    // Digital Marketing Tasks (Batch 8)
    {
      id: 21,
      name: "Campaign Launch",
      status: "To Do",
      dueDate: "2025-06-01",
      priority: "Medium",
      batchId: 8,
      projectId: 5,
      assignedTo: [8],
      description: "Rollout summer promotion",
    },
    {
      id: 22,
      name: "SEO Optimization",
      status: "In Progress",
      dueDate: "2025-05-15",
      priority: "High",
      batchId: 8,
      projectId: 5,
      assignedTo: [3, 8],
      description: "Improve search rankings",
    },
    {
      id: 23,
      name: "Social Media Setup",
      status: "Done",
      dueDate: "2025-05-01",
      priority: "Low",
      batchId: 8,
      projectId: 5,
      assignedTo: [8],
      description: "Create company profiles",
    },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [dates, setDates] = useState([]);
  const [lastSelectedDate, setLastSelectedDate] = useState(null);
  const [isContextReady, setIsContextReady] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  useEffect(() => {
    if (batches.length && !selectedBatch) {
      console.log("Setting initial selectedBatch:", batches[0]);
      setSelectedBatch(batches[0]);
    }
    setIsContextReady(true);
  }, [batches, selectedBatch]);

  const addProject = (project) => {
    const newProject = { id: projects.length + 1, ...project };
    setProjects([...projects, newProject]);
    setCalendarEvents([
      ...calendarEvents,
      {
        id: calendarEvents.length + 1,
        title: `${project.name} Start`,
        start: new Date(project.startDate),
        end: new Date(project.startDate),
        type: "project",
        projectId: newProject.id,
      },
      {
        id: calendarEvents.length + 2,
        title: `${project.name} End`,
        start: new Date(project.endDate),
        end: new Date(project.endDate),
        type: "project",
        projectId: newProject.id,
      },
      ...(project.milestones || []).map((m, i) => ({
        id: calendarEvents.length + 3 + i,
        title: m.name,
        start: new Date(m.date),
        end: new Date(m.date),
        type: "milestone",
        projectId: newProject.id,
      })),
    ]);
    toast.success(`Project "${project.name}" created`, { autoClose: 3000 });
  };

  // const [calendarEvents, setCalendarEvents] = useState([
  //   {
  //     id: 1,
  //     title: "Website Redesign Start",
  //     start: new Date("2025-02-01"),
  //     end: new Date("2025-02-01"),
  //     type: "project",
  //     projectId: 1,
  //   },
  //   {
  //     id: 2,
  //     title: "Website Redesign End",
  //     start: new Date("2025-12-31"),
  //     end: new Date("2025-12-31"),
  //     type: "project",
  //     projectId: 1,
  //   },
  //   {
  //     id: 3,
  //     title: "Mobile App Start",
  //     start: new Date("2025-01-01"),
  //     end: new Date("2025-01-01"),
  //     type: "project",
  //     projectId: 2,
  //   },
  //   {
  //     id: 4,
  //     title: "Mobile App End",
  //     start: new Date("2026-12-31"),
  //     end: new Date("2026-12-31"),
  //     type: "project",
  //     projectId: 2,
  //   },
  //   {
  //     id: 5,
  //     title: "Phase 1",
  //     start: new Date("2025-03-01"),
  //     end: new Date("2025-03-01"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 6,
  //     title: "Phase 2",
  //     start: new Date("2025-06-01"),
  //     end: new Date("2025-06-01"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 7,
  //     title: "Phase 2",
  //     start: new Date("2025-06-08"),
  //     end: new Date("2025-06-09"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 6,
  //     title: "Week-3",
  //     start: new Date("2025-06-09"),
  //     end: new Date("2025-06-15"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 6,
  //     title: "week-4",
  //     start: new Date("2025-06-16"),
  //     end: new Date("2025-06-22"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 6,
  //     title: "week-5",
  //     start: new Date("2025-06-23"),
  //     end: new Date("2025-06-29"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 6,
  //     title: "week-6",
  //     start: new Date("2025-06-29"),
  //     end: new Date("2025-07-06"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 6,
  //     title: "week-7",
  //     start: new Date("2025-07-07"),
  //     end: new Date("2025-07-13"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 6,
  //     title: "week-8",
  //     start: new Date("2025-07-14"),
  //     end: new Date("2025-07-20"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 6,
  //     title: "Phase 2",
  //     start: new Date("2025-06-01"),
  //     end: new Date("2025-06-01"),
  //     type: "milestone",
  //     projectId: 1,
  //   },
  //   {
  //     id: 7,
  //     title: "Kickoff",
  //     start: new Date("2025-04-01"),
  //     end: new Date("2025-04-01"),
  //     type: "milestone",
  //     projectId: 2,
  //   },
  //   {
  //     id: 8,
  //     title: "Design UI",
  //     start: new Date("2025-01-15"),
  //     end: new Date("2025-01-15"),
  //     type: "task",
  //     taskId: 1,
  //   },
  //   {
  //     id: 9,
  //     title: "API Integration",
  //     start: new Date("2025-02-20"),
  //     end: new Date("2025-02-20"),
  //     type: "task",
  //     taskId: 2,
  //   },
  //   {
  //     id: 10,
  //     title: "Test App",
  //     start: new Date("2025-03-10"),
  //     end: new Date("2025-03-10"),
  //     type: "task",
  //     taskId: 3,
  //   },
  //   {
  //     id: 11,
  //     title: "Database Setup",
  //     start: new Date("2025-04-05"),
  //     end: new Date("2025-04-05"),
  //     type: "task",
  //     taskId: 4,
  //   },
  //   {
  //     id: 12,
  //     title: "Wireframe Design",
  //     start: new Date("2025-01-20"),
  //     end: new Date("2025-01-20"),
  //     type: "task",
  //     taskId: 5,
  //   },
  //   {
  //     id: 13,
  //     title: "Authentication Module",
  //     start: new Date("2025-02-25"),
  //     end: new Date("2025-02-25"),
  //     type: "task",
  //     taskId: 6,
  //   },
  //   {
  //     id: 14,
  //     title: "Unit Testing",
  //     start: new Date("2025-03-15"),
  //     end: new Date("2025-03-15"),
  //     type: "task",
  //     taskId: 7,
  //   },
  //   {
  //     id: 15,
  //     title: "Performance Optimization",
  //     start: new Date("2025-04-10"),
  //     end: new Date("2025-04-10"),
  //     type: "task",
  //     taskId: 8,
  //   },
  // ]);

  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 1,
      title: "Website Redesign Start",
      start: new Date("2025-02-01"),
      end: new Date("2025-02-01"),
      type: "project",
      projectId: 1,
    },
    {
      id: 2,
      title: "Website Redesign End",
      start: new Date("2025-12-31"),
      end: new Date("2025-12-31"),
      type: "project",
      projectId: 1,
    },
    {
      id: 3,
      title: "Mobile App Start",
      start: new Date("2025-01-01"),
      end: new Date("2025-01-01"),
      type: "project",
      projectId: 2,
    },
    {
      id: 4,
      title: "Mobile App End",
      start: new Date("2026-12-31"),
      end: new Date("2026-12-31"),
      type: "project",
      projectId: 2,
    },
    {
      id: 5,
      title: "Phase 1",
      start: new Date("2025-03-01"),
      end: new Date("2025-03-01"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 6,
      title: "Phase 2",
      start: new Date("2025-06-01"),
      end: new Date("2025-06-01"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 7,
      title: "Phase 2 Review",
      start: new Date("2025-06-08"),
      end: new Date("2025-06-09"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 8,
      title: "Week-3",
      start: new Date("2025-06-09"),
      end: new Date("2025-06-15"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 9,
      title: "Week-4",
      start: new Date("2025-06-16"),
      end: new Date("2025-06-22"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 10,
      title: "Week-5",
      start: new Date("2025-06-23"),
      end: new Date("2025-06-29"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 11,
      title: "Week-6",
      start: new Date("2025-06-29"),
      end: new Date("2025-07-06"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 12,
      title: "Week-7",
      start: new Date("2025-07-07"),
      end: new Date("2025-07-13"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 13,
      title: "Week-8",
      start: new Date("2025-07-14"),
      end: new Date("2025-07-20"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 14,
      title: "Phase 2 Completion",
      start: new Date("2025-06-01"),
      end: new Date("2025-06-01"),
      type: "milestone",
      projectId: 1,
    },
    {
      id: 15,
      title: "Kickoff",
      start: new Date("2025-04-01"),
      end: new Date("2025-04-01"),
      type: "milestone",
      projectId: 2,
    },
    {
      id: 16,
      title: "Design UI",
      start: new Date("2025-01-15"),
      end: new Date("2025-01-15"),
      type: "task",
      taskId: 1,
    },
    {
      id: 17,
      title: "API Integration",
      start: new Date("2025-02-20"),
      end: new Date("2025-02-20"),
      type: "task",
      taskId: 2,
    },
    {
      id: 18,
      title: "Test App",
      start: new Date("2025-03-10"),
      end: new Date("2025-03-10"),
      type: "task",
      taskId: 3,
    },
    {
      id: 19,
      title: "Database Setup",
      start: new Date("2025-04-05"),
      end: new Date("2025-04-05"),
      type: "task",
      taskId: 4,
    },
    {
      id: 20,
      title: "Wireframe Design",
      start: new Date("2025-01-20"),
      end: new Date("2025-01-20"),
      type: "task",
      taskId: 5,
    },
    {
      id: 21,
      title: "Authentication Module",
      start: new Date("2025-02-25"),
      end: new Date("2025-02-25"),
      type: "task",
      taskId: 6,
    },
    {
      id: 22,
      title: "Unit Testing",
      start: new Date("2025-03-15"),
      end: new Date("2025-03-15"),
      type: "task",
      taskId: 7,
    },
    {
      id: 23,
      title: "Performance Optimization",
      start: new Date("2025-04-10"),
      end: new Date("2025-04-10"),
      type: "task",
      taskId: 8,
    },
  ]);
  const updateProject = (id, updatedProject) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p))
    );
    setCalendarEvents(
      calendarEvents
        .filter(
          (e) => !e.title.includes(projects.find((p) => p.id === id).name)
        )
        .concat([
          {
            id: calendarEvents.length + 1,
            title: `${updatedProject.name} Start`,
            start: new Date(updatedProject.startDate),
            end: new Date(updatedProject.startDate),
            type: "project",
            projectId: id,
          },
          {
            id: calendarEvents.length + 2,
            title: `${updatedProject.name} End`,
            start: new Date(updatedProject.endDate),
            end: new Date(updatedProject.endDate),
            type: "project",
            projectId: id,
          },
          ...(updatedProject.milestones || []).map((m, i) => ({
            id: calendarEvents.length + 3 + i,
            title: m.name,
            start: new Date(m.date),
            end: new Date(m.date),
            type: "milestone",
            projectId: id,
          })),
        ])
    );
    toast.success(`Project "${updatedProject.name}" updated`, {
      autoClose: 3000,
    });
  };

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
    setCalendarEvents(
      calendarEvents.filter(
        (e) => !e.title.includes(projects.find((p) => p.id === id).name)
      )
    );
    toast.success("Project deleted", { autoClose: 3000 });
  };

  const addBatch = (batch) => {
    setBatches([...batches, { id: batches.length + 1, ...batch }]);
    toast.success(`Batch "${batch.name}" created`, { autoClose: 3000 });
  };

  const updateBatch = (batchId, updatedBatch) => {
    setBatches(
      batches.map((b) => (b.id === batchId ? { ...b, ...updatedBatch } : b))
    );
    if (selectedBatch?.id === batchId) {
      console.log("Updating selectedBatch:", updatedBatch);
      setSelectedBatch(updatedBatch);
    }
    toast.success(`Batch "${updatedBatch.name}" updated`, { autoClose: 3000 });
  };

  const deleteBatch = (id) => {
    setBatches(batches.filter((b) => b.id !== id));
    if (selectedBatch?.id === id) {
      console.log("Resetting selectedBatch to first batch or null");
      setSelectedBatch(batches.length > 1 ? batches[0] : null);
    }
    toast.success("Batch deleted", { autoClose: 3000 });
  };

  const addTask = (task) => {
    const newTask = { id: tasks.length + 1, ...task };
    console.log("newTask:", newTask);
    setTasks([...tasks, newTask]);
    setCalendarEvents([
      ...calendarEvents,
      {
        id: calendarEvents.length + 1,
        title: task.name,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        type: "task",
        taskId: newTask.id,
      },
    ]);
    toast.success(`Task "${task.name}" created`, { autoClose: 3000 });
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
    setCalendarEvents(
      calendarEvents.map((e) =>
        e.taskId === id
          ? {
              ...e,
              title: updatedTask.name,
              start: new Date(updatedTask.dueDate),
              end: new Date(updatedTask.dueDate),
            }
          : e
      )
    );
    toast.success(`Task "${updatedTask.name}" updated`, { autoClose: 3000 });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setCalendarEvents(calendarEvents.filter((e) => e.taskId !== id));
    toast.success("Task deleted", { autoClose: 3000 });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const updateTaskDetails = (taskId, updates) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const selectTask = (task) => {
    setSelectedTask(task);
  };

  const selectBatch = (batch) => {
    console.log("Selecting batch:", batch);
    setSelectedBatch(batch);
  };

  const selectProject = (project) => {
    console.log("Selecting project:", project);
    setSelectedProject(project);
  };

  const toggleDate = (clickedDate) => {
    setDates((prevDates) => {
      const exists = prevDates.some(
        (d) => d.toDateString() === clickedDate.toDateString()
      );
      if (exists) {
        const newDates = prevDates.filter(
          (d) => d.toDateString() !== clickedDate.toDateString()
        );
        setLastSelectedDate(
          newDates.length ? newDates[newDates.length - 1] : null
        );
        return newDates;
      } else {
        setLastSelectedDate(clickedDate);
        return [...prevDates, clickedDate];
      }
    });
  };

  const [notes, setNotes] = useState({});
  const updateNotes = (batchId, content) => {
    setNotes((prev) => ({ ...prev, [batchId]: content }));
  };

  const filteredChartData = useMemo(() => {
    if (!lastSelectedDate) return chartData;
    const month = lastSelectedDate.getMonth();
    return chartData.filter((d) => {
      const monthIndex = new Date(`${d.name} 1, 2025`).getMonth();
      return monthIndex === month;
    });
  }, [lastSelectedDate]);

  const batchReportData = useMemo(() => {
    const data = batches.reduce((acc, batch) => {
      batch.members.forEach((memberId) => {
        const memberTasks = tasks.filter(
          (t) => t.batchId === batch.id && t.assignedTo?.includes(memberId)
        );
        acc.push({
          batchId: batch.id,
          memberId: memberId,
          tasksCompleted: memberTasks.filter((t) => t.status === "Done").length,
          tasksInProgress: memberTasks.filter((t) => t.status === "In Progress")
            .length,
          tasksTodo: memberTasks.filter((t) => t.status === "To Do").length,
        });
      });
      return acc;
    }, []);
    console.log("BatchReportData:", data);
    return data;
  }, [batches, tasks]);

  const contextValue = useMemo(
    () => ({
      projects,
      addProject,
      updateProject,
      deleteProject,
      batches,
      addBatch,
      updateBatch,
      deleteBatch,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      currentUser,
      updateTaskStatus,
      updateTaskDetails,
      selectedTask,
      selectTask,
      selectedBatch,
      selectBatch,
      selectProject,
      dates,
      toggleDate,
      lastSelectedDate,
      filteredChartData,
      batchReportData,
      members,
      calendarEvents,
      isContextReady,
    }),
    [
      projects,
      batches,
      tasks,
      currentUser,
      selectedTask,
      selectedBatch,
      dates,
      lastSelectedDate,
      filteredChartData,
      batchReportData,
      members,
      calendarEvents,
      isContextReady,
    ]
  );
  console.log("hehe");
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
