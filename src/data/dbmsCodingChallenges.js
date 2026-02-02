/**
 * Database Systems SQL Coding Challenges
 * Uses the Chinook sample database (SQLite)
 * 
 * Chinook Database Schema:
 * - Artist (ArtistId, Name)
 * - Album (AlbumId, Title, ArtistId)
 * - Track (TrackId, Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice)
 * - Genre (GenreId, Name)
 * - MediaType (MediaTypeId, Name)
 * - Playlist (PlaylistId, Name)
 * - PlaylistTrack (PlaylistId, TrackId)
 * - Customer (CustomerId, FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId)
 * - Employee (EmployeeId, LastName, FirstName, Title, ReportsTo, BirthDate, HireDate, Address, City, State, Country, PostalCode, Phone, Fax, Email)
 * - Invoice (InvoiceId, CustomerId, InvoiceDate, BillingAddress, BillingCity, BillingState, BillingCountry, BillingPostalCode, Total)
 * - InvoiceLine (InvoiceLineId, InvoiceId, TrackId, UnitPrice, Quantity)
 */

// Database URL for the Chinook database
export const CHINOOK_DB_URL = 'https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite';

// Alternative: Local path after download
export const CHINOOK_LOCAL_PATH = 'chinook.db';

export const DBMS_CODING_CHALLENGES = {
  // ==================== SQL BASICS ====================
  'sql-basics': [
    {
      id: 'sql-1',
      title: 'Select All Artist',
      difficulty: 'easy',
      points: 25,
      description: `Write a SQL query to retrieve all Artist from the database.

Return all columns from the Artist table, ordered by ArtistId.

**Table: Artist**
- ArtistId (INTEGER) - Primary Key
- Name (TEXT) - Artist name

Expected output should show ArtistId and Name for all Artist.`,
      starterCode: `-- Write your SQL query below
-- Select all Artist ordered by ArtistId

SELECT `,
      solution: `SELECT * FROM Artist ORDER BY ArtistId;`,
      expectedOutput: [
        { ArtistId: 1, Name: 'AC/DC' },
        { ArtistId: 2, Name: 'Accept' },
        { ArtistId: 3, Name: 'Aerosmith' },
        { ArtistId: 4, Name: 'Alanis Morissette' },
        { ArtistId: 5, Name: 'Alice In Chains' }
        // ... more rows (275 total)
      ],
      expectedRowCount: 275,
      explanation: `The SELECT * statement retrieves all columns from a table.
ORDER BY ensures consistent ordering of results.
The Artist table contains 275 Artist in the Chinook database.`,
      hints: [
        'Use SELECT * to get all columns',
        'Use FROM to specify the table name',
        'Use ORDER BY to sort results'
      ],
      testQuery: `SELECT * FROM Artist ORDER BY ArtistId LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Artist;`
    },
    {
      id: 'sql-2',
      title: 'Filter Track by Price',
      difficulty: 'easy',
      points: 30,
      description: `Write a SQL query to find all Track that cost more than $0.99.

Return the TrackId, Name, and UnitPrice columns.
Order results by UnitPrice in descending order.

**Table: Track**
- TrackId, Name, AlbumId, GenreId, Composer, Milliseconds, Bytes, UnitPrice`,
      starterCode: `-- Find Track with UnitPrice > 0.99
-- Order by UnitPrice descending

SELECT `,
      solution: `SELECT TrackId, Name, UnitPrice 
FROM Track 
WHERE UnitPrice > 0.99 
ORDER BY UnitPrice DESC;`,
      expectedRowCount: 213,
      explanation: `The WHERE clause filters rows based on conditions.
Comparison operators (>, <, =, >=, <=, <>) filter numeric values.
ORDER BY DESC sorts in descending order.`,
      hints: [
        'Use WHERE clause to filter by price',
        'Use comparison operator > for "greater than"',
        'DESC keyword sorts in descending order'
      ],
      testQuery: `SELECT TrackId, Name, UnitPrice FROM Track WHERE UnitPrice > 0.99 ORDER BY UnitPrice DESC LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Track WHERE UnitPrice > 0.99;`
    },
    {
      id: 'sql-3',
      title: 'Select Specific Columns',
      difficulty: 'easy',
      points: 25,
      description: `Write a SQL query to get customer names and their email addresses.

Return FirstName, LastName, and Email columns from the Customer table.
Order by LastName alphabetically.

**Table: Customer**
- CustomerId, FirstName, LastName, Email, Country, ...`,
      starterCode: `-- Get customer names and emails
-- Order by LastName

SELECT `,
      solution: `SELECT FirstName, LastName, Email 
FROM Customer 
ORDER BY LastName;`,
      expectedRowCount: 59,
      explanation: `Selecting specific columns is more efficient than SELECT *.
Multiple columns are separated by commas.
ORDER BY without DESC defaults to ascending (ASC) order.`,
      hints: [
        'List the column names separated by commas',
        'ORDER BY defaults to ascending order',
        'Column names are case-insensitive in SQL'
      ],
      testQuery: `SELECT FirstName, LastName, Email FROM Customer ORDER BY LastName LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Customer;`
    },
    {
      id: 'sql-4',
      title: 'Using DISTINCT',
      difficulty: 'easy',
      points: 30,
      description: `Write a SQL query to find all unique countries where Customer are located.

Return only the distinct Country values, ordered alphabetically.

**Table: Customer**
- Contains Customer from various countries`,
      starterCode: `-- Find all unique countries
-- Order alphabetically

SELECT `,
      solution: `SELECT DISTINCT Country 
FROM Customer 
ORDER BY Country;`,
      expectedRowCount: 24,
      explanation: `DISTINCT eliminates duplicate values in the result set.
The Customer table has 59 Customer from 24 different countries.
This is useful for getting a list of unique values.`,
      hints: [
        'DISTINCT keyword removes duplicates',
        'Place DISTINCT after SELECT',
        'Countries like USA, Canada, Brazil will appear once'
      ],
      testQuery: `SELECT DISTINCT Country FROM Customer ORDER BY Country LIMIT 5;`,
      verificationQuery: `SELECT COUNT(DISTINCT Country) as count FROM Customer;`
    },
    {
      id: 'sql-5',
      title: 'WHERE with Multiple Conditions',
      difficulty: 'easy',
      points: 35,
      description: `Write a SQL query to find all Customer from the USA who have a Fax number.

Return CustomerId, FirstName, LastName, Country, and Fax.
Order by LastName.

**Hint**: A customer "has a fax" if Fax is NOT NULL.`,
      starterCode: `-- Find USA Customer with fax numbers
-- Fax must not be NULL

SELECT `,
      solution: `SELECT CustomerId, FirstName, LastName, Country, Fax 
FROM Customer 
WHERE Country = 'USA' AND Fax IS NOT NULL 
ORDER BY LastName;`,
      expectedRowCount: 5,
      explanation: `AND combines multiple conditions - all must be true.
IS NOT NULL checks for non-null values.
String comparisons use single quotes: 'USA'.`,
      hints: [
        'Use AND to combine conditions',
        'Use IS NOT NULL to check for non-null values',
        "String values need quotes: Country = 'USA'"
      ],
      testQuery: `SELECT CustomerId, FirstName, LastName, Country, Fax FROM Customer WHERE Country = 'USA' AND Fax IS NOT NULL ORDER BY LastName;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Customer WHERE Country = 'USA' AND Fax IS NOT NULL;`
    }
  ],

  // ==================== SQL JOINS ====================
  'sql-joins': [
    {
      id: 'join-1',
      title: 'Simple INNER JOIN',
      difficulty: 'medium',
      points: 50,
      description: `Write a SQL query to get album titles along with their artist names.

Join the Album and Artist tables.
Return AlbumId, album Title, and artist Name.
Order by album Title.

**Tables:**
- Album (AlbumId, Title, ArtistId)
- Artist (ArtistId, Name)`,
      starterCode: `-- Join Album with Artist
-- Return album title and artist name

SELECT `,
      solution: `SELECT Album.AlbumId, Album.Title, Artist.Name 
FROM Album 
INNER JOIN Artist ON Album.ArtistId = Artist.ArtistId 
ORDER BY Album.Title;`,
      expectedRowCount: 347,
      explanation: `INNER JOIN returns rows where there's a match in both tables.
The ON clause specifies the join condition.
Use table.column notation to disambiguate columns.`,
      hints: [
        'INNER JOIN connects two tables on a common column',
        'Use ON to specify which columns to match',
        'Prefix column names with table names to avoid ambiguity'
      ],
      testQuery: `SELECT Album.AlbumId, Album.Title, Artist.Name FROM Album INNER JOIN Artist ON Album.ArtistId = Artist.ArtistId ORDER BY Album.Title LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Album INNER JOIN Artist ON Album.ArtistId = Artist.ArtistId;`
    },
    {
      id: 'join-2',
      title: 'Three-Table JOIN',
      difficulty: 'medium',
      points: 75,
      description: `Write a SQL query to get track names with their album title and artist name.

Join Track, Album, and Artist tables.
Return track Name, album Title, and artist Name (alias as ArtistName).
Order by artist name, then album title.
Limit to 100 results.

**Tables:**
- Track (TrackId, Name, AlbumId, ...)
- Album (AlbumId, Title, ArtistId)
- Artist (ArtistId, Name)`,
      starterCode: `-- Join three tables: Track -> Album -> Artist
-- Use aliases for clarity

SELECT `,
      solution: `SELECT Track.Name, Album.Title, Artist.Name AS ArtistName 
FROM Track 
INNER JOIN Album ON Track.AlbumId = Album.AlbumId 
INNER JOIN Artist ON Album.ArtistId = Artist.ArtistId 
ORDER BY Artist.Name, Album.Title 
LIMIT 100;`,
      expectedRowCount: 100,
      explanation: `Multiple JOINs chain tables together.
AS creates column aliases for readability.
Order of joins follows the relationship path.`,
      hints: [
        'Chain multiple JOINs in sequence',
        'Track -> Album -> Artist follows foreign keys',
        'AS keyword creates column aliases'
      ],
      testQuery: `SELECT Track.Name, Album.Title, Artist.Name AS ArtistName FROM Track INNER JOIN Album ON Track.AlbumId = Album.AlbumId INNER JOIN Artist ON Album.ArtistId = Artist.ArtistId ORDER BY Artist.Name, Album.Title LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Track INNER JOIN Album ON Track.AlbumId = Album.AlbumId INNER JOIN Artist ON Album.ArtistId = Artist.ArtistId;`
    },
    {
      id: 'join-3',
      title: 'LEFT JOIN for Missing Data',
      difficulty: 'medium',
      points: 60,
      description: `Write a SQL query to find Artist who have NO Album in the database.

Use a LEFT JOIN to include all Artist, then filter for those with no matching Album.
Return only the artist Name.
Order alphabetically by Name.

**Hint**: After a LEFT JOIN, unmatched rows have NULL in the joined table's columns.`,
      starterCode: `-- Find Artist without any Album
-- Use LEFT JOIN and check for NULL

SELECT `,
      solution: `SELECT Artist.Name 
FROM Artist 
LEFT JOIN Album ON Artist.ArtistId = Album.ArtistId 
WHERE Album.AlbumId IS NULL 
ORDER BY Artist.Name;`,
      expectedRowCount: 71,
      explanation: `LEFT JOIN keeps all rows from the left table (Artist).
When there's no match, the right table columns are NULL.
Filtering for NULL in the right table finds unmatched rows.`,
      hints: [
        'LEFT JOIN includes all rows from the left table',
        'Unmatched rows have NULL for the joined columns',
        'Use WHERE ... IS NULL to find unmatched rows'
      ],
      testQuery: `SELECT Artist.Name FROM Artist LEFT JOIN Album ON Artist.ArtistId = Album.ArtistId WHERE Album.AlbumId IS NULL ORDER BY Artist.Name LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Artist LEFT JOIN Album ON Artist.ArtistId = Album.ArtistId WHERE Album.AlbumId IS NULL;`
    },
    {
      id: 'join-4',
      title: 'Self JOIN - Employee Hierarchy',
      difficulty: 'hard',
      points: 100,
      description: `Write a SQL query to show each employee along with their manager's name.

The Employee table has a ReportsTo column that references another EmployeeId.
Return: EmployeeName (FirstName + ' ' + LastName), ManagerName.
Include Employee without managers (NULL manager).
Order by ManagerName, then EmployeeName.

**Table: Employee**
- EmployeeId, FirstName, LastName, Title, ReportsTo (references EmployeeId)`,
      starterCode: `-- Self-join Employee table
-- Match employee.ReportsTo to manager.EmployeeId

SELECT `,
      solution: `SELECT 
    e.FirstName || ' ' || e.LastName AS EmployeeName,
    m.FirstName || ' ' || m.LastName AS ManagerName
FROM Employee e
LEFT JOIN Employee m ON e.ReportsTo = m.EmployeeId
ORDER BY ManagerName, EmployeeName;`,
      expectedRowCount: 8,
      explanation: `Self-join joins a table to itself using different aliases.
The || operator concatenates strings in SQLite.
LEFT JOIN ensures we include Employee without managers (CEO).`,
      hints: [
        'Use table aliases (e for employee, m for manager)',
        'Join on e.ReportsTo = m.EmployeeId',
        'Use || to concatenate FirstName and LastName in SQLite'
      ],
      testQuery: `SELECT e.FirstName || ' ' || e.LastName AS EmployeeName, m.FirstName || ' ' || m.LastName AS ManagerName FROM Employee e LEFT JOIN Employee m ON e.ReportsTo = m.EmployeeId ORDER BY ManagerName, EmployeeName;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Employee;`
    }
  ],

  // ==================== AGGREGATE FUNCTIONS ====================
  'sql-aggregates': [
    {
      id: 'agg-1',
      title: 'Count and Sum Basics',
      difficulty: 'easy',
      points: 40,
      description: `Write a SQL query to find:
1. The total number of Track in the database
2. The total duration of all Track (in seconds)
3. The average track length (in seconds)

**Table: Track**
- Milliseconds contains track duration in milliseconds

Return columns: TotalTracks, TotalSeconds, AvgSeconds (rounded to 2 decimal places)`,
      starterCode: `-- Calculate track statistics
-- Convert milliseconds to seconds (divide by 1000)

SELECT `,
      solution: `SELECT 
    COUNT(*) AS TotalTracks,
    ROUND(SUM(Milliseconds) / 1000.0, 2) AS TotalSeconds,
    ROUND(AVG(Milliseconds) / 1000.0, 2) AS AvgSeconds
FROM Track;`,
      expectedOutput: {
        TotalTracks: 3503,
        TotalSeconds: 1378934.64,
        AvgSeconds: 393.6
      },
      explanation: `COUNT(*) counts all rows.
SUM() adds up values, AVG() calculates average.
ROUND(value, 2) rounds to 2 decimal places.
Divide by 1000.0 (not 1000) for decimal division.`,
      hints: [
        'Use COUNT(*) to count rows',
        'Divide Milliseconds by 1000.0 for seconds',
        'ROUND(value, decimals) rounds the result'
      ],
      testQuery: `SELECT COUNT(*) AS TotalTracks, ROUND(SUM(Milliseconds) / 1000.0, 2) AS TotalSeconds, ROUND(AVG(Milliseconds) / 1000.0, 2) AS AvgSeconds FROM Track;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Track;`
    },
    {
      id: 'agg-2',
      title: 'GROUP BY with COUNT',
      difficulty: 'medium',
      points: 50,
      description: `Write a SQL query to count the number of Track in each genre.

Return GenreName and TrackCount.
Order by TrackCount in descending order.

**Tables:**
- Track (GenreId, ...)
- Genre (GenreId, Name)`,
      starterCode: `-- Count Track per genre
-- Join with Genre table to get genre names

SELECT `,
      solution: `SELECT Genre.Name AS GenreName, COUNT(*) AS TrackCount
FROM Track
INNER JOIN Genre ON Track.GenreId = Genre.GenreId
GROUP BY Genre.GenreId, Genre.Name
ORDER BY TrackCount DESC;`,
      expectedRowCount: 25,
      explanation: `GROUP BY groups rows with the same values.
COUNT(*) within a group counts rows in that group.
Always GROUP BY the columns you're selecting (except aggregates).`,
      hints: [
        'JOIN Track and Genre tables first',
        'GROUP BY the genre identifier',
        'COUNT(*) counts rows in each group'
      ],
      testQuery: `SELECT Genre.Name AS GenreName, COUNT(*) AS TrackCount FROM Track INNER JOIN Genre ON Track.GenreId = Genre.GenreId GROUP BY Genre.GenreId, Genre.Name ORDER BY TrackCount DESC LIMIT 5;`,
      verificationQuery: `SELECT COUNT(DISTINCT GenreId) as count FROM Track;`
    },
    {
      id: 'agg-3',
      title: 'HAVING Clause',
      difficulty: 'medium',
      points: 60,
      description: `Write a SQL query to find Artist who have more than 10 Album.

Return artist Name and AlbumCount.
Order by AlbumCount descending.

**Use HAVING to filter groups after aggregation.**`,
      starterCode: `-- Find prolific Artist (>10 Album)
-- Use HAVING to filter aggregated results

SELECT `,
      solution: `SELECT Artist.Name, COUNT(*) AS AlbumCount
FROM Artist
INNER JOIN Album ON Artist.ArtistId = Album.ArtistId
GROUP BY Artist.ArtistId, Artist.Name
HAVING COUNT(*) > 10
ORDER BY AlbumCount DESC;`,
      expectedRowCount: 4,
      explanation: `HAVING filters groups after GROUP BY (like WHERE for groups).
WHERE filters rows before grouping, HAVING filters after.
You can't use column aliases in HAVING, use the aggregate again.`,
      hints: [
        'GROUP BY artist first',
        'HAVING filters groups, not individual rows',
        'HAVING COUNT(*) > 10 keeps only groups with >10 items'
      ],
      testQuery: `SELECT Artist.Name, COUNT(*) AS AlbumCount FROM Artist INNER JOIN Album ON Artist.ArtistId = Album.ArtistId GROUP BY Artist.ArtistId, Artist.Name HAVING COUNT(*) > 10 ORDER BY AlbumCount DESC;`,
      verificationQuery: `SELECT COUNT(*) as count FROM (SELECT Artist.ArtistId FROM Artist INNER JOIN Album ON Artist.ArtistId = Album.ArtistId GROUP BY Artist.ArtistId HAVING COUNT(*) > 10);`
    },
    {
      id: 'agg-4',
      title: 'Revenue Analysis',
      difficulty: 'medium',
      points: 75,
      description: `Write a SQL query to calculate total revenue per country.

Revenue = SUM(invoice Total)
Return Country and TotalRevenue (rounded to 2 decimal places).
Only include countries with revenue > $50.
Order by TotalRevenue descending.

**Table: Invoice**
- BillingCountry, Total`,
      starterCode: `-- Calculate revenue by country
-- Filter for countries with > $50 revenue

SELECT `,
      solution: `SELECT BillingCountry AS Country, ROUND(SUM(Total), 2) AS TotalRevenue
FROM Invoice
GROUP BY BillingCountry
HAVING SUM(Total) > 50
ORDER BY TotalRevenue DESC;`,
      expectedRowCount: 10,
      explanation: `SUM(Total) calculates total revenue per group.
HAVING SUM(Total) > 50 filters after aggregation.
ROUND ensures clean decimal output.`,
      hints: [
        'GROUP BY BillingCountry',
        'SUM(Total) gives revenue per country',
        'Use HAVING for the $50 threshold'
      ],
      testQuery: `SELECT BillingCountry AS Country, ROUND(SUM(Total), 2) AS TotalRevenue FROM Invoice GROUP BY BillingCountry HAVING SUM(Total) > 50 ORDER BY TotalRevenue DESC;`,
      verificationQuery: `SELECT COUNT(*) as count FROM (SELECT BillingCountry FROM Invoice GROUP BY BillingCountry HAVING SUM(Total) > 50);`
    },
    {
      id: 'agg-5',
      title: 'MIN, MAX, and Statistics',
      difficulty: 'easy',
      points: 40,
      description: `Write a SQL query to find statistics about track pricing.

Return:
- MinPrice: minimum UnitPrice
- MaxPrice: maximum UnitPrice  
- AvgPrice: average UnitPrice (rounded to 2 decimals)
- PriceRange: difference between max and min

**Table: Track**`,
      starterCode: `-- Calculate price statistics for Track

SELECT `,
      solution: `SELECT 
    MIN(UnitPrice) AS MinPrice,
    MAX(UnitPrice) AS MaxPrice,
    ROUND(AVG(UnitPrice), 2) AS AvgPrice,
    MAX(UnitPrice) - MIN(UnitPrice) AS PriceRange
FROM Track;`,
      expectedOutput: {
        MinPrice: 0.99,
        MaxPrice: 1.99,
        AvgPrice: 1.05,
        PriceRange: 1.0
      },
      explanation: `MIN() and MAX() find extreme values.
You can perform calculations with aggregates.
All Track in Chinook are either $0.99 or $1.99.`,
      hints: [
        'MIN() finds the smallest value',
        'MAX() finds the largest value',
        'You can do math with aggregates: MAX() - MIN()'
      ],
      testQuery: `SELECT MIN(UnitPrice) AS MinPrice, MAX(UnitPrice) AS MaxPrice, ROUND(AVG(UnitPrice), 2) AS AvgPrice, MAX(UnitPrice) - MIN(UnitPrice) AS PriceRange FROM Track;`,
      verificationQuery: `SELECT 1;`
    }
  ],

  // ==================== SUBQUERIES ====================
  'sql-subqueries': [
    {
      id: 'sub-1',
      title: 'Subquery in WHERE',
      difficulty: 'medium',
      points: 60,
      description: `Write a SQL query to find all Track that are longer than the average track length.

Return TrackId, Name, and Milliseconds.
Order by Milliseconds descending.
Limit to 20 results.

**Use a subquery to calculate the average length.**`,
      starterCode: `-- Find Track longer than average
-- Use a subquery to get the average

SELECT `,
      solution: `SELECT TrackId, Name, Milliseconds
FROM Track
WHERE Milliseconds > (SELECT AVG(Milliseconds) FROM Track)
ORDER BY Milliseconds DESC
LIMIT 20;`,
      expectedRowCount: 20,
      explanation: `A subquery in WHERE provides a dynamic value for comparison.
The inner query calculates the average (about 393,599 ms).
The outer query finds Track exceeding this average.`,
      hints: [
        'Put the AVG calculation in a subquery',
        'Subquery goes in parentheses',
        'The subquery must return a single value for comparison'
      ],
      testQuery: `SELECT TrackId, Name, Milliseconds FROM Track WHERE Milliseconds > (SELECT AVG(Milliseconds) FROM Track) ORDER BY Milliseconds DESC LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Track WHERE Milliseconds > (SELECT AVG(Milliseconds) FROM Track);`
    },
    {
      id: 'sub-2',
      title: 'Subquery with IN',
      difficulty: 'medium',
      points: 65,
      description: `Write a SQL query to find all Album by Artist whose name starts with 'The'.

Return AlbumId, Title, and ArtistId.
Order by Title.

**Use a subquery with IN to find matching artist IDs.**`,
      starterCode: `-- Find Album by Artist starting with 'The'
-- Use IN with a subquery

SELECT `,
      solution: `SELECT AlbumId, Title, ArtistId
FROM Album
WHERE ArtistId IN (
    SELECT ArtistId 
    FROM Artist 
    WHERE Name LIKE 'The %'
)
ORDER BY Title;`,
      expectedRowCount: 12,
      explanation: `IN checks if a value exists in a list (or subquery result).
LIKE 'The %' matches strings starting with 'The '.
The subquery returns all ArtistIds matching the pattern.`,
      hints: [
        "Use LIKE 'The %' to match names starting with 'The'",
        'The subquery returns a list of ArtistIds',
        "IN checks if ArtistId is in that list"
      ],
      testQuery: `SELECT AlbumId, Title, ArtistId FROM Album WHERE ArtistId IN (SELECT ArtistId FROM Artist WHERE Name LIKE 'The %') ORDER BY Title;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Album WHERE ArtistId IN (SELECT ArtistId FROM Artist WHERE Name LIKE 'The %');`
    },
    {
      id: 'sub-3',
      title: 'Correlated Subquery',
      difficulty: 'hard',
      points: 100,
      description: `Write a SQL query to find each customer's most recent invoice.

For each customer, find the invoice with the maximum InvoiceDate.
Return CustomerId, FirstName, LastName, and the max InvoiceDate.
Order by CustomerId.

**Use a correlated subquery where inner query references outer query.**`,
      starterCode: `-- Find each customer's most recent invoice
-- Correlated subquery references outer table

SELECT `,
      solution: `SELECT c.CustomerId, c.FirstName, c.LastName, 
    (SELECT MAX(InvoiceDate) 
     FROM Invoice i 
     WHERE i.CustomerId = c.CustomerId) AS LastInvoiceDate
FROM Customer c
ORDER BY c.CustomerId;`,
      expectedRowCount: 59,
      explanation: `A correlated subquery references columns from the outer query.
It executes once per row of the outer query.
This finds the MAX InvoiceDate for each specific customer.`,
      hints: [
        'The subquery references c.CustomerId from outer query',
        'MAX(InvoiceDate) finds the most recent date',
        'Correlated = inner query depends on outer query values'
      ],
      testQuery: `SELECT c.CustomerId, c.FirstName, c.LastName, (SELECT MAX(InvoiceDate) FROM Invoice i WHERE i.CustomerId = c.CustomerId) AS LastInvoiceDate FROM Customer c ORDER BY c.CustomerId LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Customer;`
    },
    {
      id: 'sub-4',
      title: 'EXISTS Subquery',
      difficulty: 'hard',
      points: 90,
      description: `Write a SQL query to find Artist who have at least one track in the 'Rock' genre.

Use EXISTS to check if matching Track exist.
Return distinct artist Names only.
Order alphabetically.

**Tables: Artist, Album, Track, Genre**`,
      starterCode: `-- Find Artist with Rock Track
-- Use EXISTS subquery

SELECT DISTINCT `,
      solution: `SELECT DISTINCT Artist.Name
FROM Artist
WHERE EXISTS (
    SELECT 1 
    FROM Album
    INNER JOIN Track ON Album.AlbumId = Track.AlbumId
    INNER JOIN Genre ON Track.GenreId = Genre.GenreId
    WHERE Album.ArtistId = Artist.ArtistId
    AND Genre.Name = 'Rock'
)
ORDER BY Artist.Name;`,
      expectedRowCount: 59,
      explanation: `EXISTS returns true if the subquery returns any rows.
SELECT 1 is conventional - the actual values don't matter.
The subquery checks if ANY Rock Track exist for each artist.`,
      hints: [
        'EXISTS checks if subquery returns any rows',
        'SELECT 1 is sufficient - we only check existence',
        'Join through Album -> Track -> Genre in subquery'
      ],
      testQuery: `SELECT DISTINCT Artist.Name FROM Artist WHERE EXISTS (SELECT 1 FROM Album INNER JOIN Track ON Album.AlbumId = Track.AlbumId INNER JOIN Genre ON Track.GenreId = Genre.GenreId WHERE Album.ArtistId = Artist.ArtistId AND Genre.Name = 'Rock') ORDER BY Artist.Name LIMIT 5;`,
      verificationQuery: `SELECT COUNT(DISTINCT Artist.ArtistId) as count FROM Artist WHERE EXISTS (SELECT 1 FROM Album INNER JOIN Track ON Album.AlbumId = Track.AlbumId INNER JOIN Genre ON Track.GenreId = Genre.GenreId WHERE Album.ArtistId = Artist.ArtistId AND Genre.Name = 'Rock');`
    }
  ],

  // ==================== NORMALIZATION CONCEPTS (Theory + Practice) ====================
  'normalization': [
    {
      id: 'norm-1',
      title: 'Find Duplicate Data (1NF Check)',
      difficulty: 'medium',
      points: 50,
      description: `First Normal Form requires atomic values and no repeating groups.

Write a SQL query to find any Track that have the same Name appearing multiple times.
This would indicate potential normalization issues.

Return the track Name and the count of occurrences.
Only show names that appear more than once.
Order by count descending.`,
      starterCode: `-- Find duplicate track names
-- These could indicate normalization issues

SELECT `,
      solution: `SELECT Name, COUNT(*) AS Occurrences
FROM Track
GROUP BY Name
HAVING COUNT(*) > 1
ORDER BY Occurrences DESC;`,
      expectedRowCount: 62,
      explanation: `Duplicate names might indicate the same track recorded multiple times.
GROUP BY Name groups all Track with identical names.
HAVING COUNT(*) > 1 filters to only duplicates.
In a well-normalized DB, context (album) distinguishes these.`,
      hints: [
        'GROUP BY the track Name',
        'COUNT(*) counts how many Track have each name',
        'HAVING filters groups, not rows'
      ],
      testQuery: `SELECT Name, COUNT(*) AS Occurrences FROM Track GROUP BY Name HAVING COUNT(*) > 1 ORDER BY Occurrences DESC LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM (SELECT Name FROM Track GROUP BY Name HAVING COUNT(*) > 1);`
    },
    {
      id: 'norm-2',
      title: 'Check Referential Integrity',
      difficulty: 'medium',
      points: 60,
      description: `Write a SQL query to check if there are any Track referencing non-existent Album.

This would be a violation of referential integrity (foreign key constraint).
Return any TrackId and AlbumId where the album doesn't exist.

**If the database is properly normalized, this should return 0 rows.**`,
      starterCode: `-- Check for orphaned Track (invalid AlbumId)
-- Use LEFT JOIN to find non-matching records

SELECT `,
      solution: `SELECT t.TrackId, t.AlbumId
FROM Track t
LEFT JOIN Album a ON t.AlbumId = a.AlbumId
WHERE a.AlbumId IS NULL;`,
      expectedRowCount: 0,
      explanation: `Referential integrity ensures foreign keys reference valid primary keys.
LEFT JOIN includes all Track; NULL album means invalid reference.
The Chinook database is well-designed, so this returns 0 rows.`,
      hints: [
        'LEFT JOIN keeps all Track, even without matching Album',
        'WHERE Album.AlbumId IS NULL finds orphaned records',
        'A well-normalized database should have 0 violations'
      ],
      testQuery: `SELECT t.TrackId, t.AlbumId FROM Track t LEFT JOIN Album a ON t.AlbumId = a.AlbumId WHERE a.AlbumId IS NULL;`,
      verificationQuery: `SELECT COUNT(*) as count FROM Track t LEFT JOIN Album a ON t.AlbumId = a.AlbumId WHERE a.AlbumId IS NULL;`
    },
    {
      id: 'norm-3',
      title: 'Analyze Data Dependencies',
      difficulty: 'hard',
      points: 100,
      description: `Analyze the InvoiceLine table to understand functional dependencies.

For each InvoiceId, check if there are multiple different UnitPrices for the same TrackId.
This would suggest the UnitPrice depends on context, not just the track.

Return InvoiceId, TrackId, and the number of distinct UnitPrices.
Only show cases where there's more than 1 distinct price (if any).

**This helps understand if price is functionally dependent on TrackId alone.**`,
      starterCode: `-- Check if UnitPrice is consistent per TrackId within Invoice
-- Multiple prices would indicate additional dependencies

SELECT `,
      solution: `SELECT InvoiceId, TrackId, COUNT(DISTINCT UnitPrice) AS PriceCount
FROM InvoiceLine
GROUP BY InvoiceId, TrackId
HAVING COUNT(DISTINCT UnitPrice) > 1;`,
      expectedRowCount: 0,
      explanation: `Functional dependency: TrackId → UnitPrice means each track has one price.
If this query returns results, prices vary for the same track in one invoice.
0 results means UnitPrice is consistent (good normalization).
In Chinook, each track appears once per invoice with consistent pricing.`,
      hints: [
        'GROUP BY both InvoiceId and TrackId',
        'COUNT(DISTINCT UnitPrice) counts unique prices',
        'HAVING > 1 finds inconsistencies'
      ],
      testQuery: `SELECT InvoiceId, TrackId, COUNT(DISTINCT UnitPrice) AS PriceCount FROM InvoiceLine GROUP BY InvoiceId, TrackId HAVING COUNT(DISTINCT UnitPrice) > 1;`,
      verificationQuery: `SELECT COUNT(*) as count FROM (SELECT InvoiceId, TrackId FROM InvoiceLine GROUP BY InvoiceId, TrackId HAVING COUNT(DISTINCT UnitPrice) > 1);`
    }
  ],

  // ==================== TRANSACTIONS (Conceptual) ====================
  'transactions': [
    {
      id: 'txn-1',
      title: 'Verify Data Integrity - Invoice Totals',
      difficulty: 'medium',
      points: 75,
      description: `In a properly transactional system, invoice totals should match their line items.

Write a query to verify that each invoice's Total equals the sum of its line items.

Return: InvoiceId, StoredTotal (from Invoice), CalculatedTotal (SUM of line items)

Show ALL invoices (first 20) with their verification status.
Order by InvoiceId.

**This demonstrates ACID consistency - data should always be in a valid state.**`,
      starterCode: `-- Verify invoice totals match line item sums
-- This checks transactional consistency

SELECT 
    i.InvoiceId,
    i.Total AS StoredTotal,
    -- Calculate sum of line items here
FROM Invoice i
-- Join with InvoiceLine
LIMIT 20;`,
      solution: `SELECT 
    i.InvoiceId,
    i.Total AS StoredTotal,
    ROUND(SUM(il.UnitPrice * il.Quantity), 2) AS CalculatedTotal
FROM Invoice i
INNER JOIN InvoiceLine il ON i.InvoiceId = il.InvoiceId
GROUP BY i.InvoiceId, i.Total
ORDER BY i.InvoiceId
LIMIT 20;`,
      expectedRowCount: 20,
      explanation: `This query verifies ACID Consistency:
- Each invoice total should equal the sum of its line items
- If transactions weren't used during inserts, data could be inconsistent
- JOIN connects invoices to their line items
- GROUP BY aggregates line items per invoice
- SUM calculates the total from individual items`,
      hints: [
        'JOIN Invoice with InvoiceLine on InvoiceId',
        'Use SUM(UnitPrice * Quantity) for calculated total',
        'GROUP BY InvoiceId to aggregate per invoice',
        'ROUND() helps with decimal precision'
      ],
      testQuery: `SELECT i.InvoiceId, i.Total AS StoredTotal, ROUND(SUM(il.UnitPrice * il.Quantity), 2) AS CalculatedTotal FROM Invoice i INNER JOIN InvoiceLine il ON i.InvoiceId = il.InvoiceId GROUP BY i.InvoiceId, i.Total ORDER BY i.InvoiceId LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM (SELECT i.InvoiceId FROM Invoice i INNER JOIN InvoiceLine il ON i.InvoiceId = il.InvoiceId GROUP BY i.InvoiceId ORDER BY i.InvoiceId LIMIT 20);`
    },
    {
      id: 'txn-2',
      title: 'Detect Isolation Level Issues - Lost Updates',
      difficulty: 'medium',
      points: 60,
      description: `Find customers who have made multiple purchases on the same day.

In a concurrent system without proper isolation, simultaneous transactions 
could cause lost updates. Write a query to identify potential conflict scenarios.

Find customers with 2+ invoices on the same date:
- Return CustomerId, FirstName, LastName, InvoiceDate, InvoiceCount
- Only dates with multiple invoices
- Order by InvoiceCount DESC, then InvoiceDate

**This identifies scenarios where transaction isolation is critical.**`,
      starterCode: `-- Find customers with multiple same-day purchases
-- These are scenarios where isolation levels matter

SELECT 
    c.CustomerId,
    c.FirstName,
    c.LastName,
    -- Add date and count
FROM Customer c
-- Join and group appropriately
ORDER BY InvoiceCount DESC;`,
      solution: `SELECT 
    c.CustomerId,
    c.FirstName,
    c.LastName,
    DATE(i.InvoiceDate) AS InvoiceDate,
    COUNT(*) AS InvoiceCount
FROM Customer c
INNER JOIN Invoice i ON c.CustomerId = i.CustomerId
GROUP BY c.CustomerId, c.FirstName, c.LastName, DATE(i.InvoiceDate)
HAVING COUNT(*) >= 2
ORDER BY InvoiceCount DESC, InvoiceDate;`,
      expectedRowCount: 0,
      explanation: `This query identifies concurrent transaction scenarios:
- Multiple invoices on the same day from same customer
- Without proper ISOLATION LEVELS, concurrent updates could conflict
- READ COMMITTED prevents dirty reads
- REPEATABLE READ prevents non-repeatable reads
- SERIALIZABLE prevents phantom reads
The Chinook data has no same-day duplicates, returning 0 rows.`,
      hints: [
        'JOIN Customer with Invoice',
        'Use DATE() to extract just the date part',
        'GROUP BY customer AND date',
        'HAVING COUNT(*) >= 2 filters for duplicates'
      ],
      testQuery: `SELECT c.CustomerId, c.FirstName, c.LastName, DATE(i.InvoiceDate) AS InvoiceDate, COUNT(*) AS InvoiceCount FROM Customer c INNER JOIN Invoice i ON c.CustomerId = i.CustomerId GROUP BY c.CustomerId, c.FirstName, c.LastName, DATE(i.InvoiceDate) HAVING COUNT(*) >= 2 ORDER BY InvoiceCount DESC LIMIT 5;`,
      verificationQuery: `SELECT COUNT(*) as count FROM (SELECT c.CustomerId, DATE(i.InvoiceDate) AS InvoiceDate FROM Customer c INNER JOIN Invoice i ON c.CustomerId = i.CustomerId GROUP BY c.CustomerId, DATE(i.InvoiceDate) HAVING COUNT(*) >= 2);`
    }
  ]
};

// Topic mapping for DBMS challenges
export const DBMS_CHALLENGE_TOPICS = Object.keys(DBMS_CODING_CHALLENGES);

// Helper functions
export function getDbmsChallengesByTopic(topicId) {
  return DBMS_CODING_CHALLENGES[topicId] || [];
}

export function getAllDbmsChallenges() {
  return Object.values(DBMS_CODING_CHALLENGES).flat();
}

export function getDbmsChallengeById(challengeId) {
  for (const challenges of Object.values(DBMS_CODING_CHALLENGES)) {
    const found = challenges.find(c => c.id === challengeId);
    if (found) return found;
  }
  return null;
}

export function getDbmsTotalPoints() {
  return getAllDbmsChallenges().reduce((sum, c) => sum + c.points, 0);
}

export function getDbmsTopicStats(topicId) {
  const challenges = getDbmsChallengesByTopic(topicId);
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

// Chinook database schema reference
export const CHINOOK_SCHEMA = {
  Artist: ['ArtistId', 'Name'],
  Album: ['AlbumId', 'Title', 'ArtistId'],
  Track: ['TrackId', 'Name', 'AlbumId', 'MediaTypeId', 'GenreId', 'Composer', 'Milliseconds', 'Bytes', 'UnitPrice'],
  Genre: ['GenreId', 'Name'],
  MediaType: ['MediaTypeId', 'Name'],
  Playlist: ['PlaylistId', 'Name'],
  PlaylistTrack: ['PlaylistId', 'TrackId'],
  Customer: ['CustomerId', 'FirstName', 'LastName', 'Company', 'Address', 'City', 'State', 'Country', 'PostalCode', 'Phone', 'Fax', 'Email', 'SupportRepId'],
  Employee: ['EmployeeId', 'LastName', 'FirstName', 'Title', 'ReportsTo', 'BirthDate', 'HireDate', 'Address', 'City', 'State', 'Country', 'PostalCode', 'Phone', 'Fax', 'Email'],
  Invoice: ['InvoiceId', 'CustomerId', 'InvoiceDate', 'BillingAddress', 'BillingCity', 'BillingState', 'BillingCountry', 'BillingPostalCode', 'Total'],
  InvoiceLine: ['InvoiceLineId', 'InvoiceId', 'TrackId', 'UnitPrice', 'Quantity']
};

