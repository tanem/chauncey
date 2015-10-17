import https from 'https';
import concat from 'concat-stream';
import findNearest from 'find-nearest-file';
import habitat from 'habitat';

export default ({ url, token, done = () => {} }) => {
    
  try {
    token = token || findToken();
  } catch (error) {
    return done(error);
  }

  https.get(
    `https://api-ssl.bitly.com/v3/shorten?access_token=${token}&longUrl=${url}&format=txt`,
    (res) => res.pipe(
      concat({ encoding: 'string' }, (res) => done(null, res))
    )
  ).on('error', done);

};

function findToken() {
  habitat.load(findNearest('.chaunceyrc'));
  const token = habitat.get('BITLY_ACCESS_TOKEN');
  if (!token) throw new Error('BITLY_ACCESS_TOKEN not found');
  return token;
}
