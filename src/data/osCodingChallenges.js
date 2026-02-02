/**
 * Operating Systems Coding Challenges
 * Curated hands-on programming exercises with solutions
 * 
 * Each challenge includes:
 * - Problem statement
 * - Starter code with function to implement
 * - Test cases with input/expectedOutput
 * - Solution with explanation
 * - Hints for progressive learning
 */

export const OS_CODING_CHALLENGES = {
  // ==================== PROCESS MANAGEMENT ====================
  'process-concept': [
    {
      id: 'proc-1',
      title: 'Process State Simulator',
      difficulty: 'easy',
      points: 50,
      description: `Simulate process state transitions in an operating system.

A process can be in one of these states: NEW, READY, RUNNING, WAITING, TERMINATED.

Implement a function that takes a list of events and returns the final state of a process.

Events and their transitions:
• "admit" : NEW → READY
• "dispatch" : READY → RUNNING  
• "interrupt" : RUNNING → READY
• "io_wait" : RUNNING → WAITING
• "io_complete" : WAITING → READY
• "exit" : RUNNING → TERMINATED

The process always starts in the NEW state. Invalid transitions should be ignored.`,
      starterCode: `function simulateProcess(events) {
  // Start state is always NEW
  let state = 'NEW';
  
  // TODO: Process each event and update the state
  // Handle transitions: admit, dispatch, interrupt, io_wait, io_complete, exit
  
  return state;
}

// Return the result for testing
return simulateProcess(input);`,
      solution: `function simulateProcess(events) {
  let state = 'NEW';
  
  const transitions = {
    'NEW': { 'admit': 'READY' },
    'READY': { 'dispatch': 'RUNNING' },
    'RUNNING': { 
      'interrupt': 'READY', 
      'io_wait': 'WAITING', 
      'exit': 'TERMINATED' 
    },
    'WAITING': { 'io_complete': 'READY' },
    'TERMINATED': {}
  };
  
  for (const event of events) {
    if (transitions[state] && transitions[state][event]) {
      state = transitions[state][event];
    }
  }
  
  return state;
}

return simulateProcess(input);`,
      explanation: `This solution uses a state machine approach:

1. Define all valid state transitions in a nested object
2. For each event, check if it's a valid transition from the current state
3. If valid, update the state; otherwise, ignore the event
4. Return the final state after processing all events

Time Complexity: O(n) where n = number of events
Space Complexity: O(1) for the transition table`,
      hints: [
        'Think of this as a finite state machine (FSM)',
        'Use an object/dictionary to map current states to possible transitions',
        'Handle invalid transitions gracefully by ignoring them'
      ],
      testCases: [
        { 
          input: ['admit', 'dispatch', 'exit'], 
          expectedOutput: 'TERMINATED',
          description: 'Basic process lifecycle'
        },
        { 
          input: ['admit', 'dispatch', 'io_wait', 'io_complete', 'dispatch', 'exit'], 
          expectedOutput: 'TERMINATED',
          description: 'Process with I/O wait'
        },
        { 
          input: ['admit', 'dispatch', 'interrupt'], 
          expectedOutput: 'READY',
          description: 'Process interrupted'
        },
        { 
          input: ['admit'], 
          expectedOutput: 'READY',
          description: 'Process admitted only'
        },
        { 
          input: [], 
          expectedOutput: 'NEW',
          description: 'No events - stays in NEW'
        }
      ]
    },
    {
      id: 'proc-2',
      title: 'Calculate Turnaround Time',
      difficulty: 'easy',
      points: 50,
      description: `Calculate the turnaround time for processes.

Turnaround Time = Completion Time - Arrival Time

Given an array of process objects with arrivalTime and completionTime, 
return an array of turnaround times in the same order.

Example:
Input: [{ arrivalTime: 0, completionTime: 10 }, { arrivalTime: 2, completionTime: 15 }]
Output: [10, 13]`,
      starterCode: `function calculateTurnaroundTime(processes) {
  // TODO: Calculate turnaround time for each process
  // Turnaround Time = Completion Time - Arrival Time
  
  return [];
}

return calculateTurnaroundTime(input);`,
      solution: `function calculateTurnaroundTime(processes) {
  return processes.map(p => p.completionTime - p.arrivalTime);
}

return calculateTurnaroundTime(input);`,
      explanation: `Simple calculation for each process:
- Turnaround Time measures total time from arrival to completion
- Formula: TAT = CT - AT
- Use map() to transform each process into its turnaround time`,
      hints: [
        'Use the map() function to transform the array',
        'For each process, subtract arrivalTime from completionTime',
        'Return the new array of calculated values'
      ],
      testCases: [
        {
          input: [{ arrivalTime: 0, completionTime: 10 }],
          expectedOutput: [10],
          description: 'Single process'
        },
        {
          input: [
            { arrivalTime: 0, completionTime: 10 },
            { arrivalTime: 2, completionTime: 15 }
          ],
          expectedOutput: [10, 13],
          description: 'Two processes'
        },
        {
          input: [
            { arrivalTime: 0, completionTime: 5 },
            { arrivalTime: 1, completionTime: 8 },
            { arrivalTime: 2, completionTime: 12 }
          ],
          expectedOutput: [5, 7, 10],
          description: 'Three processes'
        }
      ]
    }
  ],

  // ==================== CPU SCHEDULING ====================
  'cpu-scheduling': [
    {
      id: 'sched-1',
      title: 'FCFS Scheduler',
      difficulty: 'medium',
      points: 100,
      description: `Implement First-Come-First-Served (FCFS) CPU scheduling.

Given an array of processes with arrivalTime and burstTime, 
calculate the completion time, turnaround time, and waiting time for each process.

Return an object with:
- completionTimes: array of completion times
- turnaroundTimes: array of turnaround times  
- waitingTimes: array of waiting times
- avgWaitingTime: average waiting time

Processes are executed in order of arrival time.`,
      starterCode: `function fcfsScheduling(processes) {
  // processes = [{ arrivalTime, burstTime }, ...]
  
  // Sort by arrival time
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const completionTimes = [];
  const turnaroundTimes = [];
  const waitingTimes = [];
  
  let currentTime = 0;
  
  // TODO: Calculate completion, turnaround, and waiting times
  // for each process in arrival order
  
  const avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length;
  
  return {
    completionTimes,
    turnaroundTimes,
    waitingTimes,
    avgWaitingTime: Math.round(avgWaitingTime * 100) / 100
  };
}

return fcfsScheduling(input);`,
      solution: `function fcfsScheduling(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const completionTimes = [];
  const turnaroundTimes = [];
  const waitingTimes = [];
  
  let currentTime = 0;
  
  for (const process of sorted) {
    // CPU might be idle if process hasn't arrived yet
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }
    
    // Process executes for its burst time
    currentTime += process.burstTime;
    
    const completionTime = currentTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    
    completionTimes.push(completionTime);
    turnaroundTimes.push(turnaroundTime);
    waitingTimes.push(waitingTime);
  }
  
  const avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length;
  
  return {
    completionTimes,
    turnaroundTimes,
    waitingTimes,
    avgWaitingTime: Math.round(avgWaitingTime * 100) / 100
  };
}

return fcfsScheduling(input);`,
      explanation: `FCFS Algorithm:
1. Sort processes by arrival time
2. For each process:
   - If CPU is idle (currentTime < arrivalTime), wait until process arrives
   - Execute process for its burst time
   - Calculate: CT = currentTime, TAT = CT - AT, WT = TAT - BT
3. Calculate average waiting time`,
      hints: [
        'Sort processes by arrival time first',
        'Track current time as you schedule each process',
        'Handle CPU idle time when next process hasn\'t arrived',
        'Turnaround = Completion - Arrival, Waiting = Turnaround - Burst'
      ],
      testCases: [
        {
          input: [
            { arrivalTime: 0, burstTime: 5 },
            { arrivalTime: 1, burstTime: 3 },
            { arrivalTime: 2, burstTime: 2 }
          ],
          expectedOutput: {
            completionTimes: [5, 8, 10],
            turnaroundTimes: [5, 7, 8],
            waitingTimes: [0, 4, 6],
            avgWaitingTime: 3.33
          },
          description: 'Three processes with no gaps'
        },
        {
          input: [
            { arrivalTime: 0, burstTime: 4 },
            { arrivalTime: 2, burstTime: 3 }
          ],
          expectedOutput: {
            completionTimes: [4, 7],
            turnaroundTimes: [4, 5],
            waitingTimes: [0, 2],
            avgWaitingTime: 1
          },
          description: 'Two overlapping processes'
        }
      ]
    },
    {
      id: 'sched-2',
      title: 'SJF Scheduler (Non-Preemptive)',
      difficulty: 'medium',
      points: 100,
      description: `Implement Shortest Job First (SJF) non-preemptive scheduling.

At each scheduling decision point, select the process with shortest burst time 
among those that have arrived.

Given an array of processes with arrivalTime and burstTime,
return an object with:
- executionOrder: array of process indices in execution order
- avgWaitingTime: average waiting time`,
      starterCode: `function sjfScheduling(processes) {
  const n = processes.length;
  const executionOrder = [];
  const completed = new Array(n).fill(false);
  const waitingTimes = new Array(n).fill(0);
  
  let currentTime = 0;
  let completedCount = 0;
  
  while (completedCount < n) {
    // TODO: Find the shortest job among arrived processes
    // Execute it, update waiting times
    // Track execution order
  }
  
  const avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / n;
  
  return {
    executionOrder,
    avgWaitingTime: Math.round(avgWaitingTime * 100) / 100
  };
}

return sjfScheduling(input);`,
      solution: `function sjfScheduling(processes) {
  const n = processes.length;
  const executionOrder = [];
  const completed = new Array(n).fill(false);
  const waitingTimes = new Array(n).fill(0);
  
  let currentTime = 0;
  let completedCount = 0;
  
  while (completedCount < n) {
    // Find shortest job among arrived processes
    let shortestIdx = -1;
    let shortestBurst = Infinity;
    
    for (let i = 0; i < n; i++) {
      if (!completed[i] && 
          processes[i].arrivalTime <= currentTime &&
          processes[i].burstTime < shortestBurst) {
        shortestBurst = processes[i].burstTime;
        shortestIdx = i;
      }
    }
    
    if (shortestIdx === -1) {
      // No process available, advance time
      currentTime++;
      continue;
    }
    
    // Execute the process
    waitingTimes[shortestIdx] = currentTime - processes[shortestIdx].arrivalTime;
    currentTime += processes[shortestIdx].burstTime;
    completed[shortestIdx] = true;
    executionOrder.push(shortestIdx);
    completedCount++;
  }
  
  const avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / n;
  
  return {
    executionOrder,
    avgWaitingTime: Math.round(avgWaitingTime * 100) / 100
  };
}

return sjfScheduling(input);`,
      explanation: `SJF Non-Preemptive Algorithm:
1. At each decision point, find all processes that have arrived
2. Select the one with shortest burst time
3. Execute it completely (non-preemptive)
4. Repeat until all processes complete

This minimizes average waiting time for non-preemptive scheduling.`,
      hints: [
        'Track which processes are completed',
        'At each step, only consider processes that have arrived',
        'Among arrived processes, pick the one with shortest burst',
        'Handle the case when no process has arrived yet'
      ],
      testCases: [
        {
          input: [
            { arrivalTime: 0, burstTime: 6 },
            { arrivalTime: 0, burstTime: 2 },
            { arrivalTime: 0, burstTime: 4 }
          ],
          expectedOutput: {
            executionOrder: [1, 2, 0],
            avgWaitingTime: 4
          },
          description: 'All arrive at time 0'
        },
        {
          input: [
            { arrivalTime: 0, burstTime: 7 },
            { arrivalTime: 2, burstTime: 4 },
            { arrivalTime: 4, burstTime: 1 }
          ],
          expectedOutput: {
            executionOrder: [0, 2, 1],
            avgWaitingTime: 3
          },
          description: 'Staggered arrivals'
        }
      ]
    },
    {
      id: 'sched-3',
      title: 'Priority Scheduler',
      difficulty: 'medium',
      points: 100,
      description: `Implement Priority-based CPU scheduling (non-preemptive).

Lower priority number = Higher priority (1 is highest).

Given processes with arrivalTime, burstTime, and priority,
schedule them based on priority among arrived processes.

Return:
- executionOrder: array of process indices
- avgWaitingTime: average waiting time`,
      starterCode: `function priorityScheduling(processes) {
  const n = processes.length;
  const executionOrder = [];
  const completed = new Array(n).fill(false);
  const waitingTimes = new Array(n).fill(0);
  
  let currentTime = 0;
  let completedCount = 0;
  
  while (completedCount < n) {
    // TODO: Find highest priority process among arrived
    // (lower priority number = higher priority)
  }
  
  const avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / n;
  
  return {
    executionOrder,
    avgWaitingTime: Math.round(avgWaitingTime * 100) / 100
  };
}

return priorityScheduling(input);`,
      solution: `function priorityScheduling(processes) {
  const n = processes.length;
  const executionOrder = [];
  const completed = new Array(n).fill(false);
  const waitingTimes = new Array(n).fill(0);
  
  let currentTime = 0;
  let completedCount = 0;
  
  while (completedCount < n) {
    let selectedIdx = -1;
    let highestPriority = Infinity;
    
    for (let i = 0; i < n; i++) {
      if (!completed[i] && 
          processes[i].arrivalTime <= currentTime &&
          processes[i].priority < highestPriority) {
        highestPriority = processes[i].priority;
        selectedIdx = i;
      }
    }
    
    if (selectedIdx === -1) {
      currentTime++;
      continue;
    }
    
    waitingTimes[selectedIdx] = currentTime - processes[selectedIdx].arrivalTime;
    currentTime += processes[selectedIdx].burstTime;
    completed[selectedIdx] = true;
    executionOrder.push(selectedIdx);
    completedCount++;
  }
  
  const avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / n;
  
  return {
    executionOrder,
    avgWaitingTime: Math.round(avgWaitingTime * 100) / 100
  };
}

return priorityScheduling(input);`,
      explanation: `Priority Scheduling:
- Similar to SJF but uses priority instead of burst time
- Lower number = higher priority
- Select highest priority process among arrived processes
- Execute it completely, then make next decision`,
      hints: [
        'Similar logic to SJF, but compare priorities instead of burst times',
        'Remember: lower priority number means higher priority',
        'Handle ties consistently (e.g., first come)'
      ],
      testCases: [
        {
          input: [
            { arrivalTime: 0, burstTime: 4, priority: 2 },
            { arrivalTime: 0, burstTime: 3, priority: 1 },
            { arrivalTime: 0, burstTime: 5, priority: 3 }
          ],
          expectedOutput: {
            executionOrder: [1, 0, 2],
            avgWaitingTime: 4
          },
          description: 'All arrive at time 0'
        },
        {
          input: [
            { arrivalTime: 0, burstTime: 5, priority: 3 },
            { arrivalTime: 1, burstTime: 2, priority: 1 }
          ],
          expectedOutput: {
            executionOrder: [0, 1],
            avgWaitingTime: 2
          },
          description: 'High priority arrives late'
        }
      ]
    }
  ],

  // ==================== PROCESS SYNCHRONIZATION ====================
  'process-sync': [
    {
      id: 'sync-1',
      title: 'Semaphore Counter',
      difficulty: 'easy',
      points: 75,
      description: `Implement a counting semaphore.

A semaphore has:
- A counter (initial value provided)
- wait(): Decrement counter if > 0, otherwise return false
- signal(): Increment counter

Return the final counter value after processing a sequence of operations.
Operations are: 'wait' or 'signal'`,
      starterCode: `function semaphoreCounter(initialValue, operations) {
  let counter = initialValue;
  let blockedCount = 0; // Track how many waits were blocked
  
  // TODO: Process each operation
  // 'wait': if counter > 0, decrement; else increment blockedCount
  // 'signal': increment counter
  
  return { counter, blockedCount };
}

return semaphoreCounter(input.initialValue, input.operations);`,
      solution: `function semaphoreCounter(initialValue, operations) {
  let counter = initialValue;
  let blockedCount = 0;
  
  for (const op of operations) {
    if (op === 'wait') {
      if (counter > 0) {
        counter--;
      } else {
        blockedCount++;
      }
    } else if (op === 'signal') {
      counter++;
    }
  }
  
  return { counter, blockedCount };
}

return semaphoreCounter(input.initialValue, input.operations);`,
      explanation: `Counting Semaphore:
- wait(): Try to acquire resource. If counter > 0, decrement. Otherwise, block.
- signal(): Release resource, increment counter.

In a real OS, blocked processes would queue and wake up on signal.
Here we just count how many operations were blocked.`,
      hints: [
        'wait() only decrements if counter > 0',
        'signal() always increments',
        'Track blocked count when wait() can\'t proceed'
      ],
      testCases: [
        {
          input: { initialValue: 2, operations: ['wait', 'wait', 'wait'] },
          expectedOutput: { counter: 0, blockedCount: 1 },
          description: 'More waits than available'
        },
        {
          input: { initialValue: 1, operations: ['wait', 'signal', 'wait'] },
          expectedOutput: { counter: 0, blockedCount: 0 },
          description: 'Alternating operations'
        },
        {
          input: { initialValue: 0, operations: ['signal', 'signal', 'wait', 'wait'] },
          expectedOutput: { counter: 0, blockedCount: 0 },
          description: 'Signals before waits'
        }
      ]
    },
    {
      id: 'sync-2',
      title: 'Detect Race Condition',
      difficulty: 'medium',
      points: 100,
      description: `Detect if a sequence of memory operations could cause a race condition.

Given a sequence of operations from multiple threads:
{ thread: number, type: 'read' | 'write', variable: string }

A race condition exists if:
- Two operations access the same variable
- At least one is a write
- They are from different threads

Return true if race condition exists, false otherwise.`,
      starterCode: `function detectRaceCondition(operations) {
  // TODO: Check for race conditions
  // Race = same variable, different threads, at least one write
  
  return false;
}

return detectRaceCondition(input);`,
      solution: `function detectRaceCondition(operations) {
  // Group operations by variable
  const byVariable = new Map();
  
  for (const op of operations) {
    if (!byVariable.has(op.variable)) {
      byVariable.set(op.variable, []);
    }
    byVariable.get(op.variable).push(op);
  }
  
  // Check each variable for race conditions
  for (const [variable, ops] of byVariable) {
    const threads = new Set(ops.map(o => o.thread));
    const hasWrite = ops.some(o => o.type === 'write');
    
    // Race condition: multiple threads AND at least one write
    if (threads.size > 1 && hasWrite) {
      return true;
    }
  }
  
  return false;
}

return detectRaceCondition(input);`,
      explanation: `Race Condition Detection:
1. Group all operations by variable name
2. For each variable, check:
   - Are there multiple threads accessing it?
   - Is at least one operation a write?
3. If both conditions are true, it's a race condition

Multiple reads from different threads are safe.`,
      hints: [
        'Group operations by variable first',
        'For each variable, count unique threads',
        'Check if any operation is a write',
        'Multiple reads are not a race condition'
      ],
      testCases: [
        {
          input: [
            { thread: 1, type: 'read', variable: 'x' },
            { thread: 2, type: 'write', variable: 'x' }
          ],
          expectedOutput: true,
          description: 'Read-write on same variable'
        },
        {
          input: [
            { thread: 1, type: 'read', variable: 'x' },
            { thread: 2, type: 'read', variable: 'x' }
          ],
          expectedOutput: false,
          description: 'Read-read is safe'
        },
        {
          input: [
            { thread: 1, type: 'write', variable: 'x' },
            { thread: 1, type: 'read', variable: 'x' }
          ],
          expectedOutput: false,
          description: 'Same thread is safe'
        }
      ]
    }
  ],

  // ==================== DEADLOCKS ====================
  'deadlocks': [
    {
      id: 'dead-1',
      title: 'Deadlock Detection (Resource Allocation)',
      difficulty: 'hard',
      points: 150,
      description: `Detect if a system is in a deadlocked state using the resource allocation graph.

Given:
- allocation: 2D array where allocation[i][j] = resources of type j held by process i
- request: 2D array where request[i][j] = resources of type j requested by process i  
- available: array where available[j] = available resources of type j

A deadlock exists if there's no safe sequence (no process can complete).

Return:
- deadlocked: boolean
- deadlockedProcesses: array of process indices stuck in deadlock`,
      starterCode: `function detectDeadlock(allocation, request, available) {
  const numProcesses = allocation.length;
  const numResources = available.length;
  
  // Track which processes can finish
  const canFinish = new Array(numProcesses).fill(false);
  const work = [...available];
  
  // TODO: Try to find a safe sequence
  // A process can finish if request[i][j] <= work[j] for all j
  // When a process finishes, add its allocation back to work
  
  // Find deadlocked processes (those that couldn't finish)
  const deadlockedProcesses = [];
  
  return {
    deadlocked: deadlockedProcesses.length > 0,
    deadlockedProcesses
  };
}

return detectDeadlock(input.allocation, input.request, input.available);`,
      solution: `function detectDeadlock(allocation, request, available) {
  const numProcesses = allocation.length;
  const numResources = available.length;
  
  const canFinish = new Array(numProcesses).fill(false);
  const work = [...available];
  
  let changed = true;
  while (changed) {
    changed = false;
    
    for (let i = 0; i < numProcesses; i++) {
      if (canFinish[i]) continue;
      
      // Check if process i can finish with current work
      let canComplete = true;
      for (let j = 0; j < numResources; j++) {
        if (request[i][j] > work[j]) {
          canComplete = false;
          break;
        }
      }
      
      if (canComplete) {
        // Process can finish, release its resources
        canFinish[i] = true;
        changed = true;
        for (let j = 0; j < numResources; j++) {
          work[j] += allocation[i][j];
        }
      }
    }
  }
  
  const deadlockedProcesses = [];
  for (let i = 0; i < numProcesses; i++) {
    if (!canFinish[i]) {
      deadlockedProcesses.push(i);
    }
  }
  
  return {
    deadlocked: deadlockedProcesses.length > 0,
    deadlockedProcesses
  };
}

return detectDeadlock(input.allocation, input.request, input.available);`,
      explanation: `Deadlock Detection Algorithm:
1. Start with work = available resources
2. Find a process whose request can be satisfied with work
3. If found, mark it as finished and add its allocation to work
4. Repeat until no more processes can finish
5. Any unfinished processes are deadlocked

This is similar to the Banker's algorithm safety check.`,
      hints: [
        'Start with work = available resources',
        'Loop until no changes: try to find a process that can finish',
        'A process can finish if its request <= work',
        'When it finishes, add its allocation back to work'
      ],
      testCases: [
        {
          input: {
            allocation: [[0, 1, 0], [2, 0, 0], [3, 0, 2]],
            request: [[0, 0, 0], [2, 0, 2], [0, 0, 0]],
            available: [0, 0, 0]
          },
          expectedOutput: {
            deadlocked: true,
            deadlockedProcesses: [1]
          },
          description: 'Process 1 cannot get resources'
        },
        {
          input: {
            allocation: [[0, 1, 0], [2, 0, 0]],
            request: [[0, 0, 0], [0, 0, 0]],
            available: [1, 0, 0]
          },
          expectedOutput: {
            deadlocked: false,
            deadlockedProcesses: []
          },
          description: 'All processes can complete'
        }
      ]
    },
    {
      id: 'dead-2',
      title: 'Circular Wait Detection',
      difficulty: 'medium',
      points: 100,
      description: `Detect circular wait in resource allocation.

Given a list of resource holdings in format:
[{ process: number, holdsResource: number, wantsResource: number }, ...]

A circular wait exists if there's a cycle in the wait graph:
P1 wants resource held by P2, P2 wants resource held by P3, ..., Pn wants resource held by P1

Return true if circular wait exists.`,
      starterCode: `function detectCircularWait(holdings) {
  // Build a wait-for graph
  // Edge from P1 to P2 means P1 is waiting for a resource held by P2
  
  // TODO: Detect cycle in the graph using DFS
  
  return false;
}

return detectCircularWait(input);`,
      solution: `function detectCircularWait(holdings) {
  // Build resource -> process holding it map
  const resourceHolder = new Map();
  for (const h of holdings) {
    resourceHolder.set(h.holdsResource, h.process);
  }
  
  // Build wait-for graph: process -> processes it waits for
  const waitFor = new Map();
  for (const h of holdings) {
    const holder = resourceHolder.get(h.wantsResource);
    if (holder !== undefined && holder !== h.process) {
      if (!waitFor.has(h.process)) {
        waitFor.set(h.process, []);
      }
      waitFor.get(h.process).push(holder);
    }
  }
  
  // DFS for cycle detection
  const visited = new Set();
  const inStack = new Set();
  
  function hasCycle(node) {
    if (inStack.has(node)) return true;
    if (visited.has(node)) return false;
    
    visited.add(node);
    inStack.add(node);
    
    const neighbors = waitFor.get(node) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }
    
    inStack.delete(node);
    return false;
  }
  
  // Check all processes
  for (const process of waitFor.keys()) {
    if (hasCycle(process)) return true;
  }
  
  return false;
}

return detectCircularWait(input);`,
      explanation: `Circular Wait Detection:
1. Build a map of which process holds each resource
2. Build a wait-for graph: edge from P1 to P2 if P1 wants resource held by P2
3. Use DFS to detect cycles in the wait-for graph
4. A cycle indicates circular wait (necessary condition for deadlock)`,
      hints: [
        'First, map each resource to the process holding it',
        'Build a directed graph: process A -> process B if A waits for resource held by B',
        'Use DFS with a recursion stack to detect cycles',
        'A back edge in DFS indicates a cycle'
      ],
      testCases: [
        {
          input: [
            { process: 0, holdsResource: 0, wantsResource: 1 },
            { process: 1, holdsResource: 1, wantsResource: 0 }
          ],
          expectedOutput: true,
          description: 'Simple circular wait'
        },
        {
          input: [
            { process: 0, holdsResource: 0, wantsResource: 1 },
            { process: 1, holdsResource: 1, wantsResource: 2 },
            { process: 2, holdsResource: 2, wantsResource: 0 }
          ],
          expectedOutput: true,
          description: 'Three-way circular wait'
        },
        {
          input: [
            { process: 0, holdsResource: 0, wantsResource: 1 },
            { process: 1, holdsResource: 1, wantsResource: 2 }
          ],
          expectedOutput: false,
          description: 'No cycle - chain only'
        }
      ]
    }
  ],

  // ==================== VIRTUAL MEMORY ====================
  'virtual-memory': [
    {
      id: 'vm-1',
      title: 'LRU Page Replacement',
      difficulty: 'medium',
      points: 100,
      description: `Implement the Least Recently Used (LRU) page replacement algorithm.

Given:
- pages: array of page references
- frameCount: number of available frames

Return:
- pageFaults: total number of page faults
- finalFrames: array of pages in frames at the end

A page fault occurs when the requested page is not in memory.
On a page fault with full frames, evict the least recently used page.`,
      starterCode: `function lruPageReplacement(pages, frameCount) {
  const frames = [];
  let pageFaults = 0;
  
  // TODO: Process each page reference
  // If page not in frames: page fault
  // If frames full: evict LRU page
  
  return {
    pageFaults,
    finalFrames: [...frames]
  };
}

return lruPageReplacement(input.pages, input.frameCount);`,
      solution: `function lruPageReplacement(pages, frameCount) {
  const frames = [];
  const lastUsed = new Map(); // page -> last used time
  let pageFaults = 0;
  
  for (let time = 0; time < pages.length; time++) {
    const page = pages[time];
    
    if (!frames.includes(page)) {
      // Page fault!
      pageFaults++;
      
      if (frames.length >= frameCount) {
        // Find LRU page to evict
        let lruPage = frames[0];
        let lruTime = lastUsed.get(frames[0]);
        
        for (const frame of frames) {
          if (lastUsed.get(frame) < lruTime) {
            lruTime = lastUsed.get(frame);
            lruPage = frame;
          }
        }
        
        // Evict LRU page
        const idx = frames.indexOf(lruPage);
        frames.splice(idx, 1);
      }
      
      frames.push(page);
    }
    
    // Update last used time
    lastUsed.set(page, time);
  }
  
  return {
    pageFaults,
    finalFrames: [...frames]
  };
}

return lruPageReplacement(input.pages, input.frameCount);`,
      explanation: `LRU Page Replacement:
1. For each page reference:
   - If page is in frames: update its "last used" time
   - If page not in frames (page fault):
     - If frames full: find and evict the page with oldest "last used" time
     - Add the new page to frames
2. Track "last used" time for each page in frames

LRU is optimal among practical algorithms but requires tracking usage times.`,
      hints: [
        'Track when each page in frames was last accessed',
        'On page fault with full frames, find page with smallest last-used time',
        'Update last-used time on every access, not just page faults',
        'A Map is useful for tracking last-used times'
      ],
      testCases: [
        {
          input: { pages: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3], frameCount: 3 },
          expectedOutput: { pageFaults: 7, finalFrames: [5, 1, 2] },
          description: 'Standard LRU example'
        },
        {
          input: { pages: [1, 2, 3, 1, 2, 3], frameCount: 3 },
          expectedOutput: { pageFaults: 3, finalFrames: [1, 2, 3] },
          description: 'Pages fit in frames'
        },
        {
          input: { pages: [1, 2, 1, 2, 3, 4], frameCount: 2 },
          expectedOutput: { pageFaults: 4, finalFrames: [3, 4] },
          description: 'Two frames only'
        }
      ]
    },
    {
      id: 'vm-2',
      title: 'FIFO Page Replacement',
      difficulty: 'easy',
      points: 75,
      description: `Implement the First-In-First-Out (FIFO) page replacement algorithm.

Given:
- pages: array of page references  
- frameCount: number of available frames

Return:
- pageFaults: total number of page faults
- finalFrames: array of pages in frames at the end

FIFO evicts the oldest page in memory (first one that came in).`,
      starterCode: `function fifoPageReplacement(pages, frameCount) {
  const frames = [];
  let pageFaults = 0;
  
  // TODO: Process each page reference
  // Use frames as a queue (first in, first out)
  
  return {
    pageFaults,
    finalFrames: [...frames]
  };
}

return fifoPageReplacement(input.pages, input.frameCount);`,
      solution: `function fifoPageReplacement(pages, frameCount) {
  const frames = [];
  let pageFaults = 0;
  
  for (const page of pages) {
    if (!frames.includes(page)) {
      // Page fault
      pageFaults++;
      
      if (frames.length >= frameCount) {
        // Evict oldest (first) page
        frames.shift();
      }
      
      // Add new page
      frames.push(page);
    }
  }
  
  return {
    pageFaults,
    finalFrames: [...frames]
  };
}

return fifoPageReplacement(input.pages, input.frameCount);`,
      explanation: `FIFO Page Replacement:
- Simple queue-based approach
- On page fault with full frames: remove first (oldest) page
- Add new page to end of frames array
- Simpler than LRU but can suffer from Belady's anomaly`,
      hints: [
        'Treat frames array as a queue',
        'Use shift() to remove oldest, push() to add newest',
        'Only modify frames on page faults, not hits'
      ],
      testCases: [
        {
          input: { pages: [1, 2, 3, 4, 1, 2], frameCount: 3 },
          expectedOutput: { pageFaults: 6, finalFrames: [4, 1, 2] },
          description: 'FIFO basic example'
        },
        {
          input: { pages: [1, 2, 3, 1, 2, 3], frameCount: 3 },
          expectedOutput: { pageFaults: 3, finalFrames: [1, 2, 3] },
          description: 'All pages fit'
        }
      ]
    }
  ]
};

// Helper functions
export const CHALLENGE_TOPICS = Object.keys(OS_CODING_CHALLENGES);

export function getChallengesByTopic(topicId) {
  return OS_CODING_CHALLENGES[topicId] || [];
}

export function getAllChallenges() {
  return Object.values(OS_CODING_CHALLENGES).flat();
}

export function getChallengeById(challengeId) {
  for (const challenges of Object.values(OS_CODING_CHALLENGES)) {
    const found = challenges.find(c => c.id === challengeId);
    if (found) return found;
  }
  return null;
}

export function getTotalPoints() {
  return getAllChallenges().reduce((sum, c) => sum + c.points, 0);
}

export function getTopicStats(topicId) {
  const challenges = getChallengesByTopic(topicId);
  return {
    total: challenges.length,
    totalPoints: challenges.reduce((sum, c) => sum + c.points, 0),
    byDifficulty: {
      easy: challenges.filter(c => c.difficulty === 'easy').length,
      medium: challenges.filter(c => c.difficulty === 'medium').length,
      hard: challenges.filter(c => c.difficulty === 'hard').length
    }
  };
}
