'use strict'

import { Base64 , uuid, c2j } from './Utile.js';
import { version } from './Version.js';

export class BEAST extends Base64 {
  #reader
  #hashref
  #template_list
  #clone_element_list
  #debug_mode
  constructor(CustomRegex=/^cmt-[\w-]*$/g){
    super();
    window.$ = (x) => {
        const cln = /^\./g
        const idn = /^#/g
        const nem = /^[+]/g
        const xpath = /^\/\/(.*)/g
        const tag = /^(\S+)/g
        if (typeof x == "string") {
          if(x.match(cln)) return document.getElementsByClassName(x.replace(cln, ""))
          if(x.match(idn)) return document.getElementById(x.replace(idn, ""))
          if(x.match(nem)) return document.getElementsByName(x.replace(nem, ""))
          if(x.match(xpath)) return document.getElementsByXPath(x)
          if(x.match(tag)) return document.getElementsByTagName(x)
        }
        return x
      }
    BEAST.debug_mode = 0;
    this.load_data   = 0;
    this.Language = {"en":{"Language":"English"},"ja":{"Language":"日本語"}};
    this.version = new version().show();
    this.hasher  = {};
    this.checkerList   = {};
    this.createElements = {};
    this.logs   = [];
    this.host   = location.host;
    this.protocol   = location.protocol;
    this.#hashref   = [];
    this.template_list = [];
    this.#template_list = [];
    this.#reader = new FileReader();
    BEAST.DefaultAllowlist = {'*': [],a: [],area: [],b: [],br: [],col: [],code: [],div: [],em: [],hr: [],h1: [],h2: [],h3: [],h4: [],h5: [],h6: [],i: [],img: [], button:[], li: [],ol: [],p: [],pre: [],s: [],small: [],span: [],sub: [],sup: [],strong: [],u: [],ul: []};
    this.bootstrapList = BEAST.DefaultAllowlist;
    this.token_lists = {
      "CustomRegex": [CustomRegex,/^bst-[\w-]*$/i],
      "tokenCheck": [/\{(\S+)\}/g,/\{(\S+)\}/i],
      "ifCheck": [/\*bst(\S+)="(\S+)"/g,/\*bst(\S+)="(\S+)"/i],
      "forCheck": [/(.+)\s\*(bst)(for)="(let|const|var)\s(\S+)\sin\s(\S+)"(.+)/g,/(.+)\s\*(bst)(for)="(let|const|var)\s(\S+)\sin\s(\S+)"(.+)/i,/(.+)\s\*(.*)\s(.+)"/i],
      "ifMatch":[/\*bst(\S+)="\'(\S+)\'\s==\s\'(\S+)\';"/g,/\*bst(\S+)="\'(\S+)\'\s==\s\'(\S+)\';"/i,/(.+)\s\*(.*)\s(.+)"/i],
      "contentsCheck": [/\{([a-z]+).([a-z]+)\}/g,/\{([a-z]+).([a-z]+)\}/i],
      "contentsHeader": [/data:(\S+)\/(\S+);(\S+),(\S+)/i],
      "customTags": [/\#(\S+)\=/g,/\#(\S+)\=/i,/([a-z]+)/i],
      "checker":[/\#(check)="(hidden|textarea|select|checkbox|text)"/g,/\#(check)="(hidden|textarea|select|checkbox|text|date|radio)"/i,/(.*)\#(check)="(hidden|textarea|select|checkbox|text)"(.*)/g],
      "base64":[/(\S+);base64,(\S+)/g,/(\S+);base64,(\S+)/i]
    }
    this.xpath_token = {
      "id":[`//*[@id='{0}']`],
      "tagname":[`//{0}`]
    };
    this.custom_document = {};
    this.run();
  }
  Error_Page(err){
    let html = "";
    switch(err){
      case "404":
        html = `<h2>[${err}] ページが見つかりませんでした</h2>`;
        break;
      default:
        html = `<h2>[${err}]</h2>`;
    }
   return html; 
  }
  logger(s){
    if(this.debug_mode){
      switch(typeof s){
        case 'object':
          s.timeStamp = new Day()._d;
          s.typeof    = `${typeof s}`;
          this.logs.push(s);
          this.function_change(`console.dir(${JSON.stringify(s)})`);
          break;
        default:
          let msg = {message:s,stack:s,typeof:`${typeof s}`};
          msg.timeStamp = new Day()._d;
          this.logs.push(msg);
          this.function_change(`console.log('${s}')`);
      };
    }
  }
  k2v(args){
    let sgra = {};
    Object.keys(args).forEach(key => sgra[args[key]] = key);
    return sgra;
  }
  loading_status_create(){
    this.custom_document.span = [];
    const span = document.createElement("span");
    span.setAttribute("role","status");
    span.classList.add("spinner-grow","spinner-grow-sm");
    span.id = "loading";
    span.setAttribute("style","margin-left: auto;margin-top: -4.15%; margin-right: 3%;");
    this.bootstrapList.span.push(span);
  }
  progressbar_create(){
    const _div = document.createElement("div");
    const parent= _div.cloneNode(false),
          children = _div.cloneNode(false);
    parent.id = "progress";
    parent.classList.add("progress");
    children.classList.add("progress-bar");
    children.id = "progress_bar";
    children.setAttribute("role","progressbar");
    children.setAttribute("aria-valuemax","100");
    children.setAttribute("aria-valuenow","0");
    children.setAttribute("aria-valuemin","0");
    children.setAttribute("style","width: 0px;");
    parent.appendChild(children);
    this.bootstrapList.div.push(parent);
  }
  UUIDv4(){return `${uuid.v4()}`;}
  base64Encode(e){return BEAST.base64Encode(e);}
  base64Decode(txt,char){return BEAST.base64Decode(txt,char);}
  base64DecodeAsBlob(txt,type = "text/plain;charset=UTF-8"){return BEAST.base64DecodeAsBlob(txt,type);}
  function_change(argument) {
    return Function('"use strict";' + argument + '')();
  }
  contentsHeaderCheck(content){
    return content.match(this.token_lists['contentsHeader'][0]);
  }

  forCheck(e){
    this.logger(this.authors_list);
    this.logger(this.categoly_list);
  }

  customHeaders(ct=1, ch="CUSTOM-HEADER-NAME",) {
    const CONTEXT_TYPES = ['text/plain','application/json','multipart/form-data']
    const headers = new Headers({'Content-Type': CONTEXT_TYPES[ct],'X-Custom-Header': ch });
    return headers;
  }

  customInit(hd=this.customHeaders(), accepe='application/json', flag=1, body="") {
    let inits = { method: ((flag)? 'GET':'POST'), headers: hd, Accept: accepe, mode: 'no-cors', cache: 'default', redirect: 'follow', credentials: 'same-origin'};
    if( !flag && body && accepe == 'application/json' ) { inits['body'] = JSON.stringify(body);};
    if( !flag && body && accepe != 'application/json' ) { inits['body'] = body;};
    return inits;
  }

  static async apiRequest(u, f=1, inits=this.customInit()){
    const custominit = inits;
    const customRequest = new Request(u, custominit);

    let response = await fetch(customRequest);
    const reader = response.body.getReader();

    const contentLength = +response.headers.get('Content-Length');

    let receivedLength = 0;
    let chunks = [];
    while(true) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      receivedLength += value.length;
    }

    let chunksAll = new Uint8Array(receivedLength);
    let position = 0;
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
  }
  duplicateChildNodes(targetElement){
    const parent = document.createElement("div");
    NodeList.prototype.forEach = Array.prototype.forEach;
    const children = targetElement.childNodes;
    children.forEach((item)=>{
      let cln = item.cloneNode(true);
      parent.appendChild(cln);
    });
    return parent;
  }
  async xpathGet(ts){
    ts.xpath = [];
    ts.setAttribute("tagname",ts.tagName.toLowerCase());
    const loop = Array.prototype.slice.call(ts.attributes, 0);
    loop.forEach((k,v)=>{
      let xpath = "";
      switch(k.name){
        case "tagname":
        default:
          if(k.name in this.xpath_token) xpath = this.xpath_token[k.name][0].format(k.value);
      }
      if(xpath) ts.xpath.push(JSON.parse(`{"${k.name}":"${xpath}"}`));
    })
  }
  formatCheck(html){
    let key = [];
    const template = document.createElement('template');
    let _template  = template.cloneNode(false);
    let targetHTML = "";
    try{
      targetHTML = (html.children) ? `${html.children[0].outerHTML}`:`${html.outerHTML}`;
    } catch(e){
      // targetHTML = `${html.outerHTML}`;
    }
    for (const x in this.token_lists){
      this.token_lists[x].some((re,v) => {
        if(targetHTML.match(re)){
          key = targetHTML.match(re);
          let c = "";
          let ch = '';
          for(let k of key){
            const d = k.match(this.token_lists[x][1]);
            switch(x) {
              case "tokenCheck":
                if(!d[1].match(/\./i)){
                  try{
                      let r = (d[1]) ? this.function_change(`return ${d[1]}.value;`):"";
                      if(r=="none") r = "";
                      if(d[1] == "date" && d[1] == "eofpubdate") r = r.split("/").join("-");
                      if(r == "0-00-0") r = "yyyy-MM-dd";
                      html.innerHTML = `${html.children[0].outerHTML}`.replace(`${k}`, r);
                    }catch(err){
                      let r = "";
                      const day = new Day();
                      if(d[1] == "date" && d[1] == "eofpubdate") r = "yyyy-MM-dd";
                      html.innerHTML = `${html.children[0].outerHTML}`.replace(`${k}`, r);
                      this.logger({message:err,data:d[1],matchdata:d});
                    }
                }
                break;
              case "customTags":
                c = k.match(this.token_lists[x][2]);
                for(let g of this.#clone_element_list){
                  if(g.id == c[1]){ 
                    let m = `${html.children[0].outerHTML}`.match(RegExp(`(.+)${k}(.*)`));
                    html.innerHTML = `${html.children[0].outerHTML}`.replace(`${m[0]}`,g.innerHTML);
                  }
                }
                break;
              case "ifMatch":
                c = k.match(this.token_lists[x][2]);
                break;
              case "ifCheck":
                this.logger(`${k}`);
                html.innerHTML = `${html.children[0].outerHTML}`.replace(`${k}`,"");
                break;
              case 'checker':
                if(this.checkerList[`${d[2]}`]) break;
                c = targetHTML.match(this.token_lists[x][2]);
                this.checkerList[`${d[2]}`] = [];
                let j = 0;
                for(let n of c){
                  _template = template.cloneNode(false);
                  _template.innerHTML = n.trim();
                  if(_template.content.firstChild.localName == d[2] || _template.content.firstChild.type == d[2] ){
                    this.checkerList[`${d[2]}`][j] = _template;
                    j++;
                  };
                }
                this.logger(`${this.checkerList}, ${d[2]}`);
                break;
              case "forCheck":
                // debugger;
                let contents = [];
                let contents_list = [];
                c = k.match(this.token_lists[x][2]);
                _template = template.cloneNode(false);
                _template.innerHTML = k.trim();
                _template.id = d[6];
                let i = 0;
                for(let c of this.template_list){
                  if(c.id == _template.id){this.logger([i,c.id]);break;};
                  i++;
                };
                this.template_list.splice(i,1);
                this.template_list.push(_template);
                const h  = `${k}`.replace(`\*${c[2]}`,"");
                const dd = this.function_change(`let list=[]; const ${d[6]} = [${JSON.stringify(this[d[6]])}]; ${d[3]} (${d[4]} ${d[5]} in ${d[6]}) {list.push(${d[6]}[${d[5]}]);} return list;`)[0];
                const u  = c[2].match(/\s(\S+)\s/i);
                for(let n in this[d[6]]){
                  contents_list[n] = h;
                }
                this.logger([x,contents_list]);
                if(d[5] == u[1]){
                  for(let n in dd){
                    if(h.match(this.token_lists["contentsCheck"][0])){
                      const cc = h.match(this.token_lists["contentsCheck"][0]);
                      for(let v in cc){
                        const t = cc[v].match(/\.(\S+)\}/i);
                        contents_list[n] = `${contents_list[n]}`.replace(cc[v],dd[n][t[1]]);
                        contents_list[n] = `${contents_list[n]}`.replace(/\s{2,}/g," ");
                        this.logger([x,contents_list[n],v,t]);
                      }
                    } else {
                      console.error(k,this.Error_Page("Error."));
                      this.logger(`EEROR: ${k}`);
                    }
                  }
                }
                const parent = $(`//*[@id="${_template.id}"]`)[0];
                for(let ctn in contents_list){
                  if(typeof contents_list[ctn] == "object" && 'getDate' in contents_list[ctn]) break;
                  const child = template.cloneNode(false);
                  child.innerHTML = `${contents_list[ctn]}\n`.trim();
                  if(parent){
                    this.logger(JSON.stringify(child.content.children[0]));
                    parent.appendChild(child.content.children[0]);
                    if(`${parent.lastElementChild.outerHTML}`.trim() == k.trim()){parent.lastElementChild.remove(); };
                    if(`${parent.firstElementChild.outerHTML}`.trim() == k.trim()){parent.firstElementChild.remove(); };
                  } else {
                    k = k.trim();
                    this.logger([child.innerHTML,k]);
                    html.innerHTML = `${html.children[0].outerHTML}`.replace(k,`${child.innerHTML}\n${k}`);
                  }
                }
                const re = k.match(this.token_lists['forCheck'][1]);
                this.logger([k,k.match(this.token_lists['forCheck'][1])]);
                this.logger(re);
                if(!parent) html.innerHTML = `${html.children[0].outerHTML}`.replace(re[0],"");
                break;
              default:
                break;
            }
          }
          return true;
        }else{
        }
      });
    }
  }
  csv2vcf(csv){
    this.fc = new fileChecker(csv);
  }
  strIns(str, idx, val){
    const res = str.slice(0, idx) + val + str.slice(idx);
    return res;
  }
  strDel(str, idx){
    const res = str.slice(0, idx) + str.slice(idx + 1);
    return res;
  };
  c2v(){
    let vcfData = "";
    for(let x=0;x<this.hasher.length;x++){
      vcfData += this.fc.bodyMake(this.hasher[x]);
    }
    return vcfData;
  }
  static uint8(data){
    return String.fromCharCode(data);
  }
  static unit32(data){
    let bytes = "";
    bytes += String.fromCharCode((data >> 24) & 0xFF);
    bytes += String.fromCharCode((data >> 16) & 0xFF);
    bytes += String.fromCharCode((data >>  8) & 0xFF);
    bytes += String.fromCharCode((data      ) & 0xFF);
    return bytes;
  }
  static hexToBytes(data){
    let bytes = "";
    for (var c = 0; c < hex.length; c += 2){
      bytes += String.fromCharCode(parseInt(hex.substr(c, 2), 16));
     }
    return bytes;
  }
  createTable(elm, data){
    const _table_   = document.createElement('table'),
          _tr_      = document.createElement('tr'),
          _th_      = document.createElement('th'),
          _td_      = document.createElement('td');
    const buildHtmlTable = (arr) => {
         const table = _table_.cloneNode(false),
             columns = addAllColumnHeaders(arr, table);
         for (let i=0, maxi=arr.length; i < maxi; ++i) {
             const tr = _tr_.cloneNode(false);
             for (let j=0, maxj=columns.length; j < maxj ; ++j) {
                 const td = _td_.cloneNode(false),
                       cellValue = arr[i][columns[j]];
                 td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
                 tr.appendChild(td);
             }
             table.appendChild(tr);
         }
         return table;
     }
    const addAllColumnHeaders = (arr, table) => {
         let columnSet = [],
             tr = _tr_.cloneNode(false);
         for (let i=0, l=arr.length; i < l; i++) {
             for (let key in arr[i]) {
                 if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1) {
                     columnSet.push(key);
                     const th = _th_.cloneNode(false);
                     th.appendChild(document.createTextNode(key));
                     tr.appendChild(th);
                 }
             }
         }
         this.elm.firstElementChild ? this.elm.firstElementChild.remove():"";
         table.className = "table table-striped table-hover";
         table.appendChild(tr);
         return columnSet;
     }
     const run = () =>{
      const dataList = this.data.replace(/\r/g, '').split("\n");
      let csvTable = [];
      dataList.forEach(element => {csvTable.push(element.split(","))});
      for(let x=0;x<csvTable[0].length;x++){
        if(csvTable[0][x] == "") continue;
        if(csvTable[0][x] in this.j2e) csvTable[0][x] = this.j2e[`${csvTable[0][x]}`];
      }
      this.hasher = c2j.encode(this.data, { header : 1, columnName : csvTable[0]});
      this.elm.appendChild(buildHtmlTable(this.hasher));
     }
     this.elm = elm;
     this.data = data;
     run();
  }
  img_Insert(el, src){
    const selection = this.selection;
    const range = document.createRange();
    const offset = el.innerText.length;
    range.setStart(el.firstChild, offset);
    range.setEnd(el.firstChild, offset);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  template(el, json_data){
    this.resultElement = el.target;
    this.hasher        = JSON.parse(json_data);
    let arr                = [];
    for(const [key, value] of Object.entries(this.hasher)){
      arr.push(value);
    }
    return arr;
  }
  edit_selection(){
    this.selection = window.getSelection();
  }
  rex(s){let re = /%(\w+)%/;return s.match(/%(.+)%/)[0].replace(re, '$1');}
  xrex(s){
    let req = [];
    let re = /%(\S*)%/;
    if(s.match(/%\s%/)){
      s=s.replace(/%(\s)%/, '%;%');
      s=s.match(/(\S*)/)[0].replace(/(\S*)/,'$1');
    }
    if(s.match(/%(\S*)%/g)){
      const ss = s.match(/%(\S*)%/g);
      for(let x=0;x<ss.length;x++){
        let r = ss[x].match(/%(\S*)%/g)[0].replace(re, '$1');
        if(r.match(/%;%/g)){
          r=r.replace(/%;%/g, ',').split(',');
        }else{
          if(r.match(/%;(\S*):%/g)){
            r=r.replace(/%;(\S*):%/g, ',').split(',');
          }
        }
        req.push(r);
      }
    }else{
      req.push(s);
    }
    return req;
  }
  pack(tmp, data){
  let pack_data = "";
   switch (tmp) {
      case 'C':
        pack_data = BEAST.uint8(data);
        break;
      case 'N':
        pack_data = BEAST.uint32(data);
        break;
      case 'H*':
        pack_data = BEAST.hexToBytes(data);
        break;
   }
   return pack_data;
  }
  static format(arg){
    let rep_fn = undefined;
    if (typeof arg == "object") {
      rep_fn = function(m, k) { return arg[k]; }
    }
    else {
      let args = arguments;
      rep_fn = function(m, k) { return args[ parseInt(k) ]; }
    }
    return this.replace( /\{(\w+)\}/g, rep_fn );
  }
  loading_on(){
    const _div = document.createElement("div");
    const _label = document.createElement("h5");
    const _textarea = document.createElement("textarea");

    const modal_area       = _div.cloneNode(false),
          loading_area       = _div.cloneNode(false),
          modal_content    = _div.cloneNode(false),
          modal_body       = _div.cloneNode(false),
          group            = _div.cloneNode(false);

    loading_area.id  = "loading_area";
    modal_area.id    = "modal_area";
    modal_content.id = "modal_content";
    modal_body.id    = "modal_body";

    loading_area.classList.add("modal","show");
    modal_area.classList.add("modal-fullscreen","modal-dialog");
    modal_content.classList.add("modal-content","modal-footer");
    modal_body.classList.add("col","modal-body","d-flex");
    group.classList.add("input-group");

    loading_area.setAttribute("aria-labelledby","loading_label");
    loading_area.setAttribute("role","dialog");

    group.innerHTML = `<div class="d-flex align-items-center"><strong>ロード中...</strong><span id="load_data">${this.load_data}%</span><div class="spinner-border ms-auto" role="status" aria-hidden="true"></div></div>`;

    modal_body.appendChild(group);

    modal_content.appendChild(modal_body);
    modal_area.appendChild(modal_content);
    loading_area.appendChild(modal_area);

    this.bootstrapList.div.push(loading_area);
  }
  debug_mode_on(){
    if(this.#debug_mode){
      const _div = document.createElement("div");
      const _label = document.createElement("h5");
      const _textarea = document.createElement("textarea");
      const _button = document.createElement("button");

      const modal_area       = _div.cloneNode(false),
            debug_area       = _div.cloneNode(false),
            modal_content    = _div.cloneNode(false),
            modal_header     = _div.cloneNode(false),
            modal_footer     = _div.cloneNode(false),
            modal_body       = _div.cloneNode(false),
            group            = _div.cloneNode(false),
            label            = _label.cloneNode(false),
            debug_field      = _textarea.cloneNode(false),
            console_area     = _textarea.cloneNode(false),
            debug_run        = _button.cloneNode(false),
            debug_btn        = _button.cloneNode(false),
            close_btn        = _button.cloneNode(false);

      debug_area.id    = "debug_area";
      modal_area.id    = "modal_area";
      modal_content.id = "modal_content";
      modal_header.id  = "modal_header";
      modal_body.id    = "modal_body";
      modal_footer.id  = "modal_footer";
      label.id         = "debug_label";
      debug_field.id   = "debug_field";
      console_area.id  = "console_area";
      debug_run.id     = "test";
      close_btn.id     = "debug_close_btn";
      debug_btn.id     = "debug_on_btn";

      debug_area.classList.add("modal","show");
      modal_area.classList.add("modal-xl","modal-dialog");
      modal_content.classList.add("row","modal-content","modal-footer");
      modal_header.classList.add("col","text-start","modal-header");
      modal_body.classList.add("col","text-start","modal-body");
      modal_footer.classList.add("col","modal-footer");
      group.classList.add("input-group");
      label.classList.add("form-label");
      debug_field.classList.add("form-control","mb-3");
      console_area.classList.add("form-control");
      debug_run.classList.add("btn","btn-outline-secondary","mb-3");
      debug_btn.classList.add("btn","btn-outline-secondary","btn-sm","bg-white");
      close_btn.classList.add("btn-close");

      debug_run.type  = "button";
      debug_run.textContent = "デバッグ送信";

      close_btn.setAttribute("data-bs-dismiss","modal");
      close_btn.setAttribute("aria-label","Close");

      debug_btn.type        = "button";
      debug_btn.textContent = "DebugON";
      debug_btn.setAttribute("data-bs-target","debug_area");

      debug_area.setAttribute("tabindex","-1");
      debug_area.setAttribute("aria-labelledby","debug_label");
      debug_area.setAttribute("aria-hidden","false");
      debug_area.setAttribute("role","dialog");
      debug_area.setAttribute("aria-hidden", "true");


      debug_field.setAttribute("style","background-color:transparent;");
      console_area.setAttribute("style","background-color:transparent;");
      console_area.setAttribute("disabled","true");

      label.innerText = `デバッグモード`;

      modal_header.appendChild(label);
      modal_header.appendChild(close_btn);

      group.appendChild(debug_field);
      group.appendChild(debug_run);

      modal_body.appendChild(group);
      modal_body.appendChild(console_area);

      modal_content.appendChild(modal_header);
      modal_content.appendChild(modal_body);
      modal_area.appendChild(modal_content);
      debug_area.appendChild(modal_area);

      debug_run.addEventListener("click", async (e) =>{
        this.logger("Debug Run!!");
        e.srcElement.setAttribute("disabled","true");
        try{
          this.function_change(`${debug_field.value}`);
          console_area.value = this.logs.join("\n");
          this.alertMessage(`${debug_field.value}`,0,1000);
        }catch(e){
          this.alertMessage(`${e}`);
          console_area.value = console_area.value + `\n[${e}]`;
        }
        await sleep(1500);
        e.srcElement.removeAttribute("disabled");
      }, false);

      this.bootstrapList.div.push(debug_area);
      this.bootstrapList.button.push(debug_btn);

    }
  }
  /*---------------------------------------------------- alertMessage ---------------------------------------------------------------*/
  /** アラートメッセージを表示させる関数
   * alertMessage("Title", "Message", flag, delay)
   * @param  ({String},{Number},{Number}) - ex:) alertMessage("Message", flag, delay)
   * @return "undefined"
   */
  alertMessage(msg, f=3, delay=1500){
    let alertFlag = ["alert-primary","alert-secondary","alert-success","alert-danger","alert-warning","alert-info","alert-light","alert-dark"]
    let alertTag  = document.createElement("div");
    let btn = document.createElement("button");
    const _alertTag = alertTag.cloneNode(false);
    const close_btn = btn.cloneNode(false);
    close_btn.classList.add("btn-close");
    close_btn.setAttribute("data-bs-dismiss","alert");
    close_btn.setAttribute("aria-label","Close");
    close_btn.type = "button";
    let alertLen  = ($(".alert").length) ? `alert_${$(".alert").length}`:'alert_0';
    let tagMsg    = alertTag.cloneNode(false);
    tagMsg.classList.add('alert',`${alertFlag[f]}`,'alert-dismissible','fixed-top','fade','show',`${alertLen}`,'text-white');
    tagMsg.setAttribute("role","alert");
    tagMsg.setAttribute("data-delay",`${delay}`);
    tagMsg.setAttribute("style","z-index:1200;");
    tagMsg.innerText = `${msg}`;
    tagMsg.appendChild(close_btn);
    if((parseInt(bootstrap.Tooltip.VERSION)>4)){
      _alertTag.appendChild(tagMsg);
      document.body.appendChild(_alertTag);
      const alertNode = document.querySelector(`.${alertLen}`);
      const alert     = new bootstrap.Alert(alertNode);
      setTimeout(() => {alert.close()}, delay);
    }else{
      $(tagMsg).prependTo(_alertTag);
      $("."+alertLen).toast('show');
    }
  }
  run(){
    let content_template_list  = $("bst-template");
    let clone_element_list = [];
    if(content_template_list){
      for(let ctl of content_template_list){
        const template = document.createElement('template');

        ctl.id = ctl.outerHTML.match(this.token_lists["customTags"][1])[1];
        template.innerHTML = `${ctl.innerHTML}`.trim();
        template.id = ctl.id;
        clone_element_list.push(template);
        this.logger(ctl);
      }
      for(let x=clone_element_list.length-1;x>=0;x--){
        content_template_list[x].remove();
      }
      this.#clone_element_list = clone_element_list;
    }
    this.loading_status_create();
    this.progressbar_create();
    /* --------------------------------------------------------------------- */ 
    this.logger(`BEAST ${this.version} [JL]`);
    if($("#debug_mode")) this.#debug_mode = parseInt($("#debug_mode").value);
    if(this.#debug_mode) {
      this.logger(`console.log('%c Debug Mode! ON!!', 'background: #222; color: #bada55')`);
      this.debug_mode_on();
      for(let _area of this.bootstrapList.div){
        if(_area.id == "debug_area"){
          const debug_btn_area = $("nav")[0].firstElementChild;
          const debug_btn      = this.bootstrapList.button[0];
          debug_btn_area.appendChild(debug_btn);
          const _div = document.createElement("div");
          const debugNode = _div.cloneNode(false);
          debugNode.id    = "debugNode";
          _area.addEventListener('show.bs.modal', (event) => {
            console.dir(event);
          });
          $("main")[0].insertAdjacentHTML('afterend',`${_area.outerHTML}`);
          const debuger = new bootstrap.Modal(_area);
          debug_btn.addEventListener("click", (e)=>{
            debuger.show();
          }, false);
          this.logger(`console.log('%c Debuger, ON!!', 'background: #222; color: #bada55',debuger)`);
          break;
        };
      };
      document.beast  = this;
    };
  }
}