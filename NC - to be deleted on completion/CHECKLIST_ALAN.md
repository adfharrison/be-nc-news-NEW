# BE Northcoders News Check List

## Readme

- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `knexfile.js`
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

I would definitely try to get a README writted before the end of next week as you have a good portfolio piece here!

## General

- [ ] Remove any unnecessary `console.logs` and comments
- [ ] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)

This is just clean up before you send this out to any prospective employers.

## Migrations

- [ ] Use `notNullable` on required fields
- [✓] Default `created_at` in articles and comments tables to the current date:`.defaultTo(knex.fn.now());`
- [ ] Delete all comments when the article they are related to is deleted: Add `.onDelete("CASCADE");` to `article_id` column in `comments` table.

You have used 'SET NULL' in this instance but we probably do want to delete all the comments upon deletion of an article so 'CASCADE' is a nice way to do this

## Seeding

- [✓] Make sure util functions do not mutate data
- [✓] Make util functions easy to follow with well named functions and variables
- [✓] Test util functions
- [✓] Migrate rollback and migrate latest in seed function

## Tests

- [ ] Cover all endpoints and errors
- [ ] Ensure all tests are passing

Very nearly there ... Just a couple of bit that I have expained in you test report 😁

## Routing

- [✓] Split into api, topics, users, comments and articles routers
- [✓] Use `.route` for endpoints that share the same path
- [✓] Use `.all` for 405 errors

## Controllers

- [✓] Name functions and variables well
- [✓] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- [ ] Consistently use either single object argument _**or**_ multiple arguments in model functions

I would probably extract the id off the re.params object before passing through to the model and then handle if the argument evalutates to undefined.

- [ ] No unnecessary use of `.modify()` (i.e. only for author and topic queries)

When handling the extra queries(more info in test report), the need for this method will become more apparent :)

- [ ] Use `leftJoin` for comment counts

Have a look at your test report for more info on this :)

## Errors

- [✓] Use error handling middleware functions in app and extracted to separate directory/file
- [✓] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Advanced Tasks

These tasks are for after everything else has been completed on the README ... I've left them on as I know you like a challenge!

### Easier

- [ ] Patch: Edit an article body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an article by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get articles created in last 10 minutes
- [ ] Get: Get all articles that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for topics
