const contentful = require('contentful')

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "1hpnntply6oj",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.REACT_APP_CONTENTFUL
})

export default client
