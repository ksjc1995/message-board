# Message Board

Simple Application to view and post messages

# Local setup

1. Clone the repo - `git clone https://github.com/ksjc1995/message-board.git`
2. Navigate to the project root dir - `cd message-board`
3. Install node modules - `yarn`
4. Create `.env.development.local` file in the root dir of the project & add the following envioronment variables

```
REACT_APP_API_BASE_URL = https://mapi.harmoney.dev/api/v1/
REACT_APP_API_TOKEN = <INSERT-TOKEN-HERE>
```

5. Run the app in development mode using `yarn start`. Open [http://localhost:3000](http://localhost:3000) to view in the browser.

# Live Application

[https://message-board-gilt.vercel.app/](https://message-board-gilt.vercel.app/)

Note:- Yarn can be installed with npm using `npm i -g yarn`
