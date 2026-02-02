import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to Chinook database
const CHINOOK_DB_PATH = join(__dirname, '..', 'chinook.db');
const CHINOOK_DOWNLOAD_URL = 'https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite';

// Database connection (lazy loaded)
let chinookDb = null;

// Initialize database connection
const getDatabase = () => {
  return new Promise((resolve, reject) => {
    if (chinookDb) {
      resolve(chinookDb);
      return;
    }

    // Check if database file exists
    if (!fs.existsSync(CHINOOK_DB_PATH)) {
      reject(new Error('Chinook database not found. Please download it first.'));
      return;
    }

    chinookDb = new sqlite3.Database(CHINOOK_DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ Connected to Chinook database');
        resolve(chinookDb);
      }
    });
  });
};

// Download Chinook database if not present
const downloadDatabase = () => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(CHINOOK_DB_PATH)) {
      console.log('✅ Chinook database already exists');
      resolve(true);
      return;
    }

    console.log('📥 Downloading Chinook database...');
    
    const file = fs.createWriteStream(CHINOOK_DB_PATH);
    
    const download = (url) => {
      https.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          download(response.headers.location);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log('✅ Chinook database downloaded successfully');
          resolve(true);
        });
      }).on('error', (err) => {
        fs.unlink(CHINOOK_DB_PATH, () => {});
        reject(err);
      });
    };

    download(CHINOOK_DOWNLOAD_URL);
  });
};

// Initialize database on module load
downloadDatabase().catch(err => {
  console.log('⚠️ Could not download Chinook database:', err.message);
});

// Sanitize SQL query - only allow SELECT statements
const sanitizeQuery = (query) => {
  const trimmed = query.trim().toLowerCase();
  
  // Block dangerous operations
  const forbidden = ['insert', 'update', 'delete', 'drop', 'create', 'alter', 'truncate', 'exec', 'execute'];
  for (const word of forbidden) {
    if (trimmed.includes(word)) {
      throw new Error(`${word.toUpperCase()} statements are not allowed. Only SELECT queries are permitted.`);
    }
  }
  
  // Must start with SELECT or WITH (for CTEs)
  if (!trimmed.startsWith('select') && !trimmed.startsWith('with')) {
    throw new Error('Only SELECT queries are allowed.');
  }
  
  return query;
};

// Execute SQL query
router.post('/execute', async (req, res) => {
  const { query, limit = 100 } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Sanitize query
    const sanitizedQuery = sanitizeQuery(query);
    
    // Get database connection
    const db = await getDatabase();

    // Add LIMIT if not present (safety measure)
    let finalQuery = sanitizedQuery.trim();
    if (!finalQuery.toLowerCase().includes('limit')) {
      finalQuery = finalQuery.replace(/;?\s*$/, '') + ` LIMIT ${limit}`;
    }

    // Execute query
    db.all(finalQuery, [], (err, rows) => {
      if (err) {
        return res.status(400).json({ 
          error: 'SQL Error',
          message: err.message,
          query: finalQuery
        });
      }

      res.json({
        success: true,
        rows: rows || [],
        rowCount: rows ? rows.length : 0,
        query: finalQuery
      });
    });

  } catch (error) {
    res.status(400).json({ 
      error: 'Query Error',
      message: error.message 
    });
  }
});

// Verify SQL answer against expected result
router.post('/verify', async (req, res) => {
  const { userQuery, verificationQuery, expectedRowCount } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: 'User query is required' });
  }

  try {
    const sanitizedUserQuery = sanitizeQuery(userQuery);
    const db = await getDatabase();

    // Execute user's query
    const userResult = await new Promise((resolve, reject) => {
      db.all(sanitizedUserQuery, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    let verificationResult = null;
    let passed = false;
    let feedback = [];

    // If we have a verification query, compare results
    if (verificationQuery) {
      const sanitizedVerifyQuery = sanitizeQuery(verificationQuery);
      verificationResult = await new Promise((resolve, reject) => {
        db.all(sanitizedVerifyQuery, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      });

      // Check if results match
      if (expectedRowCount !== undefined) {
        const countMatch = userResult.length === expectedRowCount;
        if (countMatch) {
          passed = true;
          feedback.push(`✓ Correct! Returned ${userResult.length} rows as expected.`);
        } else {
          feedback.push(`✗ Expected ${expectedRowCount} rows, but got ${userResult.length} rows.`);
        }
      } else {
        // Compare row counts with verification query
        const verifyCount = verificationResult[0]?.count;
        if (verifyCount !== undefined) {
          if (userResult.length === verifyCount) {
            passed = true;
            feedback.push(`✓ Correct! Row count matches expected: ${verifyCount}`);
          } else {
            feedback.push(`✗ Expected ${verifyCount} rows, but got ${userResult.length} rows.`);
          }
        } else {
          // Deep compare results
          const userJson = JSON.stringify(userResult);
          const verifyJson = JSON.stringify(verificationResult);
          passed = userJson === verifyJson;
          feedback.push(passed ? '✓ Results match!' : '✗ Results do not match expected output.');
        }
      }
    } else {
      // No verification query, just check if query executed successfully
      passed = userResult.length > 0;
      feedback.push(passed ? `✓ Query executed successfully, returned ${userResult.length} rows.` : '✗ Query returned no results.');
    }

    res.json({
      success: true,
      passed,
      feedback,
      userResult: userResult.slice(0, 20), // Return first 20 rows for display
      userRowCount: userResult.length,
      expectedRowCount: expectedRowCount || verificationResult?.[0]?.count
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      passed: false,
      error: error.message,
      feedback: [`✗ SQL Error: ${error.message}`]
    });
  }
});

// Get database schema information
router.get('/schema', async (req, res) => {
  try {
    const db = await getDatabase();

    // Get all table names
    const tables = await new Promise((resolve, reject) => {
      db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get columns for each table
    const schema = {};
    for (const table of tables) {
      const columns = await new Promise((resolve, reject) => {
        db.all(`PRAGMA table_info(${table.name})`, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      schema[table.name] = columns.map(c => ({
        name: c.name,
        type: c.type,
        pk: c.pk === 1
      }));
    }

    res.json({ success: true, schema });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sample data from a table
router.get('/sample/:table', async (req, res) => {
  const { table } = req.params;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const db = await getDatabase();
    
    // Validate table name (prevent SQL injection)
    const validTables = ['artists', 'albums', 'tracks', 'genres', 'media_types', 
                         'playlists', 'playlist_track', 'customers', 'employees', 
                         'invoices', 'invoice_items'];
    
    if (!validTables.includes(table.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    db.all(`SELECT * FROM ${table} LIMIT ?`, [limit], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ success: true, table, rows, rowCount: rows.length });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check for SQL service
router.get('/health', async (req, res) => {
  try {
    const db = await getDatabase();
    db.get('SELECT 1', (err) => {
      if (err) {
        res.status(500).json({ status: 'error', message: err.message });
      } else {
        res.json({ status: 'ok', database: 'chinook' });
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
