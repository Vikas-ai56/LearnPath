/**
 * Data Structures & Applications Complete Curriculum
 * Based on VTU Syllabus (IS233AI) - 45L+30P Hours
 */

export const DS_CURRICULUM = {
    subject: "Data Structures",
    description: "Complete Data Structures and Applications from fundamentals to advanced concepts",

    nodes: [
        // ==================== UNIT I ====================
        {
            id: 'ds-intro',
            label: 'Introduction to DS',
            description: 'Introduction to Data Structures, Types, Linear & Non-linear structures',
            level: 1,
            prereqs: [],
            domain: 'Foundation',
            x: 100,
            y: 200,
            videos: [
                {
                    title: 'Introduction to Data Structures',
                    url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
                    duration: '15:23',
                    channel: 'Programming with Mosh'
                },
                {
                    title: 'Data Structures Full Course',
                    url: 'https://www.youtube.com/watch?v=B31LgI4Y4DQ',
                    duration: '12:45',
                    channel: 'freeCodeCamp'
                }
            ],
            topics: [
                'Types of Data Structures',
                'Linear vs Non-linear',
                'Static vs Dynamic',
                'Abstract Data Types'
            ],
            difficulty: 'beginner'
        },
        {
            id: 'stacks',
            label: 'Stacks',
            description: 'Stack operations, Infix/Postfix/Prefix conversion, Expression evaluation',
            level: 1,
            prereqs: ['ds-intro'],
            domain: 'Foundation',
            x: 300,
            y: 150,
            videos: [
                {
                    title: 'Stack Data Structure',
                    url: 'https://www.youtube.com/watch?v=F1F2imiOJfk',
                    duration: '18:42',
                    channel: 'Neso Academy'
                },
                {
                    title: 'Infix Prefix Postfix Conversion',
                    url: 'https://www.youtube.com/watch?v=vq-nUF0G4fI',
                    duration: '25:30',
                    channel: 'Jenny\'s Lectures'
                }
            ],
            topics: [
                'Stack Definitions & Concepts',
                'Representing Stacks in C',
                'Operations on Stacks',
                'Infix to Postfix',
                'Infix to Prefix',
                'Postfix Expression Evaluation'
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'recursion',
            label: 'Recursion',
            description: 'Recursion concepts, Factorial, Binary Search, Tower of Hanoi',
            level: 1,
            prereqs: ['stacks'],
            domain: 'Foundation',
            x: 300,
            y: 250,
            videos: [
                {
                    title: 'Recursion in Programming',
                    url: 'https://www.youtube.com/watch?v=IJDJ0kBx2LM',
                    duration: '16:20',
                    channel: 'Neso Academy'
                },
                {
                    title: 'Tower of Hanoi Problem',
                    url: 'https://www.youtube.com/watch?v=q6RicK1FCuc',
                    duration: '12:40',
                    channel: 'Computerphile'
                }
            ],
            topics: [
                'Introduction to Recursion',
                'Factorial Function',
                'Binary Search',
                'Towers of Hanoi',
                'Role of Stack in Recursion'
            ],
            difficulty: 'intermediate'
        },

        // ==================== UNIT II ====================
        {
            id: 'queues',
            label: 'Queues',
            description: 'Queue operations, Circular queues, Message queue applications',
            level: 2,
            prereqs: ['stacks'],
            domain: 'Linear Structures',
            x: 500,
            y: 150,
            videos: [
                {
                    title: 'Queue Data Structure',
                    url: 'https://www.youtube.com/watch?v=zp6pBNbUB2U',
                    duration: '22:10',
                    channel: 'Neso Academy'
                },
                {
                    title: 'Circular Queue Implementation',
                    url: 'https://www.youtube.com/watch?v=dn01XST9-bI',
                    duration: '15:30',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Representation of Queue',
                'Queue Operations',
                'Circular Queues',
                'Message Queue using Circular Queue'
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'dynamic-memory',
            label: 'Dynamic Memory',
            description: 'malloc(), calloc(), free(), realloc() functions',
            level: 2,
            prereqs: ['ds-intro'],
            domain: 'Linear Structures',
            x: 500,
            y: 250,
            videos: [
                {
                    title: 'Dynamic Memory Allocation in C',
                    url: 'https://www.youtube.com/watch?v=udfbq5M4cAg',
                    duration: '24:50',
                    channel: 'Neso Academy'
                }
            ],
            topics: [
                'malloc()',
                'calloc()',
                'free()',
                'realloc()'
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'linked-lists',
            label: 'Singly Linked Lists',
            description: 'SLL definition, operations: insertion, deletion, display',
            level: 2,
            prereqs: ['dynamic-memory'],
            domain: 'Linear Structures',
            x: 500,
            y: 350,
            videos: [
                {
                    title: 'Linked List Data Structure',
                    url: 'https://www.youtube.com/watch?v=R9PTBwOzceo',
                    duration: '18:25',
                    channel: 'Neso Academy'
                },
                {
                    title: 'Linked List Operations',
                    url: 'https://www.youtube.com/watch?v=vcQIFT79_50',
                    duration: '20:15',
                    channel: 'mycodeschool'
                }
            ],
            topics: [
                'Definition and Terminology',
                'Singly Linked List (SLL)',
                'Insertion Operations',
                'Deletion Operations',
                'Display and Traversal',
                'getnode, freenode, header node'
            ],
            difficulty: 'intermediate'
        },

        // ==================== UNIT III ====================
        {
            id: 'circular-dll',
            label: 'Circular & Doubly LL',
            description: 'Circular SLL, DLL, CDLL and their applications',
            level: 3,
            prereqs: ['linked-lists'],
            domain: 'Advanced Linear',
            x: 700,
            y: 300,
            videos: [
                {
                    title: 'Circular Linked List',
                    url: 'https://www.youtube.com/watch?v=HMkdlu5sP4A',
                    duration: '28:15',
                    channel: 'Neso Academy'
                },
                {
                    title: 'Doubly Linked List',
                    url: 'https://www.youtube.com/watch?v=JdQeNxWCguQ',
                    duration: '22:30',
                    channel: 'Neso Academy'
                }
            ],
            topics: [
                'Circular Singly Linked List',
                'Queue Implementation',
                'Doubly Linked List (DLL)',
                'Circular Doubly Linked List (CDLL)',
                'Polynomial Multiplication',
                'Addition of Long Positive Integers'
            ],
            difficulty: 'advanced'
        },
        {
            id: 'trees-intro',
            label: 'Trees Introduction',
            description: 'Tree terminology, Binary Trees, BST, Expression Trees',
            level: 3,
            prereqs: ['recursion', 'linked-lists'],
            domain: 'Non-Linear Structures',
            x: 700,
            y: 150,
            videos: [
                {
                    title: 'Tree Data Structure',
                    url: 'https://www.youtube.com/watch?v=1-l_UOFi1Xw',
                    duration: '26:40',
                    channel: 'Neso Academy'
                },
                {
                    title: 'Binary Search Trees',
                    url: 'https://www.youtube.com/watch?v=pYT9F8_LFTM',
                    duration: '20:15',
                    channel: 'Abdul Bari'
                }
            ],
            topics: [
                'Recursive Definition',
                'Tree Terminology',
                'Binary Trees (BT)',
                'Binary Search Trees (BST)',
                'Expression Trees (ET)'
            ],
            difficulty: 'advanced'
        },

        // ==================== UNIT IV ====================
        {
            id: 'tree-operations',
            label: 'Tree Operations',
            description: 'Insertion, Deletion, Traversals, Tree Sort, Infix/Prefix/Postfix',
            level: 4,
            prereqs: ['trees-intro'],
            domain: 'Non-Linear Structures',
            x: 900,
            y: 150,
            videos: [
                {
                    title: 'Tree Traversals',
                    url: 'https://www.youtube.com/watch?v=gm8DUJJhmY4',
                    duration: '24:20',
                    channel: 'Neso Academy'
                },
                {
                    title: 'Binary Search Tree Operations',
                    url: 'https://www.youtube.com/watch?v=cySVml6e_Fc',
                    duration: '18:45',
                    channel: 'mycodeschool'
                }
            ],
            topics: [
                'Insertion in BT, BST, ET',
                'Deletion in BT, BST, ET',
                'Display and Traversals',
                'Tree Sort',
                'Infix, Postfix, Prefix from ET'
            ],
            difficulty: 'advanced'
        },
        {
            id: 'heaps',
            label: 'Heaps',
            description: 'Heap definition, construction, Heap Sort, Priority Queue',
            level: 4,
            prereqs: ['tree-operations'],
            domain: 'Non-Linear Structures',
            x: 900,
            y: 250,
            videos: [
                {
                    title: 'Heap Data Structure',
                    url: 'https://www.youtube.com/watch?v=HqPJF2L5h9U',
                    duration: '19:30',
                    channel: 'Abdul Bari'
                },
                {
                    title: 'Heap Sort Algorithm',
                    url: 'https://www.youtube.com/watch?v=MtQL_ll5KhQ',
                    duration: '22:15',
                    channel: 'Abdul Bari'
                }
            ],
            topics: [
                'Heap Definition',
                'Heap Construction',
                'Applications of Heap',
                'Heap Sort',
                'Priority Queue'
            ],
            difficulty: 'advanced'
        },

        // ==================== UNIT V ====================
        {
            id: 'threaded-trees',
            label: 'Threaded Binary Trees',
            description: 'Types and applications of Threaded Binary Trees',
            level: 5,
            prereqs: ['tree-operations'],
            domain: 'Advanced Trees',
            x: 1100,
            y: 100,
            videos: [
                {
                    title: 'Threaded Binary Trees',
                    url: 'https://www.youtube.com/watch?v=3J2ratlQFIU',
                    duration: '24:50',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Types of Threaded Binary Trees',
                'Applications'
            ],
            difficulty: 'advanced'
        },
        {
            id: 'balanced-trees',
            label: 'Balanced Trees',
            description: 'AVL trees, B+ trees, Splay trees, Tries',
            level: 5,
            prereqs: ['tree-operations'],
            domain: 'Advanced Trees',
            x: 1100,
            y: 200,
            videos: [
                {
                    title: 'AVL Trees',
                    url: 'https://www.youtube.com/watch?v=jDM6_TnYIqE',
                    duration: '28:15',
                    channel: 'Abdul Bari'
                },
                {
                    title: 'B Trees and B+ Trees',
                    url: 'https://www.youtube.com/watch?v=aZjYr87r1b8',
                    duration: '22:30',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'AVL Trees',
                'B+ Trees',
                'Splay Trees',
                'Tries'
            ],
            difficulty: 'advanced'
        },
        {
            id: 'graphs',
            label: 'Graphs',
            description: 'Graph representation, Matrix and Adjacency List',
            level: 5,
            prereqs: ['queues', 'linked-lists'],
            domain: 'Advanced Non-Linear',
            x: 1100,
            y: 300,
            videos: [
                {
                    title: 'Graph Data Structure',
                    url: 'https://www.youtube.com/watch?v=gXgEDyodOJU',
                    duration: '26:40',
                    channel: 'freeCodeCamp'
                },
                {
                    title: 'Graph Representation',
                    url: 'https://www.youtube.com/watch?v=bTZcpKBkM6Q',
                    duration: '20:15',
                    channel: 'Neso Academy'
                }
            ],
            topics: [
                'Graph Preliminaries',
                'Matrix Representation',
                'Adjacency List Representation'
            ],
            difficulty: 'advanced'
        },
        {
            id: 'hashing',
            label: 'Hashing',
            description: 'Open and Closed Hashing, Collision Resolution Strategies',
            level: 5,
            prereqs: ['linked-lists'],
            domain: 'Advanced Non-Linear',
            x: 1100,
            y: 400,
            videos: [
                {
                    title: 'Hashing Data Structure',
                    url: 'https://www.youtube.com/watch?v=2Ti5yvumFTU',
                    duration: '24:20',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Collision Resolution Techniques',
                    url: 'https://www.youtube.com/watch?v=MfhjkfocRR0',
                    duration: '18:45',
                    channel: 'Abdul Bari'
                }
            ],
            topics: [
                'Open Hashing',
                'Closed Hashing',
                'Collision Resolution Strategies'
            ],
            difficulty: 'advanced'
        }
    ]
};

// Quizzes based on Striver's SDE Sheet and standard DS concepts
export const DS_QUIZZES = {
    'ds-intro': [
        {
            question: "Which of the following is a Linear Data Structure?",
            options: ["Tree", "Graph", "Array", "Hash Table"],
            correct: 2,
            explanation: "Arrays are linear data structures where elements are stored in contiguous memory locations."
        },
        {
            question: "What is the time complexity of accessing an element by index in an Array?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correct: 0,
            explanation: "Arrays provide constant time O(1) access to elements using their index."
        },
        {
            question: "Which data structure uses LIFO (Last In First Out) principle?",
            options: ["Queue", "Stack", "Linked List", "Tree"],
            correct: 1,
            explanation: "Stack follows LIFO principle where the last element inserted is the first one to be removed."
        }
    ],

    'stacks': [
        {
            question: "What is the time complexity of Push and Pop operations in a Stack?",
            options: ["O(n)", "O(1)", "O(log n)", "O(n log n)"],
            correct: 1,
            explanation: "Both Push and Pop operations in a stack are O(1) as they only modify the top element."
        },
        {
            question: "Convert the infix expression 'A + B * C' to postfix notation.",
            options: ["ABC*+", "AB+C*", "A+BC*", "ABC+*"],
            correct: 0,
            explanation: "Following operator precedence, * has higher priority than +, so B*C is evaluated first, giving ABC*+."
        },
        {
            question: "Which data structure is used to implement function calls and recursion?",
            options: ["Queue", "Stack", "Tree", "Graph"],
            correct: 1,
            explanation: "The system uses a call stack to manage function calls and recursion, storing return addresses and local variables."
        }
    ],

    'recursion': [
        {
            question: "What is the base case in the factorial function?",
            options: ["n = 1", "n = 0", "n = -1", "n = 2"],
            correct: 1,
            explanation: "The base case for factorial is typically n = 0, where 0! = 1."
        },
        {
            question: "What is the minimum number of moves required to solve Tower of Hanoi with n disks?",
            options: ["n", "2^n", "2^n - 1", "n^2"],
            correct: 2,
            explanation: "Tower of Hanoi requires 2^n - 1 moves to transfer n disks from source to destination."
        },
        {
            question: "Which of the following uses a stack implicitly?",
            options: ["Iteration", "Recursion", "Sequential search", "Bubble sort"],
            correct: 1,
            explanation: "Recursion uses the system call stack to store function call information."
        }
    ],

    'queues': [
        {
            question: "In a Circular Queue, how do you calculate the next position?",
            options: ["(pos + 1) % size", "pos + 1", "pos - 1", "(pos - 1) % size"],
            correct: 0,
            explanation: "Modulo operation (pos + 1) % size wraps around to the beginning when reaching the end."
        },
        {
            question: "What problem does a Circular Queue solve compared to a simple Queue?",
            options: ["Overflow", "Underflow", "False Overflow", "Memory leak"],
            correct: 2,
            explanation: "Circular Queue prevents false overflow by reusing empty spaces at the beginning of the array."
        },
        {
            question: "Which data structure follows FIFO (First In First Out)?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            correct: 1,
            explanation: "Queue follows FIFO principle where the first element inserted is the first one to be removed."
        }
    ],

    'dynamic-memory': [
        {
            question: "What does malloc() return if memory allocation fails?",
            options: ["NULL", "0", "-1", "Garbage value"],
            correct: 0,
            explanation: "malloc() returns NULL pointer when it fails to allocate the requested memory."
        },
        {
            question: "Which function is used to release dynamically allocated memory?",
            options: ["delete()", "free()", "release()", "dealloc()"],
            correct: 1,
            explanation: "free() function is used to deallocate memory that was previously allocated by malloc(), calloc(), or realloc()."
        },
        {
            question: "What is the difference between malloc() and calloc()?",
            options: [
                "No difference",
                "calloc() initializes memory to zero",
                "malloc() is faster",
                "calloc() allocates less memory"
            ],
            correct: 1,
            explanation: "calloc() initializes the allocated memory to zero, while malloc() leaves it uninitialized."
        }
    ],

    'linked-lists': [
        {
            question: "What is the main advantage of Linked List over Array?",
            options: ["Random access", "Dynamic size", "Cache locality", "Less memory usage"],
            correct: 1,
            explanation: "Linked Lists can grow or shrink dynamically at runtime, unlike arrays with fixed size."
        },
        {
            question: "What is the time complexity of inserting an element at the beginning of a Singly Linked List?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correct: 0,
            explanation: "Inserting at the beginning requires only updating the head pointer, which is O(1)."
        },
        {
            question: "How do you detect a cycle in a Linked List? (Floyd's Algorithm)",
            options: [
                "Use two pointers moving at same speed",
                "Use two pointers moving at different speeds",
                "Use recursion",
                "Use a stack"
            ],
            correct: 1,
            explanation: "Floyd's cycle detection uses slow and fast pointers. If there's a cycle, they will eventually meet."
        }
    ],

    'circular-dll': [
        {
            question: "In a Doubly Linked List, each node contains:",
            options: [
                "Only data and next pointer",
                "Data, next and previous pointers",
                "Only data",
                "Data and two next pointers"
            ],
            correct: 1,
            explanation: "DLL nodes have three fields: data, pointer to next node, and pointer to previous node."
        },
        {
            question: "What is the advantage of Circular Linked List over Singly Linked List?",
            options: [
                "Less memory",
                "Can traverse from any node to any other node",
                "Faster insertion",
                "Simpler implementation"
            ],
            correct: 1,
            explanation: "In circular linked list, you can reach any node from any other node by traversing in one direction."
        },
        {
            question: "Which application is best suited for Circular Doubly Linked List?",
            options: ["Stack", "Queue", "Music playlist", "Binary search"],
            correct: 2,
            explanation: "Music playlists benefit from CDLL as you can move forward/backward and loop around."
        }
    ],

    'trees-intro': [
        {
            question: "In a Binary Search Tree, where are smaller values located relative to the root?",
            options: ["Right subtree", "Left subtree", "Both subtrees", "Leaf nodes only"],
            correct: 1,
            explanation: "In BST, all values in the left subtree are smaller than the root, and right subtree values are larger."
        },
        {
            question: "What is the maximum number of nodes in a Binary Tree of height h?",
            options: ["2^h", "2^(h+1) - 1", "2*h", "h²"],
            correct: 1,
            explanation: "A complete binary tree of height h has maximum 2^(h+1) - 1 nodes."
        },
        {
            question: "Which traversal of Expression Tree gives Postfix expression?",
            options: ["Preorder", "Inorder", "Postorder", "Level order"],
            correct: 2,
            explanation: "Postorder traversal (Left-Right-Root) of an expression tree gives the postfix notation."
        }
    ],

    'tree-operations': [
        {
            question: "Which traversal of BST gives elements in sorted order?",
            options: ["Preorder", "Inorder", "Postorder", "Level order"],
            correct: 1,
            explanation: "Inorder traversal (Left-Root-Right) of BST produces elements in ascending sorted order."
        },
        {
            question: "What is the time complexity of searching in a balanced BST?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correct: 1,
            explanation: "In a balanced BST, search operation takes O(log n) time as we eliminate half the tree at each step."
        },
        {
            question: "Which traversal is used for deleting a tree?",
            options: ["Preorder", "Inorder", "Postorder", "Level order"],
            correct: 2,
            explanation: "Postorder traversal is used for deletion as we delete children before deleting the parent node."
        }
    ],

    'heaps': [
        {
            question: "In a Max-Heap, which element is always at the root?",
            options: ["Minimum", "Maximum", "Median", "Random"],
            correct: 1,
            explanation: "Max-Heap property ensures the maximum element is always at the root."
        },
        {
            question: "What is the time complexity of Heap Sort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            correct: 1,
            explanation: "Heap Sort has O(n log n) time complexity for building heap and extracting elements."
        },
        {
            question: "Which operation has O(log n) complexity in a heap?",
            options: ["Find max", "Insert", "Delete", "Both Insert and Delete"],
            correct: 3,
            explanation: "Both insertion and deletion in a heap require O(log n) time to maintain heap property."
        }
    ],

    'threaded-trees': [
        {
            question: "What is the purpose of threading in Binary Trees?",
            options: [
                "To save memory",
                "To make traversal faster without stack/recursion",
                "To balance the tree",
                "To sort elements"
            ],
            correct: 1,
            explanation: "Threaded binary trees use null pointers to point to inorder predecessor/successor, enabling traversal without stack."
        },
        {
            question: "In a right-threaded binary tree, the right pointer of a node points to:",
            options: [
                "Right child or NULL",
                "Right child or inorder successor",
                "Parent node",
                "Left child"
            ],
            correct: 1,
            explanation: "In right-threaded tree, if right child doesn't exist, the pointer points to inorder successor."
        }
    ],

    'balanced-trees': [
        {
            question: "What is the balance factor of a node in an AVL tree?",
            options: [
                "Height of left subtree - Height of right subtree",
                "Number of nodes in left - Number in right",
                "Depth of node",
                "Level of node"
            ],
            correct: 0,
            explanation: "Balance factor = height(left subtree) - height(right subtree). In AVL, it must be -1, 0, or 1."
        },
        {
            question: "Which tree is commonly used in databases and file systems?",
            options: ["AVL Tree", "Red-Black Tree", "B-Tree", "Splay Tree"],
            correct: 2,
            explanation: "B-Trees and B+ Trees are optimized for systems that read/write large blocks of data like databases."
        },
        {
            question: "What is the main advantage of Splay Trees?",
            options: [
                "Always balanced",
                "Recently accessed elements are quick to access again",
                "Minimum height",
                "Sorted storage"
            ],
            correct: 1,
            explanation: "Splay trees move recently accessed elements to the root, making subsequent accesses faster."
        }
    ],

    'graphs': [
        {
            question: "Which graph representation is better for dense graphs?",
            options: ["Adjacency Matrix", "Adjacency List", "Edge List", "Incidence Matrix"],
            correct: 0,
            explanation: "Adjacency Matrix is more space-efficient for dense graphs where most vertices are connected."
        },
        {
            question: "What is the space complexity of Adjacency Matrix for a graph with V vertices?",
            options: ["O(V)", "O(V²)", "O(E)", "O(V+E)"],
            correct: 1,
            explanation: "Adjacency Matrix requires V×V space to store all possible edges, giving O(V²) space complexity."
        },
        {
            question: "Which algorithm finds shortest path in unweighted graph?",
            options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"],
            correct: 1,
            explanation: "BFS finds shortest path in unweighted graphs by exploring level by level."
        }
    ],

    'hashing': [
        {
            question: "Which collision resolution technique uses linked lists?",
            options: ["Linear Probing", "Quadratic Probing", "Chaining", "Double Hashing"],
            correct: 2,
            explanation: "Chaining (Open Hashing) uses linked lists at each hash table index to store multiple elements."
        },
        {
            question: "What is the ideal load factor for a hash table?",
            options: ["0.1", "0.5", "0.7", "1.0"],
            correct: 2,
            explanation: "A load factor around 0.7 balances space efficiency with collision minimization."
        },
        {
            question: "Which is a Closed Hashing technique?",
            options: ["Chaining", "Separate Chaining", "Linear Probing", "Linked List"],
            correct: 2,
            explanation: "Linear Probing is a closed hashing technique where collisions are resolved within the hash table itself."
        }
    ]
};

// LeetCode Exercises organized by topic and difficulty
export const DS_EXERCISES = {
    'ds-intro': [
        {
            title: "Contains Duplicate",
            description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/"
        },
        {
            title: "Best Time to Buy and Sell Stock",
            description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
        },
        {
            title: "Product of Array Except Self",
            description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/"
        }
    ],

    'stacks': [
        {
            title: "Valid Parentheses",
            description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/"
        },
        {
            title: "Next Greater Element I",
            description: "The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/next-greater-element-i/"
        },
        {
            title: "Largest Rectangle in Histogram",
            description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/"
        }
    ],

    'recursion': [
        {
            title: "Climbing Stairs",
            description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/"
        },
        {
            title: "Pow(x, n)",
            description: "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/powx-n/"
        },
        {
            title: "N-Queens",
            description: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/n-queens/"
        }
    ],

    'queues': [
        {
            title: "Implement Queue using Stacks",
            description: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/implement-queue-using-stacks/"
        },
        {
            title: "Design Circular Queue",
            description: "Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO principle.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/design-circular-queue/"
        },
        {
            title: "Sliding Window Maximum",
            description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/sliding-window-maximum/"
        }
    ],

    'dynamic-memory': [
        {
            title: "Two Sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/two-sum/"
        },
        {
            title: "3Sum",
            description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/3sum/"
        },
        {
            title: "4Sum",
            description: "Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a, b, c, and d are distinct, and nums[a] + nums[b] + nums[c] + nums[d] == target.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/4sum/"
        }
    ],

    'linked-lists': [
        {
            title: "Reverse Linked List",
            description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/"
        },
        {
            title: "Merge Two Sorted Lists",
            description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/"
        },
        {
            title: "Remove Nth Node From End of List",
            description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"
        },
        {
            title: "Linked List Cycle II",
            description: "Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle-ii/"
        },
        {
            title: "Merge k Sorted Lists",
            description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/"
        }
    ],

    'circular-dll': [
        {
            title: "Flatten a Multilevel Doubly Linked List",
            description: "You are given a doubly linked list, which contains nodes that have a next pointer, a previous pointer, and an additional child pointer.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/"
        },
        {
            title: "Copy List with Random Pointer",
            description: "A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/copy-list-with-random-pointer/"
        },
        {
            title: "LRU Cache",
            description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/lru-cache/"
        }
    ],

    'trees-intro': [
        {
            title: "Maximum Depth of Binary Tree",
            description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
        },
        {
            title: "Symmetric Tree",
            description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/symmetric-tree/"
        },
        {
            title: "Validate Binary Search Tree",
            description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/"
        },
        {
            title: "Binary Tree Maximum Path Sum",
            description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Return the maximum path sum.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/"
        }
    ],

    'tree-operations': [
        {
            title: "Binary Tree Level Order Traversal",
            description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/"
        },
        {
            title: "Lowest Common Ancestor of a Binary Search Tree",
            description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"
        },
        {
            title: "Construct Binary Tree from Preorder and Inorder Traversal",
            description: "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"
        },
        {
            title: "Serialize and Deserialize Binary Tree",
            description: "Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
        }
    ],

    'heaps': [
        {
            title: "Kth Largest Element in an Array",
            description: "Given an integer array nums and an integer k, return the kth largest element in the array.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/"
        },
        {
            title: "Top K Frequent Elements",
            description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/"
        },
        {
            title: "Find Median from Data Stream",
            description: "The median is the middle value in an ordered integer list. Design a data structure that supports the following two operations: void addNum(int num) and double findMedian().",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/"
        }
    ],

    'threaded-trees': [
        {
            title: "Binary Tree Inorder Traversal",
            description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/"
        },
        {
            title: "Binary Tree Postorder Traversal",
            description: "Given the root of a binary tree, return the postorder traversal of its nodes' values.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/binary-tree-postorder-traversal/"
        },
        {
            title: "Recover Binary Search Tree",
            description: "You are given the root of a binary search tree (BST), where the values of exactly two nodes of the tree were swapped by mistake. Recover the tree without changing its structure.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/recover-binary-search-tree/"
        }
    ],

    'balanced-trees': [
        {
            title: "Implement Trie (Prefix Tree)",
            description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/"
        },
        {
            title: "Word Search II",
            description: "Given an m x n board of characters and a list of strings words, return all words on the board.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/word-search-ii/"
        },
        {
            title: "Design Add and Search Words Data Structure",
            description: "Design a data structure that supports adding new words and finding if a string matches any previously added string.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/design-add-and-search-words-data-structure/"
        }
    ],

    'graphs': [
        {
            title: "Number of Islands",
            description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/number-of-islands/"
        },
        {
            title: "Clone Graph",
            description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/clone-graph/"
        },
        {
            title: "Course Schedule",
            description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/course-schedule/"
        },
        {
            title: "Word Ladder",
            description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/word-ladder/"
        }
    ],

    'hashing': [
        {
            title: "Two Sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            difficulty: "beginner",
            leetcodeUrl: "https://leetcode.com/problems/two-sum/"
        },
        {
            title: "Group Anagrams",
            description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/group-anagrams/"
        },
        {
            title: "Longest Consecutive Sequence",
            description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
            difficulty: "intermediate",
            leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/"
        },
        {
            title: "Design Twitter",
            description: "Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the 10 most recent tweets in the user's news feed.",
            difficulty: "hard",
            leetcodeUrl: "https://leetcode.com/problems/design-twitter/"
        }
    ]
};
