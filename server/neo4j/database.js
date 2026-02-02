import neo4j from 'neo4j-driver';

/**
 * Neo4j Database Configuration
 */

const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

let driver = null;

export const initNeo4j = () => {
  try {
    // Only attempt connection if URI is configured and not default
    if (!NEO4J_URI || NEO4J_URI === 'bolt://localhost:7687') {
      console.log('ℹ️  Neo4j not configured (using in-memory storage)');
      return null;
    }
    
    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
    );
    console.log('✅ Neo4j configured');
    return driver;
  } catch (error) {
    console.log('⚠️  Neo4j connection issue, using in-memory storage');
    return null;
  }
};

export const getDriver = () => {
  if (!driver) {
    driver = initNeo4j();
  }
  return driver;
};

export const closeNeo4j = async () => {
  if (driver) {
    await driver.close();
    console.log('Neo4j connection closed');
  }
};

/**
 * Create Operating Systems curriculum in Neo4j
 */
export const createOSCurriculum = async (curriculum) => {
  const driver = getDriver();
  if (!driver) {
    console.log('ℹ️  Skipping Neo4j seed (database not connected)');
    return false;
  }
  const session = driver.session();

  try {
    // Clear existing OS curriculum
    await session.run(
      'MATCH (n:Topic {subject: $subject}) DETACH DELETE n',
      { subject: curriculum.subject }
    );

    // Create nodes
    for (const node of curriculum.nodes) {
      await session.run(
        `CREATE (t:Topic {
          id: $id,
          label: $label,
          description: $description,
          level: $level,
          domain: $domain,
          difficulty: $difficulty,
          subject: $subject,
          x: $x,
          y: $y,
          topics: $topics,
          videos: $videos
        })`,
        {
          ...node,
          subject: curriculum.subject,
          topics: node.topics,
          videos: JSON.stringify(node.videos)
        }
      );
    }

    // Create relationships (prerequisites)
    for (const node of curriculum.nodes) {
      for (const prereqId of node.prereqs) {
        await session.run(
          `MATCH (a:Topic {id: $prereqId, subject: $subject})
           MATCH (b:Topic {id: $nodeId, subject: $subject})
           CREATE (a)-[:PREREQUISITE_OF]->(b)`,
          { prereqId, nodeId: node.id, subject: curriculum.subject }
        );
      }
    }

    console.log(`✅ Created ${curriculum.nodes.length} nodes for ${curriculum.subject}`);
    return true;
  } catch (error) {
    console.error('Error creating curriculum:', error);
    throw error;
  } finally {
    await session.close();
  }
};

/**
 * Get curriculum from Neo4j
 */
export const getCurriculum = async (subject) => {
  const driver = getDriver();
  if (!driver) return [];
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (t:Topic {subject: $subject})
       OPTIONAL MATCH (t)-[:PREREQUISITE_OF]->(dependent:Topic)
       RETURN t, collect(dependent.id) as dependents`,
      { subject }
    );

    return result.records.map(record => {
      const node = record.get('t').properties;
      return {
        ...node,
        videos: JSON.parse(node.videos || '[]'),
        topics: node.topics,
        dependents: record.get('dependents')
      };
    });
  } finally {
    await session.close();
  }
};

/**
 * Get prerequisites for a topic
 */
export const getPrerequisites = async (subject, topicId) => {
  if (!driver) return [];
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (prereq:Topic {subject: $subject})-[:PREREQUISITE_OF]->(t:Topic {id: $topicId})
       RETURN prereq`,
      { subject, topicId }
    );

    return result.records.map(record => record.get('prereq').properties);
  } finally {
    await session.close();
  }
};

/**
 * Get learning path (topological sort)
 */
export const getLearningPath = async (subject) => {
  if (!driver) return [];
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (t:Topic {subject: $subject})
       OPTIONAL MATCH path = (t)-[:PREREQUISITE_OF*]->(dependent)
       WITH t, length(path) as depth
       RETURN t ORDER BY depth DESC`,
      { subject }
    );

    return result.records.map(record => record.get('t').properties);
  } finally {
    await session.close();
  }
};

/**
 * Update user progress
 */
export const updateProgress = async (userId, subject, topicId, status) => {
  const driver = getDriver();
  if (!driver) return false;
  
  const session = driver.session();

  try {
    await session.run(
      `MERGE (u:User {id: $userId})
       MERGE (t:Topic {id: $topicId, subject: $subject})
       MERGE (u)-[p:PROGRESSED_IN]->(t)
       SET p.status = $status, p.timestamp = datetime()`,
      { userId, subject, topicId, status }
    );

    return true;
  } finally {
    await session.close();
  }
};

/**
 * Get user progress for a subject
 */
export const getUserProgress = async (userId, subject) => {
  const driver = getDriver();
  if (!driver) return [];
  
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[p:PROGRESSED_IN]->(t:Topic {subject: $subject})
       RETURN t.id as topicId, p.status as status, p.timestamp as timestamp`,
      { userId, subject }
    );

    return result.records.map(record => ({
      topicId: record.get('topicId'),
      status: record.get('status'),
      timestamp: record.get('timestamp')
    }));
  } finally {
    await session.close();
  }
};
