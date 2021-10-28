'use strict'

export class uuid {
  constructor(){}
  static v4(){for(var x="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split(""),t=0,o=x.length;t<o;t++)switch(x[t]){case"x":x[t]=Math.floor(16*Math.random()).toString(16);break;case"y":x[t]=(Math.floor(4*Math.random())+8).toString(16)}return x.join("");}
}

export class Base64 {
  constructor(){}
  static #base64list() {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  }
  static async base64Decode(text, charset) {
    return fetch(`data:text/plain;charset=${charset};base64,` + text).then(response => response.text());
  }
  static async base64DecodeAsBlob(text, type = "text/plain;charset=UTF-8") {
    return fetch(`data:${type};base64,` + text).then(response => response.blob());
  } 
  static async base64Encode(...parts) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const offset = reader.result.indexOf(",") + 1;
        resolve(reader.result.slice(offset));
      };
      reader.readAsDataURL(new Blob(parts));
    });
  }
  static encode(s){
    let t = '', p = -6, a = 0, i = 0, v = 0, c;
    while ( (i < s.length) || (p > -6) ) {
      if ( p < 0 ) {
        if ( i < s.length ) {
          c = s.charCodeAt(i++);
          v += 8;
        } else {
          c = 0;
        }
        a = ((a&255)<<8)|(c&255);
        p += 8;
      }
      t += Base64.#base64list().charAt( ( v > 0 )? (a>>p)&63 : 64 )
      p -= 6;
      v -= 6;
    }
    return t;
  }
  static decode(s){
    let t = '', p = -8, a = 0, c, d;
    for( let i = 0; i < s.length; i++ ) {
      if ( ( c = Base64.#base64list().indexOf(s.charAt(i)) ) < 0 )
        continue;
      a = (a<<6)|(c&63);
      if ( ( p += 6 ) >= 0 ) {
        d = (a>>p)&255;
        if ( c != 64 )
          t += String.fromCharCode(d);
        a &= 63;
        p -= 8;
      }
    }
    return t;
  }
}
// 


export class selectEdite {
  constructor(e){
    this.target = e.target;
  }
  static edite(selectOption){
    if(this.target.childNodes.length<=3){
      selectOption.forEach(element => ethistarget.insertAdjacentHTML('beforeend',`<option value="${element.value}">${element.text}</option>`));
    }
  }
}
// 
/*---------------------------------------------------- csv2Json ---------------------------------------------------------------*/
/** CSVをJSONに変換する関数
 * c2j(csvStr, { header : 1, columnName : ['id', 'name', 'age'] })
 * @param {data,header} data - csvData, { header : 1, columnName : ['id', 'name', 'age'] }
 * @returns {String} - JsonData
 */

export class c2j {
  constructor(){}
  static encode(csvStr, userOptions){
    if (typeof csvStr !== 'string') return null;
    let options = { header : 0, columnName : [], ignoreBlankLine : true };
    if (userOptions) {
        if (userOptions.header) options.header = userOptions.header;
        if (userOptions.columnName) options.columnName = userOptions.columnName;
    }
    let rows =  csvStr.split('\n')
    let json = [], line = [], row = '', data = {};
    let i, len, j, len2;
 
    for (i = 0, len = rows.length; i < len; i++) {
        if ((i + 1) <= options.header) continue;
        if (options.ignoreBlankLine && rows[i] === '') continue;
 
        line = rows[i].split(',');
 
        if (options.columnName.length > 0) {
            data = {};
            for (j = 0, len2 = options.columnName.length; j < len2; j++) {
                if (typeof line[j] !== 'undefined') {
                    row = line[j];
                    row = row.replace(/^"(.+)?"$/, '$1');
                } else {
                    row = null;
                }
                data[options.columnName[j]] = row;
            }
            json.push(data);
        } else {
            json.push(line);
        }
    }
    return json;
  }

}