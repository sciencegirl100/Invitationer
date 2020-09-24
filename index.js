#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const pjscrape = require('pj-scraper');
const webscrape = require('website-scraper');
const uuid = require('uuid-random');
var argv = require('minimist')(process.argv.slice(2));
var query = 'discord.gg site:';
var opt = {
  depth: 2,
  site: 'reddit.com'
};
var linkArray = [];
var invites = [];

if(typeof argv.help !== 'undefined'){
  console.log('~ Invitationer ~');
  console.log('');
  console.log('node index.js --site="example.com" --depth=5');
  console.log('');
  console.log('--site     website to scrape for invites');
  console.log('  Default: reddit.com');
  console.log('--depth    number of search page results to pull (rougly 10 results per page)');
  console.log('  Default: 2');
  console.log('--output   specify file to dump links to');
  console.log('  Default: [empty]');
  process.exit();
}
if (typeof argv.site !== 'undefined'){
  if(typeof argv.site === 'string'){
    opt.site = argv.site;
  }else{
    console.log('--site must be set to a string');
    process.exit();
  }
}
if (typeof argv.depth !== 'undefined'){
  if(typeof argv.depth === 'number'){
    opt.depth = argv.depth;
  }else{
    console.log('--depth must be set to an integer');
    process.exit();
  }
}

runQuery(opt.site, opt.depth);

async function runQuery(site, depth){
  query += site;
  let job = {
    search_engine: 'google',
    keywords: [query],
    num_pages: depth
  };
  var res = await pjscrape.scrape({}, job);
  //console.dir(res.results[query] , {depth: null, colors: true});
  var finalPages = Object.keys(res.results[query]).length;
  for(var i = 0; i < finalPages; i++){
    var arrFix = i+1;
    if(typeof res.results[query][arrFix] !== 'undefined'){
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
  if (typeof argv.output !== 'undefined'){
    var cache = ""
    uniqueInvites.forEach(e => {
      cahce += e + '\n';
    });
    fs.writeFileSync(argv.ourput, cache, (err) => {
      console.log(err);
    })
  }
}

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