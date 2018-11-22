import EmpatiElement from "./Lib/Element";
import { CustomElement, html } from "./Lib/Particles";
import { Execute, MetaManager, ViewManager } from "./Lib/Managers";
import { Event } from "./Lib/Particles/EventParticle";
import { QueryAll } from "./Lib/Particles/QSParticle";



class OarkonElement extends EmpatiElement {
  static Namespace = "oarkon"
}

const Layers = [
  ["https://png.pngtree.com/thumb_back/fw800/back_pic/00/04/04/855620cc867f90a.jpg", 1],
  ["https://vignette.wikia.nocookie.net/fantendo/images/5/5c/New_character.png/revision/latest?cb=20120428202358", 30],
  ["https://picsum.photos/1920/1080", 0]
];

type ILayer = {
  Src: string,
  Layer: number,
  X: number,
  Y: number
};

const Hx = window.innerWidth / 2;
const Hy = window.innerHeight / 2;

@CustomElement
class Main extends OarkonElement {


  @Event("mousemove")
  Paralax(Event: MouseEvent) {
    this.Images.forEach(Img => {
      Img.style.left = (Hx - (Event.x - Hx)*0.1 - Img.clientWidth / 2) + "px";
      console.log(Img.clientWidth);
      
      Img.style.top = (Hy - (Event.y - Hy)*0.1 - Img.clientHeight / 2) + "px";
    });

    this.ReRender();
  }


  @Event("mouseleave")
  ParallaxOut(Event:MouseEvent){
    this.Images.forEach(Img => {
      Img.style.left = (Hx - (Event.x - Hx)*0 - Img.clientWidth / 2) + "px";
      Img.style.top = (Hy - (Event.y - Hy)*0 - Img.clientHeight / 2) + "px";
    })
  }


  _Layers: Array<ILayer> = [];

  Background: string;

  set Layers(LA: Array<[string, number]>){
    LA.forEach(x => {
      if(x[1] == 0) this.Background = x[0];
      else this._Layers.push({
        Src: x[0],
        Layer: x[1],
        X: window.innerWidth / 2,
        Y: window.innerHeight / 2
      })
    })
  }

  Render() {
    return html`
      <style>
      :host{
        margin: 0 ;
        padding: 0 ;
        perspective: 100px;
        width : 100vw;
        height: 100vh;
        display: block;
        background-image: url(${this.Background});
      }  

      img{
        position: fixed;
        left: 0;
        top: 0;
      }
      
      </style> 
      ${this._Layers.map(x => html`
        <img src=${x.Src} .Data=${x}>
      `)}
    `;
  }

  @QueryAll("img") Images: (HTMLImageElement & {Data: ILayer})[];

  FirstRender(){
    super.FirstRender();
    this.Images.forEach(Img => {
      Img.style.transform = `translateZ(${Img.Data.Layer}px)`;
    });
  }

}

@Execute
class Body extends ViewManager {
  Render() {
    return html`
      <oarkon-main .Layers=${Layers}></oarkon-main>
    `;
  }
}

@Execute
class Meta extends MetaManager {
  Title = "FullScreen IMAGE!"
  Manifest = {
    description: "FullScreen!"
  };
  Render() {
    return html`
      ${super.Render()}
      <style>
      html, body {
        margin : 0;
      }
      </style>
      `;
  }
}