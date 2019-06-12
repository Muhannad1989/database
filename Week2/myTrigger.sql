delimiter $$
 CREATE TRIGGER my_trigger55
    BEFORE INSERT
        ON countrylanguage
            FOR EACH ROW
            BEGIN
                DECLARE message VARCHAR(100);
                DECLARE var1 VARCHAR(255) ;
                SET var1= ( select count(countrylanguage.Language) as languages from country join countrylanguage on country.code = countrylanguage.CountryCode where countryCode = new.countryCode);
                IF var1 >=10 
                THEN
                    set message= 'can no insert more than 10 languages for this country';
                    SET lc_messages=message; SIGNAL SQLSTATE '45000';
                END IF;
            END $$
 delimiter ;