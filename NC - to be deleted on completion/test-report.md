## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

### GET `/api/articles`

Assertion: The first article should have a comment count of `'13'`: expected undefined to equal '13'

Hints:

- add a `comment_count` property to each article
- join to the `comments` table, as this information lives there
- use an aggregate `COUNT` function
- use `GROUP BY` to avoid duplicate rows

Hi! It looks like you have calculated the total number of articles rather than the number of comments for each article, when we GET all articles.

### GET `/api/articles?sort_by=author`

Assertion: expected 'butter_bridge' to equal 'rogersop'

Hints:

- accept a `sort_by` query, with a value of any column name
- use `author` for the column to store the username that created the article

The sort_by query defaults to descending as according to the readme soooo ... you may want to alter your tests to allow for that. I would be wary of testing too many things within one test block, especially as they might have slightly different behaviours.

### GET `/api/articles?author=butter_bridge`

Assertion: all articles should be by the author in the query: expected [ Array(10) ] to satisfy [Function]

Hints:

- accept an `author` query of any author that exists in the database
- use `where` in the model

Have a look at the other queries too, just so you are not just querying for sort_by and order. Each query will have slightly different behaviour that you will need to solve in your model 😃

### GET `/api/articles/1`

Assertion: expected 13 to equal '13'

Hints:

- ensure you have calculated a comment_count for the article

This is an absolutely ok way to calculate the comment_count using JavaScript but you may want to have a look at using a knex method and let the database do the calucations for you. Perhaps looking at innerJoin!

### PATCH `/api/articles/1`

Assertion: expected 201 to equal 200

Hints:

- use a 200: OK status code for successful `patch` requests

### PATCH `/api/articles/1`

Assertion: expected 201 to equal 200

Hints:

- ignore a `patch` request with no information in the request body, and send the unchanged article to the client
- provide a default argument of `0` to the `increment` method, otherwise it will automatically increment by 1

### GET `/api/articles/2/comments`

Assertion: expected 404 to equal 200

Hints:

- return 200: OK when the article exists
- serve an empty array when the article exists but has no comments

### POST `/api/articles/1/comments`

Assertion: expected { Object (comment_id, author, ...) } to contain key 'comment'

Hints:

- send the new comment back to the client in an object, with a key of comment: `{ comment: {} }`
- ensure all columns in the comments table match the README

This is just the formatting of the response 😁

### PATCH `/api/comments/1`

Assertion: expected 201 to equal 200

Hints:

- use a 200: OK status code for successful `patch` requests

### PATCH `/api/comments/1`

Assertion: expected 201 to equal 200

Hints:

- use 200: OK status code when sent a body with no `inc_votes` property
- send an unchanged comment when no `inc_votes` is provided in the request body
