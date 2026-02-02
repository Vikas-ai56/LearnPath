/**
 * Topic Links Mapping
 * Maps topic names to their specific GeeksforGeeks URLs and other educational resources
 */

const topicLinksMap = {
  // Operating Systems Topics
  'operating systems': {
    'definition and purpose': 'https://www.geeksforgeeks.org/introduction-of-operating-system-set-1/',
    'os components': 'https://www.geeksforgeeks.org/components-of-operating-system/',
    'system calls': 'https://www.geeksforgeeks.org/introduction-of-system-call/',
    'os structure': 'https://www.geeksforgeeks.org/structure-of-operating-system/',
    'batch systems': 'https://www.geeksforgeeks.org/batch-operating-system/',
    'time-sharing systems': 'https://www.geeksforgeeks.org/time-sharing-operating-system/',
    'real-time systems': 'https://www.geeksforgeeks.org/real-time-operating-system-rtos/',
    'distributed systems': 'https://www.geeksforgeeks.org/types-of-distributed-system/',
    'mobile os': 'https://www.geeksforgeeks.org/mobile-operating-system/',
    'process vs program': 'https://www.geeksforgeeks.org/difference-between-program-and-process/',
    'process states': 'https://www.geeksforgeeks.org/states-of-a-process-in-operating-systems/',
    'process control block (pcb)': 'https://www.geeksforgeeks.org/process-control-block/',
    'context switching': 'https://www.geeksforgeeks.org/context-switch-in-operating-system/',
    'cpu scheduling': 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/',
    'scheduling algorithms': 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/',
    'fcfs scheduling': 'https://www.geeksforgeeks.org/program-for-fcfs-cpu-scheduling-set-1/',
    'sjf scheduling': 'https://www.geeksforgeeks.org/program-for-shortest-job-first-or-sjf-cpu-scheduling-set-1-non-preemptive/',
    'round robin scheduling': 'https://www.geeksforgeeks.org/program-round-robin-scheduling-set-1/',
    'priority scheduling': 'https://www.geeksforgeeks.org/priority-cpu-scheduling-with-different-arrival-time-set-2/',
    'deadlock': 'https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/',
    'deadlock detection': 'https://www.geeksforgeeks.org/deadlock-detection-in-distributed-systems/',
    'deadlock prevention': 'https://www.geeksforgeeks.org/deadlock-prevention/',
    'deadlock avoidance': 'https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/',
    'semaphores': 'https://www.geeksforgeeks.org/semaphores-in-operating-system/',
    'mutex': 'https://www.geeksforgeeks.org/mutex-lock-for-linux-thread-synchronization/',
    'monitors': 'https://www.geeksforgeeks.org/monitors-in-operating-system/',
    'memory management': 'https://www.geeksforgeeks.org/memory-management-in-operating-system/',
    'paging': 'https://www.geeksforgeeks.org/paging-in-operating-system/',
    'segmentation': 'https://www.geeksforgeeks.org/segmentation-in-operating-system/',
    'virtual memory': 'https://www.geeksforgeeks.org/virtual-memory-in-operating-system/',
    'page replacement': 'https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/',
    'fifo page replacement': 'https://www.geeksforgeeks.org/program-for-page-replacement-algorithms-set-2-fifo/',
    'lru page replacement': 'https://www.geeksforgeeks.org/program-for-least-recently-used-lru-page-replacement-algorithm/',
    'file systems': 'https://www.geeksforgeeks.org/file-systems-in-operating-system/',
    'file allocation methods': 'https://www.geeksforgeeks.org/file-allocation-methods/',
    'disk scheduling': 'https://www.geeksforgeeks.org/disk-scheduling-algorithms/',
    'fcfs disk scheduling': 'https://www.geeksforgeeks.org/program-for-fcfs-disk-scheduling-algorithm/',
    'sstf disk scheduling': 'https://www.geeksforgeeks.org/program-for-sstf-disk-scheduling-algorithm/',
    'scan disk scheduling': 'https://www.geeksforgeeks.org/scan-elevator-disk-scheduling-algorithms/',
  },

  // Data Structures Topics
  'data structures': {
    'types of data structures': 'https://www.geeksforgeeks.org/data-structures/',
    'linear vs non-linear': 'https://www.geeksforgeeks.org/difference-between-linear-and-non-linear-data-structures/',
    'static vs dynamic': 'https://www.geeksforgeeks.org/static-and-dynamic-data-structures/',
    'abstract data types': 'https://www.geeksforgeeks.org/abstract-data-types/',
    'stacks': 'https://www.geeksforgeeks.org/stack-data-structure/',
    'stack definitions & concepts': 'https://www.geeksforgeeks.org/stack-data-structure-introduction-program/',
    'representing stacks in c': 'https://www.geeksforgeeks.org/stack-data-structure/',
    'operations on stacks': 'https://www.geeksforgeeks.org/stack-data-structure-introduction-program/',
    'infix to postfix': 'https://www.geeksforgeeks.org/stack-set-2-infix-to-postfix/',
    'infix to prefix': 'https://www.geeksforgeeks.org/infix-to-prefix-conversion-using-stack/',
    'postfix expression evaluation': 'https://www.geeksforgeeks.org/stack-set-4-evaluation-postfix-expression/',
    'recursion': 'https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/',
    'factorial': 'https://www.geeksforgeeks.org/program-for-factorial-of-a-number/',
    'binary search': 'https://www.geeksforgeeks.org/binary-search/',
    'tower of hanoi': 'https://www.geeksforgeeks.org/c-program-for-tower-of-hanoi/',
    'queues': 'https://www.geeksforgeeks.org/queue-data-structure/',
    'circular queue': 'https://www.geeksforgeeks.org/circular-queue-set-1-introduction-array-implementation/',
    'priority queue': 'https://www.geeksforgeeks.org/priority-queue-set-1-introduction/',
    'deque': 'https://www.geeksforgeeks.org/deque-set-1-introduction-applications/',
    'linked lists': 'https://www.geeksforgeeks.org/data-structures/linked-list/',
    'singly linked list': 'https://www.geeksforgeeks.org/data-structures/linked-list/singly-linked-list/',
    'doubly linked list': 'https://www.geeksforgeeks.org/data-structures/linked-list/doubly-linked-list/',
    'circular linked list': 'https://www.geeksforgeeks.org/circular-linked-list/',
    'trees': 'https://www.geeksforgeeks.org/binary-tree-data-structure/',
    'binary tree': 'https://www.geeksforgeeks.org/binary-tree-data-structure/',
    'binary search tree': 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/',
    'avl tree': 'https://www.geeksforgeeks.org/avl-tree-set-1-insertion/',
    'heap': 'https://www.geeksforgeeks.org/binary-heap/',
    'graphs': 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/',
    'graph representation': 'https://www.geeksforgeeks.org/graph-and-its-representations/',
    'bfs': 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/',
    'dfs': 'https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/',
    'shortest path': 'https://www.geeksforgeeks.org/shortest-path-algorithms/',
    'dijkstra algorithm': 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/',
    'sorting algorithms': 'https://www.geeksforgeeks.org/sorting-algorithms/',
    'bubble sort': 'https://www.geeksforgeeks.org/bubble-sort/',
    'selection sort': 'https://www.geeksforgeeks.org/selection-sort/',
    'insertion sort': 'https://www.geeksforgeeks.org/insertion-sort/',
    'merge sort': 'https://www.geeksforgeeks.org/merge-sort/',
    'quick sort': 'https://www.geeksforgeeks.org/quick-sort/',
    'hashing': 'https://www.geeksforgeeks.org/hashing-data-structure/',
    'hash table': 'https://www.geeksforgeeks.org/hashing-data-structure/',
    'hash functions': 'https://www.geeksforgeeks.org/hash-functions-and-list-types-of-hash-functions/',
  },

  // Computer Networks Topics
  'computer networks': {
    'business domains: networks': 'https://www.geeksforgeeks.org/types-of-computer-networks/',
    'resource sharing applications': 'https://www.geeksforgeeks.org/computer-network-types-of-computer-network/',
    'client-server programming': 'https://www.geeksforgeeks.org/client-server-model/',
    'e-commerce and digital communications': 'https://www.geeksforgeeks.org/computer-network-types-of-computer-network/',
    'tcp/ip protocol': 'https://www.geeksforgeeks.org/tcp-ip-model/',
    'osi model (7 layers)': 'https://www.geeksforgeeks.org/layers-osi-model/',
    'network types': 'https://www.geeksforgeeks.org/types-of-computer-networks/',
    'transmission modes': 'https://www.geeksforgeeks.org/transmission-modes-computer-networks/',
    'data link layer': 'https://www.geeksforgeeks.org/data-link-layer/',
    'hdlc': 'https://www.geeksforgeeks.org/high-level-data-link-control-hdlc/',
    'ppp': 'https://www.geeksforgeeks.org/point-to-point-protocol-ppp/',
    'mac': 'https://www.geeksforgeeks.org/multiple-access-protocols-in-computer-network/',
    'network layer': 'https://www.geeksforgeeks.org/network-layer-services-packetizing-routing-and-forwarding/',
    'ip addressing': 'https://www.geeksforgeeks.org/ip-addressing-introduction-and-classful-addressing/',
    'subnetting': 'https://www.geeksforgeeks.org/subnetting-in-computer-networks/',
    'routing': 'https://www.geeksforgeeks.org/types-of-routing/',
    'routing algorithms': 'https://www.geeksforgeeks.org/types-of-routing/',
    'transport layer': 'https://www.geeksforgeeks.org/transport-layer-responsibilities/',
    'tcp': 'https://www.geeksforgeeks.org/transmission-control-protocol-tcp/',
    'udp': 'https://www.geeksforgeeks.org/user-datagram-protocol-udp/',
    'congestion control': 'https://www.geeksforgeeks.org/congestion-control-in-computer-networks/',
    'application layer': 'https://www.geeksforgeeks.org/application-layer-in-osi-model/',
    'http': 'https://www.geeksforgeeks.org/http-full-form/',
    'https': 'https://www.geeksforgeeks.org/explain-working-of-https/',
    'dns': 'https://www.geeksforgeeks.org/domain-name-system-dns-in-application-layer/',
    'smtp': 'https://www.geeksforgeeks.org/simple-mail-transfer-protocol-smtp/',
    'ftp': 'https://www.geeksforgeeks.org/file-transfer-protocol-ftp-in-application-layer/',
    'network security': 'https://www.geeksforgeeks.org/network-security/',
    'cryptography': 'https://www.geeksforgeeks.org/cryptography-and-its-types/',
    'firewall': 'https://www.geeksforgeeks.org/introduction-of-firewall-in-computer-network/',
  },

  // Database Systems Topics
  'database systems': {
    'databases and database users': 'https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/',
    'characteristics of database approach': 'https://www.geeksforgeeks.org/characteristics-of-database-approach/',
    'data models, schemas and instances': 'https://www.geeksforgeeks.org/data-models-in-dbms/',
    'three-schema architecture': 'https://www.geeksforgeeks.org/three-schema-architecture-of-dbms/',
    'data independence': 'https://www.geeksforgeeks.org/data-independence-in-dbms/',
    'database system environment': 'https://www.geeksforgeeks.org/database-management-system-introduction-set-2/',
    'er modeling': 'https://www.geeksforgeeks.org/introduction-of-er-model/',
    'high-level conceptual data models': 'https://www.geeksforgeeks.org/introduction-of-er-model/',
    'entity types, entity sets': 'https://www.geeksforgeeks.org/er-model-basic-concepts/',
    'attributes and keys': 'https://www.geeksforgeeks.org/attributes-in-er-model/',
    'relationship types, roles and structural constraints': 'https://www.geeksforgeeks.org/relationship-sets-in-er-model/',
    'weak entity types': 'https://www.geeksforgeeks.org/weak-entity-set-in-er-diagrams/',
    'relational model': 'https://www.geeksforgeeks.org/relational-model-in-dbms/',
    'relational algebra': 'https://www.geeksforgeeks.org/introduction-of-relational-algebra-in-dbms/',
    'sql': 'https://www.geeksforgeeks.org/sql-tutorial/',
    'normalization': 'https://www.geeksforgeeks.org/introduction-of-database-normalization/',
    '1nf': 'https://www.geeksforgeeks.org/first-normal-form-1nf/',
    '2nf': 'https://www.geeksforgeeks.org/second-normal-form-2nf/',
    '3nf': 'https://www.geeksforgeeks.org/third-normal-form-3nf/',
    'bcnf': 'https://www.geeksforgeeks.org/boyce-codd-normal-form-bcnf/',
    'transaction': 'https://www.geeksforgeeks.org/sql-transactions/',
    'acid properties': 'https://www.geeksforgeeks.org/acid-properties-in-dbms/',
    'concurrency control': 'https://www.geeksforgeeks.org/concurrency-control-in-dbms/',
    'locking': 'https://www.geeksforgeeks.org/lock-based-concurrency-control-protocol-in-dbms/',
    'deadlock in dbms': 'https://www.geeksforgeeks.org/deadlock-in-dbms/',
    'indexing': 'https://www.geeksforgeeks.org/indexing-in-databases-set-1/',
    'b-tree': 'https://www.geeksforgeeks.org/introduction-of-b-tree-2/',
    'b+ tree': 'https://www.geeksforgeeks.org/introduction-of-b-tree-4/',
    'hashing in dbms': 'https://www.geeksforgeeks.org/hashing-in-dbms/',
  },
};

/**
 * Get specific link for a topic
 * @param {string} topicName - The name of the topic
 * @param {string} subjectName - The name of the subject
 * @returns {string} URL to the specific topic page or search fallback
 */
export const getTopicLink = (topicName, subjectName) => {
  // Normalize inputs
  const normalizedTopic = topicName.toLowerCase().trim();
  const normalizedSubject = subjectName.toLowerCase().trim();

  // Try to find exact match in subject-specific map
  const subjectMap = topicLinksMap[normalizedSubject];
  if (subjectMap && subjectMap[normalizedTopic]) {
    return subjectMap[normalizedTopic];
  }

  // Try partial matching (e.g., "Process States" matches "process states")
  if (subjectMap) {
    for (const [key, url] of Object.entries(subjectMap)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        return url;
      }
    }
  }

  // Try searching across all subjects for common topics
  for (const [subject, topics] of Object.entries(topicLinksMap)) {
    if (topics[normalizedTopic]) {
      return topics[normalizedTopic];
    }
    // Partial match across all subjects
    for (const [key, url] of Object.entries(topics)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        return url;
      }
    }
  }

  // Fallback: Generate GeeksforGeeks search URL
  const cleanTopic = normalizedTopic
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const searchQuery = `${cleanTopic} ${normalizedSubject}`.replace(/-/g, ' ');
  const encodedQuery = encodeURIComponent(searchQuery);
  
  return `https://www.geeksforgeeks.org/search/?q=${encodedQuery}`;
};
