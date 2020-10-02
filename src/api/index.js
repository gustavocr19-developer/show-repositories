const axios = require('axios')

const username = 'tuliofaria'
const url = `https://api.github.com/users/${username}/repos`


const extractData = async () => {

  const result = axios.get(url)
    .then(response => {
      let arr = []

      response.data.map((item) => {
        const { id, name, html_url, description, language } = item
        arr.push({
          id,
          name,
          html_url,
          description,
          language
        })
      })

      return arr
    })
    .catch(error => {
      console.log(error)
      return error
    })

  console.log(result)
  return result
}
console.log(extractData())

module.exports = {
  extractData
}