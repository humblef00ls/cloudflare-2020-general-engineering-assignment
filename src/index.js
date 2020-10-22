addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
const links = [
  { "name": "Arctic Monkeys - 505", "url": "https://www.youtube.com/watch?v=qU9mHegkTc4" },
  { "name": "Молчат Дома - Судно ", "url": "https://www.youtube.com/watch?v=HR5zpFs7YpY" },
  { "name": "Indila - Tourner Dans Le Vide", "url": "https://www.youtube.com/watch?v=vtNJMAyeP0s" },
  { "name": "DIVINE - Chal Bombay Vs Cradles", "url": "https://www.youtube.com/watch?v=_0KB7_AKGkM" }
]
const social = [
  {"svg":`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>` , "url" : "https://aparimeya.xyz"},
  {"svg":`<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>` , "url" : "https://www.instagram.com/humblef00ls/"},
  {"svg":`<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>` , "url" : "https://www.linkedin.com/in/aparimeya-taneja-1a7300162/"},
  {"svg":`<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>` , "url" : "https://twitter.com/aparimeya"}
]
class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {

    this.links.forEach(link => {
      element.append(`<a href='${link.url}'>${link.name}</a>`, {html : true} )
    });
  }
}
class SocialLinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    element.removeAttribute('style');
    element.setAttribute('style', `
                                  height:50px;
                                  backdrop-filter:blur(10px);
                                  -webkit-backdrop-filter:blur(10px);
                                  display:flex;
                                  align-items:center;
                                  border-radius:5px;
                            `)
    this.links.forEach(link => {
      element.append(`<a href = ${link.url}><svg  viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"  >${link.svg}></svg></a>`, {html : true} )
    });
  }
}
class OtherTransformer {
  constructor(type) {
    this.type = type
  }
  async element(element) {
    switch(this.type){
      case 'profile' : element.removeAttribute('style'); break
      case 'name' : element.setInnerContent('humblef00ls', {html : false}); break
      case 'img' : element.setAttribute('src', 'https://storage.googleapis.com/staticstuff/aparimeya.jpg'); break
      case 'title' : element.setInnerContent('Aparimeya Taneja', {html : false}); break
      case 'body' : element.setAttribute('style', `
                          background: url('https://storage.googleapis.com/staticstuff/spacemanjam.jpg'); 
                          background-size: cover;
                          background-repeat:no-repeat;
                          background-position:center;
                          `); break
    }    

  }
}
async function handleRequest(request) {
  const route = new URL(request.url).pathname
  switch(route){
    case '/links' :return  getlinks(request); break;
    default: return page(request); 
  }

}

async function page(request){
  const page = await fetch('https://static-links-page.signalnerve.workers.dev',{
    headers: { "content-type": "text/html;charset=UTF-8"}
  })

  return  rewriter.transform(page) 

}

const rewriter = new HTMLRewriter()
                      .on("div#links", new LinksTransformer(links))
                      .on('div#profile', new OtherTransformer('profile'))
                      .on('h1#name', new OtherTransformer('name'))
                      .on('img#avatar',new OtherTransformer('img'))
                      .on('div#social',new SocialLinksTransformer(social))
                      .on('title',new OtherTransformer('title'))
                      .on('body',new OtherTransformer('body'))
                      



async function getlinks(request){
  return new Response(JSON.stringify(links), {
    headers: { 'content-type': 'application/json' },
    status: 200
  })
}
