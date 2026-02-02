/**
 * Database Management Systems Complete Curriculum
 * Based on VTU Syllabus (CD252IA) - 45L+30P Hours
 * YouTube Playlist: Gate Smashers DBMS
 */

export const DBMS_CURRICULUM = {
    subject: "Database Systems",
    description: "Complete Database Management Systems from fundamentals to NoSQL and Big Data",

    nodes: [
        // ==================== UNIT I ====================
        {
            id: 'dbms-intro',
            label: 'Database Introduction',
            description: 'Database users, Characteristics, Data Models, and Three-schema Architecture',
            level: 1,
            prereqs: [],
            domain: 'Foundation',
            x: 100,
            y: 200,
            videos: [
                {
                    title: 'Introduction to DBMS',
                    url: 'https://www.youtube.com/watch?v=kBdlM6hNDAE',
                    duration: '15:23',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Database System Architecture',
                    url: 'https://www.youtube.com/watch?v=GKl-bqzVjI0',
                    duration: '12:45',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Databases and Database Users',
                'Characteristics of Database Approach',
                'Data Models, Schemas and Instances',
                'Three-schema Architecture',
                'Data Independence',
                'Database System Environment'
            ],
            difficulty: 'beginner'
        },
        {
            id: 'er-modeling',
            label: 'ER Modeling',
            description: 'Entity-Relationship Model for Database Design',
            level: 1,
            prereqs: ['dbms-intro'],
            domain: 'Foundation',
            x: 300,
            y: 200,
            videos: [
                {
                    title: 'ER Model Basics',
                    url: 'https://www.youtube.com/watch?v=xsg9BDiwiJE',
                    duration: '18:42',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'ER Diagrams and Relationships',
                    url: 'https://www.youtube.com/watch?v=-CuY5ADwn24',
                    duration: '16:30',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'High-Level Conceptual Data Models',
                'Sample Database Application',
                'Entity Types, Entity Sets',
                'Attributes and Keys',
                'Relationship Types, Roles and Structural Constraints',
                'Weak Entity Types'
            ],
            difficulty: 'intermediate'
        },

        // ==================== UNIT II ====================
        {
            id: 'er-to-relational',
            label: 'ER to Relational Mapping',
            description: 'Converting ER Diagrams to Relational Database Schema',
            level: 2,
            prereqs: ['er-modeling'],
            domain: 'Database Design',
            x: 500,
            y: 150,
            videos: [
                {
                    title: 'ER to Relational Mapping',
                    url: 'https://www.youtube.com/watch?v=NvrpuBAMddw',
                    duration: '20:15',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'ER Diagrams',
                'Naming Conventions',
                'Design Issues',
                'ER-to-Relational Mapping'
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'relational-model',
            label: 'Relational Model',
            description: 'Relational Model Concepts, Constraints, and Operations',
            level: 2,
            prereqs: ['er-to-relational'],
            domain: 'Database Design',
            x: 500,
            y: 300,
            videos: [
                {
                    title: 'Relational Model Concepts',
                    url: 'https://www.youtube.com/watch?v=NvrpuBAMddw',
                    duration: '22:10',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Relational Algebra',
                    url: 'https://www.youtube.com/watch?v=kxuJUlD64Ts',
                    duration: '25:30',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Relational Model Concepts',
                'Relational Model Constraints',
                'Relational Database Schemas',
                'Update Operations and Constraint Violations',
                'Unary Relational Operations: SELECT, PROJECT',
                'Relational Algebra Operations: JOIN, DIVISION',
                'Binary Operations',
                'Examples of Queries in Relational Algebra'
            ],
            difficulty: 'intermediate'
        },

        // ==================== UNIT III ====================
        {
            id: 'sql-basics',
            label: 'SQL Basics',
            description: 'SQL Data Definition, Constraints, and Basic Queries',
            level: 3,
            prereqs: ['relational-model'],
            domain: 'SQL',
            x: 700,
            y: 200,
            videos: [
                {
                    title: 'SQL Introduction',
                    url: 'https://www.youtube.com/watch?v=zbMHLJ0dY4w',
                    duration: '16:20',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'SQL DDL Commands',
                    url: 'https://www.youtube.com/watch?v=Cz3WcZLRaWc',
                    duration: '14:40',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'SQL DML Commands',
                    url: 'https://www.youtube.com/watch?v=9Pzj7Aj25lw',
                    duration: '18:25',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'SQL Data Definition',
                'Specifying Constraints in SQL',
                'Basic Queries in SQL',
                'INSERT, DELETE, UPDATE Statements',
                'More Complex SQL Queries'
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'normalization',
            label: 'Database Normalization',
            description: 'Functional Dependencies, Normal Forms, and Decomposition',
            level: 3,
            prereqs: ['relational-model'],
            domain: 'Database Design',
            x: 700,
            y: 350,
            videos: [
                {
                    title: 'Functional Dependencies',
                    url: 'https://www.youtube.com/watch?v=NNjUhvvwOrk',
                    duration: '17:15',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Normalization - 1NF, 2NF, 3NF',
                    url: 'https://www.youtube.com/watch?v=ABwD8IYByfk',
                    duration: '22:30',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'BCNF and Higher Normal Forms',
                    url: 'https://www.youtube.com/watch?v=mUtAPbb1ECM',
                    duration: '19:45',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Functional Dependencies',
                'Inference Rules',
                'Equivalence of Sets of FDs',
                'Minimal Sets of FDs',
                'Normal Forms Based on Primary Keys',
                'General Definitions of 2NF and 3NF',
                'Boyce-Codd Normal Form',
                'Properties of Relational Decompositions'
            ],
            difficulty: 'advanced'
        },

        // ==================== UNIT IV ====================
        {
            id: 'transactions',
            label: 'Transaction Processing',
            description: 'Transaction Concepts, States, Schedules, and Serializability',
            level: 4,
            prereqs: ['sql-basics'],
            domain: 'Transaction Management',
            x: 900,
            y: 200,
            videos: [
                {
                    title: 'Transaction Processing Concepts',
                    url: 'https://www.youtube.com/watch?v=P80Js_qClUE',
                    duration: '18:50',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Serializability',
                    url: 'https://www.youtube.com/watch?v=qx_7ZdlDIGQ',
                    duration: '20:15',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Introduction to Transaction Processing',
                'Transaction States',
                'Desirable Properties of Transactions',
                'Schedules of Transactions',
                'Characterizing Schedules Based on Serializability',
                'Serial, Non-serial and Conflict-Serializable Schedules',
                'Testing for Conflict Serializability'
            ],
            difficulty: 'advanced'
        },
        {
            id: 'concurrency-control',
            label: 'Concurrency Control',
            description: 'Two-phase Locking, Deadlock Handling, and System Lock Tables',
            level: 4,
            prereqs: ['transactions'],
            domain: 'Transaction Management',
            x: 900,
            y: 350,
            videos: [
                {
                    title: 'Concurrency Control Techniques',
                    url: 'https://www.youtube.com/watch?v=qx_7ZdlDIGQ',
                    duration: '22:40',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Two-Phase Locking Protocol',
                    url: 'https://www.youtube.com/watch?v=9xSx2TcPXhI',
                    duration: '16:25',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Two-phase Locking Techniques',
                'Concurrency Control',
                'Types of Locks',
                'System Lock Tables'
            ],
            difficulty: 'advanced'
        },

        // ==================== UNIT V ====================
        {
            id: 'nosql',
            label: 'NoSQL Databases',
            description: 'Aggregate Data Models, Distribution Models, and Replication',
            level: 5,
            prereqs: ['transactions'],
            domain: 'NoSQL & Big Data',
            x: 1100,
            y: 150,
            videos: [
                {
                    title: 'Introduction to NoSQL',
                    url: 'https://www.youtube.com/watch?v=0buKQHokLK8',
                    duration: '19:30',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'NoSQL Data Models',
                    url: 'https://www.youtube.com/watch?v=xQnIN9bW0og',
                    duration: '17:20',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Aggregate Data Models',
                'Aggregates',
                'Key-value and Document Data Models',
                'Distribution Models: Sharding',
                'Master-slave Replication',
                'Peer-peer Replication',
                'Combining Sharding and Replication'
            ],
            difficulty: 'advanced'
        },
        {
            id: 'big-data',
            label: 'Big Data',
            description: 'Big Data Types, Distributed Architectures, Hadoop, and MapReduce',
            level: 5,
            prereqs: ['nosql'],
            domain: 'NoSQL & Big Data',
            x: 1100,
            y: 300,
            videos: [
                {
                    title: 'Big Data Introduction',
                    url: 'https://www.youtube.com/watch?v=9kJxAqpIgTk',
                    duration: '15:40',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Hadoop and MapReduce',
                    url: 'https://www.youtube.com/watch?v=aReuLtY0YMI',
                    duration: '21:15',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Types of Data: Structured, Semi-structured, Unstructured',
                'Distributed Architectures: Hadoop',
                'Map Reduce Programming Model'
            ],
            difficulty: 'advanced'
        }
    ]
};

// Quizzes based on standard DBMS concepts
export const DBMS_QUIZZES = {
    'dbms-intro': [
        {
            question: "What is the main advantage of the database approach over file systems?",
            options: ["Faster processing", "Data redundancy control", "Simpler programming", "Less storage space"],
            correct: 1,
            explanation: "Database systems control data redundancy by storing data in a centralized manner, reducing duplication."
        },
        {
            question: "Which level of the three-schema architecture describes the logical structure of the entire database?",
            options: ["External Schema", "Conceptual Schema", "Internal Schema", "Physical Schema"],
            correct: 1,
            explanation: "The Conceptual Schema describes the logical structure of the entire database for all users."
        },
        {
            question: "What does data independence mean?",
            options: [
                "Data can be accessed independently",
                "Changes to schema at one level don't affect other levels",
                "Data is stored independently",
                "Multiple users can access data independently"
            ],
            correct: 1,
            explanation: "Data independence means that changes to the schema at one level don't require changes at the next higher level."
        }
    ],

    'er-modeling': [
        {
            question: "In an ER diagram, what shape represents an entity?",
            options: ["Circle", "Rectangle", "Diamond", "Oval"],
            correct: 1,
            explanation: "Entities are represented by rectangles in ER diagrams."
        },
        {
            question: "What is a weak entity?",
            options: [
                "An entity with few attributes",
                "An entity that cannot exist without another entity",
                "An entity with weak relationships",
                "An entity with no primary key"
            ],
            correct: 1,
            explanation: "A weak entity is one that cannot be uniquely identified by its own attributes alone and depends on a strong entity."
        },
        {
            question: "What does cardinality in relationships specify?",
            options: [
                "Number of attributes",
                "Number of entities that can participate in a relationship",
                "Number of relationships",
                "Number of keys"
            ],
            correct: 1,
            explanation: "Cardinality specifies the number of entity instances that can participate in a relationship (1:1, 1:N, M:N)."
        }
    ],

    'er-to-relational': [
        {
            question: "When mapping a 1:N relationship to relations, where is the foreign key placed?",
            options: [
                "In the '1' side entity",
                "In the 'N' side entity",
                "In a separate relation",
                "In both entities"
            ],
            correct: 1,
            explanation: "For 1:N relationships, the foreign key is placed in the relation on the 'N' side, referencing the '1' side."
        },
        {
            question: "How is an M:N relationship typically mapped to relations?",
            options: [
                "As a single relation",
                "As two relations",
                "As three relations (two for entities, one for relationship)",
                "Cannot be mapped"
            ],
            correct: 2,
            explanation: "M:N relationships require a separate relation (relationship table) in addition to the two entity relations."
        }
    ],

    'relational-model': [
        {
            question: "What is a candidate key?",
            options: [
                "A key that might become primary",
                "A minimal superkey",
                "A foreign key",
                "An alternate key"
            ],
            correct: 1,
            explanation: "A candidate key is a minimal superkey - a set of attributes that uniquely identifies tuples with no redundant attributes."
        },
        {
            question: "Which relational algebra operation is equivalent to SQL's WHERE clause?",
            options: ["PROJECT", "SELECT", "JOIN", "UNION"],
            correct: 1,
            explanation: "The SELECT operation in relational algebra filters rows based on conditions, similar to SQL's WHERE clause."
        },
        {
            question: "What does the JOIN operation do?",
            options: [
                "Combines columns from two tables",
                "Combines rows from two tables based on a related column",
                "Adds new rows",
                "Removes duplicates"
            ],
            correct: 1,
            explanation: "JOIN combines rows from two or more tables based on a related column between them."
        }
    ],

    'sql-basics': [
        {
            question: "Which SQL command is used to create a new table?",
            options: ["CREATE TABLE", "NEW TABLE", "ADD TABLE", "MAKE TABLE"],
            correct: 0,
            explanation: "CREATE TABLE is the SQL DDL command used to create a new table structure."
        },
        {
            question: "What does the DISTINCT keyword do in SQL?",
            options: [
                "Sorts results",
                "Removes duplicate rows",
                "Filters rows",
                "Joins tables"
            ],
            correct: 1,
            explanation: "DISTINCT removes duplicate rows from the result set, returning only unique rows."
        },
        {
            question: "Which clause is used to filter groups in SQL?",
            options: ["WHERE", "FILTER", "HAVING", "GROUP"],
            correct: 2,
            explanation: "HAVING clause is used to filter groups after GROUP BY, while WHERE filters individual rows."
        }
    ],

    'normalization': [
        {
            question: "What is the main purpose of normalization?",
            options: [
                "Increase data redundancy",
                "Eliminate data redundancy and anomalies",
                "Improve query speed",
                "Reduce storage space"
            ],
            correct: 1,
            explanation: "Normalization eliminates data redundancy and prevents update, insertion, and deletion anomalies."
        },
        {
            question: "A relation is in 2NF if:",
            options: [
                "It is in 1NF and has no partial dependencies",
                "It has a primary key",
                "It has no transitive dependencies",
                "All attributes are atomic"
            ],
            correct: 0,
            explanation: "2NF requires 1NF plus elimination of partial dependencies (non-prime attributes fully dependent on entire candidate key)."
        },
        {
            question: "What is a transitive dependency?",
            options: [
                "A → B and B → C, therefore A → C",
                "Direct dependency",
                "Partial dependency",
                "Full dependency"
            ],
            correct: 0,
            explanation: "Transitive dependency occurs when A → B and B → C, implying A → C indirectly."
        },
        {
            question: "BCNF is stricter than 3NF because:",
            options: [
                "It allows no dependencies",
                "Every determinant must be a candidate key",
                "It requires more tables",
                "It eliminates all redundancy"
            ],
            correct: 1,
            explanation: "In BCNF, for every functional dependency X → Y, X must be a candidate key (superkey)."
        }
    ],

    'transactions': [
        {
            question: "Which property ensures that a transaction is treated as a single unit?",
            options: ["Atomicity", "Consistency", "Isolation", "Durability"],
            correct: 0,
            explanation: "Atomicity ensures that a transaction is all-or-nothing - either all operations complete or none do."
        },
        {
            question: "What does serializability guarantee?",
            options: [
                "Transactions execute one at a time",
                "Concurrent execution produces same result as serial execution",
                "No deadlocks occur",
                "Transactions never fail"
            ],
            correct: 1,
            explanation: "Serializability ensures that concurrent transaction execution produces the same result as some serial execution."
        },
        {
            question: "Which is NOT a transaction state?",
            options: ["Active", "Partially Committed", "Committed", "Waiting"],
            correct: 3,
            explanation: "Transaction states are: Active, Partially Committed, Committed, Failed, and Aborted. 'Waiting' is not a standard state."
        }
    ],

    'concurrency-control': [
        {
            question: "What is the purpose of two-phase locking?",
            options: [
                "Improve performance",
                "Ensure serializability",
                "Prevent deadlocks",
                "Reduce lock overhead"
            ],
            correct: 1,
            explanation: "Two-phase locking (2PL) ensures conflict serializability by having growing and shrinking phases for locks."
        },
        {
            question: "In two-phase locking, what are the two phases?",
            options: [
                "Read and Write",
                "Lock and Unlock",
                "Growing and Shrinking",
                "Begin and Commit"
            ],
            correct: 2,
            explanation: "2PL has a Growing phase (acquiring locks) and a Shrinking phase (releasing locks). No new locks after first release."
        },
        {
            question: "What is a deadlock?",
            options: [
                "A transaction that never commits",
                "Two or more transactions waiting for each other indefinitely",
                "A failed transaction",
                "A locked database"
            ],
            correct: 1,
            explanation: "Deadlock occurs when two or more transactions are waiting for each other to release locks, creating a cycle."
        }
    ],

    'nosql': [
        {
            question: "What is an aggregate in NoSQL?",
            options: [
                "A sum of values",
                "A collection of related objects treated as a unit",
                "A type of query",
                "A database index"
            ],
            correct: 1,
            explanation: "An aggregate is a collection of related objects that we wish to treat as a unit for data manipulation and consistency."
        },
        {
            question: "Which NoSQL database type uses key-value pairs?",
            options: ["Document stores", "Column-family stores", "Key-value stores", "All of the above"],
            correct: 2,
            explanation: "Key-value stores (like Redis, DynamoDB) use simple key-value pairs for data storage."
        },
        {
            question: "What is sharding?",
            options: [
                "Data backup",
                "Horizontal partitioning of data across multiple servers",
                "Data encryption",
                "Data compression"
            ],
            correct: 1,
            explanation: "Sharding is horizontal partitioning where data is distributed across multiple servers to improve scalability."
        }
    ],

    'big-data': [
        {
            question: "Which of the following is unstructured data?",
            options: ["Relational database tables", "CSV files", "Videos and images", "XML documents"],
            correct: 2,
            explanation: "Videos, images, and text documents are unstructured data with no predefined schema."
        },
        {
            question: "What is the main component of Hadoop for distributed storage?",
            options: ["MapReduce", "HDFS", "YARN", "Hive"],
            correct: 1,
            explanation: "HDFS (Hadoop Distributed File System) is the storage component of Hadoop."
        },
        {
            question: "In MapReduce, what does the Map function do?",
            options: [
                "Combines results",
                "Processes input and produces key-value pairs",
                "Sorts data",
                "Stores data"
            ],
            correct: 1,
            explanation: "The Map function processes input data and emits intermediate key-value pairs for the Reduce phase."
        }
    ]
};

// Exercises based on standard DBMS textbooks
export const DBMS_EXERCISES = {
    'dbms-intro': [
        {
            title: "Database vs File System",
            description: "List 5 advantages of database systems over traditional file systems.",
            difficulty: "beginner"
        },
        {
            title: "Three-Schema Architecture",
            description: "Draw and explain the three-schema architecture with examples of each level.",
            difficulty: "beginner"
        }
    ],

    'er-modeling': [
        {
            title: "Design ER Diagram for Library",
            description: "Create an ER diagram for a library system with entities: Book, Author, Member, Loan.",
            difficulty: "medium"
        },
        {
            title: "Identify Weak Entities",
            description: "In a university database with Student, Course, and Enrollment, identify weak entities and explain why.",
            difficulty: "intermediate"
        },
        {
            title: "Company Database ER Diagram",
            description: "Design an ER diagram for a company with Employees, Departments, Projects, and Dependents.",
            difficulty: "medium"
        }
    ],

    'er-to-relational': [
        {
            title: "Map ER to Relations",
            description: "Convert the library ER diagram to relational schema with proper primary and foreign keys.",
            difficulty: "medium"
        },
        {
            title: "Handle M:N Relationships",
            description: "Map a Student-Course M:N relationship to relational tables including enrollment date and grade.",
            difficulty: "intermediate"
        }
    ],

    'relational-model': [
        {
            title: "Identify Keys",
            description: "Given a relation schema, identify all candidate keys, primary key, and foreign keys.",
            input: "Student(StudentID, Name, Email, DeptID, AdvisorID)",
            difficulty: "beginner"
        },
        {
            title: "Relational Algebra Queries",
            description: "Write relational algebra expressions for: Find all students in CS department, Find students with GPA > 3.5",
            difficulty: "medium"
        },
        {
            title: "JOIN Operations",
            description: "Perform natural join, equijoin, and outer join on given Employee and Department tables.",
            difficulty: "intermediate"
        }
    ],

    'sql-basics': [
        {
            title: "Create Database Schema",
            description: "Write SQL DDL statements to create tables for a university database with constraints.",
            difficulty: "beginner"
        },
        {
            title: "Basic SELECT Queries",
            description: "Write SQL queries to retrieve data with WHERE, ORDER BY, and DISTINCT clauses.",
            input: "Find all students from 'Computer Science' department, sorted by name",
            difficulty: "beginner"
        },
        {
            title: "Aggregate Functions",
            description: "Use COUNT, SUM, AVG, MAX, MIN with GROUP BY and HAVING clauses.",
            input: "Find average salary by department where average > 50000",
            expectedOutput: "SELECT Dept, AVG(Salary) FROM Employee GROUP BY Dept HAVING AVG(Salary) > 50000",
            difficulty: "medium"
        },
        {
            title: "Nested Queries",
            description: "Write SQL queries using subqueries in WHERE, FROM, and SELECT clauses.",
            difficulty: "hard"
        },
        {
            title: "JOIN Queries",
            description: "Write SQL queries using INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
            difficulty: "medium"
        }
    ],

    'normalization': [
        {
            title: "Find Functional Dependencies",
            description: "Given a relation, identify all functional dependencies.",
            input: "Student(ID, Name, Course, Instructor, Room)",
            difficulty: "medium"
        },
        {
            title: "Normalize to 3NF",
            description: "Normalize a given unnormalized relation to 1NF, 2NF, and 3NF showing each step.",
            difficulty: "hard"
        },
        {
            title: "BCNF Decomposition",
            description: "Decompose a relation in 3NF to BCNF if needed, preserving dependencies.",
            difficulty: "hard"
        },
        {
            title: "Closure of Attributes",
            description: "Find the closure of a set of attributes given functional dependencies.",
            input: "FDs: {A→B, B→C, C→D}, Find closure of {A}",
            expectedOutput: "{A, B, C, D}",
            difficulty: "medium"
        }
    ],

    'transactions': [
        {
            title: "ACID Properties",
            description: "Explain each ACID property with real-world examples.",
            difficulty: "beginner"
        },
        {
            title: "Schedule Analysis",
            description: "Given a schedule of transactions, determine if it is serial, serializable, or non-serializable.",
            difficulty: "hard"
        },
        {
            title: "Conflict Serializability",
            description: "Draw precedence graph and determine if a schedule is conflict serializable.",
            difficulty: "hard"
        }
    ],

    'concurrency-control': [
        {
            title: "Two-Phase Locking",
            description: "Apply 2PL protocol to a set of transactions and show lock acquisition/release.",
            difficulty: "hard"
        },
        {
            title: "Deadlock Detection",
            description: "Create a wait-for graph and detect deadlocks in a given scenario.",
            difficulty: "hard"
        },
        {
            title: "Timestamp Ordering",
            description: "Apply timestamp-based concurrency control to resolve conflicts.",
            difficulty: "hard"
        }
    ],

    'nosql': [
        {
            title: "SQL vs NoSQL",
            description: "Compare SQL and NoSQL databases in terms of schema, scalability, and use cases.",
            difficulty: "beginner"
        },
        {
            title: "Choose NoSQL Type",
            description: "For given scenarios (social media, caching, analytics), recommend appropriate NoSQL database type.",
            difficulty: "intermediate"
        },
        {
            title: "Design Document Store Schema",
            description: "Design a MongoDB schema for an e-commerce application with products, orders, and users.",
            difficulty: "medium"
        }
    ],

    'big-data': [
        {
            title: "MapReduce Word Count",
            description: "Write pseudocode for Map and Reduce functions to count word frequencies in documents.",
            difficulty: "medium"
        },
        {
            title: "HDFS Architecture",
            description: "Explain HDFS architecture with NameNode, DataNode, and replication strategy.",
            difficulty: "intermediate"
        },
        {
            title: "Big Data Use Cases",
            description: "Identify 3 real-world big data applications and explain the data characteristics.",
            difficulty: "beginner"
        }
    ]
};
