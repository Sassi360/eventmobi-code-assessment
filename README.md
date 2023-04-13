
# Code Assessment for Front-end Engineer

Candidate: `Mohamed Sassi`

Email: `mohamed@msassi.dev`

Linkedin: [@Sassim](https://www.linkedin.com/in/sassim/)


### Details
Use the API provided by GitHub Gist API ([Gists Endpoint](https://docs.github.com/en/rest/gists?apiVersion=2022-11-28)), create a basic website as a single-page app with React.

Your task is to use Gist API to create a simple single-page application. A user should be able to enter a username and get the full list of public Gists for that user. The following are a list of functional requirements for this assignment:

- Search: When a user enters a username, it should be able to get a full list of public Gists by that user.

- Filetype: Convert the filetypes of the files in the gist into a tag/badge, e.g, if the returned gist has list of files containing python and JavaScript files, the gist should have the respective tags/badges).

- Fork: Username/Avatar of the last 3 users who forked it with avatar linking to the fork.

## Demo

[Link to demo](https://test-project-fcqu.onrender.com/)


### Steps to achieve this tasks
    1. Set up a React project with TypeScript. [Done]
    2. Use the GitHub Gist API to fetch public Gists by a given username. [Done]
    3. Display the list of Gists with their filetypes converted into tags/badges. [Done]
    4. For each Gist, fetch its forks using the Gist API and display the username and avatar of the last 3 users who forked it, linking to their forks. [Done]
    5. Add a search bar for the user to enter a username and fetch the corresponding Gists.[Done]
    6. Handle errors and edge cases appropriately.[Done]


### Bonus Points:

Several improvements with the potential to enhance the overall experience:

    - Implementing pagination or infinite scrolling for the list of Gists to improve performance for users with many Gists. [N/A]
    - Adding caching or debounce functionality for the search bar to reduce unnecessary API calls. [Already Implemented]
    - Adding sorting or filtering options for the list of Gists.
    - Improving the UI/UX design of the app.




## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_ACCESS_TOKEN`



## Tech Stack

**Client:** React, Vite, Chakra UI, react-use, tabler icons, axios
