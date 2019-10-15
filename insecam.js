const screenshot = require('screenshot-desktop')

const runScript = () => {
  const Iceberg = require('node-iceberg')
  const conf = { iteratorElement: { url: "http://www.insecam.org/en/bytype/Axis/", iterator: '?page=', maxPage: 2 }, selector: { element: 'img', attrib: 'src' } }
  const scraper = new Iceberg("http://insecam.org")
  const results = scraper.start(conf).then((results) => {
  let arrayOfCam = results.children[0].selector;
  let selectedItem = arrayOfCam[Math.floor(Math.random()*arrayOfCam.length)];
  require("openurl").open(selectedItem)
  screenshot({ filename: 'shot.jpg' }).then((imgPath) => {});

  }).catch((err)=>{ throw err })
};

setInterval(() => {
    runScript()
}, 3000);
