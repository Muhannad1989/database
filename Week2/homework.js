const prompt = require('prompt');
const util = require('util');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'new_world',
});

connection.connect(err => {
  if (err) throw err;
  console.log('db is connected');
});

const execQuery = util.promisify(connection.query.bind(connection));
const input = util.promisify(prompt.get.bind(this));

async function queryDatabase() {
  prompt.start();
  try {
    await execQuery('use new_world');
    console.log('select a question number between 1 - 5');
    let input_number = await input(['number']);
    let number = input_number.number;
    if (number == 1) {
      console.log('What is the capital of country ?');
      const x = await input(['country']);
      const input_country = x.country;
      const select_x = await execQuery(
        `select city.name 
        from city 
        join country on city.CountryCode = country.code 
        where city.id = country.capital 
        and country.name = '${input_country}'`,
      );
      console.log(select_x);
    } else if (number == 2) {
      console.log('List all the languages spoken in the region ?');
      const y = await input(['region']);
      const input_region = y.region;
      const select_y = await execQuery(
        `select countrylanguage.language 
        from countrylanguage 
        join country on country.code = countrylanguage.countryCode
        where country.region = '${input_region}' 
        group by language;`,
      );
      console.log(select_y);
    } else if (number == 3) {
      console.log('Find the number of cities in which language Z is spoken ?');
      const z = await input(['language']);
      const input_language = z.language;
      const select_z = await execQuery(
        `select count(city.name) as TotalCities 
        from city 
        join countrylanguage on city.countryCode = countrylanguage.countryCode
        where Language = '${input_language}';`,
      );
      console.log(select_z);
    } else if (number == 4) {
      console.log(
        'Are Region and Language there any countries in this region with the given language as the official language ?',
      );
      const result4 = await input(['language', 'region']);
      const input_language = result4.language;
      const input_region = result4.region;
      const results = await execQuery(
        `select countrylanguage.Language , country.name as country  , countryLanguage.IsOfficial from country join city on country.code = city.CountryCode join countrylanguage on city.CountryCode = countrylanguage.CountryCode where country.region = '${input_region}' and Language = '${input_language}' group by country having IsOfficial = 'T' `,
      );
      if (results.length === 0) {
        console.log('false');
      } else {
        console.log(results);
      }
    } else if (number == 5) {
      console.log('List all the continents with the number of languages spoken in each continent?');
      const all_continents = await execQuery(
        `select country.continent , count(countrylanguage.Language) as totalLanguages from country join countrylanguage on country.code = countrylanguage.CountryCode group by Continent `,
      );
      console.log(all_continents);
    }

    // get total language of each country
    // const sql = `select country.name , count(countrylanguage.Language) as languages from country join countrylanguage on country.code = countrylanguage.CountryCode group by country.name`;

    // I want to get alerts when a country has >= 10 languages. E.g. If a country X has 9 languages in the CountryLanguage table,
    // and a user INSERTs one more row in the CountryLanguage table, then I should get an alert.How can I achieve this ?
    // `delimiter $$
    //  CREATE TRIGGER my_trigger BEFORE INSERT
    //  ON CountryLanguage
    //  FOR EACH ROW
    //  BEGIN
    //  declare sql = `select country.name , count(countrylanguage.Language) as languages from country join countrylanguage on country.code = countrylanguage.CountryCode group by country.name`
    //  IF ( sql >= 10) THEN
    //  SET sql = 'limit 10';
    //  END IF;
    //  END $$
    //  delimiter ; `,

    // INSERT INTO CountryLanguage VALUES ('RGB','arabic','F','1.5')
  } catch (error) {
    console.error(error);
  }

  connection.end();
}

queryDatabase();
/******************************************************************/

// Database dump
// A database dump (aka SQL dump)
