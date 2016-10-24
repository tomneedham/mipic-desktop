const fs = require('fs');
var schedule = require('node-schedule');
var request = require('request');
const wallpaper = require('wallpaper');

var cursor = 1;

function setWallpaper(category) {
    console.log('Setting wallpaper');
    var num = 50;
    console.log('Getting images');
    request('https://api.mipic.co/v6/images/?category='+category+'&number='+num+'&cursor='+cursor, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = JSON.parse(response.body).data;
          var randomImage = data[parseInt(Math.random()*data.length)];
          var imageURL = randomImage.mobile_grid_image.replace('_250', '_500@2x');
          var imageName = 'wallpaper.'+imageURL.split('.').pop();
          console.log('Downloading '+imageURL);
          request(imageURL).pipe(fs.createWriteStream(imageName));
          wallpaper.set(imageName).then(() => {
              console.log('Done.');
          });
          cursor = cursor + num;
      }
    });
}

setWallpaper('landscapes');

var j = schedule.scheduleJob('*/30 * * * *', function(){
  setWallpaper('landscapes');
});
