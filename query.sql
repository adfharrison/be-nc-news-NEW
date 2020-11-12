\c nc_news_test;
\dt;

SELECT * 
FROM articles 
ORDER BY created_at DESC  
OFFSET 2 ROWS
FETCH NEXT 2 ROWS only;