const axios = require('axios')
const constants = require('./enviroment')
const moment = require('moment')

class Helper {
  async getDataFeed () {
    try {
      // calling both API in axios
      return await axios.all([
        axios.get(constants.dataFeedAPI),
        axios.get(constants.videoMetaAPI)
      ])
        .then(axios.spread((dataFeed, videoMeta) => {
          // define three Constant so it will easy to filter data
          const topStories = []
          const mostPopular = []
          const environment = []

          // check data in loop to join both response and compare category
          for (let i = 0; i < dataFeed.data.length; i++) {
            const data = {
              headline: dataFeed.data[i].headline,
              updated: moment.unix(dataFeed.data[i].updated).format('D MMM YYYY'),
              introduction: dataFeed.data[i].introduction,
              type: dataFeed.data[i].type,
              category: dataFeed.data[i].category
            }
            if (dataFeed.data[i].type === 'video') {
              for (let j = 0; j < videoMeta.data.length; j++) {
                if (dataFeed.data[i].video_id === videoMeta.data[j].id) {
                  // calculating duration into minuts and seconds
                  const durationMinuts = (Math.floor(videoMeta.data[j].duration_secs / 60))
                  const durationSecond = (videoMeta.data[j].duration_secs - durationMinuts * 60)
                  data.video = {
                    duration: (durationMinuts + 'm ' + durationSecond + 's'),
                    caption: videoMeta.data[j].caption,
                    placeholder_image: videoMeta.data[j].placeholder_image,
                    video_url: videoMeta.data[j].video_url
                  }
                }
              }
            }
            if (data.category === 'top stories') {
              topStories.push(data)
            } else if (data.category === 'most popular') {
              mostPopular.push(data)
            } else if (data.category === 'environment') {
              environment.push(data)
            }
          }

          // filter top stories news to top video before story
          const newTopStories1 = topStories.filter((el) => {
            return el.type === 'video'
          })
          const newTopStories2 = topStories.filter((el) => {
            return el.type === 'story'
          })
          const finalTopStories = newTopStories1.concat(newTopStories2)

          // filter most popular news to top video before story
          const newMostPopular1 = mostPopular.filter((el) => {
            return el.type === 'video'
          })
          const newMostPopular2 = mostPopular.filter((el) => {
            return el.type === 'story'
          })
          const fanalMostPopular = newMostPopular1.concat(newMostPopular2)

          // filter environment news to top video before story
          const newEnvironment1 = environment.filter((el) => {
            return el.type === 'video'
          })
          const newEnvironment2 = environment.filter((el) => {
            return el.type === 'story'
          })
          const fanalEnvironment = newEnvironment1.concat(newEnvironment2)

          return (finalTopStories.concat(fanalMostPopular)).concat(fanalEnvironment)
        }))
    } catch (err) {
      console.log(err)
      return null
    }
  }
}

module.exports = new Helper()
