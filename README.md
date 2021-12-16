# TRIP OUT!

Trip Out is an application that eliminates the inevitable stress that comes with planning and keeping track of a group outing. Whether it's a night on the town or a trek around the globe, Trip Out provides your group with a single source to plan, chat, map, and split expenses with just a few taps. Use this app and your next group trip out won't make you trip out! :smile:

## Features
##would like to reorganize this to better match the homepage etc
* Users can invite other users to become friends. 
    * (The friend request can be canceled by the sender or rejected by the receiver.)
* A user can create a Trip and invite any friend to join the trip. 
    * The friend can accept or reject the invitation, and they can invite any of their friends to the Trip.
* Friends in a given Trip can add Events and Expenses to the trip.
    * Events will appear on the Trip Map and Trip Calendar. 
    * Expenses are tracked by which Friend paid for what, and can also be viewed by Category.
* In the Trip Map, a Friend can choose to pin their location, so other Friends in that Trip can view them on the Trip Map.
* A Friend is able to leave a trip at any time, as long as no expenses have yet been added.
* The Friend who created the Trip is the only one with the ability to mark the Trip as closed and edit details about the Trip such as location and dates.
* The Group Chat is accessible to all Friends in a Trip and the entire group chat history is viewable by all Friends in the Trip.
    * The Group Chat will still be accessible after a Trip is closed if there are any unpaid debts remaining.
* After a Trip is closed, the expenses are divided evenly between the Friends, and a table displays the minimum number of transactions for each person to pay their friends back.
    * Only the person who is owed money may mark the owed money as being paid.

## Tech Stack
* Socket.io
* Google Maps API
* React.js
* Material UI
* Node.js
* PostgreSQL
* Redux
* WebSocket

## Links

- [Github Repo](https://github.com/2107-Capstone/capstone "Trip Out Repo")

- [Live on Heroku](https://trip-out.herokuapp.com/ "Live View")

<!-- - [Bugs](https://github.com/Rohit19060/<project-name>/issues "Issues Page")

- [API](<API Link> "API") -->

## Screenshots

![Home Page](/screenshots/1.png "Home Page")

![](/screenshots/2.png)

![](/screenshots/3.png)

## Available Commands

In the project directory, you can run:

### `npm start" : "react-scripts start"`,

The app is built using `create-react-app` so this command Runs the app in Development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. You also need to run the server file as well to completely run the app. The page will reload if you make edits.
You will also see any lint errors in the console.

### `"npm run build": "react-scripts build"`,

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app will be ready to deploy!

### `"npm run test": "react-scripts test"`,

Launches the test runner in the interactive watch mode.

### `"npm run dev": "concurrently "nodemon server" "npm run start"`,

For running the server and app together I am using concurrently this helps a lot in the MERN application as it runs both the server (client and server) concurrently. So you can work on them both together.

### `"serve": "node server"`

For running the server file on you can use this command.

### `npm run serve`

## Built With

- JavaScript
- Node
- NPM
- Webpack
- HTML
- CSS

## Future Updates

- [ ] Reliable websockets
- [ ] Functionality to edit and delete expenses
- [ ] Functionality to prevent booking overlapping trips and events
    - [ ] Calendar blocking so you are unable to be invited to a trip during dates that you have blocked or are already in a trip
- [ ] Voting feature to poll your friends to pick the best dates for your trip, or to vote on events in your trip
- [ ] See who created an event and who was the last person to update it
- [ ] Group photo albums
- [ ] Private messaging between any friend, regardless of if you are in a trip with them
- [ ] User profiles with trip stats
- [ ] OAuth with Google/Github log in
- [ ] Make app downloadable for mobile and desktop
- [ ] Prevent a friend request/invite from being able to be sent twice
- [ ] Be able to opt out of a particular expense if it does not apply to you
- [ ] International accessibility


## Developers
**Andy Gao**
- [Profile](https://github.com/rohit19060 "Rohit jain")

**Corinne Tinacci**
- [Profile](https://github.com/rohit19060 "Rohit jain")

**Jonathan Martinez**
- [Profile](https://github.com/rohit19060 "Rohit jain")


## 🤝 Support

Contributions, issues, and feature requests are welcome!

Give a ⭐️  if you like this project!

**Template from Rohit Jain**

- [Profile](https://github.com/rohit19060 "Rohit jain")
- [Email](mailto:rohitjain19060@gmail.com?subject=Hi "Hi!")
- [Website](https://kingtechnologies.in "Welcome")