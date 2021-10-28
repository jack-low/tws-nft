'use strict'

export class version {
  #__VERSION__
  constructor(){ this.#__VERSION__ = '0.0.1-alpha'; }
  show(){return this.#__VERSION__;}
}
