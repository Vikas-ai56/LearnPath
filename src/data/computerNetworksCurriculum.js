/**
 * Computer Networks Complete Curriculum
 * Based on VTU Syllabus (CY245AT) - 45L Hours
 * YouTube Playlist: Gate Smashers Computer Networks
 */

export const CN_CURRICULUM = {
    subject: "Computer Networks",
    description: "Complete Computer Networks from fundamentals to advanced protocols",

    nodes: [
        // ==================== UNIT I ====================
        {
            id: 'cn-intro',
            label: 'Network Basics',
            description: 'Introduction to Networks, Business Domains, and Applications',
            level: 1,
            prereqs: [],
            domain: 'Foundation',
            x: 100,
            y: 200,
            videos: [
                {
                    title: 'Introduction to Computer Networks',
                    url: 'https://www.youtube.com/watch?v=JFF2vJaN0Cw',
                    duration: '14:32',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Network Types and Applications',
                    url: 'https://www.youtube.com/watch?v=cNwEVYkx2Kk',
                    duration: '12:15',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Business Domains: Networks',
                'Resource Sharing Applications',
                'Client-Server Programming',
                'E-commerce and Digital Communications'
            ],
            difficulty: 'beginner'
        },
        {
            id: 'network-models',
            label: 'Network Models',
            description: 'TCP/IP Protocol, OSI Model, and Network Architecture',
            level: 1,
            prereqs: ['cn-intro'],
            domain: 'Foundation',
            x: 300,
            y: 200,
            videos: [
                {
                    title: 'OSI Model Explained',
                    url: 'https://www.youtube.com/watch?v=vv4y_uOneC0',
                    duration: '18:42',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'TCP/IP Model',
                    url: 'https://www.youtube.com/watch?v=F5rni9fr1yE',
                    duration: '15:30',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'TCP/IP Protocol',
                'OSI Model (7 Layers)',
                'Network Types',
                'Transmission Modes'
            ],
            difficulty: 'beginner'
        },
        {
            id: 'data-link-layer',
            label: 'Data Link Layer',
            description: 'DLC, Services, Protocols, HDLC, PPP, and MAC',
            level: 1,
            prereqs: ['network-models'],
            domain: 'Foundation',
            x: 500,
            y: 200,
            videos: [
                {
                    title: 'Data Link Layer',
                    url: 'https://www.youtube.com/watch?v=sF-tBmQTTxE',
                    duration: '16:20',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'HDLC Protocol',
                    url: 'https://www.youtube.com/watch?v=7mZNcDhWPUo',
                    duration: '12:40',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'MAC Protocols - CSMA/CD and CSMA/CA',
                    url: 'https://www.youtube.com/watch?v=vDMYttkLdoY',
                    duration: '14:25',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Data Link Control (DLC)',
                'DLC Services',
                'Data Link Layer Protocols',
                'HDLC',
                'Point-to-Point Protocol (PPP)',
                'Framing and Transition Phases',
                'MAC: Random Access',
                'CSMA/CD, CSMA/CA'
            ],
            difficulty: 'intermediate'
        },

        // ==================== UNIT II ====================
        {
            id: 'network-layer',
            label: 'Network Layer Design',
            description: 'Packet Switching, Connectionless Service, and Virtual Circuits',
            level: 2,
            prereqs: ['data-link-layer'],
            domain: 'Network Layer',
            x: 700,
            y: 150,
            videos: [
                {
                    title: 'Network Layer Introduction',
                    url: 'https://www.youtube.com/watch?v=92bPvAJL6VY',
                    duration: '15:10',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Circuit Switching vs Packet Switching',
                    url: 'https://www.youtube.com/watch?v=37AFBZv4_6Y',
                    duration: '13:30',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Store and Forward Packet Switching',
                'Services to Transport Layer',
                'Connectionless Service',
                'Connection-Oriented Service',
                'Virtual Circuits vs Datagrams'
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'routing-algorithms',
            label: 'Routing Algorithms',
            description: 'Shortest Path, Flooding, Distance Vector, Link State, Hierarchical Routing',
            level: 2,
            prereqs: ['network-layer'],
            domain: 'Network Layer',
            x: 700,
            y: 300,
            videos: [
                {
                    title: 'Routing Algorithms',
                    url: 'https://www.youtube.com/watch?v=XEb7_z5dG88',
                    duration: '22:10',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Distance Vector Routing',
                    url: 'https://www.youtube.com/watch?v=x9WIQbaVPzY',
                    duration: '18:25',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Link State Routing',
                    url: 'https://www.youtube.com/watch?v=_lP1NLMPKhY',
                    duration: '16:50',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Shortest Path Routing',
                'Flooding',
                'Distance Vector Routing',
                'Link State Routing',
                'Hierarchical Routing',
                'Broadcast Routing',
                'Multicast Routing'
            ],
            difficulty: 'advanced'
        },

        // ==================== UNIT III ====================
        {
            id: 'congestion-control',
            label: 'Congestion Control',
            description: 'Congestion principles, policies, and Quality of Service',
            level: 3,
            prereqs: ['routing-algorithms'],
            domain: 'Transport & QoS',
            x: 900,
            y: 200,
            videos: [
                {
                    title: 'Congestion Control',
                    url: 'https://www.youtube.com/watch?v=0q9y7Rz8Y-A',
                    duration: '17:15',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Quality of Service (QoS)',
                    url: 'https://www.youtube.com/watch?v=vLQTJ_pMBQs',
                    duration: '14:30',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'General Principles of Congestion Control',
                'Congestion Prevention Policies',
                'Virtual-Circuit Subnets',
                'Datagram Subnets',
                'Load Shedding',
                'Jitter Control',
                'Quality of Service Requirements',
                'Techniques for Good QoS',
                'Integrated Services',
                'Differentiated Services'
            ],
            difficulty: 'advanced'
        },

        // ==================== UNIT IV ====================
        {
            id: 'internetworking',
            label: 'Internetworking',
            description: 'Network connections, Tunneling, Internetwork Routing, Fragmentation',
            level: 4,
            prereqs: ['network-layer'],
            domain: 'Internet Layer',
            x: 1100,
            y: 100,
            videos: [
                {
                    title: 'Internetworking Concepts',
                    url: 'https://www.youtube.com/watch?v=g8ORHqhZMqo',
                    duration: '15:40',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'Tunneling in Networks',
                    url: 'https://www.youtube.com/watch?v=9KD-2ZbvJy8',
                    duration: '12:20',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'How Networks Differ',
                'Network Connection Methods',
                'Connectionless Internetworking',
                'Tunneling',
                'Internetwork Routing',
                'Fragmentation'
            ],
            difficulty: 'advanced'
        },
        {
            id: 'network-layer-internet',
            label: 'Internet Network Layer',
            description: 'IP Protocol, IP Addresses, ICMP, OSPF, BGP, IPv6',
            level: 4,
            prereqs: ['internetworking'],
            domain: 'Internet Layer',
            x: 1100,
            y: 250,
            videos: [
                {
                    title: 'IP Addressing',
                    url: 'https://www.youtube.com/watch?v=ddM9AcreVqY',
                    duration: '20:15',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'ICMP Protocol',
                    url: 'https://www.youtube.com/watch?v=1JJLBhxzqrE',
                    duration: '13:25',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'OSPF Routing Protocol',
                    url: 'https://www.youtube.com/watch?v=kfvJ8QVJscc',
                    duration: '18:50',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'BGP Protocol',
                    url: 'https://www.youtube.com/watch?v=_Z29ZzKeZHc',
                    duration: '16:30',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'IPv6 Introduction',
                    url: 'https://www.youtube.com/watch?v=ThdO9beHhpA',
                    duration: '14:40',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'IP Protocol',
                'IP Addresses',
                'Internet Control Protocols',
                'OSPF - Interior Gateway Routing',
                'BGP - Exterior Gateway Routing',
                'IPv6'
            ],
            difficulty: 'advanced'
        },

        // ==================== UNIT V ====================
        {
            id: 'transport-protocols',
            label: 'Transport Protocols',
            description: 'UDP, TCP, TCP Service Model, Protocol, and Connection Management',
            level: 5,
            prereqs: ['network-layer-internet'],
            domain: 'Transport Layer',
            x: 1300,
            y: 150,
            videos: [
                {
                    title: 'Transport Layer Introduction',
                    url: 'https://www.youtube.com/watch?v=Vdc8TCESIg8',
                    duration: '15:20',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'UDP Protocol',
                    url: 'https://www.youtube.com/watch?v=ypOBGUj_FQw',
                    duration: '12:35',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'TCP Protocol Explained',
                    url: 'https://www.youtube.com/watch?v=F27PLin3TV0',
                    duration: '22:40',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'TCP 3-Way Handshake',
                    url: 'https://www.youtube.com/watch?v=LyDqA-dAPW4',
                    duration: '14:15',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'Introduction to UDP',
                'Introduction to TCP',
                'TCP Service Model',
                'TCP Protocol',
                'TCP Segment Header',
                'TCP Connection Establishment',
                'TCP Connection Release',
                'TCP Transmission Policy',
                'TCP Congestion Control',
                'TCP Timer Management'
            ],
            difficulty: 'advanced'
        },
        {
            id: 'application-layer',
            label: 'Application Layer',
            description: 'World Wide Web, HTTP, and Telnet',
            level: 5,
            prereqs: ['transport-protocols'],
            domain: 'Application Layer',
            x: 1300,
            y: 300,
            videos: [
                {
                    title: 'Application Layer Protocols',
                    url: 'https://www.youtube.com/watch?v=nYROn4bBUqU',
                    duration: '16:25',
                    channel: 'Gate Smashers'
                },
                {
                    title: 'HTTP Protocol',
                    url: 'https://www.youtube.com/watch?v=0OrmKCB0UrQ',
                    duration: '18:30',
                    channel: 'Gate Smashers'
                }
            ],
            topics: [
                'World Wide Web',
                'HTTP Protocol',
                'Telnet'
            ],
            difficulty: 'intermediate'
        }
    ]
};

// Quizzes based on standard CN concepts
export const CN_QUIZZES = {
    'cn-intro': [
        {
            question: "What is the primary purpose of computer networks?",
            options: ["Data storage", "Resource sharing", "Data encryption", "File compression"],
            correct: 1,
            explanation: "Computer networks enable resource sharing including hardware, software, and data among connected devices."
        },
        {
            question: "Which application is NOT a typical use of computer networks?",
            options: ["Email", "File sharing", "Video conferencing", "Local file editing"],
            correct: 3,
            explanation: "Local file editing doesn't require network connectivity, while email, file sharing, and video conferencing do."
        },
        {
            question: "In client-server architecture, which statement is true?",
            options: [
                "Clients provide services to servers",
                "Servers provide services to clients",
                "All nodes are equal",
                "No central authority exists"
            ],
            correct: 1,
            explanation: "In client-server model, servers provide services and resources to client machines that request them."
        }
    ],

    'network-models': [
        {
            question: "How many layers are in the OSI model?",
            options: ["5", "6", "7", "8"],
            correct: 2,
            explanation: "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application."
        },
        {
            question: "Which layer of the OSI model is responsible for routing?",
            options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
            correct: 1,
            explanation: "The Network Layer (Layer 3) is responsible for routing packets across networks."
        },
        {
            question: "What is the correct order of data encapsulation in TCP/IP?",
            options: [
                "Data → Segment → Packet → Frame → Bits",
                "Data → Frame → Packet → Segment → Bits",
                "Bits → Frame → Packet → Segment → Data",
                "Data → Packet → Segment → Frame → Bits"
            ],
            correct: 0,
            explanation: "Data is segmented at Transport layer, packaged at Network layer, framed at Data Link layer, and converted to bits at Physical layer."
        }
    ],

    'data-link-layer': [
        {
            question: "What does CSMA/CD stand for?",
            options: [
                "Carrier Sense Multiple Access with Collision Detection",
                "Circuit Switched Multiple Access with Collision Detection",
                "Carrier Sense Media Access with Collision Domain",
                "Circuit Sense Multiple Access with Collision Domain"
            ],
            correct: 0,
            explanation: "CSMA/CD is Carrier Sense Multiple Access with Collision Detection, used in Ethernet networks."
        },
        {
            question: "Which protocol is used for point-to-point connections?",
            options: ["HDLC", "PPP", "Both HDLC and PPP", "Ethernet"],
            correct: 2,
            explanation: "Both HDLC (High-Level Data Link Control) and PPP (Point-to-Point Protocol) are used for point-to-point connections."
        },
        {
            question: "What is the main difference between CSMA/CD and CSMA/CA?",
            options: [
                "CD detects collisions, CA avoids them",
                "CD is for wireless, CA is for wired",
                "CD is faster than CA",
                "No difference"
            ],
            correct: 0,
            explanation: "CSMA/CD detects collisions after they occur (Ethernet), while CSMA/CA tries to avoid collisions before transmission (WiFi)."
        }
    ],

    'network-layer': [
        {
            question: "What is the main advantage of packet switching over circuit switching?",
            options: [
                "Guaranteed bandwidth",
                "Better resource utilization",
                "Lower latency",
                "Simpler implementation"
            ],
            correct: 1,
            explanation: "Packet switching allows better resource utilization as the link is shared among multiple connections dynamically."
        },
        {
            question: "In a virtual circuit network, what is established before data transfer?",
            options: ["Physical connection", "Logical path", "IP address", "MAC address"],
            correct: 1,
            explanation: "Virtual circuits establish a logical path through the network before data transfer begins."
        },
        {
            question: "Which service does NOT require connection setup?",
            options: ["Virtual Circuit", "Connection-Oriented", "Datagram", "Circuit Switching"],
            correct: 2,
            explanation: "Datagram (connectionless) service sends packets independently without prior connection setup."
        }
    ],

    'routing-algorithms': [
        {
            question: "Which routing algorithm uses Dijkstra's algorithm?",
            options: ["Distance Vector", "Link State", "Flooding", "Hierarchical"],
            correct: 1,
            explanation: "Link State routing uses Dijkstra's shortest path algorithm to compute routes."
        },
        {
            question: "What problem can occur in Distance Vector routing?",
            options: ["Routing loops", "Too much memory usage", "Slow convergence", "Both A and C"],
            correct: 3,
            explanation: "Distance Vector routing can suffer from routing loops and slow convergence, especially the count-to-infinity problem."
        },
        {
            question: "In flooding, how many times is a packet sent?",
            options: [
                "Once",
                "To all neighbors",
                "Only to the destination",
                "Twice for reliability"
            ],
            correct: 1,
            explanation: "In flooding, each router sends the packet to all its neighbors except the one it came from."
        }
    ],

    'congestion-control': [
        {
            question: "What is the primary goal of congestion control?",
            options: [
                "Increase bandwidth",
                "Prevent network overload",
                "Reduce packet size",
                "Increase routing speed"
            ],
            correct: 1,
            explanation: "Congestion control aims to prevent network overload by managing the rate of data transmission."
        },
        {
            question: "Which technique is used for congestion control?",
            options: ["Load shedding", "Traffic shaping", "Admission control", "All of the above"],
            correct: 3,
            explanation: "Load shedding, traffic shaping, and admission control are all congestion control techniques."
        },
        {
            question: "What is jitter in network communication?",
            options: [
                "Packet loss",
                "Variation in packet delay",
                "Network congestion",
                "Routing error"
            ],
            correct: 1,
            explanation: "Jitter is the variation in packet arrival times, which can affect real-time applications like VoIP."
        }
    ],

    'internetworking': [
        {
            question: "What is tunneling in computer networks?",
            options: [
                "Creating physical tunnels for cables",
                "Encapsulating one protocol within another",
                "Encrypting data",
                "Compressing packets"
            ],
            correct: 1,
            explanation: "Tunneling is the process of encapsulating packets of one protocol within packets of another protocol."
        },
        {
            question: "Why is fragmentation necessary?",
            options: [
                "To increase speed",
                "Different networks have different MTU sizes",
                "To reduce congestion",
                "To improve security"
            ],
            correct: 1,
            explanation: "Fragmentation is needed when packets are larger than the Maximum Transmission Unit (MTU) of a network."
        },
        {
            question: "Which device is used to connect different networks?",
            options: ["Hub", "Switch", "Router", "Repeater"],
            correct: 2,
            explanation: "Routers operate at the Network layer and connect different networks by routing packets between them."
        }
    ],

    'network-layer-internet': [
        {
            question: "What is the size of an IPv4 address?",
            options: ["16 bits", "32 bits", "64 bits", "128 bits"],
            correct: 1,
            explanation: "IPv4 addresses are 32 bits long, typically written as four decimal numbers separated by dots."
        },
        {
            question: "What protocol does 'ping' use?",
            options: ["TCP", "UDP", "ICMP", "ARP"],
            correct: 2,
            explanation: "The ping command uses ICMP (Internet Control Message Protocol) to test network connectivity."
        },
        {
            question: "Which routing protocol is an Interior Gateway Protocol?",
            options: ["BGP", "OSPF", "Both", "Neither"],
            correct: 1,
            explanation: "OSPF is an Interior Gateway Protocol used within an autonomous system, while BGP is an Exterior Gateway Protocol."
        },
        {
            question: "What is the size of an IPv6 address?",
            options: ["32 bits", "64 bits", "128 bits", "256 bits"],
            correct: 2,
            explanation: "IPv6 addresses are 128 bits long, providing a much larger address space than IPv4."
        }
    ],

    'transport-protocols': [
        {
            question: "Which protocol is connectionless?",
            options: ["TCP", "UDP", "Both", "Neither"],
            correct: 1,
            explanation: "UDP (User Datagram Protocol) is connectionless, while TCP is connection-oriented."
        },
        {
            question: "What is the purpose of the TCP 3-way handshake?",
            options: [
                "Data transfer",
                "Connection establishment",
                "Connection termination",
                "Error detection"
            ],
            correct: 1,
            explanation: "The TCP 3-way handshake (SYN, SYN-ACK, ACK) is used to establish a reliable connection between client and server."
        },
        {
            question: "Which TCP mechanism ensures reliable delivery?",
            options: ["Checksums", "Acknowledgments", "Sequence numbers", "All of the above"],
            correct: 3,
            explanation: "TCP uses checksums for error detection, acknowledgments for confirmation, and sequence numbers for ordering."
        },
        {
            question: "What happens during TCP connection release?",
            options: [
                "2-way handshake",
                "3-way handshake",
                "4-way handshake",
                "No handshake needed"
            ],
            correct: 2,
            explanation: "TCP connection termination uses a 4-way handshake (FIN, ACK, FIN, ACK) to gracefully close the connection."
        }
    ],

    'application-layer': [
        {
            question: "What port does HTTP use by default?",
            options: ["21", "22", "80", "443"],
            correct: 2,
            explanation: "HTTP uses port 80 by default, while HTTPS uses port 443."
        },
        {
            question: "Which HTTP method is used to retrieve data?",
            options: ["POST", "GET", "PUT", "DELETE"],
            correct: 1,
            explanation: "GET is used to retrieve data from a server, while POST is used to send data to the server."
        },
        {
            question: "What does Telnet provide?",
            options: [
                "File transfer",
                "Remote terminal access",
                "Email service",
                "Web browsing"
            ],
            correct: 1,
            explanation: "Telnet provides remote terminal access to another computer over a network."
        }
    ]
};

// Exercises based on standard CN problems
export const CN_EXERCISES = {
    'cn-intro': [
        {
            title: "Identify Network Applications",
            description: "List 5 real-world applications of computer networks and explain how they utilize network resources.",
            difficulty: "beginner"
        },
        {
            title: "Client-Server vs Peer-to-Peer",
            description: "Compare and contrast client-server and peer-to-peer architectures with examples.",
            difficulty: "beginner"
        }
    ],

    'network-models': [
        {
            title: "OSI Layer Functions",
            description: "For each OSI layer, describe its primary function and give one example protocol.",
            difficulty: "beginner"
        },
        {
            title: "Protocol Data Units",
            description: "Identify the PDU (Protocol Data Unit) at each layer of the OSI model.",
            input: "Application Layer data",
            expectedOutput: "Data → Segment → Packet → Frame → Bits",
            difficulty: "beginner"
        },
        {
            title: "OSI vs TCP/IP",
            description: "Create a comparison table showing how OSI layers map to TCP/IP layers.",
            difficulty: "intermediate"
        }
    ],

    'data-link-layer': [
        {
            title: "CSMA/CD Simulation",
            description: "Simulate a collision scenario in CSMA/CD and explain the backoff algorithm.",
            difficulty: "medium"
        },
        {
            title: "Frame Format Analysis",
            description: "Draw and label the frame format for Ethernet and PPP protocols.",
            difficulty: "intermediate"
        }
    ],

    'network-layer': [
        {
            title: "Packet vs Circuit Switching",
            description: "Calculate the total time to send a file using both packet switching and circuit switching.",
            input: "File size: 1 MB, Link speed: 1 Mbps, Propagation delay: 10 ms",
            difficulty: "medium"
        }
    ],

    'routing-algorithms': [
        {
            title: "Dijkstra's Algorithm",
            description: "Given a network topology, apply Dijkstra's algorithm to find the shortest path from source to all nodes.",
            difficulty: "hard"
        },
        {
            title: "Distance Vector Routing",
            description: "Simulate distance vector routing and show how routing tables are updated.",
            difficulty: "hard"
        },
        {
            title: "Count-to-Infinity Problem",
            description: "Demonstrate the count-to-infinity problem in distance vector routing and explain solutions.",
            difficulty: "hard"
        }
    ],

    'congestion-control': [
        {
            title: "Congestion Window Calculation",
            description: "Calculate TCP congestion window size using slow start and congestion avoidance algorithms.",
            difficulty: "hard"
        },
        {
            title: "QoS Parameters",
            description: "For a VoIP application, specify required QoS parameters (bandwidth, delay, jitter, packet loss).",
            difficulty: "medium"
        }
    ],

    'internetworking': [
        {
            title: "IP Fragmentation",
            description: "Given a packet size and MTU, calculate how the packet will be fragmented.",
            input: "Packet size: 4000 bytes, MTU: 1500 bytes",
            expectedOutput: "3 fragments with sizes and offsets",
            difficulty: "medium"
        }
    ],

    'network-layer-internet': [
        {
            title: "IP Address Classification",
            description: "Given IP addresses, classify them as Class A, B, C, D, or E and identify network and host portions.",
            input: "192.168.1.1, 10.0.0.1, 172.16.0.1",
            difficulty: "beginner"
        },
        {
            title: "Subnetting Exercise",
            description: "Divide a Class C network into 4 subnets and list the subnet mask, network address, and broadcast address for each.",
            input: "Network: 192.168.1.0/24",
            difficulty: "medium"
        },
        {
            title: "CIDR Notation",
            description: "Convert between dotted decimal subnet masks and CIDR notation.",
            input: "255.255.255.192",
            expectedOutput: "/26",
            difficulty: "beginner"
        },
        {
            title: "OSPF vs BGP",
            description: "Compare OSPF and BGP routing protocols in terms of use cases, metrics, and scalability.",
            difficulty: "intermediate"
        }
    ],

    'transport-protocols': [
        {
            title: "TCP 3-Way Handshake",
            description: "Draw a sequence diagram showing the TCP 3-way handshake with SYN, SYN-ACK, and ACK packets.",
            difficulty: "beginner"
        },
        {
            title: "TCP vs UDP Comparison",
            description: "Create a comparison table for TCP and UDP covering reliability, speed, overhead, and use cases.",
            difficulty: "beginner"
        },
        {
            title: "Sliding Window Protocol",
            description: "Simulate TCP sliding window protocol with a window size of 4 and show how acknowledgments work.",
            difficulty: "hard"
        },
        {
            title: "TCP Congestion Control",
            description: "Plot the congestion window size over time showing slow start, congestion avoidance, and fast recovery phases.",
            difficulty: "hard"
        }
    ],

    'application-layer': [
        {
            title: "HTTP Request/Response",
            description: "Write an HTTP GET request and a corresponding HTTP 200 OK response with headers.",
            difficulty: "beginner"
        },
        {
            title: "HTTP Methods",
            description: "Explain the difference between GET, POST, PUT, and DELETE methods with examples.",
            difficulty: "beginner"
        },
        {
            title: "URL Components",
            description: "Break down a URL into its components: protocol, domain, port, path, and query parameters.",
            input: "https://www.example.com:8080/path/to/page?id=123&name=test",
            difficulty: "beginner"
        }
    ]
};
