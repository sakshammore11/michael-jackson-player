const fs = require('fs');

const rawText = `Billie Jean
Beat It
Smooth Criminal (2012 Remaster)
Thriller
Rock With You
Don't Stop 'Til You Get Enough
The Way You Make Me Feel
Chicago
They Don't Care About Us
P.Y.T. (Pretty Young Thing)
Man in the Mirror
Bad
Remember the Time
Don't Matter To Me (Drake feat. Michael Jackson)
Dirty Diana - 2012 Remaster
Black or White
Human Nature
Love Never Felt So Good
Wanna Be Startin' Somethin'
Heal the World
You Rock My World
Heaven Can Wait
You Are Not Alone
Earth Song
I Just Can't Stop Loving You
The Girl Is Mine (with Paul McCartney)
Off the Wall
Say Say Say - Remastered 2015 (with Paul McCartney)
Love Never Felt So Good (Solo Version)
Liberian Girl - 2012 Remastered Version
Leave Me Alone - 2012 Remaster
Hold My Hand (with Akon)
Thriller - Single Version
Baby Be Mine
You Rock My World - Radio Edit
Black or White - Single Version
Blood on the Dance Floor
Scream (with Janet Jackson)
Ben - Single Version
Workin' Day and Night
Dangerous
The Lady in My Life
In the Closet
Jam
Give In to Me
Butterflies
Who Is It
Shake Your Body (Down to the Ground) - Remastered Single Version (The Jacksons)
You Rock My World (Album Version)
I Can't Help It
A Place With No Name
Rockin' Robin
Another Part of Me - 2012 Remaster
Stranger in Moscow
She's Out Of My Life
We Are The World - Live
Say Say Say (Original Version feat. Paul McCartney)
Ghosts
Will You Be There - Single Version
Don't Stop 'Til You Get Enough - 2003 Edit
The Way You Make Me Feel - Single Version
Slave to the Rhythm
Speed Demon - 2012 Remaster
Break of Dawn
Will You Be There (Album Version)
Get on the Floor
Unbreakable
Blue Gangsta
Come Together
One Day In Your Life
Got To Be There - Single Version
This Is It
Rock with You - Single Version
Earth Song - Radio Edit
Hollywood Tonight
Ain't No Sunshine
You Are Not Alone - Single Version
Loving You
I Wanna Be Where You Are
Thriller (Steve Aoki Midnight Hour Remix)
Girlfriend
Xscape
Whatever Happens
Just Good Friends - 2012 Remaster
Love Never Felt So Good (Original Version)
Why You Wanna Trip on Me
It's the Falling in Love
Little Christmas Tree
Burn This Disco Out
Gone Too Soon
2 Bad
Speechless
Wanna Be Startin' Somethin' - Single Version
Smile
Michael Jackson x Mark Ronson: Diamonds are Invincible
Tabloid Junkie
(I Like) The Way You Love Me
Love Never Felt So Good - Fedde Le Grand Remix Radio Edit
Smooth Criminal - Immortal Version
She Drives Me Wild`;

const existingSongs = JSON.parse(fs.readFileSync('src/data/songs.json', 'utf8'));
const existingTitles = existingSongs.map(s => s.title.toLowerCase());

const newSongsList = rawText.split('\n').map(s => s.trim()).filter(s => s.length > 0);

for (const title of newSongsList) {
  const cleanTitle = title.replace(' (Over 3 billion streams)', '');
  if (!existingTitles.includes(cleanTitle.toLowerCase())) {
    // Generate an id
    const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    existingSongs.push({
      id,
      title: cleanTitle,
      album: "Unknown Album",
      energy: 6,
      mood: ["pop", "classic", "dance"],
      spotifyQuery: cleanTitle + " Michael Jackson",
      duration: "4:00"
    });
  }
}

fs.writeFileSync('src/data/songs.json', JSON.stringify(existingSongs, null, 2));
console.log('Added songs to songs.json');
