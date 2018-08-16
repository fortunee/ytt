import Axios from 'axios';
import * as config from '../config.json';
import moment from "moment";

const axios = Axios.create({
  baseURL: config.youtubeApi.endpoint
});

export class YoutubeService {
  getTrendingVideos (country) {
    const params = {
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: country, // should be replaced with country code from countryList
      maxResults: '24',
      key: config.youtubeApi.key
    };

    let result = [];

    return axios.get('/', {params}).then(async function(res){
      result = res.data.items;
      for (let i = 0; i < result.length; i++) {
        const statistics = await YoutubeService.getVideoDetails(result[i]);
        result[i] = {
          id: result[i].id,
          title: result[i].snippet.title,
          thumbnail: result[i].snippet.thumbnails.high.url,
          publishedAt: moment(result[i].snippet.publishedAt).fromNow(),
          viewCount: statistics.viewCount,
          likeCount: statistics.likeCount,
        };
      }

      return result;
    });

  }

  static getVideoDetails(video) {
    const params = {
      part: 'statistics',
      id: video.id,
      key: config.youtubeApi.key
    };

    return axios.get('/', {params}).then(function(res) {
      const result = res.data;
      video.viewCount = result['items'][0].statistics.viewCount;
      video.likeCount = result['items'][0].statistics.likeCount;

      return video;
    });
  }
}
