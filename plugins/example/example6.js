const example = async (m, { conn }) => {

return conn.sendAiMessage(m.chat, [
  // type 2: normal text message
  { type: 2, text: "JavaScript example" },

  // type 5: code block with language
  {
      type: 5,
      codeMetadata: {
          language: "javascript",
          code: 'const esewsub = require("esewsub");\nconsole.log(Object.keys(esewsub));'
      }
  },

  // type 4: table with rows and columns
  {
      type: 4,
      tableMetadata: {
          title: "Commands",
          rows: [
              { isHeading: true, items: ["Command", "Description"] },
              { isHeading: false, items: ["/بنج", "Pong"] },
              { isHeading: false, items: ["/وقت", "Current time"] }
          ]
      }
  }
])

};

example.usage = ["تست6"]
example.category = "example";
example.command = ["تست6"]
export default example;