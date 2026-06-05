export const data = {
  revenueTrend: [72, 78, 84, 87, 96, 109, 116, 129, 141, 148, 162, 176],
  churnTrend: [4.8, 4.1, 3.9, 3.7, 3.5, 3.6, 3.3, 3.1, 2.9, 2.8, 2.6, 2.4],
  customers: [
    {
      id: "c-101",
      name: "Northstar Labs",
      company: "Northstar Labs",
      owner: "Elena Torres",
      plan: "Growth",
      status: "Customer",
      arr: 24000,
      health: "Strong",
      lastActivity: "2026-06-03",
      contacts: 14,
      region: "US East",
      notes: "Expanded into three teams after onboarding success."
    },
    {
      id: "c-102",
      name: "Aster Retail",
      company: "Aster Retail",
      owner: "Niko Bell",
      plan: "Enterprise",
      status: "Customer",
      arr: 52000,
      health: "Watch",
      lastActivity: "2026-06-04",
      contacts: 21,
      region: "EU",
      notes: "Asking for custom permissions and advanced exports."
    },
    {
      id: "c-103",
      name: "Luma Freight",
      company: "Luma Freight",
      owner: "Jade Carter",
      plan: "Starter",
      status: "Qualified",
      arr: 9600,
      health: "Warm",
      lastActivity: "2026-06-01",
      contacts: 6,
      region: "US West",
      notes: "Pilot team active, waiting on billing approval."
    },
    {
      id: "c-104",
      name: "Orbit Education",
      company: "Orbit Education",
      owner: "Miles Nguyen",
      plan: "Growth",
      status: "New",
      arr: 14000,
      health: "Warm",
      lastActivity: "2026-05-29",
      contacts: 8,
      region: "APAC",
      notes: "Inbound lead from webinar funnel."
    },
    {
      id: "c-105",
      name: "Beacon Capital",
      company: "Beacon Capital",
      owner: "Ava Patel",
      plan: "Enterprise",
      status: "Customer",
      arr: 68000,
      health: "Strong",
      lastActivity: "2026-06-02",
      contacts: 19,
      region: "US East",
      notes: "Power users are asking for AI summaries."
    },
    {
      id: "c-106",
      name: "Delta Health",
      company: "Delta Health",
      owner: "Owen Reed",
      plan: "Growth",
      status: "Churned",
      arr: 18000,
      health: "Critical",
      lastActivity: "2026-05-24",
      contacts: 11,
      region: "Canada",
      notes: "Left after implementation delays on their side."
    }
  ],
  deals: [
    {
      id: "d-201",
      company: "Northstar Labs",
      title: "Ops Expansion",
      stage: "Discovery",
      value: 12000,
      owner: "Elena Torres",
      dueDate: "2026-06-10",
      probability: 48,
      type: "Expansion"
    },
    {
      id: "d-202",
      company: "Aster Retail",
      title: "Global Rollout",
      stage: "Proposal",
      value: 31000,
      owner: "Niko Bell",
      dueDate: "2026-06-07",
      probability: 72,
      type: "Upsell"
    },
    {
      id: "d-203",
      company: "Orbit Education",
      title: "Initial Pilot",
      stage: "Qualified",
      value: 9000,
      owner: "Miles Nguyen",
      dueDate: "2026-06-13",
      probability: 34,
      type: "New Biz"
    },
    {
      id: "d-204",
      company: "Beacon Capital",
      title: "AI Workspace Add-on",
      stage: "Negotiation",
      value: 22000,
      owner: "Ava Patel",
      dueDate: "2026-06-06",
      probability: 81,
      type: "Expansion"
    },
    {
      id: "d-205",
      company: "Luma Freight",
      title: "Dispatch Team Trial",
      stage: "Discovery",
      value: 6000,
      owner: "Jade Carter",
      dueDate: "2026-06-15",
      probability: 25,
      type: "Pilot"
    },
    {
      id: "d-206",
      company: "Nova Ventures",
      title: "Portfolio Rollup",
      stage: "Proposal",
      value: 44000,
      owner: "Elena Torres",
      dueDate: "2026-06-16",
      probability: 66,
      type: "Enterprise"
    },
    {
      id: "d-207",
      company: "Cinder Mobility",
      title: "Renewal Rescue",
      stage: "Negotiation",
      value: 18000,
      owner: "Ava Patel",
      dueDate: "2026-06-09",
      probability: 59,
      type: "Renewal"
    }
  ],
  tasks: [
    {
      id: "t-301",
      title: "Review enterprise security questionnaire",
      customer: "Aster Retail",
      assignee: "Niko Bell",
      priority: "High",
      status: "In Progress",
      dueDate: "2026-06-06",
      lane: "Today"
    },
    {
      id: "t-302",
      title: "Prepare onboarding summary for Northstar",
      customer: "Northstar Labs",
      assignee: "Elena Torres",
      priority: "Medium",
      status: "Open",
      dueDate: "2026-06-07",
      lane: "This Week"
    },
    {
      id: "t-303",
      title: "Collect usage metrics for Beacon renewal",
      customer: "Beacon Capital",
      assignee: "Ava Patel",
      priority: "High",
      status: "Blocked",
      dueDate: "2026-06-05",
      lane: "Today"
    },
    {
      id: "t-304",
      title: "Book implementation call with Luma Freight",
      customer: "Luma Freight",
      assignee: "Jade Carter",
      priority: "Low",
      status: "Open",
      dueDate: "2026-06-10",
      lane: "This Week"
    },
    {
      id: "t-305",
      title: "Audit overdue invoices and send reminders",
      customer: "Multiple",
      assignee: "Mina Ross",
      priority: "Medium",
      status: "Done",
      dueDate: "2026-06-04",
      lane: "Completed"
    },
    {
      id: "t-306",
      title: "Design demo script for Orbit webinar",
      customer: "Orbit Education",
      assignee: "Miles Nguyen",
      priority: "Low",
      status: "In Progress",
      dueDate: "2026-06-08",
      lane: "This Week"
    }
  ],
  invoices: [
    {
      id: "inv-401",
      company: "Northstar Labs",
      amount: 3600,
      dueDate: "2026-06-11",
      status: "Paid"
    },
    {
      id: "inv-402",
      company: "Aster Retail",
      amount: 8200,
      dueDate: "2026-06-06",
      status: "Pending"
    },
    {
      id: "inv-403",
      company: "Beacon Capital",
      amount: 11400,
      dueDate: "2026-06-03",
      status: "Overdue"
    },
    {
      id: "inv-404",
      company: "Orbit Education",
      amount: 1800,
      dueDate: "2026-06-18",
      status: "Pending"
    },
    {
      id: "inv-405",
      company: "Luma Freight",
      amount: 1200,
      dueDate: "2026-06-01",
      status: "Paid"
    }
  ],
  activity: [
    {
      id: "a-501",
      actor: "Elena Torres",
      text: "Closed expansion notes with Northstar and scheduled the rollout workshop.",
      time: "12 min ago"
    },
    {
      id: "a-502",
      actor: "Ava Patel",
      text: "Tagged Beacon renewal as at-risk after support escalations.",
      time: "39 min ago"
    },
    {
      id: "a-503",
      actor: "Mina Ross",
      text: "Recovered two invoices and cleared $9.4k in pending revenue.",
      time: "1 hr ago"
    },
    {
      id: "a-504",
      actor: "Miles Nguyen",
      text: "Added demo notes for Orbit Education webinar flow.",
      time: "2 hr ago"
    }
  ]
};
