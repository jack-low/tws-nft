import { BEAST as BST } from './lib/cms.main.js' ;
import { Base64, uuid, c2j } from './lib/Utile.js';

const bst = new BST();

export const preview = (e) => {
  const _title = $(`//*[@id="${preViewId}"]/parent::*/parent::div[1]/div[1]/label/h3`)[0].outerHTML;
  bst.logger(["PreView",preViewText,e.target.id,preViewId]);
  bst.logger(["Preview",_title]);
  preView.innerHTML = `${_title}\n${preViewText}`;
}

export const customHeaders = (ct=1, ch="CUSTOM-HEADER-NAME",) => {
  const CONTEXT_TYPES = ['text/plain','application/json','multipart/form-data']
  const headers = new Headers({'Content-Type': CONTEXT_TYPES[ct],'X-Custom-Header': ch });
  return headers;
};

export const customInit = (hd=customHeaders(), accepe='application/json', flag=1, body="") => {
  let inits = { method: ((flag)? 'GET':'POST'), headers: hd, Accept: accepe, mode: 'no-cors', cache: 'default', redirect: 'follow', credentials: 'same-origin'};
  if( !flag && body && accepe == 'application/json' ) { inits['body'] = JSON.stringify(body);};
  if( !flag && body && accepe != 'application/json' ) { inits['body'] = body;};
  return inits;
};

export const apiRequest = async (u, f=1, inits=customInit()) => {
  let receivedLength = 0,
      position = 0,
      chunks = [];

  const custominit = inits,
        customRequest = new Request(u, custominit);

  let response = await fetch(customRequest);
  const reader = response.body.getReader(),
        contentLength = +response.headers.get('Content-Length');

  while(true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
  }
  let chunksAll = new Uint8Array(receivedLength);
  for(let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }

  let result = new TextDecoder("utf-8").decode(chunksAll);

  switch(f){
      case 1:
        return JSON.parse(result);
      case 0:
      case 2:
      default:
        return result;
    }
};
export const sign_up = (e) => {
  bst.sign_up_contents.classList.remove("d-none");
  bst.main_display.classList.add("d-none");
}
export const btn_event = (e) => {
  const target = e.target;
  switch(target.dataset.type){
    case 'sign_up':
      bst.alertMessage("coming",0,2000);
      // sign_up(e);
      break;
    case 'sign_in':
      bst.alertMessage("ただいま、準備中です...");
      break;
    case 'read_more':
      if(location.hash != '#main_contents') location.href = `${location.origin}/?#main_contents`;
      break;
    default:
      break;
  }
}
export const link_event = (e) => {
  const target = e.target;
  switch(target.dataset.type){
    case 'sign_up':
      // sign_up(e);
      break;
    default:
      break;
  }
}
export const init = async () => {
  bst.sign_up_contents = $("#sign_up_contents");
  bst.main_display = $("#main_display");
  for(let b of $("button")) {
    b.addEventListener('click', btn_event, false);
  };
  for(let a of $("a")) {
    a.addEventListener('click', link_event, false);
  };
}

window.addEventListener("load", async()=>{
  let u = `${bst.protocol}//${bst.host}/tws-nft/static/json/util.json`;
  apiRequest(u).then(async (res) => {});
  init();
});
