/**
 * Operating Systems Complete Curriculum
 * Neo4j-ready structure with comprehensive learning path
 */

export const OS_CURRICULUM = {
  subject: "Operating Systems",
  description: "Complete operating systems fundamentals and advanced concepts",

  nodes: [
    // Foundation Layer
    {
      id: 'os-intro',
      label: 'OS Introduction',
      description: 'What is an operating system and its role in computer systems',
      level: 1,
      prereqs: [],
      domain: 'Foundation',
      x: 100,
      y: 200,
      videos: [
        {
          title: 'Introduction to Operating Systems',
          url: 'https://www.youtube.com/watch?v=vBURTt97EkA',
          duration: '15:23',
          channel: 'Neso Academy'
        },
        {
          title: 'Operating System Basics',
          url: 'https://www.youtube.com/watch?v=26QPDBe-NB8',
          duration: '12:45',
          channel: 'Computerphile'
        }
      ],
      topics: [
        'Definition and Purpose',
        'OS Components',
        'System Calls',
        'OS Structure'
      ],
      difficulty: 'beginner'
    },
    {
      id: 'os-types',
      label: 'Types of OS',
      description: 'Different operating system types and their characteristics',
      level: 1,
      prereqs: ['os-intro'],
      domain: 'Foundation',
      x: 300,
      y: 200,
      videos: [
        {
          title: 'Types of Operating Systems',
          url: 'https://www.youtube.com/watch?v=kIlZ7kP3FAc',
          duration: '10:30',
          channel: 'Gate Smashers'
        }
      ],
      topics: [
        'Batch Systems',
        'Time-Sharing Systems',
        'Real-Time Systems',
        'Distributed Systems',
        'Mobile OS'
      ],
      difficulty: 'beginner'
    },

    // Process Management Layer
    {
      id: 'process-concept',
      label: 'Process Concept',
      description: 'Understanding processes, threads, and their lifecycle',
      level: 2,
      prereqs: ['os-intro', 'os-types'],
      domain: 'Process Management',
      x: 500,
      y: 150,
      videos: [
        {
          title: 'Process Management in OS',
          url: 'https://www.youtube.com/watch?v=OrM7nZcxXZU',
          duration: '18:42',
          channel: 'Neso Academy'
        },
        {
          title: 'Process States and PCB',
          url: 'https://www.youtube.com/watch?v=jZ_6PXoaoxo',
          duration: '14:15',
          channel: 'Gate Smashers'
        }
      ],
      topics: [
        'Process vs Program',
        'Process States',
        'Process Control Block (PCB)',
        'Context Switching'
      ],
      difficulty: 'intermediate'
    },
    {
      id: 'cpu-scheduling',
      label: 'CPU Scheduling',
      description: 'CPU scheduling algorithms and policies',
      level: 2,
      prereqs: ['process-concept'],
      domain: 'Process Management',
      x: 700,
      y: 150,
      videos: [
        {
          title: 'CPU Scheduling Algorithms',
          url: 'https://www.youtube.com/watch?v=EWkQl0n0w5M',
          duration: '25:30',
          channel: 'Neso Academy'
        },
        {
          title: 'FCFS, SJF, Round Robin',
          url: 'https://www.youtube.com/watch?v=zFnrUVqtiOY',
          duration: '20:15',
          channel: 'Gate Smashers'
        }
      ],
      topics: [
        'FCFS Scheduling',
        'SJF Scheduling',
        'Priority Scheduling',
        'Round Robin',
        'Multilevel Queue'
      ],
      difficulty: 'intermediate'
    },
    {
      id: 'threads',
      label: 'Threads',
      description: 'Multithreading concepts and implementation',
      level: 2,
      prereqs: ['process-concept'],
      domain: 'Process Management',
      x: 500,
      y: 300,
      videos: [
        {
          title: 'Threads in Operating System',
          url: 'https://www.youtube.com/watch?v=LOfGJcVnvAk',
          duration: '16:20',
          channel: 'Neso Academy'
        },
        {
          title: 'User Level vs Kernel Level Threads',
          url: 'https://www.youtube.com/watch?v=aU4ZHb0SEog',
          duration: '12:40',
          channel: 'Gate Smashers'
        }
      ],
      topics: [
        'Thread Basics',
        'User vs Kernel Threads',
        'Multithreading Models',
        'Thread Libraries'
      ],
      difficulty: 'intermediate'
    },

    // Synchronization Layer
    {
      id: 'process-sync',
      label: 'Process Synchronization',
      description: 'Critical section problem and synchronization mechanisms',
      level: 3,
      prereqs: ['threads'],
      domain: 'Synchronization',
      x: 700,
      y: 300,
      videos: [
        {
          title: 'Process Synchronization',
          url: 'https://www.youtube.com/watch?v=ph2awKa8r5Y',
          duration: '22:10',
          channel: 'Neso Academy'
        },
        {
          title: 'Critical Section Problem',
          url: 'https://www.youtube.com/watch?v=eKKc0d0kzZw',
          duration: '15:30',
          channel: 'Gate Smashers'
        }
      ],
      topics: [
        'Critical Section Problem',
        'Petersons Solution',
        'Semaphores',
        'Mutex',
        'Monitors'
      ],
      difficulty: 'advanced'
    },
    {
      id: 'deadlocks',
      label: 'Deadlocks',
      description: 'Deadlock detection, prevention, and avoidance',
      level: 3,
      prereqs: ['process-sync'],
      domain: 'Synchronization',
      x: 900,
      y: 300,
      videos: [
        {
          title: 'Deadlock in Operating System',
          url: 'https://www.youtube.com/watch?v=UVo9mGARkhQ',
          duration: '24:50',
          channel: 'Neso Academy'
        },
        {
          title: 'Bankers Algorithm',
          url: 'https://www.youtube.com/watch?v=bx6V-PgoMyI',
          duration: '18:25',
          channel: 'Gate Smashers'
        }
      ],
      topics: [
        'Deadlock Conditions',
        'Deadlock Prevention',
        'Deadlock Avoidance',
        'Bankers Algorithm',
        'Deadlock Detection'
      ],
      difficulty: 'advanced'
    },

    // Memory Management Layer
    {
      id: 'memory-management',
      label: 'Memory Management',
      description: 'Memory allocation, paging, and segmentation',
      level: 3,
      prereqs: ['cpu-scheduling'],
      domain: 'Memory',
      x: 900,
      y: 150,
      videos: [
        {
          title: 'Memory Management in OS',
          url: 'https://www.youtube.com/watch?v=qdkxXygc3rE',
          duration: '28:15',
          channel: 'Neso Academy'
        },
        {
          title: 'Paging and Segmentation',
          url: 'https://www.youtube.com/watch?v=pJ6qrCB8pDw',
          duration: '22:30',
          channel: 'Gate Smashers'
        }
      ],
      topics: [
        'Logical vs Physical Address',
        'Contiguous Allocation',
        'Paging',
        'Segmentation',
        'Virtual Memory'
      ],
      difficulty: 'advanced'
    },
    {
      id: 'virtual-memory',
      label: 'Virtual Memory',
      description: 'Page replacement algorithms and demand paging',
      level: 4,
      prereqs: ['memory-management'],
      domain: 'Memory',
      x: 1100,
      y: 150,
      videos: [
        {
          title: 'Virtual Memory in OS',
          url: 'https://www.youtube.com/watch?v=qeXgjLnWJVo',
          duration: '26:40',
          channel: 'Neso Academy'
        },
        {
          title: 'Page Replacement Algorithms',
          url: 'https://www.youtube.com/watch?v=16kaPQtYo1o',
          duration: '20:15',
          channel: 'Gate Smashers'
        }
      ],
      topics: [
        'Demand Paging',
        'Page Replacement',
        'FIFO Algorithm',
        'LRU Algorithm',
        'Optimal Algorithm',
        'Thrashing'
      ],
      difficulty: 'advanced'
    },

    // Storage Layer
    {
      id: 'file-systems',
      label: 'File Systems',
      description: 'File system structure, implementation, and management',
      level: 4,
      prereqs: ['memory-management'],
      domain: 'Storage',
      x: 1100,
      y: 300,
      videos: [
        {
          title: 'File System in Operating System',
          url: 'https://www.youtube.com/watch?v=mzUyMy7Ihk0',
          duration: '24:20',
          channel: 'Neso Academy'
        },
        {
          title: 'File Allocation Methods',
          url: 'https://www.youtube.com/watch?v=S7cQ_XYwZ_I',
          duration: '18:45',
          channel: 'Gate Smashers'
        }
      ],
      topics: [
        'File Concept',
        'Directory Structure',
        'File Allocation Methods',
        'Free Space Management',
        'Disk Scheduling'
      ],
      difficulty: 'advanced'
    },
    {
      id: 'io-systems',
      label: 'I/O Systems',
      description: 'I/O hardware, software, and device management',
      level: 4,
      prereqs: ['file-systems'],
      domain: 'Storage',
      x: 1300,
      y: 300,
      videos: [
        {
          title: 'I/O Systems',
          url: 'https://www.youtube.com/watch?v=F18RiREDkwE',
          duration: '19:30',
          channel: 'Neso Academy'
        }
      ],
      topics: [
        'I/O Hardware',
        'I/O Software Layers',
        'Disk Scheduling',
        'RAID Levels'
      ],
      difficulty: 'advanced'
    }
  ]
};

// Quizzes for each topic
export const OS_QUIZZES = {
  'os-intro': [
    {
      question: "What is the primary purpose of an operating system?",
      options: [
        "To compile programs",
        "To manage computer hardware and software resources",
        "To provide internet connectivity",
        "To create applications"
      ],
      correct: 1,
      explanation: "The OS acts as an intermediary between users and hardware, managing all resources."
    },
    {
      question: "Which of the following is NOT a function of an OS?",
      options: [
        "Process Management",
        "Memory Management",
        "Code Compilation",
        "File Management"
      ],
      correct: 2,
      explanation: "Code compilation is done by compilers, not the OS itself."
    },
    {
      question: "What is a system call?",
      options: [
        "A phone call to technical support",
        "An interface between a process and the OS",
        "A method to shut down the system",
        "A bug in the system"
      ],
      correct: 1,
      explanation: "System calls provide an interface for processes to request services from the OS kernel."
    }
  ],
  'os-types': [
    {
      question: "Which type of operating system allows multiple users to access a computer system simultaneously?",
      options: [
        "Single-user OS",
        "Batch OS",
        "Multi-user OS",
        "Embedded OS"
      ],
      correct: 2,
      explanation: "A multi-user operating system allows multiple users to share system resources at the same time."
    },
    {
      question: "Which operating system is designed to meet strict timing constraints?",
      options: [
        "Distributed OS",
        "Real-Time OS",
        "Time-Sharing OS",
        "Network OS"
      ],
      correct: 1,
      explanation: "A Real-Time OS guarantees response within a specified time limit."
    },
    {
      question: "Which OS type executes jobs in groups without user interaction?",
      options: [
        "Time-sharing OS",
        "Batch OS",
        "Real-time OS",
        "Mobile OS"
      ],
      correct: 1,
      explanation: "Batch operating systems process jobs in batches without direct user involvement."
    }
  ],

  'threads': [
    {
      question: "What is a thread?",
      options: [
        "A lightweight process",
        "A program in execution",
        "A CPU scheduling algorithm",
        "A system call"
      ],
      correct: 0,
      explanation: "Threads are lightweight processes that share the same address space of a process."
    },
    {
      question: "Which of the following is shared among threads of the same process?",
      options: [
        "Stack",
        "Registers",
        "Program Counter",
        "Address Space"
      ],
      correct: 3,
      explanation: "Threads share the same address space but have separate stacks and registers."
    },
    {
      question: "Which model maps many user threads to one kernel thread?",
      options: [
        "One-to-One",
        "Many-to-One",
        "Many-to-Many",
        "Two-level"
      ],
      correct: 1,
      explanation: "In the many-to-one model, many user-level threads are mapped to a single kernel thread."
    }
  ],

  'process-sync': [
    {
      question: "What is the main purpose of process synchronization?",
      options: [
        "Increase CPU speed",
        "Avoid deadlock",
        "Ensure correct execution of concurrent processes",
        "Improve memory utilization"
      ],
      correct: 2,
      explanation: "Synchronization ensures data consistency when multiple processes access shared resources."
    },
    {
      question: "Which synchronization primitive uses busy waiting?",
      options: [
        "Semaphore",
        "Mutex",
        "Spinlock",
        "Monitor"
      ],
      correct: 2,
      explanation: "Spinlocks repeatedly check for availability, resulting in busy waiting."
    },
    {
      question: "Which problem demonstrates the need for synchronization?",
      options: [
        "Paging problem",
        "Dining Philosophers problem",
        "File allocation problem",
        "Disk scheduling problem"
      ],
      correct: 1,
      explanation: "The Dining Philosophers problem illustrates synchronization and deadlock issues."
    }
  ],

  'memory-management': [
    {
      question: "What is the main function of memory management?",
      options: [
        "Scheduling processes",
        "Managing secondary storage",
        "Tracking and allocating memory",
        "Handling I/O devices"
      ],
      correct: 2,
      explanation: "Memory management allocates, deallocates, and tracks memory usage efficiently."
    },
    {
      question: "Which technique divides memory into fixed-size blocks?",
      options: [
        "Segmentation",
        "Paging",
        "Swapping",
        "Compaction"
      ],
      correct: 1,
      explanation: "Paging divides memory into fixed-size pages and frames."
    },
    {
      question: "Which problem is caused by variable-sized memory allocation?",
      options: [
        "Deadlock",
        "Thrashing",
        "External fragmentation",
        "Internal fragmentation"
      ],
      correct: 2,
      explanation: "External fragmentation occurs when free memory is scattered in small blocks."
    }
  ],

  'file-systems': [
    {
      question: "What is the main purpose of a file system?",
      options: [
        "Process scheduling",
        "Memory allocation",
        "Organizing and storing data",
        "Managing CPU registers"
      ],
      correct: 2,
      explanation: "A file system provides a structured way to store and retrieve data."
    },
    {
      question: "Which file allocation method supports direct access?",
      options: [
        "Contiguous allocation",
        "Linked allocation",
        "Indexed allocation",
        "Sequential allocation"
      ],
      correct: 2,
      explanation: "Indexed allocation allows direct access using an index block."
    },
    {
      question: "Which structure maintains information about files?",
      options: [
        "File descriptor",
        "Directory",
        "Page table",
        "Inode"
      ],
      correct: 3,
      explanation: "An inode stores metadata about a file such as size, permissions, and location."
    }
  ],

  'virtual-memory': [
    {
      question: "What is virtual memory?",
      options: [
        "Memory inside the CPU",
        "An illusion of large memory using secondary storage",
        "Cache memory",
        "Read-only memory"
      ],
      correct: 1,
      explanation: "Virtual memory uses disk space to extend the apparent size of main memory."
    },
    {
      question: "Which technique is used to implement virtual memory?",
      options: [
        "Segmentation",
        "Paging",
        "Swapping",
        "All of the above"
      ],
      correct: 3,
      explanation: "Virtual memory can be implemented using paging, segmentation, or a combination."
    },
    {
      question: "What is thrashing?",
      options: [
        "Excessive CPU usage",
        "High disk fragmentation",
        "Excessive paging activity",
        "Memory leakage"
      ],
      correct: 2,
      explanation: "Thrashing occurs when the system spends more time paging than executing processes."
    }
  ],

  'io-systems': [
    {
      question: "What is the primary goal of an I/O system?",
      options: [
        "Speed up CPU execution",
        "Manage communication between devices and memory",
        "Manage files",
        "Schedule processes"
      ],
      correct: 1,
      explanation: "I/O systems handle data transfer between devices and main memory."
    },
    {
      question: "Which technique allows CPU and I/O devices to work concurrently?",
      options: [
        "Polling",
        "Programmed I/O",
        "Interrupt-driven I/O",
        "Busy waiting"
      ],
      correct: 2,
      explanation: "Interrupt-driven I/O allows the CPU to perform other tasks while waiting for I/O."
    },
    {
      question: "Which hardware component directly controls I/O devices?",
      options: [
        "CPU",
        "DMA controller",
        "Device controller",
        "Cache"
      ],
      correct: 2,
      explanation: "Device controllers manage specific I/O devices and communicate with the OS."
    }
  ],
  'process-concept': [
    {
      question: "What is the difference between a process and a program?",
      options: [
        "There is no difference",
        "A process is a program in execution",
        "A program is faster than a process",
        "A process is stored on disk"
      ],
      correct: 1,
      explanation: "A program is passive (code on disk), while a process is active (program in execution)."
    },
    {
      question: "Which process state indicates the process is waiting for I/O?",
      options: [
        "Running",
        "Ready",
        "Waiting/Blocked",
        "Terminated"
      ],
      correct: 2,
      explanation: "Waiting or Blocked state means the process is waiting for some event like I/O completion."
    }
  ],
  'cpu-scheduling': [
    {
      question: "Which scheduling algorithm may cause starvation?",
      options: [
        "Round Robin",
        "FCFS",
        "Priority Scheduling",
        "All of the above"
      ],
      correct: 2,
      explanation: "Priority scheduling can cause starvation where low-priority processes never execute."
    },
    {
      question: "What is the time quantum in Round Robin scheduling?",
      options: [
        "The total execution time",
        "A small fixed time slice",
        "The arrival time",
        "The burst time"
      ],
      correct: 1,
      explanation: "Time quantum is a small fixed time period after which the process is preempted."
    }
  ],
  'deadlocks': [
    {
      question: "Which is NOT a condition for deadlock?",
      options: [
        "Mutual Exclusion",
        "Hold and Wait",
        "Preemption",
        "Circular Wait"
      ],
      correct: 2,
      explanation: "The four conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait."
    },
    {
      question: "What does the Banker's Algorithm do?",
      options: [
        "Detects deadlocks",
        "Prevents deadlocks by avoiding unsafe states",
        "Recovers from deadlocks",
        "Ignores deadlocks"
      ],
      correct: 1,
      explanation: "Banker's Algorithm is a deadlock avoidance algorithm that ensures the system stays in a safe state."
    }
  ],
  'virtual-memory': [
    {
      question: "What is thrashing?",
      options: [
        "Fast page replacement",
        "Excessive paging activity",
        "Memory overflow",
        "CPU overheating"
      ],
      correct: 1,
      explanation: "Thrashing occurs when the system spends more time swapping pages than executing processes."
    },
    {
      question: "Which page replacement algorithm is optimal but not practical?",
      options: [
        "FIFO",
        "LRU",
        "Optimal Page Replacement",
        "Clock Algorithm"
      ],
      correct: 2,
      explanation: "Optimal algorithm replaces the page that won't be used for the longest time - requires future knowledge."
    }
  ]
};

// Practical exercises
export const OS_EXERCISES = {
  'os-intro': [
    {
      title: "Identify OS Components",
      description: "List the core components of an operating system and explain their primary functions.",
      input: "None",
      difficulty: "beginner"
    }
  ],
  'os-types': [
    {
      title: "Classify OS Scenarios",
      description: "Given a list of computing scenarios (e.g., flight control, payroll processing), identify the most suitable type of OS.",
      input: "Scenario: Air Traffic Control System",
      expectedOutput: "Real-Time OS",
      difficulty: "beginner"
    }
  ],
  'process-concept': [
    {
      title: "Process State Diagram",
      description: "Draw the process state transition diagram and label all valid transitions.",
      difficulty: "beginner"
    },
    {
      title: "Context Switch Overhead",
      description: "Calculate the effective CPU utilization given context switch time and average burst time.",
      difficulty: "intermediate"
    }
  ],
  'cpu-scheduling': [
    {
      title: "Calculate Average Waiting Time",
      description: "Given processes with arrival and burst times, calculate average waiting time using FCFS.",
      input: "P1(AT=0, BT=4), P2(AT=1, BT=3), P3(AT=2, BT=1)",
      expectedOutput: "Average Waiting Time: 3.33",
      difficulty: "medium"
    },
    {
      title: "Round Robin Gantt Chart",
      description: "Draw a Gantt chart for the given processes using Round Robin scheduling with Quantum=2.",
      input: "P1(4), P2(3), P3(2)",
      difficulty: "intermediate"
    }
  ],
  'threads': [
    {
      title: "Amdaul's Law Calculation",
      description: "Calculate the speedup of a program using N threads given the parallelizable portion P.",
      input: "P=0.6, N=4",
      difficulty: "intermediate"
    }
  ],
  'process-sync': [
    {
      title: "Producer-Consumer Problem",
      description: "Implement a solution to the Producer-Consumer problem using semaphores to ensure mutual exclusion and prevent buffer overflow/underflow.",
      difficulty: "advanced"
    },
    {
      title: "Dining Philosophers",
      description: "Propose a solution to the Dining Philosophers problem that avoids deadlock.",
      difficulty: "advanced"
    }
  ],
  'deadlocks': [
    {
      title: "Detect Circular Wait",
      description: "Given a resource allocation graph, determine if a deadlock exists.",
      difficulty: "hard"
    },
    {
      title: "Banker's Algorithm Safety Check",
      description: "Given the Available, Max, and Allocation matrices, determine if the system is in a safe state.",
      difficulty: "hard"
    }
  ],
  'memory-management': [
    {
      title: "Calculate Page Faults (LRU)",
      description: "Simulate page replacement using LRU algorithm for a given reference string.",
      input: "Reference String: 7,0,1,2,0,3,0,4,2,3",
      difficulty: "medium"
    },
    {
      title: "Fragmentation Analysis",
      description: "Calculate internal and external fragmentation for a given sequence of memory allocations.",
      difficulty: "advanced"
    }
  ],
  'virtual-memory': [
    {
      title: "Calculate Effective Access Time",
      description: "Calculate EAT given memory access time, page fault rate, and page fault service time.",
      input: "MAT=100ns, Page Fault Rate=0.02%, Service Time=8ms",
      difficulty: "advanced"
    }
  ],
  'file-systems': [
    {
      title: "Disk Space Allocation",
      description: "Compare contiguous, linked, and indexed allocation methods for a specific file growth scenario.",
      difficulty: "intermediate"
    }
  ],
  'io-systems': [
    {
      title: "Disk Scheduling Patterns",
      description: "Calculate total head movement for SSTF, SCAN, and C-SCAN algorithms.",
      input: "Request Queue: 98, 183, 37, 122, 14, 124, 65, 67; Head starts at 53.",
      difficulty: "advanced"
    }
  ]
};
