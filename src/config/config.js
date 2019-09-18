/* @flow */

export default {
  host: process.env.NODE_HOST,
  port: process.env.NODE_PORT,
  apiUrl: process.env.API_URL,
  app: {
    htmlAttributes: { lang: 'en' },
    title: 'React Panda 🐼',
    titleTemplate: 'React Panda 🐼 - %s',
    meta: [
      {
        name: 'description',
        content: 'React boilerplate'
      }
    ]
  }
};
