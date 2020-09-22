const fs = require('fs')
const path = require('path')
const pjscrape = require('pj-scraper')
const webscrape = require('website-scraper')
const uuid = require('uuid-random')
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

var query = 'discord.gg site:' + config.search.site;
var linkArray = [];
var invites = [];
(async () => {
  let job = {
    search_engine: 'google',
    keywords: [query],
    num_pages: config.search.max_pages
  };
  var res = await pjscrape.scrape({}, job);
  //console.dir(res.results[query] , {depth: null, colors: true});
  var finalPages = Object.keys(res.results[query]).length;
  for(var i = 0; i < finalPages; i++){
    var arrFix = i+1;
    if(typeof res.results[query][arrFix] !== undefined){
      try{
        var page = res.results[query][arrFix].results;
        //console.dir(page , {depth: null, colors: true});
        page.forEach(element => {
          // For each Result....
          linkArray.push(element.link);
        });
      } catch(e){
        console.log('PG('+arrFix+') '+e);
      }
    }
  }
  await yankList(linkArray);
  var uniqueInvites = [...new Set(invites)];
  uniqueInvites.forEach(e => {
    console.log(e);
  })
})();

async function yankList(links) {
  const opt = {
    urls: links,
    directory: './cache/'+uuid()+'/'
  };
  const result = await webscrape(opt);
  var files=fs.readdirSync(opt.directory);
    for(var i=0;i<files.length;i++){
        var filename=path.join(opt.directory,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            //fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf('.html')>=0) {
            // Scan file...
            // console.log(filename)
            var contents = fs.readFileSync(filename, 'utf8');
            pullInvite(contents, filename);
        };
    };
}

function pullInvite(haystack, link){
  //console.log(haystack.length)
  if(/discord\.gg\/[a-zA-Z0-9]+/.test(haystack)){
    // Link Found!
    var regx = /discord\.gg\/[a-zA-Z0-9]+/g;
    var out = regx.exec(haystack);
    out.forEach(e => {
      //console.log('https://'+e)
      invites.push('https://'+e);
    })
  }else{
    // console.log("Link not found in " + link)
  }
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};