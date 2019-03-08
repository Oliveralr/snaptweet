//SnapTweet TypeScript Version (Ported to new ES Version)
//Created By JhonONolan
//Ported By Oliveralr

// Import things
const twitter:any = require('twitter');
const moment:any  = require('moment');

// Auth to Twitter
const client:object = new twitter({
    consumer_key: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
    consumer_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    access_token_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    access_token_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
});

// Do things!
const snapTweet = () => {

    // Let's get some tweets
    client.get('statuses/user_timeline', {trim_user: true, count: 20}, (error, tweets, response) => {
      if(error) throw error;

      let i:number = 0;
      let len:number = tweets.length;

      // Loop through them
      for (i; i < len; i++) {

          let id:any = tweets[i].id_str;
          let favd:any = tweets[i].favorited;
          let tweetDate:object = new Date(Date.parse(tweets[i].created_at.replace(/( \+)/, ' UTC$1')));

          // Set an expiry date of 24 hours after a tweet has been published
          let expiryDate:any = moment(tweetDate).add(1440, 'minutes')._d;
          let now:any = moment();

          // If we find a tweet which is expired, call the function to delete it.
          // Unless it's favourited, in which case leave it alone.
          if (moment(now).isAfter(expiryDate) && moment(tweetDate).isAfter('2016-03-03') && favd === false) {
              deleteTweet(id);
          }

      }

    });

}

// Delete a specific tweet
const deleteTweet = (e) => {
    client.post('statuses/destroy', {id: e}, (error, tweet, response) => {
        if(error) console.log(error);
    });
}

// Run every minute
setInterval(() => {
    snapTweet();
}, 60000);
